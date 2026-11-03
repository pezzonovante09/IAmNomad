import { googleClientId } from '../data/site';
import type { TourSlug } from '../data/tours';

export const routes = {
  home: '/',
  about: '/about/',
  tours: '/tours/',
  tour: (slug: TourSlug) => `/tours/${slug}/`,
  show: '/show/',
  mice: '/mice/',
  reviews: '/reviews/',
  gallery: '/gallery/',
  faq: '/faq/',
  contact: '/contact/',
  privacy: '/privacy/',
};

// Порядок по ТЗ: Главная → О нас → Туры → I AM NOMAD SHOW → Отзывы → Галерея → FAQ → Контакты.
// MICE в ТЗ не упомянут — оставлен сразу после шоу, чтобы страница не потерялась.
// «Отзывы» в меню — только когда включён вход через Google (PUBLIC_GOOGLE_CLIENT_ID): без него на странице одна заглушка.
export const navItems = [
  { key: 'about', href: routes.about, label: 'nav.about' },
  { key: 'tours', href: routes.tours, label: 'nav.tours' },
  { key: 'show', href: routes.show, label: 'nav.show' },
  { key: 'mice', href: routes.mice, label: 'nav.mice' },
  ...(googleClientId ? ([{ key: 'reviews', href: routes.reviews, label: 'nav.reviews' }] as const) : []),
  { key: 'gallery', href: routes.gallery, label: 'nav.gallery' },
  { key: 'faq', href: routes.faq, label: 'nav.faq' },
  { key: 'contact', href: routes.contact, label: 'nav.contact' },
] as const;
