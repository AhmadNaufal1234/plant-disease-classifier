import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const flaskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await flaskRes.json();
    return NextResponse.json(data, { status: flaskRes.status });
  } catch (err) {
    console.error("Error calling Flask:", err);
    return NextResponse.json({ success: false, message: "Gagal terhubung ke server" }, { status: 500 });
  }
}