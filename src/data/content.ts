// Фото сайта редактируются в админке (/admin → «Фото») и хранятся в src/content/photos.json.
// Фото — это ID с Unsplash, ссылка или путь к загруженному файлу (/uploads/…).
import type { Photo } from '../lib/img';
import photos from '../content/photos.json';

/** Первый экран главной: фото и высота места над уровнем моря (подпись — region.sonkul.*). */
export const homeHero: { id: string; height: number } = photos.homeHero;

export const galleryPhotos: Photo[] = photos.galleryPhotos;
export const instagramPhotos: Photo[] = photos.instagramPhotos;

export const heroPhoto: Photo = photos.heroPhoto;
export const aboutPhoto: Photo = photos.aboutPhoto;
export const micePhoto: Photo = photos.micePhoto;
