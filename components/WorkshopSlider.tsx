'use client';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLang, useTT } from '@/lib/i18n/useT';
import { parseCover } from '@/lib/cover-position';

export interface WorkshopArticle {
  id: string;
  title: string;
  title_kz?: string | null;
  summary?: string | null;
  summary_kz?: string | null;
  cover_url?: string | null;
  author?: string | null;
}

export interface WorkshopCategory {
  id: string;
  title: string;
  title_kz?: string | null;
}

interface Props {
  category: WorkshopCategory;
  articles: WorkshopArticle[];
}

export function WorkshopSlider({ category, articles }: Props) {
  const lang = useLang();
  const tt = useTT();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    onScroll();
    el.addEventListener('scroll', onScroll, { passive: true });
    const ro = new ResizeObserver(onScroll);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', onScroll); ro.disconnect(); };
  }, [onScroll]);

  const title = lang === 'kz' && category.title_kz ? category.title_kz : category.title;

  return (
    <section aria-labelledby={`cat-${category.id}`} className="card-premium relative overflow-hidden p-5 sm:p-7">
      <div className="mb-5 flex items-end justify-between gap-4">
        <Link
          href={`/workshop${langQuery}`}
          className="group inline-flex items-center gap-3 rounded-2xl border border-primary/30 bg-background/60 px-3 py-2 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg"
          id={`cat-${category.id}`}
          aria-label={`${tt('Открыть категорию')}: ${title}`}
        >
          <span className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground" style={{ background: 'var(--gradient-accent)' }} aria-hidden>
            <BookOpen className="h-4 w-4" />
          </span>
          <h3 className="font-display text-xl uppercase tracking-wide text-electric sm:text-2xl">{title}</h3>
          <ArrowRight className="h-5 w-5 text-electric transition-transform group-hover:translate-x-1" />
        </Link>
        <div className="hidden gap-2 md:flex">
          <button type="button" onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' })} disabled={!canPrev}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/60 transition disabled:opacity-30 hover:border-primary/40" aria-label="Назад">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' })} disabled={!canNext}
            className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/60 transition disabled:opacity-30 hover:border-primary/40" aria-label="Вперёд">
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {articles.length === 0 ? (
        <p className="text-sm text-muted-foreground">{tt('В этой категории пока нет материалов.')}</p>
      ) : (
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {articles.map((a) => {
            const aTitle = lang === 'kz' && a.title_kz ? a.title_kz : a.title;
            const aSummary = lang === 'kz' && a.summary_kz ? a.summary_kz : a.summary ?? '';
            const href = a.id === 'kodeks-polnyi'
              ? `/codex${langQuery}`
              : a.id === 'rekomendovannye-ceny'
                ? `/prices${langQuery}`
                : `/workshop/article/${a.id}${langQuery}`;
            const cov = parseCover(a.cover_url);
            return (
              <Link key={a.id} href={href}
                className="group flex min-w-[260px] max-w-[320px] flex-1 basis-[280px] flex-col overflow-hidden rounded-2xl border border-border bg-background/60 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <div className="aspect-[565/642] w-full overflow-hidden bg-muted" style={{ backgroundImage: cov.src ? `url(${cov.src})` : 'var(--gradient-accent)', backgroundSize: 'cover', backgroundPosition: cov.src ? cov.position : 'center', backgroundRepeat: 'no-repeat' }} />
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h4 className="font-display text-base leading-tight transition-colors group-hover:text-electric">{aTitle}</h4>
                  {aSummary && <p className="line-clamp-3 text-xs text-muted-foreground">{aSummary}</p>}
                  <div className="mt-auto flex items-center justify-between pt-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <span>{a.author ?? tt('АВТОР')}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
