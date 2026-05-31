/**
 * ============================================================
 * FILE: src/app/login/page.js
 * FUNGSI: Halaman Login untuk autentikasi pengguna.
 *
 * Fitur utama:
 * 1. Form login dengan input Email dan Password.
 * 2. Validasi input di sisi client sebelum mengirim ke Firebase.
 * 3. Integrasi dengan Firebase Auth menggunakan fungsi
 *    `signInWithEmailAndPassword` untuk memverifikasi kredensial.
 * 4. Toggle visibilitas password (tampilkan/sembunyikan).
 * 5. Penanganan error lengkap dengan pesan dalam Bahasa Indonesia.
 * 6. Loading state dengan spinner animation saat proses login.
 * 7. Redirect otomatis ke halaman utama setelah login berhasil.
 * 8. Link navigasi ke halaman Register bagi pengguna baru.
 *
 * DESAIN: Menggunakan Tailwind CSS dengan efek glassmorphism,
 *         gradient background, dan micro-animations untuk
 *         tampilan modern dan premium.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  // ---- State Management ----
  const [email, setEmail] = useState("");           // Menyimpan input email
  const [password, setPassword] = useState("");     // Menyimpan input password
  const [error, setError] = useState("");           // Menyimpan pesan error
  const [loading, setLoading] = useState(false);    // Status loading saat proses login
  const [showPassword, setShowPassword] = useState(false); // Toggle visibility password
  const router = useRouter();                       // Hook untuk navigasi programatik

  /**
   * handleLogin - Fungsi untuk menangani proses login.
   * Dipanggil saat form di-submit.
   *
   * Alur kerja:
   * 1. Mencegah reload halaman (preventDefault)
   * 2. Mengaktifkan loading state
   * 3. Mengirim email & password ke Firebase Auth
   * 4. Jika berhasil -> redirect ke halaman utama
   * 5. Jika gagal -> tampilkan pesan error yang sesuai
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect ke halaman utama setelah berhasil login
    } catch (err) {
      // Menerjemahkan kode error Firebase ke pesan Bahasa Indonesia
      switch (err.code) {
        case "auth/user-not-found":
          setError("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
          break;
        case "auth/wrong-password":
          setError("Password yang Anda masukkan salah.");
          break;
        case "auth/invalid-email":
          setError("Format email tidak valid.");
          break;
        case "auth/invalid-credential":
          setError("Email atau password salah. Silakan coba lagi.");
          break;
        case "auth/too-many-requests":
          setError("Terlalu banyak percobaan login. Coba lagi nanti.");
          break;
        default:
          setError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
      {/* ---- Background Decorative Elements ---- */}
      {/* Elemen dekoratif berupa lingkaran blur untuk efek visual modern */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-purple-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-[40%] right-[10%] w-48 h-48 bg-fuchsia-500/15 rounded-full blur-2xl animate-pulse delay-500" />

      {/* ---- Login Card (Glassmorphism) ---- */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500">

          {/* ---- Header / Branding ---- */}
          <div className="text-center mb-8">
            {/* Logo / Ikon Aplikasi */}
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-purple-500/25">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Selamat Datang
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Masuk ke akun Anda untuk melanjutkan
            </p>
          </div>

          {/* ---- Error Alert ---- */}
          {/* Menampilkan pesan error jika login gagal */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center animate-[fadeIn_0.3s_ease-in-out]">
              {error}
            </div>
          )}

          {/* ---- Login Form ---- */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-300 block"
              >
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-purple-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300"
                />
                {/* Tombol Toggle Visibility Password */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-purple-400 transition-colors"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Masuk</span>
                </>
              )}
            </button>
          </form>

          {/* ---- Divider ---- */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-gray-500 text-xs uppercase tracking-wider">
              atau
            </span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* ---- Link ke Halaman Register ---- */}
          <p className="text-center text-gray-400 text-sm">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors hover:underline"
            >
              Daftar Sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
