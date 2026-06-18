"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

export default function RiwayatPage() {
  const [history, setHistory] =
    useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(
        "detectionHistory"
      ) || "[]"
    );

    setHistory(data);
  }, []);

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

        <div>
          <h1 className="text-3xl font-bold">
            Riwayat
          </h1>

          <p className="text-sm text-muted-foreground">
            Hasil deteksi yang telah dilakukan
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => {
              localStorage.removeItem(
                "detectionHistory"
              );

              setHistory([]);
            }}
            className="
              p-2
              rounded-xl
              border
              hover:bg-red-50
              hover:border-red-200
              transition
            "
          >
            <Trash2
              size={18}
              className="text-red-500"
            />
          </button>
        )}

      </div>

      {history.length === 0 ? (
        <div className="
          border
          rounded-2xl
          p-8
          text-center
          bg-white
        ">
          <h3 className="font-semibold mb-2">
            Belum Ada Riwayat
          </h3>

          <p className="text-sm text-muted-foreground">
            Lakukan deteksi penyakit terlebih dahulu
          </p>
        </div>
      ) : (
        <div className="space-y-5">

          {history.map(
            (item, index) => (
              <div
                key={index}
                className="
                  overflow-hidden
                  rounded-3xl
                  border
                  bg-white
                  shadow-sm
                "
              >

                {item.image && (
                  <img
                    src={item.image}
                    alt="Daun"
                    className="
                      w-full
                      h-52
                      object-cover
                    "
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
                        .charAt(0)
                        .toUpperCase() +
                        item.plant.slice(1)}
                    </span>

                  </div>

                  {/* Nama Penyakit */}
                  <h2 className="
                    text-xl
                    font-bold
                    mb-3
                  ">
                    {diseaseNames[item.disease] ||
                      item.disease}
                  </h2>

                  {/* Confidence */}
                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-4
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
                      {item.confidence}%
                    </span>

                  </div>

                  {/* Progress */}
                  <div className="
                    w-full
                    h-2
                    rounded-full
                    bg-gray-200
                    overflow-hidden
                    mb-4
                  ">

                    <div
                      className="
                        h-full
                        bg-green-500
                      "
                      style={{
                        width: `${item.confidence}%`,
                      }}
                    />

                  </div>

                  {/* Tanggal */}
                  <p className="
                    text-xs
                    text-muted-foreground
                  ">
                    {item.date}
                  </p>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}