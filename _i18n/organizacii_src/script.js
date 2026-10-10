/* Раздел «Организации» (10.10.2026). Данные — data/organizations.js; события и курсы — data/afisha.js (organizers: { org: id }); вакансии и поиск партнёров организации — data/vacancies.js (author: { org: id }).
   Фирмы (kind: 'firm', решение Ирины 10.10.2026, вечер) — на условиях специалистов, руководитель на карточке (head), связь с карточкой специалиста (head.spec). Правила — документ проекта «obshchestvennye-organizacii.md». */
const MAIL = 'voznesenskaya.iryna@gmail.com';
const ORGS = window.ORGANIZATIONS || [];
const AFISHA = window.AFISHA || [];
const VACS = window.VACANCIES || [];
/* Пометка на карточке — только у тех, кто ничего не берёт с людей (o.free === true). Решение Ирины 10.10.2026, 20:15:
   «все те кто принимает деньги должны платить» — фирмы и организации со взносом, платой за занятия, билетами, ценами
   размещаются на условиях специалистов, пометки «бесплатно» у них нет. Добровольные пожертвования не считаются. */
const BADGE = { charity: 'Благотворительная организация · размещение бесплатно', nonprofit: 'Некоммерческая организация · размещение бесплатно' };
const badgeOf = o => o.kind !== 'firm' && o.free === true ? (BADGE[o.kind] || BADGE.nonprofit) : '';
const DISC = 'Карточку заполнила сама организация, она отвечает за её содержание. «Свои люди» не участвуют в работе организации и не отвечают за её помощь, курсы и события. Обо всём договаривайтесь напрямую с организацией.';
const DISC_FIRM = 'Карточку заполнила сама фирма, она отвечает за её содержание. «Свои люди» не участвуют в работе фирмы и не отвечают за её товары, услуги, курсы и события. Обо всём договаривайтесь напрямую с фирмой.';
const VAC_KIND = { staff: 'Ищет сотрудника', partner: 'Ищет партнёра' };
const ICO = {
  help: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-6.5-4.1-8.6-8.3A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.6 5.1C18.5 15.9 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  kids: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5 12 5l9 4.5-9 4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 11.5v4c1.4 1.4 3 2 5 2s3.6-.6 5-2v-4M21 9.5v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  culture: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M14.5 14.3c2.7-.5 5 1.2 5.5 4.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  business: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>',
  food: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 3v7.5M4.5 3v5a2 2 0 0 0 4 0V3M6.5 10.5V21" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M17.5 21V3c-2.2 1.3-3.3 3.6-3.3 6.6V13h3.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  studio: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5l2.4 5 5.4.7-4 3.7 1.1 5.4L12 15.6l-4.9 2.7 1.1-5.4-4-3.7 5.4-.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>'
};
const DIRS = {
  help: { t: 'Помощь и интеграция', c: '#4F5E3E' }, kids: { t: 'Дети и школы', c: '#B98324' },
  culture: { t: 'Общества и культура', c: '#C97E52' }, business: { t: 'Деловые сообщества', c: '#4F6F8F' },
  food: { t: 'Еда и магазины', c: '#A0523D' }, studio: { t: 'Студии и досуг', c: '#7A5A8C' }
};
const KINDS = { npo: 'Благотворительные и некоммерческие', firm: 'Фирмы' };
const WHO = { S: 'Люди со статусом S', kids: 'Дети и подростки', adults: 'Взрослые', women: 'Женщины', business: 'Предприниматели', all: 'Все' };
const FORMS = { 'Verein': 'ферайн (Verein)', 'Stiftung': 'фонд (Stiftung)', 'неформальная группа': 'неформальная группа', 'GmbH': 'ООО (GmbH)', 'AG': 'АО (AG)', 'Einzelunternehmen': 'ИП (Einzelunternehmen)', 'Genossenschaft': 'кооператив (Genossenschaft)', 'другое': 'другая форма' };
const kindLine = o => o.kind === 'firm' ? ['Фирма', FORMS[o.form] || o.form].filter(Boolean).join(' · ') : (FORMS[o.form] || o.form || '');
const CANTONS = {
  'Aargau': ['AG', 'Аргау'], 'Appenzell Ausserrhoden': ['AR', 'Аппенцелль-Ауссерроден'], 'Appenzell Innerrhoden': ['AI', 'Аппенцелль-Иннерроден'],
  'Basel-Landschaft': ['BL', 'Базель-Ланд'], 'Basel-Stadt': ['BS', 'Базель-Штадт'], 'Bern': ['BE', 'Берн'], 'Fribourg': ['FR', 'Фрибур'],
  'Genève': ['GE', 'Женева'], 'Glarus': ['GL', 'Гларус'], 'Graubünden': ['GR', 'Граубюнден'], 'Jura': ['JU', 'Юра'], 'Luzern': ['LU', 'Люцерн'],
  'Neuchâtel': ['NE', 'Невшатель'], 'Nidwalden': ['NW', 'Нидвальден'], 'Obwalden': ['OW', 'Обвальден'], 'Schaffhausen': ['SH', 'Шаффхаузен'],
  'Schwyz': ['SZ', 'Швиц'], 'Solothurn': ['SO', 'Золотурн'], 'St. Gallen': ['SG', 'Санкт-Галлен'], 'Thurgau': ['TG', 'Тургау'], 'Ticino': ['TI', 'Тичино'],
  'Uri': ['UR', 'Ури'], 'Valais': ['VS', 'Вале'], 'Vaud': ['VD', 'Во'], 'Zug': ['ZG', 'Цуг'], 'Zürich': ['ZH', 'Цюрих']
};
const LANG_FIRST = ['украинский', 'русский', 'немецкий', 'французский', 'итальянский', 'английский'];
const MON_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
window.HELP = {
  dir: '<p><b>Помощь и интеграция</b> — центры помощи, консультации, помощь с документами, жильём и работой, курсы языка.</p><p><b>Дети и школы</b> — школы выходного дня, кружки, лагеря, родительские группы.</p><p><b>Общества и культура</b> — общества диаспоры, хоры, танцы, праздники, клубы.</p><p><b>Деловые сообщества</b> — объединения предпринимателей и специалистов, встречи и обмен опытом.</p><p><b>Еда и магазины</b> — рестораны, кафе, кейтеринг, продукты и магазины своих.</p><p><b>Студии и досуг</b> — студии танца, спорта, творчества и красоты, частные курсы и школы.</p>',
  kind: '<p><b>Благотворительная организация</b> помогает людям без прибыли: центр помощи, фонд. <b>Некоммерческая</b> — ферайн или общество без прибыли: школа выходного дня, хор, клуб, деловое общество.</p><p><b>Фирма</b> — коммерческая организация: ресторан, кейтеринг, магазин, студия, частная школа.</p><p>Условия зависят от того, берёт ли организация деньги с людей. Кто всё делает для людей бесплатно, размещается бесплатно всегда. Кто берёт членский взнос, плату за занятия, билеты или цены, — на тех же условиях, что специалисты справочника: до конца 2027 года бесплатно, потом платно.</p>',
  firm: '<p>Фирма зарабатывает на своих товарах и услугах, а ферайн или школа со взносом или платой за занятия собирает деньги с людей. Поэтому они размещаются на тех же условиях, что специалисты справочника. В период запуска, до 31 декабря 2027 года, карточка бесплатна. Потом размещение платное, цены мы сообщим заранее, и ничего не продлевается само. VIP всегда платный и помечен «Платное размещение». Вакансии и поиск партнёров бесплатны для всех и всегда.</p>',
  head: '<p>У фирмы на карточке всегда указан руководитель, чтобы людям было понятно, кто отвечает. Обычно это директор или владелец, как в торговом реестре Zefix. Он подтверждает карточку письмом с адреса фирмы. Если руководитель есть в справочнике специалистов, на обеих карточках будет ссылка друг на друга. Ферайну и фонду указывать руководителя не обязательно.</p>',
  who: '<p>Отметь, для кого ищешь. <b>Статус S</b> — защита для людей из Украины: временное право жить и работать в Швейцарии. Многие центры помощи работают именно для них.</p>',
  zefix: '<p><b>Zefix</b> — официальный торговый реестр Швейцарии, там видно название, адрес и правление организации. Фонд (Stiftung) записан в реестре всегда. Ферайну (Verein) запись нужна не всегда, тогда проверяем по уставу (Statuten) и протоколу собрания.</p>',
  badge: '<p>Организации, которые ничего не берут с людей, мы размещаем бесплатно всегда: помощь, консультации, занятия и события у них бесплатные, а живут они на добровольные пожертвования, гранты и труд добровольцев. Они работают для людей, а не ради денег. Проверка у всех одинаковая.</p>',
  money: '<p>Выберите «Да», если люди платят вам за что-нибудь: членский взнос, плату за занятия, школу, курс или лагерь, билеты на события, цены за товары и услуги. Добровольные пожертвования не считаются.</p><p>Кто ничего не берёт с людей, размещается бесплатно всегда. Кто берёт — на тех же условиях, что специалисты справочника: до конца 2027 года бесплатно, потом платно, цены мы сообщим заранее.</p>',
  form: '<p><b>Ферайн (Verein)</b> — объединение людей с общей целью: общество, клуб, школа, центр помощи. Для него хватает устава и собрания. <b>Фонд (Stiftung)</b> — организация с имуществом для определённой цели, всегда записана в торговом реестре и под надзором.</p><p><b>ООО (GmbH), АО (AG), ИП (Einzelunternehmen), кооператив (Genossenschaft)</b> — формы фирмы. Фирма записана в торговом реестре Zefix, там видно её название, адрес и руководство.</p>',
  whoForm: '<p>Отметьте, для кого вы работаете. По этим отметкам люди находят организацию в фильтре «Для кого». <b>Статус S</b> — защита для людей из Украины: временное право жить и работать в Швейцарии.</p>',
  board: '<p>Карточку мы публикуем только с согласия самой организации. Поэтому её подтверждает член правления (Vorstand) ферайна или фонда или руководитель фирмы ответным письмом с адреса организации. Имя члена правления на сайте не показываем. Имя и должность руководителя фирмы стоят на её карточке.</p>'
};

