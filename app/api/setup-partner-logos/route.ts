import { NextResponse } from 'next/server';

export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  const sql = `
    CREATE TABLE IF NOT EXISTS partner_logos (
      id           TEXT PRIMARY KEY,
      logo_url     TEXT NOT NULL,
      logo_variant TEXT NOT NULL DEFAULT 'color',
      updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    ALTER TABLE partner_logos ENABLE ROW LEVEL SECURITY;
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'partner_logos' AND policyname = 'Public read partner_logos'
      ) THEN
        CREATE POLICY "Public read partner_logos" ON partner_logos FOR SELECT USING (true);
      END IF;
    END $$;
    DO $$ BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'partner_logos' AND policyname = 'Auth manage partner_logos'
      ) THEN
        CREATE POLICY "Auth manage partner_logos" ON partner_logos FOR ALL USING (auth.role() = 'authenticated');
      END IF;
    END $$;
  `;

  // Try Supabase SQL via pg endpoint
  const res = await fetch(`${url}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
      'Content-Type': 'application/json',
      'Prefer': 'params=single-object',
    },
  });

  // Fallback: try to just SELECT from the table — if it doesn't exist we'll get error
  const checkRes = await fetch(`${url}/rest/v1/partner_logos?limit=1`, {
    headers: {
      'apikey': key,
      'Authorization': `Bearer ${key}`,
    },
  });

  if (checkRes.ok) {
    return NextResponse.json({ ok: true, message: 'Таблица partner_logos уже существует' });
  }

  // Table doesn't exist — return SQL for manual creation
  return NextResponse.json({
    ok: false,
    message: 'Таблица не найдена. Выполните SQL в Supabase Dashboard.',
    sql: sql.trim(),
  }, { status: 200 });
}
