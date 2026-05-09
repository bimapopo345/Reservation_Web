import './types.js';
import bcrypt from 'bcryptjs';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import { Prisma, ReservationStatus, Role } from '@prisma/client';
import { z } from 'zod';
import { clearAuthCookie, requireAuth, requireRole, setAuthCookie, signToken } from './auth.js';
import { env } from './env.js';
import { prisma } from './prisma.js';

const activeReservationStatuses = [
  ReservationStatus.UPCOMING,
  ReservationStatus.ACTIVE,
  ReservationStatus.CHECKED_OUT,
];

const AUTO_CHECK_IN_HOUR = 8;
const AUTO_CHECK_IN_MINUTE = 15;
const AUTO_CHECK_OUT_HOUR = 17;
const AUTO_CHECK_OUT_MINUTE = 15;
const SAME_DAY_CHECK_IN_GRACE_MINUTES = 15;

const userSelect = {
  id: true,
  nik: true,
  employeeCode: true,
  name: true,
  email: true,
  position: true,
  department: true,
  phone: true,
  role: true,
} satisfies Prisma.UserSelect;

const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

function route(handler: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response) => {
    (async () => {
      await runReservationAutomation();
      await handler(req, res);
    })().catch((error) => {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: 'Invalid request', issues: error.flatten() });
        return;
      }

      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });
  };
}

function toDateOnly(value?: string) {
  if (value && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  }

  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toLocalDateInput(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function dateTimeForReservationDate(date: Date, hour: number, minute: number) {
  const [year, month, day] = toDateInput(date).split('-').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function sameDate(first: Date, second: Date) {
  return toLocalDateInput(first) === toLocalDateInput(second);
}

function checkInDueAt(reservation: { date: Date; createdAt: Date }) {
  const floorOpeningDue = dateTimeForReservationDate(reservation.date, AUTO_CHECK_IN_HOUR, AUTO_CHECK_IN_MINUTE);
  const sameDayGraceDue = new Date(reservation.createdAt.getTime() + SAME_DAY_CHECK_IN_GRACE_MINUTES * 60 * 1000);

  if (sameDate(reservation.createdAt, reservation.date) && sameDayGraceDue > floorOpeningDue) {
    return sameDayGraceDue;
  }

  return floorOpeningDue;
}

function checkOutDueAt(date: Date) {
  return dateTimeForReservationDate(date, AUTO_CHECK_OUT_HOUR, AUTO_CHECK_OUT_MINUTE);
}

let automationPromise: Promise<void> | null = null;
let lastAutomationRunAt = 0;

async function runReservationAutomation() {
  const nowMs = Date.now();
  if (automationPromise) return automationPromise;
  if (nowMs - lastAutomationRunAt < 30_000) return;

  lastAutomationRunAt = nowMs;
  automationPromise = applyAutomaticReservationTransitions()
    .catch((error) => {
      console.error('Reservation automation failed', error);
    })
    .finally(() => {
      automationPromise = null;
    });

  return automationPromise;
}

async function applyAutomaticReservationTransitions(now = new Date()) {
  const today = toDateOnly();
  const reservations = await prisma.reservation.findMany({
    where: {
      date: { lte: today },
      status: { in: [ReservationStatus.UPCOMING, ReservationStatus.ACTIVE] },
    },
    select: {
      id: true,
      date: true,
      status: true,
      createdAt: true,
      checkInAt: true,
    },
  });

  for (const reservation of reservations) {
    const checkInDue = checkInDueAt(reservation);
    const checkOutDue = checkOutDueAt(reservation.date);

    if (reservation.status === ReservationStatus.UPCOMING) {
      if (now >= checkOutDue) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: ReservationStatus.CHECKED_OUT,
            checkInAt: reservation.checkInAt ?? checkInDue,
            checkOutAt: checkOutDue,
          },
        });
        continue;
      }

      if (now >= checkInDue) {
        await prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: ReservationStatus.ACTIVE,
            checkInAt: reservation.checkInAt ?? checkInDue,
          },
        });
      }
      continue;
    }

    if (reservation.status === ReservationStatus.ACTIVE && now >= checkOutDue) {
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          status: ReservationStatus.CHECKED_OUT,
          checkInAt: reservation.checkInAt ?? checkInDue,
          checkOutAt: checkOutDue,
        },
      });
    }
  }
}

