'use client';
import Link from 'next/link';
import {
  ArrowRight, Award, Building2, Calendar as CalendarIcon, ChevronRight,
  Crown, GraduationCap, MapPin, ShieldCheck, Sparkles, Target, UserPlus, Users, Wrench, Zap,
} from 'lucide-react';
import { Hero } from '@/components/Hero';
import { PartnerLogo } from '@/components/PartnerLogo';
import { ReviewsSection } from '@/components/ReviewsSection';
import { ActivePromos } from '@/components/ActivePromos';
import { Button, buttonVariants } from '@/components/ui/button';
import { partnerCategories } from '@/lib/data/partners';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils';

export default function HomePage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  const brandPreview = partnerCategories.find(c => c.id === 'brand');

  return (
    <div>
      {/* Hero */}
      <section className="section-home">
        <Hero />
      </section>

      {/* Teaser cards */}
      <section aria-label={t('home.quickNav.aria')} className="section-home grid gap-4 sm:grid-cols-3">
        {[
          { to: '/hiring', icon: Wrench, title: t('home.teaser.hire.title'), text: t('home.teaser.hire.text') },
          { to: '/events', icon: CalendarIcon, title: t('home.teaser.events.title'), text: t('home.teaser.events.text') },
          { to: '/partners', icon: UserPlus, title: t('home.teaser.partners.title'), text: t('home.teaser.partners.text') },
        ].map(it => (
          <Link key={it.to} href={`${it.to}${langQuery}`} className="card-premium card-tilt card-glow group flex items-start gap-4 p-5">
            <div className="icon-badge-glow grid h-11 w-11 shrink-0 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
              <it.icon className="h-5 w-5 icon-breathe" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-display text-lg leading-tight">{it.title}</h2>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{it.text}</p>
            </div>
          </Link>
        ))}
      </section>

      {/* Active promos */}
      <ActivePromos />

      {/* Почему ELEKTROPROFI */}
      <section aria-labelledby="why-h" className="section-home">
        <div className="section-head">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3.5 w-3.5" /> {t('home.why.eyebrow')}
          </span>
          <h2 id="why-h" className="mt-3 font-display text-3xl sm:text-4xl">{t('home.why.title')}</h2>
          <p className="max-w-2xl text-muted-foreground">{t('home.why.lead')}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: ShieldCheck, title: t('home.why.1.title'), text: t('home.why.1.text') },
            { icon: MapPin, title: t('home.why.2.title'), text: t('home.why.2.text') },
            { icon: Building2, title: t('home.why.3.title'), text: t('home.why.3.text') },
            { icon: GraduationCap, title: t('home.why.4.title'), text: t('home.why.4.text') },
          ].map(w => (
            <article key={w.title} className="card-premium card-tilt card-glow p-5">
              <div className="icon-badge-glow grid h-11 w-11 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                <w.icon className="h-5 w-5 icon-breathe" />
              </div>
              <h3 className="mt-4 font-display text-lg leading-tight">{w.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Для кого */}
      <section aria-labelledby="audience-h" className="section-home">
        <div className="section-head">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
            <Award className="h-3.5 w-3.5" /> {t('home.audience.eyebrow')}
          </span>
          <h2 id="audience-h" className="mt-3 font-display text-3xl sm:text-4xl">{t('home.audience.title')}</h2>
        </div>
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            { to: '/hiring', icon: Wrench, title: t('home.audience.client.title'), text: t('home.audience.client.text'), example: t('home.audience.client.example'), cta: t('home.audience.client.cta'), highlight: true },
            { to: '/join', icon: UserPlus, title: t('home.audience.electric.title'), text: t('home.audience.electric.text'), example: t('home.audience.electric.example'), cta: t('home.audience.electric.cta'), highlight: true },
            { to: '/sponsors', icon: Crown, title: t('home.audience.brand.title'), text: t('home.audience.brand.text'), example: t('home.audience.brand.example'), cta: t('home.audience.brand.cta'), highlight: false },
          ].map(a => (
            <article key={a.to} className={`card-premium card-tilt card-glow flex flex-col gap-3 p-6 ${a.highlight ? 'card-highlight' : ''}`}>
              <div className="flex items-center gap-3">
                <div className="icon-badge-glow grid h-11 w-11 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }}>
                  <a.icon className="h-5 w-5 icon-breathe" />
                </div>
                <h3 className="font-display text-xl leading-tight">{a.title}</h3>
              </div>
              <p className="text-sm text-muted-foreground">{a.text}</p>
              <p className="text-xs italic text-muted-foreground/80 border-l-2 border-primary/40 pl-3">{a.example}</p>
              <div className="mt-auto pt-2">
                <Link href={`${a.to}${langQuery}`} className={cn(buttonVariants({ variant: 'outline' }), 'inline-flex items-center gap-1.5 font-bold')}>
                  {a.cta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* О нас */}
      <section id="about" aria-labelledby="about-h" className="section-home section-home--alt">
        <div className="section-head">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Users className="h-3.5 w-3.5" /> {t('home.about.eyebrow')}
              </span>
              <h2 id="about-h" className="mt-3 font-display text-3xl sm:text-4xl">{t('home.about.title')}</h2>
            </div>
            <Link href={`/about${langQuery}`} className="link-pill hidden sm:inline-flex">
              {t('home.about.more')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div className="space-y-6">
            <p className="max-w-2xl text-muted-foreground">{t('home.about.lead')}{' '}{t('home.about.stats')}</p>
            <div className="max-w-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">{t('home.about.subtitle')}</div>
              <p className="mt-2 text-sm text-foreground/85">{t('home.about.human')}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Target, title: t('home.about.mission.title'), text: t('home.about.mission.text') },
                { icon: Users, title: t('home.about.community.title'), text: t('home.about.community.text') },
                { icon: Crown, title: t('home.about.standards.title'), text: t('home.about.standards.text') },
              ].map(b => (
                <article key={b.title} className="card-premium p-6">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl text-primary-foreground shadow-[0_0_24px_color-mix(in_oklab,var(--primary)_35%,transparent)]" style={{ background: 'var(--gradient-accent)' }}>
                    <b.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-xl">{b.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
                </article>
              ))}
            </div>
          </div>

          <aside aria-hidden className="hidden lg:block">
            <div className="relative h-[420px]">
              <div className="card-premium absolute left-0 top-0 flex h-44 w-56 flex-col justify-between p-5" style={{ background: 'linear-gradient(135deg, color-mix(in oklab, var(--primary) 22%, var(--color-card)), var(--color-card))' }}>
                <Zap className="h-7 w-7 text-primary" />
                <div>
                  <div className="font-display text-2xl">1500+</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t('home.collage.masters')}</div>
                </div>
              </div>
              <div className="card-premium absolute right-0 top-12 flex h-40 w-52 flex-col justify-between p-5">
                <CalendarIcon className="h-7 w-7 text-primary" />
                <div>
                  <div className="font-display text-2xl">ELEKTROFORUM</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t('home.collage.forum')}</div>
                </div>
              </div>
              <div className="card-premium absolute bottom-0 left-8 flex h-44 w-64 flex-col justify-between p-5" style={{ background: 'linear-gradient(135deg, color-mix(in oklab, oklch(0.62 0.2 290) 18%, var(--color-card)), var(--color-card))' }}>
                <Sparkles className="h-7 w-7 text-primary" />
                <div>
                  <div className="font-display text-2xl">{t('home.collage.standards.title')}</div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">{t('home.collage.standards.text')}</div>
                </div>
              </div>
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-50" style={{ background: 'radial-gradient(closest-side, color-mix(in oklab, var(--primary) 25%, transparent), transparent 70%)' }} />
            </div>
          </aside>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link href={`/electricians${langQuery}`} className="link-pill">
            {t('home.next.about')} <ChevronRight className="h-4 w-4" />
          </Link>
          <Link href={`/about${langQuery}`} className="link-pill sm:hidden">
            {t('home.about.moreFull')} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Отзывы клиентов */}
      <ReviewsSection id="reviews-clients" roles={['client']} eyebrow="Отзывы клиентов" title="Что говорят клиенты" lead="Реальные истории людей, которые заказали электромонтаж через ELEKTROPROFI." altSection={false} />

      {/* Спонсоры */}
      <section id="sponsors" aria-labelledby="sponsors-h" className="section-home">
        <div className="section-head">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                <Crown className="h-3.5 w-3.5" /> {t('home.sponsors.eyebrow')}
              </span>
              <h2 id="sponsors-h" className="mt-3 font-display text-3xl sm:text-4xl">{t('home.sponsors.title')}</h2>
            </div>
            <Link href={`/sponsors${langQuery}`} className="link-pill hidden sm:inline-flex">
              {t('home.sponsors.allLink')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <div className="card-premium relative p-8 sm:p-10">
          <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Crown className="h-3 w-3" /> {t('home.sponsors.badge')}
          </span>
          <div className="flex flex-wrap items-start gap-5">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl font-display text-xl text-primary-foreground shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_40%,transparent)]" style={{ background: 'var(--gradient-accent)' }}>ЕКТ</div>
            <div className="min-w-[260px] flex-1 space-y-3">
              <h3 className="font-display text-2xl">{t('home.sponsors.ektName')}</h3>
              <p className="text-muted-foreground">{t('home.sponsors.ektDesc')}</p>
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a href="https://ekt.kz" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: 'outline' }))}>ekt.kz</a>
                <Link href={`/sponsors${langQuery}`} className="link-pill">
                  {t('home.sponsors.moreSupport')} <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Отзывы партнёров */}
      <ReviewsSection id="reviews-partners" roles={['partner']} eyebrow="Отзывы партнёров" title="Что говорят бренд-партнёры" lead="Голоса брендов и партнёров, которые работают с сообществом ELEKTROPROFI." />

      {/* Партнёры */}
      <section id="partners" aria-labelledby="partners-h" className="section-home section-home--alt">
        <div className="section-head">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                {t('home.partners.eyebrow')}
              </span>
              <h2 id="partners-h" className="mt-3 font-display text-3xl sm:text-4xl">{t('home.partners.title')}</h2>
            </div>
            <Link href={`/partners${langQuery}`} className="link-pill hidden sm:inline-flex">
              {t('home.partners.allCategories')} <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {brandPreview && <p className="max-w-3xl text-muted-foreground">{lang === 'kz' ? brandPreview.descriptionKz : brandPreview.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {(brandPreview?.partners ?? []).slice(0, 10).map(p => (
            <a key={tt(p.name)} href={p.url ?? '#'} target={p.url ? '_blank' : undefined} rel={p.url ? 'noopener noreferrer' : undefined}
              className="group card-premium relative flex h-24 items-center justify-center px-4 py-3"
              aria-label={`${tt(p.name)} — ${t('home.partners.brandBadge')}`} title={tt(p.name)}>
              <span className="pointer-events-none absolute right-2 top-2 rounded-full border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary opacity-0 transition group-hover:opacity-100">
                {t('home.partners.brandBadge')}
              </span>
              <PartnerLogo name={tt(p.name)} logo={p.logo} variant={p.logoVariant} />
            </a>
          ))}
        </div>

        <div className="mt-6">
          <Link href={`/partners${langQuery}`} className="link-pill">
            {t('home.partners.viewAll')} <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
