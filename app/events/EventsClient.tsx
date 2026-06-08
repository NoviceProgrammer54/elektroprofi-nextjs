"use client";

import { useState } from "react";
import { Calendar, MapPin, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface EventItem {
  id: string;
  title: string;
  date: string;
  city: string;
  type: string;
  status: string;
  description?: string;
  location?: string;
  registration_url?: string;
}

const CITIES = ["Все", "Алматы", "Астана", "Шымкент", "Другие"];
const TYPES = ["Все", "workshop", "networking", "seminar", "expo", "partner"];
const TYPE_LABELS: Record<string, string> = {
  workshop: "Мастер-класс",
  networking: "Нетворкинг",
  seminar: "Семинар",
  expo: "Выставка",
  partner: "Партнёрское",
};

const STATUS_STYLES: Record<string, string> = {
  open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  limited: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  invite: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  closed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};
const STATUS_LABELS: Record<string, string> = {
  open: "Открыта запись",
  limited: "Мест мало",
  invite: "По приглашению",
  closed: "Запись закрыта",
};

export default function EventsClient({ events }: { events: EventItem[] }) {
  const [city, setCity] = useState("Все");
  const [type, setType] = useState("Все");

  const filtered = events.filter((e) => {
    const cityMatch =
      city === "Все" ||
      (city === "Другие" ? !CITIES.slice(1, -1).includes(e.city) : e.city === city);
    const typeMatch = type === "Все" || e.type === type;
    return cityMatch && typeMatch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-bold text-white mb-3">
          Мероприятия
        </h1>
        <p className="text-gray-400 text-lg">
          Семинары, мастер-классы, нетворкинг и выставки
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
            Город
          </p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((c) => (
              <button
                key={c}
                onClick={() => setCity(c)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  city === c
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">
            Тип
          </p>
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  type === t
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
                }`}
              >
                {t === "Все" ? "Все" : TYPE_LABELS[t] || t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Мероприятий по выбранным фильтрам не найдено
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => {
            const eventDate = new Date(event.date);
            const isPast = eventDate < new Date();
            return (
              <div
                key={event.id}
                className={`card-premium p-6 flex flex-col ${isPast ? "opacity-60" : ""}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-gray-400 text-sm">
                    <Calendar className="w-4 h-4" />
                    {format(eventDate, "d MMMM yyyy", { locale: ru })}
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      STATUS_STYLES[event.status] || STATUS_STYLES.closed
                    }`}
                  >
                    {STATUS_LABELS[event.status] || event.status}
                  </span>
                </div>
                <div className="mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wider">
                    {TYPE_LABELS[event.type] || event.type}
                  </span>
                </div>
                <h3 className="text-white font-bold text-lg mb-3 flex-1">
                  {event.title}
                </h3>
                {event.description && (
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-3">
                    {event.description}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-auto">
                  <MapPin className="w-3.5 h-3.5" />
                  {event.location ? `${event.city} — ${event.location}` : event.city}
                </div>
                {event.registration_url && !isPast && (
                  <a
                    href={event.registration_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Зарегистрироваться
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
