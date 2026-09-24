# I AM NOMAD — сайт

Статический сайт на [Astro](https://astro.build). Русский — основной язык (`/`), английский — `/en/`.

## Запуск

```bash
npm install
npm run dev      # локально: http://localhost:4321
npm run build    # сборка в dist/
npm run check    # проверка типов
```

Нужен Node.js 22.12+.

## Настройка

Переменные окружения (см. `.env.example`), задаются в настройках Vercel/Netlify:

- `PUBLIC_WEB3FORMS_KEY` — ключ [Web3Forms](https://web3forms.com/), заявки со всех форм приходят на почту;
- `SITE_URL` — адрес сайта (для canonical, hreflang и превью в соцсетях).

## Где что лежит

| Что поменять | Файл |
| --- | --- |
| Тексты (RU/EN) | `src/i18n/translations.ts`, новые строки интерфейса — `src/i18n/ui.ts` |
| Туры: фото, число дней, статус | `src/data/tours.ts` |
| Контакты, соцсети, видео | `src/data/site.ts` |
| Отзывы, блог, галерея, регионы на главной | `src/data/content.ts` |
| Цвета, шрифты, кнопки | `src/styles/global.css` |
| Страницы | `src/views/*.astro` (маршруты — `src/pages/[...path].astro`) |

Старые адреса (`tour-classic.html` и т.п.) перенаправляются на новые: `vercel.json` и `public/_redirects`.
