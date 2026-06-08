'use client';
import Link from 'next/link';
import { Crown, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';
import { PartnerLogo } from '@/components/PartnerLogo';
import { partnerCategories } from '@/lib/data/partners';
import { useLang, useT, useTT } from '@/lib/i18n/useT';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function SponsorsPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const brandCat = partnerCategories.find(c=>c.id==='brand');
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><Crown className="h-3.5 w-3.5" /> {t('sponsors.badge')}</span>
          <h1 className="page-title mt-5">{t('nav.sponsors')}</h1>
          <p className="page-lead">{t('sponsors.lead')}</p>
        </div>
      </header>
      <section aria-labelledby="ekt-h" className="card-premium card-highlight overflow-hidden p-8 sm:p-10">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl text-primary-foreground shadow-[0_0_30px_color-mix(in_oklab,var(--primary)_40%,transparent)]" style={{background:'var(--gradient-accent)'}}>ЕКТ</div>
            <div><div className="text-xs uppercase tracking-wider text-muted-foreground">{t('sponsors.gen.label')}</div><h2 id="ekt-h" className="section-title">{t('sponsors.ekt.name')}</h2></div>
          </div>
          <p className="text-muted-foreground">{t('sponsors.ekt.p1')}</p>
          <p className="text-muted-foreground">{t('sponsors.ekt.p2')}</p>
          <p className="text-muted-foreground">{t('sponsors.ekt.p3')}</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <a href="https://ekt.kz" target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({variant:'outline'}),'gap-1.5')}><ExternalLink className="h-4 w-4"/>ekt.kz</a>
            <Link href={`/partners${langQuery}`} className={cn(buttonVariants({variant:'ghost'}))}>{t('sponsors.ekt.allPartners')}</Link>
          </div>
        </div>
      </section>
      <section aria-labelledby="model-h">
        <h2 id="model-h" className="section-title">{t('sponsors.model.title')}</h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[{icon:ShieldCheck,title:t('sponsors.model.brand.title'),text:t('sponsors.model.brand.text')},{icon:Sparkles,title:t('sponsors.model.events.title'),text:t('sponsors.model.events.text')},{icon:Crown,title:t('sponsors.model.knowledge.title'),text:t('sponsors.model.knowledge.text')}].map(b=>(
            <article key={b.title} className="card-premium p-5">
              <div className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground" style={{background:'var(--gradient-accent)'}}><b.icon className="h-5 w-5" /></div>
              <h3 className="mt-4 font-display text-lg">{b.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{b.text}</p>
            </article>
          ))}
        </div>
      </section>
      {brandCat && (
        <section aria-labelledby="brands-h">
          <h2 id="brands-h" className="section-title">{t('sponsors.logos.title')}</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {brandCat.partners.map(p=>(
              <a key={p.name} href={p.url??'#'} target={p.url?'_blank':undefined} rel={p.url?'noopener noreferrer':undefined} className="group card-premium flex h-24 items-center justify-center px-4 py-3" title={tt(p.name)}>
                <PartnerLogo name={tt(p.name)} logo={p.logo} variant={p.logoVariant} />
              </a>
            ))}
          </div>
        </section>
      )}
      <section className="cta-band">
        <h2 className="font-display text-2xl sm:text-3xl">{t('sponsors.cta.title')}</h2>
        <p className="mt-3 text-muted-foreground">{t('sponsors.cta.text')}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href={`/contacts${langQuery}`} className={cn(buttonVariants(),'btn-electric font-bold')}>{t('sponsors.cta.contact')}</Link>
          <Link href={`/partners${langQuery}`} className={cn(buttonVariants({variant:'outline'}))}>{t('sponsors.cta.allPartners')}</Link>
        </div>
      </section>
    </div>
  );
}
