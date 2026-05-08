import { PrismaClient, ReservationStatus, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const deskTypes = [
  { name: 'MONITOR', description: 'Desk equipped with external monitors for enhanced productivity' },
  { name: 'TELP.CORCOM', description: 'Dedicated desk with telephone for corporate communications' },
  { name: 'STANDING_DESK', description: 'Adjustable height desk for standing/sitting work positions' },
  { name: 'PC DESIGN_DESK', description: 'High-performance PC workstation for design and creative work' },
];

const desks = [
  { name: '6A', floor: '6th floor', type: null, capacity: 4 },
  { name: '6B', floor: '6th floor', type: null, capacity: 4 },
  { name: '6B-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  { name: '6C', floor: '6th floor', type: null, capacity: 5 },
  { name: '6C-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  { name: '6D', floor: '6th floor', type: null, capacity: 5 },
  { name: '6D-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  { name: '6E', floor: '6th floor', type: null, capacity: 6 },
  { name: '6F', floor: '6th floor', type: null, capacity: 4 },
  { name: '6F-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  { name: '6G', floor: '6th floor', type: null, capacity: 4 },
  { name: '6G-Monitor', floor: '6th floor', type: 'MONITOR', capacity: 1 },
  { name: '7I-PC Design', floor: '7th floor', type: 'PC DESIGN_DESK', capacity: 2 },
  { name: '7J', floor: '7th floor', type: null, capacity: 4 },
  { name: '7J-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7K', floor: '7th floor', type: null, capacity: 3 },
  { name: '7K-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7L', floor: '7th floor', type: null, capacity: 5 },
  { name: '7L-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7M', floor: '7th floor', type: null, capacity: 4 },
  { name: '7M-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7N', floor: '7th floor', type: null, capacity: 2 },
  { name: '7N-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7O', floor: '7th floor', type: null, capacity: 4 },
  { name: '7O-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7P', floor: '7th floor', type: null, capacity: 7 },
  { name: '7P-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7Q', floor: '7th floor', type: null, capacity: 3 },
  { name: '7R', floor: '7th floor', type: null, capacity: 6 },
  { name: '7R-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
  { name: '7S', floor: '7th floor', type: null, capacity: 4 },
  { name: '7T', floor: '7th floor', type: null, capacity: 4 },
  { name: '7U', floor: '7th floor', type: null, capacity: 4 },
  { name: '7V', floor: '7th floor', type: null, capacity: 4 },
  { name: '7V-Monitor', floor: '7th floor', type: 'MONITOR', capacity: 1 },
];

const employees = [
  { nik: '456', employeeCode: '04148', name: 'Fauzi Ramdani', email: 'fauzi.ramdani@company.com', position: 'Software Engineer (Non-Financial) Sr Staff', role: Role.USER },
  { nik: '567', employeeCode: '00001', name: 'Fauzi Ramdani Admin', email: 'admin@company.com', position: 'System Administrator', role: Role.ADMIN },
  { nik: '2012071', employeeCode: '2012071', name: 'Aisyah Ratna Kinanti', email: 'aisyah.kinanti@company.com', position: 'Business Analyst', role: Role.USER },
  { nik: '2012072', employeeCode: '2012072', name: 'Fariz Ahmad Hidayat', email: 'fariz.hidayat@company.com', position: 'Backend Developer', role: Role.USER },
  { nik: '2012073', employeeCode: '2012073', name: 'Nabila Putri Maharani', email: 'nabila.maharani@company.com', position: 'UI/UX Designer', role: Role.USER },
  { nik: '2012074', employeeCode: '2012074', name: 'Rendra Kurniawan', email: 'rendra.kurniawan@company.com', position: 'QA Engineer', role: Role.USER },
  { nik: '2012075', employeeCode: '2012075', name: 'Dinda Safira', email: 'dinda.safira@company.com', position: 'Product Owner', role: Role.USER },
  { nik: '2012076', employeeCode: '2012076', name: 'Arief Wicaksono', email: 'arief.wicaksono@company.com', position: 'Software Engineer', role: Role.USER },
  { nik: '2012077', employeeCode: '2012077', name: 'Zahra Amelia', email: 'zahra.amelia@company.com', position: 'Data Analyst', role: Role.USER },
  { nik: '2012078', employeeCode: '2012078', name: 'Bima Sakti Pratama', email: 'bima.pratama@company.com', position: 'DevOps Engineer', role: Role.USER },
  { nik: '2012079', employeeCode: '2012079', name: 'Siti Nurhaliza', email: 'siti.nurhaliza@company.com', position: 'Support Specialist', role: Role.USER },
  { nik: '2012080', employeeCode: '2012080', name: 'Rizky Fauzan', email: 'rizky.fauzan@company.com', position: 'Frontend Developer', role: Role.USER },
  { nik: '2012081', employeeCode: '2012081', name: 'Laila Nur Azizah', email: 'laila.azizah@company.com', position: 'Project Manager', role: Role.USER },
  { nik: '2012082', employeeCode: '2012082', name: 'Hendra Gunawan', email: 'hendra.gunawan@company.com', position: 'Security Engineer', role: Role.USER },
  { nik: '2012083', employeeCode: '2012083', name: 'Putri Ayu Lestari', email: 'putri.lestari@company.com', position: 'Scrum Master', role: Role.USER },
  { nik: '2012084', employeeCode: '2012084', name: 'Adi Nugroho', email: 'adi.nugroho@company.com', position: 'Mobile Developer', role: Role.USER },
  { nik: '2012085', employeeCode: '2012085', name: 'Fitri Handayani', email: 'fitri.handayani@company.com', position: 'Technical Writer', role: Role.USER },
  { nik: '2012091', employeeCode: '2012091', name: 'Yoga Pratama', email: 'yoga.pratama@company.com', position: 'Software Engineer', role: Role.USER },
  { nik: '2012092', employeeCode: '2012092', name: 'Laila Maharani', email: 'laila.maharani@company.com', position: 'Business Analyst', role: Role.USER },
  { nik: '2012093', employeeCode: '2012093', name: 'Arif Rahman', email: 'arif.rahman@company.com', position: 'Data Engineer', role: Role.USER },
  { nik: '2012094', employeeCode: '2012094', name: 'Cahya Nugraha', email: 'cahya.nugraha@company.com', position: 'QA Engineer', role: Role.USER },
  { nik: '2012095', employeeCode: '2012095', name: 'Vina Anggraini', email: 'vina.anggraini@company.com', position: 'UX Researcher', role: Role.USER },
  { nik: '2012096', employeeCode: '2012096', name: 'Irfan Hakim', email: 'irfan.hakim@company.com', position: 'Backend Developer', role: Role.USER },
  { nik: '2012097', employeeCode: '2012097', name: 'Ridwan Kamil', email: 'ridwan.kamil@company.com', position: 'Product Manager', role: Role.USER },
  { nik: '2012098', employeeCode: '2012098', name: 'Kartika Putri', email: 'kartika.putri@company.com', position: 'Frontend Developer', role: Role.USER },
  { nik: '2012099', employeeCode: '2012099', name: 'Gilang Ramadhan', email: 'gilang.ramadhan@company.com', position: 'DevOps Engineer', role: Role.USER },
  { nik: '2012100', employeeCode: '2012100', name: 'Kevin Julio', email: 'kevin.julio@company.com', position: 'Designer', role: Role.USER },
];

function toDateOnly(date = new Date()) {
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
}

async function main() {
  const passwordHash = await bcrypt.hash('demo', 10);
  const floorMap = new Map<string, number>();
  const deskTypeMap = new Map<string, number>();
  const userMap = new Map<string, number>();
  const deskMap = new Map<string, number>();

  for (const floor of ['6th floor', '7th floor']) {
    const record = await prisma.floor.upsert({
      where: { name: floor },
      create: { name: floor },
      update: { name: floor },
    });
    floorMap.set(floor, record.id);
  }

  for (const type of deskTypes) {
    const record = await prisma.deskType.upsert({
      where: { name: type.name },
      create: type,
      update: { description: type.description },
    });
    deskTypeMap.set(type.name, record.id);
  }

  for (const employee of employees) {
    const record = await prisma.user.upsert({
      where: { nik: employee.nik },
      create: { ...employee, passwordHash, department: 'Digital Workspace' },
      update: {
        employeeCode: employee.employeeCode,
        name: employee.name,
        email: employee.email,
        position: employee.position,
        role: employee.role,
        passwordHash,
        department: 'Digital Workspace',
      },
    });
    userMap.set(employee.nik, record.id);
  }

  for (const desk of desks) {
    const floorId = floorMap.get(desk.floor);
    if (!floorId) throw new Error(`Missing floor ${desk.floor}`);
    const deskTypeId = desk.type ? deskTypeMap.get(desk.type) : null;
    const record = await prisma.desk.upsert({
      where: { name: desk.name },
      create: {
        name: desk.name,
        capacity: desk.capacity,
        floorId,
        deskTypeId: deskTypeId ?? undefined,
      },
      update: {
        capacity: desk.capacity,
        floorId,
        deskTypeId: deskTypeId ?? null,
      },
    });
    deskMap.set(desk.name, record.id);
  }

  const monitorId = deskTypeMap.get('MONITOR');
  if (monitorId) {
    for (const nik of ['2012073', '2012079', '2012085']) {
      const userId = userMap.get(nik);
      if (userId) {
        await prisma.deskTypeAssignment.upsert({
          where: { deskTypeId_userId: { deskTypeId: monitorId, userId } },
          create: { deskTypeId: monitorId, userId },
          update: {},
        });
      }
    }
  }

  const today = toDateOnly();
  const reservationSeeds = [
    ['2012071', '6A', ReservationStatus.UPCOMING],
    ['2012072', '6A', ReservationStatus.ACTIVE],
    ['2012073', '6A', ReservationStatus.UPCOMING],
    ['2012074', '6A', ReservationStatus.ACTIVE],
    ['2012075', '6B', ReservationStatus.UPCOMING],
    ['2012076', '6B', ReservationStatus.ACTIVE],
    ['2012077', '6C', ReservationStatus.UPCOMING],
    ['2012078', '6C', ReservationStatus.ACTIVE],
    ['2012079', '6B-Monitor', ReservationStatus.ACTIVE],
    ['2012080', '6D', ReservationStatus.UPCOMING],
    ['2012081', '6D', ReservationStatus.ACTIVE],
    ['2012082', '6E', ReservationStatus.UPCOMING],
    ['2012083', '6E', ReservationStatus.ACTIVE],
    ['2012091', '7J', ReservationStatus.ACTIVE],
    ['2012092', '7J', ReservationStatus.UPCOMING],
    ['2012093', '7K', ReservationStatus.UPCOMING],
    ['2012094', '7L', ReservationStatus.ACTIVE],
    ['2012095', '7L', ReservationStatus.UPCOMING],
    ['2012096', '7M', ReservationStatus.ACTIVE],
    ['2012097', '7M', ReservationStatus.UPCOMING],
    ['2012098', '7O', ReservationStatus.ACTIVE],
    ['2012099', '7N', ReservationStatus.UPCOMING],
  ] as const;

  await prisma.reservation.deleteMany({ where: { date: today } });
  for (const [nik, deskName, status] of reservationSeeds) {
    const userId = userMap.get(nik);
    const deskId = deskMap.get(deskName);
    if (!userId || !deskId) continue;
    await prisma.reservation.create({
      data: {
        userId,
        deskId,
        date: today,
        status,
        checkInAt: status === ReservationStatus.ACTIVE ? new Date() : null,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed');
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
