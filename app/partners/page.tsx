'use client';
import Link from 'next/link';
import { partnerCategories } from '@/lib/data/partners';
import { PartnerLogo } from '@/components/PartnerLogo';
import { useLang, useT, useTT } from '@/lib/i18n/useT';

export default function PartnersPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow">{tt('Экосистема')}</span>
          <h1 className="page-title mt-5">{t('nav.partners')}</h1>
          <p className="page-lead">{t('partners.lead')}</p>
          <div className="mt-6"><Link href={`/sponsors${langQuery}`} className="link-pill">{t('partners.linkSponsor')}</Link></div>
        </div>
      </header>
      {partnerCategories.map(cat=>(
        <section key={cat.id} aria-labelledby={`cat-${cat.id}`} className="space-y-6">
          <div className="section-head">
            <h2 id={`cat-${cat.id}`} className="section-title">{lang==='kz'?cat.titleKz:cat.title}</h2>
            <p className="max-w-3xl text-muted-foreground">{lang==='kz'?cat.descriptionKz:cat.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {cat.partners.map(p=>(
              <a key={p.name} href={p.url??'#'} target={p.url?'_blank':undefined} rel={p.url?'noopener noreferrer':undefined} className="group card-premium flex h-24 items-center justify-center px-4 py-3" title={tt(p.name)}>
                <PartnerLogo name={tt(p.name)} logo={p.logo} variant={p.logoVariant} />
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
