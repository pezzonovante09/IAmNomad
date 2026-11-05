// Фото: ID с Unsplash (формируем ссылки нужного размера и srcset),
// своя ссылка https://… или загруженный файл /uploads/… — отдаём как есть.
// Для /uploads/… srcset собирается из уменьшенных WebP-копий (scripts/image-variants.mjs).

export type Photo = { id: string; alt: string; altRu?: string };

/** Описание фото на языке страницы; если русского нет, берём основное (английское). */
export function altOf(photo: Photo, lang: 'ru' | 'en'): string {
  return (lang === 'ru' && photo.altRu) || photo.alt;
}

// Список копий создаётся перед dev/build; если его нет, у своих фото srcset пустой и грузится оригинал.
type Variants = Record<string, { w: number; sizes: number[] }>;
const variants = (Object.values(import.meta.glob('../data/image-variants.json', { eager: true, import: 'default' }))[0] ?? {}) as Variants;

export function unsplash(id: string, w: number, h?: number): string {
  // Свои файлы из public (путь начинается с /) отдаём как есть.
  if (id.startsWith('/') || /^https?:/.test(id)) return id;
  const size = h ? `w=${w}&h=${h}` : `w=${w}`;
  return `https://images.unsplash.com/photo-${id}?${size}&q=70&auto=format&fit=crop`;
}

/** srcset для заданных ширин; ratio = высота/ширина, чтобы кадрирование совпадало. */
export function srcset(id: string, widths: number[], ratio?: number): string {
  if (id.startsWith('/')) {
    // Свои фото: готовые WebP-копии 480/960/1440 px и копия во всю ширину; ширины берутся из списка копий.
    const v = variants[id];
    if (!v) return '';
    const base = id.replace(/^\/uploads\//, '/uploads/_w/').replace(/\.[^.]+$/, '');
    return v.sizes.map((w) => `${encodeURI(`${base}-${w}.webp`)} ${w}w`).join(', ');
  }
  if (/^https?:/.test(id)) return '';
  return widths
    .map((w) => `${unsplash(id, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ');
}
