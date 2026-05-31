/**
 * ============================================================
 * FILE: src/app/api/auth/login/route.js
 * FUNGSI: API Endpoint untuk Login dan mendapatkan JWT Token.
 *
 * Endpoint ini memungkinkan pengguna melakukan login melalui
 * API (misalnya dari Postman) tanpa harus membuka halaman web.
 *
 * Metode: POST
 * URL: /api/auth/login
 * Body: { "email": "user@example.com", "password": "123456" }
 * Response: { "token": "eyJhbG...", "user": { ... } }
 *
 * Alur kerja:
 * 1. Menerima email dan password dari request body.
 * 2. Mengirim request ke Firebase Auth REST API untuk
 *    memverifikasi kredensial dan mendapatkan ID Token (JWT).
 * 3. Jika berhasil, mengembalikan token JWT beserta info user.
 * 4. Jika gagal, mengembalikan pesan error yang sesuai.
 *
 * CATATAN: Token yang dikembalikan adalah Firebase ID Token
 *          yang bisa digunakan sebagai JWT untuk mengakses
 *          endpoint API yang dilindungi.
 * ============================================================
 */

import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    // Langkah 1: Ambil email dan password dari request body
    const { email, password } = await request.json();

    // Validasi: Pastikan email dan password tidak kosong
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Langkah 2: Kirim request ke Firebase Auth REST API
    // Firebase menyediakan REST API untuk autentikasi yang bisa
    // digunakan dari sisi server tanpa Client SDK
    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const firebaseAuthUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`;

    const firebaseResponse = await fetch(firebaseAuthUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    });

    const firebaseData = await firebaseResponse.json();

    // Langkah 3: Periksa apakah login berhasil
    if (!firebaseResponse.ok) {
      // Terjemahkan error Firebase ke pesan Bahasa Indonesia
      let errorMessage = "Login gagal. Silakan coba lagi.";

      switch (firebaseData.error?.message) {
        case "EMAIL_NOT_FOUND":
          errorMessage = "Email tidak terdaftar.";
          break;
        case "INVALID_PASSWORD":
          errorMessage = "Password salah.";
          break;
        case "USER_DISABLED":
          errorMessage = "Akun ini telah dinonaktifkan.";
          break;
        case "INVALID_LOGIN_CREDENTIALS":
          errorMessage = "Email atau password salah.";
          break;
        case "TOO_MANY_ATTEMPTS_TRY_LATER":
          errorMessage = "Terlalu banyak percobaan. Coba lagi nanti.";
          break;
      }

      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 401 }
      );
    }

    // Langkah 4: Login berhasil, kembalikan token JWT dan info user
    return NextResponse.json(
      {
        success: true,
        message: "Login berhasil!",
        token: firebaseData.idToken, // JWT Token untuk Authorization header
        user: {
          uid: firebaseData.localId,
          email: firebaseData.email,
          expiresIn: firebaseData.expiresIn, // Token berlaku selama (detik)
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan internal server.",
      },
      { status: 500 }
    );
  }
}
