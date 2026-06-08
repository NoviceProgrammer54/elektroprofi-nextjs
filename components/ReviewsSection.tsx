'use client';
import { useEffect, useState } from 'react';
import { MessageSquareQuote } from 'lucide-react';
import { ReviewCard } from '@/components/ReviewCard';
import { useT } from '@/lib/i18n/useT';
import { createClient } from '@/lib/supabase/client';
import type { Review, ReviewRole } from '@/lib/data/reviews';

interface Props {
  roles?: ReviewRole[];
  eyebrow?: string;
  title?: string;
  lead?: string;
  altSection?: boolean;
  id?: string;
}

export function ReviewsSection({ roles, eyebrow, title, lead, altSection = true, id }: Props) {
  const t = useT();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const supabase = createClient();
    (async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, author_name, author_role, rating, text, published_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(500);
      if (error || !data) return;
      setReviews(
        data.map((r) => ({
          id: r.id,
          name: r.author_name,
          role: r.author_role as Review['role'],
          rating: r.rating as Review['rating'],
          text: r.text,
          date: (r.published_at ?? '').slice(0, 10),
        })),
      );
    })();
  }, []);

  const filtered = roles && roles.length > 0 ? reviews.filter((r) => roles.includes(r.role)) : reviews;

  if (!filtered || filtered.length === 0) return null;

  const headingId = id ? `${id}-h` : 'reviews-h';

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`section-home${altSection ? ' section-home--alt' : ''}`}
    >
      <div className="section-head">
        <span className="eyebrow">
          <MessageSquareQuote className="h-3.5 w-3.5" /> {eyebrow ?? t('reviews.eyebrow')}
        </span>
        <h2 id={headingId} className="mt-3 font-display text-3xl sm:text-4xl">
          {title ?? t('reviews.title')}
        </h2>
        <p className="max-w-2xl text-muted-foreground">{lead ?? t('reviews.lead')}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </section>
  );
}
