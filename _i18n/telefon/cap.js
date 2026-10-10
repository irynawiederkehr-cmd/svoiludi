const { chromium } = require('playwright'); const { spawn } = require('child_process');
const ROOT = require('path').resolve(__dirname, '../..'), PORT = 8897, OUT = __dirname + '/shots/';
const shots = [
  // name, path, height, app, click
  ['app-home', '/?app=1', 777, true],
  ['app-tools', '/instrumenty/?app=1', 777, true, null, '.tools'],
  ['app-more', '/?app=1', 777, true, '.pa-more'],
  ['safari', '/', 669, false],
  ['chrome', '/', 736, false],
  ['inapp', '/', 747, false],
];
(async () => {
  const srv = spawn('python3', ['-I', '-m', 'http.server', String(PORT), '--directory', ROOT], { cwd: __dirname, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch();
  for (const lang of ['ru', 'uk']) {
    for (const [name, path, h, app, click, scrollTo] of shots) {
      const ctx = await b.newContext({ viewport: { width: 390, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
      await ctx.addInitScript((l) => { try { localStorage.setItem('svoiludi-app-later', String(Date.now())); localStorage.setItem('svoiludiLang', l); } catch (e) {} }, lang);
      const p = await ctx.newPage();
      await p.goto(`http://localhost:${PORT}${lang === 'uk' ? '/uk' : ''}${path}`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(900);
      await p.addStyleTag({ content: '.pa-card{display:none!important}' });
      if (scrollTo) { await p.evaluate((sel) => { const e = document.querySelector(sel); window.scrollTo(0, e.getBoundingClientRect().top + scrollY - 14); }, scrollTo); await p.waitForTimeout(700); }
      if (click) { await p.click(click); await p.waitForTimeout(500); }
      await p.screenshot({ path: OUT + `${lang}-${name}.png` });
      await ctx.close();
    }
  }
  await b.close(); srv.kill();
})();
