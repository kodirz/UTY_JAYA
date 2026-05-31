# 📮 Dokumentasi API — Tugas Backend
## Panduan Testing Endpoint dengan Postman

---

## Daftar Endpoint

| No | Metode | URL | Deskripsi | Auth? |
|----|--------|-----|-----------|-------|
| 1 | POST | `/api/auth/login` | Login & mendapatkan JWT Token | Tidak |
| 2 | GET | `/api/data` | Mengambil semua data dari Firestore | Ya (JWT) |
| 3 | POST | `/api/data` | Menambahkan data baru ke Firestore | Ya (JWT) |
| 4 | GET | `/api/test-db` | Verifikasi konektivitas database Firestore | Tidak |

---

## Langkah 1: Mendapatkan JWT Token (Login via API)

### Request
```
POST https://uty-jaya.vercel.app/api/auth/login
```

### Header
| Key | Value |
|-----|-------|
| Content-Type | application/json |

### Body (raw JSON)
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Login berhasil!",
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "uid": "abc123xyz",
    "email": "user@example.com",
    "expiresIn": "3600"
  }
}
```

> **PENTING:** Salin nilai `token` dari response ini. Token ini digunakan sebagai JWT untuk mengakses endpoint yang dilindungi.

### Response Gagal (401 Unauthorized)
```json
{
  "success": false,
  "error": "Email atau password salah."
}
```

---

## Langkah 2: Mengambil Data (GET /api/data)

### Request
```
GET https://uty-jaya.vercel.app/api/data
```

### Header
| Key | Value |
|-----|-------|
| Authorization | Bearer eyJhbGciOiJSUzI1NiIs... (paste token dari Langkah 1) |

### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Berhasil mengambil 2 data.",
  "user": "user@example.com",
  "data": [
    {
      "id": "abc123",
      "nama": "Tugas Matematika",
      "deskripsi": "Mengerjakan soal kalkulus bab 5",
      "createdBy": "uid_pengguna",
      "createdByEmail": "user@example.com",
      "createdAt": "2025-06-01T10:30:00.000Z"
    }
  ]
}
```

### Response Gagal (401 Unauthorized)
```json
{
  "success": false,
  "error": "Token tidak ditemukan. Sertakan header Authorization: Bearer <token>"
}
```

---

## Langkah 3: Menambah Data Baru (POST /api/data)

### Request
```
POST https://uty-jaya.vercel.app/api/data
```

### Header
| Key | Value |
|-----|-------|
| Content-Type | application/json |
| Authorization | Bearer eyJhbGciOiJSUzI1NiIs... (paste token dari Langkah 1) |

### Body (raw JSON)
```json
{
  "nama": "Tugas Matematika",
  "deskripsi": "Mengerjakan soal kalkulus bab 5"
}
```

### Response Sukses (201 Created)
```json
{
  "success": true,
  "message": "Data berhasil ditambahkan!",
  "id": "generatedFirestoreId123",
  "data": {
    "nama": "Tugas Matematika",
    "deskripsi": "Mengerjakan soal kalkulus bab 5",
    "createdBy": "uid_pengguna",
    "createdByEmail": "user@example.com",
    "createdAt": "2025-06-01T10:30:00.000Z"
  }
}
```

### Response Gagal — Field Kosong (400 Bad Request)
```json
{
  "success": false,
  "error": "Field 'nama' wajib diisi."
}
```

---

## Langkah 4: Verifikasi Koneksi Firestore (GET /api/test-db)

Endpoint ini bersifat publik dan digunakan untuk mematangkan apakah Firebase Admin SDK yang terhubung di server Vercel Anda sudah berhasil melakukan operasi baca/tulis ke Firestore Database.

### Request
```
GET https://uty-jaya.vercel.app/api/test-db
```

### Response Sukses (200 OK)
```json
{
  "success": true,
  "message": "Koneksi ke Firestore berhasil terjalin dan berfungsi dengan baik (Read/Write OK)!",
  "status": "CONNECTED",
  "verificationData": {
    "testedAt": "2026-06-01T15:53:29.854Z",
    "connected": true,
    "environment": "production"
  }
}
```

---

## Cara Testing di Postman (Langkah demi Langkah)

### A. Login dan Dapatkan Token

1. Buka **Postman** dan buat request baru.
2. Pilih metode **POST**.
3. Masukkan URL: `https://uty-jaya.vercel.app/api/auth/login`
4. Klik tab **Body** → pilih **raw** → pilih **JSON**.
5. Masukkan body JSON:
   ```json
   {
     "email": "[EMAIL_ADDRESS]",
     "password": "[PASSWORD]"
   }
   ```
6. Klik **Send**.
7. **Salin nilai `token`** dari response.

### B. Akses Endpoint yang Dilindungi
1. Buat request baru di Postman.
2. Pilih metode **GET** atau **POST** sesuai kebutuhan.
3. Masukkan URL: `https://uty-jaya.vercel.app/api/data`
4. Klik tab **Headers**.
5. Tambahkan header baru:
   - **Key**: `Authorization`
   - **Value**: `Bearer <paste_token_dari_langkah_A>`
6. *(Untuk POST)* Klik tab **Body** → **raw** → **JSON**, lalu masukkan data.
7. Klik **Send**.

## Catatan
| **Masa berlaku token** | Token JWT berlaku selama **1 jam** (3600 detik). Setelah expired, lakukan login ulang untuk mendapatkan token baru. |
| **Format Authorization** | `Bearer <spasi> <token>` — pastikan ada spasi antara kata "Bearer" dan token. |
| **URL setelah deploy** | Link API produksi saat ini adalah: `https://uty-jaya.vercel.app` |
| **Field wajib POST** | Field `nama` wajib diisi. Field `deskripsi` opsional. |
| **Data otomatis** | `createdBy`, `createdByEmail`, dan `createdAt` ditambahkan otomatis oleh server. |
