/* «Организации» на движке справочника специалистов (решение Ирины 12.10.2026: «в организациях карточки должны быть идентичными карточкам
   специалистов со всеми лайками, сердечками, файлами для скачивания и проверкой; единственное — это организация, а дизайн и правила одинаковые»).
   Этот файл вставляется в organizacii/index.html (сборка — _i18n/organizacii_src/build.py) между данными и движком главной страницы:
   переводит карточки data/organizations.js в тот же вид, что у специалистов (window.SVL_ORG.items), и даёт направления, пометки и блоки организации.
   Данные организаций не меняются: правила полей — в шапке data/organizations.js. */
(function(){
  const ORGS = window.ORGANIZATIONS || [];
  /* направления, группы, категории и значки — из orgdirs.js (собирает _i18n/kategorii_org.py, решение Ирины 12.10.2026:
     «направлений очень мало, возьми по крайней мере как у специалистов», «значки нужны разные, чтобы отображали суть») */
  const DIRS = window.SVL_ORG_DIRS || {};
  const cats = {}; Object.entries(DIRS).forEach(([k, d]) => { cats[k] = { t: d.t, g: d.g, c: d.c, i: d.i, s: d.s.slice(), w: d.w.slice() }; });
  if (typeof ICONS === 'object' && window.SVL_ORG_ICONS) Object.assign(ICONS, window.SVL_ORG_ICONS);   // значки организаций — в общую библиотеку значков страницы
  /* старые ключи направлений (до 12.10.2026) — на новые, чтобы прежние записи не потерялись */
  const OLD = { kids: 'school', culture: 'community', studio: 'studio', food: 'food', business: 'business', help: 'help' };
  const dirOf = k => DIRS[k] ? k : (OLD[k] && DIRS[OLD[k]] ? OLD[k] : 'community');
  const FORMS = { 'Verein': 'ферайн (Verein)', 'Stiftung': 'фонд (Stiftung)', 'неформальная группа': 'неформальная группа', 'GmbH': 'ООО (GmbH)', 'AG': 'АО (AG)',
    'Einzelunternehmen': 'ИП (Einzelunternehmen)', 'Genossenschaft': 'кооператив (Genossenschaft)', 'другое': 'другая форма' };
  /* kind 'org' — вид ещё не подтверждён (нет UID и устава): под названием просто «Организация», без «некоммерческая» (Ирина 13.10.2026, 19:50: «почему это некоммерческая?») */
  const KIND = { charity: 'Благотворительная организация', nonprofit: 'Некоммерческая организация', firm: 'Фирма', org: 'Организация' };
  const BADGE = { charity: 'Благотворительная организация · размещение бесплатно', nonprofit: 'Некоммерческая организация · размещение бесплатно' };
  const badgeOf = o => o.kind !== 'firm' && o.free === true ? (BADGE[o.kind] || BADGE.nonprofit) : '';
  const WHO = { S: 'Для людей со статусом S', kids: 'Для детей и подростков', adults: 'Для взрослых', women: 'Для женщин', business: 'Для предпринимателей' };
  const tags = Object.assign({ free: 'Для людей бесплатно' }, WHO, { firm: 'Фирма', npo: 'Благотворительная или некоммерческая' });
  const roleOf = o => [KIND[o.kind] || KIND.nonprofit, FORMS[o.form] || o.form].filter(Boolean).join(' · ');
  const tagsOf = o => { const w = o.for || [], t = (w.includes('all') ? Object.keys(WHO) : w.filter(x => WHO[x])).slice();
    if (o.free === true) t.unshift('free'); if (o.kind === 'firm') t.push('firm'); else if (o.kind !== 'org') t.push('npo'); return t; };
  /* адреса: places (как у специалистов) или address «улица, индекс город · улица, индекс город»; без адреса — только кантон */
  const placesOf = o => {
    if ((o.places || []).length) return o.places;
    const a = String(o.address || '').split(/\s+·\s+/).map(x => x.trim()).filter(Boolean);
    if (a.length) return a.map((x, i) => ({ canton: o.canton, address: x, geo: (o.geo || [])[i] }));
    return [{ canton: o.canton, area: true, note: (o.cities || []).length ? 'встречи: ' + o.cities.join(', ') : 'адрес встреч уточняй у организации' }];
  };
  const items = ORGS.map(o => ({
    org: o, id: o.id, sample: !!o.sample, status: o.status === 'активен' && !(o.confirm && o.confirm.date) && !o.sample ? 'на подтверждении' : o.status,
    keyHash: o.keyHash || '', num: o.num || '', uid: /^CHE/.test(o.zefix || '') ? o.zefix : '', checked: o.checked || '', added: o.added || '',
    name: o.name, role: roleOf(o), firm: '' /* строки под ролью у организаций нет (Ирина 12.10.2026, 16:47: «убери»); название из реестра, если отличается, — regName, внизу у UID */, regName: o.regName || '', photo: o.logo || '', cat: dirOf(o.dir), cat2: o.dir2 ? dirOf(o.dir2) : '', specs: (o.cats || []).slice(0, 3), tags: tagsOf(o),
    places: placesOf(o), online: !!o.online, onlineCH: o.onlineCH || '', onlineTier: o.onlineTier, tiers: o.tiers || [], paidUntil: o.paidUntil || '',
    langs: o.langs || [], about: o.about || '', services: o.offers || [], format: o.join || '', contacts: Object.assign({}, o.contacts || {}),
    prices: o.prices || [], pricesOk: !!o.pricesOk, pricesDate: o.pricesDate || '', priceSum: o.kind === 'firm' ? o.fee || '' : '',   // priceSum — короткая строка цен над прайс-листом в блоке «Цены» (12.10.2026)
    invite: o.invite, todo: o.todo || [],   // приглашение в WhatsApp у скрытой пробной карточки и заметки — только в режиме Ирины (12.10.2026)
    /* взносы (правила Ирины 12.10.2026, 14:21 и 14:23): у всех, кроме фирм, — список fees [{ sum, name, per }] сразу под описанием, «Взносы PNG», в PDF и визитке;
       всё бесплатно — «Взносов нет»; не знаем, берут ли деньги, — «Взносы — уточняем» (только у карточки, которая ещё не на сайте) */
    ...(o.kind === 'firm' ? {} : { fees: (o.fees || []).slice(), feeFree: o.free === true, feeDonation: o.free === true && /пожертв/i.test(o.fee || ''),
      feeText: o.free === true || (o.fees || []).length ? '' : (o.fee || ''), feeNeed: o.free !== true && !(o.fees || []).length && !o.fee })
  }));
  /* карточка руководителя уже на сайте (активна и подтверждена) — ссылка на неё без ключа предпросмотра */
  /* ФИЛИАЛЫ (решение Ирины 13.10.2026, 19:11): залы и студии в разных городах — отдельные карточки с общим полем group.
     В каждой — «Другие филиалы» ссылками; видны опубликованные, а в моём режиме и в предпросмотре по ключу — и пробные с тем же ключом. */
  const sibVisible = (x, s) => x.status === 'активен' || (typeof ADMIN !== 'undefined' && ADMIN) || (/^#preview=/.test(location.hash) && typeof OKKEY === 'object' && OKKEY[s.id] && x.keyHash && x.keyHash === s.org.keyHash);
  const sibHref = (x, s) => '#' + (x.status !== 'активен' && typeof OKKEY === 'object' && OKKEY[s.id] ? 'preview=' + esc(x.id) + '.' + esc(OKKEY[s.id]) : esc(x.id));
  const branchesBlock = s => { const g = s.org.group; if (!g) return ''; const xs = (window.ORGANIZATIONS || []).filter(x => x.group === g && x.id !== s.id && sibVisible(x, s)); if (!xs.length) return '';
    return `<div class="d-block"><h4>Другие филиалы</h4><p>${xs.map(x => `<a class="firm-a" href="${sibHref(x, s)}">${esc(x.name)}</a>`).join('<br>')}</p></div>`; };
  /* «НАША КОМАНДА» (решение Ирины 13.10.2026, 19:16): карточки сотрудников живут только внутри карточки организации — без отдельной карточки
     в справочнике, без VIP и без своих событий. Вносит и подтверждает организация, сотрудник согласен на публикацию. Карточка выделена рамкой
     цвета направления и плашкой «Сотрудник · название». Данные — org.team [{ name, role, photo, services[], langs[], sample }]. */
  const teamBlock = s => { const t = (s.org.team || []).filter(m => m && m.name && (!m.sample || (typeof ADMIN !== 'undefined' && ADMIN)));   /* образец сотрудника — только в моём режиме */ if (!t.length) return ''; const k = (typeof CATS === 'object' && CATS[s.cat]) || {}, c = k.c || '#4F5E3E';
    const short = String(s.org.name || '').split(' · ')[0];
    return `<div class="d-block team"><h4>Наша команда</h4><div class="team-l">${t.map(m => `<div class="tm" style="border-color:${c}">
        <span class="tm-ph" style="background:${c}">${m.photo ? `<img src="/img/team/${esc(m.photo)}" alt="">` : esc(String(m.name).trim().split(/\s+/).map(w => w[0]).slice(0, 2).join(''))}</span>
        <span class="tm-b"><span class="tm-tag" style="color:${c}" data-tip="Карточка из команды организации. Её вносит и подтверждает организация, сотрудник согласен на публикацию. Отдельной карточки в справочнике у сотрудника нет: записаться и задать вопрос — через контакты организации.">${m.sample ? 'Образец · всё вымышленное' : 'Сотрудник · ' + esc(short)}</span>
        <b>${esc(m.name)}</b><small>${esc(m.role || '')}</small>${(m.services || []).length ? `<span class="tm-s">${m.services.map(x => esc(x)).join(' · ')}</span>` : ''}${(m.langs || []).length ? `<span class="tm-l">${esc(m.langs.join(', '))}</span>` : ''}</span></div>`).join('')}</div></div>`; };
  const specLive = id => { const x = (window.SPECIALISTS || []).find(r => r.id === id); return !!(x && x.status === 'активен'); };
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DISC = 'Карточку заполнила сама организация, она отвечает за её содержание. «Свои люди» не участвуют в работе организации и не отвечают за её помощь, курсы и события. Обо всём договаривайся напрямую с организацией.';
  const DISC_FIRM = 'Карточку заполнила сама фирма, она отвечает за её содержание. «Свои люди» не участвуют в работе фирмы и не отвечают за её товары, услуги и цены. Обо всём договаривайся напрямую с фирмой.';
  window.SVL_ORG = {
    items, cats, groups: window.SVL_ORG_GROUPS || {}, tags,
    /* в окне карточки: пометка «размещение бесплатно» под названием */
    roleHelp: s => `<button type="button" class="qh" data-help="form" aria-label="Подсказка: что значит форма организации" aria-expanded="false">?</button>`,
    head: s => { const b = badgeOf(s.org); return b ? `<div class="free-line">${esc(b)}<button type="button" class="qh" data-help="badge" aria-label="Подсказка: размещение бесплатно" aria-expanded="false">?</button></div>` : ''; },
    /* в окне карточки, правая колонка: форма, взнос или цены, руководитель, «Важно» */
    side: s => { const o = s.org, h = o.head || {};
      const nd = typeof needOf === 'function' ? needOf(s) : {}, UTQ = '<span class="need">уточняем</span>';   // «уточняем» у карточки, которая ещё не на сайте (12.10.2026)
      /* форма (ООО, ИП, ферайн…) уже стоит под названием («Фирма · ООО (GmbH)», кружок «?» там же) — отдельный блок «Форма» только для «уточняем»
         (Ирина 12.10.2026, 20:04: «чтобы лишнего и повторений не было») */
      return (nd.form ? `<div class="d-block"><h4>Форма<button type="button" class="qh" data-help="form" aria-label="Подсказка: ферайн и фонд" aria-expanded="false">?</button></h4><span>${UTQ}</span></div>` : '')
        + (o.fee && o.kind === 'firm' && !(typeof priceShown === 'function' && priceShown(s)) ? `<div class="d-block"><h4>Цены</h4><span>${esc(o.fee)}</span></div>` : '')   // есть прайс-лист — коротко и весь список в блоке «Цены» после «Что можно получить» (движок, priceBlock, 12.10.2026); взносы некоммерческих — блок «Взносы» под описанием (feeBlock)
        + (nd.head ? `<div class="d-block"><h4>Руководитель<button type="button" class="qh" data-help="head" aria-label="Подсказка: руководитель" aria-expanded="false">?</button></h4>${UTQ}</div>` : '')
        + (h.name && !nd.head ? `<div class="d-block"><h4>Руководитель<button type="button" class="qh" data-help="head" aria-label="Подсказка: руководитель" aria-expanded="false">?</button></h4><span>${h.spec ? `<a class="firm-a" href="../#${specLive(h.spec) || !(/^#preview=/.test(location.hash) && typeof OKKEY === 'object' && OKKEY[s.id]) ? esc(h.spec) : 'preview=' + esc(h.spec) + '.' + esc(OKKEY[s.id])}">${esc(h.name)}</a>` : esc(h.name)}${nd.headSurname ? ' <span class="need">фамилия — уточняем</span>' : ''}${h.role ? ' · ' + esc(h.role) : ''}</span></div>` : '')   /* имя руководителя — ссылка на его карточку специалиста, без отдельной строки «Карточка в справочнике специалистов →» (Ирина 13.10.2026, 19:07) */
        + branchesBlock(s)
        + `<div class="disc-box"><b>Важно</b><p>${esc(o.kind === 'firm' ? DISC_FIRM : DISC)}</p></div>`; },
    /* предпросмотр по ссылке и режим Ирины: занятия, события и мастер-классы пробной карточки показывает сам движок (pvAfisha в index.html, 12.10.2026) */
    main: s => teamBlock(s),
    /* на карточке в списке: руководитель фирмы и пометка «… · размещение бесплатно» с зелёным сердечком (знак «некоммерческое», 12.10.2026) */
    line: s => { const o = s.org, h = o.head || {}, b = badgeOf(o);
      const fr = (o.fees || []).filter(f => f && f.name && isFinite(+f.sum) && f.sum !== '' && f.sum != null), min = fr.length ? Math.min(...fr.map(f => +f.sum)) : null;
      return (o.kind === 'firm' && h.name && !/уточн/i.test(h.name) ? `<div class="firm">руководитель: ${esc(h.name)}</div>` : '') + (b ? `<div class="free-line">${esc(b)}</div>` : '')
        + (o.kind !== 'firm' && fr.length ? `<div class="firm fee-line">${fr.length > 1 ? 'взносы от' : 'взнос'} ${typeof chf === 'function' ? chf(min) : 'CHF ' + min}${fr.length === 1 && fr[0].per ? ' ' + esc(fr[0].per) : ''}</div>` : ''); }
  };
})();
