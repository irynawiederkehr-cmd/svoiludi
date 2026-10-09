// Картинки-превью ссылок (og:image) svoiludi.ch — русские и украинские: NODE_PATH=$(npm root -g) node _i18n/og.js [часть пути…]
// Правило Ирины (07.10.2026): у КАЖДОЙ страницы сайта есть своя картинка-превью 1200×630 на обоих языках.
//   У инструментов на превью — пример: снимок заполненного инструмента или страницы готового PDF с примерными данными.
//   Новую страницу сразу добавить сюда (CARDS) и прописать og:image в русской странице; `node _i18n/og.js check` найдёт страницы без превью.
// Пишет {out}.jpg и {out}.uk.jpg. Без аргументов — все картинки; с аргументом — только те, где out содержит эту строку.
// Локальный сервер скрипт поднимает сам. Запускать после python3 _i18n/pages.py, когда страницы или их вид заметно изменились.
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'); const fs = require('fs');
const ROOT = path.resolve(__dirname, '..'); const PORT = 8897; const BASE = `http://localhost:${PORT}`;
const EB = { ru: 'СВОИ ЛЮДИ В ШВЕЙЦАРИИ', uk: 'СВОЇ ЛЮДИ У ШВЕЙЦАРІЇ' };
const TOOLS = { ru: EB.ru + ' · ИНСТРУМЕНТЫ', uk: EB.uk + ' · ІНСТРУМЕНТИ' };
// sel — что снять со страницы; fan — папка с картинками готового PDF (пример), вместо снимка страницы
const CARDS = [
  { out: 'events/og-image', url: '/events/', sel: '.finder',
    ru: { eb: EB.ru, title: 'Встречи рядом с тобой', desc: 'Разговорные клубы, встречи мам, праздники для детей, лекции и ретриты на русском.', chip: 'По всем кантонам' },
    uk: { eb: EB.uk, title: 'Зустрічі поруч із тобою', desc: 'Розмовні клуби, зустрічі мам, свята для дітей, лекції та ретрити російською.', chip: 'По всіх кантонах' } },
  { out: 'kursy/og-image', url: '/kursy/', sel: '#results',
    ru: { eb: EB.ru, title: 'Курсы и занятия на своём языке', desc: 'Йога, немецкий, кружки для детей, мастер-классы и вебинары по кантонам Швейцарии.', chip: 'Видно, кто ведёт каждый курс' },
    uk: { eb: EB.uk, title: 'Курси й заняття своєю мовою', desc: 'Йога, німецька, гуртки для дітей, майстер-класи та вебінари по кантонах Швейцарії.', chip: 'Видно, хто веде кожен курс' } },
  { out: 'instrumenty/og-image', url: '/instrumenty/', sel: '.tools',
    ru: { eb: EB.ru, title: 'Полезные инструменты', desc: 'План дня и года, дневник эмоций, бюджет, учёт времени и часы по клиентам.', chip: 'Бесплатно и на русском' },
    uk: { eb: EB.uk, title: 'Корисні інструменти', desc: 'План дня і року, щоденник емоцій, бюджет, облік часу й години за клієнтами.', chip: 'Безкоштовно й українською' } },
  { out: 'instrumenty/vse-fayly/og-image', url: '/instrumenty/vse-fayly/', sel: '#dom .kg',
    ru: { eb: TOOLS.ru, title: 'Все файлы и инструменты по темам', desc: 'Письма, образцы договоров, протоколы, схемы, расчёты и распечатки — каждый файл со ссылкой.', chip: 'Бесплатно · PDF' },
    uk: { eb: TOOLS.uk, title: 'Усі файли та інструменти за темами', desc: 'Листи, зразки договорів, протоколи, схеми, розрахунки й роздруківки — кожен файл із посиланням.', chip: 'Безкоштовно · PDF' } },
  { out: 'instrumenty/moj-budget/og-image', url: '/instrumenty/moj-budget/', sel: '.panel',
    ru: { eb: TOOLS.ru, title: 'Мой бюджет', desc: 'Все обязательные расходы в Швейцарии, налоги и бюджет для двоих.', chip: 'Бесплатно · PDF' },
    uk: { eb: TOOLS.uk, title: 'Мій бюджет', desc: 'Усі обов’язкові витрати у Швейцарії, податки й бюджет для двох.', chip: 'Безкоштовно · PDF' } },
  { out: 'instrumenty/moj-den/og-image', url: '/instrumenty/moj-den/', sel: '.bar',
    ru: { eb: TOOLS.ru, title: 'Мой день', desc: 'Три главных дела, день по часам, стоп-лист и таймер на 25 минут.', chip: 'Бесплатно · PDF и PNG' },
    uk: { eb: TOOLS.uk, title: 'Мій день', desc: 'Три головні справи, день по годинах, стоп-лист і таймер на 25 хвилин.', chip: 'Безкоштовно · PDF і PNG' } },
  { out: 'instrumenty/moj-god/og-image', url: '/instrumenty/moj-god/', sel: '.panel',
    ru: { eb: TOOLS.ru, title: 'Мой год', desc: 'Повторяющиеся дела и важные сроки на одном листе на весь год.', chip: 'Бесплатно · PDF, PNG и календарь' },
    uk: { eb: TOOLS.uk, title: 'Мій рік', desc: 'Повторювані справи й важливі терміни на одному аркуші на весь рік.', chip: 'Безкоштовно · PDF, PNG і календар' } },
  { out: 'instrumenty/moi-emocii/og-image', url: '/instrumenty/moi-emocii/', sel: '.main',
    ru: { eb: TOOLS.ru, title: 'Мои эмоции', desc: 'Дневник эмоций. Через пару недель видно, что повторяется и что помогает.', chip: 'Бесплатно · записи только у тебя' },
    uk: { eb: TOOLS.uk, title: 'Мої емоції', desc: 'Щоденник емоцій. За кілька тижнів видно, що повторюється і що допомагає.', chip: 'Безкоштовно · записи тільки в тебе' } },
  { out: 'instrumenty/uchet-vremeni/og-image', url: '/instrumenty/uchet-vremeni/', fan: 'instrumenty/preview/uchet-vremeni',
    ru: { eb: TOOLS.ru, title: 'Учёт моего времени', desc: 'Работа, учёба или своё дело за месяц: часы, отпуск, переработка и готовый отчёт.', chip: 'Бесплатно · PDF' },
    uk: { eb: TOOLS.uk, title: 'Облік мого часу', desc: 'Робота, навчання чи власна справа за місяць: години, відпустка, переробка й готовий звіт.', chip: 'Безкоштовно · PDF' } },
  { out: 'instrumenty/chasy-po-klientam/og-image', url: '/instrumenty/chasy-po-klientam/', fan: 'instrumenty/preview/chasy-po-klientam',
    ru: { eb: TOOLS.ru, title: 'Часы по клиентам', desc: 'Для тех, кто работает на себя: часы и заработок по каждому клиенту и отчёт за месяц.', chip: 'Бесплатно · PDF' },
    uk: { eb: TOOLS.uk, title: 'Години за клієнтами', desc: 'Для тих, хто працює на себе: години й заробіток за кожним клієнтом і звіт за місяць.', chip: 'Безкоштовно · PDF' } },
  { out: 'instrumenty/rezyume/og-image', url: '/instrumenty/rezyume/', fan: 'instrumenty/preview/rezyume',
    ru: { eb: TOOLS.ru, title: 'Резюме по-швейцарски', desc: 'Lebenslauf или CV на немецком, французском, итальянском или английском. С фото, пермитом и приложениями.', chip: 'Бесплатно · PDF' },
    uk: { eb: TOOLS.uk, title: 'Резюме по-швейцарськи', desc: 'Lebenslauf або CV німецькою, французькою, італійською чи англійською. З фото, дозволом і додатками.', chip: 'Безкоштовно · PDF' } },
  { out: 'instrumenty/zarplata/og-image', url: '/instrumenty/zarplata/', fan: 'instrumenty/preview/zarplata',
    ru: { eb: TOOLS.ru, title: 'Расчёт зарплаты', desc: 'Почасово или с окладом: взносы, налог у источника и сумма к выплате за месяц.', chip: 'Бесплатно · PDF на русском и немецком' },
    uk: { eb: TOOLS.uk, title: 'Розрахунок зарплати', desc: 'Погодинно чи з окладом: внески, податок у джерела й сума до виплати за місяць.', chip: 'Безкоштовно · PDF українською й німецькою' } },
  { out: 'join/og-image', url: '/join/', sel: '.steps',
    ru: { eb: EB.ru + ' · ДЛЯ СПЕЦИАЛИСТОВ', title: 'Разместиться в справочнике', desc: 'Для тех, кто официально работает в Швейцарии и помогает людям на русском или украинском.', chip: 'В период запуска бесплатно' },
    uk: { eb: EB.uk + ' · ДЛЯ ФАХІВЦІВ', title: 'Розміститися в довіднику', desc: 'Для тих, хто офіційно працює у Швейцарії та допомагає людям російською чи українською.', chip: 'У період запуску безкоштовно' } },
  { out: 'opros/og-image', url: '/opros/', sel: '#form',
    ru: { eb: EB.ru, title: 'Кого вам не хватает?', desc: 'Короткий анонимный опрос о том, каких русскоязычных специалистов не хватает рядом.', chip: 'Одна минута' },
    uk: { eb: EB.uk, title: 'Кого вам бракує?', desc: 'Коротке анонімне опитування про те, яких російськомовних фахівців бракує поруч.', chip: 'Одна хвилина' } },
  { out: 'privacy/og-image', url: '/privacy/', sel: '.wrap',
    ru: { eb: EB.ru, title: 'Политика конфиденциальности', desc: 'Какие данные есть в справочнике и инструментах, где они хранятся и как их удалить.', chip: 'Простыми словами' },
    uk: { eb: EB.uk, title: 'Політика конфіденційності', desc: 'Які дані є в довіднику та інструментах, де вони зберігаються і як їх видалити.', chip: 'Простими словами' } },
];
// Автоматические карточки (09.10.2026): все инструменты и статьи «Как устроена Швейцария», которых нет в списке выше.
// Инструменты — веер страниц готового PDF (instrumenty/preview/<slug>, украинские — …/uk), статьи — снимок начала статьи.
// Заголовок: у инструмента — og:title страницы без хвоста, у статьи — название темы; описание — первое предложение og:description.
(function autoCards() {
  const have = new Set(CARDS.map(c => c.out));
  const meta = (file, prop) => { if (!fs.existsSync(file)) return ''; const m = fs.readFileSync(file, 'utf8').match(new RegExp('property="og:' + prop + '" content="([^"]*)"')); return m ? m[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&') : ''; };
  const first = t => { const m = t.match(/^.{20,140}?[.!?](?=\s|$)/); return m ? m[0] : (t.length > 140 ? t.slice(0, 137).replace(/\s+\S*$/, '') + '…' : t); };
  const clean = t => t.replace(/\s*·\s*(Свои люди|Свої люди|бесплатно|безкоштовно)\s*$/i, '').replace(/\s*·\s*(Свои люди|Свої люди|бесплатно|безкоштовно)\s*$/i, '');
  const gl = {}; const gf = path.join(__dirname, 'GLOSSARY_SHV.md');
  if (fs.existsSync(gf)) for (const l of fs.readFileSync(gf, 'utf8').split('\n')) { const m = l.match(/^\| (.+?) \| (.+?) \|$/); if (m) gl[m[1]] = m[2]; }
  const topics = fs.readFileSync(path.join(__dirname, 'shveycariya_src/topics.py'), 'utf8');
  for (const d of fs.readdirSync(path.join(ROOT, 'instrumenty')).sort()) {
    const out = `instrumenty/${d}/og-image`, ru = path.join(ROOT, 'instrumenty', d, 'index.html'), uk = path.join(ROOT, 'uk/instrumenty', d, 'index.html');
    if (have.has(out) || d === 'preview' || !fs.existsSync(ru) || !fs.existsSync(path.join(ROOT, 'instrumenty/preview', d))) continue;
    CARDS.push({ out, url: `/instrumenty/${d}/`, fan: `instrumenty/preview/${d}`,
      ru: { eb: TOOLS.ru, title: clean(meta(ru, 'title')), desc: first(meta(ru, 'description')), chip: 'Бесплатно · PDF' },
      uk: { eb: TOOLS.uk, title: clean(meta(uk, 'title')), desc: first(meta(uk, 'description')), chip: 'Безкоштовно · PDF' } });
  }
  const SH = { ru: EB.ru + ' · КАК УСТРОЕНА ШВЕЙЦАРИЯ', uk: EB.uk + ' · ЯК ВЛАШТОВАНА ШВЕЙЦАРІЯ' };
  if (fs.existsSync(path.join(ROOT, 'shveycariya/index.html')) && !have.has('shveycariya/og-image'))
    CARDS.push({ out: 'shveycariya/og-image', url: '/shveycariya/', sel: '.s-hero',
      ru: { eb: EB.ru, title: 'Как устроена Швейцария', desc: 'Пермиты, налоги, страховки, школа, работа и жильё — простыми словами, с инструментами и специалистами.', chip: '56 тем · бесплатно' },
      uk: { eb: EB.uk, title: 'Як влаштована Швейцарія', desc: 'Пермити, податки, страховки, школа, робота й житло — простими словами, з інструментами та фахівцями.', chip: '56 тем · безкоштовно' } });
  for (const d of fs.readdirSync(path.join(ROOT, 'shveycariya')).sort()) {
    const out = `shveycariya/${d}/og-image`, ru = path.join(ROOT, 'shveycariya', d, 'index.html'), uk = path.join(ROOT, 'uk/shveycariya', d, 'index.html');
    if (have.has(out) || !fs.existsSync(ru)) continue;
    const m = topics.match(new RegExp("T\\('" + d + "', '[a-z]+', '[^']*', '([^']+)'")); const t = m ? m[1] : clean(meta(ru, 'title'));
    CARDS.push({ out, url: `/shveycariya/${d}/`, sel: 'main',
      ru: { eb: SH.ru, title: t, desc: first(meta(ru, 'description')), chip: 'Простыми словами · бесплатно' },
      uk: { eb: SH.uk, title: gl[t] || clean(meta(uk, 'title')), desc: first(meta(uk, 'description')), chip: 'Простими словами · безкоштовно' } });
  }
})();
// Главная: карта Швейцарии, города связаны нитями, плашки специалистов (вариант A, выбран Ириной 07.10.2026)
const MAIN = {
  out: 'fav/og-svoi-ludi',
  ru: { eb: 'СПРАВОЧНИК · СООБЩЕСТВО', h1a: 'Свои люди', h1b: 'в Швейцарии', p: 'Врачи, юристы, психологи и мастера, которые говорят <nobr>по-русски</nobr> и <nobr>по-украински</nobr>. Рядом с вами, в каждом кантоне.', chips: ['26 кантонов', '12 направлений', 'встречи и события'], pins: ['Психолог', 'Юрист', 'Педиатр', 'Парикмахер', 'Массаж'] },
  uk: { eb: 'ДОВІДНИК · СПІЛЬНОТА', h1a: 'Свої люди', h1b: 'у Швейцарії', p: 'Лікарі, юристи, психологи й майстри, які говорять російською та українською. Поруч із вами, у кожному кантоні.', chips: ['26 кантонів', '12 напрямів', 'зустрічі й події'], pins: ['Психолог', 'Юрист', 'Педіатр', 'Перукар', 'Масаж'] },
};
const CSS = `<link rel="stylesheet" href="${BASE}/assets/fonts.css"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;background:linear-gradient(135deg,#eef1e8,#e6ebdf);font-family:Manrope,system-ui,sans-serif;color:#2f2924;position:relative}
.l{position:absolute;left:64px;top:0;bottom:0;width:520px;display:flex;flex-direction:column;justify-content:center}
.eb{color:#B8862E;font-weight:600;font-size:19px;letter-spacing:.02em;margin-bottom:22px}
h1{font-family:Forum,Georgia,serif;font-weight:400;font-size:62px;line-height:1.08;margin-bottom:22px}
p{font-size:25px;line-height:1.45;color:#4F5E3E;font-weight:600;margin-bottom:28px}
.chip{display:inline-block;border:2px solid #e3d6c3;background:#fffcf8;border-radius:999px;padding:10px 20px;font-size:20px;font-weight:600;align-self:flex-start}
.foot{position:absolute;left:64px;bottom:40px;font-size:20px;color:#4F5E3E;font-weight:600}.foot:before{content:"";display:block;width:64px;height:5px;background:#B8862E;border-radius:3px;margin-bottom:18px}
.shot{position:absolute;left:620px;top:90px;width:600px;height:460px;border-radius:18px;overflow:hidden;transform:rotate(2deg);box-shadow:0 18px 40px rgba(60,50,30,.18);border:6px solid #e7dccb;background:#fffcf8}
.shot img{width:100%;display:block}
.pg{position:absolute;width:330px;border-radius:6px;background:#fff;box-shadow:0 14px 34px rgba(60,50,30,.22);border:1px solid #e7dccb;overflow:hidden}.pg img{width:100%;display:block}</style>`;
function cardHtml(t, visual) {
  return `<html><head><meta charset="utf-8">${CSS}</head><body><div class="l"><div class="eb">${t.eb}</div><h1${t.title.length > 60 ? ' style="font-size:38px"' : t.title.length > 40 ? ' style="font-size:44px"' : t.title.length > 22 ? ' style="font-size:50px"' : ''}>${t.title}</h1><p${t.desc.length > 110 ? ' style="font-size:21px"' : ''}>${t.desc}</p>${t.chip ? `<span class="chip">${t.chip}</span>` : ''}</div><div class="foot">svoiludi.ch</div>${visual}</body></html>`;
}
function fanHtml(imgs) {   // до трёх страниц PDF веером
  const pos = [[610, 115, -8], [725, 72, -1], [840, 100, 6]].slice(-imgs.length);
  return imgs.map((src, i) => `<div class="pg" style="left:${pos[i][0]}px;top:${pos[i][1]}px;transform:rotate(${pos[i][2]}deg)"><img src="data:image/jpeg;base64,${fs.readFileSync(src).toString('base64')}"></div>`).join('');
}
function mainHtml(t) {
  const { d: D, cities: C } = JSON.parse(fs.readFileSync(path.join(__dirname, 'og-switzerland.json'), 'utf8'));
  const ox = 600, oy = 150, P = k => [C[k][0] + ox, C[k][1] + oy];
  const links = [['Genève','Lausanne'],['Lausanne','Fribourg'],['Fribourg','Bern'],['Bern','Neuchâtel'],['Bern','Luzern'],['Basel','Aarau'],['Aarau','Zürich'],['Zürich','Winterthur'],['Winterthur','St. Gallen'],['Zürich','Zug'],['Zug','Luzern'],['Luzern','Lugano'],['St. Gallen','Chur'],['Sion','Lausanne'],['Zürich','Schaffhausen'],['Bern','Sion'],['Chur','Lugano'],['Basel','Bern']];
  const lines = links.map(([a, b]) => { const [x1, y1] = P(a), [x2, y2] = P(b); return `<path d="M${x1} ${y1} Q${(x1 + x2) / 2 + 12} ${(y1 + y2) / 2 - 22} ${x2} ${y2}" fill="none" stroke="#B98324" stroke-width="1.6" stroke-dasharray="4 5" opacity=".75"/>`; }).join('');
  const dots = Object.keys(C).map(k => `<circle cx="${P(k)[0]}" cy="${P(k)[1]}" r="5" fill="#FFFCF8" stroke="#4F5E3E" stroke-width="2.5"/>`).join('');
  const pins = [['Zürich','#6A5FB8','#ECE9F6',-60,-62],['Genève','#2E5A88','#EAF2FA',-10,-70],['Basel','#4E9A70','#E5F1EA',-150,-34],['Lugano','#B05A7A','#F6E7EE',-70,30],['Chur','#B98324','#F3E3C2',-40,40]];
  const tags = pins.map(([k, c, s, dx, dy], i) => {
    const [x, y] = P(k), lab = t.pins[i], w = 56 + lab.length * 12.5;
    return `<circle cx="${x}" cy="${y}" r="8" fill="${c}"/><circle cx="${x}" cy="${y}" r="15" fill="none" stroke="${c}" stroke-width="1.5" opacity=".45"/>
<g transform="translate(${x + dx},${y + dy})"><rect width="${w}" height="46" rx="23" fill="#FFFCF8" stroke="${c}" stroke-width="2" filter="url(#sh)"/><g transform="translate(23,23) scale(.62)"><circle r="30" fill="${s}" stroke="${c}" stroke-width="2.5"/><circle cy="-8" r="9" fill="${c}"/><path d="M-17 20 C-17 4 17 4 17 20 Z" fill="${c}"/></g><text x="48" y="30" font-family="Manrope" font-weight="700" font-size="18" fill="#2F2924">${lab}</text></g>`;
  }).join('');
  const logo = fs.readFileSync(path.join(ROOT, 'fav/logo-svoi-ludi.svg'), 'utf8').replace(/<metadata>[\s\S]*?<\/metadata>/, '');
  return `<html><head><meta charset="utf-8"><link rel="stylesheet" href="${BASE}/assets/fonts.css"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;overflow:hidden;position:relative;font-family:Manrope,sans-serif;background:radial-gradient(circle at 78% 55%,#F7F5EC 0,#EEF1E6 45%,#E3E8D6 100%)}
.eb{position:absolute;left:68px;top:66px;display:flex;align-items:center;gap:14px;color:#B98324;font-weight:800;font-size:18px;letter-spacing:.16em}.eb svg{width:48px;height:48px}
h1{position:absolute;left:66px;top:136px;font-family:Forum,Georgia,serif;font-weight:400;font-size:84px;line-height:.98;color:#2F2924}h1 span{display:block;color:#4F5E3E}
p{position:absolute;left:68px;top:326px;width:500px;font-size:24px;line-height:1.42;color:#5D554D;font-weight:500}
.chips{position:absolute;left:68px;top:478px;display:flex;gap:10px}.chips span{border:1.5px solid #D9DFCB;background:#FFFCF8;border-radius:999px;padding:9px 17px;font-size:18px;font-weight:700;color:#4F5E3E}
.url{position:absolute;left:68px;bottom:40px;font-size:19px;font-weight:700;color:#4F5E3E;display:flex;align-items:center;gap:14px}.url:before{content:"";width:46px;height:4px;border-radius:2px;background:#B98324}
svg.map{position:absolute;left:0;top:0}</style></head><body>
<svg class="map" width="1200" height="630"><defs><filter id="sh" x="-20%" y="-30%" width="140%" height="180%"><feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#3c321e" flood-opacity=".14"/></filter>
<pattern id="dp" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#4F5E3E" opacity=".22"/></pattern></defs>
<g transform="translate(${ox},${oy})"><path d="${D}" fill="#E3E8D6" stroke="#4F5E3E" stroke-width="2.2" stroke-linejoin="round"/><path d="${D}" fill="url(#dp)"/></g>${lines}${dots}${tags}</svg>
<div class="eb">${logo}${t.eb}</div><h1>${t.h1a}<span>${t.h1b}</span></h1><p>${t.p}</p><div class="chips">${t.chips.map(c => `<span>${c}</span>`).join('')}</div><div class="url">svoiludi.ch</div></body></html>`;
}
function check() {   // страницы без og:image
  const miss = [];
  const walk = d => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, f.name);
    if (f.isDirectory()) { if (!/^(\.git|_i18n|node_modules|assets|data|fav|img)$/.test(f.name)) walk(p); }
    else if (f.name === 'index.html') { const h = fs.readFileSync(p, 'utf8'); const m = h.match(/og:image" content="https:\/\/svoiludi\.ch\/([^"]+)"/);
      if (!m) miss.push(path.relative(ROOT, p) + ' — нет og:image'); else if (!fs.existsSync(path.join(ROOT, m[1]))) miss.push(path.relative(ROOT, p) + ' — нет файла ' + m[1]); } } };
  walk(ROOT); console.log(miss.length ? 'Без превью:\n' + miss.join('\n') : 'Превью есть у всех страниц'); process.exitCode = miss.length ? 1 : 0;
}
(async () => {
  if (process.argv[2] === 'check') return check();
  const only = process.argv.slice(2), want = o => !only.length || only.some(s => o.includes(s));
  const srv = spawn('python3', ['-m', 'http.server', String(PORT)], { cwd: ROOT, stdio: 'ignore' });
  await new Promise(r => setTimeout(r, 1200));
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(f => fs.existsSync(f));
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const shoot = async (html, out) => { const pg = await (await b.newContext({ viewport: { width: 1200, height: 630 } })).newPage();
    await pg.setContent(html); await pg.evaluate(() => document.fonts.ready); await pg.waitForTimeout(500);
    await pg.screenshot({ path: path.join(ROOT, out), type: 'jpeg', quality: 88 }); console.log('ok', out); };
  for (const c of CARDS) for (const lang of ['ru', 'uk']) {
    const out = c.out + (lang === 'uk' ? '.uk.jpg' : '.jpg'); if (!want(out)) continue;
    let visual;
    if (c.fan) {
      const dir = path.join(ROOT, c.fan, lang === 'uk' ? 'uk' : '');
      const imgs = fs.readdirSync(dir).filter(f => /^\d+\.jpg$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b)).slice(0, 3).reverse().map(f => path.join(dir, f));
      visual = fanHtml(imgs);
    } else {
      const pg = await (await b.newContext({ viewport: { width: 1100, height: 840 } })).newPage();
      for (let t = 0; t < 3; t++) { try { await pg.goto(BASE + (lang === 'uk' ? '/uk' : '') + c.url, { waitUntil: 'domcontentloaded', timeout: 45000 }); break; } catch (e) { if (t === 2) throw e; } } await pg.waitForTimeout(1500);
      await pg.evaluate(() => { const l = document.getElementById('langbar'); if (l) l.remove(); document.querySelectorAll('header').forEach(h => { h.style.position = 'static'; }); });
      if (await pg.$(c.sel)) await pg.evaluate(s => { const e = document.querySelector(s); window.scrollTo(0, e.getBoundingClientRect().top + window.scrollY - 30); }, c.sel);
      await pg.waitForTimeout(300);
      visual = `<div class="shot"><img src="data:image/png;base64,${(await pg.screenshot({ type: 'png' })).toString('base64')}"></div>`;
    }
    await shoot(cardHtml(c[lang], visual), out);
  }
  for (const lang of ['ru', 'uk']) { const out = MAIN.out + (lang === 'uk' ? '.uk.jpg' : '.jpg'); if (want(out)) await shoot(mainHtml(MAIN[lang]), out); }
  await b.close(); srv.kill();
})();
