// Снимает разметку и стили элементов прямо с сайта svoiludi.ch (копия из репозитория) для библиотеки стиля.
// node _i18n/stil/svoi/grab.js [Имя ...]   (из корня репозитория svoiludi; без имён — все из grab-spec.js)
// Для каждого элемента из grab-spec.js: открывает страницу локально, отмечает нужные блоки, берёт их HTML
// и только те правила CSS сайта, которые к ним относятся, с приставкой .dsx-<Имя> (чтобы не мешали другим элементам).
// Пишет components/<Имя>/preview.html и раздел «/* @grab <Имя> */» в components/bundle.css. README.md элемента пишется руками.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const SPEC = require('./grab-spec.js');
const REPO = path.resolve(__dirname, '../../..');
const COMP = path.join(__dirname, 'project/components');
const ONLY = process.argv.slice(2);
const PORT = 8875, BASE = `http://localhost:${PORT}`;
const TOKENS = (fs.readFileSync(path.join(__dirname, 'tokens.css'), 'utf8').match(/--[\w-]+(?=:)/g) || []);

function extract(arg) {
  const { name, tokens } = arg;
  const W = '.dsx-' + name;
  const roots = [...document.querySelectorAll('[data-dsg]')];
  if (!roots.length) throw new Error('не отмечено ни одного блока');
  const sub = new Set();
  roots.forEach(r => { sub.add(r); r.querySelectorAll('*').forEach(e => sub.add(e)); });
  const subA = [...sub];
  const DYN = /::?(before|after|placeholder|marker|selection|first-letter|first-line|-webkit-[\w-]+|-moz-[\w-]+)|:(hover|focus|focus-visible|focus-within|active|visited|link|target)(?![\w-])/g;
  function split(sel) { const out = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(') d++; if (ch === ')') d--; if (ch === ',' && !d) { out.push(cur.trim()); cur = ''; } else cur += ch; } if (cur.trim()) out.push(cur.trim()); return out; }
  function hits(part) {
    let t = part.replace(DYN, '').replace(/:is\(\)|:where\(\)/g, '').trim();
    if (!t || /[>+~]$/.test(t)) t = t.replace(/[>+~]\s*$/, '').trim();
    if (!t) return false;
    try { return subA.some(e => e.matches(t)); } catch (e) { return false; }
  }
  const used = new Set();
  function walk(rules) {
    let out = '';
    for (const r of rules) {
      if (r.type === 1) {
        const parts = split(r.selectorText).filter(p => !/^(html|:root|body)\b/.test(p) && !/^\*$/.test(p) && hits(p));
        if (!parts.length) continue;
        const body = r.style.cssText;
        if (!body) continue;
        (body.match(/var\(--[\w-]+/g) || []).forEach(v => used.add(v.slice(4)));
        out += parts.map(p => W + ' ' + p).join(',') + '{' + body + '}\n';
      } else if (r.type === 4) {
        if (/prefers-color-scheme|print/.test(r.conditionText || r.media.mediaText)) continue;
        if (!matchMedia(r.media.mediaText).matches) continue; // только вид той ширины, на которой снимали (телефон или компьютер)
        out += walk(r.cssRules);
      } else if (r.type === 12) {
        if (/subgrid/.test(r.conditionText)) continue; // сетки рядом нет — карточка в своей обычной раскладке
        const inner = walk(r.cssRules); if (inner) out += '@supports ' + r.conditionText + '{\n' + inner + '}\n';
      } else if (r.type === 7) {
        out += r.cssText + '\n';
      }
    }
    return out;
  }
  let css = W + ' img{height:auto}\n'; // чтобы общие правила других элементов библиотеки (например, .sp img) не сжимали фото
  for (const s of document.styleSheets) { let rr; try { rr = s.cssRules; } catch (e) { continue; } css += walk(rr); }
  // свои переменные сайта, которых нет в токенах библиотеки
  const cs = getComputedStyle(document.documentElement);
  const extra = [...used].filter(v => !tokens.includes(v) && cs.getPropertyValue(v).trim()).map(v => v + ':' + cs.getPropertyValue(v).trim());
  if (extra.length) css = W + '{' + extra.join(';') + '}\n' + css;
  // разметка: копии блоков в цепочке предков (только тег, класс и id), без скриптов и обработчиков
  function clean(el) {
    const c = el.cloneNode(true);
    c.removeAttribute('data-dsg');
    c.querySelectorAll('script,iframe,noscript').forEach(x => x.remove());
    [c, ...c.querySelectorAll('*')].forEach(x => {
      [...x.attributes].forEach(a => { if (/^on/.test(a.name) || a.name === 'data-dsg') x.removeAttribute(a.name); });
      ['src', 'href'].forEach(k => { const v = x.getAttribute(k); if (v && x.tagName !== 'A' && !/^(data:|https?:|#|mailto:|tel:)/.test(v)) x.setAttribute(k, '/_repo/' + new URL(v, location.href).pathname.replace(/^\//, '')); });
      if (x.tagName === 'A' && x.getAttribute('href')) x.setAttribute('href', '#');
    });
    return c.outerHTML;
  }
  let html = roots.map(clean).join('\n');
  for (let a = roots[0].parentElement; a && a !== document.body; a = a.parentElement) {
    const tag = a.tagName.toLowerCase();
    const attrs = (a.id ? ` id="${a.id}"` : '') + (a.className && typeof a.className === 'string' ? ` class="${a.className}"` : '') + (tag === 'dialog' ? ' open' : '') + (a.getAttribute('style') ? '' : '');
    const st = a.getAttribute('style') || '';
    html = `<${tag}${attrs} style="${st};position:static;display:block;inset:auto;transform:none;max-height:none;overflow:visible;margin:0;width:auto;max-width:100%;height:auto;border:0;padding:0;background:none;box-shadow:none">${html}</${tag}>`;
  }
  return { html, css };
}

(async () => {
  const srv = spawn('python3', ['-I', '-m', 'http.server', String(PORT), '--directory', REPO], { stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const b = await chromium.launch();
  let bundle = fs.readFileSync(path.join(COMP, 'bundle.css'), 'utf8');
  const report = [];
  for (const s of SPEC) {
    if (ONLY.length && !ONLY.includes(s.name)) continue;
    const width = s.width || 390;
    const ctx = await b.newContext({ viewport: { width, height: 900 }, locale: 'ru-RU', colorScheme: 'light', isMobile: width < 700, hasTouch: width < 700 });
    const p = await ctx.newPage();
    try {
      await p.goto(BASE + s.page, { waitUntil: 'load' });
      await p.addStyleTag({ content: '*{animation-duration:0s!important;transition-duration:0s!important}' });
      await p.evaluate(() => { try { localStorage.setItem('svlLang', 'ru'); } catch (e) {} });
      await p.waitForTimeout(1200);
      if (s.before) await s.before(p);
      await p.waitForTimeout(500);
      const n = await p.evaluate(s.mark);
      if (!n) throw new Error('блок не найден');
      if (s.trim) await p.evaluate(s.trim);
      const r = await p.evaluate(extract, { name: s.name, tokens: TOKENS });
      r.css = r.css.replace(/(\d*\.?\d+)vw\b/g, (m, n) => +(n * width / 100).toFixed(1) + 'px'); // vw — как на ширине снимка
      const dir = path.join(COMP, s.name); fs.mkdirSync(dir, { recursive: true });
      const box = width < 700 ? `<div class="dsx-${s.name}" style="width:${width}px;max-width:100%;box-sizing:border-box;padding:12px;background:var(--bg);border:1px solid var(--line);border-radius:18px">` : `<div class="dsx-${s.name}" style="width:100%">`;
      fs.writeFileSync(path.join(dir, 'preview.html'), `<!-- @dsCard group="${s.group}" height=${s.height || 600} subtitle="${s.subtitle}" -->\n<!-- Снято с сайта скриптом _i18n/stil/svoi/grab.js (${s.page}); правится не здесь, а на сайте, потом node _i18n/stil/svoi/grab.js ${s.name} -->\n<div class="ds-wrap">\n${s.cap ? `<span class="ds-cap">${s.cap}</span>\n` : ''}${box}\n${r.html}\n</div>\n</div>\n`);
      const block = `/* @grab ${s.name} — снято с сайта (${s.page}), не править руками */\n${r.css}${s.extraCss ? s.extraCss.replace(/&/g, '.dsx-' + s.name) + '\n' : ''}/* @end ${s.name} */\n`;
      const re = new RegExp(`/\\* @grab ${s.name} [\\s\\S]*?/\\* @end ${s.name} \\*/\\n`);
      bundle = re.test(bundle) ? bundle.replace(re, block) : bundle + '\n' + block;
      report.push(`ok   ${s.name}: ${n} блок(а), CSS ${r.css.length} знаков, HTML ${r.html.length}`);
    } catch (e) { report.push(`FAIL ${s.name}: ${String(e.message || e).split('\n')[0]}`); }
    await ctx.close();
  }
  fs.writeFileSync(path.join(COMP, 'bundle.css'), bundle);
  await b.close(); srv.kill();
  console.log(report.join('\n'));
})();
