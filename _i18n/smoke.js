// Проверка украинского зеркала svoiludi.ch: node _i18n/smoke.js
// Открывает каждую страницу на RU и UA (ширина 390 px): JS-ошибки, битые ресурсы, горизонтальная прокрутка,
// на UA — русские буквы ы/э/ъ/ё в тексте и ссылки на свои страницы, ведущие на русскую версию.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const ROOT = path.resolve(__dirname, '..'); const PORT = 8898; const BASE = `http://localhost:${PORT}`;
const PAGES = ['/', '/events/', '/kursy/', '/join/', '/opros/', '/badge/', '/instrumenty/', '/instrumenty/zarplata/', '/instrumenty/moj-den/', '/instrumenty/moj-god/', '/instrumenty/moi-emocii/', '/instrumenty/moj-budget/', '/instrumenty/uchet-vremeni/', '/instrumenty/chasy-po-klientam/', '/instrumenty/rezyume/', '/privacy/'];
const OWN = /^\/(events|kursy|join|opros|badge|instrumenty)?\/?/;
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch(); const fails = [];
  for (const lang of ['ru', 'uk']) for (const pg of PAGES) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
    await ctx.addInitScript(l => { try { localStorage.setItem('svoiludiLang', l); } catch (e) {} }, lang);
    const p = await ctx.newPage(); const errs = [];
    p.on('pageerror', e => errs.push('js: ' + e.message));
    p.on('response', r => { if (r.status() >= 400 && r.url().startsWith(BASE)) errs.push('http ' + r.status() + ' ' + r.url().replace(BASE, '')); });
    const url = (lang === 'uk' ? '/uk' : '') + pg;
    await p.goto(BASE + url); await p.waitForTimeout(1500);
    const info = await p.evaluate(() => ({
      path: location.pathname,
      txt: document.body.innerText,
      wide: document.documentElement.scrollWidth > window.innerWidth + 1,
      links: [...document.querySelectorAll('a[href]')].filter(a => !a.closest('#langbar')).map(a => a.href).filter(h => h.startsWith(location.origin)).map(h => new URL(h).pathname)
    }));
    const prob = {};
    if (info.path !== url) prob.redirectedTo = info.path;
    if (errs.length) prob.errs = errs.slice(0, 4);
    if (info.wide) prob.horizontalScroll = true;
    if (lang === 'uk') {
      const ru = [...new Set((info.txt.match(/[^\n]{0,25}[ыэъёЫЭЪЁ][^\n]{0,25}/g) || []))];
      if (ru.length) prob.russianText = ru.slice(0, 6);
      const back = [...new Set(info.links.filter(h => !h.startsWith('/uk/') && !/\.(docx|pdf|jpg|png|xlsx|webmanifest)$/.test(h) && !/^\/(assets|img|fav|files)\//.test(h)))];
      if (back.length) prob.linksToRussian = back.slice(0, 6);
    }
    if (Object.keys(prob).length) fails.push({ page: url, ...prob });
    console.log(Object.keys(prob).length ? 'FAIL' : 'ok  ', url);
    await ctx.close();
  }
  await b.close(); srv.kill();
  console.log(fails.length ? 'PROBLEMS:\n' + JSON.stringify(fails, null, 1) : 'ALL OK');
  process.exit(fails.length ? 1 : 0);
})();
