// Контакты, соцсети и видео редактируются в админке (/admin → «Настройки»)
// и хранятся в src/content/site.json.
import site from '../content/site.json';

export const contacts = site.contacts;

// Web3Forms: публичный ключ формы (он всё равно виден в HTML). Можно переопределить PUBLIC_WEB3FORMS_KEY.
export const web3forms = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || 'dad1bfa4-4f13-490a-a5ee-119e176d6b78',
};

// Supabase: заявки со всех форм сохраняются в таблицу leads (вдобавок к письму через Web3Forms).
// Публичный ключ — сайт может только добавлять заявки, читать их нельзя (RLS).
export const supabase = {
  url: import.meta.env.PUBLIC_SUPABASE_URL || 'https://yqamuqihlrccpbcgzqsc.supabase.co',
  key: import.meta.env.PUBLIC_SUPABASE_KEY || 'sb_publishable_55O5Jzs9UtFttpZMWRrCWg_jHn_uj0i',
};

// Видео (ссылка для встраивания YouTube, напр. https://www.youtube.com/embed/XXXX, или файл /video/x.mp4).
// Пустое значение — блок с видео не показывается.
export const videos: { home: string; tours: Partial<Record<string, string>>; gallery: string[] } = {
  home: site.videos.home,
  tours: Object.fromEntries(Object.entries(site.videos.tours).filter(([, v]) => v)),
  gallery: site.videos.gallery.filter(Boolean),
};

export const officeMapQuery = 'Bishkek+Kyrgyzstan';
