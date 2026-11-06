// Фото сайта редактируются в админке (/admin → «Фото») и хранятся в src/content/photos.json.
// Фото — это ID с Unsplash, ссылка или путь к загруженному файлу (/uploads/…).
import type { Photo } from '../lib/img';
import photos from '../content/photos.json';

/** Фото первого экрана главной. */
export const homeHero: { id: string } = photos.homeHero;

export const galleryPhotos: Photo[] = photos.galleryPhotos;
export const instagramPhotos: Photo[] = photos.instagramPhotos;

export const heroPhoto: Photo = photos.heroPhoto;
export const aboutPhoto: Photo = photos.aboutPhoto;
export const micePhoto: Photo = photos.micePhoto;
