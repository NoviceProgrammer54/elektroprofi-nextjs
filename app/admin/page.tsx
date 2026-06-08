"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Users, Star, Calendar, MessageSquare, Loader2 } from "lucide-react";

interface Stats {
  experts: number;
  reviews: number;
  events: number;
  chats: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    experts: 0,
    reviews: 0,
    events: 0,
    chats: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [experts, reviews, events, chats] = await Promise.all([
        supabase.from("experts").select("id", { count: "exact", head: true }),
        supabase.from("reviews").select("id", { count: "exact", head: true }),
        supabase
          .from("event_overrides")
          .select("id", { count: "exact", head: true }),
        supabase
          .from("chat_sessions")
          .select("id", { count: "exact", head: true }),
      ]);
      setStats({
        experts: experts.count || 0,
        reviews: reviews.count || 0,
        events: events.count || 0,
        chats: chats.count || 0,
      });
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    {
      label: "Электрики",
      value: stats.experts,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Отзывы",
      value: stats.reviews,
      icon: Star,
      color: "text-yellow-400",
      bg: "bg-yellow-500/10",
    },
    {
      label: "События",
      value: stats.events,
      icon: Calendar,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Чат-сессии",
      value: stats.chats,
      icon: MessageSquare,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-white mb-8">
        Дашборд
      </h1>

      {loading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          Загрузка...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="card-premium p-5">
                <div
                  className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="font-display text-3xl font-bold text-white mb-1">
                  {card.value}
                </div>
                <div className="text-gray-400 text-sm">{card.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-10 card-premium p-6">
        <h2 className="text-white font-bold mb-2">Добро пожаловать</h2>
        <p className="text-gray-400 text-sm">
          Используйте боковое меню для управления контентом сайта ELEKTROPROFI.
        </p>
      </div>
    </div>
  );
}
