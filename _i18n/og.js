// Картинки-превью ссылок (og:image) для украинской версии: node _i18n/og.js
// Слева текст, справа — снимок украинской страницы (как в русских картинках). Пишет {папка}/og-image.uk.jpg и fav/og-svoi-ludi.uk.jpg.
// Локальный сервер скрипт поднимает сам. Запускать после python3 _i18n/pages.py, когда русские страницы или их вид заметно изменились.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..'); const PORT = 8897; const BASE = `http://localhost:${PORT}`;
const TOOLS = 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ · ІНСТРУМЕНТИ';
const CARDS = [
  { out: 'kursy/og-image.jpg', url: '/kursy/', sel: '#results', eyebrow: 'СВОИ ЛЮДИ В ШВЕЙЦАРИИ', title: 'Курсы и занятия на своём языке', desc: 'Йога, немецкий, кружки для детей, мастер-классы и вебинары по кантонам Швейцарии.', chip: 'Видно, кто ведёт каждый курс' },
  { out: 'kursy/og-image.uk.jpg', url: '/uk/kursy/', sel: '#results', eyebrow: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ', title: 'Курси й заняття своєю мовою', desc: 'Йога, німецька, гуртки для дітей, майстер-класи та вебінари по кантонах Швейцарії.', chip: 'Видно, хто веде кожен курс' },
  { out: 'events/og-image.uk.jpg', url: '/uk/events/', sel: '.finder', eyebrow: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ', title: 'Зустрічі поруч із тобою', desc: 'Розмовні клуби, зустрічі мам, свята для дітей, лекції та ретрити російською.', chip: 'По всіх кантонах' },
  { out: 'instrumenty/og-image.uk.jpg', url: '/uk/instrumenty/', sel: '.tools', eyebrow: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ', title: 'Корисні інструменти', desc: 'Річний план, план дня, щоденник емоцій і бюджет для життя у Швейцарії.', chip: 'Безкоштовно й українською' },
  { out: 'instrumenty/moj-budget/og-image.uk.jpg', url: '/uk/instrumenty/moj-budget/', sel: '.panel', eyebrow: TOOLS, title: 'Мій бюджет', desc: 'Усі обов’язкові витрати у Швейцарії, податки й бюджет для двох.', chip: 'Безкоштовно · Excel і PDF' },
  { out: 'join/og-image.uk.jpg', url: '/uk/join/', sel: '.steps', eyebrow: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ · ДЛЯ ФАХІВЦІВ', title: 'Розміститися в довіднику', desc: 'Для тих, хто офіційно працює у Швейцарії та допомагає людям російською чи українською.', chip: 'У період запуску безкоштовно' },
  { out: 'opros/og-image.uk.jpg', url: '/uk/opros/', sel: '#form', eyebrow: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ', title: 'Кого вам бракує?', desc: 'Коротке анонімне опитування про те, яких російськомовних фахівців бракує поруч.', chip: 'Одна хвилина' },
  { out: 'instrumenty/moj-den/og-image.uk.jpg', url: '/uk/instrumenty/moj-den/', sel: '.bar', eyebrow: TOOLS, title: 'Мій день', desc: 'Три головні справи, день по годинах, стоп-лист і таймер на 25 хвилин.', chip: 'Безкоштовно · PDF і PNG' },
  { out: 'instrumenty/moj-god/og-image.uk.jpg', url: '/uk/instrumenty/moj-god/', sel: '.panel', eyebrow: TOOLS, title: 'Мій рік', desc: 'Повторювані справи й важливі терміни на одному аркуші на весь рік.', chip: 'Безкоштовно · PDF, PNG і календар' },
  { out: 'instrumenty/moi-emocii/og-image.uk.jpg', url: '/uk/instrumenty/moi-emocii/', sel: '.main', eyebrow: TOOLS, title: 'Мої емоції', desc: 'Щоденник емоцій. За кілька тижнів видно, що повторюється і що допомагає.', chip: 'Безкоштовно · записи тільки в тебе' },
];
const CSS = `<link rel="stylesheet" href="${BASE}/assets/fonts.css"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;background:linear-gradient(135deg,#eef1e8,#e6ebdf);font-family:Manrope,system-ui,sans-serif;color:#2f2924;position:relative}
.l{position:absolute;left:64px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.eb{color:#B8862E;font-weight:600;font-size:19px;letter-spacing:.02em;margin-bottom:22px}
h1{font-family:Forum,Georgia,serif;font-weight:400;font-size:62px;line-height:1.08;margin-bottom:22px}
p{font-size:25px;line-height:1.45;color:#4F5E3E;font-weight:600;margin-bottom:28px}
.chip{display:inline-block;border:2px solid #e3d6c3;background:#fffcf8;border-radius:999px;padding:10px 20px;font-size:20px;font-weight:600;align-self:flex-start}
.foot{position:absolute;left:64px;bottom:40px;font-size:20px;color:#4F5E3E;font-weight:600}.foot:before{content:"";display:block;width:64px;height:5px;background:#B8862E;border-radius:3px;margin-bottom:18px}
.shot{position:absolute;left:620px;top:90px;width:600px;height:460px;border-radius:18px;overflow:hidden;transform:rotate(2deg);box-shadow:0 18px 40px rgba(60,50,30,.18);border:6px solid #e7dccb;background:#fffcf8}
.shot img{width:100%;display:block}</style>`;
const MAIN = `<link rel="stylesheet" href="${BASE}/assets/fonts.css"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;background:linear-gradient(135deg,#eef1e8,#e6ebdf);font-family:Manrope,system-ui,sans-serif;color:#2f2924;position:relative}
.eb{position:absolute;left:70px;top:70px;display:flex;align-items:center;gap:16px;color:#B8862E;font-weight:700;font-size:20px;letter-spacing:.14em}.eb img{width:46px;height:46px}
h1{position:absolute;left:70px;top:130px;font-family:Forum,Georgia,serif;font-weight:400;font-size:76px;line-height:1.02}h1 span{color:#4F5E3E;display:block}
p{position:absolute;left:70px;top:300px;width:540px;font-size:25px;line-height:1.4;color:#5d554d}
.chips{position:absolute;left:70px;top:434px;width:470px;display:flex;flex-wrap:wrap;gap:10px}.chips span{border:1.5px solid #e3d6c3;background:#fffcf8;border-radius:999px;padding:8px 16px;font-size:19px;font-weight:700;color:#5b4636}
.foot{position:absolute;left:70px;top:566px;font-size:18px;color:#7a6e62}
.c{position:absolute;width:330px;background:#fffcf8;border:2px solid var(--c);border-radius:18px;padding:16px;display:flex;gap:16px;align-items:center;box-shadow:0 10px 26px rgba(60,50,30,.14)}
.c .av{width:80px;height:100px;border-radius:12px;background:var(--s);position:relative;overflow:hidden;flex:none}
.c .av:before{content:"";position:absolute;left:28px;top:22px;width:24px;height:28px;border-radius:50%;background:var(--c);opacity:.75}
.c .av:after{content:"";position:absolute;left:12px;top:50px;width:56px;height:60px;border-radius:28px 28px 0 0;background:var(--c)}
.c b{font-family:Forum,Georgia,serif;font-weight:400;font-size:26px;display:block;line-height:1.1}.c i{font-style:normal;display:block;color:#7a6e62;font-size:17px;margin:4px 0 8px}.c u{text-decoration:none;font-weight:700;font-size:16px}</style>`;
function mainHtml(t) {
  const card = (x, y, r, c, s, name, dir, city) => `<div class="c" style="left:${x}px;top:${y}px;transform:rotate(${r}deg);--c:${c};--s:${s}"><div class="av"></div><div><b>${name}</b><i>${dir}</i><u>📍 ${city}</u></div></div>`;
  return `<html><head><meta charset="utf-8">${MAIN}</head><body>
  <div class="eb"><img src="${BASE}/fav/logo-svoi-ludi.svg">ДОВІДНИК · ШВЕЙЦАРІЯ</div>
  <h1>Свої люди<span>у Швейцарії</span></h1>
  <p>Російськомовні фахівці поруч із вами: лікарі, юристи, психологи, майстри. За кантоном, містом і мовою.</p>
  <div class="chips"><span>26 кантонів</span><span>12 напрямів</span><span>перевірена реєстрація</span></div>
  <div class="foot">Проєкт Ірини Вознесенської · Instagram @iryna.voznesenskaya</div>
  ${card(770, 70, -3, '#6A5FB8', '#ece9f6', 'Психотерапевт', t['Психологическая помощь'] || 'Психологічна допомога', 'Basel')}
  ${card(822, 240, 2, '#4E9A70', '#e5f1ea', 'Масаж', t['Тело и красота'] || 'Тіло і краса', 'Zürich')}
  ${card(760, 405, -2, '#A99A2E', '#f1eedb', 'Страховий брокер', t['Страхование и пенсия'] || 'Страхування і пенсія', 'St. Gallen')}
  </body></html>`;
}
(async () => {
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const tm = JSON.parse(fs.readFileSync(path.join(__dirname, 'tm_uk.json'), 'utf8'));
  const b = await chromium.launch();
  for (const c of CARDS) {
    const pg = await (await b.newContext({ viewport: { width: 1100, height: 840 } })).newPage();
    await pg.goto(BASE + c.url); await pg.waitForTimeout(1500);
    await pg.evaluate(() => { const l = document.getElementById('langbar'); if (l) l.remove(); document.querySelectorAll('header').forEach(h => { h.style.position = 'static'; }); });
    const el = await pg.$(c.sel); let png;
    if (el) { await el.scrollIntoViewIfNeeded(); await pg.evaluate(s => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 30); }, c.sel); await pg.waitForTimeout(300); }
    png = await pg.screenshot({ type: 'png' });
    const card = await (await b.newContext({ viewport: { width: 1200, height: 630 } })).newPage();
    await card.setContent(`<html><head><meta charset="utf-8">${CSS}</head><body><div class="l"><div class="eb">${c.eyebrow}</div><h1>${c.title}</h1><p>${c.desc}</p><span class="chip">${c.chip}</span></div><div class="foot">svoiludi.ch</div><div class="shot"><img src="data:image/png;base64,${png.toString('base64')}"></div></body></html>`);
    await card.waitForTimeout(600);
    await card.screenshot({ path: path.join(ROOT, c.out), type: 'jpeg', quality: 88 });
    console.log('ok', c.out);
  }
  const m = await (await b.newContext({ viewport: { width: 1200, height: 630 } })).newPage();
  await m.setContent(mainHtml(tm)); await m.waitForTimeout(800);
  await m.screenshot({ path: path.join(ROOT, 'fav/og-svoi-ludi.uk.jpg'), type: 'jpeg', quality: 88 });
  console.log('ok fav/og-svoi-ludi.uk.jpg');
  await b.close(); srv.kill();
})();
