/**
 * ============================================================
 * FILE: src/lib/firebase.js
 * FUNGSI: Menginisialisasi koneksi ke Firebase.
 *
 * File ini bertanggung jawab untuk:
 * 1. Mengambil konfigurasi Firebase dari environment variables
 *    (.env.local) agar kredensial tetap aman dan tidak
 *    ter-expose di source code.
 * 2. Menginisialisasi Firebase App menggunakan pattern Singleton
 *    (hanya membuat satu instance agar efisien).
 * 3. Mengekspor objek `auth` (untuk autentikasi pengguna)
 *    dan `db` (untuk operasi database Firestore).
 *
 * DIGUNAKAN OLEH: Semua halaman yang membutuhkan akses ke
 *                  Firebase Auth atau Firestore Database.
 * ============================================================
 */

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Konfigurasi Firebase diambil dari environment variables
// yang disimpan di file .env.local untuk keamanan
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton Pattern: Cek apakah Firebase App sudah diinisialisasi.
// Jika sudah ada, gunakan yang sudah ada (getApp()).
// Jika belum, buat instance baru (initializeApp()).
// Ini mencegah error "Firebase App already initialized" saat
// hot-reload di mode development.
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Ekspor instance Auth untuk fitur autentikasi (Login/Register/Logout)
const auth = getAuth(app);

// Ekspor instance Firestore untuk operasi database (CRUD)
const db = getFirestore(app);

export { app, auth, db };