function toTime(date?: Date | null) {
  if (!date) return null;
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

async function getWorkspaceSummary(date = toDateOnly()) {
  const [floors, desks, reservations] = await Promise.all([
    prisma.floor.count(),
    prisma.desk.findMany({ select: { capacity: true } }),
    prisma.reservation.count({
      where: {
        date,
        status: { in: activeReservationStatuses },
      },
    }),
  ]);

  const totalSeats = desks.reduce((sum, desk) => sum + desk.capacity, 0);

  return {
    totalFloors: floors,
    totalDesks: desks.length,
    totalSeats,
    reservedSeats: reservations,
    availableSeats: Math.max(totalSeats - reservations, 0),
  };
}

function serializeUser(user: Prisma.UserGetPayload<{ select: typeof userSelect }>) {
  return {
    ...user,
    initials: initials(user.name),
    role: user.role.toLowerCase(),
  };
}

function serializeReservation(
  reservation: Prisma.ReservationGetPayload<{
    include: { desk: { include: { floor: true; deskType: true } }; user: { select: typeof userSelect } };
  }>,
) {
  return {
    id: reservation.id,
    date: toDateInput(reservation.date),
    status: reservation.status,
    checkInTime: toTime(reservation.checkInAt),
    checkOutTime: toTime(reservation.checkOutAt),
    createdAt: reservation.createdAt,
    user: serializeUser(reservation.user),
    desk: {
      id: reservation.desk.id,
      name: reservation.desk.name,
      capacity: reservation.desk.capacity,
      floor: reservation.desk.floor.name,
      type: reservation.desk.deskType?.name ?? '-',
    },
  };
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post(
  '/api/auth/login',
  route(async (req, res) => {
    const body = z.object({ nik: z.string().min(1), password: z.string().min(1) }).parse(req.body);
    const user = await prisma.user.findUnique({
      where: { nik: body.nik },
      select: { ...userSelect, passwordHash: true },
    });

    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      res.status(401).json({ message: 'Invalid NIK or password' });
      return;
    }

    const token = signToken({ id: user.id, role: user.role });
    setAuthCookie(res, token);
    const { passwordHash: _passwordHash, ...safeUser } = user;
    res.json({ user: serializeUser(safeUser) });
  }),
);

app.post('/api/auth/logout', (_req, res) => {
  clearAuthCookie(res);
  res.json({ ok: true });
});

app.get(
  '/api/auth/me',
  requireAuth,
  route(async (req, res) => {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: req.auth!.id },
      select: userSelect,
    });
    res.json({ user: serializeUser(user) });
  }),
);

app.get(
  '/api/workspace/summary',
  requireAuth,
  route(async (req, res) => {
    res.json(await getWorkspaceSummary(toDateOnly(String(req.query.date || ''))));
  }),
);

app.get(
  '/api/floors',
  requireAuth,
  route(async (_req, res) => {
    const floors = await prisma.floor.findMany({
      include: { _count: { select: { desks: true } } },
      orderBy: { name: 'asc' },
    });
    res.json(
      floors.map((floor) => ({
        id: floor.id,
        name: floor.name,
        desksCount: floor._count.desks,
      })),
    );
  }),
);

app.post(
  '/api/floors',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z.object({ name: z.string().min(1) }).parse(req.body);
    const floor = await prisma.floor.create({ data: { name: body.name } });
    res.status(201).json(floor);
  }),
);

app.put(
  '/api/floors/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const id = Number(req.params.id);
    const body = z.object({ name: z.string().min(1) }).parse(req.body);
    const floor = await prisma.floor.update({ where: { id }, data: { name: body.name } });
    res.json(floor);
  }),
);

