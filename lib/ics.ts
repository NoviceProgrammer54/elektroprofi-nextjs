import type { CalendarEvent } from "@/lib/data/events";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function escapeICS(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function foldLine(line: string): string {
  // RFC 5545: lines should be <= 75 octets, fold with CRLF + space
  if (line.length <= 75) return line;
  const chunks: string[] = [];
  let i = 0;
  chunks.push(line.slice(0, 75));
  i = 75;
  while (i < line.length) {
    chunks.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return chunks.join("\r\n");
}

function toUTCStamp(d: Date): string {
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

function parseTime(time?: string): { startH: number; startM: number; endH: number; endM: number } {
  // Default: 10:00 – 17:00 local Almaty (UTC+5)
  const def = { startH: 10, startM: 0, endH: 17, endM: 0 };
  if (!time) return def;
  // Match formats like "11:00 – 16:00", "11:00-16:00", "11:00"
  const m = time.match(/(\d{1,2}):(\d{2})\s*[–\-]\s*(\d{1,2}):(\d{2})/);
  if (m) {
    return {
      startH: parseInt(m[1], 10),
      startM: parseInt(m[2], 10),
      endH: parseInt(m[3], 10),
      endM: parseInt(m[4], 10),
    };
  }
  const single = time.match(/(\d{1,2}):(\d{2})/);
  if (single) {
    const h = parseInt(single[1], 10);
    const min = parseInt(single[2], 10);
    return { startH: h, startM: min, endH: h + 2, endM: min };
  }
  return def;
}

// Treat times as Almaty (UTC+5, no DST) and convert to UTC for ICS
const ALMATY_OFFSET_HOURS = 5;

function makeUTCDate(dateISO: string, h: number, m: number): Date {
  const [y, mo, d] = dateISO.split("-").map((v) => parseInt(v, 10));
  // Local Almaty time => UTC = local - 5h
  return new Date(Date.UTC(y, mo - 1, d, h - ALMATY_OFFSET_HOURS, m, 0));
}

export function eventToICS(event: CalendarEvent): string {
  const { startH, startM, endH, endM } = parseTime(event.time);
  const start = makeUTCDate(event.date, startH, startM);
  const end = makeUTCDate(event.date, endH, endM);
  const stamp = toUTCStamp(new Date());

  const lines = [
    "BEGIN:VEVENT",
    `UID:${event.id}@elektroprofi.kz`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toUTCStamp(start)}`,
    `DTEND:${toUTCStamp(end)}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `LOCATION:${escapeICS(`${event.city}, Казахстан`)}`,
    `DESCRIPTION:${escapeICS(
      `${event.description}\n\nПартнёры: ${event.brands.join(", ")}\nELEKTROPROFI`,
    )}`,
    "ORGANIZER;CN=ELEKTROPROFI:mailto:mavlid.b@ekt.kz",
    "STATUS:CONFIRMED",
    "END:VEVENT",
  ];
  return lines.map(foldLine).join("\r\n");
}

export function buildICS(events: CalendarEvent[]): string {
  const header = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ELEKTROPROFI//Calendar 2026//RU",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:ELEKTROPROFI 2026",
    "X-WR-TIMEZONE:Asia/Almaty",
  ];
  const footer = ["END:VCALENDAR"];
  return [...header, ...events.map(eventToICS), ...footer].join("\r\n");
}

export function downloadICS(filename: string, events: CalendarEvent[]): void {
  const ics = buildICS(events);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
