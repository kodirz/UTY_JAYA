/**
 * ============================================================
 * FILE: src/lib/firebase-admin.js
 * FUNGSI: Menginisialisasi Firebase Admin SDK untuk sisi server.
 *
 * Firebase Admin SDK berbeda dengan Firebase Client SDK:
 * - Client SDK: Digunakan di browser/frontend untuk login, dll.
 * - Admin SDK: Digunakan di server/backend untuk memverifikasi
 *   token JWT, mengakses Firestore dengan hak admin, dll.
 *
 * Fitur utama:
 * 1. Menginisialisasi Firebase Admin App dengan kredensial
 *    Service Account dari environment variables.
 * 2. Mengekspor `adminAuth` untuk verifikasi JWT Token.
 * 3. Mengekspor `adminDb` untuk akses Firestore dari server.
 * 4. Menggunakan Singleton Pattern untuk mencegah inisialisasi ganda.
 *
 * DIGUNAKAN OLEH: Route Handlers (API endpoints) yang
 *                  membutuhkan verifikasi autentikasi.
 * ============================================================
 */

import fs from "fs";
import path from "path";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Helper untuk menginisialisasi Admin App secara aman
function getAdminApp() {
  // Jika sudah ada app yang diinisialisasi, gunakan yang sudah ada
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

  // Metode 1: Menggunakan file firebase-key.json lokal (diabaikan oleh git)
  const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH || "firebase-key.json";
  const absolutePath = path.resolve(process.cwd(), keyPath);

  if (fs.existsSync(absolutePath)) {
    try {
      const fileContents = fs.readFileSync(absolutePath, "utf8");
      const serviceAccount = JSON.parse(fileContents);
      
      console.log("ℹ️ Menginisialisasi Firebase Admin SDK menggunakan file credentials lokal.");
      return initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error("❌ Gagal membaca/mem-parsing firebase-key.json, beralih ke Env Variables:", error.message);
    }
  }

  // Metode 2: Fallback ke Environment Variables (misal untuk deployment Vercel/Netlify)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    console.log("ℹ️ Menginisialisasi Firebase Admin SDK menggunakan JSON String dari Env Var.");
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    return initializeApp({
      credential: cert(serviceAccount),
    });
  }

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (
    privateKey &&
    !privateKey.includes("your_private_key_here") &&
    clientEmail &&
    !clientEmail.includes("your_client_email_here")
  ) {
    console.log("ℹ️ Menginisialisasi Firebase Admin SDK menggunakan Environment Variables.");
    const formattedPrivateKey = privateKey.replace(/\\n/g, "\n");
    return initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: formattedPrivateKey,
      }),
    });
  }

  // Metode 3: Fallback minimal agar Next.js build sukses walaupun kredensial belum dikonfigurasi
  console.warn("⚠️ WARNING: Firebase Admin SDK belum terkonfigurasi dengan benar di .env.local maupun firebase-key.json");
  return initializeApp({ projectId });
}

// Deklarasikan variabel ekspor
let adminAuth;
let adminDb;

try {
  const app = getAdminApp();
  adminAuth = getAuth(app);
  adminDb = getFirestore(app);
} catch (error) {
  console.error("❌ Gagal menginisialisasi Firebase Admin SDK:", error.message);
  
  // Sediakan fallback mock agar proses build atau runtime tidak langsung crash saat import
  adminAuth = {
    verifyIdToken: async () => {
      throw new Error("Firebase Admin SDK tidak terkonfigurasi. Periksa kredensial di .env.local");
    },
  };
  adminDb = {
    collection: () => {
      throw new Error("Firebase Admin SDK tidak terkonfigurasi. Periksa kredensial di .env.local");
    },
  };
}

export { adminAuth, adminDb };
