/* Заявка на сайте (svoiludi.ch, 10.10.2026; решение Ирины: «пусть регистрируются на сайте сразу или пишут на мейл»).
   Общий движок для форм заявок: события, курсы, вакансии. В файле нет текста для людей — все надписи стоят в HTML
   страницы (атрибуты data-* и скрытые абзацы), поэтому украинская страница получает их переводом страницы, а сам файл общий.
   Форма ничего не отправляет на сервер: «Отправить заявку» открывает готовое письмо на адрес из data-mail.
   Черновик хранится только в браузере (localStorage, ключ svoi-zayavka-<имя формы>), «Удалить историю» стирает его.
   Галочка согласия (вопрос Ирины 10.10.2026, 20:37): <div class="zok"><input type="checkbox" data-z="ok" id="…"><label for="…">…</label></div>
   над кнопкой; пока её нет, кнопка серая, а нажатие подсвечивает галочку (data-t-ok). В письмо — строка data-t-okline + дата и время.
   Галочка в черновик не сохраняется: её ставят каждый раз перед отправкой.

   Разметка:
   <section class="zform" id="zayavka" data-zayavka="event" data-mail="…" data-subject="…" data-hello="…" data-from="…"
            data-t-miss="…" data-t-mail="…" data-t-wiped="…" data-t-copied="…" data-t-copyfail="…">
     <div class="zfg">
       <div class="zf"><label for="z-…">Подпись <s>*</s></label><input id="z-…" data-a="Подпись в письме" data-req></div>
       <div class="zf"><label>Языки</label><div class="zchk" data-l="Языки"><label><input type="checkbox" value="…">…</label>…</div></div>
     </div>
     <div class="acts"><button class="btn" type="button" data-z="send">…</button></div>
     <p class="zmsg" data-z="msg" hidden></p>
     <p class="zmsg" data-z="sent" hidden>… <a data-z="gmail" target="_blank" rel="noopener">…</a> … <button class="lnk" type="button" data-z="copy">…</button> …</p>
     <p class="zdraft" data-z="idle">… <button class="lnk" type="button" data-z="wipe">…</button></p>
     <p class="zdraft" data-z="ask" hidden>… <button class="lnk" type="button" data-z="yes">…</button><button class="lnk" type="button" data-z="no">…</button></p>
   </section>

   ПРИВЯЗКА К КАРТОЧКЕ ПО UID (решение Ирины 10.10.2026, вечер: «связано через номер … данные должны автоматически заполняться,
   вручную их заполнять не нужно и нельзя»). Кто уже есть в справочнике (карточка специалиста) или в «Организациях»,
   вводит свой UID (CHE-123.456.789) или номер карточки (SG-0001 у специалистов, OR-0001 у организаций) — форма находит
   карточку прямо в браузере в data/specialists.js и data/organizations.js (только опубликованные карточки), показывает её
   данные только для чтения и прячет поля, которые из карточки уже известны. Номер никуда не отправляется.
   Подтверждение записи потом приходит на e-mail из карточки (как подтверждение самой карточки), поэтому чужой номер ничего не даст.

   <div class="zlook" data-zlook data-kinds="spec,org" data-t-…="…">        — блок поиска (подписи — data-t-*, см. T(…) ниже)
     <div class="zf"><label for="z-…-find">…</label><div class="zlrow"><input id="z-…-find" data-zl="q"><button class="btn" type="button" data-zl="find">…</button></div><small>…</small></div>
     <p class="zmsg" data-zl="msg" hidden></p><div data-zl="prof" hidden></div><p class="zmsg" data-zl="nouid" hidden>…</p>
   </div>
   data-zown            — поле только для тех, у кого карточки нет (имя организатора, UID, контакт): с карточкой прячется
   data-zcard           — поле только для тех, у кого карточка есть (другой адрес, другой телефон, другой e-mail)
   data-miss="…"        — как назвать поле в «Не заполнены обязательные поля: …», если подпись в письме длинная
   data-zif="id:знач"   — поле видно, только когда в списке #id выбрано «знач» (например, «Другой адрес»)
   select[data-zaddr]   — список «Где»: сверху сами встают адреса из карточки, ниже — варианты из HTML (data-keep)
                          подпись адреса — data-t-card="{a} — адрес из карточки"
   .zchk[data-zlangs]   — языки: если ничего не отмечено, отмечаются языки из карточки
   option[data-zuidonly] — вариант только для карточек с UID (платное событие); без UID он недоступен и виден data-zl="nouid"
   input[data-zuid]     — поле UID для тех, у кого карточки нет: если такой UID есть в справочнике, форма сама подставит карточку
   input[data-zdup]     — UID новой организации: если организация с ним уже есть — предупреждение в [data-zdupmsg] (data-t-duporg, {n} — название),
                          если это UID специалиста — его карточка подставляется как руководитель (data-t-dupspec)
   [data-zfill="name|ref|uid|num|email|phone"] — поле получает значение из карточки и становится только для чтения
                          (для форм со своим движком, например заявка организации: руководитель из справочника)
   Блок поиска работает и вне [data-zayavka]: корнем тогда служит ближайший [data-zlook-root]. */
