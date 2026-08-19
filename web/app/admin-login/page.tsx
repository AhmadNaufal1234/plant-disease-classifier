"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        router.push("/machine-learning");
      } else {
        setError(data.message || "Login gagal");
      }
    } catch {
      setLoading(false);
      setError("Gagal terhubung ke server");
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
          <h1 className="text-2xl font-bold tracking-tight">AgroScan AI</h1>
          <p className="text-sm text-muted-foreground mt-1">Panel Admin</p>
        </div>

        {/* Card Login */}
        <div className="border rounded-3xl p-6 bg-white shadow-sm">
          <h2 className="text-lg font-bold mb-1">Masuk ke Akun Admin</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Khusus untuk pengelola sistem AgroScan AI
          </p>

          <div className="space-y-3">
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
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border rounded-xl py-3 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
              />
            </div>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border rounded-xl py-3 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 focus:border-green-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="mt-3 px-3 py-2.5 rounded-xl bg-red-50 border border-red-100">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full mt-5 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50 hover:bg-green-700 active:scale-[0.99] transition"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Klasifikasi Penyakit Daun berbasis KNN · HSV + GLCM
        </p>
      </div>
    </div>
  );
}