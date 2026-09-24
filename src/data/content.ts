import type { Photo } from '../lib/img';

// Аватары отзывов по порядку (reviews.review1 … review9; на главной — первые три).
export const reviewAvatars = [
  '1494790108377-be9c29b29330',
  '1507003211169-0a1dd7228f2d',
  '1438761681033-6461ffad8d80',
  '1472099645785-5658abf4ff4e',
  '1500648767791-00dcc994a43e',
  '1534528741775-53994a69daeb',
  '1517841905240-472988babdf9',
  '1506794778202-cad84cf45f1d',
  '1524504388940-b1c1722653e1',
];

// Посты блога (тексты — blog.postN.*). Пока есть одна полная статья.
export const blogArticleSlug = 'top-10-places';
export const blogPosts: Photo[] = [
  { id: '1689788648053-cd482d1acd9c', alt: 'Top places in Kyrgyzstan' },
  { id: '1519834785169-98be25ec3f84', alt: 'Best season to visit Kyrgyzstan' },
  { id: '1761873177867-499c27dc4cd7', alt: 'Horse trekking in Kyrgyzstan' },
  { id: '1464822759023-fed622ff2c3b', alt: 'Travel planning Kyrgyzstan' },
  { id: '1761872936161-9c2075a7ca11', alt: 'Silk Road heritage in Kyrgyzstan' },
  { id: '1758016860798-0b96354664b9', alt: 'Nomad culture in Kyrgyzstan' },
];

export const galleryPhotos: Photo[] = [
  { id: '1689788648053-cd482d1acd9c', alt: 'Issyk-Kul lake' },
  { id: '1758016860798-0b96354664b9', alt: 'Yurts at Tash Rabat' },
  { id: '1761873177867-499c27dc4cd7', alt: 'Horse trekking' },
  { id: '1760630149964-200517d8d437', alt: 'Song-Kul pasture' },
  { id: '1761872936161-9c2075a7ca11', alt: 'Eagle hunting' },
  { id: '1506905925346-21bda4d32df4', alt: 'Mountain peaks' },
  { id: '1464822759023-fed622ff2c3b', alt: 'Alpine trekking' },
  { id: '1519834785169-98be25ec3f84', alt: 'Winter mountains' },
  { id: '1551632811-561732d1e306', alt: 'Group hiking' },
  { id: '1551524559-8af4e6624178', alt: 'Ski slopes' },
  { id: '1483664852095-d6cc467e59a0', alt: 'Snowy landscape' },
  { id: '1418985991508-e47343d2c7a4', alt: 'Winter mountain cabin' },
];

export const instagramPhotos: Photo[] = [
  { id: '1689788648053-cd482d1acd9c', alt: 'Issyk-Kul lake' },
  { id: '1758016860798-0b96354664b9', alt: 'Yurts in Kyrgyzstan' },
  { id: '1761873177867-499c27dc4cd7', alt: 'Horse trekking in mountains' },
  { id: '1760630149964-200517d8d437', alt: 'Song-Kul pasture landscape' },
  { id: '1761872936161-9c2075a7ca11', alt: 'Eagle hunting tradition' },
  { id: '1506905925346-21bda4d32df4', alt: 'Mountain peaks above clouds' },
];

export const heroPhoto: Photo = { id: '1689788648053-cd482d1acd9c', alt: 'Issyk-Kul lake and mountains, Kyrgyzstan' };
export const aboutPhoto: Photo = { id: '1506905925346-21bda4d32df4', alt: 'Kyrgyzstan mountain landscape' };
export const micePhoto: Photo = { id: '1528605248644-14dd04022da1', alt: 'Corporate meeting in mountain resort' };

// Регионы для слайдшоу на главной (названия и описания — region.<key>.*).
export const heroRegions = [
  { key: 'sonkul', alt: 3016, coords: '41.83°N 75.13°E', photo: '1760630149964-200517d8d437' },
  { key: 'issykkul', alt: 1607, coords: '42.43°N 77.25°E', photo: '1689788648053-cd482d1acd9c' },
  { key: 'karakol', alt: 3040, coords: '42.49°N 78.39°E', photo: '1519834785169-98be25ec3f84' },
];
