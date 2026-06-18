import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Fungsi untuk mengambil semua file secara rekursif
function getAllFiles(
  dir: string,
  base = "",
  files: string[] = []
): string[] {
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(base, item);

    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, relativePath, files);
    } else {
      files.push(relativePath.replace(/\\/g, "/"));
    }
  }

  return files;
}

export async function GET() {
  try {
    const datasetRoot = path.join(
      process.cwd(),
      "..",
      "ml",
      "dataset"
    );

    const trainingPath = path.join(
      datasetRoot,
      "training"
    );

    const testingPath = path.join(
      datasetRoot,
      "testing"
    );

    const trainingFiles = getAllFiles(trainingPath);
    const testingFiles = getAllFiles(testingPath);

    return NextResponse.json({
      total_dataset:
        trainingFiles.length + testingFiles.length,

      training_count: trainingFiles.length,
      testing_count: testingFiles.length,

      training_preview: trainingFiles.slice(0, 5),
      testing_preview: testingFiles.slice(0, 5),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Gagal membaca dataset",
      },
      {
        status: 500,
      }
    );
  }
}