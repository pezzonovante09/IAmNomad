// @ts-check
import { defineConfig } from 'astro/config';

// Абсолютный адрес сайта нужен для canonical/hreflang/og:image.
// Задайте SITE_URL в настройках хостинга; иначе берём адрес от Vercel/Netlify.
const site =
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL && `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
  process.env.URL ||
  undefined;

export default defineConfig({
  site,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
