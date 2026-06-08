'use client';
import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, MapPin, Sparkles, Download, CalendarDays } from 'lucide-react';
import { downloadICS } from '@/lib/ics';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EventModal } from './EventModal';
import type { CalendarEvent } from '@/lib/data/events';
import { getPromoStyle } from '@/lib/promo';
import { useLang, useT, useTT } from '@/lib/i18n/useT';

interface Props {
  events: CalendarEvent[];
  initialMonth?: Date;
  onFilteredChange?: (events: CalendarEvent[], monthLabel: string, todayStr: string | null) => void;
}

const monthNamesRu = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const monthNamesKz = ['Қаңтар','Ақпан','Наурыз','Сәуір','Мамыр','Маусым','Шілде','Тамыз','Қыркүйек','Қазан','Қараша','Желтоқсан'];
const weekdaysRu = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const weekdaysKz = ['Дс','Сс','Ср','Бс','Жм','Сб','Жс'];

function statusAccent(s: CalendarEvent['status']): string {
  if (s === 'open') return 'border-primary/50 bg-primary/15 hover:bg-primary/25 hover:border-primary';
  if (s === 'limited') return 'border-amber-400/50 bg-amber-400/15 hover:bg-amber-400/25 hover:border-amber-400';
  return 'border-fuchsia-400/50 bg-fuchsia-400/15 hover:bg-fuchsia-400/25 hover:border-fuchsia-400';
}
function statusDot(s: CalendarEvent['status']): string {
  if (s === 'open') return 'bg-primary shadow-[0_0_8px_var(--primary)]';
  if (s === 'limited') return 'bg-amber-400 shadow-[0_0_8px_oklch(0.82_0.14_80)]';
  return 'bg-fuchsia-400 shadow-[0_0_8px_oklch(0.7_0.22_330)]';
}
function statusBorder(s: CalendarEvent['status'], isPast: boolean): string {
  if (isPast) return 'border-l-muted-foreground/40';
  if (s === 'open') return 'border-l-primary';
  if (s === 'limited') return 'border-l-amber-400';
  return 'border-l-fuchsia-400';
}
function statusBadgeClass(s: CalendarEvent['status'], isPast: boolean): string {
  if (isPast) return 'border-muted-foreground/40 bg-muted text-muted-foreground';
  if (s === 'open') return 'border-primary/50 bg-primary/15 text-primary';
  if (s === 'limited') return 'border-amber-400/50 bg-amber-400/15 text-amber-300';
  return 'border-fuchsia-400/50 bg-fuchsia-400/15 text-fuchsia-300';
}

