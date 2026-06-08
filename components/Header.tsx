'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useT, useLang } from '@/lib/i18n/useT';
import { LanguageSwitcher } from './LanguageSwitcher';
import { LanguageModal } from './LanguageModal';

interface DropdownItem { to: string; key: string }
interface NavItem { to: string; key: string; dropdown?: DropdownItem[] }

const navItems: NavItem[] = [
  {
    to: '/about',
    key: 'nav.about',
    dropdown: [
      { to: '/about', key: 'nav.about' },
      { to: '/electricians', key: 'nav.electricians' },
      { to: '/codex', key: 'nav.codex' },
    ],
  },
  { to: '/events', key: 'nav.events' },
  { to: '/workshop', key: 'nav.workshop' },
  {
    to: '/partners',
    key: 'nav.partners',
    dropdown: [
      { to: '/partners', key: 'nav.partners' },
      { to: '/sponsors', key: 'nav.sponsors' },
    ],
  },
  { to: '/contacts', key: 'nav.contacts' },
];

export function Header() {
  const t = useT();
  const lang = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const langQuery = lang === 'kz' ? '?lang=kz' : '';

  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpenDropdown(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openDropdown]);

  const scheduleClose = (key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown((v) => (v === key ? null : v)), 120);
  };
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };

  const isActive = (to: string) => pathname === to || pathname.startsWith(to + '/');

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/60 backdrop-blur-xl">
      <a href="#main" className="skip-link">
        {t('skip.toContent')}
      </a>
      <div className="mx-auto flex max-w-[1240px] items-center gap-4 px-6 py-3">

        {/* Logo */}
        <Link href={`/${langQuery}`} className="flex items-center gap-3 shrink-0" aria-label={t('header.aria.logo')}>
          <div
            className="grid h-11 w-11 place-items-center rounded-2xl font-black text-primary-foreground"
            style={{ background: 'var(--gradient-accent)', boxShadow: 'var(--shadow-glow)' }}
          >
            EP
          </div>
          <div className="hidden flex-col leading-none sm:flex">
            <strong className="font-display text-2xl tracking-wider">ELEKTROPROFI</strong>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Almaty • Kazakhstan
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label={t('header.aria.mainNav')} className="hidden flex-1 justify-center gap-1 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.to);
            const isOpen = openDropdown === item.to;

            if (item.dropdown) {
              return (
                <div
                  key={item.to}
                  className="relative"
                  onMouseEnter={() => { cancelClose(); setOpenDropdown(item.to); }}
                  onMouseLeave={() => scheduleClose(item.to)}
                >
                  <button
                    type="button"
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    onClick={() => setOpenDropdown(isOpen ? null : item.to)}
                    className={`inline-flex items-center gap-1 rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                      active
                        ? 'border-primary/30 bg-primary/10 text-foreground'
                        : 'border-transparent text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                    }`}
                  >
                    {t(item.key)}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden />
                  </button>

                  <div
                    role="menu"
                    aria-hidden={!isOpen}
                    onMouseEnter={() => { cancelClose(); setOpenDropdown(item.to); }}
                    onMouseLeave={() => scheduleClose(item.to)}
                    className={`absolute left-1/2 top-full z-50 mt-3 w-52 -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background/95 p-1 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
                      isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.to}
                        href={`${sub.to}${langQuery}`}
                        role="menuitem"
                        tabIndex={isOpen ? 0 : -1}
                        onClick={() => setOpenDropdown(null)}
                        className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-primary/10 focus:bg-primary/10 focus:outline-none ${
                          isActive(sub.to) ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {t(sub.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                href={`${item.to}${langQuery}`}
                className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-all ${
                  active
                    ? 'border-primary/30 bg-primary/10 text-foreground'
                    : 'border-transparent text-muted-foreground hover:bg-primary/10 hover:text-foreground'
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <LanguageModal />
          <Button asChild variant="outline" size="sm" className="hidden font-semibold md:inline-flex">
            <Link href={`/join${langQuery}`}>{t('nav.join')}</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden font-bold md:inline-flex"
            style={{ background: 'var(--gradient-accent)', color: 'var(--primary-foreground)' }}
          >
            <Link href={`/hiring${langQuery}`}>{t('cta.hire')}</Link>
          </Button>
          <button
            type="button"
            aria-label={t('header.aria.menu')}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-border lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background/95 lg:hidden">
          <nav
            aria-label={t('header.aria.mobileNav')}
            className="mx-auto flex max-w-[1240px] flex-col gap-1 px-6 py-4"
          >
            {navItems.map((item) => {
              if (item.dropdown) {
                const expanded = mobileExpanded === item.to;
                return (
                  <div key={item.to}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileExpanded(expanded ? null : item.to)}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10"
                    >
                      <span>{t(item.key)}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden />
                    </button>
                    {expanded && (
                      <div className="ml-3 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                        {item.dropdown.map((sub) => (
                          <Link
                            key={sub.to}
                            href={`${sub.to}${langQuery}`}
                            onClick={() => { setMobileOpen(false); setMobileExpanded(null); }}
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-primary/10 hover:text-foreground"
                          >
                            {t(sub.key)}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item.to}
                  href={`${item.to}${langQuery}`}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground hover:bg-primary/10"
                >
                  {t(item.key)}
                </Link>
              );
            })}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="font-semibold"
                onClick={() => { setMobileOpen(false); router.push(`/join${langQuery}`); }}
              >
                {t('nav.join')}
              </Button>
              <Button
                className="font-bold"
                style={{ background: 'var(--gradient-accent)', color: 'var(--primary-foreground)' }}
                onClick={() => { setMobileOpen(false); router.push(`/hiring${langQuery}`); }}
              >
                {t('cta.hire')}
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
