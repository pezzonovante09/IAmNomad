// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Абсолютный адрес сайта нужен для canonical, hreflang, sitemap и og:image.
// Можно переопределить переменной SITE_URL (например, для тестового домена).
const site = process.env.SITE_URL || 'https://iamnomadkg.com';

export default defineConfig({
  site,
  // Карта сайта с парами ru/en (hreflang) для каждой страницы; 404 в неё не попадает.
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'ru', locales: { ru: 'ru-RU', en: 'en-US' } },
      filter: (page) => !page.includes('/404'),
    }),
  ],
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  // Стили родителя применяются к class, переданному в дочерний компонент (орнаменты, иконки).
  scopedStyleStrategy: 'class',
});
