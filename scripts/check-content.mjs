// Проверка контента перед сборкой. Админка пишет прямо в main, поэтому ошибка в настройках иначе
// сразу попала бы на сайт служебным текстом вида tour.classic.program.day8.text.
// Если что-то не сходится, сборка останавливается, а на сайте остаётся прошлая рабочая версия.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

// Если ключа нет на английском, сайт берёт русский текст, поэтому важен именно русский словарь.
const texts = {};
const textsDir = 'src/content/texts';
for (const file of fs.readdirSync(path.join(root, textsDir))) {
  Object.assign(texts, read(`${textsDir}/${file}`).ru);
}

const errors = [];
const need = (key, where) => {
  if (!(key in texts)) errors.push(`${where}: нет текста ${key}`);
};

const { tours } = read('src/content/tours.json');
for (const tour of tours.filter((t) => !t.hidden)) {
  const where = `Тур ${tour.slug}`;
  need(`${tour.card.replaceAll('.', '__')}__title`, where);

  // Страница есть у всех туров, кроме «Скоро» без программы; у custom она своя.
  const hasPage = tour.status !== 'soon' || tour.days > 0;
  if (!hasPage || tour.slug === 'custom') continue;

  const prefix = `tour__${tour.slug}__`;
  need(`${prefix}title`, where);
  need(`${prefix}subtitle`, where);
  for (let n = 1; n <= tour.days; n++) {
    need(`${prefix}program__day${n}__title`, where);
    need(`${prefix}program__day${n}__text`, where);
  }
  for (let n = 1; n <= tour.highlights; n++) need(`${prefix}highlights__item${n}`, where);
  for (let n = 1; n <= tour.extras; n++) need(`${prefix}extras__item${n}`, where);
  for (let n = 1; n <= tour.dates; n++) need(`${prefix}dates__date${n}`, where);
}

const { contacts } = read('src/content/site.json');
if (!/^https:\/\/wa\.me\/\d+$/.test(contacts.whatsapp)) errors.push('Контакты: WhatsApp должен выглядеть так: https://wa.me/996XXXXXXXXX');
if (!/^tel:\+\d+$/.test(contacts.phoneHref)) errors.push('Контакты: телефон для звонка должен выглядеть так: tel:+996XXXXXXXXX');
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contacts.email)) errors.push('Контакты: проверьте адрес почты');

if (errors.length) {
  console.error('\nПроверка контента не прошла, сайт остаётся на прошлой версии. Исправьте в админке:');
  for (const error of errors) console.error(`  • ${error}`);
  console.error('');
  process.exit(1);
}
console.log(`content check: ${tours.length} туров, всё сходится`);
