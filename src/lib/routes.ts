import type { TourSlug } from '../data/tours';
import { blogArticleSlug } from '../data/content';

export const routes = {
  home: '/',
  about: '/about/',
  tours: '/tours/',
  tour: (slug: TourSlug) => `/tours/${slug}/`,
  mice: '/mice/',
  blog: '/blog/',
  article: `/blog/${blogArticleSlug}/`,
  reviews: '/reviews/',
  gallery: '/gallery/',
  faq: '/faq/',
  contact: '/contact/',
};

export const navItems = [
  { key: 'tours', href: routes.tours, label: 'nav.tours' },
  { key: 'about', href: routes.about, label: 'nav.about' },
  { key: 'mice', href: routes.mice, label: 'nav.mice' },
  { key: 'reviews', href: routes.reviews, label: 'nav.reviews' },
  { key: 'gallery', href: routes.gallery, label: 'nav.gallery' },
  { key: 'blog', href: routes.blog, label: 'nav.blog' },
  { key: 'faq', href: routes.faq, label: 'nav.faq' },
  { key: 'contact', href: routes.contact, label: 'nav.contact' },
] as const;