const today = new Date().toISOString().slice(0, 10);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kt = c => (CANTONS[c] || [c])[0];
const ktRu = c => (CANTONS[c] || [, c])[1];
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c;
const ext = 'target="_blank" rel="noopener"';
const fmtDate = x => { const [y, m, d] = x.split('-').map(Number); return `${d} ${MON_G[m - 1]} ${y}`; };
const oUrl = o => 'https://svoiludi.ch/organizacii/#' + o.id;
function toast(t){ const el = document.getElementById('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 5000); }
const copyText = t => { try { return navigator.clipboard.writeText(t).then(() => true, () => false); } catch (_) { return Promise.resolve(false); } };

const confirmed = o => !!(o.confirm && o.confirm.date);
const pool = () => ORGS.filter(o => o.status === 'активен' && confirmed(o));
const state = { dir: '', canton: '', lang: '', who: '', fee: '', kind: '' };
const isFree = o => /бесплатно|безкоштовно|kostenlos|gratuit|gratis/i.test(o.fee || '');   // fee в украинской копии данных переведён
function match(o, skip){
  return (skip === 'dir' || !state.dir || o.dir === state.dir)
    && (skip === 'canton' || !state.canton || o.canton === state.canton)
    && (skip === 'lang' || !state.lang || (o.langs || []).includes(state.lang))
    && (skip === 'who' || !state.who || (o.for || []).includes(state.who) || (o.for || []).includes('all'))
    && (skip === 'fee' || !state.fee || isFree(o))
    && (skip === 'kind' || !state.kind || (state.kind === 'firm' ? o.kind === 'firm' : o.kind !== 'firm'));
}
const where = o => [(o.cities || []).join(', '), o.canton ? kt(o.canton) : ''].filter(Boolean).join(' · ');
const lastDay = e => (e.repeat && e.repeat.until) || e.dateEnd || e.date || '';
const vacsOf = o => VACS.filter(v => v.author && typeof v.author === 'object' && v.author.org === o.id && v.status === 'активен' && v.confirm && v.confirm.date && (!v.until || v.until > today));
const eventsOf = o => AFISHA.filter(e => e.status !== 'закрыто' && (e.organizers || []).some(x => x && typeof x === 'object' && x.org === o.id) && (!lastDay(e) || lastDay(e) >= today));

function row(o){
  const d = DIRS[o.dir] || DIRS.help;
  return `<button class="ev vac org-row" type="button" data-o="${esc(o.id)}" style="--lc:${d.c}">${o.sample ? '<span class="sample">Образец</span>' : ''}
    <span class="ev-d vk"><b>${ICO[o.dir] || ICO.help}</b><small>${esc(d.t)}</small></span>
    <span class="ev-m">${o.sample ? '<span class="yours">Здесь может быть ваша организация!</span>' : ''}<span class="ev-k">${esc(kindLine(o))}</span><span class="ev-t">${esc(o.name)}</span>
      <span class="ev-i"><span>${esc(where(o))}</span><span>${esc((o.langs || []).join(', '))}</span>${o.fee ? `<span>${esc(o.fee)}</span>` : ''}${o.kind === 'firm' && o.head && o.head.name ? `<span>руководитель: ${esc(o.head.name)}</span>` : ''}</span>
      ${badgeOf(o) ? `<span class="free-line">${esc(badgeOf(o))}</span>` : ''}</span></button>`;
}
function render(){
  const list = pool().filter(o => match(o)).sort((a, b) => (a.sample ? 1 : 0) - (b.sample ? 1 : 0) || a.name.localeCompare(b.name, 'ru'));
  const box = document.getElementById('results');
  box.innerHTML = list.length ? `<div class="group">${list.map(row).join('')}</div>`
    : `<div class="empty"><b>${pool().length ? 'По этому выбору организаций пока нет' : 'Пока организаций нет'}</b><span>${pool().length ? 'Раздел только открылся и пополняется. Попробуй убрать часть выбора.' : 'Раздел только открылся. Знаешь организацию, которая помогает своим? Расскажи ей о «Своих людях» — размещение бесплатное.'}</span><a class="btn" href="#add">Как разместить организацию</a></div>`;
  const real = list.filter(o => !o.sample).length;
  document.getElementById('count').textContent = real ? `${real} ${plural(real, 'организация', 'организации', 'организаций')}` : list.length ? 'Пока организаций нет · ниже образец карточки' : '';
  document.getElementById('reset').hidden = !Object.values(state).some(Boolean);
  Object.keys(state).forEach(id => document.getElementById(id).classList.toggle('set', !!state[id]));
  fillSelects();
}
function fillSelects(){
  const opt = (v, t, n) => `<option value="${esc(v)}">${esc(t)}${n === undefined ? '' : ' · ' + n}</option>`, all = pool().filter(o => !o.sample);
  const d = document.getElementById('dir'), b1 = all.filter(o => match(o, 'dir'));
  d.innerHTML = opt('', 'Все направления', b1.length) + Object.entries(DIRS).map(([id, x]) => opt(id, x.t, b1.filter(o => o.dir === id).length)).join(''); d.value = state.dir;
  const cs = document.getElementById('canton');
  cs.innerHTML = opt('', 'Все кантоны') + Object.keys(CANTONS).sort((a, b) => ktRu(a).localeCompare(ktRu(b), 'ru')).map(x => { const n = all.filter(o => o.canton === x).length; return opt(x, `${ktRu(x)} (${kt(x)})${n ? ' · ' + n : ''}`); }).join(''); cs.value = state.canton;
  const ls = document.getElementById('lang'), langs = [...new Set(all.flatMap(o => o.langs || []).concat(LANG_FIRST.slice(0, 3)))].sort((a, b) => (LANG_FIRST.indexOf(a) + 1 || 99) - (LANG_FIRST.indexOf(b) + 1 || 99));
  ls.innerHTML = opt('', 'Любой язык') + langs.map(l => opt(l, l[0].toUpperCase() + l.slice(1))).join(''); ls.value = state.lang;
  const w = document.getElementById('who');
  w.innerHTML = opt('', 'Для всех') + Object.entries(WHO).filter(([id]) => id !== 'all').map(([id, t]) => opt(id, t)).join(''); w.value = state.who;
  const kd = document.getElementById('kind'), b6 = all.filter(o => match(o, 'kind'));
  kd.innerHTML = opt('', 'Все организации', b6.length) + Object.entries(KINDS).map(([id, t]) => opt(id, t, b6.filter(o => id === 'firm' ? o.kind === 'firm' : o.kind !== 'firm').length)).join(''); kd.value = state.kind;
}

/* ---------- окно организации ---------- */
const qm = document.getElementById('qm');
let OPEN = null;
function contactLinks(o){
  const c = o.contacts || {}, out = [];
  if (c.site) out.push(`<a class="btn" href="${esc(c.site)}" ${ext}>Сайт организации</a>`);
  if (c.telegram) out.push(`<a class="btn${out.length ? ' ghost' : ''}" href="https://t.me/${esc(c.telegram.replace(/^@/, ''))}" ${ext}>Telegram</a>`);
  if (c.email) out.push(`<a class="btn${out.length ? ' ghost' : ''}" href="mailto:${esc(c.email)}">Написать письмо</a>`);
  if (c.instagram) out.push(`<a class="btn ghost" href="${esc(c.instagram)}" ${ext}>Instagram</a>`);
  if (c.facebook) out.push(`<a class="btn ghost" href="${esc(c.facebook)}" ${ext}>Facebook</a>`);
  if (c.phone) out.push(`<a class="btn ghost" href="tel:${esc(c.phone.replace(/\s/g, ''))}">${esc(c.phone)}</a>`);
  return out.join('');
}
function openO(id){
  const o = ORGS.find(x => x.id === id); if (!o) return; OPEN = o;
  const d = DIRS[o.dir] || DIRS.help, box = document.getElementById('qmCard'), evs = eventsOf(o);
  box.style.setProperty('--lc', d.c); box.style.setProperty('--lf', `color-mix(in srgb,${d.c} 12%,var(--paper))`);
  box.innerHTML = `<div class="qm-top"><div class="qm-head">${o.sample ? '<span class="ev-k" style="color:var(--brown)">Образец карточки · всё вымышленное</span><a class="yours" href="#add" data-close>Здесь может быть ваша организация! Как разместить →</a>' : ''}<span class="ev-k" style="color:${d.c}">${esc(d.t)}</span><h2 class="qm-title" id="qmTitle">${esc(o.name)}</h2>${o.name_ru ? `<span class="note">${esc(o.name_ru)}</span>` : ''}${badgeOf(o) ? `<span class="free-line">${esc(badgeOf(o))}<button type="button" class="qh" data-help="badge" aria-label="Подсказка: размещение бесплатно" aria-expanded="false">?</button></span>` : ''}</div><button class="qm-close" type="button" aria-label="Закрыть">×</button></div>
    <div class="d-body">
      <div class="d-col">
        <div class="d-block"><h4>Что делает организация</h4><p>${esc(o.about)}</p></div>
        ${(o.offers || []).length ? `<div class="d-block"><h4>Что можно получить</h4><ul class="marks">${o.offers.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        ${(o.for || []).length ? `<div class="d-block"><h4>Для кого</h4><div class="chips">${o.for.map(x => `<span>${esc(WHO[x] || x)}</span>`).join('')}</div></div>` : ''}
        <div class="d-block"><h4>Языки</h4><div class="chips">${(o.langs || []).map(l => `<span>${esc(l)}</span>`).join('')}</div></div>
        ${o.join ? `<div class="d-block"><h4>Как прийти или записаться</h4><p>${esc(o.join)}</p></div>` : ''}
        ${(() => { const vs = vacsOf(o); if (!vs.length) return '';
          const grp = k => { const g = vs.filter(v => v.kind === k); return g.length ? `<h4>${VAC_KIND[k]}</h4><ul class="marks">${g.map(v => `<li><a href="../vakansii/#${esc(v.id)}">${esc(v.title)} →</a>${v.sample ? ' <small>образец</small>' : ''}</li>`).join('')}</ul>` : ''; };
          return `<div class="d-block">${grp('staff')}${grp('partner')}<p class="note"><b>Бесплатно, для поддержки сообщества «Свои люди». Не коммерческая услуга.</b> Объявления размещает сама организация и отвечает за их содержание. «Свои люди» не участвуют в найме и сотрудничестве, договаривайтесь напрямую с автором.</p></div>`; })()}
        ${evs.length ? `<div class="d-block"><h4>События и курсы</h4>${evs.map(e => `<p><a href="../${(e.sections || []).includes('kursy') && !(e.sections || []).includes('events') ? 'kursy' : 'events'}/#${esc(e.id)}">${esc(e.title)} →</a></p>`).join('')}</div>` : ''}
      </div>
      <div class="d-side">
        <div class="d-block"><h4>Где</h4><span>${esc(where(o)) || '—'}</span>${o.address ? `<p class="note">${esc(o.address)}</p>` : ''}</div>
        ${o.head && o.head.name ? `<div class="d-block"><h4>Руководитель<button type="button" class="qh" data-help="head" aria-label="Подсказка: руководитель" aria-expanded="false">?</button></h4><span>${esc(o.head.name)}${o.head.role ? ' · ' + esc(o.head.role) : ''}</span>${o.head.spec ? `<p><a href="../#${esc(o.head.spec)}">Карточка в справочнике →</a></p>` : ''}</div>` : ''}
        <div class="d-block"><h4>Форма<button type="button" class="qh" data-help="form" aria-label="Подсказка: ферайн и фонд" aria-expanded="false">?</button></h4><span>${esc(FORMS[o.form] || o.form || '—')}</span></div>
        ${o.fee ? `<div class="d-block"><h4>${o.kind === 'firm' ? 'Цены' : 'Взнос'}</h4><span>${esc(o.fee)}</span></div>` : ''}
        ${o.checked ? `<div class="d-block"><h4>Проверено</h4><span>${esc(o.zefix && /^CHE/.test(o.zefix) ? 'запись в Zefix ' + o.zefix : o.zefix === 'устав' ? 'по уставу' : 'проверка «Своих людей»')} · ${esc(fmtDate(o.checked))}</span>${confirmed(o) && !o.sample ? `<p class="note">Данные подтвердила организация ${esc(fmtDate(o.confirm.date))}.</p>` : ''}</div>` : ''}
        <div class="disc-box"><b>Важно</b><p>${esc(o.kind === 'firm' ? DISC_FIRM : DISC)}</p>${badgeOf(o) ? `<p class="free-line">${esc(badgeOf(o))}</p>` : ''}</div>
        <div class="acts">${contactLinks(o)}<button class="btn ghost" type="button" data-share>Поделиться</button></div>
        <p class="note"><a href="#terms" data-close>Условия раздела</a>. <a href="mailto:${MAIL}?subject=${encodeURIComponent('Сообщить об ошибке: ' + o.name)}&body=${encodeURIComponent(oUrl(o) + '\n\n')}">Сообщить об ошибке</a></p>
      </div>
    </div>`;
  box.querySelector('.qm-close').onclick = () => qm.close();
  if (!qm.open) qm.showModal();
  if (location.hash.slice(1) !== o.id) history.replaceState(null, '', '#' + o.id);
}
document.getElementById('qmCard').addEventListener('click', async ev => {
  if (ev.target.closest('[data-close]')) qm.close();
  if (OPEN && ev.target.closest('[data-share]')){ const url = oUrl(OPEN), title = OPEN.name;
    if (navigator.share){ try { await navigator.share({ title, text: title + ' · Свои люди в Швейцарии', url }); return; } catch (err){ if (err && err.name === 'AbortError') return; } }
    toast((await copyText(url)) ? 'Ссылка на организацию скопирована.' : url); }
});
qm.addEventListener('click', e => { if (e.target === qm) qm.close(); });
qm.addEventListener('close', () => { if (location.hash && location.hash !== '#add' && location.hash !== '#terms') history.replaceState(null, '', location.pathname + location.search); });

/* ---------- заявка организации на сайте (решение Ирины 10.10.2026: «пусть регистрируются на сайте сразу или пишут на мейл») ----------
   Форма ничего не отправляет сама: «Отправить заявку» открывает готовое письмо на MAIL. Черновик — только в браузере (ключ svoi-org-zayavka). */
const OKEY = 'svoi-org-zayavka';
const oF = document.getElementById('orgForm'), oMsg = document.getElementById('orgMsg'), oDraft = document.getElementById('orgDraft');
const oOpt = (v, t) => `<option value="${esc(v)}">${esc(t)}</option>`;
const oChk = (name, v, t) => `<label><input type="checkbox" name="${name}" value="${esc(v)}">${esc(t)}</label>`;
document.getElementById('o-kind').innerHTML = oOpt('', 'Выберите вид') + oOpt('благотворительная организация', 'Благотворительная организация') + oOpt('некоммерческая организация', 'Некоммерческий ферайн или общество') + oOpt('фирма', 'Фирма: ресторан, магазин, студия, частная школа');
document.getElementById('o-money').innerHTML = oOpt('', 'Выберите ответ') + oOpt('нет', 'Нет: для людей всё бесплатно, только добровольные пожертвования') + oOpt('да', 'Да: взнос, плата за занятия, школу или курс, билеты, цены');
document.getElementById('o-kind').addEventListener('change', e => { if (e.target.value === 'фирма') document.getElementById('o-money').value = 'да'; });
document.getElementById('o-dir').innerHTML = oOpt('', 'Выберите направление') + Object.values(DIRS).map(x => oOpt(x.t, x.t)).join('');
document.getElementById('o-canton').innerHTML = oOpt('', 'Выберите кантон') + Object.keys(CANTONS).sort((a, b) => ktRu(a).localeCompare(ktRu(b), 'ru')).map(x => oOpt(`${ktRu(x)} (${kt(x)})`, `${ktRu(x)} (${kt(x)})`)).join('') + oOpt('Вся Швейцария', 'Вся Швейцария');
document.getElementById('o-who').innerHTML = Object.entries(WHO).map(([, t]) => oChk('o-who', t, t)).join('');
document.getElementById('o-langs').innerHTML = LANG_FIRST.map(l => oChk('o-lang', l, l[0].toUpperCase() + l.slice(1))).join('');
const oChecked = name => [...oF.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
function oSave(){ try { const d = {}; oF.querySelectorAll('[data-a]').forEach(el => d[el.id] = el.value); d.who = oChecked('o-who'); d.langs = oChecked('o-lang'); localStorage.setItem(OKEY, JSON.stringify(d)); } catch (_) {} }
try { const d = JSON.parse(localStorage.getItem(OKEY) || 'null'); if (d) {
  oF.querySelectorAll('[data-a]').forEach(el => { if (typeof d[el.id] === 'string') el.value = d[el.id]; });
  (d.who || []).forEach(v => { const i = oF.querySelector(`input[name="o-who"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; });
  (d.langs || []).forEach(v => { const i = oF.querySelector(`input[name="o-lang"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; }); } } catch (_) {}
oF.addEventListener('input', oSave); oF.addEventListener('change', oSave);
const oDraftIdle = () => { oDraft.innerHTML = 'Всё, что вы ввели, сохраняется только на этом устройстве, пока вы сами не отправите заявку. Можно закрыть страницу и продолжить позже. <button class="lnk" type="button" id="oWipe">Удалить историю</button>'; };
oDraftIdle();
oDraft.addEventListener('click', e => { const id = e.target.id;
  if (id === 'oWipe') oDraft.innerHTML = 'Удалить с этого устройства всё, что вы ввели в заявку? Вернуть это будет нельзя. <button class="lnk" type="button" id="oWipeYes">Да, удалить историю</button><button class="lnk" type="button" id="oWipeNo">Отмена</button>';
  if (id === 'oWipeNo') oDraftIdle();
  if (id === 'oWipeYes'){ try { localStorage.removeItem(OKEY); } catch (_) {} oF.querySelectorAll('[data-a]').forEach(el => el.value = ''); oF.querySelectorAll('input[type=checkbox]').forEach(i => i.checked = false); oMsg.hidden = true; oDraftIdle(); toast('Вся история заявки удалена с этого устройства.'); }
});
function oLetter(){
  const lines = [], name = document.getElementById('o-name').value.trim();
  oF.querySelectorAll('.f').forEach(f => {
    const el = f.querySelector('[data-a]'), box = f.querySelector('.chk');
    if (el){ const x = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].text : '') : el.value.trim(); if (x) lines.push(`${el.dataset.a}: ${x}`); }
    else if (box){ const x = [...box.querySelectorAll('input:checked')].map(i => i.parentNode.textContent.trim()); if (x.length) lines.push(`${box.dataset.l}: ${x.join(', ')}`); }
  });
  const su = 'Заявка организации в «Своих людях»' + (name ? ' — ' + name : '');
  const firm = document.getElementById('o-kind').value === 'фирма', free = !firm && document.getElementById('o-money').value === 'нет';
  const body = [firm ? 'Здравствуйте! Мы хотим разместить нашу фирму в «Своих людях».' : free ? 'Здравствуйте! Мы хотим бесплатно разместить нашу организацию в «Своих людях». Для людей у нас всё бесплатно.' : 'Здравствуйте! Мы хотим разместить нашу организацию в «Своих людях».', '', ...lines, '', 'Заявка заполнена на странице https://svoiludi.ch/organizacii/', ''].join('\n');
  return { su, body };
}
document.getElementById('orgSend').addEventListener('click', () => {
  const firmK = document.getElementById('o-kind').value === 'фирма';
  const need = [['o-kind', 'вид организации'], ['o-name', 'название организации'], ['o-form', 'форму организации'], ['o-about', 'что вы делаете'], ['o-canton', 'кантон'], ['o-email', 'e-mail организации'], ['o-board', 'кто подтвердит карточку']].concat(firmK ? [['o-uid', 'номер UID фирмы'], ['o-head', 'руководителя фирмы']] : [['o-money', 'берёте ли вы деньги с людей']]);
  const miss = need.filter(([id]) => !document.getElementById(id).value.trim());
  oF.querySelectorAll('.f').forEach(f => f.classList.remove('miss')); miss.forEach(([id]) => document.getElementById(id).closest('.f').classList.add('miss'));
  if (miss.length){ oMsg.hidden = false; oMsg.textContent = 'Пожалуйста, заполните: ' + miss.map(m => m[1]).join(', ') + '.'; document.getElementById(miss[0][0]).focus(); return; }
  const mailOk = x => !x || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
  const badMail = ['o-email', 'o-board-mail'].find(id => !mailOk(document.getElementById(id).value.trim()));
  if (badMail){ document.getElementById(badMail).closest('.f').classList.add('miss'); oMsg.hidden = false; oMsg.textContent = 'Проверьте e-mail: в адресе не хватает знака @ или точки.'; document.getElementById(badMail).focus(); return; }
  const L = oLetter(), q = `?subject=${encodeURIComponent(L.su)}&body=${encodeURIComponent(L.body)}`;
  const gm = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAIL)}&su=${encodeURIComponent(L.su)}&body=${encodeURIComponent(L.body)}`;
  oMsg.hidden = false;
  oMsg.innerHTML = `Открылось письмо с вашей заявкой на ${esc(MAIL)}. Проверьте его и нажмите «Отправить» в своей почте. Письмо не открылось? <a href="${esc(gm)}" ${ext}>Открыть в Gmail</a> или <button class="lnk" type="button" id="oCopy">скопировать заявку</button> и отправить её на ${esc(MAIL)}.`;
  location.href = `mailto:${MAIL}${q}`;
});
oMsg.addEventListener('click', async e => { if (e.target.id !== 'oCopy') return; const L = oLetter();
  toast((await copyText(L.su + '\n\n' + L.body)) ? 'Заявка скопирована. Вставьте её в письмо на ' + MAIL + '.' : 'Не получилось скопировать. Напишите нам на ' + MAIL + '.'); });

/* ---------- события страницы ---------- */
document.getElementById('results').addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (b) openO(b.dataset.o); });
['dir', 'canton', 'lang', 'who', 'fee', 'kind'].forEach(id => document.getElementById(id).addEventListener('change', e => { state[id] = e.target.value; render(); }));
document.getElementById('reset').addEventListener('click', () => { Object.keys(state).forEach(k => state[k] = ''); document.getElementById('fee').value = ''; render(); });
render();
const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id && ORGS.some(o => o.id === id && o.status === 'активен' && confirmed(o))) openO(id); };
fromHash(); addEventListener('hashchange', fromHash);
