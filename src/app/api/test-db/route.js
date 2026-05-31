/**
 * ============================================================
 * FILE: src/app/api/test-db/route.js
 * FUNGSI: API Endpoint untuk memverifikasi koneksi database Firestore.
 *
 * Endpoint ini dapat diakses secara publik (GET /api/test-db)
 * untuk mematangkan apakah Firebase Admin SDK yang terhubung
 * melalui berkas firebase-key.json berjalan dengan benar.
 *
 * Proses pengetesan:
 * 1. Melakukan operasi tulis (set) dokumen di koleksi "connection_tests".
 * 2. Melakukan operasi baca (get) dokumen tersebut.
 * 3. Jika berhasil, mengembalikan status sukses (200 OK).
 * 4. Jika gagal, mengembalikan status error (500 Internal Server Error)
 *    beserta pesan error asli dari Firebase.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

export async function GET() {
  try {
    // 1. Tulis dokumen dummy ke koleksi connection_tests
    const testDocRef = adminDb.collection("connection_tests").doc("status");
    const testData = {
      connected: true,
      testedAt: new Date().toISOString(),
      environment: process.env.NODE_ENV || "development",
    };
    
    await testDocRef.set(testData);

    // 2. Baca kembali dokumen untuk memverifikasi kemampuan Read
    const docSnapshot = await testDocRef.get();
    
    if (!docSnapshot.exists) {
      throw new Error("Dokumen berhasil ditulis namun tidak ditemukan saat dibaca kembali.");
    }

    const retrievedData = docSnapshot.data();

    // 3. Kembalikan respons sukses
    return NextResponse.json({
      success: true,
      message: "Koneksi ke Firestore berhasil terjalin dan berfungsi dengan baik (Read/Write OK)!",
      status: "CONNECTED",
      verificationData: retrievedData,
    });
  } catch (error) {
    console.error("Firestore Connection Test Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal terhubung ke Firestore. Periksa konfigurasi kredensial Anda.",
        error: error.message,
        code: error.code || "unknown_error",
      },
      { status: 500 }
    );
  }
}
