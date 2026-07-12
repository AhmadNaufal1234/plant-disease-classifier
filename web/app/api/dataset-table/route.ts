import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {

    const csvPath = path.join(
      process.cwd(),
      "..",
      "ml",
      "features",
      "train_features.csv"
    );

    const csv = fs.readFileSync(
      csvPath,
      "utf8"
    );

    const lines = csv
      .split("\n")
      .filter(Boolean);

    const headers =
      lines[0].split(",");

    const plantIndex =
  headers.findIndex(
    (h) =>
      h.trim().toLowerCase() ===
      "plant"
  );

const labelIndex =
  headers.findIndex(
    (h) =>
      h.trim().toLowerCase() ===
      "label"
  );

    const data = lines
      .slice(1)
      .map((line, index) => {

        const cols =
          line.split(",");

        return {
  id: index + 1,
  plant:
    cols[plantIndex],
  disease:
    cols[labelIndex],
};
      });

    return NextResponse.json(
      data
    );

  } catch (error) {

    return NextResponse.json(
      {
        error:
          "Failed to load dataset",
      },
      { status: 500 }
    );

  }
}