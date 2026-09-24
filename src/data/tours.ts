import type { Photo } from '../lib/img';
import data from '../content/tours.json';

// Тексты туров — в src/content/texts (ключи tour.<slug>.* и tours.cardN.*),
// структура (фото, дни, количество пунктов, статус) — в src/content/tours.json.
// И то и другое редактируется в админке (/admin).

export type TourSlug = 'classic' | 'adventure' | 'winter' | 'custom';
export type TourStatus = 'open' | 'soon' | 'request';

export interface Tour {
  slug: TourSlug;
  /** Префикс ключей карточки: tours.card1 и т.п. */
  card: string;
  category: 'classic' | 'adventure' | 'winter' | 'individual';
  status: TourStatus;
  cover: Photo;
  gallery: Photo[];
  mapQuery?: string;
  days: number;
  highlights: number;
  extras: number;
  dates: number;
}

export const tours = data.tours as Tour[];

export const tourCategories = ['all', 'classic', 'adventure', 'winter', 'individual'] as const;

export function getTour(slug: TourSlug): Tour {
  const tour = tours.find((t) => t.slug === slug);
  if (!tour) throw new Error(`Unknown tour: ${slug}`);
  return tour;
}
