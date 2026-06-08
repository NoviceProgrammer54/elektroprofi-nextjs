'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface WorkshopCategory {
  id: string;
  section: 'knowledge' | 'media';
  title: string;
  title_kz: string | null;
  sort_order: number;
}

export interface WorkshopArticle {
  id: string;
  category_id: string;
  title: string;
  title_kz: string | null;
  author: string | null;
  summary: string | null;
  summary_kz: string | null;
  cover_url: string | null;
  content: string | null;
  content_kz: string | null;
  published: boolean;
  sort_order: number;
}

export function useWorkshop() {
  const [categories, setCategories] = useState<WorkshopCategory[]>([]);
  const [articles, setArticles] = useState<WorkshopArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      const [{ data: cats }, { data: arts }] = await Promise.all([
        supabase.from('workshop_categories').select('*').eq('deleted', false).order('sort_order'),
        supabase.from('workshop_articles').select('*').eq('published', true).order('sort_order'),
      ]);
      if (cancelled) return;
      setCategories((cats ?? []) as WorkshopCategory[]);
      setArticles((arts ?? []) as WorkshopArticle[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  return { categories, articles, loading };
}

export function useWorkshopArticle(id: string) {
  const [article, setArticle] = useState<WorkshopArticle | null>(null);
  const [category, setCategory] = useState<WorkshopCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data: art } = await supabase.from('workshop_articles').select('*').eq('id', id).eq('published', true).maybeSingle();
      if (cancelled) return;
      if (!art) { setNotFound(true); setLoading(false); return; }
      setArticle(art as WorkshopArticle);
      const { data: cat } = await supabase.from('workshop_categories').select('*').eq('id', art.category_id).maybeSingle();
      if (cancelled) return;
      setCategory((cat as WorkshopCategory) ?? null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { article, category, loading, notFound };
}

export function useWorkshopCategory(id: string) {
  const [category, setCategory] = useState<WorkshopCategory | null>(null);
  const [articles, setArticles] = useState<WorkshopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let cancelled = false;
    (async () => {
      setLoading(true);
      setNotFound(false);
      const { data: cat } = await supabase.from('workshop_categories').select('*').eq('id', id).eq('deleted', false).maybeSingle();
      if (cancelled) return;
      if (!cat) { setNotFound(true); setLoading(false); return; }
      setCategory(cat as WorkshopCategory);
      const { data: arts } = await supabase.from('workshop_articles').select('*').eq('category_id', id).eq('published', true).order('sort_order');
      if (cancelled) return;
      setArticles((arts ?? []) as WorkshopArticle[]);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [id]);

  return { category, articles, loading, notFound };
}
