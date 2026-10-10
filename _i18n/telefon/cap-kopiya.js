const { chromium } = require('playwright'); const { spawn } = require('child_process');
const PORT = 8888, B = `http://localhost:${PORT}`, OUT = __dirname + '/shots2/';
// voznesenskaya.ch (репозиторий tests рядом с svoiludi или VZ=<путь>) — для снимков обоих сайтов; только нужные снимки: node cap-kopiya.js [начало имени]
const VZ = process.env.VZ || require('path').resolve(__dirname, '../../../tests'), VPORT = 8889, VB = `http://localhost:${VPORT}`, ONLY = process.argv[2] || '';
require('fs').mkdirSync(OUT, { recursive: true });
// name, path, w, h, opts: {dark, app, click, scrollText, later}
const S = [
  ['app-home', '/?app=1', 390, 777, {}], ['app-tools', '/instrumenty/?app=1', 390, 777, {}], ['app-more', '/?app=1', 390, 777, { click: '.pa-more' }],
  ['app-uk', '/uk/events/?app=1', 390, 777, {}], ['app-dark', '/shveycariya/?app=1', 390, 777, { dark: true }],
  ['card-ios', '/?install=ios', 390, 669, {}], ['card-and', '/?install=android', 390, 736, {}], ['card-inapp', '/?install=inapp', 390, 747, {}],
  ['br-home', '/', 390, 669, { later: true }], ['br-se', '/join/', 375, 560, { later: true }], ['br-uk-dark', '/uk/instrumenty/', 390, 736, { later: true, dark: true }],
  ['ipad', '/instrumenty/?app=1', 820, 1160, {}], ['ipad-br', '/', 820, 1100, { later: true }],
  ['b-cards', '/', 390, 669, { later: true, scrollText: 'Подробнее' }], ['b-join', '/join/', 390, 669, { later: true, scrollSel: '#dl' }],
  ['b-tools', '/instrumenty/', 390, 669, { later: true, scrollSel: '.go-free' }], ['b-god', '/instrumenty/moj-god/', 390, 669, { later: true, scrollSel: '#pdf, button.gold' }],
  ['b-kursy', '/kursy/', 390, 669, { later: true }], ['b-search', '/', 390, 669, { later: true, scrollSel: '#q, input[type=search]' }],
  // вопрос о языке при первом заходе (10.10.2026): ?lang=ask показывает его и роботу
  ['lang-ru', '/?lang=ask', 390, 669, {}], ['lang-uk', '/uk/shveycariya/?lang=ask', 390, 669, {}], ['lang-app', '/?app=1&lang=ask', 390, 777, {}],
  ['lang-dark', '/instrumenty/?lang=ask', 390, 736, { dark: true }], ['lang-desk', '/?lang=ask', 1280, 760, { desk: true }],
  ['lang-vz', '/?lang=ask', 390, 669, { vz: true }], ['lang-vz-test', '/kompas/?lang=ask', 390, 736, { vz: true, locale: 'ru-RU' }],
  ['lang-vz-app', '/?app=1&lang=ask', 390, 777, { vz: true }], ['lang-vz-desk', '/?lang=ask', 1280, 760, { vz: true, desk: true }],
];
(async () => {
  const srv = spawn('python3', ['-I', '-m', 'http.server', String(PORT), '--directory', require('path').resolve(__dirname, '../..')], { cwd: __dirname, stdio: 'ignore' });
  const vsrv = require('fs').existsSync(VZ) ? spawn('python3', ['-I', '-m', 'http.server', String(VPORT), '--directory', VZ], { cwd: __dirname, stdio: 'ignore' }) : null;
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch(); const errs = [];
  for (const [n, pg, w, h, o] of S) {
    if (!n.startsWith(ONLY) || (o.vz && !vsrv)) continue;
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: o.desk ? 1 : 2, isMobile: !o.desk, hasTouch: !o.desk, colorScheme: o.dark ? 'dark' : 'light', ...(o.locale ? { locale: o.locale } : {}) });
    await ctx.addInitScript((l) => { try { for (const k of ['svoiludi-app-later', 'vz-app-later']) { if (l) localStorage.setItem(k, String(Date.now())); else localStorage.removeItem(k); } } catch (e) {} }, !!o.later || !/install=/.test(pg));
    const p = await ctx.newPage(); p.on('pageerror', e => errs.push(n + ' ' + e.message));
    await p.goto((o.vz ? VB : B) + pg, { waitUntil: 'networkidle' }); await p.waitForTimeout(1000);
    if (o.scrollText) { const el = p.getByText(o.scrollText, { exact: false }).first(); try { await el.evaluate(e => { window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.45); }); } catch (e) { errs.push(n + ' noscroll'); } await p.waitForTimeout(600); }
    if (o.scrollSel) { const ok = await p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return false; window.scrollTo(0, e.getBoundingClientRect().top + scrollY - innerHeight * 0.45); return true; }, o.scrollSel); if (!ok) errs.push(n + ' nosel'); await p.waitForTimeout(600); }
    if (/install=/.test(pg)) await p.evaluate(() => document.querySelectorAll('.pa-card img').forEach(i => i.loading = 'eager'));
    if (o.click) { await p.click(o.click); }
    await p.waitForTimeout(700);
    await p.screenshot({ path: OUT + n + '.png' });
    await ctx.close();
  }
  console.log(errs.length ? errs : 'ok'); await b.close(); srv.kill(); if (vsrv) vsrv.kill();
})();
