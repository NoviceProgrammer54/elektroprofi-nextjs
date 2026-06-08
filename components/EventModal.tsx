'use client';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Tag, Download, Sparkles, Images } from 'lucide-react';
import { downloadICS } from '@/lib/ics';
import { toast } from 'sonner';
import type { CalendarEvent } from '@/lib/data/events';
import { useT, useLang, useTT } from '@/lib/i18n/useT';

interface Props {
  event: CalendarEvent | null;
  onOpenChange: (open: boolean) => void;
}

function brandBadgeColor(brand: string): string {
  const b = brand.toLowerCase();
  if (b.includes('legrand')) return 'bg-blue-500/15 text-blue-300 border-blue-500/40';
  if (b.includes('iek')) return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40';
  if (b.includes('chint')) return 'bg-red-500/15 text-red-300 border-red-500/40';
  if (b.includes('systeme')) return 'bg-violet-500/15 text-violet-300 border-violet-500/40';
  if (b.includes('elektroforum'))
    return 'bg-gradient-to-r from-primary/25 to-fuchsia-500/20 text-primary border-primary/50';
  if (b.includes('elektroprofi'))
    return 'bg-primary/15 text-primary border-primary/40';
  if (b.includes('bi group')) return 'bg-orange-500/15 text-orange-300 border-orange-500/40';
  if (b.includes('квт') || b.includes('kvt'))
    return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/40';
  return 'bg-secondary text-secondary-foreground border-border';
}

export function EventModal({ event, onOpenChange }: Props) {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  if (!event) return null;

  const title = lang === 'kz' && event.titleKz ? event.titleKz : event.title;
  const note = lang === 'kz' && event.noteKz ? event.noteKz : event.note;
  const desc = lang === 'kz' && event.descriptionKz ? event.descriptionKz : event.description;
  const isPast = new Date(event.date) < new Date();

  const statusKey = isPast
    ? 'event.status.past'
    : event.status === 'open'
      ? 'event.status.open'
      : event.status === 'limited'
        ? 'event.status.limited'
        : 'event.status.invite';

  const statusVariant: 'default' | 'secondary' | 'destructive' | 'outline' = isPast
    ? 'outline'
    : event.status === 'open'
      ? 'default'
      : event.status === 'limited'
        ? 'secondary'
        : 'destructive';

  return (
    <Dialog open={!!event} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[24px] border-primary/20 p-0 shadow-[var(--shadow-elevated)]">
        {/* Тематический баннер сверху модалки */}
        {event.imageUrl && (
          <div className="relative h-44 sm:h-56 w-full overflow-hidden rounded-t-[24px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.imageUrl}
              alt={event.imageAlt ?? title}
              className="absolute inset-0 h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          </div>
        )}

        {/* Header with gradient */}
        <div
          className={`relative overflow-hidden p-6 sm:p-7 ${event.imageUrl ? '' : 'rounded-t-[24px]'}`}
          style={{
            background:
              'linear-gradient(135deg, oklch(0.78 0.16 220 / 0.25), oklch(0.6 0.18 320 / 0.18)), var(--surface)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(closest-side, oklch(0.78 0.16 220 / 0.35), transparent)' }}
          />
          <DialogHeader className="relative space-y-3 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={statusVariant} className="rounded-full">
                {t(statusKey)}
              </Badge>
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
              >
                <MapPin className="h-3 w-3" />
                {tt(event.city)}
              </span>
              {note && !isPast && event.status === 'open' && (
                <span className="text-xs text-muted-foreground">{note}</span>
              )}
            </div>
            <DialogTitle className="font-display text-2xl sm:text-3xl leading-tight">
              {title}
            </DialogTitle>
            <DialogDescription className="sr-only">{desc.slice(0, 120)}</DialogDescription>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {new Date(event.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
              {event.time && (
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {event.time}
                </span>
              )}
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6 sm:p-7">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="card-premium p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {t('common.date')}
              </div>
              <div className="mt-1 font-semibold">
                {new Date(event.date).toLocaleDateString(lang === 'kz' ? 'kk-KZ' : 'ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
            </div>
            {event.time && (
              <div className="card-premium p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {t('event.time')}
                </div>
                <div className="mt-1 font-semibold">{event.time}</div>
              </div>
            )}
            <div className="card-premium p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {t('common.city')}
              </div>
              <div className="mt-1 font-semibold">{tt(event.city)}</div>
              {event.venue && (
                <div className="mt-1 text-xs text-muted-foreground">{tt(event.venue)}</div>
              )}
            </div>
            <div className="card-premium p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5" />
                {t('common.brands')}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {event.brands.map((b) => (
                  <span
                    key={b}
                    className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${brandBadgeColor(b)}`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Слайдер фотогалереи события */}
          {event.gallery && event.gallery.length > 0 && (
            <div className="rounded-2xl border border-border bg-surface/40 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="flex items-center gap-2 font-display text-lg">
                  <Images className="h-4 w-4 text-primary" />
                  {tt('Фотогалерея события')}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {event.gallery.length} {tt('фото')}
                </span>
              </div>
              <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
                <CarouselContent>
                  {event.gallery.map((img, i) => (
                    <CarouselItem key={i} className="basis-full sm:basis-1/2 lg:basis-1/2">
                      <div className="overflow-hidden rounded-xl border border-border bg-black/20">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.src}
                          alt={img.alt ?? `${title} — фото ${i + 1}`}
                          loading="lazy"
                          className="h-64 w-full object-cover sm:h-72"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-2" />
                <CarouselNext className="right-2" />
              </Carousel>
            </div>
          )}

          <div className="rounded-2xl border border-border bg-surface/40 p-4">
            <h3 className="font-display text-lg">{t('event.about')}</h3>
            <p className="mt-2 whitespace-pre-line text-[0.95rem] leading-relaxed text-foreground/90">
              {desc}
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                downloadICS(`elektroprofi-${event.id}.ics`, [event]);
                toast.success(t('event.addToCalendar'));
              }}
            >
              <Download className="mr-1.5 h-4 w-4" />
              {t('event.addToCalendar')}
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link href={`/events${langQuery}`}>
                <MapPin className="mr-1.5 h-4 w-4" />
                {t('event.map')}
              </Link>
            </Button>
            <Button
              disabled={isPast || event.status === 'invite'}
              className={`rounded-full ${isPast ? '' : 'btn-electric'}`}
              onClick={() => {
                toast.success(`${t('event.register')}: ${title}`);
                onOpenChange(false);
              }}
            >
              {t('event.register')}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
