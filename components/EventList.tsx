'use client';
import { useState } from 'react';
import { Calendar, Clock, MapPin, ArrowRight, Tag, Sparkles, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CalendarEvent } from '@/lib/data/events';
import { EventModal } from './EventModal';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import { formatPromoRange, isPromo, promoBadgeClass, promoLabel } from '@/lib/promo';

interface Props {
  events: CalendarEvent[];
  monthLabel?: string;
  todayStr?: string | null;
}

function brandBadgeColor(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes('legrand')) return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
  if (b.includes('iek')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  if (b.includes('chint')) return 'bg-red-500/15 text-red-300 border-red-500/40';
  if (b.includes('systeme')) return 'bg-violet-500/15 text-violet-300 border-violet-500/40';
  if (b.includes('elektroforum')) return 'bg-gradient-to-r from-primary/25 to-fuchsia-500/20 text-primary border-primary/50';
  if (b.includes('elektroprofi')) return 'bg-primary/15 text-primary border-primary/40';
  if (b.includes('bi group')) return 'bg-orange-500/15 text-orange-300 border-orange-500/40';
  if (b.includes('квт') || b.includes('kvt')) return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40';
  return 'bg-secondary text-secondary-foreground border-border';
}

function getEventType(e: CalendarEvent): { label: string; color: string } {
  if (e.kind === 'promo') return { label: 'Акция', color: 'border-l-fuchsia-500' };
  if (e.kind === 'championship') return { label: 'Конкурс', color: 'border-l-amber-400' };
  const t = `${e.title} ${e.brands.join(' ')}`.toLowerCase();
  if (t.includes('elektroforum') || t.includes('форум')) return { label: 'ELEKTROFORUM', color: 'border-l-primary' };
  if (t.includes('masterclass') || t.includes('мастер-класс')) return { label: 'Мастер-класс', color: 'border-l-blue-400' };
  if (t.includes('training') || t.includes('тренинг') || t.includes('обучен') || t.includes('интенсив') || t.includes('воркшоп')) return { label: 'Обучение', color: 'border-l-emerald-400' };
  if (t.includes('чемпионат')) return { label: 'Чемпионат', color: 'border-l-amber-400' };
  return { label: 'Событие', color: 'border-l-fuchsia-400' };
}

function statusBadgeClass(s: CalendarEvent['status'], isPast: boolean): string {
  if (isPast) return 'border-muted-foreground/40 bg-muted text-muted-foreground';
  if (s === 'open') return 'border-primary/50 bg-primary/15 text-primary';
  if (s === 'limited') return 'border-amber-400/50 bg-amber-400/15 text-amber-300';
  return 'border-fuchsia-400/50 bg-fuchsia-400/15 text-fuchsia-300';
}

export function EventList({ events, monthLabel, todayStr }: Props) {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const [selected, setSelected] = useState<CalendarEvent | null>(null);

  const titleFor = (e: CalendarEvent) => (lang === 'kz' && e.titleKz ? e.titleKz : e.title);
  const descFor = (e: CalendarEvent) => (lang === 'kz' && e.descriptionKz ? e.descriptionKz : e.description);

  const statusLabel = (e: CalendarEvent, isPast: boolean) => {
    if (isPast) return t('event.status.past');
    if (e.status === 'open') return t('event.status.open');
    if (e.status === 'limited') return t('event.status.limited');
    return t('event.status.invite');
  };

  return (
    <section aria-labelledby="events-list-h" className="space-y-5">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="events-list-h" className="font-display text-2xl sm:text-3xl">
            {tt('Список мероприятий')}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tt('Подробная информация о событиях выбранного периода')}
          </p>
        </div>
        {monthLabel && (
          <Badge variant="outline" className="rounded-full border-primary/40 px-3 py-1 text-sm font-bold text-primary">
            {monthLabel} · {events.length}
          </Badge>
        )}
      </header>

      {events.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 bg-card/40 p-8 text-center text-muted-foreground">
          {tt('На выбранный период событий не найдено. Попробуйте сменить месяц или фильтры выше.')}
        </div>
      ) : (
        <ul className="space-y-4">
          {events.map((e) => {
            const isPast = todayStr ? e.date < todayStr : false;
            const tp = getEventType(e);
            const dateObj = new Date(e.date);
            const dateLong = dateObj.toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
            const day = dateObj.getDate();
            const monthShort = dateObj.toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', { month: 'short' });
            return (
              <li key={e.id}>
                <article
                  className={`card-premium card-glow group relative grid grid-cols-1 gap-4 overflow-hidden p-5 sm:p-6 sm:grid-cols-[160px_88px_1fr_auto] sm:items-start border-l-4 ${
                    isPast ? 'border-l-muted-foreground/40 opacity-60 grayscale hover:opacity-95' : tp.color
                  }`}
                >
                  {isPast && (
                    <span aria-hidden className="pointer-events-none absolute right-3 top-3 z-10 rounded-full border border-muted-foreground/40 bg-muted/80 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground backdrop-blur">
                      {tt('Завершено')}
                    </span>
                  )}
                  {isPromo(e) && !isPast && (
                    <span className={`pointer-events-none absolute left-3 top-3 z-10 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${promoBadgeClass(e)}`}>
                      {e.kind === 'championship' ? <Trophy className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                      {promoLabel(e)}
                    </span>
                  )}

                  {/* Media frame */}
                  <div className="media-frame aspect-[16/10] sm:aspect-auto sm:h-full sm:min-h-[120px]">
                    {e.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={e.imageUrl} alt={e.imageAlt ?? titleFor(e)} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-center" />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-primary/70">
                        <Calendar className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  {/* Date block */}
                  <div className="flex flex-row sm:flex-col items-center justify-center gap-2 sm:gap-0 rounded-2xl border border-border/60 bg-surface-2/50 px-3 py-2 sm:py-3 text-center">
                    <div className="font-display text-3xl leading-none text-primary">{day}</div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{monthShort}</div>
                    {e.time && (
                      <div className="hidden sm:flex items-center gap-1 pt-1 text-[10px] font-semibold text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {e.time.split(' ')[0]}
                      </div>
                    )}
                  </div>

                  {/* Main */}
                  <div className="flex min-w-0 flex-col gap-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">{tp.label}</span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2/60 px-2.5 py-0.5 text-[10px] font-semibold text-foreground">
                        <MapPin className="h-3 w-3" />{tt(e.city)}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold ${statusBadgeClass(e.status, isPast)}`}>
                        {statusLabel(e, isPast)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg sm:text-xl leading-tight transition group-hover:text-primary">{titleFor(e)}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      {isPromo(e) && e.endDate ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-foreground/85">
                          <Calendar className="h-3 w-3 text-primary" />
                          {formatPromoRange(e.date, e.endDate, lang === 'kz' ? 'kz' : 'ru')}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{dateLong}</span>
                      )}
                      {e.time && <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{e.time}</span>}
                    </div>
                    <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{descFor(e)}</p>
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {e.brands.slice(0, 6).map((b) => (
                        <span key={b} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${brandBadgeColor(b)}`}>{b}</span>
                      ))}
                      {e.brands.length > 6 && (
                        <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">+{e.brands.length - 6}</span>
                      )}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex sm:flex-col items-stretch sm:items-end justify-end gap-2 sm:min-w-[160px]">
                    <Button onClick={() => setSelected(e)} className="btn-electric rounded-full font-semibold">
                      {isPromo(e) ? e.ctaLabel ?? 'Участвовать' : 'Подробнее'}
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      )}

      <EventModal event={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
}
