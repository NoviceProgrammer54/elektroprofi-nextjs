'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MessageCircle } from 'lucide-react';
import { useT, useLang, useTT } from '@/lib/i18n/useT';
import { Button } from '@/components/ui/button';
import { contacts } from '@/lib/data/contacts';
import { POLICIES } from '@/lib/data/policies';
import { PolicyDialog } from '@/components/PolicyDialog';

type ColLink = { label: string; to?: string; href?: string; onClick?: () => void };

export function Footer() {
  const t = useT();
  const tt = useTT();
  const lang = useLang();
  const langQuery = lang === 'kz' ? '?lang=kz' : '';
  const [openPolicy, setOpenPolicy] = useState<null | 'responsibility' | 'privacy'>(null);

  const daniil = contacts.find((c) => c.id === 'daniil');

  const cols: { title: string; links: ColLink[] }[] = [
    {
      title: tt('Сообщество'),
      links: [
        { label: tt('О сообществе'), to: '/about' },
        { label: tt('Электрики'), to: '/electricians' },
        { label: tt('Кодекс электрика'), to: '/codex' },
        { label: tt('Вступить'), to: '/join' },
      ],
    },
    {
      title: tt('Услуги'),
      links: [
        { label: tt('Нанять электрика'), to: '/hiring' },
        { label: tt('Цены на работы'), to: '/prices' },
        { label: tt('Мероприятия'), to: '/events' },
        { label: tt('Мастерская'), to: '/workshop' },
      ],
    },
    {
      title: tt('Партнёрам'),
      links: [
        { label: tt('Партнёры'), to: '/partners' },
        { label: tt('Спонсоры'), to: '/sponsors' },
        { label: tt('Контакты'), to: '/contacts' },
      ],
    },
    {
      title: tt('Документы'),
      links: [
        { label: tt('Пользовательское соглашение'), onClick: () => setOpenPolicy('responsibility') },
        { label: tt('Политика конфиденциальности'), onClick: () => setOpenPolicy('privacy') },
        { label: tt('Условия оказания услуг'), onClick: () => setOpenPolicy('responsibility') },
      ],
    },
  ];

  const responsibility = POLICIES.responsibility;
  const privacy = POLICIES.privacy;

  return (
    <footer className="mt-24 border-t border-border bg-surface/30 backdrop-blur-md">
      <div
        aria-hidden
        className="mx-auto h-px max-w-[1240px]"
        style={{
          background:
            'linear-gradient(to right, transparent, color-mix(in oklab, var(--primary) 35%, transparent), transparent)',
        }}
      />

      {/* Top: brand + metrics + CTAs */}
      <div className="mx-auto max-w-[1240px] px-6 pt-12">
        <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-start">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div
                className="grid h-12 w-12 place-items-center rounded-2xl font-black text-primary-foreground"
                style={{ background: 'var(--gradient-accent)', boxShadow: 'var(--shadow-glow)' }}
                aria-hidden
              >
                EP
              </div>
              <div>
                <div className="font-display text-2xl tracking-wider">ELEKTROPROFI</div>
                <p className="mt-0.5 text-xs text-muted-foreground">{t('footer.tagline')}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="sm" variant="default">
                <Link href={`/join${langQuery}`}>{tt('Вступить')}</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href={`/hiring${langQuery}`}>{tt('Вызвать электрика')}</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs text-muted-foreground sm:text-sm">
            <div className="font-semibold text-foreground">{tt('Основано в 2023')}</div>
            <div className="font-semibold text-foreground">{tt('Проведено более 100 мероприятий')}</div>
            <div>{tt('1500+ участников')}</div>
            <div>{tt('Ежегодные чемпионаты электриков')}</div>
          </div>
        </div>
      </div>

      {/* Columns */}
      <div className="mx-auto max-w-[1240px] px-6 pt-12 pb-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Контакты */}
          <div>
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
              {tt('Контакты')}
            </h3>
            <ul className="space-y-3 text-sm">
              {contacts.map((c) => (
                <li key={c.id} className="space-y-1">
                  <a
                    href={c.phoneHref}
                    className="flex items-center gap-2 text-foreground transition-colors hover:text-primary"
                  >
                    <Phone className="h-3.5 w-3.5" aria-hidden />
                    {c.phone}
                  </a>
                  <a
                    href={`mailto:${c.email}`}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    <Mail className="h-3.5 w-3.5" aria-hidden />
                    {c.email}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://www.tiktok.com/@elektroprofi.kz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.94a8.16 8.16 0 0 0 4.77 1.52V7a4.83 4.83 0 0 1-1.84-.31z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/elektroprofi.kz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@elektroprofi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href={daniil?.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`WhatsApp ${daniil?.whatsapp ?? ''}`}
                className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-[#25D366] hover:text-[#25D366]"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Other columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">
                {col.title}
              </h3>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.to ? (
                      <Link
                        href={`${l.to}${langQuery}`}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </Link>
                    ) : l.onClick ? (
                      <button
                        type="button"
                        onClick={l.onClick}
                        className="text-left text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </button>
                    ) : (
                      <a
                        href={l.href}
                        className="text-muted-foreground transition-colors hover:text-primary"
                      >
                        {l.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-[1240px] flex-col items-start justify-between gap-2 px-6 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© 2023–{new Date().getFullYear()} ELEKTROPROFI. {t('footer.rights')}.</div>
        </div>
      </div>

      <PolicyDialog
        policy={responsibility}
        open={openPolicy === 'responsibility'}
        onOpenChange={(o) => !o && setOpenPolicy(null)}
      />
      <PolicyDialog
        policy={privacy}
        open={openPolicy === 'privacy'}
        onOpenChange={(o) => !o && setOpenPolicy(null)}
      />
    </footer>
  );
}
