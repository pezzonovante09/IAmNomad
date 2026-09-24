// Контакты, соцсети и внешние сервисы — всё в одном месте.

export const contacts = {
  phone: '+996 706 001 517',
  phoneHref: 'tel:+996706001517',
  whatsapp: 'https://wa.me/996706001517',
  telegram: 'https://t.me/iamnomad_kg',
  telegramHandle: '@iamnomad_kg',
  email: 'Iamnomadkgz@gmail.com',
  instagram: 'https://www.instagram.com/iamnomad_kg/',
  instagramHandle: '@iamnomad_kg',
  facebook: 'https://www.facebook.com/iamnomadkg/',
  youtube: 'https://www.youtube.com/@iamnomad_kg',
};

// Web3Forms: публичный ключ формы (он всё равно виден в HTML). Можно переопределить PUBLIC_WEB3FORMS_KEY.
export const web3forms = {
  endpoint: 'https://api.web3forms.com/submit',
  accessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY || 'dad1bfa4-4f13-490a-a5ee-119e176d6b78',
};

// Видео (ссылка для встраивания YouTube, напр. https://www.youtube.com/embed/XXXX).
// Пока пусто — блоки с видео не показываются.
export const videos = {
  home: '',
  tours: {} as Partial<Record<string, string>>,
  gallery: [] as string[],
};

export const officeMapQuery = 'Bishkek+Kyrgyzstan';
