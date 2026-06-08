'use client';
import { useMemo, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type CalendarEvent } from '@/lib/data/events';
import { useMergedEvents } from '@/hooks/useEvents';
import { EventModal } from './EventModal';
import { useT, useLang, useTT } from '@/lib/i18n/useT';

interface Props {
  fromDate?: Date;
  limit?: number;
}

const DEFAULT_CUTOFF = '2026-04-20';

export function UpcomingEvents({ fromDate, limit = 6 }: Props) {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const { events: allEvents } = useMergedEvents();

  const cutoff = fromDate ? fromDate.toISOString().slice(0, 10) : DEFAULT_CUTOFF;

  const upcoming = useMemo(
    () =>
      allEvents
        .filter((e) => e.date >= cutoff)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, limit),
    [cutoff, limit, allEvents],
  );

  const titleFor = (e: CalendarEvent) => (lang === 'kz' && e.titleKz ? e.titleKz : e.title);
  const statusLabel = (e: CalendarEvent) => {
    if (e.date < cutoff) return t('event.status.past');
    if (e.status === 'open') return t('event.status.open');
    if (e.status === 'limited') return t('event.status.limited');
    return t('event.status.invite');
  };

  return (
    <section aria-labelledby="upcoming-h" className="space-y-5">
      <div className="flex items-end justify-between">
        <h2 id="upcoming-h" className="font-display text-3xl">
          {t('upcoming.title')}
        </h2>
      </div>

      {upcoming.length === 0 ? (
        <p className="text-muted-foreground">{t('upcoming.empty')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {upcoming.map((e) => (
            <article
              key={e.id}
              className="card-premium card-glow group flex flex-col gap-3 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <Calendar className="h-3.5 w-3.5" />
                  {new Date(e.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
                    day: 'numeric',
                    month: 'long',
                  })}
                </span>
                <Badge variant="outline" className="text-xs">
                  {statusLabel(e)}
                </Badge>
              </div>

              <h3 className="font-display text-xl leading-tight transition group-hover:text-primary">
                {titleFor(e)}
              </h3>

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {tt(e.city)}
              </div>

              <div className="flex flex-wrap gap-1.5">
                {e.brands.slice(0, 4).map((b) => (
                  <Badge key={b} variant="secondary" className="text-xs">
                    {b}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-semibold"
                  onClick={() => setSelected(e)}
                >
                  {t('upcoming.more')} →
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <EventModal event={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
}
