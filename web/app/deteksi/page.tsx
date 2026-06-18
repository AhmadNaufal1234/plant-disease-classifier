"use client";

import { useState } from "react";
import { Camera, Upload, Leaf, AlertCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const diseaseInfo: Record<string, any> = {
  bacterial_spot: {
    name: "Bercak Bakteri",
    solution: [
      "Pangkas daun yang terinfeksi",
      "Gunakan fungisida berbahan tembaga",
      "Kurangi kelembapan berlebih",
    ],
  },

  early_blight: {
    name: "Busuk Daun Awal",
    solution: [
      "Buang daun yang terserang",
      "Gunakan fungisida sesuai dosis",
      "Jaga sirkulasi udara tanaman",
    ],
  },

  late_blight: {
    name: "Busuk Daun Lanjut",
    solution: [
      "Segera pisahkan tanaman sakit",
      "Semprot fungisida secara berkala",
      "Kurangi penyiraman berlebihan",
    ],
  },

  leaf_mold: {
    name: "Jamur Daun",
    solution: [
      "Kurangi kelembapan lingkungan",
      "Pangkas daun yang terinfeksi",
      "Gunakan fungisida antijamur",
    ],
  },

  healthy: {
    name: "Tanaman Sehat",
    solution: [
      "Tanaman dalam kondisi baik",
      "Lanjutkan perawatan rutin",
      "Pantau kondisi daun secara berkala",
    ],
  },
};

export default function DeteksiPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [result, setResult] = useState<any>(null);

  const handleImage = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file = e.target.files?.[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onloadend = () => {
    setImage(reader.result as string);
  };

  reader.readAsDataURL(file);

  setSelectedFile(file);
};

  const handlePredict = async () => {
    if (!selectedFile) {
      alert("Pilih gambar terlebih dahulu");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("image", selectedFile);

      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResult(data);
      
      // SIMPAN KE RIWAYAT
// SIMPAN KE RIWAYAT
const history = JSON.parse(
  localStorage.getItem("detectionHistory") || "[]"
);

history.unshift({
  date: new Date().toLocaleString("id-ID"),
  plant: data.plant,
  disease: data.disease,
  confidence: data.confidence,
  image: image,
});

localStorage.setItem(
  "detectionHistory",
  JSON.stringify(history)
);

    } catch (error) {
      console.error(error);

      alert("Gagal melakukan prediksi");
    }
  };

  const info =
  result &&
  diseaseInfo[result.disease]
    ? diseaseInfo[result.disease]
    : null;

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      <h1 className="text-3xl font-bold mb-6">Deteksi Penyakit</h1>

      {/* Upload */}
      <Card className="mb-4">
        <CardContent className="p-4">
          {image ? (
            <img
              src={image}
              alt="Preview"
              className="rounded-xl w-full h-64 object-cover"
            />
          ) : (
            <div className="h-64 border rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Upload size={60} className="mx-auto mb-4 text-green-600" />

                <p className="font-medium">Belum ada gambar</p>

                <p className="text-sm text-muted-foreground mt-1">
                  Ambil foto atau pilih gambar daun
                </p>
              </div>
            </div>
          )}

          <label className="block mt-4">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="hidden"
            />

            <Button type="button" className="w-full" asChild>
              <span>
                <Camera className="mr-2 h-4 w-4" />
                Ambil Foto / Pilih Gambar
              </span>
            </Button>
          </label>

          <Button
            onClick={handlePredict}
            className="w-full mt-3 bg-green-600 hover:bg-green-700"
          >
            Deteksi Penyakit
          </Button>
        </CardContent>
      </Card>

      {/* Hasil Prediksi */}
<Card className="shadow-sm border-0 rounded-3xl">
  <CardContent className="p-5">

    <div className="flex items-center gap-2 mb-5">
      <Leaf className="text-green-600" />
      <h2 className="font-bold text-xl">
        Hasil Analisis
      </h2>
    </div>

    {result ? (

      <div className="space-y-5">

        {/* Badge Tanaman */}
        <div>

          <span
            className="
              inline-flex
              px-3
              py-1
              rounded-full
              text-xs
              font-medium
              bg-green-100
              text-green-700
            "
          >
            {result.plant
              .charAt(0)
              .toUpperCase() +
              result.plant.slice(1)}
          </span>

        </div>

        {/* Nama Penyakit */}
        <div>

          <h3 className="
            text-2xl
            font-bold
            leading-tight
          ">
            {info?.name ||
              result.disease}
          </h3>

        </div>

        {/* Confidence */}
        <div>

          <div className="
            flex
            justify-between
            mb-2
          ">
            <span className="
              text-sm
              text-muted-foreground
            ">
              Tingkat Kepercayaan
            </span>

            <span className="
              font-bold
              text-green-600
            ">
              {result.confidence}%
            </span>
          </div>

          <div className="
            w-full
            h-2
            rounded-full
            bg-gray-200
            overflow-hidden
          ">

            <div
              className="
                h-full
                bg-green-500
              "
              style={{
                width: `${result.confidence}%`,
              }}
            />

          </div>

        </div>

        {/* Solusi */}
        {info && (

          <div
            className="
              bg-green-50
              border
              border-green-100
              rounded-2xl
              p-4
            "
          >

            <h4 className="
              font-semibold
              text-green-700
              mb-3
            ">
              Rekomendasi Penanganan
            </h4>

            <ul className="
              list-disc
              ml-5
              space-y-2
              text-sm
            ">

              {info.solution.map(
                (
                  item: string,
                  index: number
                ) => (
                  <li key={index}>
                    {item}
                  </li>
                )
              )}

            </ul>

          </div>

        )}

      </div>

    ) : (

      <div className="
        text-center
        py-10
      ">

        <AlertCircle
          size={42}
          className="
            mx-auto
            mb-3
            text-gray-400
          "
        />

        <p className="
          font-medium
          text-gray-500
        ">
          Belum ada hasil analisis
        </p>

        <p className="
          text-sm
          text-gray-400
          mt-1
        ">
          Upload gambar daun
          terlebih dahulu
        </p>

      </div>

    )}

  </CardContent>
</Card>
    </div>
  );
}
