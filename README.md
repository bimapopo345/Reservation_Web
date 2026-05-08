# Workspace+ Desk Reservation

Workspace+ adalah aplikasi reservasi meja kantor dengan 2 role utama:

- User: reservasi meja, shuffle table, check-in, check-out, history, profile, monitoring, employee list, floor map.
- Admin: dashboard, manage floor, manage desk, manage desk type, assign employee, manage user, monitoring, report analytic, export report.

Project ini memakai stack:

- Frontend: React, Vite, TypeScript, Tailwind CSS
- Backend: Express, TypeScript, Prisma ORM
- Database: MySQL/MariaDB
- Auth: JWT di httpOnly cookie, password hash dengan bcrypt

Default local URL:

- Frontend: http://localhost:5173
- Backend API: http://localhost:4000/api
- MySQL/MariaDB: 127.0.0.1:3306
- phpMyAdmin: http://localhost:8088

## Akun Demo

Data demo dibuat dari seed.

| Role | NIK | Password |
| --- | --- | --- |
| User | `456` | `demo` |
| Admin | `567` | `demo` |

User baru yang dibuat lewat admin akan memakai password default `demo`.

## Struktur Project

```text
.
+-- client/
|   +-- src/
|   |   +-- app/
|   |   |   +-- components/
|   |   |   +-- context/
|   |   |   +-- lib/
|   |   |   +-- pages/
|   |   |   +-- routes.tsx
|   |   |   +-- types.ts
|   |   +-- assets/
|   |   +-- styles/
|   |   +-- main.tsx
|   +-- index.html
|   +-- package.json
+-- server/
|   +-- prisma/
|   |   +-- migrations/
|   |   +-- schema.prisma
|   |   +-- seed.ts
|   +-- src/
|   |   +-- auth.ts
|   |   +-- env.ts
|   |   +-- index.ts
|   |   +-- prisma.ts
|   |   +-- types.ts
|   +-- .env
|   +-- package.json
+-- Dokumen pendukung.pdf
+-- package.json
+-- README.md
```

Root project memakai npm workspaces untuk menjalankan `client` dan `server`.

## Prasyarat

Install dulu:

- Node.js 20 atau lebih baru
- npm
- Docker Desktop
- Git

Pastikan Docker Desktop sudah hidup dan virtualization/WSL2 aktif.

## Setup Database Lokal

Project ini default mengarah ke MariaDB/MySQL lokal di port `3306`.

File env lokal yang ikut repo:

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/workspace_plus"
JWT_SECRET="workspace-plus-local-dev-secret"
CLIENT_ORIGIN="http://localhost:5173"
PORT=4000
```

Ini cocok untuk setup lokal dengan root tanpa password, baik memakai Docker MariaDB maupun MySQL dari XAMPP. Untuk production, ganti `DATABASE_URL` dan `JWT_SECRET`.

### Opsi 1: Docker MariaDB + phpMyAdmin

Pakai opsi ini kalau database dijalankan lewat Docker Desktop seperti setup di mesin development saat ini.

#### Pakai Container Yang Sudah Ada

Kalau container sudah pernah dibuat, cukup start:

```powershell
docker start mysql_server_lokal
docker start pma_lokal
```

Cek container:

```powershell
docker ps
```

Targetnya ada container seperti:

```text
mysql_server_lokal   mariadb:10.6        0.0.0.0:3306->3306/tcp
pma_lokal            phpmyadmin:latest   0.0.0.0:8088->80/tcp
```

Cek port:

```powershell
Test-NetConnection 127.0.0.1 -Port 3306
Test-NetConnection 127.0.0.1 -Port 8088
```

`TcpTestSucceeded` harus `True`.

#### Buat Container Baru

Kalau belum punya container MariaDB dan phpMyAdmin:

```powershell
docker network create workspace-net

docker run -d `
  --name mysql_server_lokal `
  --network workspace-net `
  -e MARIADB_ALLOW_EMPTY_ROOT_PASSWORD=yes `
  -e MARIADB_DATABASE=workspace_plus `
  -p 3306:3306 `
  mariadb:10.6

