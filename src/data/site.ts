// Контакты, соцсети и видео редактируются в админке (/admin → «Настройки»)
// и хранятся в src/content/site.json.
import site from '../content/site.json';

export const contacts = site.contacts;

export const company = site.company;
export const reviewsInMenu: boolean = site.reviewsInMenu;

/** Реквизиты компании одной строкой; пусто, пока они не заполнены в админке. */
export function companyDetails(taxLabel: string): string {
  return [company.name, company.taxId && `${taxLabel} ${company.taxId}`, company.address, company.hours].filter(Boolean).join(' · ');
}

/** Ссылка на WhatsApp с готовым первым сообщением: посетителю не приходится придумывать его самому. */
export function whatsappLink(text: string): string {
  const separator = contacts.whatsapp.includes('?') ? '&' : '?';
  return `${contacts.whatsapp}${separator}text=${encodeURIComponent(text)}`;
}

// Web3Forms: публичный ключ формы (он всё равно виден в HTML), привязан к почте компании.
// Задан только здесь: старая переменная PUBLIC_WEB3FORMS_KEY в Vercel не используется.
export const web3forms = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: '710dde02-1feb-4dd8-8240-ac3e7889bb2a',
};

// Supabase: заявки со всех форм сохраняются в таблицу leads (вдобавок к письму через Web3Forms).
// Публичный ключ — сайт может только добавлять заявки, читать их нельзя (RLS).
export const supabase = {
  url: import.meta.env.PUBLIC_SUPABASE_URL || 'https://yqamuqihlrccpbcgzqsc.supabase.co',
  key: import.meta.env.PUBLIC_SUPABASE_KEY || 'sb_publishable_55O5Jzs9UtFttpZMWRrCWg_jHn_uj0i',
};

// Вход через Google для отзывов (Google Identity Services). Это публичный Client ID (OAuth, тип Web),
// проект в Google Cloud на iamnomadkgz@gmail.com. Можно переопределить PUBLIC_GOOGLE_CLIENT_ID.
export const googleClientId: string =
  import.meta.env.PUBLIC_GOOGLE_CLIENT_ID || '891134816179-u3kn4oi8irdqka5l3jo43gellu7ce8dp.apps.googleusercontent.com';

// Видео (ссылка для встраивания YouTube, напр. https://www.youtube.com/embed/XXXX, или файл /video/x.mp4).
// Пустое значение — блок с видео не показывается.
export const videos: { home: string; tours: Partial<Record<string, string>>; gallery: string[] } = {
  home: site.videos.home,
  tours: Object.fromEntries(Object.entries(site.videos.tours).filter(([, v]) => v)),
  gallery: site.videos.gallery.filter(Boolean),
};

export const officeMapQuery = company.address ? encodeURIComponent(company.address) : 'Bishkek+Kyrgyzstan';
