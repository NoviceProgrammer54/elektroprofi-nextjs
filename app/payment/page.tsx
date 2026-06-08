'use client';
import Link from 'next/link';
import { ArrowLeft, HandCoins, FileSignature, AlertTriangle } from 'lucide-react';
import { useLang, useTT } from '@/lib/i18n/useT';

const stages = [
  { title: 'Аванс — 30%', text: 'На закуп материалов и старт работ. Фиксируется в смете и переписке.' },
  { title: 'Промежуточный платёж', text: 'После завершения черновых работ: штроба, кабель, коробки, основа щита.' },
  { title: 'Финальный расчёт', text: 'После приёмки объекта, тестов автоматов и УЗО, подписания акта.' },
];

const rules = [
  'Все договорённости фиксируются письменно — смета, чек-лист, переписка',
  'Цена работ согласована ДО старта, а не после факта',
  'Дополнительные работы — отдельная согласованная позиция',
  'Материалы оплачиваются по фактическим ценам или согласованному прайсу',
  'Гарантия и срок устранения замечаний прописаны заранее',
];

const warnings = [
  '100% предоплата без сметы и сроков',
  'Оплата «налом без чека» под давлением и без отчёта',
  'Постоянно растущий бюджет без письменного согласования',
  'Отказ показывать материалы и обосновать их стоимость',
];

export default function PaymentPage() {
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <Link href={`/workshop${langQuery}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {tt('Мастерская')}
          </Link>
          <span className="eyebrow mt-4 inline-flex">
            <HandCoins className="h-3.5 w-3.5" /> {tt('Труд и финансы')}
          </span>
          <h1 className="page-title mt-4">{tt('Рекомендации клиентам по оплате услуг')}</h1>
          <p className="page-lead">
            {tt('Прозрачные правила расчётов с электромонтажником защищают клиента от переплат и пересортицы, а мастера — от неоплаченных работ и претензий. Используйте эту схему по умолчанию.')}
          </p>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-3">
        {stages.map((s, i) => (
          <article key={s.title} className="card-premium p-6">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 font-display text-electric">
                {i + 1}
              </span>
              <h3 className="font-display text-lg text-electric">{tt(s.title)}</h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{tt(s.text)}</p>
          </article>
        ))}
      </section>

      <section className="card-premium p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }} aria-hidden>
            <FileSignature className="h-5 w-5" />
          </div>
          <h2 className="section-title">{tt('Правила прозрачных расчётов')}</h2>
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          {rules.map((r) => (
            <li key={r} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              <span>{tt(r)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card-premium p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }} aria-hidden>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <h2 className="section-title">{tt('Что должно насторожить клиента')}</h2>
        </div>
        <ul className="mt-6 space-y-2 text-sm">
          {warnings.map((w) => (
            <li key={w} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
              <span>{tt(w)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-border pt-4 text-sm text-muted-foreground">
          {tt('Резиденты ELEKTROPROFI работают по прозрачной схеме оплаты и фиксируют все договорённости письменно — это часть кодекса сообщества.')}
        </p>
      </section>
    </div>
  );
}
