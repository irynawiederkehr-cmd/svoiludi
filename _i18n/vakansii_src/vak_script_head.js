const ADMIN = (() => {   // режим Ирины: ?ira=1 включает на этом устройстве, ?ira=0 выключает
  try { const q = location.search; if (/[?&]ira=1/.test(q)) localStorage.setItem('svoiludi-admin', '1'); if (/[?&]ira=0/.test(q)) localStorage.removeItem('svoiludi-admin'); return localStorage.getItem('svoiludi-admin') === '1'; }
  catch (e) { return /[?&]ira=1/.test(location.search); } })();
const MAIL = 'voznesenskaya.iryna@gmail.com';
const SPECIALISTS = window.SPECIALISTS || [];
const VACANCIES = window.VACANCIES || [];
/* Пометка и дисклеймер — на каждом объявлении везде и всегда (решение Ирины 07.10.2026) */
const FREE_NOTE = 'Бесплатно, для поддержки сообщества «Свои люди». Не коммерческая услуга.';
const DISC = {
  staff: 'Вакансию разместил сам работодатель, он отвечает за её содержание. «Свои люди» не участвуют в найме и не отвечают за условия и сотрудничество. Обо всём договаривайтесь напрямую с работодателем.',
  partner: 'Предложение разместил сам автор, он отвечает за его содержание. «Свои люди» не участвуют в сотрудничестве и не отвечают за условия. Обо всём договаривайтесь напрямую с автором предложения.'
};
const KINDS = { staff: { t: 'Ищу сотрудника', s: 'работа по найму', c: '#4F5E3E' }, partner: { t: 'Ищу партнёра', s: 'сотрудничество', c: '#C97E52' } };
const CATS = {
  status: 'Документы и статус', law: 'Юристы', money: 'Налоги и финансы', insure: 'Страхование и пенсия', health: 'Врачи и здоровье',
  psy: 'Психологическая помощь', coach: 'Коучинг и личное развитие', body: 'Тело и красота', kids: 'Дети и семья',
  learn: 'Язык, учёба и работа', home: 'Дом, быт и транспорт', events: 'Праздники, фото и еда'
};
const CANTONS = {
  'Aargau': ['AG', 'Аргау'], 'Appenzell Ausserrhoden': ['AR', 'Аппенцелль-Ауссерроден'], 'Appenzell Innerrhoden': ['AI', 'Аппенцелль-Иннерроден'],
  'Basel-Landschaft': ['BL', 'Базель-Ланд'], 'Basel-Stadt': ['BS', 'Базель-Штадт'], 'Bern': ['BE', 'Берн'], 'Fribourg': ['FR', 'Фрибур'],
  'Genève': ['GE', 'Женева'], 'Glarus': ['GL', 'Гларус'], 'Graubünden': ['GR', 'Граубюнден'], 'Jura': ['JU', 'Юра'], 'Luzern': ['LU', 'Люцерн'],
  'Neuchâtel': ['NE', 'Невшатель'], 'Nidwalden': ['NW', 'Нидвальден'], 'Obwalden': ['OW', 'Обвальден'], 'Schaffhausen': ['SH', 'Шаффхаузен'],
  'Schwyz': ['SZ', 'Швиц'], 'Solothurn': ['SO', 'Золотурн'], 'St. Gallen': ['SG', 'Санкт-Галлен'], 'Thurgau': ['TG', 'Тургау'], 'Ticino': ['TI', 'Тичино'],
  'Uri': ['UR', 'Ури'], 'Valais': ['VS', 'Вале'], 'Vaud': ['VD', 'Во'], 'Zug': ['ZG', 'Цуг'], 'Zürich': ['ZH', 'Цюрих']
};
const LANG_FIRST = ['русский', 'украинский', 'немецкий', 'французский', 'итальянский', 'английский'];
const MON_G = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
window.HELP = {
  kind: '<p><b>Ищу сотрудника</b> — работа по найму: человек работает у автора по договору, по его графику и указаниям, получает зарплату, автор платит отчисления AHV.</p><p><b>Ищу партнёра</b> — сотрудничество самостоятельных специалистов: субподряд, совместный проект, аренда кабинета, обмен клиентами. Каждый работает на себя и сам платит свои взносы.</p>',
  partner: '<p>Партнёрство — это когда каждый работает на себя: сам решает, когда и как работать, сам выставляет счета и платит свои взносы.</p><p>Если человек будет работать в твоё время, по твоим указаниям и за регулярную оплату за часы, это работа по найму, даже если называть её партнёрством. Такое объявление размести как «Ищу сотрудника». Иначе может получиться скрытый найм, и касса AHV вправе потребовать взносы задним числом.</p>',
  rav: '<p>Для некоторых профессий с высокой безработицей работодатель сначала сообщает вакансию в RAV (региональный центр занятости), и только через 5 рабочих дней может публиковать её в других местах.</p><p>Список профессий обновляется каждый год. Проверить свою профессию можно на <a href="https://www.arbeit.swiss/secoalv/de/home/menue/unternehmen/stellenmeldepflicht.html" target="_blank" rel="noopener">arbeit.swiss</a>.</p>'
};

