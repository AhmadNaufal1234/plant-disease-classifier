"use client";

import { useRef, useState } from "react";
import { Camera, ImageIcon, Leaf, AlertCircle, Loader2, XCircle, X } from "lucide-react";

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

interface AlertState {
  title: string;
  message: string;
}

export default function DeteksiPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertState | null>(null);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const showAlert = (title: string, message: string) => {
    setAlertInfo({ title, message });
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);

    setSelectedFile(file);
    setResult(null);
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      showAlert("Gambar Belum Dipilih", "Pilih gambar terlebih dahulu sebelum melakukan deteksi.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("image", selectedFile);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      // Backend menolak gambar yang tidak dikenali (bukan daun / out-of-distribution)
      if (data.error === "unrecognized") {
        showAlert(
          "Gambar Tidak Dikenali",
          data.message || "Gambar tidak dikenali sebagai daun tanaman. Pastikan foto menampilkan daun dengan jelas."
        );
        setResult(null);
        return;
      }

      // Error lain dari backend (misal gambar invalid, dsb)
      if (data.error) {
        showAlert("Terjadi Kesalahan", data.error);
        setResult(null);
        return;
      }

      setResult(data);

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

      localStorage.setItem("detectionHistory", JSON.stringify(history));
    } catch (error) {
      console.error(error);
      showAlert("Gagal Terhubung", "Gagal melakukan prediksi. Periksa koneksi internet kamu dan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const info =
    result && diseaseInfo[result.disease] ? diseaseInfo[result.disease] : null;

  return (
    <div className="max-w-md lg:max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      <div className="mb-6 lg:mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Deteksi Penyakit
        </h1>
        <p className="text-sm lg:text-base text-muted-foreground mt-1">
          Foto atau unggah gambar daun untuk dianalisis
        </p>
      </div>

      {/* Layout utama: 1 kolom di mobile, 2 kolom (Upload + Hasil) berdampingan di laptop */}
      <div className="lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        {/* Upload */}
        <Card className="mb-4 lg:mb-0 shadow-sm border-0 rounded-3xl lg:sticky lg:top-6">
          <CardContent className="p-5 lg:p-6">
            {image ? (
              <div className="relative">
                <img
                  src={image}
                  alt="Preview"
                  className="rounded-2xl w-full h-64 lg:h-80 object-cover"
                />
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur">
                  Preview
                </span>
              </div>
            ) : (
              <div className="h-64 lg:h-80 border-2 border-dashed rounded-2xl flex items-center justify-center">
                <div className="text-center px-6">
                  <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                    <Leaf size={26} className="text-green-600" />
                  </div>

                  <p className="font-medium">Belum ada gambar</p>

                  <p className="text-sm text-muted-foreground mt-1">
                    Ambil foto langsung atau pilih dari galeri
                  </p>
                </div>
              </div>
            )}

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImage}
              className="hidden"
            />

            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-3 mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => cameraInputRef.current?.click()}
              >
                <Camera className="mr-2 h-4 w-4" />
                Ambil Foto
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => galleryInputRef.current?.click()}
              >
                <ImageIcon className="mr-2 h-4 w-4" />
                Pilih Galeri
              </Button>
            </div>

            <Button
              onClick={handlePredict}
              disabled={loading || !selectedFile}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menganalisis...
                </>
              ) : (
                "Deteksi Penyakit"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Hasil Prediksi */}
        <Card className="shadow-sm border-0 rounded-3xl">
          <CardContent className="p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-5">
              <Leaf className="text-green-600" />
              <h2 className="font-bold text-xl">Hasil Analisis</h2>
            </div>

            {result && result.plant ? (
              <div className="space-y-5">
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
                    {result.plant.charAt(0).toUpperCase() +
                      result.plant.slice(1)}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold leading-tight">
                    {info?.name || result.disease}
                  </h3>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      Tingkat Kepercayaan
                    </span>

                    <span className="font-bold text-green-600">
                      {result.confidence}%
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-green-500 transition-all duration-700 ease-out"
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>

                {info && (
                  <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                    <h4 className="font-semibold text-green-700 mb-3">
                      Rekomendasi Penanganan
                    </h4>

                    <ul className="list-disc ml-5 space-y-2 text-sm">
                      {info.solution.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 lg:py-24 lg:flex lg:flex-col lg:items-center lg:justify-center lg:h-full">
                <AlertCircle size={42} className="mx-auto mb-3 text-gray-400" />

                <p className="font-medium text-gray-500">
                  Belum ada hasil analisis
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Upload gambar daun terlebih dahulu
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Popup Alert Custom */}
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
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <XCircle size={26} className="text-red-500" />
              </div>

              <button
                onClick={() => setAlertInfo(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-lg font-bold mb-1.5">{alertInfo.title}</h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {alertInfo.message}
            </p>

            <Button
              onClick={() => setAlertInfo(null)}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Mengerti
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}