"use client";

import { useMemo, useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Bug,
  Leaf,
  ShieldCheck,
  AlertTriangle,
  Search,
  BookOpen,
  Sparkles,
} from "lucide-react";

type Severity = "Ringan" | "Sedang" | "Berat" | "Sehat";

interface Disease {
  icon: React.ReactNode;
  name: string;
  severity: Severity;
  description: string;
  symptoms: string[];
  prevention: string[];
  solution: string[];
  accent: {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
  };
}

type SeverityStyle = {
  bg: string;
  text: string;
  border: string;
  iconBg: string;
};

const severityStyles: Record<Severity, SeverityStyle> = {
  Ringan: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    iconBg: "bg-yellow-100",
  },
  Sedang: {
    bg: "bg-orange-50",
    text: "text-orange-700",
    border: "border-orange-200",
    iconBg: "bg-orange-100",
  },
  Berat: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    iconBg: "bg-red-100",
  },
  Sehat: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    iconBg: "bg-green-100",
  },
};

const diseases: Disease[] = [
  {
    icon: <Bug className="h-5 w-5 text-orange-600" />,
    name: "Bercak Bakteri",
    severity: "Sedang",
    description:
      "Penyakit yang disebabkan oleh bakteri dan menyerang daun tanaman, biasanya menyebar lewat percikan air atau alat berkebun yang terkontaminasi.",
    symptoms: [
      "Muncul bercak coklat kehitaman kecil",
      "Daun menguning di sekitar bercak",
      "Pertumbuhan tanaman terganggu",
    ],
    prevention: [
      "Hindari menyiram daun secara langsung",
      "Jaga jarak tanam agar sirkulasi udara baik",
      "Sterilkan alat berkebun sebelum digunakan",
    ],
    solution: [
      "Pangkas dan buang daun terinfeksi",
      "Gunakan fungisida berbahan tembaga",
      "Kurangi kelembapan berlebih di sekitar tanaman",
    ],
    accent: severityStyles.Sedang,
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-orange-600" />,
    name: "Busuk Daun Awal",
    severity: "Sedang",
    description:
      "Penyakit jamur yang menyerang daun bagian bawah terlebih dahulu sebelum menyebar ke bagian atas tanaman.",
    symptoms: [
      "Bercak coklat melingkar menyerupai target",
      "Daun mengering dari tepi",
      "Daun rontok sebelum waktunya",
    ],
    prevention: [
      "Rotasi tanaman setiap musim tanam",
      "Beri jarak antar tanaman yang cukup",
      "Buang sisa tanaman sakit dari lahan",
    ],
    solution: [
      "Buang daun yang terinfeksi segera",
      "Gunakan fungisida sesuai dosis anjuran",
      "Perbaiki sirkulasi udara di sekitar tanaman",
    ],
    accent: severityStyles.Sedang,
  },
  {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    name: "Busuk Daun Lanjut",
    severity: "Berat",
    description:
      "Penyakit serius yang dapat menyebar dengan sangat cepat, terutama pada cuaca lembap dan sering menyebabkan gagal panen jika tidak segera ditangani.",
    symptoms: [
      "Bercak gelap besar berair pada daun",
      "Daun layu dan berbau busuk",
      "Tanaman mati dalam waktu singkat",
    ],
    prevention: [
      "Pilih varietas tanaman yang tahan penyakit",
      "Hindari penyiraman berlebihan saat musim hujan",
      "Pantau tanaman secara rutin setiap hari",
    ],
    solution: [
      "Pisahkan dan musnahkan tanaman yang sakit",
      "Semprot fungisida sistemik segera",
      "Kurangi penyiraman berlebih",
    ],
    accent: severityStyles.Berat,
  },
  {
    icon: <Leaf className="h-5 w-5 text-yellow-600" />,
    name: "Jamur Daun",
    severity: "Ringan",
    description:
      "Infeksi jamur yang muncul pada permukaan daun, umumnya dipicu oleh kelembapan tinggi dan minim sirkulasi udara.",
    symptoms: [
      "Lapisan jamur keabuan pada permukaan daun",
      "Daun menguning secara bertahap",
      "Pertumbuhan tanaman sedikit terganggu",
    ],
    prevention: [
      "Jaga kelembapan udara tetap stabil",
      "Pastikan pencahayaan matahari cukup",
      "Hindari penyiraman pada sore/malam hari",
    ],
    solution: [
      "Kurangi kelembapan di sekitar tanaman",
      "Buang daun yang terinfeksi",
      "Gunakan fungisida antijamur",
    ],
    accent: severityStyles.Ringan,
  },
  {
    icon: <ShieldCheck className="h-5 w-5 text-green-600" />,
    name: "Tanaman Sehat",
    severity: "Sehat",
    description:
      "Tanaman dalam kondisi normal dan tidak terdeteksi penyakit apa pun. Pertahankan perawatan yang sudah baik.",
    symptoms: [
      "Daun hijau segar dan merata",
      "Tidak ada bercak atau lapisan asing",
      "Pertumbuhan tanaman normal",
    ],
    prevention: [
      "Lanjutkan pola penyiraman yang konsisten",
      "Beri pupuk sesuai kebutuhan tanaman",
    ],
    solution: [
      "Lanjutkan perawatan rutin",
      "Pantau kondisi daun secara berkala",
    ],
    accent: severityStyles.Sehat,
  },
];

