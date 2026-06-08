import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json(
        { ok: false, error: "Message is required" },
        { status: 400 }
      );
    }

    const instanceId = process.env.ULTRAMSG_INSTANCE_ID;
    const token = process.env.ULTRAMSG_TOKEN;
    const adminPhone = process.env.ADMIN_WHATSAPP;

    if (!instanceId || !token || !adminPhone) {
      console.error("Missing UltraMsg environment variables");
      return NextResponse.json(
        { ok: false, error: "Configuration error" },
        { status: 500 }
      );
    }

    const url = `https://api.ultramsg.com/${instanceId}/messages/chat`;
    const body = new URLSearchParams({
      token,
      to: adminPhone,
      body: message,
      priority: "10",
    });

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();

    if (data.sent === "true" || data.sent === true) {
      return NextResponse.json({ ok: true });
    } else {
      console.error("UltraMsg error:", data);
      return NextResponse.json({ ok: false, error: data }, { status: 500 });
    }
  } catch (error) {
    console.error("send-whatsapp error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
