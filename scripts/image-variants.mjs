// Уменьшенные копии фото из public/uploads для srcset: телефон берёт 480–1440 px в WebP,
// оригинал (обычно 1920 px) остаётся только для больших экранов. Запускается перед dev и build.
// Копии лежат в public/uploads/_w/ (в git не попадают), список — в src/data/image-variants.json,
// его читает src/lib/img.ts. Уже готовые копии не пересчитываются.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const uploads = path.join(root, 'public/uploads');
const outDir = path.join(uploads, '_w');
const manifestFile = path.join(root, 'src/data/image-variants.json');
const WIDTHS = [480, 960, 1440];

const manifest = {};
let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  // Без sharp сайт работает на оригиналах, просто тяжелее на телефонах.
  console.warn('image variants: sharp не найден, уменьшенные фото не созданы');
}

if (sharp) {
  fs.mkdirSync(outDir, { recursive: true });
  const files = fs.readdirSync(uploads).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  let made = 0;
  const queue = [...files];
  await Promise.all(
    Array.from({ length: 4 }, async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        const src = path.join(uploads, file);
        const { width } = await sharp(src).metadata();
        const base = file.replace(/\.[^.]+$/, '');
        const sizes = WIDTHS.filter((w) => w < width);
        for (const w of sizes) {
          const out = path.join(outDir, `${base}-${w}.webp`);
          if (fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs) continue;
          await sharp(src).rotate().resize(w).webp({ quality: 72 }).toFile(out);
          made++;
        }
        manifest[`/uploads/${file}`] = { w: width, sizes };
      }
    }),
  );
  console.log(`image variants: ${files.length} фото, новых копий: ${made}`);
}

const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
fs.writeFileSync(manifestFile, JSON.stringify(sorted, null, 1) + '\n');
