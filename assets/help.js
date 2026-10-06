/* Подсказки «?» для инструментов svoiludi.ch.
   Любая кнопка <button class="qh" data-help="KEY"> открывает окошко с текстом из window.HELP (задаётся на странице)
   или из встроенных текстов ниже (например, для блока «Резервная копия» из backup.js). Русский и украинский по lang страницы. */
(function(){
  if (window.SVL_HELP) return;
  window.SVL_HELP = true;
  var uk = document.documentElement.lang === 'uk';
  var BUILT = uk ? {
    backup: '<p>Записи зберігаються лише в браузері на цьому пристрої. На iPhone Safari сам стирає записи сайтів, на які довго не заходили.</p><p>Кнопка «Зберегти резервну копію» завантажує файл із твоїми записами цього інструмента. Зберігай його раз на місяць. Щоб повернути записи на цьому чи іншому пристрої, натисни «Завантажити з резервної копії» й обери файл. Записи на пристрої заміняться записами з файлу.</p><p>Бережи цей файл, у ньому твої особисті дані.</p>'
  } : {
    backup: '<p>Записи хранятся только в браузере на этом устройстве. На iPhone Safari сам стирает записи сайтов, на которые долго не заходили.</p><p>Кнопка «Сохранить резервную копию» скачивает файл с твоими записями этого инструмента. Сохраняй его раз в месяц. Чтобы вернуть записи на этом или другом устройстве, нажми «Загрузить из резервной копии» и выбери файл. Записи на устройстве заменятся записями из файла.</p><p>Храни этот файл бережно, в нём твои личные данные.</p>'
  };
  var CLOSE = uk ? 'Закрити підказку' : 'Закрыть подсказку';
  var css = document.createElement('style');
  css.textContent = ''
    + '.qfl{display:inline-flex;align-items:center;gap:6px;flex-wrap:wrap}'
    + '.qh{font:inherit;font-size:.74rem;font-weight:800;width:22px;height:22px;border-radius:50%;border:1.5px solid var(--brown,#6E4F3C);background:var(--paper,#FFFCF8);color:var(--brown,#6E4F3C);cursor:pointer;padding:0;display:inline-grid;place-items:center;margin-left:6px;vertical-align:middle;line-height:1;flex:none;text-transform:none;letter-spacing:0;font-family:var(--sans,system-ui,sans-serif)}'
    + '.qh[aria-expanded="true"]{background:var(--brown,#6E4F3C);color:var(--paper,#FFFCF8)}'
    + '.qfl .qh{margin-left:0}'
    + 'h2 .qh,h3 .qh{vertical-align:.25em}'
    + '.qpop{position:absolute;z-index:80;background:var(--paper,#FFFCF8);color:var(--ink,#2F2924);border:1.5px solid var(--brown,#6E4F3C);border-radius:14px;padding:12px 38px 12px 14px;font:500 .88rem/1.5 var(--sans,system-ui,sans-serif);box-shadow:0 14px 34px -14px rgba(47,41,36,.5);text-transform:none;letter-spacing:0;text-align:left;max-height:calc(100vh - 32px);overflow-y:auto;overflow-wrap:break-word}'
    + '.qpop p{margin:0 0 6px}.qpop p:last-of-type{margin-bottom:0}'
    + '.qpop ul{margin:0 0 6px;padding-left:18px}.qpop li{margin:0 0 5px}.qpop ul:last-of-type{margin-bottom:0}'
    + '.qclose{position:absolute;top:6px;right:6px;width:28px;height:28px;border:0;border-radius:50%;background:none;color:var(--muted,#7A6E62);cursor:pointer;font-size:.9rem}'
    + '@media (max-width:640px){.qh{width:26px;height:26px;font-size:.8rem}}'
    + '@media print{.qh,.qpop{display:none!important}}';
  document.head.appendChild(css);

  function text(k){ var H = window.HELP || {}; return H[k] || BUILT[k] || ''; }
  var qPop = null, qBtn = null, lastW = window.innerWidth;
  function closeHelp(focus){
    if (qPop){ qPop.remove(); qPop = null; }
    if (qBtn){ qBtn.setAttribute('aria-expanded', 'false'); if (focus && document.contains(qBtn)) qBtn.focus(); qBtn = null; }
  }
  function place(b){
    var rc = b.getBoundingClientRect(), vw = document.documentElement.clientWidth || window.innerWidth, vh = window.innerHeight;
    var w = Math.min(340, vw - 32);
    qPop.style.width = w + 'px';
    var left = Math.max(16, Math.min(rc.left + rc.width / 2 - w / 2, vw - 16 - w));
    var h = qPop.offsetHeight, below = rc.bottom + 8, top = below, shift = 0;
    if (below + h > vh - 8){
      if (rc.top - 8 - h >= 8) top = rc.top - 8 - h;               // не помещается под кнопкой, но помещается над ней
      else shift = Math.min(below + h - (vh - 8), Math.max(0, rc.top - 8));   // иначе прокрутить страницу, чтобы окошко было видно под кнопкой
    }
    qPop.style.left = (left + window.scrollX) + 'px'; qPop.style.top = (top + window.scrollY) + 'px';
    if (shift > 0) window.scrollBy(0, shift);
  }
  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.qh');
    if (b){ e.preventDefault(); e.stopPropagation();
      if (qBtn === b){ closeHelp(); return; }
      closeHelp();
      qPop = document.createElement('div'); qPop.className = 'qpop'; qPop.setAttribute('role', 'dialog');
      if (b.getAttribute('aria-label')) qPop.setAttribute('aria-label', b.getAttribute('aria-label'));
      qPop.innerHTML = text(b.dataset.help) + '<button type="button" class="qclose" aria-label="' + CLOSE + '">✕</button>';
      document.body.appendChild(qPop);
      place(b);
      qBtn = b; b.setAttribute('aria-expanded', 'true'); return;
    }
    if (qPop && (!e.target.closest('.qpop') || e.target.closest('.qclose'))){
      var x = !!e.target.closest('.qclose'); if (x) e.preventDefault();
      closeHelp(x);
    }
  }, true);
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && qPop) closeHelp(true); });
  window.addEventListener('resize', function(){ var w = window.innerWidth; if (w !== lastW){ lastW = w; closeHelp(); } });   // на телефоне высота меняется при прокрутке, закрываем только при смене ширины
})();
