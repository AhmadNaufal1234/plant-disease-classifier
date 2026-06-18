import Link from "next/link";

import {
  Camera,
  History,
  Brain,
  BookOpen,
  Sprout,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background pb-32">

      {/* HERO */}
      <section className="p-4">

        <Card className="overflow-hidden border-0 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 text-white shadow-lg">

          <CardContent className="p-6">

            <div className="flex items-center gap-4">

              <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Sprout size={36} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">
                  AgroScan AI
                </h1>

                <p className="text-sm opacity-90">
                  Deteksi Penyakit Tanaman
                </p>
              </div>

            </div>

            <p className="mt-5 text-sm leading-relaxed opacity-95">
              Sistem klasifikasi penyakit daun berbasis
              Artificial Intelligence menggunakan
              ekstraksi fitur HSV, GLCM dan algoritma KNN.
            </p>

            <div className="flex gap-2 mt-4">

              <Badge className="bg-white text-green-700">
                Sistem Aktif
              </Badge>

              <Badge className="bg-white/20 text-white">
                KNN
              </Badge>

            </div>

          </CardContent>

        </Card>

      </section>

      {/* STATISTIK */}
      <section className="px-4 mb-4">

        <div className="grid grid-cols-2 gap-4">

          <Card>
            <CardContent className="p-4 text-center">

              <h3 className="text-2xl font-bold text-green-600">
                2100+
              </h3>

              <p className="text-sm text-muted-foreground">
                Dataset
              </p>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 text-center">

              <h3 className="text-2xl font-bold text-blue-600">
                KNN
              </h3>

              <p className="text-sm text-muted-foreground">
                Model AI
              </p>

            </CardContent>
          </Card>

        </div>

      </section>

      {/* DETEKSI */}
      <section className="px-4 mb-4">

        <Link href="/deteksi">

          <Card className="cursor-pointer hover:scale-[1.01] transition shadow-md border-green-100">

            <CardContent className="h-52 flex flex-col justify-center items-center text-center">

              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mb-4">

                <Camera
                  size={40}
                  className="text-green-600"
                />

              </div>

              <h2 className="text-2xl font-bold">
                Mulai Deteksi
              </h2>

              <p className="text-muted-foreground mt-2 text-sm">
                Ambil foto daun lalu lakukan
                klasifikasi penyakit secara otomatis
              </p>

            </CardContent>

          </Card>

        </Link>

      </section>

      {/* MENU */}
      <section className="px-4">

        <div className="grid grid-cols-2 gap-4">

          <Link href="/riwayat">

            <Card className="cursor-pointer hover:shadow-md transition">

              <CardContent className="p-5">

                <History
                  size={32}
                  className="text-blue-500 mb-3"
                />

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

            <Card className="cursor-pointer hover:shadow-md transition">

              <CardContent className="p-5">

                <BookOpen
                  size={32}
                  className="text-orange-500 mb-3"
                />

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

          <Card className="cursor-pointer hover:shadow-md transition">

            <CardContent className="p-5 flex items-center gap-4">

              <div className="h-14 w-14 rounded-full bg-purple-100 flex items-center justify-center">

                <Brain
                  size={28}
                  className="text-purple-600"
                />

              </div>

              <div>

                <h3 className="font-bold">
                  Machine Learning
                </h3>

                <p className="text-sm text-muted-foreground">
                  Evaluasi model dan dataset
                </p>

              </div>

              <ShieldCheck
                className="ml-auto text-green-500"
              />

            </CardContent>

          </Card>

        </Link>

      </section>

    </div>
  );
}