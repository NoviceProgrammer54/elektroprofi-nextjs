'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, Sparkles, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMergedEvents } from '@/hooks/useEvents';
import {
  formatPromoRange,
  getActivePromos,
  promoBadgeClass,
  promoLabel,
} from '@/lib/promo';
import { useLang } from '@/lib/i18n/useT';
import type { CalendarEvent } from '@/lib/data/events';

const DEFAULT_TODAY = '2026-06-02';

export function ActivePromos({ limit = 3 }: { limit?: number }) {
  const { events } = useMergedEvents();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  const [today, setToday] = useState<string>(DEFAULT_TODAY);
  useEffect(() => {
    const now = new Date();
    setToday(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    );
  }, []);

  const active = useMemo<CalendarEvent[]>(
    () => getActivePromos(events, today).slice(0, limit),
    [events, today, limit],
  );

  if (active.length === 0) return null;

  return (
    <section
      aria-labelledby="active-promos-h"
      className="section-home"
    >
      <div className="section-head">
        <span className="inline-flex items-center gap-2 rounded-full border border-fuchsia-500/40 bg-fuchsia-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-fuchsia-300">
          <Sparkles className="h-3.5 w-3.5" /> Календарь мероприятий
        </span>
        <h2 id="active-promos-h" className="mt-3 font-display text-3xl sm:text-4xl">
          Сейчас идёт {active.length === 1 ? 'акция' : 'акции и конкурсы'}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Спецусловия, конкурсы и промо-периоды сообщества ELEKTROPROFI — успейте присоединиться.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {active.map((e) => (
          <article
            key={e.id}
            className="card-premium card-glow group relative flex flex-col gap-3 overflow-hidden p-5"
          >
            <div
              aria-hidden
              className={`absolute inset-x-0 top-0 h-1 ${
                e.kind === 'championship'
                  ? 'bg-amber-400'
                  : 'bg-gradient-to-r from-fuchsia-500 to-orange-500'
              }`}
            />
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${promoBadgeClass(e)}`}
              >
                {e.kind === 'championship' ? (
                  <Trophy className="h-3 w-3" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                {promoLabel(e)}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Сейчас идёт
              </span>
            </div>

            <h3 className="font-display text-lg leading-tight transition group-hover:text-primary">
              {e.title}
            </h3>

            <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground/85">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              {formatPromoRange(e.date, e.endDate, lang === 'kz' ? 'kz' : 'ru')}
            </p>

            <p className="line-clamp-3 text-sm text-muted-foreground">
              {e.description.split('\n')[0]}
            </p>

            <div className="mt-auto pt-2">
              <Button asChild className="btn-electric font-bold">
                <Link
                  href={`/events${langQuery}`}
                  className="inline-flex items-center gap-1.5"
                >
                  {e.ctaLabel ?? 'Участвовать'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