export function EventCalendar({ events, initialMonth, onFilteredChange }: Props) {
  const t = useT();
  const tt = useTT();
  const lang = useLang();

  const now = new Date();
  const initial = initialMonth ?? new Date(now.getFullYear(), now.getMonth(), 1);

  const [month, setMonth] = useState<Date>(initial);
  const [city, setCity] = useState<string>('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const [type, setType] = useState<string>('all');
  const [todayStr, setTodayStr] = useState<string | null>(null);

  useEffect(() => {
    const n = new Date();
    setTodayStr(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}-${String(n.getDate()).padStart(2,'0')}`);
  }, []);

  const monthNames = lang === 'kz' ? monthNamesKz : monthNamesRu;
  const weekdays = lang === 'kz' ? weekdaysKz : weekdaysRu;

  const year = month.getFullYear();
  const m = month.getMonth();
  const monthKey = `${year}-${String(m+1).padStart(2,'0')}`;

  const BRAND_PARTNERS = ['legrand','iek','chint','systeme','квт','kvt','bi group','schneider'];
  const eventType = (e: CalendarEvent): string => {
    if (e.kind === 'promo') return 'promo';
    if (e.kind === 'championship') return 'championship';
    const text = `${e.title} ${e.brands.join(' ')}`.toLowerCase();
    if (text.includes('elektroforum') || text.includes('форум')) return 'forum';
    if (text.includes('чемпионат')) return 'championship';
    if (text.includes('колледж') || text.includes('training') || text.includes('тренинг') || text.includes('обучен') || text.includes('интенсив') || text.includes('воркшоп') || text.includes('workshop')) return 'training';
    if (text.includes('семинар') || text.includes('masterclass') || text.includes('мастер-класс') || text.includes('мастер класс')) return 'masterclass';
    const partnerCount = e.brands.filter(b => BRAND_PARTNERS.some(p => b.toLowerCase().includes(p))).length;
    if (partnerCount >= 2) return 'masterclass';
    return 'other';
  };

  const typeChips: { key: string; label: string; match: (t: string) => boolean }[] = [
    { key: 'all', label: 'Все', match: () => true },
    { key: 'training', label: 'Обучение', match: (t) => t === 'training' || t === 'masterclass' || t === 'forum' },
    { key: 'championship', label: 'Чемпионаты', match: (t) => t === 'championship' },
    { key: 'promo', label: 'Акции и конкурсы', match: (t) => t === 'promo' || t === 'championship' },
  ];

  const eventCities = useMemo(() => Array.from(new Set(events.map(e => e.city))).sort(), [events]);

  const typeMatches = (e: CalendarEvent) => type === 'all' || (typeChips.find(c => c.key === type)?.match(eventType(e)) ?? false);

  const promoCoversDate = (e: CalendarEvent, dateStr: string) => {
    if (!e.kind) return false;
    return e.date <= dateStr && dateStr <= (e.endDate ?? e.date);
  };

  const monthEvents = useMemo(() => {
    return events.filter(e => {
      const [ey, em] = e.date.split('-').map(Number);
      const sameMonth = ey === year && em - 1 === m;
      const promoSameMonth = (() => {
        if (!e.kind || !e.endDate) return false;
        return e.date.slice(0,7) <= monthKey && e.endDate.slice(0,7) >= monthKey;
      })();
      const cityMatch = city === 'all' || e.city === city;
      const typeMatch = typeMatches(e);
      const qLower = q.trim().toLowerCase();
      const qMatch = !qLower || e.title.toLowerCase().includes(qLower) || e.brands.some(b => b.toLowerCase().includes(qLower));
      return (sameMonth || promoSameMonth) && cityMatch && typeMatch && qMatch;
    }).sort((a, b) => a.date.localeCompare(b.date));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, month, city, q, type]);

  useEffect(() => {
    onFilteredChange?.(monthEvents, `${monthNames[m]} ${year}`, todayStr);
  }, [monthEvents, m, year, todayStr, onFilteredChange, monthNames]);

  let firstDay = new Date(year, m, 1).getDay();
  if (firstDay === 0) firstDay = 7;
  const daysInMonth = new Date(year, m+1, 0).getDate();

  const cells: ({ day: number; event?: CalendarEvent; promo?: CalendarEvent } | null)[] = [];
  for (let i = 1; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const qLower = q.trim().toLowerCase();
    const filterMatch = (e: CalendarEvent) => (city === 'all' || e.city === city) && typeMatches(e) && (!qLower || e.title.toLowerCase().includes(qLower) || e.brands.some(b => b.toLowerCase().includes(qLower)));
    const event = events.find(e => !e.kind && e.date === dateStr && filterMatch(e));
    const promo = events.find(e => e.kind && promoCoversDate(e, dateStr) && filterMatch(e));
    cells.push({ day: d, event, promo });
  }

  const monthChips = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 3 }, (_, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return { key: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`, year: d.getFullYear(), month: d.getMonth() };
    });
  }, []);

  const yearOptions = useMemo(() => {
    const years = new Set<number>([now.getFullYear(), now.getFullYear()+1]);
    for (const e of events) { const y = new Date(e.date).getFullYear(); if (!Number.isNaN(y)) years.add(y); }
    return Array.from(years).sort((a, b) => a - b);
  }, [events]);

  const titleFor = (e: CalendarEvent) => (lang === 'kz' && e.titleKz ? e.titleKz : e.title);
  const statusLabel = (e: CalendarEvent, isPast: boolean) => {
    if (isPast) return t('event.status.past');
    if (e.status === 'open') return t('event.status.open');
    if (e.status === 'limited') return t('event.status.limited');
    return t('event.status.invite');
  };

  return (
    <section
      aria-label={tt('Календарь мероприятий ELEKTROPROFI')}
      className="relative overflow-hidden rounded-[24px] border border-primary/20 p-5 sm:p-8 shadow-[var(--shadow-elevated)]"
      style={{ background: 'radial-gradient(800px 380px at 0% 0%, oklch(0.78 0.16 220 / 0.18), transparent 65%), radial-gradient(700px 340px at 100% 100%, oklch(0.6 0.18 320 / 0.14), transparent 60%), var(--surface)' }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 rounded-[24px]" style={{ boxShadow: 'inset 0 1px 0 oklch(1 0 0 / 0.05), 0 0 80px oklch(0.78 0.16 220 / 0.08)' }} />

      {/* HEADER */}
      <header className="relative mb-6 flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]" style={{ background: 'var(--gradient-accent)' }} aria-hidden>
            <CalendarDays className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-2xl sm:text-3xl leading-tight">Календарь мероприятий ELEKTROPROFI</h2>
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">2026 · Обновлено</span>
            </div>
            <p className="text-sm text-muted-foreground">Выберите месяц и событие, чтобы увидеть детали</p>
          </div>
        </div>

        {/* Type chips */}
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pt-1 sm:flex-wrap sm:overflow-visible">
          {typeChips.map((c) => (
            <button key={c.key} type="button" onClick={() => setType(c.key)} aria-pressed={type === c.key}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${type === c.key ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]' : 'border-border bg-surface-2/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* FILTERS */}
      <div className="relative mb-6 flex flex-col gap-4">
        {/* Month chips */}
        <div className="flex flex-wrap gap-2">
          {monthChips.map((opt) => (
            <button key={opt.key} type="button" onClick={() => setMonth(new Date(opt.year, opt.month, 1))} aria-pressed={opt.key === monthKey}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition ${opt.key === monthKey ? 'border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]' : 'border-border bg-surface-2/60 text-muted-foreground hover:border-primary/50 hover:text-foreground'}`}>
              {monthNames[opt.month].slice(0, 3)} {opt.year}
            </button>
          ))}
        </div>

        {/* Search + city + ics */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[180px] sm:max-w-[260px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('calendar.searchPlaceholder')}
              aria-label={t('common.search')}
              className="flex h-10 w-full rounded-full border border-input bg-surface-2/60 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50"
            />
          </div>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              aria-label={t('common.city')}
              className="h-10 rounded-full border border-input bg-surface-2/60 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/50 appearance-none pr-8"
            >
              <option value="all">{t('common.allCities')}</option>
              {eventCities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rotate-90 text-muted-foreground" />
          </div>
          <Button variant="outline" className="rounded-full"
            onClick={() => { const list = monthEvents.length > 0 ? monthEvents : events; downloadICS(monthEvents.length > 0 ? `elektroprofi-${monthKey}.ics` : 'elektroprofi-2026.ics', list); toast.success(t('calendar.downloadIcs'), { description: t('calendar.downloadIcsHint') }); }}
            aria-label={t('calendar.downloadIcs')}>
            <Download className="mr-1.5 h-4 w-4" />
            {t('calendar.downloadIcs')}
          </Button>
        </div>
      </div>

      {/* MONTH NAV */}
      <div className="relative mb-4 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-surface-2/40 px-3 py-3 backdrop-blur">
        <button type="button" aria-label={t('calendar.month.prev')} onClick={() => setMonth(new Date(year, m-1, 1))}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:border-primary hover:bg-primary/10 hover:shadow-[var(--shadow-glow)]">
          <ChevronLeft className="h-5 w-5 transition group-hover:-translate-x-0.5 group-hover:text-primary" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <CalendarDays className="hidden h-5 w-5 text-primary sm:block" aria-hidden />
          <select value={String(m)} onChange={(e) => setMonth(new Date(year, Number(e.target.value), 1))}
            aria-label="Выбрать месяц"
            className="bg-transparent font-display text-2xl sm:text-3xl tracking-wide border-none focus:outline-none cursor-pointer">
            {monthNames.map((name, idx) => <option key={name} value={String(idx)}>{name}</option>)}
          </select>
          <select value={String(year)} onChange={(e) => setMonth(new Date(Number(e.target.value), m, 1))}
            aria-label="Выбрать год"
            className="rounded-full border border-primary/50 bg-primary/10 px-3 py-1 text-sm font-bold text-primary focus:outline-none cursor-pointer">
            {yearOptions.map(y => <option key={y} value={String(y)}>{y}</option>)}
          </select>
        </div>

        <button type="button" aria-label={t('calendar.month.next')} onClick={() => setMonth(new Date(year, m+1, 1))}
          className="group flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface transition hover:border-primary hover:bg-primary/10 hover:shadow-[var(--shadow-glow)]">
          <ChevronRight className="h-5 w-5 transition group-hover:translate-x-0.5 group-hover:text-primary" />
        </button>
      </div>

      {/* GRID + SIDEBAR */}
      <div className="relative grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Calendar grid */}
        <div role="grid" aria-label={`Календарь ${monthNames[m]} ${year}`} className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4 backdrop-blur-sm">
          <div role="row" className="mb-2 grid grid-cols-7 gap-1.5 text-center text-[11px] text-muted-foreground">
            {weekdays.map(w => <div key={w} role="columnheader" className="py-1.5 font-bold uppercase tracking-wider">{w}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {cells.map((cell, i) => {
              if (!cell) return <div key={`e-${i}`} aria-hidden className="min-h-[64px] sm:min-h-[72px]" />;
              const dateStr = `${year}-${String(m+1).padStart(2,'0')}-${String(cell.day).padStart(2,'0')}`;
              const isToday = todayStr === dateStr;
              const promo = cell.promo;
              const promoStyle = promo ? getPromoStyle(promo) : null;
              const promoStripClass = promoStyle?.strip ?? '';
              const isPromoStart = promo && promo.date === dateStr;
              const isPromoEnd = promo && (promo.endDate ?? promo.date) === dateStr;

              if (cell.event) {
                const isPastCell = todayStr ? cell.event.date < todayStr : false;
                return (
                  <button key={cell.day} type="button" role="gridcell"
                    aria-label={`${cell.day}, ${cell.event.city}, ${titleFor(cell.event)}${isPastCell ? ', завершено' : ''}`}
                    onClick={() => setSelected(cell.event!)}
                    className={`group relative flex min-h-[64px] sm:min-h-[72px] flex-col overflow-hidden rounded-xl border p-1.5 sm:p-2 text-left transition-all duration-200 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)] ${isPastCell ? 'border-muted-foreground/30 bg-muted/30 opacity-60 grayscale hover:opacity-90' : statusAccent(cell.event.status)} ${isToday ? 'ring-2 ring-primary/60' : ''}`}>
                    {promo && <span aria-hidden className={`absolute left-0 right-0 top-0 h-1 ${promoStripClass} ${isPromoStart ? 'rounded-tl-xl' : ''} ${isPromoEnd ? 'rounded-tr-xl' : ''}`} />}
                    <div className="flex items-center justify-between">
                      <span className={`text-xs sm:text-sm font-bold ${isPastCell ? 'text-muted-foreground line-through decoration-muted-foreground/60' : 'text-foreground'}`}>{cell.day}</span>
                      <span aria-hidden className={`h-2 w-2 rounded-full ${isPastCell ? 'bg-muted-foreground/50' : statusDot(cell.event.status)}`} />
                    </div>
                    <div className={`mt-auto truncate text-[9px] sm:text-[10px] font-semibold ${isPastCell ? 'text-muted-foreground' : 'text-foreground'}`}>{cell.event.city}</div>
                  </button>
                );
              }

              if (promo && promoStyle) {
                const isPastPromo = todayStr ? (promo.endDate ?? promo.date) < todayStr : false;
                return (
                  <button key={cell.day} type="button" role="gridcell"
                    aria-label={`${cell.day}, ${titleFor(promo)}`}
                    onClick={() => setSelected(promo)}
                    className={`group relative flex min-h-[64px] sm:min-h-[72px] flex-col overflow-hidden rounded-xl border p-1.5 sm:p-2 text-left transition-all duration-200 hover:scale-[1.04] hover:shadow-[var(--shadow-glow)] ${promoStyle.cell} ${isPastPromo ? 'opacity-60 grayscale' : ''} ${isToday ? 'ring-2 ring-primary/60' : ''}`}>
                    <span aria-hidden className={`absolute left-0 right-0 top-0 h-1 ${promoStripClass} ${isPromoStart ? 'rounded-tl-xl' : ''} ${isPromoEnd ? 'rounded-tr-xl' : ''}`} />
                    <div className="flex items-center justify-between">
                      <span className="text-xs sm:text-sm font-bold text-foreground">{cell.day}</span>
                      {isPromoStart && <span className={`rounded-full px-1.5 py-0 text-[8px] font-black uppercase tracking-widest ${promoStyle.badge}`}>{promo.kind === 'championship' ? 'К' : 'А'}</span>}
                    </div>
                    {isPromoStart && <div className="mt-auto line-clamp-2 text-[9px] sm:text-[10px] font-semibold leading-tight text-foreground">{titleFor(promo)}</div>}
                  </button>
                );
              }

              return (
                <div key={cell.day} role="gridcell"
                  className={`relative flex min-h-[64px] sm:min-h-[72px] flex-col rounded-xl border p-2 text-muted-foreground ${isToday ? 'border-primary/50 ring-2 ring-primary/60' : 'border-border/50 bg-surface/40'}`}>
                  <div className="text-xs">{cell.day}</div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/50 pt-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_6px_var(--primary)]" />Регистрация открыта</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Места ограничены</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-fuchsia-400" />По приглашению</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside aria-label={`События — ${monthNames[m]} ${year}`} className="rounded-2xl border border-border/70 bg-card/60 p-3 sm:p-4 backdrop-blur-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="font-display text-sm font-semibold">{monthEvents.length} {lang === 'kz' ? 'оқиға' : 'событий'}</h3>
            <Badge variant="outline" className="rounded-full border-primary/40 bg-primary/10 px-2 py-0 text-[10px] font-bold text-primary">{monthNames[m]}</Badge>
          </div>
          {monthEvents.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">{lang === 'kz' ? 'Оқиғалар жоқ' : 'Нет событий по фильтру'}</p>
          ) : (
            <ul className="max-h-[640px] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {monthEvents.map((e) => {
                const isPast = todayStr ? e.date < todayStr : false;
                const dateLabel = new Date(e.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', { day: 'numeric', month: 'long' });
                return (
                  <li key={e.id}>
                    <button type="button" onClick={() => setSelected(e)}
                      className={`group flex w-full flex-col gap-1.5 rounded-xl border-l-2 border border-border/60 bg-surface-2/40 p-2.5 text-left transition hover:border-primary/50 hover:bg-surface-2/70 ${statusBorder(e.status, isPast)} ${isPast ? 'opacity-55 grayscale hover:opacity-90' : ''}`}
                      aria-label={`${titleFor(e)} — ${dateLabel}${isPast ? ', завершено' : ''}`}>
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary"><Sparkles className="h-3 w-3" />{dateLabel}</span>
                        <span className={`rounded-full border px-1.5 py-0 text-[9px] font-semibold ${statusBadgeClass(e.status, isPast)}`}>{statusLabel(e, isPast)}</span>
                      </div>
                      <h4 className="font-display text-sm leading-snug line-clamp-2 transition group-hover:text-primary">{titleFor(e)}</h4>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {lang === 'kz' && e.cityKz ? e.cityKz : e.city}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>
      </div>

      <EventModal event={selected} onOpenChange={(o) => !o && setSelected(null)} />
    </section>
  );
}
