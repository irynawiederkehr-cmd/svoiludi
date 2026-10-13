/* «Афиша организации» (решение Ирины 13.10.2026, 18:21: «отдельный документ для скачивания в PNG и PDF — расписание и эвенты именно этой компании…
   нажать на кнопку все эвенты компании и распечатать»). Один документ на организацию или специалиста: регулярные занятия таблицей по дням недели,
   ближайшие события и курсы, контакты и QR-код на эту же афишу на сайте. Скачать PDF (A4) и PNG, «Без цвета», «Все в календарь» (.ics).
   Всё считается в браузере человека, на сервер ничего не уходит. Данные — только из data/afisha.js (то, что организатор подтвердил).
   window.SVL_AFISHA_ORG.list(id, opt)  → { regular: [...], upcoming: [...] } — что попадёт в афишу (кнопку показываем, только если что-то есть)
   window.SVL_AFISHA_ORG.open(id, opt)   — окно с афишей и кнопками
   opt: { kind: 'org' | 'spec' (без него ищем сначала организацию, потом специалиста), drafts: true — показать и черновики «на подтверждении» (мой режим,
   предпросмотр лида по ссылке с ключом), sample: true — для образцов }
   Ссылка на афишу: svoiludi.ch/events/#afisha=<id> (у пробной карточки лида — #afisha=<id>.<ключ>, тогда видны и черновики).
   Это афиша, как флаер: без галочки G1 и без номера документа (правило «Скачивание документов»), с водяным знаком «Свои люди · svoiludi.ch».
   Язык — по <html lang>. Изменить вид афиши — только здесь. */
