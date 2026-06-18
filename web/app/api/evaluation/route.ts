import { NextResponse } from "next/server";
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