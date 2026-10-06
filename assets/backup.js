/* Резервная копия записей инструмента svoiludi.ch: сохранить в файл и загрузить обратно.
   Берёт ключ хранения из константы KEY страницы. Русский и украинский текст по lang страницы. */
(function(){
  var key = (typeof KEY === 'string') ? KEY : null; if (!key) return;
  var uk = document.documentElement.lang === 'uk';
  var T = uk ? {
    title:'Резервна копія', save:'Зберегти резервну копію', load:'Завантажити з резервної копії', last:'Остання копія', none:'Копії ще немає.',
    hint:'Зберігай її раз на місяць. На iPhone Safari сам стирає записи сайтів, на які довго не заходили, а з файлу їх можна повернути на цьому чи іншому пристрої.',
    empty:'Поки що нічого зберігати, записів ще немає.', saved:'Резервну копію збережено.', bad:'Цей файл не схожий на резервну копію.', other:'Це резервна копія іншого інструмента.',
    ask:function(d){ return 'Копія' + (d ? ' від ' + d : '') + '. Замінити записи на цьому пристрої?'; }, yes:'Так, завантажити', no:'Скасувати', fname:'резервна копія', loc:'uk-UA',
    warn:'<b>Відкрий сторінку в браузері.</b> Зараз вона відкрита всередині застосунку (Instagram, Telegram чи іншого). Записи збережуться лише тут, а в Safari чи Chrome їх не буде. Натисни ⋯ або значок угорі й вибери «Відкрити в браузері».'
  } : {
    title:'Резервная копия', save:'Сохранить резервную копию', load:'Загрузить из резервной копии', last:'Последняя копия', none:'Копии ещё нет.',
    hint:'Сохраняй её раз в месяц. На iPhone Safari сам стирает записи сайтов, на которые долго не заходили, а из файла их можно вернуть на этом или другом устройстве.',
    empty:'Пока нечего сохранять, записей ещё нет.', saved:'Резервная копия сохранена.', bad:'Этот файл не похож на резервную копию.', other:'Это резервная копия другого инструмента.',
    ask:function(d){ return 'Копия' + (d ? ' от ' + d : '') + '. Заменить записи на этом устройстве?'; }, yes:'Да, загрузить', no:'Отмена', fname:'резервная копия', loc:'ru-RU',
    warn:'<b>Открой страницу в браузере.</b> Сейчас она открыта внутри приложения (Instagram, Telegram или другого). Записи сохранятся только здесь, а в Safari или Chrome их не будет. Нажми ⋯ или значок вверху и выбери «Открыть в браузере».'
  };
  var LB = key + '.lastBackup';
  function get(k){ try { return localStorage.getItem(k); } catch(e) { return null; } }
  function put(k, v){ try { localStorage.setItem(k, v); return true; } catch(e) { return false; } }
  var css = document.createElement('style');
  css.textContent = '.bk-box{display:flex;flex-direction:column;gap:8px;background:var(--paper);border:1.5px solid var(--line);border-radius:18px;padding:12px 16px;font-size:.88rem}'
    + '.bk-box.due{border-color:var(--mustard);background:var(--mustard-soft)}.bk-row{display:flex;flex-wrap:wrap;gap:8px}.bk-row .btn{padding:8px 14px;font-size:.84rem}'
    + '.bk-warn{background:#A0523D;color:#fff;border-radius:16px;padding:12px 16px;font-size:.92rem}';
  document.head.appendChild(css);
  var wrap = document.querySelector('.wrap');
  if (wrap && /Instagram|FBAN|FBAV|FB_IAB|Line\/|Telegram|WhatsApp|; wv\)/i.test(navigator.userAgent)){ var w = document.createElement('div'); w.className = 'bk-warn'; w.innerHTML = T.warn; wrap.insertBefore(w, wrap.firstChild); }
  var st = document.getElementById('status'); if (!st) return;
  var box = document.createElement('div'); box.className = 'bk-box';
  var qh = window.SVL_HELP ? '<button type="button" class="qh" data-help="backup" aria-label="' + (uk ? 'Підказка' : 'Подсказка') + ': ' + T.title.toLowerCase() + '" aria-expanded="false">?</button>' : '';   // «?» работает, если на странице подключён /assets/help.js
  box.innerHTML = '<div><b>' + T.title + '</b>' + qh + ' <span class="bk-info"></span></div><div class="bk-row"><button class="btn ghost" type="button" data-bk="save">' + T.save + '</button><button class="btn ghost" type="button" data-bk="load">' + T.load + '</button><input type="file" accept=".json,application/json" hidden></div><div class="bk-confirm"></div>';
  st.parentNode.insertBefore(box, st.nextSibling);
  var info = box.querySelector('.bk-info'), file = box.querySelector('input[type=file]'), conf = box.querySelector('.bk-confirm'), pending = null;
  function say(t){ st.textContent = t; }
  function render(){ var lb = get(LB), d = lb ? new Date(lb) : null, days = d ? (Date.now() - d) / 864e5 : Infinity;
    info.textContent = (d ? T.last + ' ' + d.toLocaleDateString(T.loc) + '. ' : T.none + ' ') + T.hint;
    box.classList.toggle('due', !!get(key) && days > 30); }
  function download(name, blob){
    if (window.claude && window.claude.use){ return window.claude.use('downloads').then(function(dl){ if (!dl) return false; return dl.save({filename: name, data: blob}).then(function(){ return true; }, function(){ return false; }); }, function(){ return false; }); }
    var url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function(){ a.remove(); URL.revokeObjectURL(url); }, 4000); return Promise.resolve(true);
  }
  box.addEventListener('click', function(e){
    var b = e.target.closest('[data-bk]'); if (!b) return; var act = b.getAttribute('data-bk');
    if (act === 'save'){ var raw = get(key); if (!raw){ say(T.empty); return; }
      var d = new Date(), stamp = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'), data;
      try { data = JSON.parse(raw); } catch(err) { data = raw; }
      download(document.title + ' — ' + T.fname + ' ' + stamp + '.json', new Blob([JSON.stringify({app:'svoiludi', key: key, saved: d.toISOString(), data: data})], {type:'application/json'}))
        .then(function(ok){ if (ok){ put(LB, d.toISOString()); render(); say(T.saved); } }); }
    if (act === 'load') file.click();
    if (act === 'no'){ pending = null; conf.innerHTML = ''; }
    if (act === 'yes' && pending){ put(key, typeof pending.data === 'string' ? pending.data : JSON.stringify(pending.data)); put(LB, pending.saved || new Date().toISOString()); location.reload(); }
  });
  file.addEventListener('change', function(){
    var f = file.files && file.files[0]; if (!f) return; var fr = new FileReader();
    fr.onload = function(){ var o = null; try { o = JSON.parse(fr.result); } catch(err) {}
      if (!o || o.data == null){ say(T.bad); return; }
      if (o.key !== key){ say(T.other); return; }
      pending = o; var when = o.saved ? new Date(o.saved).toLocaleDateString(T.loc) : '';
      conf.innerHTML = '<span class="confirm">' + T.ask(when) + '<button class="btn danger" type="button" data-bk="yes">' + T.yes + '</button><button class="btn ghost" type="button" data-bk="no">' + T.no + '</button></span>'; };
    fr.readAsText(f); file.value = '';
  });
  render();
})();
