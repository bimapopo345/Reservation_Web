export type Role = 'admin' | 'user';

export type AppUser = {
  id: number;
  nik: string;
  employeeCode?: string | null;
  name: string;
  email?: string | null;
  position?: string | null;
  department?: string | null;
  phone?: string | null;
  role: Role;
  initials: string;
};

export type WorkspaceSummary = {
  totalFloors: number;
  totalDesks: number;
  totalSeats: number;
  reservedSeats: number;
  availableSeats: number;
};

export type ReservationStatus = 'UPCOMING' | 'ACTIVE' | 'CHECKED_OUT' | 'COMPLETED' | 'CANCELLED';

export type Reservation = {
  id: number;
  date: string;
  status: ReservationStatus;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  createdAt: string;
  user: AppUser;
  desk: {
    id: number;
    name: string;
    capacity: number;
    floor: string;
    type: string;
  };
};

export type Floor = {
  id: number;
  name: string;
  desksCount: number;
};

export type DeskType = {
  id: number;
  name: string;
  description: string;
  employees: AppUser[];
};

export type Desk = {
  id: number;
  name: string;
  capacity: number;
  floorId: number;
  floor: string;
  deskTypeId?: number | null;
  type: string;
};

export type MonitoringDesk = {
  id: number;
  name: string;
  floor: string;
  type: string;
  occupied: number;
  capacity: number;
  status: 'Penuh' | 'Terisi' | 'Kosong';
  employees: Array<AppUser & { desk: string; status: 'Reserved' | 'Checked In' }>;
};
