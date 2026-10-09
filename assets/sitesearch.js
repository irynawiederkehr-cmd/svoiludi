/* Поиск по сайту в шапке (правило Ирины, 08.10.2026). Подключается из samesite.js на каждой странице.
   Ищет по разделам, статьям «Как устроена Швейцария» (вместе с немецкими, французскими и итальянскими словами),
   инструментам (data/search.js), а ещё по специалистам и событиям (data/specialists.js, data/afisha.js). */
(function(){
  if (window.SVL_SITESEARCH) return; window.SVL_SITESEARCH = true;
  var me = document.currentScript && document.currentScript.src || '';
  var BASE = me ? me.replace(/assets\/sitesearch\.js.*$/, '') : '/';
  var PV = typeof window.PV_BASE === 'string';
  var uk = document.documentElement.lang === 'uk';
  var T = uk ? {btn: 'Пошук', ph: 'Одне слово: податки, Kita, AHV…', none: 'Нічого не знайдено. Спробуй інше, коротше слово або німецьке слово з листа. Немає потрібної теми — <a href="mailto:voznesenskaya.iryna@gmail.com?subject=%D0%A2%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D1%82%D1%82%D1%96%20%D0%BD%D0%B0%20svoiludi.ch&body=%D0%94%D0%BE%D0%B1%D1%80%D0%B8%D0%B9%20%D0%B4%D0%B5%D0%BD%D1%8C%21%20%D0%AF%20%D0%BD%D0%B5%20%D0%B7%D0%BD%D0%B0%D0%B9%D1%88%D0%BB%D0%B0%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D1%96%20%D0%B2%D1%96%D0%B4%D0%BF%D0%BE%D0%B2%D1%96%D0%B4%D1%96%20%D0%BD%D0%B0%20%D0%BF%D0%B8%D1%82%D0%B0%D0%BD%D0%BD%D1%8F%3A%20">напиши нам</a>, ми підготуємо статтю.', close: 'Закрити', hint: 'Напиши одне слово українською, російською або німецьке слово з листа: податки, застава, Kita, Betreibung, AHV. Шукаємо в темах, інструментах, фахівцях і подіях. Enter — відкрити перше.', spec: 'Фахівці', ev: 'Події та курси'}
               : {btn: 'Поиск', ph: 'Одно слово: налоги, Kita, AHV…', none: 'Ничего не нашлось. Попробуй другое, более короткое слово или немецкое слово из письма. Нет нужной темы — <a href="mailto:voznesenskaya.iryna@gmail.com?subject=%D0%A2%D0%B5%D0%BC%D0%B0%20%D0%B4%D0%BB%D1%8F%20%D1%81%D1%82%D0%B0%D1%82%D1%8C%D0%B8%20%D0%BD%D0%B0%20svoiludi.ch&body=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%AF%20%D0%BD%D0%B5%20%D0%BD%D0%B0%D1%88%D0%BB%D0%B0%20%D0%BD%D0%B0%20%D1%81%D0%B0%D0%B9%D1%82%D0%B5%20%D0%BE%D1%82%D0%B2%D0%B5%D1%82%D0%B0%20%D0%BD%D0%B0%20%D0%B2%D0%BE%D0%BF%D1%80%D0%BE%D1%81%3A%20">напиши нам</a>, мы подготовим статью.', close: 'Закрыть', hint: 'Напиши одно слово по-русски или немецкое слово из письма: налоги, залог, Kita, Betreibung, AHV. Ищем по темам, инструментам, специалистам и событиям. Enter — открыть первое.', spec: 'Специалисты', ev: 'События и курсы'};
  function link(u){ // путь от корня сайта -> адрес с учётом предпросмотра
    var hash = '', i = u.indexOf('#'); if (i >= 0){ hash = u.slice(i); u = u.slice(0, i); }
    u = u.replace(/^\//, '');
    if (PV && (u === '' || /\/$/.test(u))) u += 'index.html';
    return BASE + u + hash;
  }
  var css = '.ss-btn{display:inline-flex;align-items:center;gap:6px;font:inherit;font-size:.9rem;font-weight:600;color:var(--ink,#2b2a26);background:var(--paper,#fffcf8);border:1.5px solid var(--line,#e4dccf);border-radius:999px;padding:7px 13px;cursor:pointer;line-height:1}'
    + '.ss-btn:hover{border-color:var(--brown,#6e4f3c)}.ss-btn svg{width:16px;height:16px;flex:none}'
    + '.ss-res .ss-none a{display:inline!important;padding:0!important;margin:0!important;border:0!important;background:none!important;box-shadow:none!important;min-height:0!important;text-decoration:underline;font-weight:700;color:var(--brown,#6e4f3c)}'
    + '.ss-ov{position:fixed;inset:0;z-index:1000;background:rgba(30,28,22,.42);display:flex;justify-content:center;align-items:flex-start;padding:max(12px,env(safe-area-inset-top)) 12px 12px}'
    + '.ss-box{width:min(680px,100%);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;background:var(--bg,#f4efe6);border-radius:22px;box-shadow:0 20px 60px -20px rgba(0,0,0,.5);overflow:hidden}'
    + '.ss-top{display:flex;gap:8px;align-items:center;padding:12px;border-bottom:1px solid var(--line,#e4dccf);background:var(--paper,#fffcf8)}'
    + '.ss-top input{flex:1;min-width:0;font:inherit;font-size:1.05rem;border:none;background:transparent;outline:none;padding:8px 6px;color:var(--ink,#2b2a26)}'
    + '.ss-x{font:inherit;font-size:1.5rem;line-height:1;border:none;background:none;cursor:pointer;color:var(--muted,#7a7468);padding:4px 8px}'
    + '.ss-res{overflow:auto;padding:6px 12px 14px}.ss-g{font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted,#7a7468);margin:12px 4px 6px}'
    + '.ss-res a{display:block;text-decoration:none;color:var(--ink,#2b2a26);background:var(--paper,#fffcf8);border:1px solid var(--line,#e4dccf);border-radius:14px;padding:10px 14px;margin-bottom:6px}'
    + '.ss-res a:hover,.ss-res a.on{border-color:var(--brown,#6e4f3c)}.ss-res b{display:block;font-size:.98rem}.ss-res span{display:block;font-size:.84rem;color:var(--muted,#7a7468);margin-top:2px}'
    + 'html.ss-open .pa-tabs,html.ss-open .pa-card{display:none!important}.ss-none,.ss-hint{color:var(--muted,#7a7468);font-size:.9rem;padding:12px 4px}.ss-res mark{background:#f3e3c2;color:inherit;border-radius:3px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M15.5 15.5L21 21" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  function addButton(){
    var btn = document.createElement('button'); btn.type = 'button'; btn.className = 'ss-btn'; btn.innerHTML = ICON + '<span>' + T.btn + '</span>'; btn.setAttribute('aria-label', T.btn);
    btn.addEventListener('click', open);
    var top = document.querySelector('header.top .page');
    if (top){ var cta = top.querySelector('.navcta'); if (cta) top.insertBefore(btn, cta); else top.appendChild(btn); return; }
    var jump = document.querySelector('a.jump');
    if (jump && jump.parentNode){ btn.style.marginLeft = '10px'; btn.style.verticalAlign = 'middle'; jump.parentNode.appendChild(btn); return; }
  }
  var IDX = null, loading = null;
  function load(src){ return new Promise(function(res){ var s = document.createElement('script'); s.src = BASE + src; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }
  function ensure(){
    if (IDX) return Promise.resolve(IDX);
    if (loading) return loading;
    var need = [];
    if (!window.SVL_SEARCH) need.push(load(uk ? 'data/search.uk.js' : 'data/search.js'));
    if (!window.SPECIALISTS) need.push(load(uk ? 'data/specialists.uk.js' : 'data/specialists.js'));
    if (!window.AFISHA) need.push(load(uk ? 'data/afisha.uk.js' : 'data/afisha.js'));
    loading = Promise.all(need).then(function(){
      var L = (window.SVL_SEARCH || []).slice();
      (window.SPECIALISTS || []).forEach(function(s){ if (!s || !s.name) return; if (s.status && /удал|архив|скрыт/i.test(s.status)) return;
        L.push({g: T.spec, t: s.name + (s.role ? ' — ' + s.role : ''), u: '/#' + s.id, d: [].concat(s.specs || []).join(', ').slice(0, 140), k: [s.cat, (s.tags || []).join(' '), JSON.stringify(s.places || ''), (s.langs || []).join(' '), s.about || ''].join(' ')}); });
      (window.AFISHA || []).forEach(function(e){ if (!e || !e.title) return; var sec = (e.sections && e.sections[0]) || 'events';
        L.push({g: T.ev, t: e.title, u: '/' + (sec === 'kursy' ? 'kursy' : 'events') + '/#' + e.id, d: [e.date, e.canton, e.online ? 'онлайн' : ''].filter(Boolean).join(' · '), k: [e.type, e.address, e.about, (e.langs || []).join(' ')].join(' ')}); });
      L.forEach(function(it){ it._t = norm(it.t); it._a = norm([it.t, it.d, it.k].join(' ')); });
      IDX = L; return L;
    });
    return loading;
  }
  function norm(s){ return String(s || '').toLowerCase().replace(/ё/g, 'е').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[«»"'’().,:;!?/\\-]/g, ' '); }
  function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]; }); }
  function search(q){
    var words = norm(q).split(/\s+/).filter(function(w){ return w.length > 1 || /\d/.test(w); });
    if (!words.length) return [];
    var out = [];
    IDX.forEach(function(it){
      var sc = 0, ok = words.every(function(w){
        var stem = w.length > 5 ? w.slice(0, w.length - 2) : w; // простое отсечение окончаний: налоги → нало
        if (it._t.indexOf(stem) >= 0){ sc += it._t.indexOf(stem) === 0 ? 6 : 4; return true; }
        if (it._a.indexOf(stem) >= 0){ sc += 1; return true; }
        return false; });
      if (ok) out.push([sc + (it.g === 'Разделы' ? 1 : 0), it]);
    });
    out.sort(function(a, b){ return b[0] - a[0]; });
    return out.slice(0, 40).map(function(x){ return x[1]; });
  }
  var ov, inp, res, sel = 0, last = [];
  function render(){
    var q = inp.value.trim();
    if (!q){ res.innerHTML = '<div class="ss-hint">' + T.hint + '</div>'; last = []; return; }
    ensure().then(function(){
      last = search(q); sel = 0;
      if (!last.length){ res.innerHTML = '<div class="ss-none">' + T.none + '</div>'; return; }
      var html = '', g = null;
      last.forEach(function(it, i){ if (it.g !== g){ g = it.g; html += '<div class="ss-g">' + esc(g) + '</div>'; }
        html += '<a href="' + esc(link(it.u)) + '"' + (i === 0 ? ' class="on"' : '') + '><b>' + esc(it.t) + '</b>' + (it.d ? '<span>' + esc(it.d) + '</span>' : '') + '</a>'; });
      res.innerHTML = html;
    });
  }
  function open(){
    if (!ov){
      ov = document.createElement('div'); ov.className = 'ss-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', T.btn);
      ov.innerHTML = '<div class="ss-box"><div class="ss-top">' + ICON.replace('<svg', '<svg width="20" height="20" style="flex:none;color:var(--muted,#7a7468)"') + '<input type="text" inputmode="search" autocomplete="off" enterkeyhint="search" placeholder="' + esc(T.ph) + '"><button type="button" class="ss-x" aria-label="' + T.close + '">×</button></div><div class="ss-res"></div></div>';
      document.body.appendChild(ov);
      inp = ov.querySelector('input'); res = ov.querySelector('.ss-res');
      ov.addEventListener('click', function(e){ if (e.target === ov || e.target.closest('.ss-x')) close(); });
      var t; inp.addEventListener('input', function(){ clearTimeout(t); t = setTimeout(render, 120); });
      inp.addEventListener('keydown', function(e){
        var links = res.querySelectorAll('a');
        if (e.key === 'Enter'){ e.preventDefault(); if (links.length) location.href = links[Math.min(sel, links.length - 1)].href; else ensure().then(function(){ render(); setTimeout(function(){ var l = res.querySelectorAll('a'); if (l.length && !l[0].closest('.ss-none')) location.href = l[0].href; }, 60); }); }
        if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && links.length){ e.preventDefault(); links[sel] && links[sel].classList.remove('on'); sel = (sel + (e.key === 'ArrowDown' ? 1 : -1) + links.length) % links.length; links[sel].classList.add('on'); links[sel].scrollIntoView({block: 'nearest'}); }
      });
    }
    ov.style.display = 'flex'; document.documentElement.style.overflow = 'hidden'; document.documentElement.classList.add('ss-open');
    try { inp.focus({preventScroll: true}); } catch (x) { inp.focus(); }   // сразу, в том же нажатии: иначе на iPhone в приложении клавиатура не открывается (09.10.2026)
    render(); setTimeout(function(){ if (document.activeElement !== inp) inp.focus(); }, 30); ensure();
  }
  function close(){ if (ov){ ov.style.display = 'none'; document.documentElement.style.overflow = ''; document.documentElement.classList.remove('ss-open'); } }
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && ov && ov.style.display !== 'none') close();
    if (e.key === '/' && !/input|textarea|select/i.test((e.target && e.target.tagName) || '') && !(e.target && e.target.isContentEditable)){ e.preventDefault(); open(); }
  });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addButton); else addButton();
})();
