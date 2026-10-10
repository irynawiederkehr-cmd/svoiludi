/* Раздел «Организации» (10.10.2026, копия). Данные — data/organizations.js; события и курсы — data/afisha.js (organizers: { org: id }),
   поиск волонтёров — data/vacancies.js (kind: 'volunteer', author: { org: id }). Правила — документ проекта «obshchestvennye-organizacii.md». */
const MAIL = 'voznesenskaya.iryna@gmail.com';
const ORGS = window.ORGANIZATIONS || [];
const AFISHA = window.AFISHA || [];
const VACS = window.VACANCIES || [];
/* Пометка на карточке — везде и всегда (решение Ирины 10.10.2026: некоммерческим бесплатно навсегда) */
const BADGE = { charity: 'Благотворительная организация · размещение бесплатно', nonprofit: 'Некоммерческая организация · размещение бесплатно' };
const DISC = 'Карточку заполнила сама организация, она отвечает за её содержание. «Свои люди» не участвуют в работе организации и не отвечают за её помощь, курсы и события. Обо всём договаривайтесь напрямую с организацией.';
const ICO = {
  help: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-6.5-4.1-8.6-8.3A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.6 5.1C18.5 15.9 12 20 12 20z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 12h7M12 8.5v7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  kids: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9.5 12 5l9 4.5-9 4.5z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M7 11.5v4c1.4 1.4 3 2 5 2s3.6-.6 5-2v-4M21 9.5v5" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  culture: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.7"/><circle cx="16.5" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M2.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5M14.5 14.3c2.7-.5 5 1.2 5.5 4.7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>',
  business: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="7.5" width="17" height="12" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17" fill="none" stroke="currentColor" stroke-width="1.7"/></svg>'
};
const DIRS = {
  help: { t: 'Помощь и интеграция', c: '#4F5E3E' }, kids: { t: 'Дети и школы', c: '#B98324' },
  culture: { t: 'Общества и культура', c: '#C97E52' }, business: { t: 'Деловые сообщества', c: '#4F6F8F' }
};
const WHO = { S: 'Люди со статусом S', kids: 'Дети и подростки', adults: 'Взрослые', women: 'Женщины', business: 'Предприниматели', all: 'Все' };
const FORMS = { 'Verein': 'ферайн (Verein)', 'Stiftung': 'фонд (Stiftung)', 'неформальная группа': 'неформальная группа', 'другое': 'другая форма' };
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
  dir: '<p><b>Помощь и интеграция</b> — центры помощи, консультации, помощь с документами, жильём и работой, курсы языка.</p><p><b>Дети и школы</b> — школы выходного дня, кружки, лагеря, родительские группы.</p><p><b>Общества и культура</b> — общества диаспоры, хоры, танцы, праздники, клубы.</p><p><b>Деловые сообщества</b> — объединения предпринимателей и специалистов, встречи и обмен опытом.</p>',
  who: '<p>Отметь, для кого ищешь. <b>Статус S</b> — защита для людей из Украины: временное право жить и работать в Швейцарии. Многие центры помощи работают именно для них.</p>',
  zefix: '<p><b>Zefix</b> — официальный торговый реестр Швейцарии, там видно название, адрес и правление организации. Фонд (Stiftung) записан в реестре всегда. Ферайну (Verein) запись нужна не всегда, тогда проверяем по уставу (Statuten) и протоколу собрания.</p>',
  badge: '<p>Некоммерческие организации — благотворительные фонды и ферайны без прибыли — мы размещаем бесплатно всегда, потому что они работают для людей, а не ради прибыли. Проверка у всех одинаковая.</p>',
  form: '<p><b>Ферайн (Verein)</b> — объединение людей с общей целью: общество, клуб, школа, центр помощи. Для него хватает устава и собрания. <b>Фонд (Stiftung)</b> — организация с имуществом для определённой цели, всегда записана в торговом реестре и под надзором.</p>'
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
const state = { dir: '', canton: '', lang: '', who: '', fee: '' };
const isFree = o => /бесплатно|безкоштовно|kostenlos|gratuit|gratis/i.test(o.fee || '');   // fee в украинской копии данных переведён
function match(o, skip){
  return (skip === 'dir' || !state.dir || o.dir === state.dir)
    && (skip === 'canton' || !state.canton || o.canton === state.canton)
    && (skip === 'lang' || !state.lang || (o.langs || []).includes(state.lang))
    && (skip === 'who' || !state.who || (o.for || []).includes(state.who) || (o.for || []).includes('all'))
    && (skip === 'fee' || !state.fee || isFree(o));
}
const where = o => [(o.cities || []).join(', '), o.canton ? kt(o.canton) : ''].filter(Boolean).join(' · ');
const lastDay = e => (e.repeat && e.repeat.until) || e.dateEnd || e.date || '';
const eventsOf = o => AFISHA.filter(e => e.status !== 'закрыто' && (e.organizers || []).some(x => x && typeof x === 'object' && x.org === o.id) && (!lastDay(e) || lastDay(e) >= today));
const volsOf = o => VACS.filter(v => v.kind === 'volunteer' && v.author && typeof v.author === 'object' && v.author.org === o.id && v.status === 'активен' && v.confirm && v.confirm.date && (!v.until || v.until > today));

