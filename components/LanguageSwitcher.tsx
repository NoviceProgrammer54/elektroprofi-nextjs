'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLang } from '@/lib/i18n/useT';

type Lang = 'ru' | 'kz';

export function LanguageSwitcher() {
  const current = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLang = (lang: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'ru') {
      params.delete('lang');
    } else {
      params.set('lang', 'kz');
    }
    const qs = params.toString();
    router.replace(pathname + (qs ? `?${qs}` : ''), { scroll: false });
  };

  return (
    <div
      role="group"
      aria-label="Тіл / Язык"
      className="flex items-center rounded-xl border border-border bg-surface p-0.5 text-xs font-bold"
    >
      {(['ru', 'kz'] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={current === l}
          className={`rounded-lg px-2.5 py-1.5 uppercase transition ${
            current === l ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
