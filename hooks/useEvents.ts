'use client';
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { events as baseEvents, type CalendarEvent } from "@/lib/data/events";
import { mergeEvents, type EventOverrideRow } from "@/lib/events-merge";

export function useMergedEvents(): { events: CalendarEvent[]; loading: boolean } {
  const [overrides, setOverrides] = useState<EventOverrideRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("event_overrides").select("*").limit(2000);
      if (cancelled) return;
      if (!error && data) setOverrides(data as unknown as EventOverrideRow[]);
      setLoading(false);
    })();

    const channel = supabase
      .channel("event_overrides_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event_overrides" },
        async () => {
          const { data } = await supabase.from("event_overrides").select("*").limit(2000);
          if (data) setOverrides(data as unknown as EventOverrideRow[]);
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, []);

  const merged = useMemo(() => mergeEvents(baseEvents, overrides), [overrides]);
  return { events: merged, loading };
}
