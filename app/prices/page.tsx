'use client';
import Link from 'next/link';
import { ArrowLeft, Wallet, AlertTriangle } from 'lucide-react';
import { useLang, useTT } from '@/lib/i18n/useT';

export default function PricesPage() {
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <Link href={`/workshop${langQuery}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" />{tt('Мастерская')}</Link>
          <span className="eyebrow mt-4 inline-flex"><Wallet className="h-3.5 w-3.5" /> {tt('Труд и финансы')}</span>
          <h1 className="page-title mt-4">{tt('Рекомендованные цены на электромонтаж')}</h1>
          <p className="page-lead">{tt('Единые ориентиры стоимости работ для резидентов и клиентов ELEKTROPROFI.')}</p>
        </div>
      </header>
      <section className="rounded-2xl border-2 border-primary/40 bg-primary/10 p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-1 h-5 w-5 shrink-0 text-primary" />
          <div>
            <h2 className="font-display text-lg">{tt('Раздел в разработке')}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{tt('Актуальные рекомендованные цены на электромонтажные работы появятся здесь в ближайшее время. Следите за обновлениями в наших каналах.')}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
