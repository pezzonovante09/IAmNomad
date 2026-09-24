import type { Photo } from '../lib/img';
import show from '../content/show.json';

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
// Меняются в админке (/admin → «I AM NOMAD SHOW»): загрузите файл или вставьте ID/ссылку.
// Данные хранятся в src/content/show.json.
// ─────────────────────────────────────────────────────────────

export type ShowMedia = Photo & { video?: string };

/** hero — фоновое видео первого экрана (mp4 без звука); main — основное видео. */
export const showVideos: { hero: string; main: string } = show.videos;
export const showPosters: { hero: Photo; video: Photo } = show.posters;
/** Пять блоков «Что вас ждёт» (тексты — show.what.N.*). */
export const showMoments: Photo[] = show.moments;
export const showTimeline: string[] = show.timeline;
export const showStats: { value: number; suffix?: string; key: string }[] = show.stats;
/** Галерея: фото открываются в полном размере, элементы с video — во всплывающем плеере. */
export const showGallery: ShowMedia[] = show.gallery;
/** Отзывы (тексты — ключи reviews.reviewN). Поле video — видеоотзыв с кнопкой Play. */
export const showReviews: { key: string; avatar: string; photo: string; rating: number; video?: string }[] = show.reviews;
