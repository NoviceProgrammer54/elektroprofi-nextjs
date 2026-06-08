import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  // Only allow in development or with secret header
  const authHeader = request.headers.get("x-seed-secret");
  const seedSecret = process.env.SEED_SECRET;

  if (seedSecret && authHeader !== seedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    return NextResponse.json(
      { error: "ADMIN_SEED_EMAIL and ADMIN_SEED_PASSWORD env vars required" },
      { status: 400 }
    );
  }

  try {
    const supabase = createAdminClient();

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const exists = existingUsers?.users?.some((u) => u.email === email);

    if (exists) {
      return NextResponse.json(
        { ok: false, message: "Admin user already exists" },
        { status: 200 }
      );
    }

    // Create admin user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Admin user created",
      userId: data.user?.id,
    });
  } catch (error) {
    console.error("seed-admin error:", error);
    return NextResponse.json(
      { ok: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
