// Генерирует public/admin/config.yml — настройки админки (Sveltia CMS).
// Поля «Текстов» строятся автоматически из src/content/texts/*.json, поэтому
// новый ключ в JSON сразу появляется в админке. Запускается перед dev и build.
// YAML — надмножество JSON, поэтому пишем JSON.
// Заодно копирует сам редактор из node_modules/@sveltia/cms в public/admin,
// чтобы админка не зависела от внешнего CDN.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const textsDir = path.join(root, 'src/content/texts');

// Порядок и названия разделов «Текстов» в админке.
const sections = {
  common: 'Общее: меню, кнопки, подвал, формы',
  seo: 'SEO: заголовки и описания страниц',
  home: 'Главная',
  about: 'О нас',
  tours: 'Туры: общие тексты и карточки',
  'tour-classic': 'Тур: Классический',
  'tour-adventure': 'Тур: Приключения',
  'tour-winter': 'Тур: Зимний (White Peaks)',
  'tour-custom': 'Тур: Индивидуальный',
  studio: 'Конструктор (Studio)',
  show: 'I AM NOMAD SHOW',
  mice: 'MICE / корпоративным',
  blog: 'Блог',
  reviews: 'Отзывы',
  gallery: 'Галерея',
  faq: 'FAQ',
  contact: 'Контакты',
};

const textFiles = fs
  .readdirSync(textsDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace(/\.json$/, ''))
  .sort((a, b) => (Object.keys(sections).indexOf(a) + 1 || 99) - (Object.keys(sections).indexOf(b) + 1 || 99));

const textCollection = {
  name: 'texts',
  label: 'Тексты',
  label_singular: 'Раздел',
  description: 'Все тексты сайта по разделам — русский и английский рядом. «•» в начале строки — пункт списка.',
  i18n: true,
  files: textFiles.map((name) => {
    const data = JSON.parse(fs.readFileSync(path.join(textsDir, `${name}.json`), 'utf8'));
    return {
      name,
      label: sections[name] ?? name,
      file: `src/content/texts/${name}.json`,
      i18n: true,
      fields: Object.keys(data.ru).map((key) => {
        const long = [data.ru[key], data.en?.[key]].some((v) => v && (v.length > 70 || v.includes('\n')));
        return { name: key, label: key.split('__').join(' › '), widget: long ? 'text' : 'string', required: false, i18n: true };
      }),
    };
  }),
};

// Общие куски полей
const photo = (name, label, hint) => ({
  name,
  label,
  widget: 'object',
  collapsed: true,
  summary: '{{alt}}',
  fields: [
    { name: 'id', label: 'Фото', widget: 'image', choose_url: true, hint: hint ?? 'Загрузите файл или вставьте ссылку. Старые фото — это ID с Unsplash, их можно оставить.' },
    { name: 'alt', label: 'Описание фото (для поиска и незрячих)', widget: 'string', required: false },
  ],
});
const photoList = (name, label, extra = {}) => ({
  name,
  label,
  widget: 'list',
  collapsed: true,
  summary: '{{fields.alt}}',
  fields: photo('_', '_').fields,
  ...extra,
});
const imageList = (name, label, extra = {}) => ({
  name,
  label,
  widget: 'list',
  field: { name: 'id', label: 'Фото', widget: 'image', choose_url: true },
  ...extra,
});
const both = (name, label, widget = 'string') => ({
  name,
  label,
  widget: 'object',
  fields: [
    { name: 'ru', label: 'RU', widget },
    { name: 'en', label: 'EN', widget },
  ],
});
const fixed = { allow_add: false, allow_remove: false, allow_reorder: false };
const video = (name, label) => ({
  name,
  label,
  widget: 'string',
  required: false,
  hint: 'YouTube: https://www.youtube.com/embed/ID или файл /video/имя.mp4. Пусто — блок не показывается.',
});

