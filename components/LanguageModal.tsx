'use client';
import { useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Globe, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useT, useLang, useTT } from '@/lib/i18n/useT';

type Lang = 'ru' | 'kz';

const OPTIONS: { value: Lang; nativeKey: 'lang.ru.native' | 'lang.kz.native'; flag: string }[] = [
  { value: 'ru', nativeKey: 'lang.ru.native', flag: '🇷🇺' },
  { value: 'kz', nativeKey: 'lang.kz.native', flag: '🇰🇿' },
];

export function LanguageModal() {
  const t = useT();
  const current = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const choose = (lang: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'ru') {
      params.delete('lang');
    } else {
      params.set('lang', 'kz');
    }
    const qs = params.toString();
    router.replace(pathname + (qs ? `?${qs}` : ''), { scroll: false });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t('lang.modal.openAria')}
          className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{t('lang.modal.title')}</DialogTitle>
          <DialogDescription>{t('lang.modal.subtitle')}</DialogDescription>
        </DialogHeader>

        <div className="mt-2 grid gap-2">
          {OPTIONS.map((opt) => {
            const active = current === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                aria-pressed={active}
                className={`flex items-center justify-between rounded-2xl border p-4 text-left transition ${
                  active
                    ? 'border-primary/50 bg-primary/10 shadow-[var(--shadow-glow)]'
                    : 'border-border bg-surface/40 hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                <span className="flex items-center gap-3">
                  <span aria-hidden className="text-2xl leading-none">
                    {opt.flag}
                  </span>
                  <span className="flex flex-col">
                    <span className="font-display text-lg leading-tight text-foreground">
                      {t(opt.nativeKey)}
                    </span>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">
                      {opt.value === 'ru' ? 'Русский язык' : 'Қазақ тілі'}
                    </span>
                  </span>
                </span>
                {active ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                    <Check className="h-3 w-3" /> {t('lang.current')}
                  </span>
                ) : (
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {opt.value}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
