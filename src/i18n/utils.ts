import { translations } from './translations';
import { ui } from './ui';

export const languages = { ru: 'RU', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ru';

type Dict = Record<string, string>;
const dicts: Record<Lang, Dict> = {
  ru: { ...translations.ru, ...ui.ru },
  en: { ...translations.en, ...ui.en },
};

export function useTranslations(lang: Lang) {
  const dict = dicts[lang];
  /** Перевод по ключу; если ключа нет — берём русский, затем сам ключ. */
  return function t(key: string): string {
    return dict[key] ?? dicts[defaultLang][key] ?? key;
  };
}

export function has(lang: Lang, key: string): boolean {
  return key in dicts[lang];
}

/** Путь страницы с учётом языка: '/tours/' → '/en/tours/' для en. */
export function localize(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path === '/' ? '/' : path}`;
}

/** Текст «• пункт\n• пункт» → массив пунктов. */
export function bullets(text: string): string[] {
  return text
    .split('\n')
    .map((line) => line.replace(/^\s*•\s*/, '').trim())
    .filter(Boolean);
}

/** «🏙️ Обзорная экскурсия» → { icon: '🏙️', text: 'Обзорная экскурсия' }. */
export function splitEmoji(text: string): { icon: string; text: string } {
  const m = text.match(/^(\p{Extended_Pictographic}(?:️|‍|\p{Extended_Pictographic})*)\s*/u);
  return m ? { icon: m[1], text: text.slice(m[0].length) } : { icon: '', text };
}
