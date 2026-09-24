import type { Photo } from '../lib/img';

// ─────────────────────────────────────────────────────────────
// I AM NOMAD SHOW — всё медиа и цифры страницы /show в одном месте.
//
// ВИДЕО. Можно указать:
//   • файл из папки public, например '/video/show-hero.mp4' (положите файл в public/video/);
//   • ссылку для встраивания YouTube: 'https://www.youtube.com/embed/ID'.
// Пока видео нет, вместо него показывается фото (poster), а кнопки «Смотреть видео»
// ведут на YouTube-канал — ничего не ломается.
//
// ФОТО. Сейчас стоят временные фото с других страниц сайта (Unsplash-ID).
// Замените на реальные фото шоу: id с Unsplash или путь к файлу в public ('/img/show/1.jpg').
// ─────────────────────────────────────────────────────────────

export type ShowMedia = Photo & { video?: string };

export const showVideos = {
  /** Фоновое видео первого экрана (mp4, без звука, короткий цикл 10–30 с). */
  hero: '',
  /** Основное видео для блока «Смотрите шоу» и кнопки «Смотреть видео». */
  main: '',
};

export const showPosters = {
  hero: { id: '1761873177867-499c27dc4cd7', alt: 'Horse show' } as Photo,
  video: { id: '1761872936161-9c2075a7ca11', alt: 'Eagle hunters' } as Photo,
};

/** Пять блоков «Что вас ждёт» (тексты — show.what.N.*). */
export const showMoments: Photo[] = [
  { id: '1758016860798-0b96354664b9', alt: 'Welcome ceremony by the yurts' },
  { id: '1761873177867-499c27dc4cd7', alt: 'Horse show' },
  { id: '1761872936161-9c2075a7ca11', alt: 'Photos with golden eagles' },
  { id: '1760630149964-200517d8d437', alt: 'National lunch' },
  { id: '1689788648053-cd482d1acd9c', alt: 'Closing ceremony' },
];

export const showTimeline = ['11:00', '11:20', '12:00', '13:00', '14:00'];

export const showStats = [
  { value: 110, suffix: '+', key: 'participants' },
  { value: 8, key: 'horses' },
  { value: 2, key: 'eagles' },
  { value: 2, key: 'falcons' },
  { value: 2, key: 'taigans' },
  { value: 3, key: 'yurts' },
];

/** Галерея: фото открываются в полном размере, элементы с video — во всплывающем плеере. */
export const showGallery: ShowMedia[] = [
  { id: '1761873177867-499c27dc4cd7', alt: 'Horse show' },
  { id: '1761872936161-9c2075a7ca11', alt: 'Eagle hunters' },
  { id: '1758016860798-0b96354664b9', alt: 'Yurt camp' },
  { id: '1760630149964-200517d8d437', alt: 'Pasture' },
  { id: '1506905925346-21bda4d32df4', alt: 'Mountains' },
  { id: '1689788648053-cd482d1acd9c', alt: 'Issyk-Kul' },
  { id: '1464822759023-fed622ff2c3b', alt: 'Trail' },
  { id: '1551632811-561732d1e306', alt: 'Guests' },
];

/**
 * Отзывы. Сейчас — временные тексты отзывов сайта (ключи reviews.reviewN).
 * Для видеоотзыва добавьте поле video (YouTube embed или mp4) — появится кнопка Play.
 */
export const showReviews: { key: string; avatar: string; photo: string; rating: number; video?: string }[] = [
  { key: 'reviews.review1', avatar: '1494790108377-be9c29b29330', photo: '1761873177867-499c27dc4cd7', rating: 5 },
  { key: 'reviews.review2', avatar: '1507003211169-0a1dd7228f2d', photo: '1761872936161-9c2075a7ca11', rating: 5 },
  { key: 'reviews.review3', avatar: '1438761681033-6461ffad8d80', photo: '1758016860798-0b96354664b9', rating: 5 },
  { key: 'reviews.review4', avatar: '1472099645785-5658abf4ff4e', photo: '1760630149964-200517d8d437', rating: 5 },
  { key: 'reviews.review5', avatar: '1500648767791-00dcc994a43e', photo: '1689788648053-cd482d1acd9c', rating: 5 },
];
