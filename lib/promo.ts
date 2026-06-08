import type { CalendarEvent } from "@/lib/data/events";

export function isPromo(e: CalendarEvent): boolean {
  return e.kind === "promo" || e.kind === "championship";
}

export function promoLabel(e: CalendarEvent): string {
  if (e.kind === "championship") return "КОНКУРС";
  if (e.kind === "promo") return "АКЦИЯ";
  return "";
}

/** Стиль градиента для маркеров акций/конкурсов на календаре. */
export interface PromoStyle {
  id: string;
  label: string;
  /** Превью-градиент для UI селектора. */
  swatch: string;
  /** Класс для верхней полоски (h-1) в ячейке календаря. */
  strip: string;
  /** Класс badge'а (фон + текст) для бейджей "АКЦИЯ" / "К". */
  badge: string;
  /** Класс рамки/фона пустой ячейки-акции. */
  cell: string;
  /** Левая цветная граница для карточки в модалке/листе. */
  border: string;
  /** Цвет shadow-glow для бейджа. */
  ring: string;
}

export const PROMO_STYLES: PromoStyle[] = [
  // Фуксия / оранжевый (по умолчанию для promo)
  {
    id: "fuchsia-orange",
    label: "Фуксия → Оранжевый",
    swatch: "linear-gradient(90deg, oklch(0.65 0.27 330), oklch(0.72 0.2 50))",
    strip: "bg-gradient-to-r from-fuchsia-500/80 to-orange-500/80",
    badge: "bg-gradient-to-r from-fuchsia-500 to-orange-500 text-white border-fuchsia-400/70",
    cell: "border-fuchsia-500/40 bg-fuchsia-500/10 hover:bg-fuchsia-500/20 hover:border-fuchsia-500",
    border: "border-l-fuchsia-500",
    ring: "shadow-[0_0_14px_oklch(0.7_0.22_330/0.45)]",
  },
  {
    id: "pink-rose",
    label: "Розовый → Малиновый",
    swatch: "linear-gradient(90deg, oklch(0.72 0.2 350), oklch(0.6 0.22 10))",
    strip: "bg-gradient-to-r from-pink-400/80 to-rose-600/80",
    badge: "bg-gradient-to-r from-pink-400 to-rose-600 text-white border-pink-300/70",
    cell: "border-pink-500/40 bg-pink-500/10 hover:bg-pink-500/20 hover:border-pink-500",
    border: "border-l-pink-500",
    ring: "shadow-[0_0_14px_oklch(0.7_0.2_350/0.45)]",
  },
  {
    id: "magenta-red",
    label: "Магента → Красный",
    swatch: "linear-gradient(90deg, oklch(0.55 0.27 340), oklch(0.6 0.24 25))",
    strip: "bg-gradient-to-r from-fuchsia-700/80 to-red-500/80",
    badge: "bg-gradient-to-r from-fuchsia-700 to-red-500 text-white border-fuchsia-500/70",
    cell: "border-fuchsia-600/40 bg-fuchsia-600/10 hover:bg-fuchsia-600/20 hover:border-fuchsia-600",
    border: "border-l-fuchsia-600",
    ring: "shadow-[0_0_14px_oklch(0.6_0.25_340/0.45)]",
  },

  // Янтарь / золото (по умолчанию для championship)
  {
    id: "amber",
    label: "Янтарь",
    swatch: "linear-gradient(90deg, oklch(0.85 0.16 85), oklch(0.78 0.18 70))",
    strip: "bg-amber-400/80",
    badge: "bg-amber-400 text-black border-amber-300",
    cell: "border-amber-400/40 bg-amber-400/10 hover:bg-amber-400/20 hover:border-amber-400",
    border: "border-l-amber-400",
    ring: "shadow-[0_0_14px_oklch(0.82_0.14_80/0.45)]",
  },
  {
    id: "gold-amber",
    label: "Золото → Янтарь",
    swatch: "linear-gradient(90deg, oklch(0.78 0.16 90), oklch(0.7 0.18 55))",
    strip: "bg-gradient-to-r from-yellow-400/80 to-amber-600/80",
    badge: "bg-gradient-to-r from-yellow-400 to-amber-600 text-black border-yellow-300/70",
    cell: "border-yellow-500/40 bg-yellow-500/10 hover:bg-yellow-500/20 hover:border-yellow-500",
    border: "border-l-yellow-500",
    ring: "shadow-[0_0_14px_oklch(0.78_0.16_90/0.45)]",
  },
  {
    id: "orange-yellow",
    label: "Оранжевый → Жёлтый",
    swatch: "linear-gradient(90deg, oklch(0.72 0.2 50), oklch(0.85 0.18 95))",
    strip: "bg-gradient-to-r from-orange-500/80 to-yellow-300/80",
    badge: "bg-gradient-to-r from-orange-500 to-yellow-300 text-black border-orange-400/70",
    cell: "border-orange-500/40 bg-orange-500/10 hover:bg-orange-500/20 hover:border-orange-500",
    border: "border-l-orange-500",
    ring: "shadow-[0_0_14px_oklch(0.72_0.2_50/0.45)]",
  },

  // Зелёные
  {
    id: "green-emerald",
    label: "Зелёный → Изумруд",
    swatch: "linear-gradient(90deg, oklch(0.75 0.2 145), oklch(0.6 0.16 165))",
    strip: "bg-gradient-to-r from-green-400/80 to-emerald-600/80",
    badge: "bg-gradient-to-r from-green-400 to-emerald-600 text-white border-green-300/70",
    cell: "border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 hover:border-emerald-500",
    border: "border-l-emerald-500",
    ring: "shadow-[0_0_14px_oklch(0.7_0.18_150/0.45)]",
  },
  {
    id: "green-lime",
    label: "Лайм → Зелёный",
    swatch: "linear-gradient(90deg, oklch(0.88 0.2 130), oklch(0.65 0.2 145))",
    strip: "bg-gradient-to-r from-lime-400/80 to-green-600/80",
    badge: "bg-gradient-to-r from-lime-400 to-green-600 text-black border-lime-300/70",
    cell: "border-lime-500/40 bg-lime-500/10 hover:bg-lime-500/20 hover:border-lime-500",
    border: "border-l-lime-500",
    ring: "shadow-[0_0_14px_oklch(0.85_0.2_130/0.45)]",
  },
  {
    id: "green-teal",
    label: "Зелёный → Бирюза",
    swatch: "linear-gradient(90deg, oklch(0.7 0.18 155), oklch(0.65 0.14 195))",
    strip: "bg-gradient-to-r from-emerald-500/80 to-teal-500/80",
    badge: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400/70",
    cell: "border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/20 hover:border-teal-500",
    border: "border-l-teal-500",
    ring: "shadow-[0_0_14px_oklch(0.68_0.16_175/0.45)]",
  },

  // Синие
  {
    id: "blue-cyan",
    label: "Синий → Бирюза",
    swatch: "linear-gradient(90deg, oklch(0.6 0.22 255), oklch(0.78 0.14 210))",
    strip: "bg-gradient-to-r from-blue-500/80 to-cyan-400/80",
    badge: "bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-blue-400/70",
    cell: "border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/20 hover:border-blue-500",
    border: "border-l-blue-500",
    ring: "shadow-[0_0_14px_oklch(0.65_0.2_240/0.45)]",
  },
  {
    id: "blue-indigo",
    label: "Индиго → Синий",
    swatch: "linear-gradient(90deg, oklch(0.5 0.22 280), oklch(0.6 0.22 255))",
    strip: "bg-gradient-to-r from-indigo-600/80 to-blue-500/80",
    badge: "bg-gradient-to-r from-indigo-600 to-blue-500 text-white border-indigo-400/70",
    cell: "border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 hover:border-indigo-500",
    border: "border-l-indigo-500",
    ring: "shadow-[0_0_14px_oklch(0.55_0.22_270/0.45)]",
  },
  {
    id: "blue-sky",
    label: "Небесный → Синий",
    swatch: "linear-gradient(90deg, oklch(0.82 0.12 230), oklch(0.55 0.22 250))",
    strip: "bg-gradient-to-r from-sky-300/80 to-blue-600/80",
    badge: "bg-gradient-to-r from-sky-300 to-blue-600 text-white border-sky-200/70",
    cell: "border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 hover:border-sky-500",
    border: "border-l-sky-500",
    ring: "shadow-[0_0_14px_oklch(0.75_0.14_235/0.45)]",
  },
];

