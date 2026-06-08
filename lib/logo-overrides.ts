'use client';

import { createClient } from '@/lib/supabase/client';

export interface LogoOverride {
  id: string;         // partner name — primary key
  logo_url: string;
  logo_variant: 'color' | 'mono-light';
}

// Module-level cache so we only fetch once per browser session
let cache: Map<string, LogoOverride> | null = null;
let fetchPromise: Promise<Map<string, LogoOverride>> | null = null;

export async function getLogoOverrides(): Promise<Map<string, LogoOverride>> {
  if (cache) return cache;
  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from('partner_logos')
        .select('id, logo_url, logo_variant');
      const map = new Map<string, LogoOverride>();
      for (const row of (data ?? []) as LogoOverride[]) {
        map.set(row.id, row);
      }
      cache = map;
      return map;
    } catch {
      cache = new Map();
      return cache;
    }
  })();

  return fetchPromise;
}

export function invalidateLogoCache() {
  cache = null;
  fetchPromise = null;
}