export default function InformasiPage() {
  const [query, setQuery] = useState("");

  const filteredDiseases = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return diseases;
    return diseases.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="max-w-md lg:max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-green-100">
            <BookOpen size={22} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold leading-tight">
              Informasi Penyakit
            </h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              {diseases.length} kondisi yang dapat dideteksi
            </p>
          </div>
        </div>

        <p className="text-sm lg:text-base text-muted-foreground mt-2 lg:max-w-2xl">
          Pelajari gejala, pencegahan, dan solusi penyakit tanaman yang dapat
          dideteksi oleh AgroScan AI.
        </p>
      </div>

      {/* Search & legend berdampingan di laptop */}
      <div className="lg:flex lg:items-center lg:gap-4 mb-6">
        {/* Search */}
        <div className="relative mb-5 lg:mb-0 lg:flex-1">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari penyakit atau gejala..."
            className="
              w-full
              pl-10
              pr-4
              py-3
              rounded-2xl
              border
              bg-white
              text-sm
              outline-none
              focus:ring-2
              focus:ring-green-200
              focus:border-green-300
              transition
            "
          />
        </div>

        {/* Quick legend */}
        <div className="flex flex-wrap gap-2 lg:shrink-0">
          {(Object.keys(severityStyles) as Severity[]).map((level) => (
            <span
              key={level}
              className={`
                inline-flex
                items-center
                px-3
                py-1
                rounded-full
                text-xs
                font-medium
                border
                ${severityStyles[level].bg}
                ${severityStyles[level].text}
                ${severityStyles[level].border}
              `}
            >
              {level}
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      {filteredDiseases.length === 0 ? (
        <div className="border rounded-2xl p-10 lg:p-16 text-center bg-white flex flex-col items-center gap-3">
          <div className="p-4 rounded-full bg-green-50">
            <Sparkles size={26} className="text-green-500" />
          </div>
          <h3 className="font-semibold">Tidak Ditemukan</h3>
          <p className="text-sm text-muted-foreground">
            Coba kata kunci lain, ya
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">
          <Accordion type="single" collapsible className="w-full">
            {filteredDiseases.map((disease, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="px-4 lg:px-6">
                  <div className="flex items-center gap-3 w-full">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${disease.accent.iconBg}`}
                    >
                      {disease.icon}
                    </div>

                    <div className="flex-1 text-left">
                      <span className="font-medium block">
                        {disease.name}
                      </span>
                    </div>

                    <span
                      className={`
                        inline-flex
                        items-center
                        px-2.5
                        py-1
                        rounded-full
                        text-xs
                        font-medium
                        border
                        mr-2
                        ${disease.accent.bg}
                        ${disease.accent.text}
                        ${disease.accent.border}
                      `}
                    >
                      {disease.severity}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-4 lg:px-6 pb-4">
                  <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-y-0">
                    <div className="lg:col-span-2">
                      <h3 className="font-semibold mb-2">Deskripsi</h3>
                      <p className="text-sm text-muted-foreground">
                        {disease.description}
                      </p>
                    </div>

                    <div
                      className={`rounded-2xl p-4 border lg:col-span-2 ${disease.accent.bg} ${disease.accent.border}`}
                    >
                      <h3
                        className={`font-semibold mb-2 ${disease.accent.text}`}
                      >
                        Gejala
                      </h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        {disease.symptoms.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl p-4 border bg-blue-50 border-blue-200">
                      <h3 className="font-semibold mb-2 text-blue-700">
                        Pencegahan
                      </h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        {disease.prevention.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-2xl p-4 border bg-green-50 border-green-200">
                      <h3 className="font-semibold mb-2 text-green-700">
                        Solusi
                      </h3>
                      <ul className="list-disc ml-5 space-y-1 text-sm">
                        {disease.solution.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}