'use client';
import { useSearchParams } from 'next/navigation';
import ru from './ru.json';
import kz from './kz.json';

const autoKz: Record<string, string> = {};

type Lang = 'ru' | 'kz';

const dict: Record<Lang, Record<string, string>> = {
  ru: ru as Record<string, string>,
  kz: kz as Record<string, string>,
};

export function useLang(): Lang {
  const params = useSearchParams();
  return params.get('lang') === 'kz' ? 'kz' : 'ru';
}

export function useT() {
  const lang = useLang();
  return (key: string): string => dict[lang][key] ?? dict.ru[key] ?? key;
}

export function useTT() {
  const lang = useLang();
  return (text: string | undefined | null): string => {
    if (!text) return '';
    if (lang !== 'kz') return text;
    return autoKz[text.trim()] ?? autoKz[text] ?? text;
  };
}
