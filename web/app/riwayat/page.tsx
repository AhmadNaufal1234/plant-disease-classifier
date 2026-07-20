"use client";

import { useEffect, useState } from "react";
import { Trash2, X, History, Leaf } from "lucide-react";

interface DetectionItem {
  image?: string;
  plant: string;
  disease: string;
  confidence: number;
  date: string;
}

export default function RiwayatPage() {
  const [history, setHistory] = useState<DetectionItem[]>([]);
  const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = JSON.parse(
      localStorage.getItem("detectionHistory") || "[]"
    );
    // Filter data lama yang tidak lengkap/corrupt (misal tanpa field plant)
    const validData = data.filter(
      (item: any) => item && item.plant && item.disease
    );
    setHistory(validData);
  };

  const saveHistory = (data: DetectionItem[]) => {
    localStorage.setItem("detectionHistory", JSON.stringify(data));
    setHistory(data);
  };

  const handleDeleteOne = (index: number) => {
    const updated = history.filter((_, i) => i !== index);
    saveHistory(updated);
    setConfirmDeleteIndex(null);
  };

  const handleDeleteAll = () => {
    localStorage.removeItem("detectionHistory");
    setHistory([]);
    setConfirmDeleteAll(false);
  };

  const diseaseNames: Record<string, string> = {
    bacterial_spot: "Bercak Bakteri",
    early_blight: "Busuk Daun Awal",
    late_blight: "Busuk Daun Lanjut",
    leaf_mold: "Jamur Daun",
    healthy: "Tanaman Sehat",
  };

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-green-100">
            <History size={22} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold leading-tight">Riwayat</h1>
            <p className="text-sm text-muted-foreground">
              {history.length > 0
                ? `${history.length} hasil deteksi`
                : "Hasil deteksi yang telah dilakukan"}
            </p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setConfirmDeleteAll(true)}
            className="
              p-2.5
              rounded-xl
              border
              hover:bg-red-50
              hover:border-red-200
              active:scale-95
              transition
            "
            aria-label="Hapus semua riwayat"
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        )}
      </div>

      {/* Empty state */}
      {history.length === 0 ? (
        <div
          className="
            border
            rounded-2xl
            p-10
            text-center
            bg-white
            flex
            flex-col
            items-center
            gap-3
          "
        >
          <div className="p-4 rounded-full bg-green-50">
            <Leaf size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold">Belum Ada Riwayat</h3>
          <p className="text-sm text-muted-foreground">
            Lakukan deteksi penyakit terlebih dahulu
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {history.map((item, index) => (
            <div
              key={index}
              className="
                overflow-hidden
                rounded-3xl
                border
                bg-white
                shadow-sm
                hover:shadow-md
                transition-shadow
                relative
              "
            >
              {/* Per-item delete button */}
              <button
                onClick={() => setConfirmDeleteIndex(index)}
                className="
                  absolute
                  top-3
                  right-3
                  z-10
                  p-2
                  rounded-full
                  bg-white/90
                  backdrop-blur
                  border
                  shadow-sm
                  hover:bg-red-50
                  hover:border-red-200
                  active:scale-95
                  transition
                "
                aria-label="Hapus riwayat ini"
              >
                <Trash2 size={16} className="text-red-500" />
              </button>

              {item.image && (
                <img
                  src={item.image}
                  alt="Daun"
                  className="w-full h-52 object-cover"
                />
              )}

              <div className="p-5">
                {/* Badge */}
                <div className="mb-3">
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
                    {item.plant
                      ? item.plant.charAt(0).toUpperCase() + item.plant.slice(1)
                      : "Tidak diketahui"}
                  </span>
                </div>

                {/* Nama Penyakit */}
                <h2 className="text-xl font-bold mb-3">
                  {diseaseNames[item.disease] || item.disease}
                </h2>

                {/* Confidence */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    Tingkat Kepercayaan
                  </span>
                  <span className="font-bold text-green-600">
                    {item.confidence}%
                  </span>
                </div>

                {/* Progress */}
                <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden mb-4">
                  <div
                    className="h-full bg-green-500 transition-all"
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>

                {/* Tanggal */}
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm delete single item */}
      {confirmDeleteIndex !== null && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={() => setConfirmDeleteIndex(null)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-6
              w-full
              max-w-sm
              shadow-lg
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConfirmDeleteIndex(null)}
              className="absolute top-4 right-4 text-muted-foreground"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg mb-2">Hapus Riwayat?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Data hasil deteksi ini akan dihapus secara permanen.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteIndex(null)}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  border
                  font-medium
                  hover:bg-gray-50
                  transition
                "
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteOne(confirmDeleteIndex)}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  bg-red-500
                  text-white
                  font-medium
                  hover:bg-red-600
                  transition
                "
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete all */}
      {confirmDeleteAll && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/40
            p-4
          "
          onClick={() => setConfirmDeleteAll(false)}
        >
          <div
            className="
              bg-white
              rounded-2xl
              p-6
              w-full
              max-w-sm
              shadow-lg
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setConfirmDeleteAll(false)}
              className="absolute top-4 right-4 text-muted-foreground"
              aria-label="Tutup"
            >
              <X size={18} />
            </button>
            <h3 className="font-bold text-lg mb-2">Hapus Semua Riwayat?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Seluruh riwayat deteksi ({history.length} item) akan dihapus
              secara permanen dan tidak dapat dikembalikan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteAll(false)}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  border
                  font-medium
                  hover:bg-gray-50
                  transition
                "
              >
                Batal
              </button>
              <button
                onClick={handleDeleteAll}
                className="
                  flex-1
                  py-2.5
                  rounded-xl
                  bg-red-500
                  text-white
                  font-medium
                  hover:bg-red-600
                  transition
                "
              >
                Hapus Semua
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}