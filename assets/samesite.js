/* Свои страницы открываются в той же вкладке: voznesenskaya.ch и svoiludi.ch.
   Внешние ссылки (Telegram, Instagram, бот, реестры) по-прежнему открываются в новой вкладке. */
(function(){
  var own = /^(www\.)?(voznesenskaya\.ch|svoiludi\.ch|localhost|127\.0\.0\.1)$/;
  document.addEventListener('click', function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[target="_blank"]') : null;
    if (!a || e.defaultPrevented || e.button !== 0 || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    var raw = a.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#' || a.hasAttribute('download')) return;
    var u; try { u = new URL(a.href, location.href); } catch (x) { return; }
    if (!/^https?:$/.test(u.protocol) || !(u.origin === location.origin || own.test(u.hostname))) return;
    e.preventDefault(); location.href = u.href;
  }, true);
})();
/* Поиск по сайту в шапке каждой страницы (правило Ирины, 08.10.2026): подгружаем assets/sitesearch.js рядом с этим файлом. */
(function(){
  var cs = document.currentScript; if (!cs || !cs.src || window.SVL_SITESEARCH) return;
  var s = document.createElement('script'); s.src = cs.src.replace(/samesite\.js(\?.*)?$/, 'sitesearch.js'); document.head.appendChild(s);
})();
