'use client';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useWorkshopArticle } from '@/hooks/useWorkshop';
import { useLang, useTT } from '@/lib/i18n/useT';
import { parseCover } from '@/lib/cover-position';
import { use, type ReactNode } from 'react';

/**
 * Markdown renderer styled to match the /codex page:
 * - ## headings render as electric section titles
 * - ### headings render as electric subtitles
 * - bullets get a glowing primary dot
 * - numbered lists get a chip-numbered layout
 * - bold + inline code supported
 */
function renderMarkdown(src: string) {
  const lines = src.split('\n');
  const blocks: ReactNode[] = [];
  let ulBuf: string[] = [];
  let olBuf: string[] = [];
  let pBuf: string[] = [];

  const inline = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>')
      .replace(/`([^`]+?)`/g, '<code class="rounded bg-muted px-1 py-0.5 text-[0.85em]">$1</code>');

  const flushUl = () => {
    if (ulBuf.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-4 space-y-2 text-sm">
          {ulBuf.map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" />
              <span dangerouslySetInnerHTML={{ __html: inline(item) }} />
            </li>
          ))}
        </ul>,
      );
      ulBuf = [];
    }
  };
  const flushOl = () => {
    if (olBuf.length) {
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="my-4 space-y-2 text-sm">
          {olBuf.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-primary/15 font-display text-xs text-electric">
                {i + 1}
              </span>
              <span dangerouslySetInnerHTML={{ __html: inline(item) }} />
            </li>
          ))}
        </ol>,
      );
      olBuf = [];
    }
  };
  const flushP = () => {
    if (pBuf.length) {
      blocks.push(
        <p
          key={`p-${blocks.length}`}
          className="my-3 text-sm leading-relaxed text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: inline(pBuf.join(' ')) }}
        />,
      );
      pBuf = [];
    }
  };
  const flushAll = () => {
    flushUl();
    flushOl();
    flushP();
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushAll();
      continue;
    }
    if (line.startsWith('### ')) {
      flushAll();
      blocks.push(
        <h3 key={`h3-${blocks.length}`} className="mt-6 font-display text-lg text-electric">
          {line.slice(4)}
        </h3>,
      );
    } else if (line.startsWith('## ')) {
      flushAll();
      blocks.push(
        <h2 key={`h2-${blocks.length}`} className="mt-8 font-display text-xl text-electric sm:text-2xl">
          {line.slice(3)}
        </h2>,
      );
    } else if (line.startsWith('# ')) {
      flushAll();
      blocks.push(
        <h1 key={`h1-${blocks.length}`} className="mt-8 font-display text-2xl sm:text-3xl">
          {line.slice(2)}
        </h1>,
      );
    } else if (/^!\[([^\]]*)\]\(([^)]+)\)\s*$/.test(line)) {
      flushAll();
      const m = line.match(/^!\[([^\]]*)\]\(([^)]+)\)\s*$/)!;
      blocks.push(
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`img-${blocks.length}`}
          src={m[2]}
          alt={m[1]}
          className="my-6 w-full rounded-xl border border-border/40 object-cover"
          loading="lazy"
        />,
      );
    } else if (/^[-*]\s+/.test(line)) {
      flushOl();
      flushP();
      ulBuf.push(line.replace(/^[-*]\s+/, ''));
    } else if (/^\d+\.\s+/.test(line)) {
      flushUl();
      flushP();
      olBuf.push(line.replace(/^\d+\.\s+/, ''));
    } else {
      flushUl();
      flushOl();
      pBuf.push(line);
    }
  }
  flushAll();
  return blocks;
}

export default function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { article, category, loading, notFound } = useWorkshopArticle(id);
  const lang = useLang();
  const tt = useTT();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  if (loading) return <div className="page-stack"><p className="text-muted-foreground">{tt('Загрузка…')}</p></div>;
  if (notFound || !article) return (
    <div className="page-stack">
      <h1 className="font-display text-3xl">{tt('Статья не найдена')}</h1>
      <Link href={`/workshop${langQuery}`} className="text-electric inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" /> {tt('Вернуться в Мастерскую')}
      </Link>
    </div>
  );

  const title = lang === 'kz' && article.title_kz ? article.title_kz : article.title;
  const summary = lang === 'kz' && article.summary_kz ? article.summary_kz : article.summary ?? '';
  const content = lang === 'kz' && article.content_kz ? article.content_kz : article.content ?? '';
  const catTitle = category
    ? lang === 'kz' && category.title_kz
      ? category.title_kz
      : category.title
    : '';

  return (
    <article className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <Link href={`/workshop${langQuery}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            {tt('Мастерская')}
          </Link>
          {category && (
            <div className="mt-4">
              <Link href={`/workshop/category/${category.id}${langQuery}`} className="eyebrow inline-block hover:text-electric">
                {catTitle}
              </Link>
            </div>
          )}
          <h1 className="page-title mt-4">{title}</h1>
          {summary && <p className="page-lead">{summary}</p>}
          {article.author && (
            <p className="mt-3 text-xs uppercase tracking-wider text-muted-foreground">
              {tt('Автор')}: {article.author}
            </p>
          )}
        </div>
      </header>

      {article.cover_url && (() => {
        const cov = parseCover(article.cover_url);
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cov.src}
            alt={title}
            className="w-full rounded-2xl object-cover"
            style={{ maxHeight: '480px', objectPosition: cov.position }}
          />
        );
      })()}

      <div className="card-premium p-6 sm:p-10">
        <div className="prose prose-invert max-w-none">
          {content ? renderMarkdown(content) : (
            <p className="text-muted-foreground">{tt('Контент скоро появится.')}</p>
          )}
        </div>
      </div>
    </article>
  );
}
