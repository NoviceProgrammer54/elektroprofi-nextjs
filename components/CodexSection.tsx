'use client';
import Link from 'next/link';
import { ArrowRight, BookOpen, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLang } from '@/lib/i18n/useT';

const shortValues = [
  'Профессионализм',
  'Безопасность',
  'Качество работ',
  'Ответственность',
  'Честность',
  'Уважение к коллегам',
  'Развитие профессии',
];

const shortPrinciples = [
  'Безопасность всегда важнее скорости',
  'Качество важнее экономии',
  'Монтаж должен быть понятен другому специалисту',
  'Работы должны соответствовать нормативам',
  'Клиент должен понимать результат работы',
  'Электрика должна быть надёжной и долговечной',
  'Электрощит должен быть собран профессионально',
  'Каждый монтаж — это репутация специалиста',
  'Профессионал всегда учится',
  'Электрик формирует безопасность людей',
];

export function CodexSection() {
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  return (
    <section aria-labelledby="codex-h" className="space-y-6">
      <div className="section-head">
        <span className="eyebrow">
          <ScrollText className="h-3.5 w-3.5" /> Кодекс ELEKTROPROFI
        </span>
        <h2 id="codex-h" className="section-title mt-3">
          Краткая версия кодекса
        </h2>
        <p className="max-w-3xl text-muted-foreground">
          ELEKTROPROFI — это сообщество специалистов, объединённых общими ценностями
          профессионализма, безопасности и уважения к профессии электромонтажника.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Link
          href={`/codex${langQuery}`}
          aria-label="Открыть полную версию кодекса — Ценности сообщества"
          className="card-premium group block p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg text-electric">
              Сообщество ELEKTROPROFI строится на следующих ценностях:
            </h3>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-electric transition-transform group-hover:translate-x-1" />
          </div>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {shortValues.map((v) => (
              <li
                key={v}
                className="flex items-start gap-2 rounded-xl border border-border bg-surface/60 px-3 py-2 text-sm"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-electric">
            Подробнее <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>

        <Link
          href={`/codex${langQuery}`}
          aria-label="Открыть полную версию кодекса — 10 принципов электромонтажника"
          className="card-premium group block p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg sm:p-8"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg text-electric">
              10 принципов электромонтажника:
            </h3>
            <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-electric transition-transform group-hover:translate-x-1" />
          </div>
          <ol className="mt-5 space-y-2 text-sm">
            {shortPrinciples.map((p, i) => (
              <li key={p} className="flex items-start gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/15 font-display text-xs text-electric">
                  {i + 1}
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ol>
          <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-electric">
            Подробнее <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </Link>
      </div>

      <div className="flex justify-center">
        <Button
          asChild
          size="lg"
          variant="outline"
          className="h-12 gap-2 font-bold"
        >
          <Link href={`/codex${langQuery}`}>
            <BookOpen className="h-4 w-4" />
            Расширенная версия кодекса
          </Link>
        </Button>
      </div>
    </section>
  );
}
