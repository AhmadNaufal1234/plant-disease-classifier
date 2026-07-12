"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface EvaluationData {
  k_value: number;
  train_test_split: string;
  total_testing: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  confusion_matrix: number[][];
}

interface DatasetData {
  total_dataset: number;
  training_count: number;
  testing_count: number;
  training_preview: string[];
  testing_preview: string[];
}

export default function MachineLearningPage() {
  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [dataset, setDataset] = useState<DatasetData | null>(null);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [kValue, setKValue] = useState(5);
  const [split, setSplit] = useState("80:20");
  const [loading, setLoading] = useState(false);
  const [datasetRows, setDatasetRows] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/evaluation")
      .then((res) => res.json())
      .then((data) => setEvaluation(data))
      .catch((err) => console.error(err));

    fetch("/api/dataset")
      .then((res) => res.json())
      .then((data) => setDataset(data))
      .catch((err) => console.error(err));

    fetch("/api/dataset-table")
      .then((res) => res.json())
      .then((data) => setDatasetRows(data))
      .catch((err) => console.error(err));

    fetch("/api/dataset-distribution")
      .then((res) => res.json())
      .then((data) => setDistribution(data))
      .catch((err) => console.error(err));
  }, []);

  const handleEvaluate = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:5000/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k: kValue, split: split }),
      });

      if (!response.ok) {
        throw new Error("Gagal menjalankan evaluasi");
      }

      const result = await response.json();
      setEvaluation(result);
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke Flask API");
    } finally {
      setLoading(false);
    }
  };

  if (!evaluation || !dataset) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat data machine learning...
      </div>
    );
  }

  const totalDataset = dataset.total_dataset;
  const splitTrain = Number(split.split(":")[0]);
  const splitTest = Number(split.split(":")[1]);
  const trainingData = Math.round((totalDataset * splitTrain) / 100);
  const testingData = Math.round((totalDataset * splitTest) / 100);

  const metrics = [
    {
      label: "Accuracy",
      desc: "Ketepatan prediksi secara keseluruhan",
      value: evaluation.accuracy,
      bg: "bg-green-50",
      text: "text-green-600",
    },
    {
      label: "Precision",
      desc: "Ketepatan saat memprediksi kelas positif",
      value: evaluation.precision,
      bg: "bg-blue-50",
      text: "text-blue-600",
    },
    {
      label: "Recall",
      desc: "Kemampuan menemukan data positif",
      value: evaluation.recall,
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    {
      label: "F1 Score",
      desc: "Keseimbangan precision & recall",
      value: evaluation.f1_score,
      bg: "bg-purple-50",
      text: "text-purple-600",
    },
  ];

  return (
    <div className="max-w-md mx-auto p-4 pb-32">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Machine Learning</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Evaluasi model KNN AgroScan AI
        </p>
      </div>

      {/* Hero — identitas model */}
      <div className="rounded-3xl p-6 mb-4 text-white bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 shadow-lg shadow-blue-600/10">
        <h2 className="text-xl font-bold">K-Nearest Neighbor</h2>
        <p className="text-sm opacity-90 mt-1.5 leading-relaxed">
          Klasifikasi penyakit daun berbasis fitur HSV dan GLCM
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
            K = {kValue}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
            Split {split}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
            {trainingData} Train · {testingData} Test
          </span>
        </div>
      </div>

      {/* Konfigurasi & Jalankan Evaluasi */}
      <div className="border rounded-3xl p-5 mb-4">
        <h2 className="font-bold text-lg mb-4">Pengaturan Evaluasi</h2>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Split Dataset
            </label>
            <select
              value={split}
              onChange={(e) => setSplit(e.target.value)}
              className="w-full border rounded-xl p-2.5 mt-1.5 text-sm"
            >
              <option value="70:30">70 : 30</option>
              <option value="80:20">80 : 20</option>
              <option value="90:10">90 : 10</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground">
              Nilai K
            </label>
            <select
              value={kValue}
              onChange={(e) => setKValue(Number(e.target.value))}
              className="w-full border rounded-xl p-2.5 mt-1.5 text-sm"
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleEvaluate}
          disabled={loading}
          className="w-full mt-4 py-3 rounded-xl bg-green-600 text-white font-medium disabled:opacity-50 hover:bg-green-700 active:scale-[0.99] transition"
        >
          {loading ? "Memproses..." : "Jalankan Evaluasi"}
        </button>
      </div>

      {/* Hasil Evaluasi — metrik utama */}
      <div className="border rounded-3xl p-5 mb-4">
        <h2 className="text-lg font-bold mb-4">Hasil Evaluasi</h2>

        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className={`rounded-2xl ${m.bg} p-4`}>
              <p className="text-xs font-medium">{m.label}</p>
              <h3 className={`text-2xl font-bold ${m.text} mt-1`}>
                {(m.value * 100).toFixed(1)}%
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1.5 leading-snug">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Confusion Matrix */}
      <div className="border rounded-3xl p-5 mb-4">
        <h2 className="text-lg font-bold mb-1.5">Confusion Matrix</h2>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          Nilai diagonal (hijau) menunjukkan prediksi yang tepat
        </p>

        <div className="overflow-x-auto">
          <table className="border-collapse mx-auto">
            <thead>
              <tr>
                <th className="p-2"></th>
                {evaluation.confusion_matrix.map((_, j) => (
                  <th key={j} className="p-2 text-xs text-muted-foreground font-medium">
                    K{j + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {evaluation.confusion_matrix.map((row, i) => (
                <tr key={i}>
                  <td className="p-2 text-xs text-muted-foreground font-medium whitespace-nowrap">
                    K{i + 1}
                  </td>
                  {row.map((value, j) => {
                    const diagonal = i === j;
                    return (
                      <td
                        key={j}
                        className={`border rounded-lg p-3 text-center font-semibold ${
                          diagonal
                            ? "bg-green-100 text-green-700"
                            : "bg-red-50 text-gray-700"
                        }`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Distribusi Dataset per Kelas */}
      <div className="border rounded-3xl p-5 mb-4">
        <h2 className="text-lg font-bold mb-1.5">Distribusi Dataset</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Jumlah data pada tiap kelas penyakit
        </p>

        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <BarChart data={distribution}>
              <XAxis
                dataKey="name"
                angle={-25}
                textAnchor="end"
                interval={0}
                height={75}
                fontSize={11}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ringkasan Model & Dataset */}
      <div className="border rounded-3xl p-5">
        <h2 className="text-lg font-bold mb-4">Ringkasan</h2>

        <div className="space-y-3 text-sm">
          {[
            ["Algoritma", "K-Nearest Neighbor"],
            ["Fitur", "HSV + GLCM"],
            ["Total Dataset", String(dataset.total_dataset)],
            ["Data Training", String(dataset.training_count)],
            ["Data Testing", String(dataset.testing_count)],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-muted-foreground">{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}