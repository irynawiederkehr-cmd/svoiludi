/* Подтверждение записи одной кнопкой: событие, курс, объявление (svoiludi.ch, 10.10.2026).
   Решение Ирины: «процедура подтверждения будет такая же, как у карточки специалиста».
   Claude готовит запись по заявке со статусом «на подтверждении» и ключом key. Ссылку предпросмотра
   (events/#ok=<id>.<key>, kursy/#ok=<id>.<key>, vakansii/#ok=<id>.<key>) Ирина отправляет на e-mail ИЗ КАРТОЧКИ
   организатора или автора — поэтому разместить запись от чужого имени нельзя, даже зная чужой UID.
   Человек видит запись так, как её увидят все, отмечает галочку (у объявлений — все условия) и нажимает «Подтверждаю».
   Запрос уходит в Google Apps Script «Свои люди — подтверждение записей» (_i18n/podtverzhdenie/zapisi.gs, адрес — ZAPIS_URL):
   строка на листе подтверждений, письмо Ирине «🌿 Свои люди: … подтверждено» и копия на e-mail из карточки.
   Пока ZAPIS_URL пустой или скрипт не ответил — запасной вариант, как у карточки: готовое письмо Ирине из почты человека.
   В файле нет текста для людей: все надписи страница кладёт в атрибуты блока, поэтому украинская страница переводится сама.

   <div class="pv-box" data-pv-kind="event|kurs|vacancy" data-pv-id="…" data-pv-key="…" data-pv-lang="ru"
        data-mail="…" data-su-ok="…" data-body-ok="…" data-su-fix="…" data-body-fix="… {text} …"
        data-t-sending="…" data-t-ok="… {t} …" data-t-copy="…" data-t-fixok="… {t} …" data-t-empty="…"
        data-t-fail="…" data-t-mail="…" data-t-gmail="…" data-t-letter="… {c} …" data-pv-cmail="e-mail карточки">
   (e-mail карточки — один для всех подтверждений, решение Ирины 10.10.2026: ссылка уходит только на него, письмо-подтверждение принимаем только с него)
     … <label class="pv-ok"><input type="checkbox" data-pv-agree data-id="real"> <span>…</span></label> …
     <div class="pv-acts"><button class="btn" type="button" data-pv-send="ok" disabled>…</button><button class="btn ghost" type="button" data-pv-fixopen>…</button></div>
     <div class="pv-fix" hidden><textarea data-pv-text></textarea><div class="pv-acts"><button class="btn" type="button" data-pv-send="fix">…</button></div></div>
     <span class="pv-small" data-pv-msg>…</span>   (необязательно: <b data-pv-n>0</b> — сколько галочек отмечено)
   </div> */
