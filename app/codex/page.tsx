'use client';
import Link from 'next/link';
import { ScrollText } from 'lucide-react';
import { useLang, useTT } from '@/lib/i18n/useT';

const values = ['Профессионализм','Безопасность','Качество работ','Ответственность','Честность','Уважение к коллегам','Развитие профессии'];
const principles = ['Безопасность всегда важнее скорости','Качество важнее экономии','Монтаж должен быть понятен другому специалисту','Работы должны соответствовать нормативам','Клиент должен понимать результат работы','Электрика должна быть надёжной и долговечной','Электрощит должен быть собран профессионально','Каждый монтаж — это репутация специалиста','Профессионал всегда учится','Электрик формирует безопасность людей'];

export default function CodexPage() {
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><ScrollText className="h-3.5 w-3.5" /> {tt('Кодекс сообщества')}</span>
          <h1 className="page-title mt-5">{tt('Кодекс ELEKTROPROFI')}</h1>
          <p className="page-lead">{tt('Свод профессиональных и этических норм электромонтажника: ценности, принципы и расширенный кодекс сообщества.')}</p>
        </div>
      </header>
      <section aria-labelledby="values-h">
        <h2 id="values-h" className="section-title">{tt('Ценности сообщества')}</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {values.map(v=><li key={v} className="flex items-start gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" /><span>{tt(v)}</span></li>)}
        </ul>
      </section>
      <section aria-labelledby="principles-h">
        <h2 id="principles-h" className="section-title">{tt('10 принципов электромонтажника')}</h2>
        <ol className="mt-5 space-y-3">
          {principles.map((p,i)=><li key={p} className="flex items-start gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-primary/15 font-display text-sm text-primary">{i+1}</span><span className="pt-0.5 text-sm">{tt(p)}</span></li>)}
        </ol>
      </section>
      <div className="cta-band text-center">
        <h2 className="font-display text-2xl">{tt('Стать частью сообщества')}</h2>
        <p className="mt-3 text-muted-foreground">{tt('Разделяете эти принципы? Присоединяйтесь к ELEKTROPROFI.')}</p>
        <Link href={`/join${langQuery}`} className="mt-5 inline-flex items-center gap-1.5 rounded-full font-bold px-6 py-2.5 btn-electric">{tt('Вступить')}</Link>
      </div>
    </div>
  );
}
