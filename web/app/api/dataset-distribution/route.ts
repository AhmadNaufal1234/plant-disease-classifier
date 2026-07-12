import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {

  const filePath = path.join(
    process.cwd(),
    "..",
    "ml",
    "features",
    "train_features.csv"
  );

  const csv = fs.readFileSync(filePath, "utf8");

  const lines = csv.trim().split("\n").slice(1);

  const count: Record<string, number> = {};

  lines.forEach((line) => {

    const cols = line.split(",");

    const plant = cols[7];

    const disease = cols[8];

    const key = `${plant} - ${disease}`;

    count[key] = (count[key] || 0) + 1;

  });

  const result = Object.entries(count).map(
    ([name, total]) => ({
      name,
      total,
    })
  );

  return NextResponse.json(result);

}