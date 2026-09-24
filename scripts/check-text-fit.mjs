// Проверка, что текст везде помещается: нет горизонтальной прокрутки,
// текст не вылезает за экран/контейнер, длинные слова в крупном тексте не рвутся.
// Использование: npm run build && npm run check:text
//   WIDTHS=320,768 — свои ширины;  EXPAND=0 — не раскрывать меню/FAQ/туры.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';

const DIST = path.resolve('dist');
if (!fs.existsSync(DIST)) { console.error('Нет dist/ — сначала npm run build'); process.exit(2); }

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.woff': 'font/woff', '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  let f = path.join(DIST, p);
  if (!f.startsWith(DIST)) { res.writeHead(403).end(); return; }
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!fs.existsSync(f)) { res.writeHead(404).end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const pages = [];
(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) walk(path.join(dir, e.name));
    else if (e.name === 'index.html') pages.push('/' + path.relative(DIST, dir).split(path.sep).join('/') + (dir === DIST ? '' : '/'));
  }
})(DIST);
pages.sort();
if (fs.existsSync(path.join(DIST, '404.html'))) pages.push('/404.html');

const widths = (process.env.WIDTHS || '320,360,390,414,768,1024,1280,1440,1920').split(',').map(Number);
const modes = process.env.EXPAND === '0' ? [false] : [false, true];
const browser = await chromium.launch(process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const results = [];
for (const expand of modes)
for (const w of widths) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 800, hasTouch: w < 800 });
  // внешние ресурсы (фото, карты, видео) не нужны для проверки текста
  await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, (r) => r.fulfill({ status: 200, contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"/>' }));
  const page = await ctx.newPage();
  for (const p of pages) {
    await page.goto(base + p, { waitUntil: 'load' });
    await page.addStyleTag({ content: '*,*::before,*::after{transition:none!important;animation:none!important}' });
    await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible')); window.__fit?.(); });
    if (expand) { await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); document.querySelectorAll('.ti__row').forEach((r) => r.classList.add('is-open')); document.querySelector('[data-menu-toggle]')?.click(); window.__fit?.(); }); await page.waitForTimeout(100); }
    const issues = await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-visible'));
      // раскрыть скрытые по умолчанию, но видимые пользователю элементы нам не нужно — проверяем как есть
      const vw = document.documentElement.clientWidth;
      const out = [];
      const desc = (el) => {
        let s = el.tagName.toLowerCase();
        if (el.className && typeof el.className === 'string') s += '.' + el.className.split(/\s+/).filter((c) => c && !c.startsWith('astro-')).slice(0, 2).join('.');
        return s;
      };
      const visible = (el) => {
        for (let e = el; e; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (cs.display === 'none' || cs.visibility === 'hidden' || e.hidden) return false;
          if (e.classList?.contains('sr-only')) return false;
        }
        return true;
      };
      const clipAncestor = (el) => {
        for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
          const cs = getComputedStyle(e);
          if (/(auto|scroll)/.test(cs.overflowX)) return { el: e, scroll: true };
          if (/(hidden|clip)/.test(cs.overflowX)) return { el: e, scroll: false };
        }
        return null;
      };
      if (document.documentElement.scrollWidth > vw + 1) out.push({ type: 'page-hscroll', what: `scrollWidth ${document.documentElement.scrollWidth} > ${vw}` });
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set();
      let n;
      while ((n = walker.nextNode())) {
        const text = n.textContent.trim();
        if (!text) continue;
        const el = n.parentElement;
        if (!el || seen.has(el) || !visible(el)) continue;
        if (el.closest('dialog:not([open]), template, script, style, .mn[hidden], [data-menu][hidden]')) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
        if (!rects.length) continue;
        const clip = clipAncestor(el);
        const cr = clip?.el.getBoundingClientRect();
        for (const r of rects) {
          if (clip?.scroll) break; // горизонтальные прокрутки (таймлайн, слайдер) — намеренно
          if (r.right > vw + 1 || r.left < -1) { out.push({ type: 'beyond-viewport', what: desc(el), text: text.slice(0, 40), by: Math.round(Math.max(r.right - vw, -r.left)) }); seen.add(el); break; }
          if (cr && (r.right > cr.right + 1 || r.left < cr.left - 1)) { out.push({ type: 'clipped', what: desc(el), text: text.slice(0, 40), by: Math.round(Math.max(r.right - cr.right, cr.left - r.left)), in: desc(clip.el) }); seen.add(el); break; }
        }
        if (seen.has(el)) continue;
        // разрыв слова внутри заголовков/крупного текста
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs >= 18) {
          const re = /\S+/g; let m;
          while ((m = re.exec(n.textContent))) {
            if (m[0].length < 4) continue;
            const wr = document.createRange();
            try { wr.setStart(n, m.index); wr.setEnd(n, m.index + m[0].length); } catch { break; }
            const lines = new Set([...wr.getClientRects()].filter((r) => r.width > 1).map((r) => Math.round(r.top)));
            if (lines.size > 1 && !m[0].includes('-') && !m[0].includes('—')) { out.push({ type: 'word-broken', what: desc(el), text: m[0], size: fs }); seen.add(el); break; }
          }
        }
      }
      return out;
    });
    for (const i of issues) results.push({ w, page: p, expand, ...i });
  }
  await ctx.close();
}
await browser.close();
server.close();

const key = (r) => `${r.type} | ${r.what} | ${r.text ?? ''}`;
const groups = {};
for (const r of results) (groups[key(r)] ??= []).push(`${r.w}px ${r.page}${r.expand ? ' (раскрыто)' : ''}`);
for (const [k, v] of Object.entries(groups).sort()) console.log('✗', k, '\n   ', v.slice(0, 6).join('  ·  '), v.length > 6 ? `(+${v.length - 6})` : '');
console.log(`\n${pages.length} страниц × ${widths.length} ширин${modes.length > 1 ? ' × 2 режима' : ''}: ${results.length ? `${results.length} проблем` : 'всё помещается ✓'}`);
process.exit(results.length ? 1 : 0);
