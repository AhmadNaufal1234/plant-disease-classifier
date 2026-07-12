import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    const filePath = path.join(
      process.cwd(),
      "..",
      "ml",
      "models",
      "evaluation_result.json"
    );

    const jsonData = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(jsonData);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: "Gagal membaca evaluation_result.json",
      },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
) {

  const body = await request.json();

  const { k, split } = body;

  let accuracy = 0.95;
  let precision = 0.94;
  let recall = 0.95;
  let f1 = 0.94;

  // Simulasi berdasarkan Nilai K
  if (k === 1) {
    accuracy = 0.91;
    precision = 0.90;
    recall = 0.91;
    f1 = 0.90;
  }

  if (k === 3) {
    accuracy = 0.95;
    precision = 0.94;
    recall = 0.95;
    f1 = 0.94;
  }

  if (k === 5) {
    accuracy = 0.93;
    precision = 0.92;
    recall = 0.93;
    f1 = 0.92;
  }

  return NextResponse.json({
    k_value: k,
    train_test_split: split,
    total_testing: Math.round(
      2100 *
      Number(split.split(":")[1]) /
      100
    ),
    accuracy,
    precision,
    recall,
    f1_score: f1,
  });

}