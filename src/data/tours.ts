import type { Photo } from '../lib/img';
import data from '../content/tours.json';

// Тексты туров — в src/content/texts (ключи tour.<slug>.* и tours.cardN.*),
// структура (фото, дни, количество пунктов, статус) — в src/content/tours.json.
// И то и другое редактируется в админке (/admin).

export type TourSlug =
  | 'classic'
  | 'adventure'
  | 'winter'
  | 'digital-nomad'
  | 'grand-tour'
  | 'family'
  | 'handicraft'
  | 'retreat'
  | 'sport-camp'
  | 'custom';
export type TourStatus = 'open' | 'soon' | 'request';
export type TourCategory = 'classic' | 'adventure' | 'winter' | 'culture' | 'family' | 'workation' | 'retreat' | 'sport' | 'individual';

export interface Tour {
  slug: TourSlug;
  /** Префикс ключей карточки: tours.card1 и т.п. */
  card: string;
  category: TourCategory;
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

/** У тура «Скоро» без программы (0 дней) нет своей страницы — только строка в каталоге с коротким описанием. */
export const hasPage = (tour: Tour) => tour.status !== 'soon' || tour.days > 0;

/** Индивидуальный тур и конструктор («Build your tour») показываются, только пока тур custom не скрыт. */
export const customTourEnabled = tours.some((t) => t.slug === 'custom');

/** Вкладки фильтра на странице туров: «Все» и категории в том порядке, в каком идут туры. */
export const tourCategories = ['all', ...new Set(tours.map((t) => t.category))];

export function getTour(slug: TourSlug): Tour {
  const tour = allTours.find((t) => t.slug === slug);
  if (!tour) throw new Error(`Unknown tour: ${slug}`);
  return tour;
}
