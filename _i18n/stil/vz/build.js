// Собирает «Стиль voznesenskaya.ch — открыть.html»: одна страница без интернета.
// node build.js <папка сайта (репозиторий tests)> <папка снимков из shots.js> <файл страницы>
// Цвета берутся из CSS сайта, элементы — снимки настоящих страниц, тексты — texts.js.
const fs = require('fs'); const path = require('path'); const { execSync } = require('child_process');
const ELEMENTS = require('./elements.js'); const TEXTS = require('./texts.js');
const ROOT = path.resolve(process.argv[2]); const SHOTS = path.resolve(process.argv[3]); const OUT = path.resolve(process.argv[4]);
const rd = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const b64 = (file, mime) => `data:${mime};base64,${fs.readFileSync(file).toString('base64')}`;

// ---------- CSS: блоки «селекторы → объявления» ----------
function blocks(css) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const out = []; const stack = []; let buf = '';
  for (const ch of css) {
    if (ch === '{') { stack.push(buf.trim()); buf = ''; }
    else if (ch === '}') { if (buf.trim()) out.push({ sel: stack.slice(), decl: buf }); stack.pop(); buf = ''; }
    else buf += ch;
  }
  return out;
}
const vars = (decl) => { const o = {}; for (const m of decl.matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+)/gi)) o[m[1]] = m[2].trim(); return o; };
const isDark = (sel) => sel.some(s => /prefers-color-scheme:\s*dark/.test(s));
function collect(css, test) {   // test(selectorChain) → 'light'|'dark'|null
  const r = { light: {}, dark: {} };
  for (const b of blocks(css)) { const t = test(b.sel); if (t) Object.assign(r[t], vars(b.decl)); }
  return r;
}
const inlineCss = (html) => (html.match(/<style[^>]*>[\s\S]*?<\/style>/g) || []).map(s => s.replace(/<\/?style[^>]*>/g, '')).join('\n');
const homeCss = inlineCss(rd('index.html'));
const brandCss = rd('assets/brand.css');
const last = (sel) => sel[sel.length - 1];
// главная палитра сайта — :root на главной (светлая) и :root:not([data-theme=light]) в тёмной
const MAIN = collect(homeCss, (s) => last(s) === ':root' && !isDark(s) ? 'light' : (isDark(s) && /^:root:not\(\[data-theme="light"\]\)$/.test(last(s)) ? 'dark' : null));
const ROOTP = collect(brandCss, (s) => last(s) === ':root' && !isDark(s) ? 'light' : (isDark(s) && /^:root:not\(\[data-theme="light"\]\)$/.test(last(s)) ? 'dark' : null));
const COACH = collect(brandCss, (s) => /^:root\[data-brand="coach"\]$/.test(last(s)) && !isDark(s) ? 'light' : (isDark(s) && /data-brand="coach"\]:not/.test(last(s)) ? 'dark' : null));
const PSY = collect(brandCss, (s) => /^:root\[data-brand="psy"\]$/.test(last(s)) && !isDark(s) ? 'light' : (isDark(s) && /data-brand="psy"\]:not/.test(last(s)) ? 'dark' : null));

