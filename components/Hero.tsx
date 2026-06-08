'use client';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useT, useLang } from '@/lib/i18n/useT';

export function Hero() {
  const t = useT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  const stats = [
    { value: '1500+', label: t('metrics.members'), to: null as null },
    { value: '30+', label: t('metrics.residents'), to: '/electricians' as const },
    { value: '10+', label: t('metrics.cities'), to: '/electricians' as const },
    { value: '9', label: t('metrics.partners'), to: '/partners' as const },
  ];

  return (
    <section
      aria-labelledby="hero-title"
      className="hero-island hero-no-border relative overflow-hidden px-6 py-20 sm:px-10 sm:py-28"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-grid-electric opacity-15" />

      <div
        id="hero"
        className="cinema-stage section-rise relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
      >
        <span className="eyebrow">{t('hero.eyebrow')}</span>

        <h1
          id="hero-title"
          className="cinema-title section-rise-1 mt-6 font-display text-4xl leading-[1.05] sm:text-6xl lg:text-7xl"
        >
          {t('hero.title.simple')}
          <span className="text-electric block">{t('hero.title.middle.simple')}</span>
        </h1>

        <p className="section-rise-2 mt-6 max-w-xl text-base text-foreground/85 sm:text-lg">
          {t('hero.subtitle.simple')}
        </p>

        <div className="section-rise-3 mt-8">
          <Button
            asChild
            size="lg"
            className="cinema-cta rounded-full bg-foreground px-8 py-6 text-base font-semibold text-background hover:bg-foreground/90"
          >
            <Link href={`/hiring${langQuery}`}>
              {t('hero.role.client.cta')}
            </Link>
          </Button>
        </div>

        <div className="mt-3">
          <Button asChild variant="ghost" className="font-bold text-primary hover:bg-primary/10">
            <Link href={`/sponsors${langQuery}`} className="inline-flex items-center gap-1.5">
              {t('hero.role.brand.cta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Метрики сообщества */}
      <div className="relative z-10 mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:mt-20 sm:grid-cols-4 sm:gap-5">
        {stats.map((s) =>
          s.to ? (
            <Link
              key={s.label}
              href={`${s.to}${langQuery}`}
              className="hero-stat group"
            >
              <ArrowUpRight aria-hidden className="hero-stat__arrow" />
              <div className="hero-stat__value">{s.value}</div>
              <div className="hero-stat__label">{s.label}</div>
            </Link>
          ) : (
            <div key={s.label} className="hero-stat">
              <div className="hero-stat__value">{s.value}</div>
              <div className="hero-stat__label">{s.label}</div>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
