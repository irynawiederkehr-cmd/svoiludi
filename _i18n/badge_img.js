// Картинки значков для кода «Значок для сайта» (badge/, 10.10.2026): badge/img/{org|spec}-{ru|uk}-{light|dark}.png, 560 × 160 (значок 280 × 80 вдвое крупнее).
// Рисует сама страница badge/ (window.SVL_BADGE.mini) — те же шрифты и цвета, что в предпросмотре на странице.
// Запуск из корня репозитория после правки вида или текста значка (и после python3 _i18n/sync.py для UA):
//   NODE_PATH=$(npm root -g) node _i18n/badge_img.js
// Код, который организации и специалисты ставят на свои сайты, ссылается на эти файлы — имена файлов не менять.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..'); const PORT = 8898;
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(f => fs.existsSync(f));
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const out = path.join(ROOT, 'badge/img'); fs.mkdirSync(out, { recursive: true });
  try {
    for (const lang of ['ru', 'uk']) {
      const pg = await (await b.newContext({ viewport: { width: 1000, height: 800 } })).newPage();
      // ?lang=ru — чтобы русская страница не ушла на украинскую по выбору языка
      await pg.goto(`http://localhost:${PORT}${lang === 'uk' ? '/uk' : ''}/badge/?lang=${lang}`, { waitUntil: 'networkidle' });
      await pg.waitForFunction(() => window.SVL_BADGE);
      for (const kind of ['org', 'spec']) for (const theme of ['light', 'dark']) {
        const url = await pg.evaluate(([k, t]) => window.SVL_BADGE.mini(k, t), [kind, theme]);
        const f = path.join(out, `${kind}-${lang}-${theme}.png`);
        fs.writeFileSync(f, Buffer.from(url.split(',')[1], 'base64')); console.log('ok', path.relative(ROOT, f));
      }
    }
  } finally { await b.close(); srv.kill(); }
})();
