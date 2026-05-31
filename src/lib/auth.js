/**
 * ============================================================
 * FILE: src/lib/auth.js
 * FUNGSI: Helper function untuk memverifikasi JWT Token.
 *
 * File ini menyediakan fungsi `verifyToken` yang digunakan oleh
 * semua Route Handler (API endpoint) yang membutuhkan proteksi
 * autentikasi.
 *
 * Alur kerja verifikasi:
 * 1. Mengambil header "Authorization" dari request.
 * 2. Memastikan format header adalah "Bearer <token>".
 * 3. Mengekstrak token JWT dari header.
 * 4. Memverifikasi token menggunakan Firebase Admin SDK.
 * 5. Jika valid, mengembalikan data pengguna (uid, email, dll).
 * 6. Jika tidak valid, melempar error.
 *
 * DIGUNAKAN OLEH: Semua API endpoint yang memerlukan autentikasi,
 *                  seperti src/app/api/data/route.js
 * ============================================================
 */

import { adminAuth } from "@/lib/firebase-admin";

/**
 * verifyToken - Memverifikasi JWT Token dari Authorization header.
 *
 * @param {Request} request - Objek Request dari Next.js Route Handler
 * @returns {Object} decodedToken - Data pengguna yang terverifikasi
 *   - uid: ID unik pengguna di Firebase
 *   - email: Alamat email pengguna
 *   - dll.
 * @throws {Error} Jika token tidak ada, format salah, atau tidak valid
 */
export async function verifyToken(request) {
  // Langkah 1: Ambil header Authorization dari request
  const authHeader = request.headers.get("Authorization");

  // Langkah 2: Periksa apakah header ada dan formatnya benar
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token tidak ditemukan. Sertakan header Authorization: Bearer <token>");
  }

  // Langkah 3: Ekstrak token (hapus prefix "Bearer ")
  const token = authHeader.split("Bearer ")[1];

  // Langkah 4: Verifikasi token menggunakan Firebase Admin SDK
  // Fungsi ini akan otomatis memeriksa:
  // - Apakah token ditandatangani oleh Firebase
  // - Apakah token belum expired (kadaluarsa)
  // - Apakah token diterbitkan untuk project yang benar
  const decodedToken = await adminAuth.verifyIdToken(token);

  // Langkah 5: Kembalikan data pengguna yang terverifikasi
  return decodedToken;
}