(function(){
  if (window.SVL_ZAYAVKA) return;
  window.SVL_ZAYAVKA = true;
  var BASE = (function(){ var s = document.currentScript && document.currentScript.src; return s ? s.replace(/assets\/zayavka\.js.*$/, '') : '/'; })();
  var css = document.createElement('style');
  css.textContent = ''
    + '.zform{background:var(--paper,#FFFCF8);border:1.5px solid var(--line,#D9DFCB);border-radius:24px;padding:clamp(18px,3vw,30px);margin:22px 0 10px;scroll-margin-top:90px}'
    + '.zform h2{margin:0 0 4px}.zform .zhint{color:var(--muted,#7A6E62);margin:0 0 18px;font-size:.95rem;max-width:66ch}'
    + '.zfg{display:grid;grid-template-columns:1fr;gap:14px;max-width:640px}'
    + '.zf{display:flex;flex-direction:column;gap:7px;min-width:0}'
    + '.zf[hidden],.zlook [hidden],[data-zlook-root] [hidden]{display:none!important}'
    + '.zf>label{font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#7A6E62);display:flex;align-items:center;flex-wrap:wrap}'
    + '.zf>label s{text-decoration:none;color:var(--mustard,#B98324);margin-left:4px}'
    + '.zf input:not([type=checkbox]),.zf select,.zf textarea{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;color:var(--ink,#2F2924);background:var(--bg,#F6F1EA);border:1.5px solid var(--line,#D9DFCB);border-radius:14px;padding:12px 14px;min-height:50px}'
    + '.zf textarea{resize:vertical;line-height:1.45}'
    + '.zf input:focus,.zf select:focus,.zf textarea:focus{border-color:var(--brown,#4F5E3E);outline:none}'
    + '.zf.zmiss input,.zf.zmiss select,.zf.zmiss textarea{border-color:#C0392B}'
    + '.zf small{color:var(--muted,#7A6E62);font-size:.82rem}.zf small a{color:var(--ink,#2F2924);font-weight:600}'
    + '.zchk{display:flex;flex-wrap:wrap;gap:8px}'
    + '.zchk label{font-size:.92rem;font-weight:600;color:var(--ink,#2F2924);background:var(--bg,#F6F1EA);border:1.5px solid var(--line,#D9DFCB);border-radius:12px;padding:7px 13px;cursor:pointer;display:inline-flex;gap:7px;align-items:center}'
    + '.zchk input{accent-color:var(--brown,#4F5E3E);width:auto;min-height:0;padding:0;margin:0}'
    + '.zchk label:has(input:checked){border-color:var(--brown,#4F5E3E);background:var(--soft,#E3E8D6)}'
    + '.zform .acts{display:flex;flex-wrap:wrap;gap:8px;margin-top:18px}'
    + '.zmsg{margin:12px 0 0;font-size:.92rem;color:var(--brown,#4F5E3E);font-weight:600;max-width:66ch}'
    + '.zmsg a,.zmsg .lnk,.zdraft .lnk,.zp .lnk{font:inherit;font-weight:700;color:var(--brown,#4F5E3E);background:none;border:0;padding:0;text-decoration:underline;cursor:pointer}'
    + '.zdraft{font-size:.88rem;color:var(--muted,#7A6E62);margin:14px 0 0;line-height:1.5;max-width:66ch}.zdraft .lnk+.lnk{margin-left:12px}'
    + '.zform .note{margin-top:10px;max-width:66ch}'
    + '.zok{display:flex;gap:10px;align-items:flex-start;box-sizing:border-box;max-width:640px;background:var(--soft,#E3E8D6);border:1.5px solid var(--line,#D9DFCB);border-radius:12px;padding:12px 14px;margin:18px 0 0;font-size:.92rem;line-height:1.5;color:var(--ink,#2F2924)}'
    + '.zok input{width:22px;height:22px;flex:none;margin:1px 0 0;accent-color:var(--brown,#4F5E3E);cursor:pointer}'
    + '.zok label{cursor:pointer;flex:1;min-width:0}.zok a{color:var(--brown,#4F5E3E);font-weight:600}'
    + '.zok.need{border-color:var(--mustard,#B98324);box-shadow:0 0 0 3px rgba(185,131,36,.28)}'
    + '.zform.zok-off [data-z=send]{opacity:.45;filter:grayscale(1);cursor:not-allowed}'
    /* поиск карточки */
    + '.zlook{max-width:640px;margin:0 0 16px;padding:14px 16px;border:1.5px dashed var(--brown,#4F5E3E);border-radius:18px;background:color-mix(in srgb,var(--soft,#E3E8D6) 45%,var(--paper,#FFFCF8))}'
    + '.zlook .zmsg{margin-top:10px}'
    + '.zlrow{display:flex;gap:8px;align-items:stretch}.zlrow input{flex:1;min-width:0}.zlrow .btn{margin:0;flex:none;white-space:nowrap;justify-content:center;text-align:center}'
    + '.zpick{display:flex;flex-direction:column;gap:8px;margin-top:10px}'
    + '.zpick button{font:inherit;text-align:left;cursor:pointer;background:var(--paper,#FFFCF8);border:1.5px solid var(--line,#D9DFCB);border-radius:14px;padding:10px 14px;color:var(--ink,#2F2924)}'
    + '.zpick button:hover{border-color:var(--brown,#4F5E3E)}.zpick small{display:block;color:var(--muted,#7A6E62);font-size:.82rem}'
    + '.zp{background:var(--paper,#FFFCF8);border:1.5px solid var(--brown,#4F5E3E);border-radius:16px;padding:14px 16px;text-align:left}'
    + '.zp-top{display:flex;gap:12px;align-items:center}'
    + '.zp-top img{width:52px;height:64px;object-fit:cover;border-radius:10px;background:var(--soft,#E3E8D6);flex:none}'
    + '.zp-ini{width:52px;height:52px;border-radius:50%;background:var(--soft,#E3E8D6);display:grid;place-items:center;font-weight:700;color:var(--brown,#4F5E3E);flex:none}'
    + '.zp-k{display:block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--brown,#4F5E3E)}'
    + '.zp-top b{display:block;font-size:1.08rem;line-height:1.25}.zp-top small{display:block;color:var(--muted,#7A6E62);font-size:.86rem}'
    + '.zp-dl{display:grid;gap:6px;margin:12px 0 0;font-size:.92rem}.zp-dl div{display:grid;grid-template-columns:140px 1fr;gap:8px}'
    + '.zp-dl dt{color:var(--muted,#7A6E62)}.zp-dl dd{margin:0;font-weight:600;overflow-wrap:anywhere}'
    + '.zp-note{margin:12px 0 0;font-size:.86rem;color:var(--muted,#7A6E62);line-height:1.5}'
    + '.zp .lnk{margin-top:10px;display:inline-block}'
    + '.zf input.zlocked,.zf textarea.zlocked,[data-zlook-root] input.zlocked,[data-zlook-root] textarea.zlocked{background:var(--soft,#E3E8D6);color:var(--muted,#7A6E62);cursor:default}'
    + '@media (max-width:520px){.zp-dl div{grid-template-columns:1fr;gap:0}.zlrow{flex-direction:column}}'
    + '@media print{.zform{display:none!important}}';
  document.head.appendChild(css);

  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var arr = function(x){ return Array.prototype.slice.call(x); };
  var hiddenEl = function(el){ return !!el.closest('[hidden]'); };
  var say0 = function(t){ if (typeof window.toast === 'function') window.toast(t); };

  /* ---------- поиск карточки по UID или номеру ---------- */
  var TODAY = new Date().toISOString().slice(0, 10);
  var digits = function(x){ return String(x || '').replace(/\D/g, ''); };
  var REG = ['Verein', 'Stiftung', 'Genossenschaft', 'GmbH', 'AG', 'Einzelunternehmen'];
  function parseQ(q){
    q = String(q || '').toUpperCase().replace(/\s+/g, '');
    var m = q.match(/^(SG|OR)-?0*(\d{1,5})$/);
    if (m) return { num: m[1] + '-' + ('0000' + m[2]).slice(-4) };
    var d = digits(q);
    if (d.length === 9 && /^(CHE)?[\d.\-]+(MWST|TVA|IVA|VAT|HR)?$/.test(q)) return { uid: d };
    return null;
  }
  function records(kinds){
    var r = [];
    if (kinds.indexOf('spec') >= 0) (window.SPECIALISTS || []).forEach(function(s){
      if (s.status !== 'активен' || (s.paidUntil && s.paidUntil < TODAY)) return;
      var c = s.contacts || {};
      r.push({ t: 'spec', id: s.id, name: s.name, sub: [s.role, s.firm].filter(Boolean).join(' · '), uid: s.uid || '', num: s.num || '',
        places: (s.places || []).filter(function(p){ return p.address && !p.area; }).map(function(p){ return p.address; }),
        phone: c.phone || '', email: c.email || '', site: c.site || '', langs: s.langs || [], photo: s.photo || '', sample: !!s.sample,
        paid: !!s.uid, url: 'https://svoiludi.ch/#' + s.id });
    });
    if (kinds.indexOf('org') >= 0) (window.ORGANIZATIONS || []).forEach(function(o){
      if (o.status !== 'активен' || !o.confirm) return;
      var c = o.contacts || {}, uid = /CHE/i.test(o.zefix || '') ? o.zefix : '';
      r.push({ t: 'org', id: o.id, name: o.name, sub: [o.name_ru, o.form].filter(Boolean).join(' · '), uid: uid, num: o.num || '',
        places: o.address ? [o.address] : [], phone: c.phone || '', email: c.email || '', site: c.site || '', langs: o.langs || [], photo: '',
        sample: !!o.sample, paid: !!uid || REG.indexOf(o.form) >= 0, url: 'https://svoiludi.ch/organizacii/#' + o.id });
    });
    return r;
  }
  function findCards(q, kinds){
    var p = parseQ(q); if (!p) return null;
    return records(kinds).filter(function(r){ return p.num ? r.num.toUpperCase() === p.num : digits(r.uid) === p.uid; });
  }

  function look(lk, root, onChange){
    var kinds = (lk.getAttribute('data-kinds') || 'spec,org').split(',');
    var T = function(k){ return lk.getAttribute('data-t-' + k) || ''; };
    var g = function(z){ return lk.querySelector('[data-zl="' + z + '"]'); };
    var q = g('q'), msg = g('msg'), prof = g('prof'), nouid = g('nouid'), row = q.closest('.zf');
    var name = root.getAttribute('data-zayavka') || lk.getAttribute('data-zlook') || 'form';
    var KEY = 'svoi-zayavka-' + name + '-card';
    var CUR = null, LIST = [];
    var tell = function(t){ msg.innerHTML = t; msg.hidden = !t; };

    function refresh(){
      arr(root.querySelectorAll('[data-zown],[data-zcard],[data-zif]')).forEach(function(el){
        var vis = true;
        if (el.hasAttribute('data-zown') && CUR) vis = false;
        if (el.hasAttribute('data-zcard') && !CUR) vis = false;
        var c = el.getAttribute('data-zif');
        if (vis && c){ var p = c.split(':'), s = root.querySelector('#' + p[0]); vis = !!s && s.value === p[1]; }
        el.hidden = !vis;
      });
    }
    function photo(r){
      if (!r.photo) return '<span class="zp-ini">' + esc((r.name || '?').trim().charAt(0)) + '</span>';
      var src = (window.SP_IMG && window.SP_IMG[r.photo]) || BASE + 'img/' + r.photo;
      return '<img src="' + esc(src) + '" alt="" loading="lazy">';
    }
    function row2(k, v){ v = [].concat(v || []).filter(Boolean); return v.length ? '<div><dt>' + esc(T(k)) + '</dt><dd>' + v.map(esc).join('<br>') + '</dd></div>' : ''; }
    function render(r){
      return '<div class="zp"><div class="zp-top">' + photo(r) + '<div><span class="zp-k">' + esc(T(r.t === 'org' ? 'korg' : 'kspec')) + (r.sample ? ' · ' + esc(T('sample')) : '') + '</span><b>' + esc(r.name) + '</b>' + (r.sub ? '<small>' + esc(r.sub) + '</small>' : '') + '</div></div>'
        + '<dl class="zp-dl">' + row2('uid', r.uid) + row2('num', r.num) + row2('addr', r.places) + row2('phone', r.phone) + row2('mail', r.email) + row2('site', r.site) + '</dl>'
        + '<p class="zp-note">' + esc(T('locked')) + '</p>'
        + (T('to') ? '<p class="zp-note">' + (r.email ? esc(T('to')) + ' <b>' + esc(r.email) + '</b>.' : esc(T('noemail'))) + '</p>' : '')
        + '<button class="lnk" type="button" data-zl="change">' + esc(T('change')) + '</button></div>';
    }
    function setLangs(r){
      arr(root.querySelectorAll('.zchk[data-zlangs]')).forEach(function(c){
        if (c.querySelector('input:checked')) return;
        arr(c.querySelectorAll('input')).forEach(function(x){
          var t = x.parentNode.textContent.trim().toLowerCase().slice(0, 4);
          if (r.langs.some(function(l){ return String(l).toLowerCase().slice(0, 4) === t; })) x.checked = true;
        });
      });
    }
    function addrs(r){
      arr(root.querySelectorAll('select[data-zaddr]')).forEach(function(s){
        arr(s.querySelectorAll('option.zgen')).forEach(function(o){ o.remove(); });
        if (!r) return;
        var first = s.querySelector('option[data-keep]:not([value=""])') || null, tpl = s.getAttribute('data-t-card') || '{a}';
        r.places.forEach(function(a){ var o = document.createElement('option'); o.className = 'zgen'; o.value = a; o.textContent = tpl.replace('{a}', a); s.insertBefore(o, first); });
        if (!s.value && r.places.length === 1) s.value = r.places[0];
      });
    }
    function fills(r){
      arr(root.querySelectorAll('[data-zfill]')).forEach(function(el){
        if (r){ var k = el.getAttribute('data-zfill'); el.value = k === 'ref' ? ref(r) : (r[k] || ''); el.readOnly = true; el.classList.add('zlocked'); }
        else if (el.readOnly){ el.value = ''; el.readOnly = false; el.classList.remove('zlocked'); }
      });
    }
    function paid(r){
      arr(root.querySelectorAll('option[data-zuidonly]')).forEach(function(o){
        o.disabled = !!r && !r.paid;
        if (o.disabled && o.selected) o.parentNode.value = '';
      });
      if (nouid) nouid.hidden = !r || r.paid;
    }
    function ref(r){ return [r.name + (r.sub ? ' (' + r.sub + ')' : ''), r.num, r.uid ? 'UID ' + r.uid : '', r.url].filter(Boolean).join(', ') + (r.sample ? ' — ' + T('sample') : ''); }
    function apply(r, quiet){
      CUR = r; root._zcard = r; root.classList.add('zhas');
      prof.innerHTML = render(r); prof.hidden = false; row.hidden = true;
      addrs(r); fills(r); paid(r); setLangs(r); refresh();
      try { localStorage.setItem(KEY, r.t + ':' + r.id); } catch (e) {}
      if (!quiet) tell('');
      if (onChange) onChange(r);
    }
    function clear(){
      CUR = null; root._zcard = null; root.classList.remove('zhas');
      prof.hidden = true; prof.innerHTML = ''; row.hidden = false; q.value = ''; tell('');
      addrs(null); fills(null); paid(null); refresh();
      try { localStorage.removeItem(KEY); } catch (e) {}
      if (onChange) onChange(null);
    }
    function search(){
      var v = q.value.trim();
      if (!v){ tell(esc(T('empty'))); q.focus(); return; }
      var res = findCards(v, kinds);
      if (res === null){ tell(esc(T('format'))); q.focus(); return; }
      if (!res.length){ tell(esc(T('none'))); return; }
      if (res.length === 1){ apply(res[0]); return; }
      LIST = res;
      tell(esc(T('many')) + '<span class="zpick">' + res.map(function(r, i){ return '<button type="button" data-zpick="' + i + '"><b>' + esc(r.name) + '</b><small>' + esc([T(r.t === 'org' ? 'korg' : 'kspec'), r.sub, r.num].filter(Boolean).join(' · ')) + '</small></button>'; }).join('') + '</span>');
    }
    g('find').addEventListener('click', search);
    q.addEventListener('keydown', function(e){ if (e.key === 'Enter'){ e.preventDefault(); search(); } });
    lk.addEventListener('click', function(e){
      var p = e.target.closest('[data-zpick]'); if (p){ apply(LIST[+p.getAttribute('data-zpick')]); return; }
      if (e.target.closest('[data-zl="change"]')){ clear(); q.focus(); }
    });
    root.addEventListener('change', function(e){
      if (e.target.tagName === 'SELECT') refresh();
      if (!CUR && e.target.matches && e.target.matches('[data-zuid]')) auto(e.target);
      if (e.target.matches && e.target.matches('[data-zdup]')) dup(e.target);
    });
    /* заявка организации: такой UID уже есть на сайте? организация — предупреждаем, специалист — подставляем руководителя */
    function dup(el){
      var out = el.parentNode.querySelector('[data-zdupmsg]'); if (!out) return;
      var res = findCards(el.value, ['spec', 'org']) || [], o = res.filter(function(r){ return r.t === 'org'; }), sp = res.filter(function(r){ return r.t === 'spec'; });
      var link = function(r){ return '<a href="' + esc(r.url) + '" target="_blank" rel="noopener">' + esc(r.name) + '</a>'; };
      if (o.length){ out.innerHTML = esc(T('duporg')).replace('{n}', link(o[0])); out.hidden = false; return; }
      if (sp.length === 1 && kinds.indexOf('spec') >= 0 && (!CUR || CUR.id === sp[0].id)){
        if (!CUR) apply(sp[0], true);
        out.innerHTML = esc(T('dupspec')).replace('{n}', link(sp[0])); out.hidden = false; return;
      }
      out.hidden = true; out.innerHTML = '';
    }
    /* человек с карточкой вписал свой UID вручную — подставляем карточку сами */
    function auto(el){
      var res = findCards(el.value, kinds);
      if (!res || res.length !== 1) return false;
      apply(res[0], true); tell(esc(T('auto'))); say0(T('auto'));
      lk.scrollIntoView({ block: 'start', behavior: 'smooth' });
      return true;
    }
    refresh();
    try {
      var saved = localStorage.getItem(KEY);
      if (saved){ var p = saved.split(':'), r = records(kinds).filter(function(x){ return x.t === p[0] && x.id === p[1]; })[0]; if (r) apply(r, true); else localStorage.removeItem(KEY); }
    } catch (e) {}
    return {
      card: function(){ return CUR; }, ref: function(){ return CUR ? ref(CUR) : ''; }, clear: clear, refresh: refresh,
      check: function(){ if (CUR) return false; return arr(root.querySelectorAll('[data-zuid]')).some(function(el){ return el.value.trim() && auto(el); }); },
      label: T
    };
  }
  window.SVL_ZLOOK = look;

  /* ---------- форма заявки ---------- */
  function init(box){
    var name = box.getAttribute('data-zayavka'), KEY = 'svoi-zayavka-' + name, MAIL = box.getAttribute('data-mail');
    var q = function(z){ return box.querySelector('[data-z="' + z + '"]'); };
    var fields = function(){ return arr(box.querySelectorAll('.zf')).filter(function(f){ return !hiddenEl(f) && !f.closest('.zlook'); }); };
    var say = function(t){ if (typeof window.toast === 'function') window.toast(t); else { var m = q('msg'); m.textContent = t; m.hidden = false; } };
    var copyText = function(t){ try { return navigator.clipboard.writeText(t).then(function(){ return true; }, function(){ return false; }); } catch (e) { return Promise.resolve(false); } };
    var lkEl = box.querySelector('[data-zlook]'), LK = lkEl ? look(lkEl, box) : null;

    function save(){
      try {
        var d = {};
        box.querySelectorAll('[data-a]').forEach(function(el){ d[el.id] = el.value; });
        box.querySelectorAll('.zchk').forEach(function(c, i){ d['chk' + i] = Array.prototype.map.call(c.querySelectorAll('input:checked'), function(x){ return x.value; }); });
        localStorage.setItem(KEY, JSON.stringify(d));
      } catch (e) {}
    }
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (d) {
        box.querySelectorAll('[data-a]').forEach(function(el){ if (typeof d[el.id] === 'string') el.value = d[el.id]; });
        box.querySelectorAll('.zchk').forEach(function(c, i){ (d['chk' + i] || []).forEach(function(v){ c.querySelectorAll('input').forEach(function(x){ if (x.value === v) x.checked = true; }); }); });
      }
    } catch (e) {}
    if (LK) LK.refresh();
    box.addEventListener('input', save); box.addEventListener('change', save);
    var ok = q('ok');
    function paint(){ box.classList.toggle('zok-off', !!ok && !ok.checked); if (ok && ok.checked) ok.closest('.zok').classList.remove('need'); }
    if (ok) ok.addEventListener('change', paint);
    paint();
    var stamp = function(){ var d = new Date(), p = function(n){ return (n < 10 ? '0' : '') + n; }; return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ', ' + p(d.getHours()) + ':' + p(d.getMinutes()); };

    function letter(){
      var lines = [];
      if (LK && LK.card()){
        var c = LK.card();
        lines.push(LK.label('ref') + ': ' + LK.ref());
        lines.push(LK.label('toletter') + ': ' + (c.email || '—'));
        lines.push('');
      }
      fields().forEach(function(f){
        var el = f.querySelector('[data-a]'), c = f.querySelector('.zchk');
        if (el) {
          var x = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].text : '') : el.value.trim();
          if (x) lines.push(el.getAttribute('data-a') + ': ' + x);
        } else if (c) {
          var v = Array.prototype.map.call(c.querySelectorAll('input:checked'), function(x){ return x.parentNode.textContent.trim(); });
          if (v.length) lines.push(c.getAttribute('data-l') + ': ' + v.join(', '));
        }
      });
      var first = box.querySelector('[data-a][data-title]'), t = first ? first.value.trim() : '';
      var su = box.getAttribute('data-subject') + (t ? ' — ' + t : '');
      if (ok && ok.checked) lines.push('', box.getAttribute('data-t-okline') + ' ' + stamp());
      var body = [box.getAttribute('data-hello'), ''].concat(lines, ['', box.getAttribute('data-from') + ' ' + location.origin + location.pathname, '']).join('\n');
      return { su: su, body: body };
    }

    q('send').addEventListener('click', function(){
      var msg = q('msg'), sent = q('sent');
      box.querySelectorAll('.zf').forEach(function(f){ f.classList.remove('zmiss'); });
      sent.hidden = true;
      if (LK && LK.check()) { msg.textContent = LK.label('auto'); msg.hidden = false; return; }
      var miss = Array.prototype.filter.call(box.querySelectorAll('[data-req]'), function(el){ return !hiddenEl(el) && !el.value.trim(); });
      if (miss.length) {
        miss.forEach(function(el){ el.closest('.zf').classList.add('zmiss'); });
        msg.textContent = box.getAttribute('data-t-miss') + miss.map(function(el){ var t = el.getAttribute('data-miss') || el.getAttribute('data-a'); return /^.[^A-ZА-ЯЁІЇЄҐ]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }).join(', ') + '.';
        msg.hidden = false; miss[0].focus(); return;
      }
      var bad = Array.prototype.filter.call(box.querySelectorAll('input[type=email]'), function(el){ var v = el.value.trim(); return !hiddenEl(el) && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
      if (bad.length) { bad[0].closest('.zf').classList.add('zmiss'); msg.textContent = box.getAttribute('data-t-mail'); msg.hidden = false; bad[0].focus(); return; }
      if (ok && !ok.checked) { ok.closest('.zok').classList.add('need'); msg.textContent = box.getAttribute('data-t-ok'); msg.hidden = false; ok.focus(); return; }
      msg.hidden = true;
      var L = letter();
      var g = q('gmail'); if (g) g.href = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(MAIL) + '&su=' + encodeURIComponent(L.su) + '&body=' + encodeURIComponent(L.body);
      sent.hidden = false;
      location.href = 'mailto:' + MAIL + '?subject=' + encodeURIComponent(L.su) + '&body=' + encodeURIComponent(L.body);
    });
    var cp = q('copy');
    if (cp) cp.addEventListener('click', function(){ var L = letter(); copyText(L.su + '\n\n' + L.body).then(function(ok){ say(box.getAttribute(ok ? 'data-t-copied' : 'data-t-copyfail')); }); });
    q('wipe').addEventListener('click', function(){ q('idle').hidden = true; q('ask').hidden = false; });
    q('no').addEventListener('click', function(){ q('ask').hidden = true; q('idle').hidden = false; });
    q('yes').addEventListener('click', function(){
      try { localStorage.removeItem(KEY); } catch (e) {}
      box.querySelectorAll('[data-a]').forEach(function(el){ el.value = ''; });
      box.querySelectorAll('input[type=checkbox]').forEach(function(x){ x.checked = false; });
      if (LK) LK.clear();
      q('msg').hidden = true; q('sent').hidden = true; q('ask').hidden = true; q('idle').hidden = false; paint();
      say(box.getAttribute('data-t-wiped'));
    });
  }
  function start(){
    document.querySelectorAll('[data-zayavka]').forEach(init);
    /* блок поиска в форме со своим движком (заявка организации): корень — [data-zlook-root] */
    document.querySelectorAll('[data-zlook-root] [data-zlook]').forEach(function(lk){
      if (lk.closest('[data-zayavka]')) return;
      var root = lk.closest('[data-zlook-root]');
      root._zlook = look(lk, root, function(r){ root.dispatchEvent(new CustomEvent('zcard', { detail: r })); });
      root.addEventListener('zwipe', function(){ root._zlook.clear(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
