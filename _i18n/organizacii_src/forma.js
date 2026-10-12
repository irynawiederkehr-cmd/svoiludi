/* Заявка организации на сайте (перенесено из прежнего script.js 12.10.2026, когда «Организации» перешли на движок справочника).
   Всё в своей области видимости: имена не пересекаются с движком главной. Форма ничего не отправляет сама — «Отправить заявку» открывает
   готовое письмо; черновик только в браузере (svoi-org-zayavka); галочка согласия и две галочки «только своё» обязательны. */
(() => {
const MAIL = 'voznesenskaya.iryna@gmail.com';
const DIRS = {
  help: { t: 'Помощь и интеграция', c: '#4F5E3E' }, kids: { t: 'Дети и школы', c: '#B98324' },
  culture: { t: 'Общества и культура', c: '#C97E52' }, business: { t: 'Деловые сообщества', c: '#4F6F8F' },
  food: { t: 'Еда и магазины', c: '#A0523D' }, studio: { t: 'Студии и досуг', c: '#7A5A8C' }
};
const WHO = { S: 'Люди со статусом S', kids: 'Дети и подростки', adults: 'Взрослые', women: 'Женщины', business: 'Предприниматели', all: 'Все' };
const CANTONS = {
  'Aargau': ['AG', 'Аргау'], 'Appenzell Ausserrhoden': ['AR', 'Аппенцелль-Ауссерроден'], 'Appenzell Innerrhoden': ['AI', 'Аппенцелль-Иннерроден'],
  'Basel-Landschaft': ['BL', 'Базель-Ланд'], 'Basel-Stadt': ['BS', 'Базель-Штадт'], 'Bern': ['BE', 'Берн'], 'Fribourg': ['FR', 'Фрибур'],
  'Genève': ['GE', 'Женева'], 'Glarus': ['GL', 'Гларус'], 'Graubünden': ['GR', 'Граубюнден'], 'Jura': ['JU', 'Юра'], 'Luzern': ['LU', 'Люцерн'],
  'Neuchâtel': ['NE', 'Невшатель'], 'Nidwalden': ['NW', 'Нидвальден'], 'Obwalden': ['OW', 'Обвальден'], 'Schaffhausen': ['SH', 'Шаффхаузен'],
  'Schwyz': ['SZ', 'Швиц'], 'Solothurn': ['SO', 'Золотурн'], 'St. Gallen': ['SG', 'Санкт-Галлен'], 'Thurgau': ['TG', 'Тургау'], 'Ticino': ['TI', 'Тичино'],
  'Uri': ['UR', 'Ури'], 'Valais': ['VS', 'Вале'], 'Vaud': ['VD', 'Во'], 'Zug': ['ZG', 'Цуг'], 'Zürich': ['ZH', 'Цюрих']
};
const LANG_FIRST = ['украинский', 'русский', 'немецкий', 'французский', 'итальянский', 'ретороманский', 'английский'];
const HELP_ORG = {
  feek: '<p><b>Ничего</b> или <b>только добровольные пожертвования</b> — организация размещается у нас бесплатно всегда. Её события и курсы тоже только бесплатные или с пожертвованием.</p><p><b>Членский взнос, плата за занятия, курс, школу, лагерь, билеты или цены</b> — размещение на тех же условиях, что у специалистов: до конца 2027 года бесплатно, потом платно.</p><p>Сумму пишите конечную, в швейцарских франках: «CHF» уже стоит, впишите только число и выберите, за что она.</p>',
  zfindHead: '<p>Если руководитель организации или фирмы уже размещён в справочнике специалистов, найдите его карточку по номеру. <b>UID</b> — номер фирмы или самозанятого вида CHE-123.456.789, он есть в карточке. <b>Номер карточки</b> — SG-0001, он тоже есть в карточке, внизу.</p><p>Имя руководителя подставится из карточки, а его карточка и карточка организации будут ссылаться друг на друга. Номер никуда не отправляется: поиск идёт только по опубликованным карточкам, прямо на этой странице.</p>',
  dir: '<p><b>Помощь и интеграция</b> — центры помощи, консультации, помощь с документами, жильём и работой, курсы языка.</p><p><b>Дети и школы</b> — школы выходного дня, кружки, лагеря, родительские группы.</p><p><b>Общества и культура</b> — общества диаспоры, хоры, танцы, праздники, клубы.</p><p><b>Деловые сообщества</b> — объединения предпринимателей и специалистов, встречи и обмен опытом.</p><p><b>Еда и магазины</b> — рестораны, кафе, кейтеринг, продукты и магазины своих.</p><p><b>Студии и досуг</b> — студии танца, спорта, творчества и красоты, частные курсы и школы.</p>',
  kind: '<p><b>Благотворительная организация</b> помогает людям без прибыли: центр помощи, фонд. <b>Некоммерческая</b> — ферайн или общество без прибыли: школа выходного дня, хор, клуб, деловое общество.</p><p><b>Фирма</b> — коммерческая организация: ресторан, кейтеринг, магазин, студия, частная школа.</p><p>Условия зависят от того, берёт ли организация деньги с людей. Кто всё делает для людей бесплатно, размещается бесплатно всегда. Кто берёт членский взнос, плату за занятия, билеты или цены, — на тех же условиях, что специалисты справочника: до конца 2027 года бесплатно, потом платно.</p>',
  firm: '<p>Фирма зарабатывает на своих товарах и услугах, а ферайн или школа со взносом или платой за занятия собирает деньги с людей. Поэтому они размещаются на тех же условиях, что специалисты справочника. В период запуска, до 31 декабря 2027 года, карточка бесплатна. Потом размещение платное, цены мы сообщим заранее, и ничего не продлевается само. VIP всегда платный и помечен «Платное размещение». Вакансии и поиск партнёров бесплатны для всех и всегда.</p>',
  head: '<p>У фирмы на карточке всегда указан руководитель, чтобы людям было понятно, кто отвечает. Обычно это директор или владелец, как в торговом реестре Zefix. Он подтверждает карточку письмом с адреса фирмы. Если руководитель есть в справочнике специалистов, на обеих карточках будет ссылка друг на друга. Ферайну и фонду указывать руководителя не обязательно.</p>',
  who: '<p>Отметь, для кого ищешь. <b>Статус S</b> — защита для людей из Украины: временное право жить и работать в Швейцарии. Многие центры помощи работают именно для них.</p>',
  zefix: '<p><b>Zefix</b> — официальный торговый реестр Швейцарии, там видно название, адрес и правление организации. Фонд (Stiftung) записан в реестре всегда. Ферайну (Verein) запись нужна не всегда, тогда проверяем по уставу (Statuten) и протоколу собрания.</p>',
  badge: '<p>Организации, которые ничего не берут с людей, мы размещаем бесплатно всегда: помощь, консультации, занятия и события у них бесплатные, а живут они на добровольные пожертвования, гранты и труд добровольцев. Они работают для людей, а не ради денег. Проверка у всех одинаковая.</p>',
  money: '<p>Выберите «Да», если люди платят вам за что-нибудь: членский взнос, плату за занятия, школу, курс или лагерь, билеты на события, цены за товары и услуги. Добровольные пожертвования не считаются, а билеты на благотворительный концерт или ужин — считаются.</p><p>Кто ничего не берёт с людей, размещается бесплатно всегда. Кто берёт — на тех же условиях, что специалисты справочника: до конца 2027 года бесплатно, потом платно, цены мы сообщим заранее.</p>',
  form: '<p><b>Ферайн (Verein)</b> — объединение людей с общей целью: общество, клуб, школа, центр помощи. Для него хватает устава и собрания. <b>Фонд (Stiftung)</b> — организация с имуществом для определённой цели, всегда записана в торговом реестре и под надзором.</p><p><b>ООО (GmbH), АО (AG), ИП (Einzelunternehmen), кооператив (Genossenschaft)</b> — формы фирмы. Фирма записана в торговом реестре Zefix, там видно её название, адрес и руководство.</p>',
  whoForm: '<p>Отметьте, для кого вы работаете. По этим отметкам люди находят организацию в фильтре «Для кого». <b>Статус S</b> — защита для людей из Украины: временное право жить и работать в Швейцарии.</p>',
  board: '<p>Карточку мы публикуем только с согласия самой организации. Поэтому её подтверждает член правления (Vorstand) ферайна или фонда или руководитель фирмы ответным письмом с адреса организации. Имя члена правления на сайте не показываем. Имя и должность руководителя фирмы стоят на её карточке.</p>'
};
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const kt = c => (CANTONS[c] || [c])[0];
const ktRu = c => (CANTONS[c] || [, c])[1];
function toast(t){ const el = document.getElementById('toast'); el.textContent = t; el.hidden = false; clearTimeout(toast.t); toast.t = setTimeout(() => el.hidden = true, 5000); }
const copyText = t => { try { return navigator.clipboard.writeText(t).then(() => true, () => false); } catch (_) { return Promise.resolve(false); } };
window.HELP = Object.assign(window.HELP || {}, HELP_ORG);

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
document.getElementById('o-canton').innerHTML = oOpt('', 'Выберите кантон') + Object.keys(CANTONS).sort((a, b) => ktRu(a).localeCompare(ktRu(b), 'ru')).map(x => `<option value="${esc(ktRu(x) + ' (' + kt(x) + ')')}" data-k="${kt(x)}">${esc(ktRu(x) + ' (' + kt(x) + ')')}</option>`).join('') + oOpt('Вся Швейцария', 'Вся Швейцария');
/* что можно получить, дни, что платят люди — галочками и списками, чтобы почти ничего не писать (решение Ирины 10.10.2026, 22:07) */
const OFFERS = ['Помощь с письмами и документами', 'Помощь со статусом S и пермитом', 'Курсы языка', 'Разговорные клубы', 'Школа выходного дня', 'Кружки и секции для детей', 'Встречи и праздники',
  'Психологическая поддержка', 'Юридические консультации', 'Помощь с работой', 'Одежда, продукты, вещи', 'Помощь с жильём', 'Концерты, театр, выставки', 'Спорт', 'Еда: ресторан, кейтеринг', 'Магазин'];
document.getElementById('o-offers').innerHTML = OFFERS.map(t => oChk('o-offer', t, t)).join('');
document.getElementById('o-days').innerHTML = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(t => oChk('o-day', t, t)).join('');
const FEEK = [['free', 'Ничего: всё бесплатно'], ['donation', 'Только добровольные пожертвования'], ['member', 'Членский взнос'], ['lesson', 'Плата за занятия'], ['course', 'Плата за курс, школу или лагерь'], ['ticket', 'Билеты на события'], ['prices', 'Цены: фирма, ресторан, магазин']];
document.getElementById('o-feek').innerHTML = oOpt('', 'Выберите') + FEEK.map(([v, t]) => oOpt(v, t)).join('');
/* «Берёте ли деньги с людей?» — «нет»: только «ничего» и «пожертвования»; «да»: только платные варианты */
function oFeeLock(){
  const m = document.getElementById('o-money').value, f = document.getElementById('o-feek');
  [...f.options].forEach(o => { if (!o.value) return; const freeOpt = o.value === 'free' || o.value === 'donation'; o.disabled = (m === 'нет' && !freeOpt) || (m === 'да' && freeOpt); });
  if (f.selectedOptions[0] && f.selectedOptions[0].disabled){ f.value = ''; f.dispatchEvent(new Event('change', { bubbles: true })); }
}
document.getElementById('o-money').addEventListener('change', oFeeLock);
document.getElementById('o-who').innerHTML = Object.entries(WHO).map(([, t]) => oChk('o-who', t, t)).join('');
document.getElementById('o-langs').innerHTML = LANG_FIRST.map(l => oChk('o-lang', l, l[0].toUpperCase() + l.slice(1))).join('');
const oChecked = name => [...oF.querySelectorAll(`input[name="${name}"]:checked`)].map(i => i.value);
function oSave(){ try { const d = {}; oF.querySelectorAll('[data-a]').forEach(el => d[el.id] = el.value); d.who = oChecked('o-who'); d.langs = oChecked('o-lang'); d.offers = oChecked('o-offer'); d.days = oChecked('o-day'); localStorage.setItem(OKEY, JSON.stringify(d)); } catch (_) {} }
try { const d = JSON.parse(localStorage.getItem(OKEY) || 'null'); if (d) {
  oF.querySelectorAll('[data-a]').forEach(el => { if (typeof d[el.id] === 'string') el.value = d[el.id]; });
  (d.who || []).forEach(v => { const i = oF.querySelector(`input[name="o-who"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; });
  (d.langs || []).forEach(v => { const i = oF.querySelector(`input[name="o-lang"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; });
  [['offers', 'o-offer'], ['days', 'o-day']].forEach(([k, n]) => (d[k] || []).forEach(v => { const i = oF.querySelector(`input[name="${n}"][value="${CSS.escape(v)}"]`); if (i) i.checked = true; })); } } catch (_) {}
oFeeLock();
oF.addEventListener('input', oSave); oF.addEventListener('change', oSave);
/* галочка согласия (вопрос Ирины 10.10.2026, 20:37): пока её нет, кнопка серая; в письмо — строка с датой и временем; в черновик не сохраняется */
const oOk = document.getElementById('o-ok'), oSec = document.getElementById('zayavka');
/* ещё две обязательные галочки (решение Ирины 10.10.2026, 22:14 и 22:24): только своя организация; законно и в нашей компетенции */
const oMust = [['o-own', 'Поставьте галочку «Мы подаём заявку только за свою организацию».', 'Только своя организация, за других не размещаем: отмечено на сайте'], ['o-law', 'Поставьте галочку «Деятельность организации законна».', 'Законно и в нашей компетенции: отмечено на сайте']];
const oChecks = () => [oOk].concat(oMust.map(m => document.getElementById(m[0])));
const oPaint = () => { oSec.classList.toggle('zok-off', !oChecks().every(x => x.checked)); oChecks().forEach(x => { if (x.checked) x.closest('.zok').classList.remove('need'); }); };
oChecks().forEach(x => x.addEventListener('change', oPaint)); oPaint();
const oStamp = () => { const d = new Date(), p = n => String(n).padStart(2, '0'); return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`; };
const oDraftIdle = () => { oDraft.innerHTML = 'Всё, что вы ввели, сохраняется только на этом устройстве, пока вы сами не отправите заявку. Можно закрыть страницу и продолжить позже. <button class="lnk" type="button" id="oWipe">Удалить историю</button>'; };
oDraftIdle();
oDraft.addEventListener('click', e => { const id = e.target.id;
  if (id === 'oWipe') oDraft.innerHTML = 'Удалить с этого устройства всё, что вы ввели в заявку? Вернуть это будет нельзя. <button class="lnk" type="button" id="oWipeYes">Да, удалить историю</button><button class="lnk" type="button" id="oWipeNo">Отмена</button>';
  if (id === 'oWipeNo') oDraftIdle();
  if (id === 'oWipeYes'){ try { localStorage.removeItem(OKEY); } catch (_) {} oF.querySelectorAll('[data-a]').forEach(el => el.value = ''); oF.querySelectorAll('input[type=checkbox]').forEach(i => i.checked = false); oChecks().forEach(x => x.checked = false); oFeeLock(); oPaint(); oF.dispatchEvent(new Event('zwipe')); oMsg.hidden = true; oDraftIdle(); toast('Вся история заявки удалена с этого устройства.'); }
});
function oLetter(){
  const lines = [], name = document.getElementById('o-name').value.trim();
  oF.querySelectorAll('.f').forEach(f => {
    if (f.hidden) return;   // поля только для карточки из справочника (assets/zayavka.js) без карточки не видны
    const el = f.querySelector('[data-a]'), box = f.querySelector('.chk');
    if (el){ const x = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].text : '') : el.value.trim(); if (x) lines.push(`${el.dataset.a}: ${x}`); }
    else if (box){ const x = [...box.querySelectorAll('input:checked')].map(i => i.parentNode.textContent.trim()); if (x.length) lines.push(`${box.dataset.l}: ${x.join(', ')}`); }
  });
  const su = 'Заявка организации в «Своих людях»' + (name ? ' — ' + name : '');
  const firm = document.getElementById('o-kind').value === 'фирма', free = !firm && document.getElementById('o-money').value === 'нет';
  if (oOk.checked) lines.push('', 'Согласие на обработку данных и публикацию: отмечено на сайте ' + oStamp());
  oMust.forEach(([id, , line]) => { if (document.getElementById(id).checked) lines.push(line + ' ' + oStamp()); });
  const body = [firm ? 'Здравствуйте! Мы хотим разместить нашу фирму в «Своих людях».' : free ? 'Здравствуйте! Мы хотим бесплатно разместить нашу организацию в «Своих людях». Для людей у нас всё бесплатно.' : 'Здравствуйте! Мы хотим разместить нашу организацию в «Своих людях».', '', ...lines, '', 'Заявка заполнена на странице https://svoiludi.ch/organizacii/', ''].join('\n');
  return { su, body };
}
document.getElementById('orgSend').addEventListener('click', () => {
  const firmK = document.getElementById('o-kind').value === 'фирма';
  const need = [['o-kind', 'вид организации'], ['o-name', 'название организации'], ['o-form', 'форму организации'], ['o-about', 'что вы делаете'], ['o-canton', 'кантон'], ['o-email', 'e-mail организации'], ['o-board', 'кто подтвердит карточку']].concat(firmK ? [['o-uid', 'номер UID фирмы'], ['o-head', 'руководителя фирмы']] : [['o-money', 'берёте ли вы деньги с людей']])
    .concat([['o-addrshow', 'адрес встреч'], ['o-feek', 'что платят люди']])
    .concat(['o-street', 'o-city', 'o-fee', 'o-feeper'].filter(id => !document.getElementById(id).closest('.f').hidden).map(id => [id, { 'o-street': 'улицу и дом', 'o-city': 'город', 'o-fee': 'сумму', 'o-feeper': 'за что платят' }[id]]));
  const miss = need.filter(([id]) => !document.getElementById(id).value.trim());
  oF.querySelectorAll('.f').forEach(f => f.classList.remove('miss')); miss.forEach(([id]) => document.getElementById(id).closest('.f').classList.add('miss'));
  if (miss.length){ oMsg.hidden = false; oMsg.textContent = 'Пожалуйста, заполните: ' + miss.map(m => m[1]).join(', ') + '.'; document.getElementById(miss[0][0]).focus(); return; }
  const mailOk = x => !x || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(x);
  const badMail = ['o-email', 'o-board-mail'].find(id => !mailOk(document.getElementById(id).value.trim()));
  if (badMail){ document.getElementById(badMail).closest('.f').classList.add('miss'); oMsg.hidden = false; oMsg.textContent = 'Проверьте e-mail: в адресе не хватает знака @ или точки.'; document.getElementById(badMail).focus(); return; }
  if (!oOk.checked){ oOk.closest('.zok').classList.add('need'); oMsg.hidden = false; oMsg.textContent = 'Поставьте галочку согласия над кнопкой — без неё мы не можем принять заявку.'; oOk.focus(); return; }
  const m1 = oMust.find(([id]) => !document.getElementById(id).checked);
  if (m1){ const x = document.getElementById(m1[0]); x.closest('.zok').classList.add('need'); oMsg.hidden = false; oMsg.textContent = m1[1]; x.focus(); return; }
  const L = oLetter(), q = `?subject=${encodeURIComponent(L.su)}&body=${encodeURIComponent(L.body)}`;
  const gm = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(MAIL)}&su=${encodeURIComponent(L.su)}&body=${encodeURIComponent(L.body)}`;
  oMsg.hidden = false;
  oMsg.innerHTML = `Открылось письмо с вашей заявкой на ${esc(MAIL)}. Проверьте его и нажмите «Отправить» в своей почте. Письмо не открылось? <a href="${esc(gm)}" ${ext}>Открыть в Gmail</a> или <button class="lnk" type="button" id="oCopy">скопировать заявку</button> и отправить её на ${esc(MAIL)}.`;
  location.href = `mailto:${MAIL}${q}`;
});
oMsg.addEventListener('click', async e => { if (e.target.id !== 'oCopy') return; const L = oLetter();
  toast((await copyText(L.su + '\n\n' + L.body)) ? 'Заявка скопирована. Вставьте её в письмо на ' + MAIL + '.' : 'Не получилось скопировать. Напишите нам на ' + MAIL + '.'); });

})();
