import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const flaskRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await flaskRes.json();

    if (!data.success) {
      return NextResponse.json(data, { status: 401 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (err) {
    console.error("Error calling Flask:", err);
    return NextResponse.json({ success: false, message: "Gagal terhubung ke server" }, { status: 500 });
  }
}