import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {

  const filePath = path.join(
    process.cwd(),
    "..",
    "ml",
    "features",
    "train_features.csv"
  );

  const csv = fs.readFileSync(filePath, "utf8");

  const lines = csv
    .trim()
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .slice(1);

  const count: Record<string, number> = {};

  lines.forEach((line) => {

    const cols = line.split(",").map((c) => c.trim());

    const plant = cols[19];
    const disease = cols[20];

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