const settings = {
  name: 'settings',
  label: 'Настройки',
  description: 'Контакты, соцсети, видео, фото, туры, SHOW и конструктор.',
  files: [
    {
      name: 'site',
      label: 'Контакты и видео',
      file: 'src/content/site.json',
      fields: [
        {
          name: 'contacts',
          label: 'Контакты и соцсети',
          widget: 'object',
          fields: [
            { name: 'phone', label: 'Телефон (как показывать)', widget: 'string' },
            { name: 'phoneHref', label: 'Телефон для звонка (tel:+996…)', widget: 'string' },
            { name: 'whatsapp', label: 'WhatsApp (https://wa.me/996…)', widget: 'string' },
            { name: 'telegram', label: 'Telegram (ссылка)', widget: 'string' },
            { name: 'telegramHandle', label: 'Telegram (@ник)', widget: 'string' },
            { name: 'email', label: 'Почта', widget: 'string' },
            { name: 'instagram', label: 'Instagram (ссылка)', widget: 'string' },
            { name: 'instagramHandle', label: 'Instagram (@ник)', widget: 'string' },
            { name: 'facebook', label: 'Facebook (ссылка)', widget: 'string' },
            { name: 'youtube', label: 'YouTube (ссылка на канал)', widget: 'string' },
          ],
        },
        {
          name: 'videos',
          label: 'Видео',
          widget: 'object',
          fields: [
            video('home', 'Видео на главной'),
            {
              name: 'tours',
              label: 'Видео на страницах туров',
              widget: 'object',
              fields: [
                video('classic', 'Классический'),
                video('adventure', 'Приключения'),
                video('winter', 'Зимний'),
                video('custom', 'Индивидуальный'),
              ],
            },
            { name: 'gallery', label: 'Видео в галерее', widget: 'list', field: video('url', 'Видео') },
          ],
        },
      ],
    },
    {
      name: 'photos',
      label: 'Фото',
      file: 'src/content/photos.json',
      fields: [
        {
          name: 'homeHero',
          label: 'Первый экран главной',
          widget: 'object',
          fields: [
            { name: 'id', label: 'Фото', widget: 'image', choose_url: true },
            { name: 'height', label: 'Высота места над морем, м (подпись справа сверху)', widget: 'number', value_type: 'int' },
          ],
        },
        photo('heroPhoto', 'Фото для страниц без своего фото'),
        photo('aboutPhoto', 'О нас'),
        photo('micePhoto', 'MICE'),
        imageList('reviewAvatars', 'Аватары отзывов (по порядку отзывов)'),
        photoList('blogPosts', 'Обложки постов блога (по порядку постов)'),
        photoList('galleryPhotos', 'Галерея'),
        photoList('instagramPhotos', 'Блок Instagram на главной'),
      ],
    },
    {
      name: 'tours',
      label: 'Туры: фото, дни, статус',
      file: 'src/content/tours.json',
      fields: [
        {
          name: 'tours',
          label: 'Туры',
          label_singular: 'Тур',
          widget: 'list',
          ...fixed,
          summary: '{{fields.slug}} · {{fields.status}}',
          hint: 'Тексты туров — в «Тексты → Тур: …». Число пунктов ниже = сколько пунктов из текстов показывать.',
          fields: [
            { name: 'slug', label: 'Код тура (не менять)', widget: 'string' },
            { name: 'card', label: 'Ключ карточки в текстах (не менять)', widget: 'string' },
            {
              name: 'category',
              label: 'Категория',
              widget: 'select',
              options: [
                { label: 'Классика', value: 'classic' },
                { label: 'Приключения', value: 'adventure' },
                { label: 'Зима', value: 'winter' },
                { label: 'Индивидуальный', value: 'individual' },
              ],
            },
            {
              name: 'status',
              label: 'Статус',
              widget: 'select',
              options: [
                { label: 'Открыт для записи', value: 'open' },
                { label: 'Скоро', value: 'soon' },
                { label: 'По запросу', value: 'request' },
              ],
            },
            photo('cover', 'Обложка'),
            photoList('gallery', 'Галерея тура'),
            { name: 'mapQuery', label: 'Место на карте (Google Maps, через +)', widget: 'string', required: false },
            { name: 'days', label: 'Дней (программа по дням)', widget: 'number', value_type: 'int' },
            { name: 'highlights', label: 'Пунктов «Что включено»', widget: 'number', value_type: 'int' },
            { name: 'extras', label: 'Дополнительных опций', widget: 'number', value_type: 'int' },
            { name: 'dates', label: 'Дат заездов', widget: 'number', value_type: 'int' },
          ],
        },
      ],
    },
    {
      name: 'show',
      label: 'I AM NOMAD SHOW: фото, видео, цифры',
      file: 'src/content/show.json',
      fields: [
        {
          name: 'videos',
          label: 'Видео',
          widget: 'object',
          fields: [
            video('hero', 'Фоновое видео первого экрана (mp4 без звука, 10–30 с)'),
            video('main', 'Основное видео («Смотреть видео»)'),
          ],
        },
        {
          name: 'posters',
          label: 'Постеры (пока видео нет)',
          widget: 'object',
          fields: [photo('hero', 'Первый экран'), photo('video', 'Блок видео')],
        },
        photoList('moments', 'Фото блоков «Что вас ждёт» (5 шт., по порядку)', fixed),
        {
          name: 'timeline',
          label: 'Время в программе дня (по порядку)',
          widget: 'list',
          ...fixed,
          field: { name: 'time', label: 'Время', widget: 'string' },
        },
        {
          name: 'stats',
          label: 'Цифры шоу',
          widget: 'list',
          ...fixed,
          summary: '{{fields.key}}: {{fields.value}}{{fields.suffix}}',
          fields: [
            { name: 'key', label: 'Что считаем (не менять)', widget: 'string' },
            { name: 'value', label: 'Число', widget: 'number', value_type: 'int' },
            { name: 'suffix', label: 'Знак после числа (+)', widget: 'string', required: false },
          ],
        },
        {
          name: 'gallery',
          label: 'Галерея',
          widget: 'list',
          summary: '{{fields.alt}}',
          fields: [...photo('_', '_').fields, video('video', 'Видео (если это видео)')],
        },
        {
          name: 'reviews',
          label: 'Отзывы',
          widget: 'list',
          summary: '{{fields.key}}',
          fields: [
            { name: 'key', label: 'Текст отзыва (ключ из «Тексты → Отзывы», напр. reviews.review1)', widget: 'string' },
            { name: 'avatar', label: 'Аватар', widget: 'image', choose_url: true },
            { name: 'photo', label: 'Фото', widget: 'image', choose_url: true },
            { name: 'rating', label: 'Оценка', widget: 'number', value_type: 'int', min: 1, max: 5 },
            video('video', 'Видеоотзыв'),
          ],
        },
      ],
    },
    {
      name: 'studio',
      label: 'Конструктор: регионы, цены, моменты',
      file: 'src/content/studio.json',
      fields: [
        { name: 'showPrice', label: 'Показывать расчёт стоимости', widget: 'boolean', hint: 'Включите, когда проставите реальные цены ниже.' },
        { name: 'transferPerRegion', label: 'Надбавка за каждый доп. регион, $ за гостя', widget: 'number', value_type: 'int' },
        {
          name: 'regions',
          label: 'Регионы',
          label_singular: 'Регион',
          widget: 'list',
          summary: '{{fields.name.ru}}',
          fields: [
            { name: 'key', label: 'Код (латиницей, без пробелов)', widget: 'string' },
            both('name', 'Название'),
            { name: 'alt', label: 'Высота, м', widget: 'number', value_type: 'int' },
            { name: 'photo', label: 'Фото', widget: 'image', choose_url: true },
          ],
        },
        {
          name: 'days',
          label: 'Ползунок «Длительность»',
          widget: 'object',
          fields: [
            { name: 'min', label: 'Минимум дней', widget: 'number', value_type: 'int' },
            { name: 'max', label: 'Максимум дней', widget: 'number', value_type: 'int' },
            { name: 'ticks', label: 'Метки под шкалой', widget: 'list', field: { name: 'n', label: 'Метка', widget: 'number', value_type: 'int' } },
          ],
        },
        {
          name: 'guests',
          label: 'Ползунок «Гости»',
          widget: 'object',
          fields: [
            { name: 'min', label: 'Минимум гостей', widget: 'number', value_type: 'int' },
            { name: 'max', label: 'Максимум гостей', widget: 'number', value_type: 'int' },
            { name: 'ticks', label: 'Метки под шкалой', widget: 'list', field: { name: 'n', label: 'Метка', widget: 'number', value_type: 'int' } },
          ],
        },
        {
          name: 'comfort',
          label: 'Уровни комфорта',
          label_singular: 'Уровень',
          widget: 'list',
          summary: '{{fields.name.ru}} — ${{fields.rate}}',
          fields: [
            both('name', 'Название'),
            both('desc', 'Описание', 'text'),
            { name: 'rate', label: 'Цена, $ за гостя в день', widget: 'number', value_type: 'int' },
            { name: 'vip', label: 'VIP-уровень (золотая отметка)', widget: 'boolean', required: false },
          ],
        },
        {
          name: 'moments',
          label: 'Моменты (золотые точки на фото)',
          label_singular: 'Момент',
          widget: 'list',
          summary: '{{fields.title.ru}} — ${{fields.price}}',
          fields: [
            both('title', 'Название'),
            both('desc', 'Описание', 'text'),
            { name: 'price', label: 'Цена, $', widget: 'number', value_type: 'int' },
            { name: 'perGuest', label: 'Цена за каждого гостя', widget: 'boolean', required: false },
            { name: 'x', label: 'Позиция по горизонтали, %', widget: 'number', value_type: 'int', min: 0, max: 100 },
            { name: 'y', label: 'Позиция по вертикали, %', widget: 'number', value_type: 'int', min: 0, max: 100 },
          ],
        },
        {
          name: 'defaults',
          label: 'Что выбрано при открытии',
          widget: 'object',
          collapsed: true,
          fields: [
            { name: 'route', label: 'Регионы (номера с 0)', widget: 'list', field: { name: 'n', label: 'Номер', widget: 'number', value_type: 'int' } },
            { name: 'days', label: 'Дней', widget: 'number', value_type: 'int' },
            { name: 'guests', label: 'Гостей', widget: 'number', value_type: 'int' },
            { name: 'comfort', label: 'Уровень комфорта (номер с 0)', widget: 'number', value_type: 'int' },
          ],
        },
      ],
    },
  ],
};