app.delete(
  '/api/floors/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.floor.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

app.get(
  '/api/desk-types',
  requireAuth,
  route(async (_req, res) => {
    const deskTypes = await prisma.deskType.findMany({
      include: { assignments: { include: { user: { select: userSelect } } } },
      orderBy: { name: 'asc' },
    });
    res.json(
      deskTypes.map((type) => ({
        id: type.id,
        name: type.name,
        description: type.description,
        employees: type.assignments.map((assignment) => serializeUser(assignment.user)),
      })),
    );
  }),
);

app.post(
  '/api/desk-types',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z.object({ name: z.string().min(1), description: z.string().min(1) }).parse(req.body);
    const deskType = await prisma.deskType.create({ data: body });
    res.status(201).json(deskType);
  }),
);

app.put(
  '/api/desk-types/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z.object({ name: z.string().min(1), description: z.string().min(1) }).parse(req.body);
    const deskType = await prisma.deskType.update({
      where: { id: Number(req.params.id) },
      data: body,
    });
    res.json(deskType);
  }),
);

app.delete(
  '/api/desk-types/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.deskType.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

app.post(
  '/api/desk-types/:id/assignments',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const deskTypeId = Number(req.params.id);
    const body = z.object({ userId: z.number() }).parse(req.body);
    await prisma.deskTypeAssignment.upsert({
      where: { deskTypeId_userId: { deskTypeId, userId: body.userId } },
      create: { deskTypeId, userId: body.userId },
      update: {},
    });
    res.status(201).json({ ok: true });
  }),
);

app.delete(
  '/api/desk-types/:id/assignments/:userId',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.deskTypeAssignment.delete({
      where: {
        deskTypeId_userId: {
          deskTypeId: Number(req.params.id),
          userId: Number(req.params.userId),
        },
      },
    });
    res.status(204).end();
  }),
);

app.delete(
  '/api/desk-types/:id/assignments',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.deskTypeAssignment.deleteMany({ where: { deskTypeId: Number(req.params.id) } });
    res.status(204).end();
  }),
);

app.get(
  '/api/desks',
  requireAuth,
  route(async (_req, res) => {
    const desks = await prisma.desk.findMany({
      include: { floor: true, deskType: true },
      orderBy: [{ floor: { name: 'asc' } }, { name: 'asc' }],
    });
    res.json(
      desks.map((desk) => ({
        id: desk.id,
        name: desk.name,
        capacity: desk.capacity,
        floorId: desk.floorId,
        floor: desk.floor.name,
        deskTypeId: desk.deskTypeId,
        type: desk.deskType?.name ?? '-',
      })),
    );
  }),
);

app.post(
  '/api/desks',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z
      .object({
        name: z.string().min(1),
        capacity: z.number().int().min(0),
        floorId: z.number().int(),
        deskTypeId: z.number().int().nullable().optional(),
      })
      .parse(req.body);
    const desk = await prisma.desk.create({ data: body });
    res.status(201).json(desk);
  }),
);

app.put(
  '/api/desks/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z
      .object({
        name: z.string().min(1),
        capacity: z.number().int().min(0),
        floorId: z.number().int(),
        deskTypeId: z.number().int().nullable().optional(),
      })
      .parse(req.body);
    const desk = await prisma.desk.update({ where: { id: Number(req.params.id) }, data: body });
    res.json(desk);
  }),
);

app.delete(
  '/api/desks/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.desk.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

app.get(
  '/api/users',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (_req, res) => {
    const users = await prisma.user.findMany({ select: userSelect, orderBy: { name: 'asc' } });
    res.json(users.map(serializeUser));
  }),
);

app.post(
  '/api/users',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z
      .object({
        nik: z.string().min(1).optional(),
        employeeCode: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        position: z.string().min(1),
        role: z.enum(['admin', 'user']),
      })
      .parse(req.body);
    const passwordHash = await bcrypt.hash('demo', 10);
    const user = await prisma.user.create({
      data: {
        nik: body.nik || body.employeeCode,
        employeeCode: body.employeeCode,
        name: body.name,
        email: body.email,
        position: body.position,
        role: body.role === 'admin' ? Role.ADMIN : Role.USER,
        passwordHash,
        department: 'Digital Workspace',
      },
      select: userSelect,
    });
    res.status(201).json(serializeUser(user));
  }),
);

