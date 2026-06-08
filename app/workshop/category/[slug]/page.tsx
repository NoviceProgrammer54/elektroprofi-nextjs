'use client';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useWorkshopCategory } from '@/hooks/useWorkshop';
import { useLang, useTT } from '@/lib/i18n/useT';
import { parseCover } from '@/lib/cover-position';
import { use } from 'react';

function articleHref(id: string, langQuery: string) {
  if (id === 'kodeks-polnyi') return `/codex${langQuery}`;
  if (id === 'rekomendovannye-ceny') return `/prices${langQuery}`;
  if (id === 'rekomendacii-oplata') return `/payment${langQuery}`;
  return `/workshop/article/${id}${langQuery}`;
}

export default function WorkshopCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { category, articles, loading, notFound } = useWorkshopCategory(slug);
  const lang = useLang();
  const tt = useTT();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  if (loading) return <div className="page-stack"><p className="text-muted-foreground">{tt('Загрузка…')}</p></div>;
  if (notFound || !category) return (
    <div className="page-stack">
      <h1 className="font-display text-3xl">{tt('Категория не найдена')}</h1>
      <Link href={`/workshop${langQuery}`} className="text-electric inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> {tt('Вернуться в Мастерскую')}
      </Link>
    </div>
  );

  const title = lang === 'kz' && category.title_kz ? category.title_kz : category.title;

  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <Link href={`/workshop${langQuery}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {tt('Мастерская')}
          </Link>
          <span className="eyebrow mt-4 block">
            {category.section === 'knowledge' ? tt('База знаний') : tt('Медиа')}
          </span>
          <h1 className="page-title mt-4">{title}</h1>
          <p className="page-lead">
            {articles.length} {tt('материалов в категории')}
          </p>
        </div>
      </header>

      {articles.length === 0 ? (
        <p className="text-muted-foreground">{tt('В этой категории пока нет материалов.')}</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => {
            const aTitle = lang === 'kz' && a.title_kz ? a.title_kz : a.title;
            const aSummary = lang === 'kz' && a.summary_kz ? a.summary_kz : a.summary ?? '';
            const cov = parseCover(a.cover_url);
            return (
              <Link
                key={a.id}
                href={articleHref(a.id, langQuery)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-background/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
              >
                <div
                  className="aspect-[16/10] w-full overflow-hidden bg-muted"
                  style={{
                    backgroundImage: cov.src ? `url(${cov.src})` : 'var(--gradient-accent)',
                    backgroundSize: 'cover',
                    backgroundPosition: cov.src ? cov.position : 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-lg leading-tight transition-colors group-hover:text-electric">
                    {aTitle}
                  </h3>
                  {aSummary && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{aSummary}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-4 text-xs uppercase tracking-wider text-muted-foreground">
                    <span>{a.author ?? tt('АВТОР')}</span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-semibold text-electric transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      {tt('Подробнее')}
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
