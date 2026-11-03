// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { loadEnv } from 'vite';

// Переменные из .env и окружения Vercel (process.env сам .env не читает).
const env = loadEnv(process.env.NODE_ENV ?? 'production', process.cwd(), '');

// Абсолютный адрес сайта нужен для canonical, hreflang, sitemap и og:image.
// Можно переопределить переменной SITE_URL (например, для тестового домена).
const site = process.env.SITE_URL || 'https://www.iamnomadkg.com';

export default defineConfig({
  site,
  // Карта сайта с парами ru/en (hreflang) для каждой страницы; 404 в неё не попадает,
  // «Отзывы» — тоже, пока не включён вход через Google (до этого страница закрыта от индексации).
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
      filter: (page) => !page.includes('/404') && (Boolean(env.PUBLIC_GOOGLE_CLIENT_ID) || !page.includes('/reviews/')),
    }),
  ],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Стили родителя применяются к class, переданному в дочерний компонент (орнаменты, иконки).
  scopedStyleStrategy: 'class',
});
