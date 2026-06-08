'use client';
import { useMemo } from 'react';
import { WorkshopSlider } from '@/components/WorkshopSlider';
import { useWorkshop } from '@/hooks/useWorkshop';
import { useLang, useTT } from '@/lib/i18n/useT';

export default function WorkshopPage() {
  const { categories, articles } = useWorkshop();
  const lang = useLang();
  const tt = useTT();
  const byCategory = useMemo(()=>{
    const map = new Map<string, typeof articles>();
    for(const a of articles){if(!map.has(a.category_id))map.set(a.category_id,[]);map.get(a.category_id)!.push(a);}
    return map;
  },[articles]);
  const knowledge = categories.filter(c=>c.section==='knowledge');
  const media = categories.filter(c=>c.section==='media');
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow">{tt('Мастерская ELEKTROPROFI')}</span>
          <h1 className="page-title mt-5">{tt('Мастерская')} <span className="text-electric">2026</span></h1>
          <p className="page-lead">{tt('База знаний и медиа сообщества. Статьи, гайды, видео, кейсы и интервью — всё, что помогает электрику расти в профессии.')}</p>
        </div>
      </header>
      {knowledge.length>0&&(
        <section aria-labelledby="knowledge-h">
          <h2 id="knowledge-h" className="section-title mb-5">{tt('База знаний')}</h2>
          <div className="space-y-6">{knowledge.map(cat=><WorkshopSlider key={cat.id} category={cat} articles={byCategory.get(cat.id)??[]} />)}</div>
        </section>
      )}
      {media.length>0&&(
        <section aria-labelledby="media-h">
          <h2 id="media-h" className="section-title mb-5">{tt('Медиа')}</h2>
          <div className="space-y-6">{media.map(cat=><WorkshopSlider key={cat.id} category={cat} articles={byCategory.get(cat.id)??[]} />)}</div>
        </section>
      )}
      {categories.length===0&&<p className="text-muted-foreground">{tt('Материалы скоро появятся.')}</p>}
    </div>
  );
}