(function(){
  'use strict';
  var UK = /^uk/.test(document.documentElement.lang || '');
  var T = UK ? {
    brand: 'Свої люди у Швейцарії', kicker: 'АФІША І РОЗКЛАД', asof: 'станом на', reg: 'Регулярні заняття', up: 'Найближчі події та курси',
    th: ['День', 'Час', 'Заняття', 'Де', 'Для кого', 'Ціна'], noReg: 'Розклад занять скоро з’явиться тут.', noUp: 'Нові дати скоро з’являться — дивись на сайті за QR-кодом.',
    more: function(n){ return 'і ще ' + n + ' — на сайті за QR-кодом'; }, online: 'онлайн', start: 'початок', ct: 'Контакти', qr: 'Усі події, запис і зміни в розкладі — на сайті:',
    disc: 'Заняття й події проводить організатор. «Свої люди» не продають квитки й не відповідають за умови: уточнюй їх в організатора.',
    made: 'Створено на сайті проєкту «Свої люди»', wm: 'Свої люди · svoiludi.ch', sample: 'ЗРАЗОК · усе вигадане', draft: 'ПРОБНИЙ ВАРІАНТ · ще не на сайті',
    h: 'Афіша й розклад', p: 'Усі заняття й найближчі події на одному аркуші: роздрукуй, повісь у залі чи надішли батькам.',
    pdf: 'Завантажити PDF', png: 'Завантажити PNG', ics: 'Усе в календар', bw: 'Без кольору, для дешевого друку', share: 'Скопіювати посилання', cl: 'Закрити',
    busy: 'Готую афішу…', okPdf: 'PDF збережено.', okPng: 'Картинку збережено.', err: 'Не вдалося зібрати файл. Спробуй ще раз.', copied: 'Посилання скопійовано.',
    wd: ['неділя', 'понеділок', 'вівторок', 'середа', 'четвер', 'п’ятниця', 'субота'], wdS: ['нд', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    mon: ['січ', 'лют', 'бер', 'квіт', 'трав', 'черв', 'лип', 'серп', 'вер', 'жовт', 'лист', 'груд'],
    every2: 'раз на два тижні', monthly: function(n, w){ return n + '-й ' + w + ' місяця'; }, until: 'до', fname: 'svoi-lyudi-afisha-', none: 'Поки що немає занять і подій для афіші.'
  } : {
    brand: 'Свои люди в Швейцарии', kicker: 'АФИША И РАСПИСАНИЕ', asof: 'на', reg: 'Регулярные занятия', up: 'Ближайшие события и курсы',
    th: ['День', 'Время', 'Занятие', 'Где', 'Для кого', 'Цена'], noReg: 'Расписание занятий скоро появится здесь.', noUp: 'Новые даты скоро появятся — смотри на сайте по QR-коду.',
    more: function(n){ return 'и ещё ' + n + ' — на сайте по QR-коду'; }, online: 'онлайн', start: 'начало', ct: 'Контакты', qr: 'Все события, запись и изменения в расписании — на сайте:',
    disc: 'Занятия и события проводит организатор. «Свои люди» не продают билеты и не отвечают за условия: уточняй их у организатора.',
    made: 'Создано на сайте проекта «Свои люди»', wm: 'Свои люди · svoiludi.ch', sample: 'ОБРАЗЕЦ · всё вымышленное', draft: 'ПРОБНЫЙ ВАРИАНТ · ещё не на сайте',
    h: 'Афиша и расписание', p: 'Все занятия и ближайшие события на одном листе: распечатай, повесь в зале или отправь родителям.',
    pdf: 'Скачать PDF', png: 'Скачать PNG', ics: 'Всё в календарь', bw: 'Без цвета, для дешёвой печати', share: 'Скопировать ссылку', cl: 'Закрыть',
    busy: 'Готовлю афишу…', okPdf: 'PDF сохранён.', okPng: 'Картинка сохранена.', err: 'Не получилось собрать файл. Попробуй ещё раз.', copied: 'Ссылка скопирована.',
    wd: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'], wdS: ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'],
    mon: ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    every2: 'раз в две недели', monthly: function(n, w){ return n + '-й ' + w + ' месяца'; }, until: 'до', fname: 'svoi-lyudi-afisha-', none: 'Пока нет занятий и событий для афиши.'
  };
  var LIBS = ['/assets/lib/html2canvas.min.js', '/assets/lib/jspdf.umd.min.js', '/assets/lib/qrcode.js'];
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var today = (function(d){ return new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); })(new Date());
  var D = function(x){ return new Date(x + 'T12:00:00Z'); }, iso = function(d){ return d.toISOString().slice(0, 10); };
  var addDays = function(x, n){ return iso(new Date(D(x).getTime() + n * 864e5)); };
  var fmtD = function(x){ return x ? x.split('-').reverse().join('.') : ''; };

  /* те же правила повтора, что на «Событиях» и «Курсах» (weekly с interval, monthly «n-й день недели», except) */
  function occ(ev, from, to){
    var out = [], r = ev.repeat, until = r && r.until && r.until < to ? r.until : to;
    if (!r){ if ((ev.dateEnd || ev.date) >= from && ev.date <= to) out.push(ev.date); return out; }
    var step = r.interval || 1, ex = r.except || [], d = D(ev.date), x;
    if (r.freq === 'weekly'){ while (iso(d) <= until){ x = iso(d); if (x >= from && ex.indexOf(x) < 0) out.push(x); if (out.length > 400) break; d.setUTCDate(d.getUTCDate() + 7 * step); } }
    else if (r.freq === 'monthly'){
      var wd = d.getUTCDay(), nth = Math.ceil(d.getUTCDate() / 7), y = d.getUTCFullYear(), m = d.getUTCMonth();
      for (var i = 0; i < 120; i++){
        var first = new Date(Date.UTC(y, m, 1, 12)), dx = new Date(Date.UTC(y, m, 1 + ((wd - first.getUTCDay() + 7) % 7) + (nth - 1) * 7, 12));
        if (dx.getUTCMonth() === m){ x = iso(dx); if (x > until) break; if (x >= from && x >= ev.date && ex.indexOf(x) < 0) out.push(x); }
        m += step; y += Math.floor(m / 12); m %= 12;
      }
    }
    return out;
  }
  var lastDay = function(e){ return (e.repeat && e.repeat.until) || e.dateEnd || e.date; };
  var isDraft = function(e){ return e.status === 'на подтверждении' || e.status === 'на підтвердженні' || e.status === 'черновик'; };   // в украинских данных статус переведён

  /* карточка: организация (data/organizations.js) или специалист (data/specialists.js) */
  function cardOf(id, kind){
    var O = window.ORGANIZATIONS || [], S = window.SPECIALISTS || [], o, s;
    if (kind !== 'spec'){ for (var i = 0; i < O.length; i++) if (O[i].id === id){ o = O[i]; break; } if (o) return { kind: 'org', c: o }; }
    if (kind !== 'org'){ for (var j = 0; j < S.length; j++) if (S[j].id === id && !S[j].org){ s = S[j]; break; } if (s) return { kind: 'spec', c: s }; }
    return null;
  }
  var mine = function(e, id, kind){ return (e.organizers || []).some(function(x){ return kind === 'spec' ? x === id || (x && x.spec === id) : !!x && typeof x === 'object' && x.org === id; }); };

  function list(id, opt){
    opt = opt || {}; var k = cardOf(id, opt.kind); if (!k) return { regular: [], upcoming: [], card: null };
    var to = addDays(today, 400), reg = [], up = [];
    (window.AFISHA || []).forEach(function(e){
      if (!mine(e, id, k.kind) || e.type === 'promo') return;
      if (!(e.status === 'активен' || (opt.drafts && isDraft(e)))) return;
      if (e.sample && !k.c.sample) return;
      var next = occ(e, today, to)[0]; if (!next) return;
      var repeating = !!e.repeat && (e.kind === 'regular' || !e.sessions);
      if (repeating) reg.push({ e: e, d: next }); else up.push({ e: e, d: next, start: e.date < today ? '' : '' });
    });
    reg.sort(function(a, b){ var wa = (D(a.e.date).getUTCDay() + 6) % 7, wb = (D(b.e.date).getUTCDay() + 6) % 7; return wa - wb || String(a.e.time || '').localeCompare(String(b.e.time || '')) || a.e.title.localeCompare(b.e.title); });
    up.sort(function(a, b){ return a.d.localeCompare(b.d) || String(a.e.time || '').localeCompare(String(b.e.time || '')); });
    return { regular: reg, upcoming: up, card: k };
  }

  /* --- текст строк --- */
  var timeStr = function(e){ return e.time ? e.time + (e.timeEnd ? '–' + e.timeEnd : '') : ''; };
  var city = function(a){ return (String(a || '').match(/\d{4}\s+(.+)$/) || [, ''])[1]; };
  var where = function(e){ if (e.online && !e.address) return T.online; var v = e.venue ? e.venue + ', ' : ''; return v + (city(e.address) || e.address || '') + (e.online ? ' · ' + T.online : ''); };
  var price = function(e){ return (e.price || '') + (e.per && !/безкоштовно|бесплатно/i.test(e.price || '') ? ' ' + e.per : ''); };
  function dayCell(e){
    var r = e.repeat || {}, w = D(e.date).getUTCDay(), s = T.wd[w];
    if (r.freq === 'weekly' && r.interval === 2) s += '<small>' + T.every2 + '</small>';
    if (r.freq === 'monthly') s = '<span>' + T.monthly(Math.ceil(D(e.date).getUTCDate() / 7), T.wd[w]) + '</span>';
    if (r.until) s += '<small>' + T.until + ' ' + fmtD(r.until) + '</small>';
    return s;
  }

  /* --- лист A4 (794 × 1123 px при 96 dpi) --- */
  var CSS = '.afo{position:fixed;left:-10000px;top:0;width:794px;min-height:1123px;box-sizing:border-box;padding:46px 50px 34px;display:flex;flex-direction:column;gap:18px;background:#FFFCF8;color:#2F2924;font:13.5px/1.45 Manrope,"Segoe UI",system-ui,sans-serif}'
    + '.afo *{box-sizing:border-box}.afo a{color:#2F2924;text-decoration:none}'
    + '.afo-top{display:flex;justify-content:space-between;align-items:center;font-size:11.5px;color:#7A6E62;border-bottom:1.5px solid #E5D9C9;padding-bottom:10px}.afo-top b{font:400 17px/1 Forum,Georgia,serif;color:#4F5E3E}'
    + '.afo-hero{display:flex;gap:22px;align-items:center}.afo-hero img,.afo-hero .ph{width:104px;height:130px;object-fit:contain;border-radius:14px;background:#fff;border:1px solid #E5D9C9;flex:none}'
    + '.afo-k{font-size:11px;font-weight:700;letter-spacing:.16em;color:#B8472E}.afo-n{font:400 36px/1.05 Forum,Georgia,serif;margin:4px 0 6px}.afo-r{font:400 17px/1.3 Forum,Georgia,serif;color:#6E4F3C}'
    + '.afo-tag{display:inline-block;margin-top:8px;padding:4px 12px;border-radius:999px;background:#F3E3C2;color:#7A5A16;font-size:11px;font-weight:700;letter-spacing:.06em}'
    + '.afo h3{margin:6px 0 0;font:400 22px/1.2 Forum,Georgia,serif;color:#4F5E3E;display:flex;align-items:center;gap:10px}.afo h3::after{content:"";flex:1;height:1px;background:#E5D9C9}'
    + '.afo table{width:100%;border-collapse:collapse}.afo th{text-align:left;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#7A6E62;font-weight:700;padding:0 8px 6px}'
    + '.afo td{padding:9px 8px;border-top:1px solid #EFE6DA;vertical-align:top}.afo tr:nth-child(even) td{background:#F8F2E9}.afo td small{display:block;color:#7A6E62;font-size:11px}'
    + '.afo td.d{font-weight:700;text-transform:capitalize;width:108px}.afo td.t{white-space:nowrap;width:86px;font-weight:700;color:#4F5E3E}.afo td.p{white-space:nowrap}'
    + '.afo-ev{display:grid;grid-template-columns:62px 1fr auto;gap:4px 16px;padding:10px 0;border-top:1px solid #EFE6DA;align-items:center}'
    + '.afo-dt{width:62px;height:62px;border-radius:14px;background:#E3E8D6;color:#4F5E3E;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1}.afo-dt b{font:400 26px/1 Forum,Georgia,serif}.afo-dt small{font-size:11px;font-weight:700;text-transform:uppercase;margin-top:3px}'
    + '.afo-ev .tt{font-weight:700;font-size:14.5px}.afo-ev .mm{font-size:12px;color:#4A413A}.afo-ev .pr{font-weight:700;white-space:nowrap;text-align:right}'
    + '.afo-empty{color:#7A6E62;font-style:italic;padding:6px 0}'
    + '.afo-foot{margin-top:auto;display:grid;grid-template-columns:1fr auto;gap:18px;align-items:center;border-top:1.5px solid #E5D9C9;padding-top:14px}'
    + '.afo-ct{display:grid;grid-template-columns:80px 1fr;gap:3px 10px;font-size:12.5px}.afo-ct span{color:#7A6E62}'
    + '.afo-qr{display:flex;gap:12px;align-items:center;max-width:300px;font-size:11.5px;color:#4A413A}.afo-qr img{width:112px;height:112px;image-rendering:pixelated;flex:none}.afo-qr b{display:block;word-break:break-all;color:#2F2924}'
    + '.afo-disc{font-size:10.5px;color:#7A6E62;display:flex;justify-content:space-between;gap:16px}';

  function contactsOf(k){
    var c = k.c.contacts || {}, L = [];
    if (c.phone) L.push(['Телефон', c.phone]); if (c.whatsapp && c.whatsapp !== c.phone) L.push(['WhatsApp', c.whatsapp]);
    if (c.email) L.push(['E-mail', c.email]); if (c.site) L.push([UK ? 'Сайт' : 'Сайт', c.site.replace(/^https?:\/\//, '').replace(/\/$/, '')]);
    if (c.instagram) L.push(['Instagram', '@' + String(c.instagram).replace(/^https?:\/\/(www\.)?instagram\.com\//, '').replace(/^@/, '').replace(/\/$/, '')]);
    if (c.telegram){ var tg = String(c.telegram).replace(/^https?:\/\/t\.me\//, ''); L.push(['Telegram', /^\+\d/.test(tg) ? tg : /^\+/.test(tg) ? 't.me/' + tg : '@' + tg.replace(/^@/, '')]); }   // номер, ссылка-приглашение t.me/+… или ник
    return L.slice(0, 5);
  }
  var url = function(id, key){ return 'https://svoiludi.ch/' + (UK ? 'uk/' : '') + 'events/#afisha=' + encodeURIComponent(id) + (key ? '.' + encodeURIComponent(key) : ''); };
  function qr(text){ try { qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; var q = qrcode(0, 'M'); q.addData(text, 'Byte'); q.make(); return '<img src="' + q.createDataURL(4, 0) + '" alt="">'; } catch (_) { return ''; } }
  function imgOf(k){
    var c = k.c;
    if (k.kind === 'org' && c.logo) return '<img src="/img/org/' + esc(c.logo) + '" alt="">';
    if (k.kind === 'spec' && c.photo) return '<img src="' + (c.sample || !/^\//.test(c.photo) ? '/img/' : '') + esc(c.photo) + '" alt="" style="object-fit:cover">';
    return '';
  }
  function roleOf(k){ var c = k.c; return k.kind === 'org' ? (c.cats || []).join(' · ') : (c.role || ''); }

  function sheet(id, opt){
    var L = list(id, opt), k = L.card, c = k.c, MAXR = 12, MAXU = 7;
    var tag = c.sample ? T.sample : (c.status && c.status !== 'активен') ? T.draft : '';
    var hasP = L.regular.some(function(x){ return !!price(x.e); }), TH = hasP ? T.th : T.th.slice(0, 5);   // нет ни одной цены — колонку «Цена» не показываем
    var rows = L.regular.slice(0, MAXR).map(function(x){ var e = x.e; return '<tr><td class="d">' + dayCell(e) + '</td><td class="t">' + esc(timeStr(e)) + '</td><td><b>' + esc(e.title) + '</b></td><td>' + esc(where(e)) + '</td><td>' + esc(e.level || '') + '</td>' + (hasP ? '<td class="p">' + esc(price(e)) + '</td>' : '') + '</tr>'; }).join('');
    var evs = L.upcoming.slice(0, MAXU).map(function(x){ var e = x.e, d = D(x.d);
      return '<div class="afo-ev"><span class="afo-dt"><b>' + d.getUTCDate() + '</b><small>' + T.mon[d.getUTCMonth()] + '</small></span><span><div class="tt">' + esc(e.title) + '</div><div class="mm">' + esc([T.wdS[d.getUTCDay()] + (timeStr(e) ? ', ' + timeStr(e) : ''), where(e), e.level].filter(Boolean).join(' · ')) + (e.dateEnd && !e.repeat ? ' · ' + T.until + ' ' + fmtD(e.dateEnd) : '') + '</div></span><span class="pr">' + esc(price(e)) + '</span></div>'; }).join('');
    var moreR = L.regular.length - MAXR, moreU = L.upcoming.length - MAXU;
    return '<div class="afo-top"><b>🌿 ' + T.brand + '</b><span>' + T.asof + ' ' + fmtD(today) + '</span></div>'
      + '<div class="afo-hero">' + (imgOf(k) || '') + '<div><div class="afo-k">' + T.kicker + '</div><div class="afo-n">' + esc(c.name) + '</div><div class="afo-r">' + esc(roleOf(k)) + '</div>' + (tag ? '<span class="afo-tag">' + tag + '</span>' : '') + '</div></div>'
      + '<h3>' + T.reg + '</h3>' + (rows ? '<table><tr>' + TH.map(function(h){ return '<th>' + h + '</th>'; }).join('') + '</tr>' + rows + '</table>' + (moreR > 0 ? '<div class="afo-empty">' + T.more(moreR) + '</div>' : '') : '<div class="afo-empty">' + T.noReg + '</div>')
      + '<h3>' + T.up + '</h3>' + (evs ? evs + (moreU > 0 ? '<div class="afo-empty">' + T.more(moreU) + '</div>' : '') : '<div class="afo-empty">' + T.noUp + '</div>')
      + '<div class="afo-foot"><div><div style="font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#7A6E62;font-weight:700;margin-bottom:5px">' + T.ct + '</div><div class="afo-ct">' + contactsOf(k).map(function(r){ return '<span>' + r[0] + '</span><b>' + esc(r[1]) + '</b>'; }).join('') + '</div></div>'
      + '<div class="afo-qr">' + qr(url(id)) + '<span>' + T.qr + '<b>svoiludi.ch/' + (UK ? 'uk/' : '') + 'events/#afisha=' + esc(id) + '</b></span></div></div>'
      + '<div class="afo-disc"><span>' + T.disc + '</span><span style="white-space:nowrap">' + T.made + '</span></div>';
  }

  function loadLibs(){
    if (window.html2canvas && window.jspdf && window.qrcode) return Promise.resolve();
    return LIBS.reduce(function(p, src){ return p.then(function(){ return new Promise(function(ok, no){ var s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = function(){ no(new Error(src)); }; document.head.appendChild(s); }); }); }, Promise.resolve());
  }
  function wm(cv){   // водяной знак «Свои люди · svoiludi.ch», как у PDF и PNG сайта
    var c = cv.getContext('2d'), w = cv.width, h = cv.height, fs = Math.round(Math.max(w, h) * 0.024);
    c.save(); c.font = '700 ' + fs + 'px Manrope, sans-serif'; c.fillStyle = 'rgba(79,94,62,0.07)'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.translate(w / 2, h / 2); c.rotate(-Math.PI / 7);
    var sx = fs * 12, sy = fs * 6, R = Math.hypot(w, h) / 2 + sx; for (var y = -R, r = 0; y <= R; y += sy, r++) for (var x = -R + (r % 2) * sx / 2; x <= R; x += sx) c.fillText(T.wm, x, y); c.restore();
  }
  function gray(cv){ var c = cv.getContext('2d'), im = c.getImageData(0, 0, cv.width, cv.height), d = im.data; for (var i = 0; i < d.length; i += 4){ var v = Math.round(d[i] * .3 + d[i + 1] * .59 + d[i + 2] * .11); d[i] = d[i + 1] = d[i + 2] = v; } c.putImageData(im, 0, 0); }
  function render(id, opt, bw){
    var st = document.getElementById('afo-css'); if (!st){ st = document.createElement('style'); st.id = 'afo-css'; st.textContent = CSS; document.head.appendChild(st); }
    var node = document.createElement('div'); node.className = 'afo'; node.innerHTML = sheet(id, opt); document.body.appendChild(node);
    return Promise.all([].map.call(node.querySelectorAll('img'), function(im){ return im.complete ? 0 : new Promise(function(r){ im.onload = im.onerror = r; }); }))
      .then(function(){ return (document.fonts && document.fonts.ready) || 0; })
      .then(function(){ return html2canvas(node, { scale: 2, backgroundColor: '#FFFCF8', useCORS: true }); })
      .then(function(cv){ node.remove(); wm(cv); if (bw) gray(cv); return cv; }, function(e){ node.remove(); throw e; });
  }
  function save(blob, name){ var a = document.createElement('a'), u = URL.createObjectURL(blob); a.href = u; a.download = name; document.body.appendChild(a); a.click(); setTimeout(function(){ a.remove(); URL.revokeObjectURL(u); }, 4000); }
  var fname = function(id, ext){ return T.fname + id + '-' + today.replace(/-/g, '') + '.' + ext; };

  /* --- календарь (.ics): регулярные с RRULE, остальные — по датам --- */
  function ics(id, opt){
    var L = list(id, opt), ICS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'], x = function(s){ return String(s || '').replace(/[\\;,]/g, function(m){ return '\\' + m; }).replace(/\n/g, '\\n'); };
    var cp = function(d, t){ return d.replace(/-/g, '') + (t ? 'T' + t.replace(':', '') + '00' : ''); };
    var out = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//svoiludi.ch//afisha//RU', 'CALSCALE:GREGORIAN',
      'BEGIN:VTIMEZONE', 'TZID:Europe/Zurich', 'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0200', 'TZNAME:CEST', 'DTSTART:19700329T020000', 'RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU', 'END:DAYLIGHT',
      'BEGIN:STANDARD', 'TZOFFSETFROM:+0200', 'TZOFFSETTO:+0100', 'TZNAME:CET', 'DTSTART:19701025T030000', 'RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU', 'END:STANDARD', 'END:VTIMEZONE'];
    L.regular.concat(L.upcoming).forEach(function(o){
      var e = o.e, r = e.repeat;
      out.push('BEGIN:VEVENT', 'UID:' + e.id + '@svoiludi.ch', 'DTSTAMP:' + today.replace(/-/g, '') + 'T000000Z');
      if (e.time){ out.push('DTSTART;TZID=Europe/Zurich:' + cp(e.date, e.time), 'DTEND;TZID=Europe/Zurich:' + cp(e.date, e.timeEnd || e.time)); }
      else out.push('DTSTART;VALUE=DATE:' + cp(e.date), 'DTEND;VALUE=DATE:' + cp(addDays(e.dateEnd || e.date, 1)));
      if (r){ var rr = 'RRULE:FREQ=' + (r.freq === 'monthly' ? 'MONTHLY' : 'WEEKLY') + (r.interval ? ';INTERVAL=' + r.interval : '');
        if (r.freq === 'monthly') rr += ';BYDAY=' + Math.ceil(D(e.date).getUTCDate() / 7) + ICS[D(e.date).getUTCDay()];
        if (r.until) rr += ';UNTIL=' + cp(r.until) + 'T235959Z'; out.push(rr);
        if ((r.except || []).length) out.push('EXDATE' + (e.time ? ';TZID=Europe/Zurich:' + r.except.map(function(d){ return cp(d, e.time); }).join(',') : ';VALUE=DATE:' + r.except.map(function(d){ return cp(d); }).join(','))); }
      out.push('SUMMARY:' + x(e.title), 'LOCATION:' + x(e.online && !e.address ? T.online : (e.venue ? e.venue + ', ' : '') + (e.address || '')), 'DESCRIPTION:' + x((e.about || '') + '\n\n' + T.brand + ': ' + url(id)), 'URL:' + url(id), 'END:VEVENT');
    });
    out.push('END:VCALENDAR');
    var txt = out.map(function(line){ var o = '', s = line; while (s.length > 74){ o += s.slice(0, 74) + '\r\n '; s = s.slice(74); } return o + s; }).join('\r\n') + '\r\n';
    save(new Blob([txt], { type: 'text/calendar;charset=utf-8' }), fname(id, 'ics'));
  }

  /* --- окно --- */
  var BOX_CSS = '.afo-m{position:fixed;inset:0;z-index:2000;background:rgba(47,41,36,.55);display:flex;align-items:flex-start;justify-content:center;overflow:auto;padding:24px 12px}'
    + '.afo-b{background:#FFFCF8;border-radius:22px;max-width:860px;width:100%;padding:22px 20px 20px;box-shadow:0 20px 60px rgba(0,0,0,.25);font:15px/1.5 Manrope,system-ui,sans-serif;color:#2F2924}'
    + '.afo-b h2{margin:0 0 4px;font:400 26px/1.15 Forum,Georgia,serif}.afo-b p{margin:0 0 14px;color:#6F6458}'
    + '.afo-v{border:1px solid #E5D9C9;border-radius:14px;overflow:hidden;background:#F3ECE2;margin-bottom:14px}.afo-v img{display:block;width:100%;height:auto}'
    + '.afo-v .ld{padding:60px 16px;text-align:center;color:#7A6E62}.afo-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}'
    + '.afo-row label{display:flex;gap:8px;align-items:center;font-size:14px;margin:0 0 12px;width:100%}.afo-x{float:right;border:0;background:none;font-size:22px;cursor:pointer;color:#6F6458;line-height:1}'
    + '@media(max-width:520px){.afo-row .btn{flex:1 1 100%}}';   // на телефоне кнопки ровным столбиком
  var CUR = null;
  function open(id, opt){
    opt = opt || {};
    var L = list(id, opt); if (!L.card) return;
    if (!document.getElementById('afo-mcss')){ var st = document.createElement('style'); st.id = 'afo-mcss'; st.textContent = BOX_CSS; document.head.appendChild(st); }
    close();
    var m = document.createElement('div'); m.className = 'afo-m'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true');
    m.innerHTML = '<div class="afo-b"><button class="afo-x" type="button" data-afo="close" aria-label="' + T.cl + '">✕</button><h2>' + T.h + ' · ' + esc(L.card.c.name) + '</h2><p>' + T.p + '</p>'
      + '<div class="afo-v"><div class="ld">' + (L.regular.length + L.upcoming.length ? T.busy : T.none) + '</div></div>'
      + '<div class="afo-row"><label><input type="checkbox" data-afo="bw"> ' + T.bw + '</label>'
      + '<button class="btn" type="button" data-afo="pdf">' + T.pdf + '</button><button class="btn ghost" type="button" data-afo="png">' + T.png + '</button>'
      + (L.regular.length + L.upcoming.length ? '<button class="btn ghost" type="button" data-afo="ics">' + T.ics + '</button>' : '') + '<button class="btn ghost" type="button" data-afo="link">' + T.share + '</button></div></div>';
    (document.querySelector('dialog[open]') || document.body).appendChild(m);   // окно карточки — <dialog> поверх всего: афишу кладём внутрь него, иначе она окажется под ним
    CUR = { id: id, opt: opt, m: m, cv: null, bw: false };
    m.addEventListener('click', onClick); document.addEventListener('keydown', onKey);
    preview();
  }
  function preview(){
    var cur = CUR; if (!cur) return; var v = cur.m.querySelector('.afo-v');
    loadLibs().then(function(){ return render(cur.id, cur.opt, cur.bw); }).then(function(cv){ if (CUR !== cur) return; cur.cv = cv; v.innerHTML = '<img alt="" src="' + cv.toDataURL('image/png') + '">'; })
      .catch(function(){ v.innerHTML = '<div class="ld">' + T.err + '</div>'; });
  }
  function close(){ if (!CUR) return; CUR.m.remove(); document.removeEventListener('keydown', onKey); CUR = null; }
  function onKey(e){ if (e.key === 'Escape') close(); }
  function onClick(ev){
    var cur = CUR; if (!cur) return;
    if (ev.target === cur.m) return close();
    var b = ev.target.closest('[data-afo]'); if (!b) return; var a = b.getAttribute('data-afo');
    if (a === 'close') return close();
    if (a === 'bw'){ cur.bw = b.checked; cur.cv = null; cur.m.querySelector('.afo-v').innerHTML = '<div class="ld">' + T.busy + '</div>'; return preview(); }
    if (a === 'ics') return ics(cur.id, cur.opt);
    if (a === 'link'){ var u = url(cur.id); try { navigator.clipboard.writeText(u).then(function(){ b.textContent = T.copied; }); } catch (_) { prompt('', u); } return; }
    var go = function(cv){
      if (a === 'png') cv.toBlob(function(bl){ save(bl, fname(cur.id, 'png')); });
      if (a === 'pdf'){ var P = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' }), H = cv.height / cv.width * 210, f = H > 297 ? 297 / H : 1;
        P.addImage(cv.toDataURL('image/jpeg', .92), 'JPEG', (210 - 210 * f) / 2, 0, 210 * f, H * f); P.save(fname(cur.id, 'pdf')); }
    };
    if (cur.cv) go(cur.cv); else loadLibs().then(function(){ return render(cur.id, cur.opt, cur.bw); }).then(function(cv){ cur.cv = cv; go(cv); });
  }

  /* ссылка #afisha=<id> или #afisha=<id>.<ключ> (ключ пробной карточки: тогда видны и черновики) — на страницах «События» и «Курсы» */
  function sha(k){ try { return crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(k || ''))).then(function(b){ return Array.from(new Uint8Array(b)).map(function(x){ return x.toString(16).padStart(2, '0'); }).join(''); }); } catch (_) { return Promise.resolve(''); } }
  function fromHash(){
    var m = /^#afisha=([^&]+)/.exec(location.hash); if (!m) return;
    var p = decodeURIComponent(m[1]).split('.'), id = p[0], key = p[1] || '', k = cardOf(id); if (!k) return;
    var admin = false; try { admin = localStorage.getItem('svoiludi-admin') === '1'; } catch (_) {}
    (key && k.c.keyHash ? sha(key) : Promise.resolve('')).then(function(h){ open(id, { kind: k.kind, key: key, drafts: admin || (!!h && h === k.c.keyHash), sample: !!k.c.sample }); });
  }
  window.SVL_AFISHA_ORG = { list: list, open: open, url: url, close: close };
  if (/\/(events|kursy)\//.test(location.pathname)){ window.addEventListener('hashchange', fromHash); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fromHash); else fromHash(); }
})();