app.put(
  '/api/users/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const body = z
      .object({
        employeeCode: z.string().min(1),
        name: z.string().min(1),
        email: z.string().email(),
        position: z.string().min(1),
        role: z.enum(['admin', 'user']),
      })
      .parse(req.body);
    const user = await prisma.user.update({
      where: { id: Number(req.params.id) },
      data: {
        employeeCode: body.employeeCode,
        name: body.name,
        email: body.email,
        position: body.position,
        role: body.role === 'admin' ? Role.ADMIN : Role.USER,
      },
      select: userSelect,
    });
    res.json(serializeUser(user));
  }),
);

app.delete(
  '/api/users/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    await prisma.user.delete({ where: { id: Number(req.params.id) } });
    res.status(204).end();
  }),
);

app.post(
  '/api/reservations/shuffle',
  requireAuth,
  route(async (req, res) => {
    const body = z.object({ date: z.string().optional() }).parse(req.body);
    const date = toDateOnly(body.date);

    const existing = await prisma.reservation.findFirst({
      where: {
        userId: req.auth!.id,
        date,
        status: { in: activeReservationStatuses },
      },
    });
    if (existing) {
      res.status(409).json({ message: 'You already have a reservation.' });
      return;
    }

    const desks = await prisma.desk.findMany({
      where: { capacity: { gt: 0 } },
      include: {
        floor: true,
        deskType: true,
        reservations: {
          where: { date, status: { in: activeReservationStatuses } },
        },
      },
    });
    const available = desks.filter((desk) => desk.reservations.length < desk.capacity);
    if (available.length === 0) {
      res.status(409).json({ message: 'No desks are available for the selected date.' });
      return;
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    const reservation = await prisma.reservation.create({
      data: {
        userId: req.auth!.id,
        deskId: selected.id,
        date,
        status: ReservationStatus.UPCOMING,
      },
      include: {
        user: { select: userSelect },
        desk: { include: { floor: true, deskType: true } },
      },
    });

    res.status(201).json(serializeReservation(reservation));
  }),
);

app.get(
  '/api/reservations/me',
  requireAuth,
  route(async (req, res) => {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: req.auth!.id,
        status: { in: activeReservationStatuses },
      },
      include: {
        user: { select: userSelect },
        desk: { include: { floor: true, deskType: true } },
      },
      orderBy: [{ date: 'asc' }, { createdAt: 'desc' }],
    });
    res.json(reservations.map(serializeReservation));
  }),
);

app.get(
  '/api/reservations/history',
  requireAuth,
  route(async (req, res) => {
    const reservations = await prisma.reservation.findMany({
      where: { userId: req.auth!.id },
      include: {
        user: { select: userSelect },
        desk: { include: { floor: true, deskType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reservations.map(serializeReservation));
  }),
);

async function findWritableReservation(req: Request) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: Number(req.params.id) },
  });
  if (!reservation) return null;
  if (req.auth!.role !== Role.ADMIN && reservation.userId !== req.auth!.id) return null;
  return reservation;
}

app.post(
  '/api/reservations/:id/check-in',
  requireAuth,
  route(async (req, res) => {
    const reservation = await findWritableReservation(req);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.ACTIVE, checkInAt: new Date() },
      include: { user: { select: userSelect }, desk: { include: { floor: true, deskType: true } } },
    });
    res.json(serializeReservation(updated));
  }),
);

app.post(
  '/api/reservations/:id/check-out',
  requireAuth,
  route(async (req, res) => {
    const reservation = await findWritableReservation(req);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.CHECKED_OUT, checkOutAt: new Date() },
      include: { user: { select: userSelect }, desk: { include: { floor: true, deskType: true } } },
    });
    res.json(serializeReservation(updated));
  }),
);

app.post(
  '/api/reservations/:id/complete',
  requireAuth,
  route(async (req, res) => {
    const reservation = await findWritableReservation(req);
    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }
    const updated = await prisma.reservation.update({
      where: { id: reservation.id },
      data: { status: ReservationStatus.COMPLETED },
      include: { user: { select: userSelect }, desk: { include: { floor: true, deskType: true } } },
    });
    res.json(serializeReservation(updated));
  }),
);

