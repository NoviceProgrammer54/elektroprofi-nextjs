'use client';
import Link from 'next/link';
import { Award, GraduationCap, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { CodexSection } from '@/components/CodexSection';
import { buttonVariants } from '@/components/ui/button';
import { useLang, useT, useTT } from '@/lib/i18n/useT';
import { cn } from '@/lib/utils';

export default function AboutPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const principles = [
    { icon: ShieldCheck, title: t('about.principle.safety.title'), text: t('about.principle.safety.text') },
    { icon: HeartHandshake, title: t('about.principle.honesty.title'), text: t('about.principle.honesty.text') },
    { icon: GraduationCap, title: t('about.principle.growth.title'), text: t('about.principle.growth.text') },
    { icon: Award, title: t('about.principle.partnership.title'), text: t('about.principle.partnership.text') },
  ];
  const activities = [t('about.activity.masterclasses'),t('about.activity.seminars'),t('about.activity.championships'),t('about.activity.openLessons'),t('about.activity.brandEvents'),t('about.activity.reputation')];
  const goals = [t('about.goal.safety'),t('about.goal.professionalism'),t('about.goal.uniting'),t('about.goal.international')];
  const metrics = [{v:'1500+',l:t('about.metric.members')},{v:'30+',l:t('about.metric.residents')},{v:'8+',l:t('about.metric.reps')},{v:'10+',l:t('about.metric.cities')}];
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><Users className="h-3.5 w-3.5" /> {t('about.badge')}</span>
          <h1 className="page-title mt-5">{t('about.title')}</h1>
          <p className="page-lead">{t('about.lead')}</p>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {metrics.map(m=><div key={m.l} className="rounded-2xl border border-primary/20 bg-primary/10 p-4 text-center"><div className="font-display text-3xl text-primary">{m.v}</div><div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{m.l}</div></div>)}
          </div>
        </div>
      </header>
      <section aria-labelledby="history-h"><h2 id="history-h" className="section-title">{t('about.history.title')}</h2><div className="mt-5 space-y-4 max-w-3xl text-muted-foreground"><p>{t('about.history.p1')}</p><p>{t('about.history.p2')}</p><p>{t('about.history.p3')}</p></div></section>
      <section aria-labelledby="mission-h"><h2 id="mission-h" className="section-title">{t('about.mission.title')}</h2><p className="mt-3 max-w-3xl font-bold text-foreground">{t('about.mission.boldLead')}</p><p className="mt-2 max-w-3xl text-muted-foreground">{t('about.mission.body')}</p><ul className="mt-5 grid gap-3 sm:grid-cols-2">{goals.map(g=><li key={g} className="flex items-start gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{g}</span></li>)}</ul></section>
      <section aria-labelledby="principles-h"><h2 id="principles-h" className="section-title">{t('about.principles.title')}</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{principles.map(p=><article key={p.title} className="card-premium p-5"><div className="grid h-10 w-10 place-items-center rounded-xl text-primary-foreground" style={{background:'var(--gradient-accent)'}}><p.icon className="h-5 w-5" /></div><h3 className="mt-4 font-display text-lg">{p.title}</h3><p className="mt-1 text-sm text-muted-foreground">{p.text}</p></article>)}</div></section>
      <section aria-labelledby="do-h"><h2 id="do-h" className="section-title">{t('about.do.title')}</h2><p className="mt-3 max-w-3xl text-muted-foreground">{t('about.do.lead')}</p><ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{activities.map(a=><li key={a} className="flex items-start gap-2 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" /><span>{a}</span></li>)}</ul></section>
      <CodexSection />
      <section className="cta-band section-rise"><h2 className="font-display text-2xl sm:text-3xl">{t('about.cta.title')}</h2><p className="mt-3 text-muted-foreground">{t('about.cta.lead')}</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href={`/join${langQuery}`} className={cn(buttonVariants(),'btn-electric font-bold')}>{tt('Вступить')}</Link><Link href={`/hiring${langQuery}`} className={cn(buttonVariants({variant:'outline'}),'font-semibold')}>{tt('Нанять электрика')}</Link></div></section>
    </div>
  );
}
