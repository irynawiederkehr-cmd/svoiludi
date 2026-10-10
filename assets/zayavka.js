/* Заявка на сайте (svoiludi.ch, 10.10.2026; решение Ирины: «пусть регистрируются на сайте сразу или пишут на мейл»).
   Общий движок для форм заявок: события, курсы, вакансии. В файле нет текста для людей — все надписи стоят в HTML
   страницы (атрибуты data-* и скрытые абзацы), поэтому украинская страница получает их переводом страницы, а сам файл общий.
   Форма ничего не отправляет на сервер: «Отправить заявку» открывает готовое письмо на адрес из data-mail.
   Черновик хранится только в браузере (localStorage, ключ svoi-zayavka-<имя формы>), «Удалить историю» стирает его.

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
   </section> */
(function(){
  if (window.SVL_ZAYAVKA) return;
  window.SVL_ZAYAVKA = true;
  var css = document.createElement('style');
  css.textContent = ''
    + '.zform{background:var(--paper,#FFFCF8);border:1.5px solid var(--line,#D9DFCB);border-radius:24px;padding:clamp(18px,3vw,30px);margin:22px 0 10px;scroll-margin-top:90px}'
    + '.zform h2{margin:0 0 4px}.zform .zhint{color:var(--muted,#7A6E62);margin:0 0 18px;font-size:.95rem;max-width:66ch}'
    + '.zfg{display:grid;grid-template-columns:1fr;gap:14px;max-width:640px}'
    + '.zf{display:flex;flex-direction:column;gap:7px;min-width:0}'
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
    + '.zmsg a,.zmsg .lnk,.zdraft .lnk{font:inherit;font-weight:700;color:var(--brown,#4F5E3E);background:none;border:0;padding:0;text-decoration:underline;cursor:pointer}'
    + '.zdraft{font-size:.88rem;color:var(--muted,#7A6E62);margin:14px 0 0;line-height:1.5;max-width:66ch}.zdraft .lnk+.lnk{margin-left:12px}'
    + '.zform .note{margin-top:10px;max-width:66ch}'
    + '@media print{.zform{display:none!important}}';
  document.head.appendChild(css);

  function init(box){
    var name = box.getAttribute('data-zayavka'), KEY = 'svoi-zayavka-' + name, MAIL = box.getAttribute('data-mail');
    var q = function(z){ return box.querySelector('[data-z="' + z + '"]'); };
    var fields = function(){ return Array.prototype.slice.call(box.querySelectorAll('.zf')); };
    var say = function(t){ if (typeof window.toast === 'function') window.toast(t); else { var m = q('msg'); m.textContent = t; m.hidden = false; } };
    var copyText = function(t){ try { return navigator.clipboard.writeText(t).then(function(){ return true; }, function(){ return false; }); } catch (e) { return Promise.resolve(false); } };

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
    box.addEventListener('input', save); box.addEventListener('change', save);

    function letter(){
      var lines = [];
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
      var body = [box.getAttribute('data-hello'), ''].concat(lines, ['', box.getAttribute('data-from') + ' ' + location.origin + location.pathname, '']).join('\n');
      return { su: su, body: body };
    }

    q('send').addEventListener('click', function(){
      var msg = q('msg'), sent = q('sent');
      fields().forEach(function(f){ f.classList.remove('zmiss'); });
      sent.hidden = true;
      var miss = Array.prototype.filter.call(box.querySelectorAll('[data-req]'), function(el){ return !el.value.trim(); });
      if (miss.length) {
        miss.forEach(function(el){ el.closest('.zf').classList.add('zmiss'); });
        msg.textContent = box.getAttribute('data-t-miss') + miss.map(function(el){ var t = el.getAttribute('data-a'); return /^.[a-zа-яёієїґ]/.test(t) ? t.charAt(0).toLowerCase() + t.slice(1) : t; }).join(', ') + '.';
        msg.hidden = false; miss[0].focus(); return;
      }
      var bad = Array.prototype.filter.call(box.querySelectorAll('input[type=email]'), function(el){ var v = el.value.trim(); return v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); });
      if (bad.length) { bad[0].closest('.zf').classList.add('zmiss'); msg.textContent = box.getAttribute('data-t-mail'); msg.hidden = false; bad[0].focus(); return; }
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
      q('msg').hidden = true; q('sent').hidden = true; q('ask').hidden = true; q('idle').hidden = false;
      say(box.getAttribute('data-t-wiped'));
    });
  }
  function start(){ document.querySelectorAll('[data-zayavka]').forEach(init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