const STYLE_BY_ID = new Map(PROMO_STYLES.map((s) => [s.id, s]));

export function getPromoStyle(e: CalendarEvent): PromoStyle {
  if (e.promoStyle) {
    const s = STYLE_BY_ID.get(e.promoStyle);
    if (s) return s;
  }
  // Дефолты по типу
  const defId = e.kind === "championship" ? "amber" : "fuchsia-orange";
  return STYLE_BY_ID.get(defId)!;
}

export function promoBadgeClass(e: CalendarEvent): string {
  const s = getPromoStyle(e);
  return `${s.badge} ${s.ring}`;
}

export function promoAccent(e: CalendarEvent): {
  border: string;
  ring: string;
  cellBg: string;
} {
  const s = getPromoStyle(e);
  return {
    border: s.border,
    ring: `${s.cell.split(" ")[0]} ${s.cell.split(" ")[1]}`,
    cellBg: s.cell,
  };
}


export function formatPromoRange(
  startISO: string,
  endISO: string | undefined,
  lang: "ru" | "kz",
): string {
  const locale = lang === "kz" ? "kk-KZ" : "ru-RU";
  const start = new Date(startISO);
  const end = endISO ? new Date(endISO) : start;
  const fmt = (d: Date, withYear: boolean) =>
    d.toLocaleDateString(locale, {
      day: "numeric",
      month: "long",
      ...(withYear ? { year: "numeric" } : {}),
    });
  const sameYear = start.getFullYear() === end.getFullYear();
  return `Действует с ${fmt(start, !sameYear)} по ${fmt(end, true)}`;
}

/** Возвращает все даты ISO (YYYY-MM-DD) от start до end включительно. */
export function expandPromoDates(e: CalendarEvent): string[] {
  if (!e.endDate) return [e.date];
  const out: string[] = [];
  const cur = new Date(e.date);
  const end = new Date(e.endDate);
  while (cur <= end) {
    out.push(
      `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`,
    );
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

/** Активные сейчас акции/конкурсы — для тизера на главной. */
export function getActivePromos(
  events: CalendarEvent[],
  refDateISO: string,
): CalendarEvent[] {
  return events.filter((e) => {
    if (!isPromo(e)) return false;
    const start = e.date;
    const end = e.endDate ?? e.date;
    return start <= refDateISO && refDateISO <= end;
  });
}
