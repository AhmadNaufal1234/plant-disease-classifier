"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { XCircle, CheckCircle2, X, LogOut, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";

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

interface AlertState {
  type: "success" | "error";
  title: string;
  message: string;
}

const ROWS_PER_PAGE = 10;

// Peta nama kelas mentah (dari dataset/model) ke nama yang mudah dipahami.
// Sama seperti yang dipakai di halaman Riwayat & Deteksi agar konsisten di seluruh aplikasi.
const diseaseNames: Record<string, string> = {
  bacterial_spot: "Bercak Bakteri",
  early_blight: "Busuk Daun Awal",
  late_blight: "Busuk Daun Lanjut",
  leaf_mold: "Jamur Daun",
  healthy: "Tanaman Sehat",
};

const toFriendlyName = (rawName: string) => {
  if (diseaseNames[rawName]) return diseaseNames[rawName];
  // fallback: rapikan nama mentah kalau key tidak dikenali (misal ada kelas baru)
  return rawName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function MachineLearningPage() {
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<EvaluationData | null>(null);
  const [dataset, setDataset] = useState<DatasetData | null>(null);
  const [distribution, setDistribution] = useState<any[]>([]);
  const [kValue, setKValue] = useState(5);
  const [split, setSplit] = useState("80:20");
  const [loading, setLoading] = useState(false);
  const [datasetRows, setDatasetRows] = useState<any[]>([]);
  const [alertInfo, setAlertInfo] = useState<AlertState | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [distPage, setDistPage] = useState(1);

  const showAlert = (type: "success" | "error", title: string, message: string) => {
    setAlertInfo({ type, title, message });
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await fetch("/api/admin-logout", { method: "POST" });
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
      setLoggingOut(false);
      showAlert("error", "Gagal Logout", "Terjadi kesalahan saat logout. Coba lagi.");
    }
  };

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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ k: kValue, split: split }),
      });

      if (!response.ok) {
        throw new Error("Gagal menjalankan evaluasi");
      }

      const result = await response.json();
      setEvaluation(result);

      showAlert(
        "success",
        "Evaluasi Berhasil",
        `Model berhasil dievaluasi dengan K=${kValue} dan split ${split}. Accuracy: ${(result.accuracy * 100).toFixed(1)}%.`
      );
    } catch (error) {
      console.error(error);
      showAlert("error", "Evaluasi Gagal", "Gagal terhubung ke Flask API. Periksa koneksi internet kamu dan coba lagi.");
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

  const maxTotal =
    distribution.length > 0 ? Math.max(...distribution.map((d) => d.total)) : 0;

  const totalDistPages = Math.max(1, Math.ceil(distribution.length / ROWS_PER_PAGE));
  const currentDistPage = Math.min(distPage, totalDistPages);
  const distStartIdx = (currentDistPage - 1) * ROWS_PER_PAGE;
  const pagedDistribution = distribution.slice(distStartIdx, distStartIdx + ROWS_PER_PAGE);

  // Fallback aman: coba turunkan nama kelas confusion matrix dari data distribusi
  // (diurutkan alfabetis, sesuai default umum scikit-learn/PyTorch). Kalau jumlah
  // kelasnya tidak cocok dengan confusion matrix, kembali pakai label generik K1, K2, dst
  // supaya tidak menampilkan informasi yang berpotensi salah.
  const sortedRawClassNames = [...distribution]
    .map((d) => d.name)
    .sort((a, b) => a.localeCompare(b));

  const confusionClassLabels =
    sortedRawClassNames.length === evaluation.confusion_matrix.length
      ? sortedRawClassNames.map((name) => toFriendlyName(name))
      : null;

  const getConfusionLabel = (index: number) =>
    confusionClassLabels ? confusionClassLabels[index] : `K${index + 1}`;

  return (
    <div className="max-w-md lg:max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 pb-32">
      {/* Header */}
      <div className="mb-6 lg:mb-8 flex items-start justify-between gap-3">
  <div>
    <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Machine Learning</h1>
    <p className="text-sm lg:text-base text-muted-foreground mt-1">
      Evaluasi model KNN AgroScan AI
    </p>
  </div>

  <div className="flex items-center gap-2 shrink-0">
    <button
      onClick={() => router.push("/tambah-admin")}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm text-green-700 hover:bg-green-50 transition"
    >
      <UserPlus size={16} />
      <span className="hidden sm:inline">Tambah Admin</span>
    </button>

    <button
      onClick={() => setShowLogoutConfirm(true)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm text-red-600 hover:bg-red-50 transition"
    >
      <LogOut size={16} />
      <span className="hidden sm:inline">Logout</span>
    </button>
  </div>
</div>

      {/* Hero — identitas model */}
      <div className="rounded-3xl p-6 lg:p-8 mb-4 lg:mb-6 text-white bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 shadow-lg shadow-blue-600/10">
        <h2 className="text-xl lg:text-2xl font-bold">K-Nearest Neighbor</h2>
        <p className="text-sm lg:text-base opacity-90 mt-1.5 leading-relaxed lg:max-w-xl">
          Klasifikasi penyakit daun berbasis fitur HSV dan GLCM
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs lg:text-sm font-medium">
            K = {kValue}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs lg:text-sm font-medium">
            Split {split}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs lg:text-sm font-medium">
            {trainingData} Train · {testingData} Test
          </span>
        </div>
      </div>

      {/* Layout utama: 1 kolom di mobile, 2 kolom (sidebar + konten) di laptop */}
      <div className="lg:grid lg:grid-cols-3 lg:gap-6 lg:items-start">
        {/* Kolom kiri: Konfigurasi + Ringkasan (sticky di laptop) */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-4 lg:space-y-6">
          {/* Konfigurasi & Jalankan Evaluasi */}
          <div className="border rounded-3xl p-5 lg:p-6">
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

          {/* Ringkasan Model & Dataset */}
          <div className="border rounded-3xl p-5 lg:p-6">
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

        {/* Kolom kanan: Hasil Evaluasi + Confusion Matrix */}
        <div className="lg:col-span-2 space-y-4 lg:space-y-6 mt-4 lg:mt-0">
          {/* Hasil Evaluasi — metrik utama */}
          <div className="border rounded-3xl p-5 lg:p-6">
            <h2 className="text-lg font-bold mb-4">Hasil Evaluasi</h2>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
          <div className="border rounded-3xl p-5 lg:p-6">
            <h2 className="text-lg font-bold mb-1.5">Confusion Matrix</h2>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Nilai diagonal (hijau) menunjukkan prediksi yang tepat
              {!confusionClassLabels && (
                <span className="block text-[11px] text-amber-600 mt-1">
                  Nama kelas belum bisa dipastikan otomatis, masih memakai label K1, K2, dst.
                </span>
              )}
            </p>

            <div className="overflow-x-auto">
              <table className="border-collapse mx-auto">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    {evaluation.confusion_matrix.map((_, j) => (
                      <th
                        key={j}
                        className="p-2 text-xs text-muted-foreground font-medium whitespace-nowrap"
                      >
                        {getConfusionLabel(j)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evaluation.confusion_matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="p-2 text-xs text-muted-foreground font-medium whitespace-nowrap">
                        {getConfusionLabel(i)}
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
        </div>
      </div>

      {/* Distribusi Dataset per Kelas — full width, tabel dengan pagination client-side */}
      <div className="border rounded-3xl p-5 lg:p-6 mt-4 lg:mt-6 mb-16">
        <div className="flex items-start justify-between gap-3 mb-1.5 flex-wrap">
          <h2 className="text-lg font-bold">Distribusi Dataset</h2>
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-medium whitespace-nowrap">
            Split saat ini: {split}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-5">
          Jumlah data pada tiap kelas penyakit, dibagi menjadi training dan testing sesuai pengaturan split ({splitTrain}% training / {splitTest}% testing)
        </p>

        {distribution.length === 0 ? (
          <p className="text-sm text-muted-foreground">Data distribusi belum tersedia.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground">
                      Kelas
                    </th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">
                      Total
                    </th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">
                      Training
                    </th>
                    <th className="text-right py-2.5 px-3 font-medium text-muted-foreground">
                      Testing
                    </th>
                    <th className="text-left py-2.5 px-3 font-medium text-muted-foreground w-1/3">
                      Proporsi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pagedDistribution.map((item, i) => {
                    const percentage = maxTotal > 0 ? (item.total / maxTotal) * 100 : 0;
                    const classTraining = Math.round((item.total * splitTrain) / 100);
                    const classTesting = item.total - classTraining;

                    return (
                      <tr key={distStartIdx + i} className="border-b last:border-0">
                        <td className="py-3 px-3 font-medium whitespace-nowrap">
                          {toFriendlyName(item.name)}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-gray-700">
                          {item.total}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-blue-600">
                          {classTraining}
                        </td>
                        <td className="py-3 px-3 text-right font-semibold text-orange-600">
                          {classTesting}
                        </td>
                        <td className="py-3 px-3">
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden flex">
                            <div
                              className="bg-blue-500 h-2.5"
                              style={{
                                width: `${
                                  item.total > 0 ? (classTraining / item.total) * percentage : 0
                                }%`,
                              }}
                            />
                            <div
                              className="bg-orange-400 h-2.5"
                              style={{
                                width: `${
                                  item.total > 0 ? (classTesting / item.total) * percentage : 0
                                }%`,
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend warna training/testing */}
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                Training
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-400 inline-block" />
                Testing
              </div>
            </div>

            {/* Pagination */}
            {totalDistPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">
                  Menampilkan {distStartIdx + 1}-
                  {Math.min(distStartIdx + ROWS_PER_PAGE, distribution.length)} dari{" "}
                  {distribution.length} kelas
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDistPage((p) => Math.max(1, p - 1))}
                    disabled={currentDistPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <span className="text-xs font-medium min-w-[3.5rem] text-center">
                    {currentDistPage} / {totalDistPages}
                  </span>

                  <button
                    onClick={() => setDistPage((p) => Math.min(totalDistPages, p + 1))}
                    disabled={currentDistPage === totalDistPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Popup Alert Custom (sukses / gagal) */}
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
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  alertInfo.type === "success" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {alertInfo.type === "success" ? (
                  <CheckCircle2 size={26} className="text-green-500" />
                ) : (
                  <XCircle size={26} className="text-red-500" />
                )}
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

            <button
              onClick={() => setAlertInfo(null)}
              className={`w-full py-3 rounded-xl text-white font-medium active:scale-[0.99] transition ${
                alertInfo.type === "success"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* Popup Konfirmasi Logout */}
      {showLogoutConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => !loggingOut && setShowLogoutConfirm(false)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <LogOut size={22} className="text-red-500" />
              </div>

              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="text-gray-400 hover:text-gray-600 transition disabled:opacity-40"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-lg font-bold mb-1.5">Konfirmasi Logout</h3>

            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Kamu akan keluar dari sesi admin. Lanjutkan?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-xl border font-medium hover:bg-gray-50 active:scale-[0.99] transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 active:scale-[0.99] transition disabled:opacity-50"
              >
                {loggingOut ? "Memproses..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}