/* «Организации» на движке справочника специалистов (решение Ирины 12.10.2026: «в организациях карточки должны быть идентичными карточкам
   специалистов со всеми лайками, сердечками, файлами для скачивания и проверкой; единственное — это организация, а дизайн и правила одинаковые»).
   Этот файл вставляется в organizacii/index.html (сборка — _i18n/organizacii_src/build.py) между данными и движком главной страницы:
   переводит карточки data/organizations.js в тот же вид, что у специалистов (window.SVL_ORG.items), и даёт направления, пометки и блоки организации.
   Данные организаций не меняются: правила полей — в шапке data/organizations.js. */
(function(){
  const ORGS = window.ORGANIZATIONS || [];
  /* значки направлений — из общей библиотеки значков (ICONS в первом скрипте страницы) */
  const DIRS = {
    help:     { t: 'Помощь и интеграция', c: '#4F5E3E', i: 'hands' },
    kids:     { t: 'Дети и школы',        c: '#B98324', i: 'dirKids' },
    culture:  { t: 'Общества и культура', c: '#C97E52', i: 'people' },
    business: { t: 'Деловые сообщества',  c: '#4F6F8F', i: 'dirBiz' },
    food:     { t: 'Еда и магазины',      c: '#A0523D', i: 'dirFood' },
    studio:   { t: 'Студии и досуг',      c: '#7A5A8C', i: 'dirSport' }
  };
  const cats = {}; Object.entries(DIRS).forEach(([k, d]) => { cats[k] = { t: d.t, g: 'org', c: d.c, i: d.i, s: [], w: [] }; });
  const FORMS = { 'Verein': 'ферайн (Verein)', 'Stiftung': 'фонд (Stiftung)', 'неформальная группа': 'неформальная группа', 'GmbH': 'ООО (GmbH)', 'AG': 'АО (AG)',
    'Einzelunternehmen': 'ИП (Einzelunternehmen)', 'Genossenschaft': 'кооператив (Genossenschaft)', 'другое': 'другая форма' };
  const KIND = { charity: 'Благотворительная организация', nonprofit: 'Некоммерческая организация', firm: 'Фирма' };
  const BADGE = { charity: 'Благотворительная организация · размещение бесплатно', nonprofit: 'Некоммерческая организация · размещение бесплатно' };
  const badgeOf = o => o.kind !== 'firm' && o.free === true ? (BADGE[o.kind] || BADGE.nonprofit) : '';
  const WHO = { S: 'Для людей со статусом S', kids: 'Для детей и подростков', adults: 'Для взрослых', women: 'Для женщин', business: 'Для предпринимателей' };
  const tags = Object.assign({ free: 'Для людей бесплатно' }, WHO, { firm: 'Фирма', npo: 'Благотворительная или некоммерческая' });
  const roleOf = o => [KIND[o.kind] || KIND.nonprofit, FORMS[o.form] || o.form].filter(Boolean).join(' · ');
  const tagsOf = o => { const w = o.for || [], t = (w.includes('all') ? Object.keys(WHO) : w.filter(x => WHO[x])).slice();
    if (o.free === true) t.unshift('free'); t.push(o.kind === 'firm' ? 'firm' : 'npo'); return t; };
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
    name: o.name, role: roleOf(o), firm: o.name_ru || '', photo: o.logo || '', cat: o.dir, cat2: o.dir2 || '', specs: [], tags: tagsOf(o),
    places: placesOf(o), online: !!o.online, onlineCH: o.onlineCH || '', onlineTier: o.onlineTier, tiers: o.tiers || [], paidUntil: o.paidUntil || '',
    langs: o.langs || [], about: o.about || '', services: o.offers || [], format: o.join || '', contacts: Object.assign({}, o.contacts || {}),
    prices: o.prices || [], pricesOk: !!o.pricesOk, pricesDate: o.pricesDate || ''
  }));
  const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const DISC = 'Карточку заполнила сама организация, она отвечает за её содержание. «Свои люди» не участвуют в работе организации и не отвечают за её помощь, курсы и события. Обо всём договаривайся напрямую с организацией.';
  const DISC_FIRM = 'Карточку заполнила сама фирма, она отвечает за её содержание. «Свои люди» не участвуют в работе фирмы и не отвечают за её товары, услуги и цены. Обо всём договаривайся напрямую с фирмой.';
  window.SVL_ORG = {
    items, cats, groups: { org: 'Направления организаций' }, tags,
    /* в окне карточки: пометка «размещение бесплатно» под названием */
    head: s => { const b = badgeOf(s.org); return b ? `<div class="free-line">${esc(b)}<button type="button" class="qh" data-help="badge" aria-label="Подсказка: размещение бесплатно" aria-expanded="false">?</button></div>` : ''; },
    /* в окне карточки, правая колонка: форма, взнос или цены, руководитель, «Важно» */
    side: s => { const o = s.org, h = o.head || {};
      return `<div class="d-block"><h4>Форма<button type="button" class="qh" data-help="form" aria-label="Подсказка: ферайн и фонд" aria-expanded="false">?</button></h4><span>${esc(FORMS[o.form] || o.form || '—')}</span></div>`
        + (o.fee ? `<div class="d-block"><h4>${o.kind === 'firm' ? 'Цены' : 'Взнос'}</h4><span>${esc(o.fee)}</span></div>` : '')
        + (h.name ? `<div class="d-block"><h4>Руководитель<button type="button" class="qh" data-help="head" aria-label="Подсказка: руководитель" aria-expanded="false">?</button></h4><span>${esc(h.name)}${h.role ? ' · ' + esc(h.role) : ''}</span>${h.spec ? `<p><a href="../#${esc(h.spec)}">Карточка в справочнике специалистов →</a></p>` : ''}</div>` : '')
        + `<div class="disc-box"><b>Важно</b><p>${esc(o.kind === 'firm' ? DISC_FIRM : DISC)}</p></div>`; },
    /* предпросмотр по ссылке (#preview=…): расписание и курсы организации, которые ждут подтверждения вместе с карточкой */
    main: s => { if (!/^#preview=/.test(location.hash) || location.hash.indexOf(s.id) < 0) return '';
      const L = (window.AFISHA || []).filter(e => e.status === 'на подтверждении' && (e.organizers || []).some(x => x && typeof x === 'object' && x.org === s.id));
      if (!L.length) return '';
      const MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
      const days = e => { const r = e.repeat || {}, out = [], ex = r.except || []; let d = new Date(e.date + 'T12:00:00'); const end = new Date((r.until || e.dateEnd || e.date) + 'T12:00:00');
        while (d <= end && out.length < 60){ const iso = d.toISOString().slice(0, 10); if (!ex.includes(iso)) out.push(iso); if (!r.freq) break; d = new Date(d.getTime() + 864e5 * 7 * (r.interval || 1)); }
        const by = {}; out.forEach(x => { const k = x.slice(0, 7); (by[k] = by[k] || []).push(+x.slice(8)); });
        return Object.entries(by).map(([k, v]) => v.join(', ') + ' ' + MON[+k.slice(5) - 1] + (k.slice(0, 4) !== out[0].slice(0, 4) ? ' ' + k.slice(0, 4) : '')).join(' · '); };
      return `<div class="d-block"><h4>Расписание — появится после подтверждения</h4>${L.map(e => `<p><b>${esc(e.title)}</b><br><small>${esc(days(e))}${e.time ? ' · ' + esc(e.time) : ''}</small></p>`).join('')}<p class="d-note">Это видите только вы. После подтверждения расписание появится во вкладке «Курсы» и в карточке организации.</p></div>`; },
    /* на карточке в списке: руководитель фирмы */
    line: s => { const o = s.org, h = o.head || {}; return o.kind === 'firm' && h.name ? `<div class="firm">руководитель: ${esc(h.name)}</div>` : ''; }
  };
})();