(function(){
  if (window.SVL_PV) return;
  window.SVL_PV = true;
  /* адрес веб-приложения «Свои люди — подтверждение записей»; пустой — подтверждение письмом */
  var ZAPIS_URL = '';
  window.SVL_PV_ONLINE = !!ZAPIS_URL;
  if (ZAPIS_URL) Array.prototype.forEach.call(document.querySelectorAll('[data-pv-msg][data-online]'), function(m){ m.textContent = m.getAttribute('data-online'); });
  var css = document.createElement('style');
  css.textContent = ''
    + '.pv-box{margin:0 0 16px;border-radius:16px;padding:14px 16px;display:flex;flex-direction:column;gap:8px;font-size:.92rem;background:var(--mustard-soft,#F3E3C2);border:1.5px solid var(--mustard,#B98324);color:var(--ink,#2F2924)}'
    + '.pv-box>b{font-size:1rem}.pv-acts{display:flex;flex-wrap:wrap;gap:8px}.pv-acts .btn{margin:0}'
    + '.pv-box [hidden]{display:none!important}'
    + '.pv-ok{display:flex;gap:10px;align-items:flex-start;cursor:pointer;line-height:1.4}'
    + '.pv-ok input{width:20px;height:20px;flex:none;margin-top:1px;accent-color:var(--mustard,#B98324)}'
    + '.pv-fix{display:flex;flex-direction:column;gap:8px}'
    + '.pv-fix textarea{width:100%;box-sizing:border-box;font:inherit;padding:10px 12px;border-radius:12px;border:1.5px solid var(--mustard,#B98324);background:#fff;resize:vertical}'
    + '.pv-box button[disabled]{opacity:.5;cursor:not-allowed}'
    + '.pv-box .pv-done{font-size:.98rem;font-weight:600;color:inherit;opacity:1}'
    + '.pv-small{font-size:.8rem;color:var(--muted,#7A6E62)}.pv-small a{color:inherit;font-weight:700}'
    + '.pv-list{display:flex;flex-direction:column;gap:8px;margin:2px 0}'
    + '@media print{.pv-box{display:none!important}}';
  document.head.appendChild(css);
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var A = function(box, k){ return box.getAttribute(k) || ''; };
  var mailto = function(to, su, body){ return 'mailto:' + to + '?subject=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body); };
  var gmail = function(to, su, body){ return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(to) + '&su=' + encodeURIComponent(su) + '&body=' + encodeURIComponent(body); };

  document.addEventListener('change', function(e){
    var c = e.target.closest && e.target.closest('[data-pv-agree]'); if (!c) return;
    var box = c.closest('.pv-box'), all = box.querySelectorAll('[data-pv-agree]'), n = 0;
    for (var i = 0; i < all.length; i++) if (all[i].checked) n++;
    var b = box.querySelector('[data-pv-send="ok"]'); if (b) b.disabled = n !== all.length;
    var cnt = box.querySelector('[data-pv-n]'); if (cnt) cnt.textContent = n;
  });
  function letter(box, fix, text){
    var su = A(box, fix ? 'data-su-fix' : 'data-su-ok'), body = A(box, fix ? 'data-body-fix' : 'data-body-ok').replace('{text}', text || '');
    return { su: su, body: body, to: A(box, 'data-mail') };
  }
  function byMail(box, msg, L, opened){
    var link = '<a href="' + esc(mailto(L.to, L.su, L.body)) + '">' + esc(A(box, 'data-t-mail')) + '</a>', g = '<a href="' + esc(gmail(L.to, L.su, L.body)) + '" target="_blank" rel="noopener">' + esc(A(box, 'data-t-gmail')) + '</a>';
    msg.innerHTML = esc(A(box, opened ? 'data-t-letter' : 'data-t-fail')).replace('{a}', link).replace('{g}', g).replace('{m}', esc(L.to)).replace('{c}', '<b>' + esc(A(box, 'data-pv-cmail')) + '</b>');
  }
  document.addEventListener('click', function(e){
    var o = e.target.closest && e.target.closest('.pv-box [data-pv-fixopen]');
    if (o){ var f = o.closest('.pv-box').querySelector('.pv-fix'); f.hidden = !f.hidden; if (!f.hidden) f.querySelector('textarea').focus(); return; }
    var b = e.target.closest && e.target.closest('.pv-box [data-pv-send]'); if (!b) return;
    var box = b.closest('.pv-box'), fix = b.getAttribute('data-pv-send') === 'fix', msg = box.querySelector('[data-pv-msg]');
    var text = fix ? box.querySelector('[data-pv-text]').value.trim() : '';
    if (fix && !text){ msg.textContent = A(box, 'data-t-empty'); return; }
    var L = letter(box, fix, text);
    if (!ZAPIS_URL){ location.href = mailto(L.to, L.su, L.body); byMail(box, msg, L, true); return; }
    var checks = Array.prototype.map.call(box.querySelectorAll('[data-pv-agree]:checked'), function(x){ return x.getAttribute('data-id') || 'ok'; }).join(',');
    var kind = A(box, 'data-pv-kind') + (fix ? 'fix' : '');
    var u = ZAPIS_URL + '?what=confirm&kind=' + encodeURIComponent(kind) + '&id=' + encodeURIComponent(A(box, 'data-pv-id')) + '&key=' + encodeURIComponent(A(box, 'data-pv-key'))
      + '&lang=' + encodeURIComponent(A(box, 'data-pv-lang') || 'ru') + (checks && !fix ? '&checks=' + encodeURIComponent(checks) : '') + (text ? '&text=' + encodeURIComponent(text) : '');
    b.disabled = true; msg.textContent = A(box, 'data-t-sending');
    fetch(u).then(function(r){ return r.json(); }).then(function(j){
      if (!j || !j.ok) throw new Error((j && j.error) || 'error');
      Array.prototype.forEach.call(box.querySelectorAll('.pv-ok,.pv-list,.pv-acts,.pv-fix'), function(x){ x.hidden = true; });
      msg.textContent = fix ? A(box, 'data-t-fixok').replace('{t}', j.time || '') : A(box, 'data-t-ok').replace('{t}', j.time || '') + (j.copy ? A(box, 'data-t-copy') : '');
      msg.classList.add('pv-done');
    }).catch(function(){ b.disabled = false; byMail(box, msg, L, false); });
  });
})();