docker run -d `
  --name pma_lokal `
  --network workspace-net `
  -e PMA_HOST=mysql_server_lokal `
  -e PMA_PORT=3306 `
  -p 8088:80 `
  phpmyadmin:latest
```

Buka phpMyAdmin di:

```text
http://localhost:8088
```

Login phpMyAdmin:

- Server: `mysql_server_lokal`
- Username: `root`
- Password: kosong

### Buat Database Manual Jika Perlu

Kalau database belum ada:

```powershell
docker exec mysql_server_lokal mariadb -uroot -e "CREATE DATABASE IF NOT EXISTS workspace_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Opsi 2: XAMPP MySQL + phpMyAdmin

Pakai opsi ini kalau tidak memakai Docker dan database dijalankan dari XAMPP.

Langkahnya:

1. Buka XAMPP Control Panel.
2. Klik `Start` pada module `MySQL`.
3. Pastikan MySQL berjalan di port `3306`.
4. Buka phpMyAdmin XAMPP:

```text
http://localhost/phpmyadmin
```

Default XAMPP biasanya:

- Host: `127.0.0.1`
- Port: `3306`
- Username: `root`
- Password: kosong

Kalau masih default seperti itu, file `server/.env` yang ikut repo sudah cocok:

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/workspace_plus"
```

Buat database dari phpMyAdmin:

1. Buka `http://localhost/phpmyadmin`.
2. Klik `New`.
3. Isi database name: `workspace_plus`.
4. Pilih collation `utf8mb4_unicode_ci` jika tersedia.
5. Klik `Create`.

Atau buat lewat terminal jika command `mysql` XAMPP tersedia:

```powershell
mysql -uroot -e "CREATE DATABASE IF NOT EXISTS workspace_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

Setelah database dibuat, jalankan migration dan seed dari root project:

```powershell
npm run db:deploy
npm run db:seed
```

### Perbedaan Docker dan XAMPP

Secara aplikasi tidak ada perbedaan. Backend hanya membaca `DATABASE_URL`.

| Setup | MySQL Host | Port | phpMyAdmin |
| --- | --- | --- | --- |
| Docker | `127.0.0.1` | `3306` | `http://localhost:8088` |
| XAMPP | `127.0.0.1` | `3306` | `http://localhost/phpmyadmin` |

Selama database bisa diakses di `127.0.0.1:3306`, user `root`, password kosong, dan database bernama `workspace_plus`, project bisa jalan dengan env yang sama.

## Cara Clone dan Menjalankan Project

Clone repository:

```powershell
git clone <repo-url>
cd <nama-folder-repo>
```

Install dependency:

```powershell
npm install
```

Pastikan database `workspace_plus` tersedia di `127.0.0.1:3306`, lalu generate Prisma client:

```powershell
npm run db:generate
```

Jalankan migration:

```powershell
npm run db:deploy
```

Seed data demo:

```powershell
npm run db:seed
```

Jalankan frontend dan backend sekaligus:

```powershell
npm run dev
```

Buka:

```text
http://localhost:5173
```

## Script NPM

