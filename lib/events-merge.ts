import type { CalendarEvent, EventKind, EventStatus } from "@/lib/data/events";

export interface EventOverrideRow {
  id: string;
  is_custom: boolean;
  deleted: boolean;
  date: string | null;
  end_date: string | null;
  kind: string | null;
  cta_label: string | null;
  promo_style: string | null;
  city: string | null;
  city_kz: string | null;
  title: string | null;
  title_kz: string | null;
  brands: string[] | null;
  status: string | null;
  note: string | null;
  note_kz: string | null;
  description: string | null;
  description_kz: string | null;
  time: string | null;
  venue: string | null;
  image_url: string | null;
  image_alt: string | null;
  gallery: { src: string; alt?: string }[] | null;
}

function applyOverride(base: CalendarEvent, ov: EventOverrideRow): CalendarEvent {
  return {
    ...base,
    date: ov.date ?? base.date,
    endDate: ov.end_date ?? base.endDate,
    kind: (ov.kind as EventKind) ?? base.kind,
    ctaLabel: ov.cta_label ?? base.ctaLabel,
    promoStyle: ov.promo_style ?? base.promoStyle,
    city: ov.city ?? base.city,
    cityKz: ov.city_kz ?? base.cityKz,
    title: ov.title ?? base.title,
    titleKz: ov.title_kz ?? base.titleKz,
    brands: ov.brands && ov.brands.length ? ov.brands : base.brands,
    status: (ov.status as EventStatus) ?? base.status,
    note: ov.note ?? base.note,
    noteKz: ov.note_kz ?? base.noteKz,
    description: ov.description ?? base.description,
    descriptionKz: ov.description_kz ?? base.descriptionKz,
    time: ov.time ?? base.time,
    venue: ov.venue ?? base.venue,
    imageUrl: ov.image_url ?? base.imageUrl,
    imageAlt: ov.image_alt ?? base.imageAlt,
    gallery: ov.gallery && ov.gallery.length ? ov.gallery : base.gallery,
  };
}

function fromCustom(ov: EventOverrideRow): CalendarEvent {
  return {
    id: ov.id,
    date: ov.date ?? new Date().toISOString().slice(0, 10),
    endDate: ov.end_date ?? undefined,
    kind: (ov.kind as EventKind) ?? undefined,
    ctaLabel: ov.cta_label ?? undefined,
    promoStyle: ov.promo_style ?? undefined,
    city: ov.city ?? "Алматы",
    cityKz: ov.city_kz ?? undefined,
    title: ov.title ?? "Без названия",
    titleKz: ov.title_kz ?? undefined,
    brands: ov.brands ?? [],
    status: (ov.status as EventStatus) ?? "open",
    note: ov.note ?? "",
    noteKz: ov.note_kz ?? undefined,
    description: ov.description ?? "",
    descriptionKz: ov.description_kz ?? undefined,
    time: ov.time ?? undefined,
    venue: ov.venue ?? undefined,
    imageUrl: ov.image_url ?? undefined,
    imageAlt: ov.image_alt ?? undefined,
    gallery: ov.gallery ?? undefined,
  };
}

export function mergeEvents(
  base: CalendarEvent[],
  overrides: EventOverrideRow[],
): CalendarEvent[] {
  const ovById = new Map(overrides.map((o) => [o.id, o]));
  const baseIds = new Set(base.map((e) => e.id));

  const merged: CalendarEvent[] = [];
  for (const b of base) {
    const ov = ovById.get(b.id);
    if (ov?.deleted) continue;
    merged.push(ov ? applyOverride(b, ov) : b);
  }
  for (const ov of overrides) {
    if (ov.is_custom && !ov.deleted && !baseIds.has(ov.id)) {
      merged.push(fromCustom(ov));
    }
  }
  return merged.sort((a, b) => a.date.localeCompare(b.date));
}