const MAIN_USE = {
  bg: 'Фон страницы (бежевый).', paper: 'Бумага: карточки, плитки меню, окна, поля.', ink: 'Основной текст.', muted: 'Подписи, надписи прописными, мелкие пояснения.',
  line: 'Тонкие рамки и разделители.', brown: 'ГЛАВНЫЙ ЦВЕТ сайта: кнопки, номера, текущий раздел, слова-акценты в заголовках.', soft: 'Мягкая подложка: фон фото и пустых мест.',
  sage: 'Шалфей — связь со «Своими людьми», значок почты.', 'sage-soft': 'Светлый шалфей — спокойные блоки.', mustard: 'Горчица (золото): цена, главный продукт, линия у цитаты.',
  'mustard-soft': 'Светлая горчица: кодовое слово, приглашение на знакомство, важное.', blue: 'Синий — тесты о паре (психология).', 'blue-soft': 'Фон блоков тестов о паре.', 'blue-line': 'Рамки блоков тестов о паре.'
};
const pick = (src, names) => names.filter(n => src.light[n] || src.dark[n]).map(n => ({ n, l: src.light[n] || '', d: src.dark[n] || src.light[n] || '' }));
const mainTokens = Object.keys(Object.assign({}, MAIN.light, MAIN.dark)).filter(n => /^#|^rgb/i.test(MAIN.light[n] || MAIN.dark[n] || '')).map(n => ({ n, l: MAIN.light[n] || '', d: MAIN.dark[n] || MAIN.light[n] || '', u: MAIN_USE[n] || '' }));
const PALETTES = [
  { t: 'Тесты о себе (коучинг)', u: 'Страницы тестов «Компас адаптации» и «Ступени устойчивости»: тот же бежевый и коричневый, что на главной.', list: pick(COACH, ['bg', 'paper', 'ink', 'muted', 'line', 'plum', 'brand-soft']).map(x => ({ ...x, n: x.n === 'plum' ? 'plum (главный)' : x.n })) },
  { t: 'Тесты о паре (психология)', u: '«Быть рядом и быть собой» и «Роза любви» — голубая гамма, чтобы психологическую практику было видно сразу.', list: pick(PSY, ['bg', 'paper', 'ink', 'muted', 'line', 'plum', 'brand-soft']).map(x => ({ ...x, n: x.n === 'plum' ? 'plum (главный)' : x.n })) },
  { t: 'Шесть цветов сфер', u: 'Для тестов с несколькими шкалами: заливка и светлый фон (s).', list: pick(ROOTP, ['a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a0s', 'a1s', 'a2s', 'a3s', 'a4s', 'a5s']) },
  { t: 'Спиральная динамика «Контур · свежий»', u: 'Цвета ступеней: заливка (-f), светлый фон (-s), контур и текст (-l). Утверждённая палитра.', list: pick(ROOTP, ['beige', 'purple', 'red', 'blue', 'orange', 'green', 'yellow', 'turq'].flatMap(c => [`sd-${c}-f`, `sd-${c}-s`, `sd-${c}-l`])) },
  { t: 'Роли в паре', u: '«Быть рядом и быть собой»: страсть, близость, обязательство, она и он — цвет и светлый фон.', list: pick(ROOTP, ['passion', 'close', 'resp', 'her', 'him', 'passion-soft', 'close-soft', 'resp-soft', 'her-soft', 'him-soft']) },
];

// ---------- шрифты сайта внутрь страницы ----------
let fonts = '';
for (const [fam, w] of [['Forum', 400], ...[400, 500, 600, 700, 800].map(x => ['Manrope', x])]) {
  for (const [sub, rng] of [['cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'], ['latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD']]) {
    const f = path.join(ROOT, 'assets/fonts', `${fam.toLowerCase()}-${sub}-${w}-normal.woff2`);
    if (fs.existsSync(f)) fonts += `@font-face{font-family:'${fam}';font-weight:${w};font-display:swap;src:url(${b64(f, 'font/woff2')}) format('woff2');unicode-range:${rng}}\n`;
  }
}

// ---------- элементы ----------
const GROUPS = [...new Set(ELEMENTS.map(e => e.group))];
const slug = (s) => s.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-').replace(/^-|-$/g, '');
const missing = [];
function shotsHtml(e) {
  const ws = e.w || ['phone'];
  const parts = ws.map(w => {
    const l = path.join(SHOTS, `${e.id}-${w}-light.jpg`), d = path.join(SHOTS, `${e.id}-${w}-dark.jpg`);
    if (!fs.existsSync(l)) { missing.push(`${e.id}-${w}`); return ''; }
    const L = b64(l, 'image/jpeg'); const D = fs.existsSync(d) ? b64(d, 'image/jpeg') : null;
    const cap = w === 'phone' ? 'Телефон' : 'Компьютер';
    return `<figure class="vs-shot vs-${w}"><button type="button" class="vs-zoom" aria-label="Открыть крупно"><img class="th-l" src="${L}" alt="${esc(e.title)} — ${cap}" loading="lazy">${D ? `<img class="th-d" src="${D}" alt="${esc(e.title)} — ${cap}, тёмная тема" loading="lazy">` : ''}</button><figcaption>${cap} · нажми, чтобы открыть крупно${D ? '' : ' <span class="vs-nod">· в тёмной теме не снимали</span>'}</figcaption></figure>`;
  }).join('');
  return parts;
}
let elHtml = '';
for (const g of GROUPS) {
  elHtml += `<h3 class="vs-g" id="g-${slug(g)}">${esc(g)}</h3><div class="vs-list">`;
  for (const e of ELEMENTS.filter(x => x.group === g)) {
    const t = TEXTS[e.id] || { text: '', code: '' };
    elHtml += `<article class="vs-el" id="el-${e.id}"><div class="vs-elhead"><h4>${esc(e.title)}</h4></div><p class="vs-txt">${esc(t.text)}</p><div class="vs-shots">${shotsHtml(e)}</div>${t.code ? `<p class="vs-code"><b>Код:</b> <code>${esc(t.code)}</code></p>` : ''}<p class="vs-src">Страница: <a href="https://voznesenskaya.ch${e.page.replace('?app=1', '').replace(/\?install=.*/, '')}">voznesenskaya.ch${esc(e.page)}</a></p></article>`;
  }
  elHtml += '</div>';
}

// ---------- цвета ----------
const sw = (x) => `<div class="vs-sw"><span class="vs-chip" style="--cl:${esc(x.l)};--cd:${esc(x.d)}"></span><div><b>${esc(x.n)}</b> <code class="th-lt">${esc(x.l)}</code><code class="th-dt">${esc(x.d)}</code>${x.u ? `<p>${esc(x.u)}</p>` : ''}</div></div>`;
const colorsHtml = `<div class="vs-swgrid">${mainTokens.map(sw).join('')}</div>` + PALETTES.map(p => p.list.length ? `<h4 class="vs-sub">${esc(p.t)}</h4><p class="vs-note">${esc(p.u)}</p><div class="vs-swgrid vs-small">${p.list.map(sw).join('')}</div>` : '').join('');

// ---------- картинки ----------
const pics = [];
const addPic = (f, cap) => { const p = path.join(ROOT, f); if (fs.existsSync(p)) pics.push(`<figure><img src="${b64(p, f.endsWith('.svg') ? 'image/svg+xml' : f.endsWith('.png') ? 'image/png' : 'image/jpeg')}" alt="${esc(cap)}" loading="lazy"><figcaption>${esc(cap)}</figcaption></figure>`); };
addPic('favicon.svg', 'Знак сайта — эдельвейс (favicon.svg)'); addPic('apple-touch-icon.png', 'Иконка приложения (apple-touch-icon.png)');
const fans = [];
for (const t of ['stupeni', 'kompas']) for (const n of [1, 2, 3]) { const f = `${t}/preview/${n}.jpg`; if (fs.existsSync(path.join(ROOT, f))) fans.push(`<figure><img src="${b64(path.join(ROOT, f), 'image/jpeg')}" alt="${t} ${n}" loading="lazy"><figcaption>${t === 'stupeni' ? '«Ступени устойчивости»' : '«Компас адаптации»'}, стр. ${n}</figcaption></figure>`); }

let commit = ''; try { commit = execSync(`git -C "${ROOT}" log -1 --format="%h · %ad" --date=format:"%d.%m.%Y %H:%M"`).toString().trim(); } catch (e) { }
const now = new Date(); const pad = (n) => String(n).padStart(2, '0');
const built = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
const L = MAIN.light, Dk = MAIN.dark;
const logo = b64(path.join(ROOT, 'favicon.svg'), 'image/svg+xml');

const page = `<!doctype html>
<html lang="ru" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Стиль voznesenskaya.ch</title>
<link rel="icon" href="${logo}">
<style>
${fonts}
:root{--bg:${L.bg};--paper:${L.paper};--ink:${L.ink};--muted:${L.muted};--line:${L.line};--brown:${L.brown};--soft:${L.soft || L.line};--mustard:${L.mustard || '#B98324'};--mustard-soft:${L['mustard-soft'] || '#F3E3C2'};--display:"Forum",Georgia,serif;--body:"Manrope","Segoe UI",system-ui,sans-serif}
:root[data-theme="dark"]{--bg:${Dk.bg};--paper:${Dk.paper};--ink:${Dk.ink};--muted:${Dk.muted};--line:${Dk.line};--brown:${Dk.brown};--soft:${Dk.soft || Dk.line};--mustard:${Dk.mustard || '#E2B45C'};--mustard-soft:${Dk['mustard-soft'] || '#3D321F'};color-scheme:dark}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.6 var(--body)}
a{color:var(--brown)}
.vs{max-width:1120px;margin:0 auto;padding:0 16px 60px}
.vs-head{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--line);margin:0 -16px;padding:10px 16px}
.vs-head .in{max-width:1120px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between}
.vs-brand{display:flex;gap:10px;align-items:center;color:var(--ink);text-decoration:none}
.vs-brand img{width:38px;height:38px}
.vs-brand b{font:400 1.45rem/1 var(--display)}
.vs-brand small{display:block;font-size:.78rem;color:var(--muted)}
.btn{font:inherit;font-weight:700;font-size:.82rem;border:1.5px solid var(--brown);border-radius:12px;padding:7px 14px;cursor:pointer;background:transparent;color:var(--brown)}
.btn[aria-pressed="true"]{background:var(--brown);color:var(--paper)}
.vs-hero{padding:28px 0 6px}
.vs-hero .eyebrow{font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--muted)}
.vs-hero h1{font:400 clamp(2.3rem,5.4vw,3.6rem)/1.06 var(--display);margin:6px 0 10px}
.vs-hero h1 em{font-style:normal;color:var(--brown)}
.vs-hero p{max-width:66ch;margin:0 0 8px}
.vs-note{color:var(--muted);font-size:.9rem;max-width:72ch}
.vs-toc{display:flex;flex-wrap:wrap;gap:4px 14px;margin:16px 0 0;padding:12px 16px;background:var(--paper);border:1px solid var(--line);border-radius:18px;font-size:.92rem}
.vs-toc a{font-weight:600;text-decoration:none}
.vs-sec{margin-top:40px}
.vs-sec>h2{font:400 clamp(1.6rem,3.4vw,2.2rem)/1.12 var(--display);margin:0 0 14px}
.vs-card{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px 20px}
.vs-card ul{margin:0;padding-left:20px}.vs-card li{margin:6px 0}
.vs-swgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:12px}
.vs-swgrid.vs-small{grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.vs-sw{display:flex;gap:12px;align-items:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:12px}
.vs-chip{flex:0 0 44px;height:44px;border-radius:12px;border:1px solid var(--line);background:var(--cl)}
:root[data-theme="dark"] .vs-chip{background:var(--cd)}
.vs-sw p{margin:4px 0 0;font-size:.84rem;line-height:1.45;color:var(--muted)}
.vs-sw code,.vs-code code{font:500 .82em/1.4 ui-monospace,Consolas,monospace;background:var(--soft);padding:1px 6px;border-radius:6px}
.th-dt{display:none}:root[data-theme="dark"] .th-dt{display:inline}:root[data-theme="dark"] .th-lt{display:none}
.vs-sub{font:700 .78rem/1.3 var(--body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:24px 0 4px}
.vs-ty{background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:14px 16px;margin-bottom:10px}
.vs-ty span{display:block;font-size:.84rem;color:var(--muted);margin-top:4px}
.vs-g{font:400 1.55rem/1.2 var(--display);margin:32px 0 12px;scroll-margin-top:90px}
.vs-list{display:flex;flex-direction:column;gap:18px}
.vs-el{background:var(--paper);border:1px solid var(--line);border-radius:18px;padding:18px;scroll-margin-top:90px}
.vs-elhead h4{margin:0 0 6px;font:400 1.3rem/1.25 var(--display)}
.vs-txt{margin:0 0 12px;max-width:80ch}
.vs-shots{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start}
.vs-shot{margin:0;background:var(--bg);border:1px solid var(--line);border-radius:14px;padding:8px}
.vs-phone{flex:0 1 300px;max-width:300px}
.vs-desk{flex:1 1 520px;min-width:0}
.vs-zoom{display:block;border:0;padding:0;background:none;cursor:zoom-in;width:100%;max-height:760px;overflow:auto;border-radius:8px}
.vs-shot img{display:block;width:100%;height:auto;border-radius:8px}
.th-d{display:none!important}:root[data-theme="dark"] .vs-shot .th-d{display:block!important}:root[data-theme="dark"] .vs-zoom:has(.th-d) .th-l{display:none!important}
.vs-shot figcaption{font-size:.78rem;color:var(--muted);margin-top:6px}
.vs-nod{display:none}:root[data-theme="dark"] .vs-nod{display:inline}
.vs-code{margin:12px 0 0;font-size:.88rem}
.vs-src{margin:6px 0 0;font-size:.8rem;color:var(--muted)}
.vs-pics{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:12px}
.vs-pics figure{margin:0;background:var(--paper);border:1px solid var(--line);border-radius:14px;padding:10px;text-align:center}
.vs-pics img{max-width:100%;max-height:240px}
.vs-pics figcaption{font-size:.78rem;color:var(--muted);margin-top:6px}
.vs-foot{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);font-size:.86rem;color:var(--muted)}
dialog.vs-lb{border:0;padding:0;background:transparent;max-width:96vw;max-height:96vh}
dialog.vs-lb::backdrop{background:rgba(20,15,10,.82)}
dialog.vs-lb img{display:block;max-width:96vw;max-height:92vh;border-radius:10px}
dialog.vs-lb button{position:fixed;top:12px;right:12px;font:700 1rem var(--body);border:0;border-radius:12px;padding:8px 14px;background:var(--paper);color:var(--ink);cursor:pointer}
@media (max-width:640px){.vs-head{position:static}.vs-phone{max-width:100%;flex-basis:100%}}
</style>
</head>
<body>
<div class="vs">
<header class="vs-head"><div class="in">
<a class="vs-brand" href="#top"><img src="${logo}" alt=""><span><b>Стиль voznesenskaya.ch</b><small>коучинговый сайт Ирины · только для нас</small></span></a>
<div role="group" aria-label="Тема" style="display:flex;gap:6px"><button type="button" class="btn" data-t="light" aria-pressed="true">Светлая</button><button type="button" class="btn" data-t="dark" aria-pressed="false">Тёмная</button></div>
</div></header>
<main id="top">
<section class="vs-hero">
<div class="eyebrow">Библиотека стиля</div>
<h1>Коучинговый сайт: <em>как это выглядит</em></h1>
<p>Все элементы voznesenskaya.ch в одном месте — снимки настоящих страниц на телефоне и компьютере, в светлой и тёмной теме, с объяснением и классами из кода. Перед тем как делать новый блок, кнопку или страницу, находим здесь похожий и берём его.</p>
<p class="vs-note">Собрано ${built} из сайта (версия ${esc(commit)}). Страница работает без интернета. Нажми на снимок, чтобы открыть крупно. Цвета ниже взяты прямо из кода сайта, поэтому при каждом обновлении они точные.</p>
<nav class="vs-toc"><a href="#golos">Голос и правила</a><a href="#cveta">Цвета</a><a href="#shrifty">Шрифты и форма</a>${GROUPS.map(g => `<a href="#g-${slug(g)}">${esc(g)}</a>`).join('')}<a href="#kartinki">Картинки</a></nav>
</section>
<section class="vs-sec" id="golos"><h2>Голос и правила</h2><div class="vs-card"><ul>${TEXTS.VOICE.map(v => `<li>${esc(v)}</li>`).join('')}</ul></div></section>
<section class="vs-sec" id="cveta"><h2>Цвета</h2><p class="vs-note">В коде цвет берётся только через переменную, например <code>var(--brown)</code>. Кнопка «Тёмная» вверху показывает значения тёмной темы.</p>${colorsHtml}</section>
<section class="vs-sec" id="shrifty"><h2>Шрифты и форма</h2>
<div class="vs-ty"><div style="font:400 2.4rem/1.1 var(--display)">Твой собственный путь</div><span>Заголовки — Forum (<code>--display</code>), часть заголовка в <code>&lt;em&gt;</code> цветом brown.</span></div>
<div class="vs-ty"><div style="font:400 1.05rem/1.65 var(--body)">Ты переехала, и жизнь будто встала на паузу. Её можно снова запустить, и не обязательно сразу большим шагом.</div><span>Текст и кнопки — Manrope (<code>--body</code>). Файлы шрифтов лежат на самом сайте (assets/fonts).</span></div>
<div class="vs-ty"><div style="font:700 .74rem/1.3 var(--body);letter-spacing:.16em;text-transform:uppercase;color:var(--muted)">Работа со мной</div><span>Надпись над заголовком — <code>.eyebrow</code>, прописными, серым.</span></div>
<div class="vs-card"><ul>
<li><b>Кнопки</b> — прямоугольные со скруглением 12 px (решение 08.10.2026, CSS в <code>_i18n/shape.py</code>). Зелёная — бесплатное, золотая — цена и главный продукт, коричневая — остальное, контуром — второстепенное (<code>.btn.ghost</code>).</li>
<li><b>Карточки</b> — бумага <code>--paper</code>, рамка <code>--line</code>, скругление 18–20 px; окна — 28 px. Тени мягкие и только снизу.</li>
<li><b>Круглые</b> только метки: «Бесплатно», цена, «В разработке», номера шагов, стрелки-кнопки.</li>
</ul></div></section>
<section class="vs-sec" id="elementy"><h2>Элементы</h2>${elHtml}</section>
<section class="vs-sec" id="kartinki"><h2>Картинки</h2><div class="vs-pics">${pics.join('')}</div>
<h4 class="vs-sub">Разбор теста в PDF — так выглядят страницы</h4><p class="vs-note">Веер на страницах тестов собран из этих страниц (папка preview каждого теста, на четырёх языках).</p><div class="vs-pics">${fans.join('')}</div></section>
<footer class="vs-foot">
<p>Стиль общий со svoiludi.ch — библиотека «Свои люди» лежит в той же папке «08_Стиль сайтов». Описание словами — документ проекта «stil-voznesenskaya.md».</p>
<p>Страница пересобирается сама по расписанию из кода сайта (скрипты в репозитории svoiludi, папка _i18n/stil/vz). Новый элемент, который Ирина одобрила, дописывается в список элементов в тот же день.</p>
</footer>
</main>
</div>
<dialog class="vs-lb" id="lb"><img alt=""><button type="button">Закрыть</button></dialog>
<script>
(function(){
  var root=document.documentElement;
  function set(t){ root.setAttribute('data-theme',t); document.querySelectorAll('[data-t]').forEach(function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-t')===t); }); try{localStorage.setItem('vs-theme',t);}catch(e){} }
  document.querySelectorAll('[data-t]').forEach(function(b){ b.addEventListener('click', function(){ set(b.getAttribute('data-t')); }); });
  var s=null; try{s=localStorage.getItem('vs-theme');}catch(e){}
  set(s==='dark'?'dark':'light');
  var lb=document.getElementById('lb'), li=lb.querySelector('img');
  document.querySelectorAll('.vs-zoom').forEach(function(b){ b.addEventListener('click', function(){
    var dark=root.getAttribute('data-theme')==='dark', im=(dark && b.querySelector('.th-d')) || b.querySelector('.th-l');
    li.src=im.src; li.alt=im.alt; if(lb.showModal) lb.showModal(); }); });
  lb.querySelector('button').addEventListener('click', function(){ lb.close(); });
  lb.addEventListener('click', function(e){ if(e.target===lb) lb.close(); });
})();
</script>
</body>
</html>`;
fs.writeFileSync(OUT, page);
console.log('page', Math.round(page.length / 1024), 'KB · элементов', ELEMENTS.length, '· цветов', mainTokens.length, '· палитр', PALETTES.map(p => p.list.length).join('/'), missing.length ? '· НЕТ СНИМКОВ: ' + missing.join(', ') : '');
