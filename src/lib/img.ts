// Фото хранятся на Unsplash — формируем ссылки нужного размера и srcset.

export type Photo = { id: string; alt: string };

export function unsplash(id: string, w: number, h?: number): string {
  // Свои файлы из public (путь начинается с /) отдаём как есть.
  if (id.startsWith('/')) return id;
  const size = h ? `w=${w}&h=${h}` : `w=${w}`;
  return `https://images.unsplash.com/photo-${id}?${size}&q=70&auto=format&fit=crop`;
}

/** srcset для заданных ширин; ratio = высота/ширина, чтобы кадрирование совпадало. */
export function srcset(id: string, widths: number[], ratio?: number): string {
  if (id.startsWith('/')) return '';
  return widths
    .map((w) => `${unsplash(id, w, ratio ? Math.round(w * ratio) : undefined)} ${w}w`)
    .join(', ');
}