const config = {
  backend: { name: 'github', repo: 'pezzonovante09/IAmNomad', branch: 'main' },
  site_url: 'https://www.iamnomadkg.com',
  display_url: 'https://www.iamnomadkg.com',
  logo_url: '/favicon.svg',
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  editor: { preview: false },
  i18n: { structure: 'single_file', locales: ['ru', 'en'], default_locale: 'ru' },
  collections: [textCollection, settings],
};

fs.writeFileSync(path.join(root, 'public/admin/config.yml'), '# Сгенерировано scripts/cms-config.mjs — не редактируйте вручную.\n' + JSON.stringify(config, null, 2) + '\n');
console.log(`admin config: ${textFiles.length} разделов текстов, ${textCollection.files.reduce((n, f) => n + f.fields.length, 0)} полей`);

// Редактор кладём рядом с config.yml (без .map — они большие и не нужны).
const cms = path.join(root, 'node_modules/@sveltia/cms/dist');
fs.copyFileSync(path.join(cms, 'sveltia-cms.js'), path.join(root, 'public/admin/sveltia-cms.js'));
fs.mkdirSync(path.join(root, 'public/admin/chunks'), { recursive: true });
for (const f of fs.readdirSync(path.join(cms, 'chunks')).filter((f) => !f.endsWith('.map'))) {
  fs.copyFileSync(path.join(cms, 'chunks', f), path.join(root, 'public/admin/chunks', f));
}
