import type { TourSlug } from '../data/tours';
import { blogArticleSlug } from '../data/content';

export const routes = {
  home: '/',
  about: '/about/',
  tours: '/tours/',
  tour: (slug: TourSlug) => `/tours/${slug}/`,
  show: '/show/',
  mice: '/mice/',
  blog: '/blog/',
  article: `/blog/${blogArticleSlug}/`,
  reviews: '/reviews/',
  gallery: '/gallery/',
  faq: '/faq/',
  contact: '/contact/',
};

// Порядок по ТЗ: Главная → О нас → Туры → I AM NOMAD SHOW → Блог → Отзывы → Галерея → FAQ → Контакты.
// MICE в ТЗ не упомянут — оставлен сразу после шоу, чтобы страница не потерялась.
export const navItems = [
  { key: 'about', href: routes.about, label: 'nav.about' },
  { key: 'tours', href: routes.tours, label: 'nav.tours' },
  { key: 'show', href: routes.show, label: 'nav.show' },
  { key: 'mice', href: routes.mice, label: 'nav.mice' },
  { key: 'blog', href: routes.blog, label: 'nav.blog' },
  { key: 'reviews', href: routes.reviews, label: 'nav.reviews' },
  { key: 'gallery', href: routes.gallery, label: 'nav.gallery' },
  { key: 'faq', href: routes.faq, label: 'nav.faq' },
  { key: 'contact', href: routes.contact, label: 'nav.contact' },
] as const;
