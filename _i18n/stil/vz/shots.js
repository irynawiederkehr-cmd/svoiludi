// Снимки элементов voznesenskaya.ch для библиотеки стиля.
// node shots.js <папка сайта (репозиторий tests)> <папка для снимков> [id ...]
// Снимает каждый элемент из ELEMENTS (elements.js) на телефоне и/или компьютере, в светлой и тёмной теме.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const ELEMENTS = require('./elements.js');
const ROOT = path.resolve(process.argv[2]); const OUT = path.resolve(process.argv[3]);
const ONLY = process.argv.slice(4);
const PORT = 8873; const BASE = `http://localhost:${PORT}`;
const VIEW = {
  phone: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1.5, isMobile: true, hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' },
  desk: { viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1.25 }
};
// прячем то, что всплывает поверх (подсказка установки, языки), если элемент не про них
const HIDE = '.pa-card,.pa-back{display:none!important}.langbar{display:none!important}';
// у элементов ниже шапки шапка не должна наезжать на снимок
const STATIC = 'header.top,header.sitebar,.sitebar{position:static!important}';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const srv = spawn('python3', ['-I', '-m', 'http.server', String(PORT), '--directory', ROOT], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1500));
  const b = await chromium.launch();
  const report = [];
  for (const el of ELEMENTS) {
    if (ONLY.length && !ONLY.includes(el.id)) continue;
    for (const w of el.w || ['phone']) {
      for (const theme of el.themes || ['light', 'dark']) {
        const name = `${el.id}-${w}-${theme}.jpg`;
        const ctx = await b.newContext({ ...VIEW[w], colorScheme: theme, locale: 'ru-RU' });
        const p = await ctx.newPage();
        try {
          await p.goto(BASE + el.page, { waitUntil: 'load' });
          await p.waitForTimeout(900);
          if (!el.keep) await p.addStyleTag({ content: HIDE });
          if (!el.viewport && !/header|sitebar/.test(el.sel)) await p.addStyleTag({ content: STATIC });
          await p.addStyleTag({ content: 'html{scroll-behavior:auto!important}*{animation-duration:0s!important;transition-duration:0s!important}' });
          if (el.before) await el.before(p, w);
          await p.waitForTimeout(el.wait || 500);
          const loc = p.locator(el.sel).first();
          await loc.scrollIntoViewIfNeeded();
          await p.waitForTimeout(250);
          const opt = { path: path.join(OUT, name), type: 'jpeg', quality: 76 };
          if (el.viewport) await p.screenshot(opt);
          else {
            const bb = await loc.boundingBox();
            if (!bb) throw new Error('нет на странице');
            const maxH = el.maxH || 1600;
            const pad = el.pad == null ? 0 : el.pad;
            await p.screenshot({ ...opt, fullPage: true, clip: { x: Math.max(0, bb.x - pad), y: Math.max(0, bb.y + (await p.evaluate(() => scrollY)) - pad), width: Math.min(bb.width + pad * 2, VIEW[w].viewport.width), height: Math.min(bb.height + pad * 2, maxH) } });
          }
          report.push(`ok   ${name}`);
        } catch (e) {
          report.push(`FAIL ${name}: ${String(e.message || e).split('\n')[0]}`);
        }
        await ctx.close();
      }
    }
  }
  await b.close(); srv.kill();
  fs.writeFileSync(path.join(OUT, '_report.txt'), report.join('\n') + '\n');
  console.log(report.join('\n'));
})();
