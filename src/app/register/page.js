/**
 * ============================================================
 * FILE: src/app/register/page.js
 * FUNGSI: Halaman Registrasi (Pendaftaran Akun Baru).
 *
 * Fitur utama:
 * 1. Form registrasi dengan input Email, Password, dan
 *    Konfirmasi Password.
 * 2. Validasi kecocokan password dan konfirmasi password
 *    di sisi client sebelum mengirim ke Firebase.
 * 3. Integrasi dengan Firebase Auth menggunakan fungsi
 *    `createUserWithEmailAndPassword` untuk membuat akun baru.
 * 4. Toggle visibilitas password (tampilkan/sembunyikan).
 * 5. Penanganan error lengkap dengan pesan dalam Bahasa Indonesia.
 * 6. Loading state dengan spinner animation saat proses registrasi.
 * 7. Redirect otomatis ke halaman utama setelah registrasi berhasil.
 * 8. Link navigasi ke halaman Login bagi pengguna yang sudah punya akun.
 *
 * DESAIN: Konsisten dengan halaman Login menggunakan Tailwind CSS,
 *         efek glassmorphism, gradient, dan micro-animations.
 * ============================================================
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, UserPlus, Loader2, ShieldCheck } from "lucide-react";

export default function RegisterPage() {
  // ---- State Management ----
  const [email, setEmail] = useState("");               // Menyimpan input email
  const [password, setPassword] = useState("");         // Menyimpan input password
  const [confirmPassword, setConfirmPassword] = useState(""); // Konfirmasi password
  const [error, setError] = useState("");               // Menyimpan pesan error
  const [loading, setLoading] = useState(false);        // Status loading
  const [showPassword, setShowPassword] = useState(false);        // Toggle password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle konfirmasi
  const router = useRouter();                           // Hook untuk navigasi

  /**
   * handleRegister - Fungsi untuk menangani proses registrasi.
   * Dipanggil saat form di-submit.
   *
   * Alur kerja:
   * 1. Mencegah reload halaman (preventDefault)
   * 2. Validasi kecocokan password dan konfirmasi password
   * 3. Validasi panjang minimum password (min. 6 karakter)
   * 4. Mengirim data ke Firebase Auth untuk membuat akun baru
   * 5. Jika berhasil -> redirect ke halaman utama
   * 6. Jika gagal -> tampilkan pesan error yang sesuai
   */
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validasi: Password dan Konfirmasi Password harus cocok
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak cocok.");
      return;
    }

    // Validasi: Panjang minimum password
    if (password.length < 6) {
      setError("Password harus minimal 6 karakter.");
      return;
    }

    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/"); // Redirect ke halaman utama setelah berhasil registrasi
    } catch (err) {
      // Menerjemahkan kode error Firebase ke pesan Bahasa Indonesia
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Email sudah terdaftar. Silakan gunakan email lain atau login.");
          break;
        case "auth/invalid-email":
          setError("Format email tidak valid.");
          break;
        case "auth/weak-password":
          setError("Password terlalu lemah. Gunakan minimal 6 karakter.");
          break;
        default:
          setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
      {/* ---- Background Decorative Elements ---- */}
      <div className="absolute top-[-8%] right-[-5%] w-80 h-80 bg-indigo-600/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-12%] left-[-5%] w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-[50%] left-[8%] w-48 h-48 bg-cyan-500/15 rounded-full blur-2xl animate-pulse delay-500" />

      {/* ---- Register Card (Glassmorphism) ---- */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-8 md:p-10 transition-all duration-500">

          {/* ---- Header / Branding ---- */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-indigo-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/25">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Buat Akun Baru
            </h1>
            <p className="text-gray-400 mt-2 text-sm">
              Daftar untuk mulai menggunakan aplikasi
            </p>
          </div>

          {/* ---- Error Alert ---- */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm text-center animate-[fadeIn_0.3s_ease-in-out]">
              {error}
            </div>
          )}

          {/* ---- Register Form ---- */}
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Input Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-300 block"
              >
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
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
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
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

            {/* Input Konfirmasi Password */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-300 block"
              >
                Konfirmasi Password
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password Anda"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                  aria-label={showConfirmPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Register */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mendaftarkan...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Daftar</span>
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

          {/* ---- Link ke Halaman Login ---- */}
          <p className="text-center text-gray-400 text-sm">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
