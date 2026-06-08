'use client';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { useT, useTT, useLang } from '@/lib/i18n/useT';

export function MetricGrid() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  const items = [
    { label: t('metrics.members'), value: '1500+', clickable: false },
    { label: t('metrics.residents'), value: '30+', clickable: true },
    { label: t('metrics.cities'), value: '10+', clickable: true },
    { label: t('metrics.partners'), value: '9', clickable: true },
  ];

  return (
    <section
      aria-label={tt('Метрики сообщества')}
      className="grid grid-cols-2 gap-6 sm:grid-cols-4 lg:gap-8"
    >
      {items.map((it) =>
        it.clickable ? (
          <Link
            key={it.label}
            href={`/#hero${langQuery}`}
            className="card-premium group relative px-6 py-8 text-center transition hover:-translate-y-0.5 hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowUpRight
              aria-hidden
              className="absolute right-3 top-3 h-4 w-4 text-muted-foreground transition group-hover:text-primary"
            />
            <div className="font-display text-4xl leading-none text-electric sm:text-5xl">
              {it.value}
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {it.label}
            </div>
          </Link>
        ) : (
          <div key={it.label} className="card-premium px-6 py-8 text-center">
            <div className="font-display text-4xl leading-none text-electric sm:text-5xl">
              {it.value}
            </div>
            <div className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {it.label}
            </div>
          </div>
        ),
      )}
    </section>
  );
}