| Command | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan server Express dan client Vite sekaligus |
| `npm run dev:server` | Menjalankan backend saja di port `4000` |
| `npm run dev:client` | Menjalankan frontend saja di port `5173` |
| `npm run build` | Build server dan client |
| `npm run typecheck` | Typecheck server dan client |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:deploy` | Apply migration dari folder `server/prisma/migrations` |
| `npm run db:migrate` | Membuat migration baru saat development schema |
| `npm run db:seed` | Mengisi data demo |

## Route Frontend

| Route | Role | Halaman |
| --- | --- | --- |
| `/login` | Public | Login |
| `/` | User/Admin | Home dashboard |
| `/history` | User/Admin | Reservation history |
| `/profile` | User/Admin | Profile |
| `/shuffle` | User/Admin | Shuffle/reserve table |
| `/monitoring` | User/Admin | Desk monitoring |
| `/employee-list` | User/Admin | Employee list |
| `/floor-map` | User/Admin | Floor map |
| `/admin-home` | Admin | Admin dashboard |
| `/manage-floor` | Admin | CRUD floor |
| `/manage-desk` | Admin | CRUD desk |
| `/manage-desk-type` | Admin | CRUD desk type dan assignment |
| `/manage-user` | Admin | CRUD user |
| `/report-analytic` | Admin | Report analytic dan export |

Route admin dilindungi guard role. User biasa yang membuka route admin akan diarahkan sesuai role.

## API Backend

Base URL:

```text
http://localhost:4000/api
```

Auth memakai cookie `workspace_token` yang diset sebagai httpOnly cookie.

### Health

| Method | Endpoint | Auth | Fungsi |
| --- | --- | --- | --- |
| GET | `/health` | No | Cek backend hidup |

### Auth

| Method | Endpoint | Auth | Fungsi |
| --- | --- | --- | --- |
| POST | `/auth/login` | No | Login dengan `nik` dan `password` |
| GET | `/auth/me` | Yes | Ambil user login saat ini |
| POST | `/auth/logout` | Yes | Logout dan clear cookie |

Contoh body login:

```json
{
  "nik": "456",
  "password": "demo"
}
```

### Workspace Summary

| Method | Endpoint | Auth | Fungsi |
| --- | --- | --- | --- |
| GET | `/workspace/summary` | Yes | Summary floor, desk, seat, reserved, available |

Query opsional:

```text
?date=2026-05-08
```

### Floors

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| GET | `/floors` | Yes | User/Admin | List floor |
| POST | `/floors` | Yes | Admin | Tambah floor |
| PUT | `/floors/:id` | Yes | Admin | Update floor |
| DELETE | `/floors/:id` | Yes | Admin | Hapus floor |

Contoh body:

```json
{
  "name": "8th floor"
}
```

### Desks

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| GET | `/desks` | Yes | User/Admin | List desk |
| POST | `/desks` | Yes | Admin | Tambah desk |
| PUT | `/desks/:id` | Yes | Admin | Update desk |
| DELETE | `/desks/:id` | Yes | Admin | Hapus desk |

Contoh body:

```json
{
  "name": "8A",
  "capacity": 4,
  "floorId": 1,
  "deskTypeId": null
}
```

### Desk Types

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| GET | `/desk-types` | Yes | User/Admin | List desk type |
| POST | `/desk-types` | Yes | Admin | Tambah desk type |
| PUT | `/desk-types/:id` | Yes | Admin | Update desk type |
| DELETE | `/desk-types/:id` | Yes | Admin | Hapus desk type |
| POST | `/desk-types/:id/assignments` | Yes | Admin | Assign user ke desk type |
| DELETE | `/desk-types/:id/assignments/:userId` | Yes | Admin | Unassign user dari desk type |
| DELETE | `/desk-types/:id/assignments` | Yes | Admin | Clear semua assignment pada desk type |

Contoh body desk type:

```json
{
  "name": "MONITOR",
  "description": "Desk equipped with external monitors"
}
```

Contoh body assignment:

```json
{
  "userId": 5
}
```

### Users

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| GET | `/users` | Yes | Admin | List user |
| POST | `/users` | Yes | Admin | Tambah user |
| PUT | `/users/:id` | Yes | Admin | Update user |
| DELETE | `/users/:id` | Yes | Admin | Hapus user |

Contoh body:

```json
{
  "employeeCode": "2012099",
  "name": "Nama Karyawan",
  "email": "nama.karyawan@company.com",
  "position": "Software Engineer",
  "role": "user"
}
```

### Reservations

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| POST | `/reservations/shuffle` | Yes | User/Admin | Buat reservasi acak |
| GET | `/reservations/me` | Yes | User/Admin | Reservasi aktif milik user login |
| GET | `/reservations/history` | Yes | User/Admin | History reservasi milik user login |
| POST | `/reservations/:id/check-in` | Yes | Owner/Admin | Check-in reservasi |
| POST | `/reservations/:id/check-out` | Yes | Owner/Admin | Check-out reservasi |
| POST | `/reservations/:id/complete` | Yes | Owner/Admin | Selesaikan reservasi |

Contoh body shuffle:

```json
{
  "date": "2026-05-08"
}
```

Rule penting:

- User tidak boleh punya lebih dari 1 reservasi aktif pada tanggal yang sama.
- Jika duplicate, API akan mengembalikan status `409`.
- Status reservasi: `UPCOMING`, `ACTIVE`, `CHECKED_OUT`, `COMPLETED`, `CANCELLED`.

### Monitoring

| Method | Endpoint | Auth | Fungsi |
| --- | --- | --- | --- |
| GET | `/monitoring` | Yes | Data monitoring desk dan employee |

Query:

```text
?date=2026-05-08&floor=all&search=
```

`floor` bisa `all`, `6`, atau `7`.

### Reports

| Method | Endpoint | Auth | Role | Fungsi |
| --- | --- | --- | --- | --- |
| GET | `/reports/summary` | Yes | Admin | Ringkasan report |
| GET | `/reports/occupancy-trend` | Yes | Admin | Trend occupancy |
| GET | `/reports/usage-by-area` | Yes | Admin | Usage per desk/area |
| GET | `/reports/reservations` | Yes | Admin | Data reservasi report |
| GET | `/reports/export?section=reservations` | Yes | Admin | Export CSV |

Export saat ini menghasilkan CSV dengan filename seperti:

```text
reservations.csv
```

## Database Schema

Tabel utama:

- `users`
- `floors`
- `desk_types`
- `desk_type_assignments`
- `desks`
- `reservations`

Relasi utama:

- `Floor` punya banyak `Desk`
- `DeskType` bisa dipasang ke banyak `Desk`
- `DeskType` punya banyak assignment employee
- `User` punya banyak `Reservation`
- `Desk` punya banyak `Reservation`

File schema:

```text
server/prisma/schema.prisma
```

Migration:

```text
server/prisma/migrations
```

Seed:

```text
server/prisma/seed.ts
```

## Workflow Development

Untuk development harian:

```powershell
docker start mysql_server_lokal
docker start pma_lokal
npm run dev
```

Kalau ada perubahan schema Prisma:

```powershell
npm run db:migrate
npm run db:generate
```

Kalau clone baru atau deploy database dari migration yang sudah ada:

```powershell
npm run db:deploy
npm run db:seed
```

Untuk cek build sebelum push:

```powershell
npm run typecheck
npm run build
```

## Troubleshooting

### Docker Desktop: Virtualization support not detected

Cek BIOS virtualization dan WSL2. Jalankan PowerShell as Administrator:

```powershell
wsl --install --no-distribution
wsl --update
bcdedit /set hypervisorlaunchtype auto
shutdown /r /t 0
```

Setelah restart:

```powershell
wsl --status
docker version
```

### Port 3306 Belum Aktif

Cek:

```powershell
Test-NetConnection 127.0.0.1 -Port 3306
```

Kalau `TcpTestSucceeded` false:

```powershell
docker start mysql_server_lokal
docker ps
```

Kalau container belum ada, buat container seperti bagian "Setup Database Lokal".

### Prisma Tidak Bisa Connect Database

Pastikan `server/.env` berisi:

```env
DATABASE_URL="mysql://root@127.0.0.1:3306/workspace_plus"
```

Pastikan database sudah dibuat:

```powershell
docker exec mysql_server_lokal mariadb -uroot -e "SHOW DATABASES LIKE 'workspace_plus';"
```

Kalau belum muncul:

```powershell
docker exec mysql_server_lokal mariadb -uroot -e "CREATE DATABASE IF NOT EXISTS workspace_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Port 4000 atau 5173 Sudah Dipakai

Cek proses:

```powershell
Get-NetTCPConnection -LocalPort 4000,5173 -State Listen
```

Matikan proses jika memang proses lama project ini:

```powershell
Stop-Process -Id <PID> -Force
```

### Login Gagal

Jalankan ulang seed:

```powershell
npm run db:seed
```

Lalu login dengan:

- User: `456/demo`
- Admin: `567/demo`

## Catatan Environment

`server/.env` sengaja ikut repo untuk memudahkan local setup teman satu tim. Nilainya hanya untuk local development.

Untuk server production:

- Ganti `DATABASE_URL` ke database server production.
- Ganti `JWT_SECRET` dengan secret panjang dan random.
- Ganti `CLIENT_ORIGIN` ke domain frontend production.
- Jangan pakai root database tanpa password di production.
