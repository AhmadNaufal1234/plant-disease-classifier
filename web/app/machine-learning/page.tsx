"use client";

import { useEffect, useState } from "react";

interface EvaluationData {
  k_value: number;
  train_test_split: string;
  total_testing: number;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
}

interface DatasetData {
  total_dataset: number;
  training_count: number;
  testing_count: number;
  training_preview: string[];
  testing_preview: string[];
}

export default function MachineLearningPage() {
  const [evaluation, setEvaluation] =
    useState<EvaluationData | null>(null);

  const [dataset, setDataset] =
    useState<DatasetData | null>(null);

  useEffect(() => {
    fetch("/api/evaluation")
      .then((res) => res.json())
      .then((data) => setEvaluation(data))
      .catch((err) => console.error(err));

    fetch("/api/dataset")
      .then((res) => res.json())
      .then((data) => setDataset(data))
      .catch((err) => console.error(err));
  }, []);

  if (!evaluation || !dataset) {
    return (
      <div className="flex justify-center items-center h-screen">
        Memuat data machine learning...
      </div>
    );
  }

  return (
  <div className="max-w-md mx-auto p-4 pb-32">

    {/* Header */}
    <div className="mb-6">

      <h1 className="text-3xl font-bold">
        Machine Learning
      </h1>

      <p className="text-sm text-muted-foreground">
        Evaluasi model KNN AgroScan AI
      </p>

    </div>

    {/* Hero */}
    <div className="
      rounded-3xl
      p-5
      mb-4
      text-white
      bg-gradient-to-br
      from-purple-600
      via-blue-600
      to-cyan-500
    ">

      <h2 className="text-xl font-bold">
        K-Nearest Neighbor
      </h2>

      <p className="text-sm opacity-90 mt-2">
        Model klasifikasi penyakit daun
        berbasis HSV dan GLCM
      </p>

      <div className="flex gap-2 mt-4">

        <span className="
          px-3 py-1
          rounded-full
          bg-white/20
          text-xs
        ">
          K = {evaluation.k_value}
        </span>

        <span className="
          px-3 py-1
          rounded-full
          bg-white/20
          text-xs
        ">
          {evaluation.train_test_split}
        </span>

      </div>

    </div>

    {/* Statistik */}
    <div className="grid grid-cols-2 gap-3 mb-4">

      <div className="
        rounded-2xl
        border
        p-4
        text-center
      ">

        <p className="text-sm text-muted-foreground">
          Dataset
        </p>

        <h3 className="
          text-2xl
          font-bold
          text-green-600
        ">
          {dataset.total_dataset}
        </h3>

      </div>

      <div className="
        rounded-2xl
        border
        p-4
        text-center
      ">

        <p className="text-sm text-muted-foreground">
          Testing
        </p>

        <h3 className="
          text-2xl
          font-bold
          text-blue-600
        ">
          {dataset.testing_count}
        </h3>

      </div>

    </div>

    {/* Evaluasi */}
    <div className="
      border
      rounded-3xl
      p-5
      mb-4
    ">

      <h2 className="
        text-lg
        font-bold
        mb-4
      ">
        Hasil Evaluasi
      </h2>

      <div className="
        grid
        grid-cols-2
        gap-3
      ">

        <div className="
          rounded-2xl
          bg-green-50
          p-4
          text-center
        ">
          <p className="text-xs">
            Accuracy
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-green-600
          ">
            {(evaluation.accuracy * 100).toFixed(2)}%
          </h3>
        </div>

        <div className="
          rounded-2xl
          bg-blue-50
          p-4
          text-center
        ">
          <p className="text-xs">
            Precision
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-blue-600
          ">
            {(evaluation.precision * 100).toFixed(2)}%
          </h3>
        </div>

        <div className="
          rounded-2xl
          bg-orange-50
          p-4
          text-center
        ">
          <p className="text-xs">
            Recall
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-orange-600
          ">
            {(evaluation.recall * 100).toFixed(2)}%
          </h3>
        </div>

        <div className="
          rounded-2xl
          bg-purple-50
          p-4
          text-center
        ">
          <p className="text-xs">
            F1 Score
          </p>

          <h3 className="
            text-2xl
            font-bold
            text-purple-600
          ">
            {(evaluation.f1_score * 100).toFixed(2)}%
          </h3>
        </div>

      </div>

    </div>

    {/* Detail Model */}
    <div className="
      border
      rounded-3xl
      p-5
    ">

      <h2 className="
        text-lg
        font-bold
        mb-4
      ">
        Detail Model
      </h2>

      <div className="space-y-3">

        <div className="
          flex
          justify-between
        ">
          <span>Algoritma</span>
          <strong>KNN</strong>
        </div>

        <div className="
          flex
          justify-between
        ">
          <span>Fitur</span>
          <strong>HSV + GLCM</strong>
        </div>

        <div className="
          flex
          justify-between
        ">
          <span>Training Data</span>
          <strong>
            {dataset.training_count}
          </strong>
        </div>

        <div className="
          flex
          justify-between
        ">
          <span>Testing Data</span>
          <strong>
            {dataset.testing_count}
          </strong>
        </div>

        <div className="
          flex
          justify-between
        ">
          <span>Backend</span>
          <strong>Flask API</strong>
        </div>

      </div>

    </div>

  </div>
);
}