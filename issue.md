# Implementasi Fitur Registrasi User

## Deskripsi

Implementasi API registrasi user baru menggunakan Elysia.js dan Drizzle ORM.

---

## 1. Database Schema

Buat tabel `users` di `src/db/schema.ts` :

| Kolom | Tipe | Keterangan |
|---|---|---|
| `id` | integer | auto increment, primary key |
| `name` | varchar(255) | not null |
| `email` | varchar(255) | not null, unique |
| `password` | varchar(255) | not null (hash bcrypt) |
| `created_at` | timestamp | default current_timestamp |

Setelah mengubah schema, jalankan:
```bash
bun run db:push
```

---

## 2. API Endpoint

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
    "name": "yogi",
    "email": "yogi@localhost",
    "password": "yogi"
}
```

**Response (Success):**
```json
{
    "data": "OK"
}
```

**Response (Error):**
```json
{
    "error": "Email sudah terdaftar"
}
```

---

## 3. Struktur Folder

```
src/
├── routes/
│   └── users-route.ts
├── services/
│   └── users-service.ts
└── db/
    └── schema.ts
```

---

## 4. Tahapan Implementasi

### Langkah 1 - Install Dependency
Install package `bcryptjs` untuk hashing password:
```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```

### Langkah 2 - Update Schema (`src/db/schema.ts`)
Tambahkan kolom `password`, `email` (unique), dan `createdAt` pada tabel `users`. Jalankan `bun run db:push` setelah selesai.

### Langkah 3 - Buat Service (`src/services/users-service.ts`)
Buat fungsi `registerUser(payload)` yang berisi:
1. Cek apakah email sudah ada di database → jika ada, throw `Error("Email sudah terdaftar")`
2. Hash password menggunakan `bcrypt.hash(password, 10)`
3. Insert data user baru (name, email, hashedPassword) ke database

### Langkah 4 - Buat Route (`src/routes/users-route.ts`)
Buat endpoint `POST /api/users` menggunakan Elysia.js:
- Validasi body request: `name`, `email`, `password` (semua string)
- Panggil `registerUser(body)` dalam `try-catch`
- Jika sukses → return `{ data: "OK" }`
- Jika error → set status 400, return `{ error: error.message }`

### Langkah 5 - Daftarkan Route (`src/index.ts`)
Import `usersRoute` dan mount ke app Elysia menggunakan `.use(usersRoute)`.

---

## 5. Testing & Verifikasi

Jalankan server terlebih dahulu:
```bash
bun run dev
```

### Test 1 - Registrasi Berhasil
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"yogi","email":"yogi@localhost","password":"yogi"}'
```
**Expected response:**
```json
{ "data": "OK" }
```

### Test 2 - Email Sudah Terdaftar
Kirim request yang sama sekali lagi.

**Expected response (HTTP 400):**
```json
{ "error": "Email sudah terdaftar" }
```

### Test 3 - Verifikasi Password Ter-hash
Cek database langsung, pastikan kolom `password` berisi hash bcrypt (dimulai dengan `$2b$`), bukan plain text.