const today = new Date().toISOString().slice(0, 10);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kt = c => (CANTONS[c] || [c])[0];
const ktRu = c => (CANTONS[c] || [, c])[1];
const plural = (n, a, b, c) => n % 10 === 1 && n % 100 !== 11 ? a : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? b : c;
const ext = 'target="_blank" rel="noopener"';
const photoSrc = f => (window.IMG_BASE || '../img/') + f;
const fmtDate = x => { const [y, m, d] = x.split('-').map(Number); return `${d} ${MON_G[m - 1]} ${y}`; };
const PAGE_URL = location.origin + location.pathname;
const vUrl = v => 'https://svoiludi.ch/vakansii/#' + v.id;
function toast(t){ const el = document.getElementById('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 5000); }
const copyText = t => { try { return navigator.clipboard.writeText(t).then(() => true, () => false); } catch (_) { return Promise.resolve(false); } };

const authorOf = v => v.author && typeof v.author === 'object' ? v.author : SPECIALISTS.find(s => s.id === v.author) || null;   // автор с карточкой — id; без карточки — { name, firm, role, contacts: { telegram, email } }
const confirmed = v => !!(v.confirm && v.confirm.date);
const pool = () => VACANCIES.filter(v => v.status === 'активен' && confirmed(v) && (!v.until || v.until > today));
const state = { kind: '', cat: '', canton: '', lang: '', remote: '' };
function match(v, skip){
  return (skip === 'kind' || !state.kind || v.kind === state.kind)
    && (skip === 'cat' || !state.cat || v.cat === state.cat)
    && (skip === 'canton' || !state.canton || v.canton === state.canton || (v.online && !v.canton))
    && (skip === 'lang' || !state.lang || (v.langs || []).includes(state.lang))
    && (skip === 'remote' || !state.remote || (state.remote === 'online' ? !!v.online : !!v.canton));
}
const where = v => [v.city, v.canton ? kt(v.canton) : ''].filter(Boolean).join(' · ') + (v.online ? (v.canton ? ' · можно удалённо' : 'удалённо') : '');

function row(v){
  const k = KINDS[v.kind] || KINDS.staff, a = authorOf(v);
  return `<button class="ev vac" type="button" data-v="${esc(v.id)}" style="--lc:${k.c}">${v.sample ? '<span class="sample">Образец</span>' : ''}
    <span class="ev-d vk"><b>${(typeof ICO !== 'undefined' && ICO[v.kind]) || (typeof ICO !== 'undefined' ? ICO.staff : '👋')}</b><small>${esc(k.t)}</small></span>
    <span class="ev-m">${v.sample ? '<span class="yours">Здесь может быть твоё объявление!</span>' : ''}<span class="ev-k">${esc(CATS[v.cat] || '')}</span><span class="ev-t">${esc(v.title)}</span>
      <span class="ev-i">${a ? `<b>${esc(a.name)}</b>` : ''}<span>${esc(where(v))}</span>${v.workload ? `<span>${esc(v.workload)}</span>` : ''}<span>${esc((v.langs || []).join(', '))}</span></span>
      <span class="free-line">${FREE_NOTE}</span>
      <span class="disc-line">${esc(DISC[v.kind] || DISC.staff)}</span></span>
    ${a && a.photo ? `<span class="ev-o"><img src="${esc(photoSrc(a.photo))}" alt="" loading="lazy"></span>` : ''}</button>`;
}
function render(){
  const list = pool().filter(v => match(v)).sort((a, b) => (b.posted || '').localeCompare(a.posted || ''));
  const box = document.getElementById('results');
  box.innerHTML = list.length ? `<div class="group">${list.map(row).join('')}</div>`
    : `<div class="empty"><b>${pool().length ? 'По этому выбору объявлений нет' : 'Пока объявлений нет'}</b><span>${pool().length ? 'Попробуй убрать часть выбора.' : 'Будь первой или первым — размести объявление, это бесплатно.'}</span><a class="btn ghost" href="#add">Разместить объявление</a></div>`;
  document.getElementById('count').textContent = `${list.length} ${plural(list.length, 'объявление', 'объявления', 'объявлений')}`;
  document.getElementById('reset').hidden = !Object.values(state).some(Boolean);
  Object.keys(state).forEach(id => document.getElementById(id).classList.toggle('set', !!state[id]));
  fillSelects();
}
function fillSelects(){
  const opt = (v, t, n) => `<option value="${esc(v)}">${esc(t)}${n === undefined ? '' : ' · ' + n}</option>`, all = pool();
  const k = document.getElementById('kind'), b1 = all.filter(v => match(v, 'kind'));
  k.innerHTML = opt('', 'Всех', b1.length) + Object.entries(KINDS).map(([id, x]) => opt(id, x.t, b1.filter(v => v.kind === id).length)).join(''); k.value = state.kind;
  const c = document.getElementById('cat'), b2 = all.filter(v => match(v, 'cat'));
  c.innerHTML = opt('', 'Все направления', b2.length) + Object.entries(CATS).map(([id, t]) => opt(id, t, b2.filter(v => v.cat === id).length)).join(''); c.value = state.cat;
  const cs = document.getElementById('canton');
  cs.innerHTML = opt('', 'Все кантоны') + Object.keys(CANTONS).sort((a, b) => ktRu(a).localeCompare(ktRu(b), 'ru')).map(x => { const n = all.filter(v => v.canton === x).length; return opt(x, `${ktRu(x)} (${kt(x)})${n ? ' · ' + n : ''}`); }).join(''); cs.value = state.canton;
  const ls = document.getElementById('lang'), langs = [...new Set(all.flatMap(v => v.langs || []).concat(LANG_FIRST.slice(0, 3)))].sort((a, b) => (LANG_FIRST.indexOf(a) + 1 || 99) - (LANG_FIRST.indexOf(b) + 1 || 99));
  ls.innerHTML = opt('', 'Любой язык') + langs.map(l => opt(l, l[0].toUpperCase() + l.slice(1))).join(''); ls.value = state.lang;
}

/* ---------- окно объявления ---------- */
const qm = document.getElementById('qm');
let OPEN = null;
function contactLinks(v, a){
  const out = [], c = (v.contact || '').trim(), ac = (a && a.contacts) || {};
  const tg = c.startsWith('tg:') ? c.slice(3) : !c ? ac.telegram : '', mail = c.startsWith('mail:') ? c.slice(5) : !c ? ac.email : '';
  if (tg) out.push(`<a class="btn" href="https://t.me/${esc(tg.replace(/^@/, ''))}" ${ext}>Откликнуться в Telegram</a>`);
  if (mail) out.push(`<a class="btn${tg ? ' ghost' : ''}" href="mailto:${esc(mail)}?subject=${encodeURIComponent('Отклик: ' + v.title)}">Написать письмо</a>`);
  return out.join('');
}
function openV(id){
  const v = VACANCIES.find(x => x.id === id); if (!v) return; OPEN = v;
  const k = KINDS[v.kind] || KINDS.staff, a = authorOf(v), box = document.getElementById('qmCard');
  box.style.setProperty('--lc', k.c); box.style.setProperty('--lf', `color-mix(in srgb,${k.c} 12%,var(--paper))`);
  box.innerHTML = `<div class="qm-top"><div class="qm-head">${v.sample ? '<span class="ev-k" style="color:var(--brown)">Образец объявления · всё вымышленное</span><a class="yours" href="#add" data-close>Здесь может быть твоё объявление! Как разместить →</a>' : ''}<span class="ev-k" style="color:${k.c}">${esc(k.t)} · ${esc(k.s)}</span><h2 class="qm-title" id="qmTitle">${esc(v.title)}</h2><span class="free-line">${FREE_NOTE}</span></div><button class="qm-close" type="button" aria-label="Закрыть">✕</button></div>
    <div class="d-body">
      <div class="d-col">
        <div class="d-block"><h4>${v.kind === 'partner' ? 'О сотрудничестве' : 'О работе'}</h4><p>${esc(v.about)}</p></div>
        ${v.offer ? `<div class="d-block"><h4>Что предлагает автор</h4><p>${esc(v.offer)}</p></div>` : ''}
        <div class="d-block"><h4>Языки</h4><div class="chips">${(v.langs || []).map(l => `<span>${esc(l)}</span>`).join('')}</div></div>
        <div class="d-block"><h4>Автор объявления</h4><div class="orgs">${a ? `<a class="org" href="../#${esc(a.id)}">${a.photo ? `<img src="${esc(photoSrc(a.photo))}" alt="${esc(a.name)}">` : `<span class="ini">${esc(a.name[0])}</span>`}<span><b>${esc(a.name)}</b><small>${esc(a.role || '')}${a.firm ? ' · ' + esc(a.firm) : ''}</small><br><u>Карточка в справочнике →</u></span></a>` : '<span>автор объявления</span>'}</div></div>
      </div>
      <div class="d-side">
        <div class="d-block"><h4>Где</h4><span>${esc(where(v)) || '—'}</span></div>
        ${v.workload ? `<div class="d-block"><h4>Занятость</h4><span>${esc(v.workload)}</span></div>` : ''}
        ${v.start ? `<div class="d-block"><h4>С какого времени</h4><span>${esc(v.start)}</span></div>` : ''}
        ${confirmed(v) ? `<details class="cf-box"><summary><b>Условия подтверждены автором</b><span>${esc(fmtDate(v.confirm.date))} · что именно подтверждено</span></summary><ul class="marks">${checksFor(v).map(c => `<li>${esc(c.t)}</li>`).join('')}</ul></details>` : ''}
        ${ADMIN ? adminBox(v, a) : ''}
        <div class="disc-box"><b>Важно</b><p>${esc(DISC[v.kind] || DISC.staff)}</p><p class="free-line">${FREE_NOTE}</p></div>
        <div class="acts">${contactLinks(v, a)}<button class="btn ghost" type="button" data-share>Поделиться</button></div>
        <p class="note">Опубликовано ${esc(fmtDate(v.posted))}${v.until ? ` · снимется ${esc(fmtDate(v.until))}` : ''}. <a href="#terms" data-close>Условия раздела</a>. <a href="mailto:${MAIL}?subject=${encodeURIComponent('Сообщить об объявлении: ' + v.title)}&body=${encodeURIComponent('Ссылка: ' + vUrl(v) + '\n\nЧто не так:\n')}">Сообщить об объявлении</a></p>
      </div>
    </div>`;
  box.querySelector('.qm-close').onclick = () => qm.close();
  if (!qm.open) qm.showModal();
  if (location.hash.slice(1) !== v.id) history.replaceState(null, '', '#' + v.id);
}
document.getElementById('qmCard').addEventListener('click', async ev => {
  if (ev.target.closest('[data-close]')) qm.close();
  if (OPEN && ev.target.closest('[data-share]')){ const url = vUrl(OPEN), title = OPEN.title;
    if (navigator.share){ try { await navigator.share({ title, text: title + ' · Свои люди в Швейцарии', url }); return; } catch (err){ if (err && err.name === 'AbortError') return; } }
    toast((await copyText(url)) ? 'Ссылка на объявление скопирована.' : url); }
});
qm.addEventListener('click', e => { if (e.target === qm) qm.close(); });
qm.addEventListener('close', () => { if (location.hash && location.hash !== '#add' && location.hash !== '#terms') history.replaceState(null, '', location.pathname + location.search); });

