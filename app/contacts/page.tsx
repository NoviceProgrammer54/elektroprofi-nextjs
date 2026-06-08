'use client';
import { Mail, MessageCircle, User } from 'lucide-react';
import { contacts } from '@/lib/data/contacts';
import { useLang, useT, useTT } from '@/lib/i18n/useT';

export default function ContactsPage() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  return (
    <div className="page-stack">
      <header className="page-hero section-rise">
        <div className="page-hero-glow" aria-hidden />
        <div className="relative z-10">
          <span className="eyebrow"><User className="h-3.5 w-3.5" /> {tt('Команда')}</span>
          <h1 className="page-title mt-5">{t('nav.contacts')}</h1>
          <p className="page-lead">{t('contacts.lead')}</p>
        </div>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        {contacts.map(p => {
          const role = lang === 'kz' && p.roleKz ? p.roleKz : p.role;
          const responsibility = p.id === 'mavlid' ? t('contacts.respMavlid') : t('contacts.respDaniil');
          return (
            <article key={p.id} className="card-premium flex flex-col gap-5 p-6">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl text-primary-foreground" style={{background:'var(--gradient-accent)'}}><User className="h-6 w-6" /></div>
                <div><div className="font-display text-2xl leading-tight">{tt(p.name)}</div><div className="text-sm text-muted-foreground">{role}</div></div>
              </div>
              <p className="text-sm text-muted-foreground">{responsibility}</p>
              <ul className="space-y-3">
                <li><a href={p.whatsappHref} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3 transition hover:border-primary/40"><span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-500"><MessageCircle className="h-4 w-4" /></span><span className="flex flex-col"><span className="text-xs uppercase tracking-wider text-muted-foreground">WhatsApp</span><span className="font-semibold">{p.whatsapp}</span></span></a></li>
                <li><a href={p.phoneHref} className="group flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3 transition hover:border-primary/40"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><MessageCircle className="h-4 w-4" /></span><span className="flex flex-col"><span className="text-xs uppercase tracking-wider text-muted-foreground">{t('common.phone')}</span><span className="font-semibold">{p.phone}</span></span></a></li>
                <li><a href={`mailto:${p.email}`} className="group flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-3 transition hover:border-primary/40"><span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Mail className="h-4 w-4" /></span><span className="flex flex-col"><span className="text-xs uppercase tracking-wider text-muted-foreground">{t('common.email')}</span><span className="font-semibold">{p.email}</span></span></a></li>
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