function row(o){
  const d = DIRS[o.dir] || DIRS.help;
  return `<button class="ev vac org-row" type="button" data-o="${esc(o.id)}" style="--lc:${d.c}">${o.sample ? '<span class="sample">Образец</span>' : ''}
    <span class="ev-d vk"><b>${ICO[o.dir] || ICO.help}</b><small>${esc(d.t)}</small></span>
    <span class="ev-m">${o.sample ? '<span class="yours">Здесь может быть ваша организация!</span>' : ''}<span class="ev-k">${esc(FORMS[o.form] || o.form || '')}</span><span class="ev-t">${esc(o.name)}</span>
      <span class="ev-i"><span>${esc(where(o))}</span><span>${esc((o.langs || []).join(', '))}</span>${o.fee ? `<span>${esc(o.fee)}</span>` : ''}</span>
      <span class="free-line">${esc(BADGE[o.kind] || BADGE.nonprofit)}</span></span></button>`;
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
  const d = DIRS[o.dir] || DIRS.help, box = document.getElementById('qmCard'), evs = eventsOf(o), vols = volsOf(o);
  box.style.setProperty('--lc', d.c); box.style.setProperty('--lf', `color-mix(in srgb,${d.c} 12%,var(--paper))`);
  box.innerHTML = `<div class="qm-top"><div class="qm-head">${o.sample ? '<span class="ev-k" style="color:var(--brown)">Образец карточки · всё вымышленное</span><a class="yours" href="#add" data-close>Здесь может быть ваша организация! Как разместить →</a>' : ''}<span class="ev-k" style="color:${d.c}">${esc(d.t)}</span><h2 class="qm-title" id="qmTitle">${esc(o.name)}</h2>${o.name_ru ? `<span class="note">${esc(o.name_ru)}</span>` : ''}<span class="free-line">${esc(BADGE[o.kind] || BADGE.nonprofit)}<button type="button" class="qh" data-help="badge" aria-label="Подсказка: размещение бесплатно" aria-expanded="false">?</button></span></div><button class="qm-close" type="button" aria-label="Закрыть">×</button></div>
    <div class="d-body">
      <div class="d-col">
        <div class="d-block"><h4>Что делает организация</h4><p>${esc(o.about)}</p></div>
        ${(o.offers || []).length ? `<div class="d-block"><h4>Что можно получить</h4><ul class="marks">${o.offers.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
        ${(o.for || []).length ? `<div class="d-block"><h4>Для кого</h4><div class="chips">${o.for.map(x => `<span>${esc(WHO[x] || x)}</span>`).join('')}</div></div>` : ''}
        <div class="d-block"><h4>Языки</h4><div class="chips">${(o.langs || []).map(l => `<span>${esc(l)}</span>`).join('')}</div></div>
        ${o.join ? `<div class="d-block"><h4>Как прийти или записаться</h4><p>${esc(o.join)}</p></div>` : ''}
        ${o.volunteer || vols.length ? `<div class="d-block"><h4>Как стать волонтёром</h4>${o.volunteer ? `<p>${esc(o.volunteer)}</p>` : ''}${vols.map(v => `<p><a href="../vakansii/#${esc(v.id)}">${esc(v.title)} →</a></p>`).join('')}</div>` : ''}
        ${evs.length ? `<div class="d-block"><h4>События и курсы</h4>${evs.map(e => `<p><a href="../${(e.sections || []).includes('kursy') && !(e.sections || []).includes('events') ? 'kursy' : 'events'}/#${esc(e.id)}">${esc(e.title)} →</a></p>`).join('')}</div>` : ''}
      </div>
      <div class="d-side">
        <div class="d-block"><h4>Где</h4><span>${esc(where(o)) || '—'}</span>${o.address ? `<p class="note">${esc(o.address)}</p>` : ''}</div>
        <div class="d-block"><h4>Форма<button type="button" class="qh" data-help="form" aria-label="Подсказка: ферайн и фонд" aria-expanded="false">?</button></h4><span>${esc(FORMS[o.form] || o.form || '—')}</span></div>
        ${o.fee ? `<div class="d-block"><h4>Взнос</h4><span>${esc(o.fee)}</span></div>` : ''}
        ${o.checked ? `<div class="d-block"><h4>Проверено</h4><span>${esc(o.zefix && /^CHE/.test(o.zefix) ? 'запись в Zefix ' + o.zefix : o.zefix === 'устав' ? 'по уставу' : 'проверка «Своих людей»')} · ${esc(fmtDate(o.checked))}</span>${confirmed(o) && !o.sample ? `<p class="note">Данные подтвердила организация ${esc(fmtDate(o.confirm.date))}.</p>` : ''}</div>` : ''}
        <div class="disc-box"><b>Важно</b><p>${esc(DISC)}</p><p class="free-line">${esc(BADGE[o.kind] || BADGE.nonprofit)}</p></div>
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

/* «Скопировать шаблон» для заявки Ирине (заявки — только от самой организации, решение Ирины 10.10.2026) */
const TPL = 'Здравствуйте, Ирина! Мы хотим бесплатно разместить нашу организацию в «Своих людях».\nНазвание организации:\nФорма (ферайн, фонд, другое):\nНомер в торговом реестре (UID) или устав:\nЧто мы делаем (2–4 предложения):\nДля кого (статус S, дети, взрослые, предприниматели):\nЯзыки:\nКантон и города:\nАдрес встреч (если его можно публиковать):\nБесплатно или взнос:\nКак записаться или прийти:\nНужны ли волонтёры:\nСайт, e-mail, Telegram, Instagram:\nКто подтвердит карточку (член правления, имя и e-mail):';
document.getElementById('askCopy').addEventListener('click', async () => toast((await copyText(TPL)) ? 'Шаблон скопирован — вставьте его в сообщение Ирине в Telegram или в письмо.' : 'Не получилось скопировать. Напишите Ирине в Telegram: @IrynaNeuroCoach'));

/* ---------- события страницы ---------- */
document.getElementById('results').addEventListener('click', e => { const b = e.target.closest('[data-o]'); if (b) openO(b.dataset.o); });
['dir', 'canton', 'lang', 'who', 'fee'].forEach(id => document.getElementById(id).addEventListener('change', e => { state[id] = e.target.value; render(); }));
document.getElementById('reset').addEventListener('click', () => { Object.keys(state).forEach(k => state[k] = ''); document.getElementById('fee').value = ''; render(); });
render();
const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1)); if (id && ORGS.some(o => o.id === id && o.status === 'активен' && confirmed(o))) openO(id); };
fromHash(); addEventListener('hashchange', fromHash);
