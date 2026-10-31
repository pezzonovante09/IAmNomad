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
  /** Скрыт с сайта: нет ни страницы, ни карточки (данные и тексты сохраняются). */
  hidden?: boolean;
}

const allTours = data.tours as Tour[];

/** Туры, видимые на сайте, в порядке из tours.json. */
export const tours = allTours.filter((t) => !t.hidden);

/** Индивидуальный тур и конструктор («Build your tour») показываются, только пока тур custom не скрыт. */
export const customTourEnabled = tours.some((t) => t.slug === 'custom');

export const tourCategories = (['all', 'classic', 'adventure', 'winter', 'individual'] as const).filter(
  (cat) => cat === 'all' || tours.some((t) => t.category === cat),
);

export function getTour(slug: TourSlug): Tour {
  const tour = allTours.find((t) => t.slug === slug);
  if (!tour) throw new Error(`Unknown tour: ${slug}`);
  return tour;
}
