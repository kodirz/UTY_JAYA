/**
 * ============================================================
 * FILE: src/app/page.js
 * FUNGSI: Halaman utama (Dashboard) aplikasi.
 *
 * Fitur utama:
 * 1. Memantau status autentikasi pengguna menggunakan
 *    `onAuthStateChanged` dari Firebase Auth.
 * 2. Jika pengguna BELUM login -> menampilkan halaman
 *    selamat datang dengan tombol Login dan Register.
 * 3. Jika pengguna SUDAH login -> menampilkan informasi
 *    akun (email) dan tombol Logout.
 * 4. Loading state saat mengecek status autentikasi.
 * 5. Fungsi Logout menggunakan `signOut` dari Firebase Auth.
 * 6. Menampilkan JWT Token yang bisa di-copy untuk testing API
 *    di Postman.
 *
 * DESAIN: Menggunakan Tailwind CSS dengan gradient background,
 *         glassmorphism card, dan animasi transisi yang halus
 *         untuk pengalaman pengguna yang premium.
 * ============================================================
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  LogOut,
  Loader2,
  LayoutDashboard,
  User,
  Copy,
  Check,
  Key,
} from "lucide-react";

export default function Home() {
  // ---- State Management ----
  const [user, setUser] = useState(null);       // Data pengguna yang sedang login
  const [loading, setLoading] = useState(true); // Loading saat cek status auth
  const [token, setToken] = useState("");       // JWT Token pengguna
  const [copied, setCopied] = useState(false);  // Status copy token
  const router = useRouter();

  /**
   * useEffect - Memantau perubahan status autentikasi.
   *
   * `onAuthStateChanged` adalah listener real-time dari Firebase.
   * Setiap kali pengguna login atau logout, fungsi callback
   * akan dipanggil secara otomatis dengan data user terbaru.
   *
   * Mengembalikan fungsi `unsubscribe` untuk membersihkan
   * listener saat komponen di-unmount (mencegah memory leak).
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      // Jika user login, ambil JWT Token secara otomatis
      if (currentUser) {
        const idToken = await currentUser.getIdToken();
        setToken(idToken);
      }
      setLoading(false);
    });

    // Cleanup: Hentikan listener saat komponen di-unmount
    return () => unsubscribe();
  }, []);

  /**
   * handleLogout - Fungsi untuk menangani proses logout.
   * Memanggil `signOut` dari Firebase Auth lalu
   * mengarahkan pengguna kembali ke halaman login.
   */
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setToken("");
      router.push("/login");
    } catch (err) {
      console.error("Gagal logout:", err);
    }
  };

  /**
   * copyToken - Menyalin JWT Token ke clipboard.
   * Menampilkan feedback visual (ikon centang) selama 2 detik
   * setelah token berhasil disalin.
   */
  const copyToken = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin token:", err);
    }
  };

  // ---- Loading State ----
  // Tampilkan spinner saat mengecek status autentikasi
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
          <p className="text-gray-400 text-sm">Memuat...</p>
        </div>
      </div>
    );
  }

  // ---- Tampilan Jika Belum Login ----
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
        {/* Background Decorative */}
        <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="relative z-10 text-center max-w-lg mx-4">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 md:p-14">
            {/* Ikon Aplikasi */}
            <div className="mx-auto w-20 h-20 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-purple-500/25">
              <LayoutDashboard className="w-10 h-10 text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white tracking-tight mb-3">
              UTY JAYA
            </h1>
            <p className="text-gray-400 mb-10 leading-relaxed">
              Welcome to Aplikasi Manajemen Data Akademik UTY JAYA
            </p>

            {/* Tombol Aksi */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                Masuk
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/20 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-300"
              >
                <UserPlus className="w-5 h-5" />
                Daftar
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---- Tampilan Dashboard (Sudah Login) ----
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* Background Decorative */}
      <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* ---- Navbar ---- */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">UTY JAYA</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Info User */}
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
              <User className="w-4 h-4 text-purple-400" />
              <span className="text-gray-300 text-sm">{user.email}</span>
            </div>

            {/* Tombol Logout */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 hover:text-red-300 font-medium rounded-xl transition-all duration-300 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ---- Konten Dashboard ---- */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 md:p-14 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-green-500/25">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-3xl font-bold text-white mb-3">
            Selamat Datang di Dashboard!
          </h2>
          <p className="text-gray-400 mb-2">
            Anda berhasil login sebagai:
          </p>
          <p className="text-purple-400 font-semibold text-lg mb-8">
            {user.email}
          </p>
        </div>
      </main>
    </div>
  );
}
