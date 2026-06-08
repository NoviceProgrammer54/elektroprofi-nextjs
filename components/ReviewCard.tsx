'use client';
import { Star } from 'lucide-react';
import type { Review } from '@/lib/data/reviews';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const initials = review.name
    .split(' ')
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const formattedDate = new Date(review.date).toLocaleDateString(
    lang === 'kz' ? 'kk-KZ' : 'ru-RU',
    { year: 'numeric', month: 'long' },
  );

  return (
    <article
      className="review-card group relative flex h-full flex-col gap-4 rounded-[var(--radius-card)] border p-6 transition"
      style={{
        background: 'var(--color-depth-1)',
        borderColor: 'var(--color-border)',
      }}
    >
      {/* Role badge + Rating */}
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {t(`reviews.role.${review.role}`)}
        </span>
        <div className="flex items-center gap-0.5" aria-label={`${review.rating} / 5`}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star
              key={i}
              className={cn(
                'h-3.5 w-3.5 transition',
                i <= review.rating ? 'text-primary' : 'text-muted-foreground/30',
              )}
              fill={i <= review.rating ? 'currentColor' : 'none'}
              strokeWidth={1.5}
            />
          ))}
        </div>
      </div>

      {/* Text */}
      <blockquote
        className="font-sans text-sm leading-relaxed sm:text-base"
        style={{ color: 'var(--color-text-normal)' }}
      >
        «{tt(review.text)}»
      </blockquote>

      {/* Author */}
      <footer className="mt-auto flex items-center gap-3 pt-2">
        {review.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={review.avatarUrl}
            alt={review.name}
            className="h-10 w-10 rounded-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="grid h-10 w-10 place-items-center rounded-full font-display text-sm text-primary-foreground"
            style={{ background: 'var(--gradient-accent)' }}
            aria-hidden
          >
            {initials}
          </div>
        )}
        <div className="min-w-0">
          <div
            className="truncate font-semibold"
            style={{ color: 'var(--color-text-strong)' }}
          >
            {tt(review.name)}
          </div>
          <div className="text-xs text-muted-foreground">{formattedDate}</div>
        </div>
      </footer>
    </article>
  );
}
