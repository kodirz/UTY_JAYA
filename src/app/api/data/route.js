/**
 * ============================================================
 * FILE: src/app/api/data/route.js
 * FUNGSI: API Endpoint untuk operasi CRUD data di Firestore.
 *
 * Endpoint ini DILINDUNGI oleh autentikasi JWT. Setiap request
 * harus menyertakan header:
 *   Authorization: Bearer <JWT_TOKEN>
 *
 * Metode yang tersedia:
 *
 * 1. GET /api/data
 *    - Mengambil semua data dari koleksi "items" di Firestore.
 *    - Response: { success: true, data: [...] }
 *
 * 2. POST /api/data
 *    - Menambahkan data baru ke koleksi "items" di Firestore.
 *    - Body: { "nama": "...", "deskripsi": "..." }
 *    - Response: { success: true, id: "...", data: {...} }
 *
 * Setiap data yang disimpan akan otomatis mendapatkan:
 * - Field "createdBy": UID pengguna yang membuat data
 * - Field "createdAt": Waktu pembuatan data (ISO string)
 *
 * KEAMANAN: Endpoint ini menggunakan fungsi verifyToken()
 *           dari src/lib/auth.js untuk memvalidasi JWT Token
 *           sebelum mengizinkan akses ke data.
 * ============================================================
 */

import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { verifyToken } from "@/lib/auth";

// Nama koleksi Firestore yang digunakan untuk menyimpan data
const COLLECTION_NAME = "items";

/**
 * GET /api/data
 * Mengambil semua data dari koleksi Firestore.
 * Endpoint ini memerlukan JWT Token di header Authorization.
 */
export async function GET(request) {
  try {
    // Langkah 1: Verifikasi JWT Token dari header
    let decodedToken;
    try {
      decodedToken = await verifyToken(request);
    } catch (authError) {
      return NextResponse.json(
        {
          success: false,
          error: authError.message,
        },
        { status: 401 }
      );
    }

    // Langkah 2: Ambil semua dokumen dari koleksi Firestore
    const snapshot = await adminDb
      .collection(COLLECTION_NAME)
      .orderBy("createdAt", "desc") // Urutkan dari terbaru
      .get();

    // Langkah 3: Konversi snapshot Firestore ke array of objects
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // ID dokumen Firestore (auto-generated)
      ...doc.data(), // Spread semua field data dokumen
    }));

    // Langkah 4: Kembalikan data dalam format JSON
    return NextResponse.json(
      {
        success: true,
        message: `Berhasil mengambil ${data.length} data.`,
        user: decodedToken.email,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/data Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data. " + error.message,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/data
 * Menambahkan data baru ke koleksi Firestore.
 * Endpoint ini memerlukan JWT Token di header Authorization.
 *
 * Body JSON yang diperlukan:
 * {
 *   "nama": "Nama item",
 *   "deskripsi": "Deskripsi item"
 * }
 */
export async function POST(request) {
  try {
    // Langkah 1: Verifikasi JWT Token dari header
    let decodedToken;
    try {
      decodedToken = await verifyToken(request);
    } catch (authError) {
      return NextResponse.json(
        {
          success: false,
          error: authError.message,
        },
        { status: 401 }
      );
    }

    // Langkah 2: Ambil data dari request body
    const body = await request.json();
    const { nama, deskripsi } = body;

    // Langkah 3: Validasi input - nama wajib diisi
    if (!nama) {
      return NextResponse.json(
        {
          success: false,
          error: "Field 'nama' wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Langkah 4: Siapkan data yang akan disimpan ke Firestore
    const newItem = {
      nama,
      deskripsi: deskripsi || "", // Default ke string kosong jika tidak diisi
      createdBy: decodedToken.uid, // UID pengguna dari JWT Token
      createdByEmail: decodedToken.email, // Email pengguna dari JWT Token
      createdAt: new Date().toISOString(), // Timestamp pembuatan
    };

    // Langkah 5: Simpan data ke Firestore
    // addDoc() akan otomatis membuat ID dokumen yang unik
    const docRef = await adminDb.collection(COLLECTION_NAME).add(newItem);

    // Langkah 6: Kembalikan response sukses dengan ID dokumen baru
    return NextResponse.json(
      {
        success: true,
        message: "Data berhasil ditambahkan!",
        id: docRef.id,
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/data Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Gagal menambahkan data. " + error.message,
      },
      { status: 500 }
    );
  }
}
