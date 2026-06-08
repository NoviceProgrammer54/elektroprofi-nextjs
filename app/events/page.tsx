'use client';
import { useCallback, useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Crown } from 'lucide-react';
import { EventCalendar } from '@/components/EventCalendar';
import { EventList } from '@/components/EventList';
import { buttonVariants } from '@/components/ui/button';
import { useMergedEvents } from '@/hooks/useEvents';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import type { CalendarEvent } from '@/lib/data/events';
import { cn } from '@/lib/utils';

export default function EventsPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const { events: liveEvents } = useMergedEvents();
  const [filtered, setFiltered] = useState<CalendarEvent[]>([]);
  const [monthLabel, setMonthLabel] = useState<string>('');
  const [todayStr, setTodayStr] = useState<string | null>(null);

  const handleFiltered = useCallback((evts: CalendarEvent[], label: string, today: string | null) => {
    setFiltered(evts);
    setMonthLabel(label);
    setTodayStr(today);
  }, []);

  return (
    <div className="page-stack">
      <header className="page-hero section-rise text-center sm:text-left">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow">ELEKTROFORUM 2026</span>
          <h1 className="page-title mt-5">
            {t('nav.events')} <span className="text-electric">2026</span>
          </h1>
          <p className="page-lead">
            {tt('Сначала выберите месяц и фильтры в календаре — ниже появится подробная лента событий.')}
          </p>
        </div>
      </header>

      {/* Что даёт участие */}
      <section aria-labelledby="benefits-h">
        <h2 id="benefits-h" className="font-display text-2xl sm:text-3xl">{t('events.benefits.title')}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <article className="card-premium card-highlight p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg">{t('events.benefits.electric.title')}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t('events.benefits.electric.text')}</p>
            <Link href={`/join${langQuery}`} className={cn(buttonVariants(), 'btn-electric mt-4 h-11 px-5 font-bold')}>
              {t('events.cta.electric')}
            </Link>
          </article>
          <article className="card-premium card-highlight p-6">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                <Crown className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg">{t('events.benefits.brand.title')}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{t('events.benefits.brand.text')}</p>
            <Link href={`/sponsors${langQuery}`} className={cn(buttonVariants({ variant: 'outline' }), 'mt-4 h-11 font-bold')}>
              {t('events.cta.brand')}
            </Link>
          </article>
        </div>
      </section>

      <EventCalendar events={liveEvents} onFilteredChange={handleFiltered} />
      <EventList events={filtered} monthLabel={monthLabel} todayStr={todayStr} />
    </div>
  );
}
