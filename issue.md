# Implementasi Fitur Registrasi User

**Deskripsi Tugas**:
Membuat fitur registrasi user baru dengan menambahkan tabel `users` di database, serta membuat API endpoint untuk pendaftaran user menggunakan framework Elysia.js dan Drizzle ORM.

---

## 1. Persiapan Dependency
Pastikan package untuk hashing password sudah terinstal. Karena Anda akan melakukan hash password, silakan install `bcryptjs` (dan type-nya) jika belum tersedia:
```bash
bun add bcryptjs
bun add -d @types/bcryptjs
```

---

## 2. Definisi Schema Database (Drizzle ORM)
**File Target:** `src/db/schema.ts`

Tambahkan definisi tabel `users` dengan spesifikasi berikut:
- `id`: integer, primary key, auto increment
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (akan menyimpan hash bcrypt)
- `created_at`: timestamp, default `current_timestamp`

**Langkah:**
1. Gunakan method dari Drizzle (`int`, `varchar`, `timestamp`, `mysqlTable`) untuk mendefinisikan tabel.
2. Export schema tabel `users`.
3. Jalankan perintah push untuk mengaplikasikan perubahan ini ke database (misal: `bun run db:push`).

---

## 3. Pembuatan Logic Service
**File Target:** `src/services/users-service.ts`

Buat file baru ini untuk memisahkan logic bisnis dari routing.

**Langkah:**
1. Import instance database `db` dari `src/db/index.ts` dan schema tabel `users`.
2. Buat sebuah fungsi asynchronous, misalnya `registerUser(payload)`.
3. Di dalam fungsi tersebut:
   - Lakukan query ke database untuk mencari user dengan email yang sama (`payload.email`).
   - Jika email sudah ada, throw error spesifik atau return object error (misal pesan: `"Email sudah terdaftar"`).
   - Jika email belum ada, lakukan proses *hashing* pada password menggunakan `bcryptjs` (misal dengan `bcrypt.hash(password, 10)`).
   - Simpan data user baru (name, email, hashed password) ke tabel `users`.
   - Return penanda sukses.

---

## 4. Pembuatan Endpoint / Route (Elysia.js)
**File Target:** `src/routes/users-route.ts`

Buat file routing untuk menangani HTTP Request dari user.

**Langkah:**
1. Import `Elysia` dari `elysia`.
2. Import fungsi service yang telah dibuat di `users-service.ts`.
3. Buat instance plugin Elysia baru untuk route ini, misalnya `const usersRoute = new Elysia()`.
4. Definisikan endpoint `POST /api/users`.
5. Di dalam handler route tersebut:
   - Ambil `name`, `email`, dan `password` dari `body`.
   - Panggil fungsi service `registerUser` menggunakan block `try-catch`.
   - Jika ada error (Email sudah terdaftar), kembalikan response JSON `{"error": "Email sudah terdaftar"}` dengan HTTP Status Code 400 (Bad Request).
   - Jika sukses, kembalikan response JSON `{"data": "OK"}` dengan HTTP Status Code 201 (Created) atau 200 (OK).

---

## 5. Mendaftarkan Route ke Aplikasi Utama
**File Target:** `src/index.ts`

**Langkah:**
1. Import `usersRoute` dari `src/routes/users-route.ts`.
2. Tambahkan route tersebut ke instance utama aplikasi Elysia dengan method `.use()`.
   ```typescript
   app.use(usersRoute);
   ```

---

## Kriteria Penerimaan (Acceptance Criteria)
1. Kolom password di database **wajib** berupa hash acak, bukan plain text.
2. Saat mencoba register dengan email yang sama sebanyak dua kali, API **harus** mengembalikan response `{"error": "Email sudah terdaftar"}`.
3. Struktur folder `/routes` dan `/services` diimplementasikan dengan benar.