app.get(
  '/api/monitoring',
  requireAuth,
  route(async (req, res) => {
    const date = toDateOnly(String(req.query.date || ''));
    const floor = String(req.query.floor || 'all');
    const search = String(req.query.search || '').trim().toLowerCase();
    const deskWhere = floor === 'all' ? {} : { name: { startsWith: floor } };
    const desks = await prisma.desk.findMany({
      where: deskWhere,
      include: {
        floor: true,
        deskType: true,
        reservations: {
          where: { date, status: { in: activeReservationStatuses } },
          include: { user: { select: userSelect } },
        },
      },
      orderBy: [{ floor: { name: 'asc' } }, { name: 'asc' }],
    });

    const deskPayload = desks.map((desk) => {
      const occupied = desk.reservations.length;
      return {
        id: desk.id,
        name: desk.name,
        floor: desk.floor.name,
        type: desk.deskType?.name ?? '-',
        occupied,
        capacity: desk.capacity,
        status: occupied >= desk.capacity && desk.capacity > 0 ? 'Penuh' : occupied > 0 ? 'Terisi' : 'Kosong',
        employees: desk.reservations.map((reservation) => ({
          ...serializeUser(reservation.user),
          desk: desk.name,
          status: reservation.status === ReservationStatus.ACTIVE ? 'Checked In' : 'Reserved',
        })),
      };
    });

    const employees = deskPayload.flatMap((desk) => desk.employees);
    const filteredEmployees = search
      ? employees.filter(
          (employee) =>
            employee.name.toLowerCase().includes(search) ||
            employee.employeeCode?.toLowerCase().includes(search) ||
            employee.email?.toLowerCase().includes(search),
        )
      : [];

    res.json({
      date: toDateInput(date),
      desks: deskPayload,
      employees: filteredEmployees,
      summary: {
        totalEmployees: employees.length,
        totalDesks: deskPayload.length,
      },
    });
  }),
);

app.get(
  '/api/reports/summary',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (_req, res) => {
    res.json(await getWorkspaceSummary());
  }),
);

app.get(
  '/api/reports/occupancy-trend',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (_req, res) => {
    const reservations = await prisma.reservation.groupBy({
      by: ['date'],
      _count: true,
      orderBy: { date: 'asc' },
      take: 20,
    });
    res.json(reservations.map((item) => ({ date: toDateInput(item.date), total: item._count })));
  }),
);

app.get(
  '/api/reports/usage-by-area',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (_req, res) => {
    const today = toDateOnly();
    const desks = await prisma.desk.findMany({
      include: {
        reservations: { where: { date: today, status: { in: activeReservationStatuses } } },
      },
      orderBy: { name: 'asc' },
    });
    res.json(
      desks.map((desk) => ({
        desk: desk.name,
        reserved: desk.reservations.length,
        capacity: desk.capacity,
      })),
    );
  }),
);

app.get(
  '/api/reports/reservations',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (_req, res) => {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: { select: userSelect },
        desk: { include: { floor: true, deskType: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
    res.json(reservations.map(serializeReservation));
  }),
);

app.get(
  '/api/reports/export',
  requireAuth,
  requireRole(Role.ADMIN),
  route(async (req, res) => {
    const section = String(req.query.section || 'reservations');
    const reservations = await prisma.reservation.findMany({
      include: { user: { select: userSelect }, desk: { include: { floor: true, deskType: true } } },
      orderBy: { createdAt: 'desc' },
    });
    const rows = [
      ['desk', 'date', 'employee_code', 'employee_name', 'status'],
      ...reservations.map((reservation) => [
        reservation.desk.name,
        toDateInput(reservation.date),
        reservation.user.employeeCode || reservation.user.nik,
        reservation.user.name,
        reservation.status,
      ]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${section}.csv"`);
    res.send(csv);
  }),
);

app.listen(env.port, () => {
  console.log(`Workspace+ API listening on http://localhost:${env.port}`);
});

const reservationAutomationTimer = setInterval(() => {
  runReservationAutomation();
}, 60_000);

reservationAutomationTimer.unref();
