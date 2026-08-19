import Link from "next/link";

import {
  Camera,
  History,
  Brain,
  BookOpen,
  ShieldCheck,
  Database,
  Cpu,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50/60 via-background to-background pb-32">

      {/* HERO */}
      <section className="p-4 pt-6">

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white shadow-xl shadow-green-600/20 relative">

          {/* Dekorasi */}
          <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-4 right-4 opacity-20">
            <Sparkles size={80} />
          </div>

          <CardContent className="p-6 relative">

            <div className="flex items-center gap-4">

              <div className="h-16 w-16 rounded-2xl bg-white shadow-lg flex items-center justify-center p-2.5 shrink-0">
                <img
                  src="/icons/icon-192.png"
                  alt="AgroScan AI"
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  AgroScan AI
                </h1>

                <p className="text-sm opacity-90">
                  Deteksi Penyakit Tanaman
                </p>
              </div>

            </div>

            <p className="mt-5 text-sm leading-relaxed opacity-95 max-w-md">
              Sistem klasifikasi penyakit daun berbasis
              Artificial Intelligence menggunakan
              ekstraksi fitur HSV, GLCM dan algoritma KNN.
            </p>

            <div className="flex gap-2 mt-4">

              <Badge className="bg-white text-green-700 shadow-sm">
                Sistem Aktif
              </Badge>

              <Badge className="bg-white/20 text-white backdrop-blur">
                KNN
              </Badge>

            </div>

          </CardContent>

        </Card>

      </section>

      {/* STATISTIK */}
      <section className="px-4 mb-4">

        <div className="grid grid-cols-2 gap-4">

          <Card className="border-green-100 shadow-sm hover:shadow-md transition overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-green-50" />
            <CardContent className="p-4 flex items-center gap-3 relative">

              <div className="h-11 w-11 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                <Database size={20} className="text-green-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-green-600 leading-none">
                  2100+
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Dataset
                </p>
              </div>

            </CardContent>
          </Card>

          <Card className="border-blue-100 shadow-sm hover:shadow-md transition overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-16 h-16 rounded-full bg-blue-50" />
            <CardContent className="p-4 flex items-center gap-3 relative">

              <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Cpu size={20} className="text-blue-600" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-blue-600 leading-none">
                  KNN
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Model AI
                </p>
              </div>

            </CardContent>
          </Card>

        </div>

      </section>

      {/* DETEKSI */}
      <section className="px-4 mb-4">

        <Link href="/deteksi">

          <Card className="cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg border-0 bg-gradient-to-br from-green-500/5 via-white to-white ring-1 ring-green-100 overflow-hidden relative">

            <div className="absolute -left-10 -bottom-10 w-32 h-32 rounded-full bg-green-50 blur-2xl" />

            <CardContent className="h-52 flex flex-col justify-center items-center text-center relative">

              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 ring-4 ring-green-100">

                <Camera
                  size={36}
                  className="text-white"
                />

              </div>

              <h2 className="text-2xl font-bold">
                Mulai Deteksi
              </h2>

              <p className="text-muted-foreground mt-2 text-sm max-w-[240px]">
                Ambil foto daun lalu lakukan
                klasifikasi penyakit secara otomatis
              </p>

              <div className="flex items-center gap-1 mt-3 text-green-600 text-sm font-semibold">
                Coba sekarang
                <ArrowRight size={14} />
              </div>

            </CardContent>

          </Card>

        </Link>

      </section>

      {/* MENU */}
      <section className="px-4">

        <div className="grid grid-cols-2 gap-4">

          <Link href="/riwayat">

            <Card className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all h-full group">

              <CardContent className="p-5">

                <div className="h-11 w-11 rounded-xl bg-blue-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <History
                    size={22}
                    className="text-blue-500"
                  />
                </div>

                <h3 className="font-semibold">
                  Riwayat
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Hasil deteksi sebelumnya
                </p>

              </CardContent>

            </Card>

          </Link>

          <Link href="/informasi">

            <Card className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all h-full group">

              <CardContent className="p-5">

                <div className="h-11 w-11 rounded-xl bg-orange-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <BookOpen
                    size={22}
                    className="text-orange-500"
                  />
                </div>

                <h3 className="font-semibold">
                  Informasi
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Gejala & solusi penyakit
                </p>

              </CardContent>

            </Card>

          </Link>

        </div>

      </section>

      {/* MACHINE LEARNING */}
      <section className="p-4">

        <Link href="/machine-learning">

          <Card className="cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all border-purple-100 overflow-hidden relative">

            <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-purple-50 blur-xl" />

            <CardContent className="p-5 flex items-center gap-4 relative">

              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-md shadow-purple-500/20 shrink-0">

                <Brain
                  size={26}
                  className="text-white"
                />

              </div>

              <div className="flex-1">

                <h3 className="font-bold">
                  Machine Learning
                </h3>

                <p className="text-sm text-muted-foreground">
                  Evaluasi model dan dataset
                </p>

              </div>

              <ShieldCheck
                size={20}
                className="text-green-500 shrink-0"
              />

            </CardContent>

          </Card>

        </Link>

      </section>

    </div>
  );
}