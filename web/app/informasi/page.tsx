"use client";

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
} from "lucide-react";

const diseases = [
  {
    icon: <Bug className="h-5 w-5 text-red-500" />,
    name: "Bercak Bakteri",
    description:
      "Penyakit yang disebabkan oleh bakteri dan menyerang daun tanaman.",
    symptoms: [
      "Muncul bercak coklat",
      "Daun menguning",
      "Pertumbuhan tanaman terganggu",
    ],
    solution: [
      "Pangkas daun terinfeksi",
      "Gunakan fungisida berbahan tembaga",
      "Kurangi kelembapan berlebih",
    ],
  },

  {
    icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    name: "Busuk Daun Awal",
    description:
      "Penyakit jamur yang menyerang daun bagian bawah terlebih dahulu.",
    symptoms: [
      "Bercak coklat melingkar",
      "Daun mengering",
      "Daun rontok",
    ],
    solution: [
      "Buang daun yang terinfeksi",
      "Gunakan fungisida",
      "Perbaiki sirkulasi udara",
    ],
  },

  {
    icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
    name: "Busuk Daun Lanjut",
    description:
      "Penyakit serius yang dapat menyebar dengan cepat pada tanaman.",
    symptoms: [
      "Bercak gelap besar",
      "Daun layu",
      "Tanaman mati",
    ],
    solution: [
      "Pisahkan tanaman sakit",
      "Semprot fungisida",
      "Kurangi penyiraman berlebih",
    ],
  },

  {
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    name: "Jamur Daun",
    description:
      "Infeksi jamur yang muncul pada permukaan daun.",
    symptoms: [
      "Lapisan jamur pada daun",
      "Daun menguning",
      "Pertumbuhan terganggu",
    ],
    solution: [
      "Kurangi kelembapan",
      "Buang daun terinfeksi",
      "Gunakan fungisida antijamur",
    ],
  },

  {
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    name: "Tanaman Sehat",
    description:
      "Tanaman dalam kondisi normal dan tidak terdeteksi penyakit.",
    symptoms: [
      "Daun hijau segar",
      "Tidak ada bercak",
      "Pertumbuhan normal",
    ],
    solution: [
      "Lanjutkan perawatan rutin",
      "Pantau kondisi daun secara berkala",
    ],
  },
];

export default function InformasiPage() {
  return (
    <div className="max-w-md mx-auto p-4 pb-32">

      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Informasi Penyakit
        </h1>

        <p className="text-sm text-muted-foreground mt-2">
          Pelajari gejala dan solusi penyakit tanaman yang dapat dideteksi oleh AgroScan AI.
        </p>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

        <Accordion
          type="single"
          collapsible
          className="w-full"
        >
          {diseases.map((disease, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
            >
              <AccordionTrigger className="px-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                    {disease.icon}
                  </div>

                  <span className="font-medium text-left">
                    {disease.name}
                  </span>

                </div>

              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4">

                <div className="space-y-4">

                  <div>
                    <h3 className="font-semibold mb-2">
                      Deskripsi
                    </h3>

                    <p className="text-sm text-muted-foreground">
                      {disease.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-orange-600">
                      Gejala
                    </h3>

                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      {disease.symptoms.map(
                        (item, idx) => (
                          <li key={idx}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-green-600">
                      Solusi
                    </h3>

                    <ul className="list-disc ml-5 space-y-1 text-sm">
                      {disease.solution.map(
                        (item, idx) => (
                          <li key={idx}>
                            {item}
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                </div>

              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

      </div>

    </div>
  );
}