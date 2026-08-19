"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  X,
} from "lucide-react";

export default function TambahAdminPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [alertInfo, setAlertInfo] = useState<{
    type: "success" | "error";
    title: string;
    message: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!username || !password || !confirmPassword) {
      setAlertInfo({
        type: "error",
        title: "Data Belum Lengkap",
        message: "Isi semua field terlebih dahulu.",
      });
      return;
    }

    if (password.length < 6) {
      setAlertInfo({
        type: "error",
        title: "Password Terlalu Pendek",
        message: "Password harus memiliki minimal 6 karakter.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setAlertInfo({
        type: "error",
        title: "Password Tidak Cocok",
        message: "Konfirmasi password harus sama dengan password.",
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin-tambah", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      setLoading(false);

      if (data.success) {
        setAlertInfo({
          type: "success",
          title: "Berhasil",
          message: `Admin "${username}" berhasil ditambahkan.`,
        });

        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        setAlertInfo({
          type: "error",
          title: "Gagal",
          message: data.message || "Terjadi kesalahan.",
        });
      }
    } catch {
      setLoading(false);

      setAlertInfo({
        type: "error",
        title: "Gagal Terhubung",
        message: "Tidak dapat terhubung ke server.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 via-white to-white">
      <div className="w-full max-w-sm">
        {/* Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 shadow-lg shadow-blue-600/20 flex items-center justify-center mb-4 p-1.5">
            <img
              src="/icons/icon-192.png"
              alt="AgroScan AI"
              width={56}
              height={56}
              className="rounded-xl"
            />
          </div>

          <h1 className="text-2xl font-bold tracking-tight">
            AgroScan AI
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Panel Admin
          </p>
        </div>

        {/* Card Tambah Admin */}
        <div className="border rounded-3xl p-6 bg-white shadow-sm">
          {/* Kembali */}
          <button
            onClick={() => router.push("/machine-learning")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-gray-700 mb-5 transition"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>

          <h2 className="text-lg font-bold mb-1">
            Tambah Admin Baru
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            Buat akun admin baru untuk mengelola sistem AgroScan AI
          </p>

          <div className="space-y-3">
            {/* Username */}
            <div className="relative">
              <User
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password (min. 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700 transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {/* Konfirmasi Password */}
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                onKeyDown={(e) =>
                  e.key === "Enter" && handleSubmit()
                }
                className="w-full border rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
              />
            </div>
          </div>

          {/* Tombol */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50 hover:bg-green-700 active:scale-[0.99] transition"
          >
            {loading ? "Memproses..." : "Tambah Admin"}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 mb-16">
          Klasifikasi Penyakit Daun berbasis KNN · HSV + GLCM
        </p>
      </div>

      {/* Alert Modal */}
      {alertInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setAlertInfo(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  alertInfo.type === "success"
                    ? "bg-green-50"
                    : "bg-red-50"
                }`}
              >
                {alertInfo.type === "success" ? (
                  <CheckCircle2
                    size={26}
                    className="text-green-500"
                  />
                ) : (
                  <XCircle
                    size={26}
                    className="text-red-500"
                  />
                )}
              </div>

              <button
                onClick={() => setAlertInfo(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-lg font-bold mb-1.5">
              {alertInfo.title}
            </h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {alertInfo.message}
            </p>

            <button
              onClick={() => setAlertInfo(null)}
              className={`w-full py-3 rounded-xl text-white font-medium active:scale-[0.99] transition ${
                alertInfo.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}