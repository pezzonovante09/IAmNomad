// Все тексты сайта лежат в src/content/texts/*.json (по разделам) и редактируются в админке (/admin).
// В файле ключи хранятся с «__» вместо точек: home__hero__line1 → home.hero.line1.

export const languages = { ru: 'RU', en: 'EN' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'ru';

type Dict = Record<string, string>;
const files = import.meta.glob<Record<Lang, Dict>>('../content/texts/*.json', { eager: true, import: 'default' });
const dicts: Record<Lang, Dict> = { ru: {}, en: {} };
for (const file of Object.values(files)) {
  for (const lang of Object.keys(dicts) as Lang[]) {
    for (const [name, value] of Object.entries(file[lang] ?? {})) dicts[lang][name.replaceAll('__', '.')] = value;
  }
}

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
