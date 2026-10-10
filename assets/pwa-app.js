/* svoiludi.ch как приложение на телефоне и планшете (08.10.2026).
   1) Подключает сервис-воркер /sw.js: страницы, которые уже открывались, работают без интернета.
   2) Если сайт открыт с иконки на экране «Домой» (режим приложения) — внизу панель вкладок, как в приложениях,
      верхнее меню на телефоне и планшете прячется.
   3) Если сайт открыт в браузере телефона или планшета — подсказка «Установить как приложение»
      (Android: кнопка установки; iPhone/iPad: как добавить через «Поделиться»; Instagram/Telegram: открыть в браузере).
   Русский и украинский текст выбирается по <html lang>. Показ для проверки: ?app=1 (режим приложения), ?install=ios|android|inapp.
   Личные данные не собираются; в localStorage только отметка «Не сейчас» (svoiludi-app-later). */
(function () {
  if (window.__svoiApp) return; window.__svoiApp = true;
  var UK = (document.documentElement.lang || '').indexOf('uk') === 0;
  var P = UK ? '/uk' : '';
  var Q = location.search;
  var T = UK ? {
    tabs: ['Фахівці', 'Швейцарія', 'Інструменти', 'Що нового', 'Ще'],
    more: 'Ще', swiss: 'Як влаштована Швейцарія', join: 'Як розміститися', evk: 'Події та курси', pro: 'Для фахівців', about: 'Про проєкт', site: 'Сайт Ірини', privacy: 'Політика конфіденційності',
    share: 'Поділитися застосунком з друзями', reload: 'Оновити сторінку', lang: 'По-русски', close: 'Закрити',
    shareText: 'Свої люди у Швейцарії: фахівці, які говорять українською та російською, події, курси й корисні інструменти. Можна встановити як застосунок на телефон.',
    title: 'Свої люди — як застосунок на телефоні',
    lead: 'Іконка на екрані «Додому», сайт відкривається на весь екран, з вкладками внизу. Без App Store і без реєстрації.',
    help: 'Це той самий сайт, тільки відкривається з іконки, як застосунок. Нічого не завантажується з App Store чи Google Play, місця на телефоні майже не займає. Видалити можна як звичайну іконку.',
    install: 'Встановити застосунок', later: 'Не зараз', how: 'Як встановити застосунок',
    ios: ['Натисни «Поділитися» <span class="pa-ico">⬆︎</span> внизу екрана (на iPad — угорі праворуч).', 'Прокрути вниз і вибери «На екран „Додому“».', 'Натисни «Додати». Іконка «Свої люди» з’явиться на екрані.'],
    android: ['Відкрий меню браузера ⋮ угорі праворуч.', 'Вибери «Встановити застосунок» або «Додати на головний екран».', 'Підтверди. Іконка «Свої люди» з’явиться на екрані.'],
    inapp: '<b>Зараз сторінка відкрита всередині Instagram, Telegram чи іншого застосунку.</b> Звідси встановити не можна. Натисни ⋯ або значок угорі й вибери «Відкрити в браузері» (Safari чи Chrome), а там — «Встановити застосунок».',
    note: '<b>Важливо для записів в інструментах.</b> Записи, зроблені в браузері, у застосунок самі не переходять. Перед встановленням натисни в інструменті «Зберегти резервну копію», а в застосунку — «Завантажити з резервної копії».',
    install_app: '📱 Встановити як застосунок', guide: 'Покрокова інструкція →',
    install_btn: 'Встановити застосунок «Свої люди»', pics: 'Так це виглядає на телефоні:',
    menu: 'Меню', fold: 'Згорнути', search: 'Пошук'
  } : {
    tabs: ['Специалисты', 'Швейцария', 'Инструменты', 'Что нового', 'Ещё'],
    more: 'Ещё', swiss: 'Как устроена Швейцария', join: 'Как разместиться', evk: 'События и курсы', pro: 'Для специалистов', about: 'О проекте', site: 'Сайт Ирины', privacy: 'Политика конфиденциальности',
    share: 'Поделиться приложением с друзьями', reload: 'Обновить страницу', lang: 'Українською', close: 'Закрыть',
    shareText: 'Свои люди в Швейцарии: специалисты, которые говорят по-русски и по-украински, события, курсы и полезные инструменты. Можно установить как приложение на телефон.',
    title: 'Свои люди — как приложение на телефоне',
    lead: 'Иконка на экране «Домой», сайт открывается во весь экран, с вкладками внизу. Без App Store и без регистрации.',
    help: 'Это тот же сайт, только открывается с иконки, как приложение. Ничего не скачивается из App Store или Google Play, места на телефоне почти не занимает. Удалить можно как обычную иконку.',
    install: 'Установить приложение', later: 'Не сейчас', how: 'Как установить приложение',
    ios: ['Нажми «Поделиться» <span class="pa-ico">⬆︎</span> внизу экрана (на iPad — вверху справа).', 'Прокрути вниз и выбери «На экран „Домой“».', 'Нажми «Добавить». Иконка «Свои люди» появится на экране.'],
    android: ['Открой меню браузера ⋮ вверху справа.', 'Выбери «Установить приложение» или «Добавить на главный экран».', 'Подтверди. Иконка «Свои люди» появится на экране.'],
    inapp: '<b>Сейчас страница открыта внутри Instagram, Telegram или другого приложения.</b> Отсюда установить нельзя. Нажми ⋯ или значок вверху и выбери «Открыть в браузере» (Safari или Chrome), а там — «Установить приложение».',
    note: '<b>Важно для записей в инструментах.</b> Записи, сделанные в браузере, в приложение сами не переходят. Перед установкой нажми в инструменте «Сохранить резервную копию», а в приложении — «Загрузить из резервной копии».',
    install_app: '📱 Установить как приложение', guide: 'Пошаговая инструкция →',
    install_btn: 'Установить приложение «Свои люди»', pics: 'Так это выглядит на телефоне:',
    menu: 'Меню', fold: 'Свернуть', search: 'Поиск'
  };

  var ua = navigator.userAgent;
  var IOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  var INAPP = /Instagram|FBAN|FBAV|FB_IAB|Line\/|Telegram|WhatsApp|; wv\)/i.test(ua);
  var force = (Q.match(/[?&]install=(ios|android|inapp)/) || [])[1];
  var STANDALONE = /[?&]app=1/.test(Q) || navigator.standalone === true ||
    (window.matchMedia && (matchMedia('(display-mode: standalone)').matches || matchMedia('(display-mode: minimal-ui)').matches));
  var TOUCH = window.matchMedia && matchMedia('(pointer: coarse)').matches;
  var HAS_TOOL = !!document.querySelector('script[src*="backup"]');

  /* 1. сервис-воркер — только на настоящем сайте */
  if ('serviceWorker' in navigator && /(^|\.)svoiludi\.ch$|^localhost$|^127\.0\.0\.1$/.test(location.hostname)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }

  var css = document.createElement('style');
  css.textContent = [
    /* узкая строка меню при прокрутке на телефоне и планшете (10.10.2026, как на voznesenskaya.ch): логотип · Меню · поиск · Подать заявку */
    '.pa-mini{display:none}',
    '@media (max-width:1100px){html header.top.pa-mini{display:block;position:fixed!important;left:0;right:0;top:0;z-index:800;padding-top:env(safe-area-inset-top,0px);transform:translateY(-105%);visibility:hidden;transition:transform .22s ease,visibility 0s .22s;box-shadow:0 8px 20px -14px rgba(40,50,25,.5);background:color-mix(in srgb,var(--bg,#EEF1E6) 96%,transparent)}html header.top.pa-mini.on{transform:none;visibility:visible;transition:transform .22s ease}html header.top.pa-mini .page{padding-block:8px;flex-wrap:wrap;row-gap:8px;gap:8px}html header.top.pa-mini .mark small{display:none}html header.top.pa-mini .mono{width:32px;height:32px}html header.top.pa-mini .mark b{font-size:1.05rem}html header.top.pa-mini:not(.open) nav{display:none!important}html header.top.pa-mini .pa-ibtn,html header.top.pa-mini .ss-btn{display:none!important}.pa-mbtn{margin-left:auto;display:flex;align-items:center;gap:6px;padding:7px 12px;border-radius:12px;border:1.5px solid color-mix(in srgb,var(--sage,#66704F) 40%,transparent);background:var(--paper,#FFFCF8);color:var(--ink,#2F2924);font:700 .84rem/1 var(--body,Manrope,system-ui);cursor:pointer;-webkit-tap-highlight-color:transparent}.pa-msrch{display:grid;place-items:center;width:36px;height:34px;padding:0;border-radius:12px;border:1.5px solid color-mix(in srgb,var(--sage,#66704F) 40%,transparent);background:var(--paper,#FFFCF8);cursor:pointer;-webkit-tap-highlight-color:transparent}.pa-mbtn svg,.pa-msrch svg{width:18px;height:18px;flex:none;fill:none;stroke:var(--sage,#66704F);stroke-width:2;stroke-linecap:round}}',
    '@media (max-width:480px){html header.top.pa-mini .mark span:not(.mono){display:none}}',
    '.pa-tabs{position:fixed;left:0;right:0;bottom:0;z-index:900;display:none;background:color-mix(in srgb,var(--paper,#FFFCF8) 94%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);border-top:1px solid var(--line,#E5D9C9);padding:6px 6px calc(6px + env(safe-area-inset-bottom))}',
    '.pa-tabs ul{list-style:none;margin:0 auto;padding:0;display:grid;grid-template-columns:repeat(5,1fr);max-width:640px}',
    '.pa-tabs a,.pa-tabs button{display:flex;flex-direction:column;align-items:center;gap:3px;padding:6px 2px 4px;border:0;background:none;font:600 .7rem/1.15 var(--body,system-ui);color:var(--muted,#7A6E62);text-decoration:none;cursor:pointer;width:100%;border-radius:12px;-webkit-tap-highlight-color:transparent}',
    '.pa-tabs svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}',
    '.pa-tabs [aria-current="page"]{color:var(--sage,#66704F)}',
    '.pa-tabs [aria-current="page"] svg{stroke-width:2.2}',
    '.pa-tabs [aria-current="page"]::before{content:"";display:block;width:26px;height:3px;border-radius:3px;background:var(--sage,#66704F);margin:-6px 0 3px}',
    '.pa-tabs a:active,.pa-tabs button:active{background:var(--sage-soft,#E3E6D6)}',
    '@media (max-width:1100px){html.pa-app .pa-tabs{display:block}html.pa-app body{padding-bottom:calc(72px + env(safe-area-inset-bottom))}}',
    /* верхнее меню плитками (телефон и планшет, в браузере и в приложении) — стили в <head>, блок <!--pwa--> (_i18n/pwa.py) */
    'html.pa-app header.top{padding-top:env(safe-area-inset-top)}',
    '.pa-sheet,.pa-card{font-family:var(--body,system-ui);color:var(--ink,#2F2924)}',
    '.pa-back{position:fixed;inset:0;z-index:950;background:rgba(30,24,20,.38);display:flex;align-items:flex-end;justify-content:center}',
    '.pa-sheet{background:var(--paper,#FFFCF8);width:100%;max-width:560px;border-radius:22px 22px 0 0;padding:10px 16px calc(18px + env(safe-area-inset-bottom));box-shadow:0 -10px 40px rgba(0,0,0,.18)}',
    '.pa-grip{width:42px;height:5px;border-radius:5px;background:var(--line,#E5D9C9);margin:0 auto 12px}',
    '.pa-sheet h2{font:400 1.5rem/1.2 var(--display,Georgia);margin:0 0 8px}',
    '.pa-sheet a,.pa-sheet .pa-row{display:flex;align-items:center;gap:12px;width:100%;padding:14px 4px;border:0;border-bottom:1px solid var(--line,#E5D9C9);background:none;font:600 1rem var(--body,system-ui);color:var(--ink,#2F2924);text-decoration:none;text-align:left;cursor:pointer}',
    '.pa-sheet a:last-of-type{border-bottom:0}',
    '.pa-sheet svg{width:22px;height:22px;fill:none;stroke:var(--sage,#66704F);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;flex:none}',
    '.pa-x{display:block;margin:12px auto 0;border:1.5px solid var(--brown,#6E4F3C);color:var(--brown,#6E4F3C);background:none;border-radius:999px;padding:10px 22px;font:700 .95rem var(--body,system-ui);cursor:pointer}',
    '.pa-card{position:fixed;z-index:940;left:12px;right:12px;bottom:calc(12px + env(safe-area-inset-bottom));max-width:520px;margin:0 auto;background:var(--paper,#FFFCF8);border:1px solid var(--line,#E5D9C9);border-radius:20px;box-shadow:0 14px 44px rgba(40,30,20,.22);padding:16px 16px 14px;animation:paUp .35s ease-out}',
    '@keyframes paUp{from{transform:translateY(24px);opacity:0}to{transform:none;opacity:1}}',
    '.pa-head{display:flex;gap:12px;align-items:flex-start}',
    '.pa-head img{width:52px;height:52px;border-radius:14px;flex:none;background:#EEF1E6}',
    '.pa-head h3{font:400 1.22rem/1.2 var(--display,Georgia);margin:2px 0 4px}',
    '.pa-head p{margin:0;font-size:.88rem;line-height:1.45;color:var(--muted,#7A6E62)}',
    '.pa-q{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;border:1.5px solid var(--sage,#66704F);color:var(--sage,#66704F);font:700 .72rem var(--body,system-ui);background:none;cursor:pointer;vertical-align:2px;margin-left:4px;padding:0}',
    '.pa-help{display:none;margin:10px 0 0;padding:10px 12px;border-radius:12px;background:var(--sage-soft,#E3E6D6);font-size:.85rem;line-height:1.45}',
    '.pa-help.on{display:block}',
    '.pa-steps{margin:12px 0 0;padding:0;list-style:none;counter-reset:s}',
    '.pa-steps li{counter-increment:s;position:relative;padding:6px 0 6px 34px;font-size:.92rem;line-height:1.4}',
    '.pa-steps li::before{content:counter(s);position:absolute;left:0;top:5px;width:24px;height:24px;border-radius:50%;background:var(--sage,#66704F);color:var(--paper,#FFFCF8);display:grid;place-items:center;font-weight:700;font-size:.8rem}',
    '.pa-ico{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:6px;border:1.5px solid currentColor;font-size:.8rem;vertical-align:-4px;color:#2E6FD8}',
    '.pa-note,.pa-warn{margin:10px 0 0;padding:10px 12px;border-radius:12px;font-size:.84rem;line-height:1.45}',
    '.pa-note{background:var(--mustard-soft,#F3E3C2)}',
    '.pa-warn{background:var(--sage-soft,#E3E6D6)}',
    '.pa-btns{display:flex;gap:10px;align-items:center;margin-top:14px;flex-wrap:wrap}',
    '.pa-go{border:0;border-radius:999px;padding:11px 20px;background:var(--brown,#6E4F3C);color:var(--paper,#FFFCF8);font:700 .95rem var(--body,system-ui);cursor:pointer}',
    '.pa-later{border:0;background:none;color:var(--muted,#7A6E62);font:600 .9rem var(--body,system-ui);text-decoration:underline;text-underline-offset:3px;cursor:pointer;padding:10px 6px}',
    '.pa-foot{display:inline-block;margin:10px 0;border:1.5px solid var(--sage,#66704F);color:var(--sage,#66704F);background:none;border-radius:999px;padding:9px 16px;font:700 .9rem var(--body,system-ui);cursor:pointer}',
    '.pa-guide{margin:8px 0 0;font-size:.9rem}.pa-guide a,.pa-flink{color:var(--sage,#66704F);font-weight:700;text-underline-offset:3px}.pa-flink{display:inline-block;margin:0 0 0 12px;font-size:.9rem}',
    /* кнопка «Установить приложение» под верхним меню (10.10.2026, просьба Ирины «на сайте сделай кнопку установить app») */
    '.pa-ibtn{order:4;flex:1 0 100%;display:flex;align-items:center;justify-content:center;gap:9px;min-height:46px;margin:0 0 12px;padding:8px 14px;border-radius:12px;border:1.5px solid var(--sage,#66704F);background:var(--sage-soft,#E3E6D6);color:var(--ink,#2F2924);font:700 .9rem/1.2 var(--body,system-ui);cursor:pointer;-webkit-tap-highlight-color:transparent;box-sizing:border-box}',
    '.pa-ibtn svg{width:22px;height:22px;flex:none;fill:none;stroke:var(--sage,#66704F);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}',
    '.pa-ibtn:active{transform:scale(.98)}',
    '@media (min-width:1101px){.pa-ibtn{order:1;flex:0 0 auto;min-height:0;margin:0;padding:7px 12px;font-size:.84rem}.pa-ibtn svg{width:18px;height:18px}}',
    '@media (min-width:1360px){.pa-ibtn{padding:7px 9px}.pa-ibtn span{display:none}}',   /* на широком экране — только значок, как у «Поиска» */
    'html.pa-app .pa-ibtn{display:none!important}',
    /* картинки шагов в подсказке установки — крупные планы из галереи prilozhenie/img (10.10.2026) */
    '.pa-card{max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);overflow:auto;overscroll-behavior:contain}',
    '.pa-pics-t{margin:12px 0 6px;font-size:.84rem;font-weight:700;color:var(--muted,#7A6E62)}',
    '.pa-pics{display:flex;gap:10px;overflow-x:auto;scroll-snap-type:x mandatory;padding:2px 2px 8px;-webkit-overflow-scrolling:touch}',
    '.pa-pics figure{position:relative;flex:0 0 80%;margin:0;scroll-snap-align:start}',
    '.pa-pics.one figure{flex-basis:100%}',
    '.pa-pics img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid var(--line,#E5D9C9)}',
    '.pa-pics b{position:absolute;left:6px;top:6px;width:22px;height:22px;border-radius:50%;display:grid;place-items:center;background:var(--sage,#66704F);color:var(--paper,#FFFCF8);font:700 .75rem var(--body,system-ui);box-shadow:0 1px 4px rgba(0,0,0,.25)}',
    '@media print{.pa-tabs,.pa-card,.pa-back,.pa-foot,.pa-flink,.pa-ibtn{display:none!important}}'
  ].join('\n');
  document.head.appendChild(css);

  var I = {
    spec: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 19c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><circle cx="17" cy="9" r="2.5"/><path d="M15.6 14.2c2.6-.4 4.4 1.2 4.9 4.3"/></svg>',
    ev: '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="3"/><path d="M3.5 10h17M8 3v4M16 3v4"/><circle cx="12" cy="15" r="1.6"/></svg>',
    kurs: '<svg viewBox="0 0 24 24"><path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3V11M21.5 9v5"/></svg>',
    tool: '<svg viewBox="0 0 24 24"><path d="M12 3.5v3M12 17.5v3M3.5 12h3M17.5 12h3"/><circle cx="12" cy="12" r="4.2"/><path d="m6 6 1.8 1.8M16.2 16.2 18 18M6 18l1.8-1.8M16.2 7.8 18 6"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5.5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18.5" cy="12" r="1.4"/></svg>',
    swiss: '<svg viewBox="0 0 24 24"><path d="M2.5 19.5 9 8.5l3.2 5.2L15 10l6.5 9.5z"/><path d="m7.4 11.2 1.6 1.3 1.4-1.4"/></svg>',
    job: '<svg viewBox="0 0 24 24"><rect x="3.5" y="7.5" width="17" height="12" rx="2.5"/><path d="M9 7.5V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.5M3.5 13h17"/></svg>',
    join: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>',
    site: '<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
    share: '<svg viewBox="0 0 24 24"><path d="M12 15V4M8 7.5 12 3.5l4 4"/><path d="M6 11H5.5A1.5 1.5 0 0 0 4 12.5v6A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5v-6a1.5 1.5 0 0 0-1.5-1.5H18"/></svg>',
    reload: '<svg viewBox="0 0 24 24"><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4v4h-4"/></svg>',
    news: '<svg viewBox="0 0 24 24"><path d="M5 4.5h11.5V18a2 2 0 0 0 2 2H6.5A1.5 1.5 0 0 1 5 18.5z"/><path d="M16.5 9h3v9a2 2 0 0 1-2 2M8 8.5h5.5M8 12h5.5M8 15.5h3.5"/></svg>',
    pro: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.7-4 3.4-6 7-6s6.3 2 7 6"/><path d="m15.5 16.5 1.5 1.5 3-3"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5M12 7.6v.4"/></svg>',
    lang: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/></svg>'
  };
  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstElementChild; }

  /* 2. режим приложения: панель вкладок */
  function rel() { return location.pathname.replace(/^\/uk(?=\/|$)/, '') || '/'; }
  function topTiles() {   /* иконки в плитках верхнего меню; число колонок — чтобы всегда было два ряда */
    var nav = document.querySelector('header.top nav[aria-label]'); if (!nav) return;
    var map = [[/voznesenskaya\.ch/, I.site], [/kursy\//, I.kurs], [/events\//, I.ev], [/instrumenty\//, I.tool], [/join\//, I.join],
      [/shveycariya\//, I.swiss], [/situacii\//, I.swiss], [/vakansii\//, I.job], [/novosti\//, I.news], [/dlya-specialistov\//, I.pro], [/o-proekte\//, I.info], [/^\/(index\.html)?$/, I.spec]];
    var links = nav.querySelectorAll('a');
    links.forEach(function (a) {
      if (a.querySelector('.pa-ni')) return;
      var u = new URL(a.href, location.href), ic = I.more;
      var h = (u.origin === location.origin || /(^|\.)svoiludi\.ch$/.test(u.hostname)) ? u.pathname.replace(/^\/uk(?=\/)/, '') : u.href;
      for (var i = 0; i < map.length; i++) if (map[i][0].test(h)) { ic = map[i][1]; break; }
      a.insertAdjacentHTML('afterbegin', ic.replace('<svg ', '<svg class="pa-ni" aria-hidden="true" '));
      a.style.removeProperty('color');
    });
    /* как на voznesenskaya.ch: три колонки; «Как разместиться» на телефоне не дублируем — эта кнопка уже есть в шапке (09.10.2026) */
    var cta = document.querySelector('header.top .navcta'), ctaPath = cta ? new URL(cta.href, location.href).pathname : '';   /* больше шести разделов — «Как разместиться» прячем (он есть на главной в шапке и в подвале) */
    var shown = 0;
    links.forEach(function (a) {
      var p = new URL(a.href, location.href).pathname;
      if (/join\/$/.test(p) && (p === ctaPath || links.length > 6)) a.classList.add('pa-dup'); else shown++;
    });
    nav.style.setProperty('--pa-cols', 3);
  }
  function tabBar() {
    document.documentElement.classList.add('pa-app');
    /* вкладки внизу (09.10.2026, новое меню): Специалисты · Швейцария · Инструменты · Что нового · Ещё */
    var r = rel(), cur = r === '/' || r === '/index.html' ? 0 : /^\/(shveycariya|situacii)\//.test(r) ? 1 : /^\/instrumenty\//.test(r) ? 2 : /^\/novosti\//.test(r) ? 3 : 4;
    var links = [['/', I.spec], ['/shveycariya/', I.swiss], ['/instrumenty/', I.tool], ['/novosti/', I.news]];
    var h = '<div class="pa-tabs" role="navigation" aria-label="' + T.tabs.slice(0, 4).join(' · ') + '"><ul>';
    links.forEach(function (l, i) { h += '<li><a href="' + P + l[0] + '"' + (cur === i ? ' aria-current="page"' : '') + '>' + l[1] + '<span>' + T.tabs[i] + '</span></a></li>'; });
    h += '<li><button type="button" class="pa-more"' + (cur === 4 ? ' aria-current="page"' : '') + '>' + I.more + '<span>' + T.tabs[4] + '</span></button></li></ul></div>';
    var bar = el(h); document.body.appendChild(bar);
    bar.querySelector('.pa-more').addEventListener('click', moreSheet);
  }
  function moreSheet() {
    var other = (UK ? '' : '/uk') + rel();
    var h = '<div class="pa-back" role="dialog" aria-modal="true" aria-label="' + T.more + '"><div class="pa-sheet"><div class="pa-grip"></div><h2>' + T.more + '</h2>' +
      '<a href="' + P + '/events/">' + I.ev + T.evk + '</a>' +
      '<a href="' + P + '/dlya-specialistov/">' + I.pro + T.pro + '</a>' +
      '<a href="' + P + '/o-proekte/">' + I.info + T.about + '</a>' +
      '<a href="https://voznesenskaya.ch/' + (UK ? 'uk/' : '') + '">' + I.site + T.site + '</a>' +
      '<a href="' + P + '/privacy/">' + I.lock + T.privacy + '</a>' +
      '<button type="button" class="pa-row" data-a="share">' + I.share + T.share + '</button>' +
      '<button type="button" class="pa-row" data-a="reload">' + I.reload + T.reload + '</button>' +
      '<a href="' + other + '" data-a="lang">' + I.lang + T.lang + '</a>' +
      '<button type="button" class="pa-x">' + T.close + '</button></div></div>';
    var b = el(h); document.body.appendChild(b);
    function close() { b.remove(); }
    b.addEventListener('click', function (e) {
      if (e.target === b || e.target.closest('.pa-x')) return close();
      var a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'reload') { e.preventDefault(); location.reload(); }
      if (a.dataset.a === 'lang') { try { localStorage.setItem('svoiludiLang', UK ? 'ru' : 'uk'); } catch (x) {} }
      if (a.dataset.a === 'share') {
        e.preventDefault(); var url = 'https://svoiludi.ch' + P + '/';
        if (navigator.share) navigator.share({ title: UK ? 'Свої люди у Швейцарії' : 'Свои люди в Швейцарии', text: T.shareText, url: url }).catch(function () {});
        else try { navigator.clipboard.writeText(T.shareText + ' ' + url); } catch (x) {}
        close();
      }
    });
    document.addEventListener('keydown', function k(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', k); } });
  }

  /* 3. подсказка «Установить как приложение» */
  var deferred = null;
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; if (document.readyState !== 'loading') installBtn(); });
  window.addEventListener('appinstalled', function () { var c = document.querySelector('.pa-card'); if (c) c.remove(); var ib = document.querySelector('.pa-ibtn'); if (ib) ib.remove(); });
  function later(set) {
    try {
      if (set) localStorage.setItem('svoiludi-app-later', String(Date.now()));
      var t = +localStorage.getItem('svoiludi-app-later') || 0; return Date.now() - t < 30 * 864e5;
    } catch (e) { return false; }
  }
  function card(kind) {
    var old = document.querySelector('.pa-card'); if (old) old.remove();
    kind = kind || (INAPP ? 'inapp' : IOS ? 'ios' : 'android');
    var body = '';
    if (kind === 'inapp') body = '<div class="pa-warn">' + T.inapp + '</div>';
    else if (kind === 'ios' || !deferred) body = '<ol class="pa-steps"><li>' + T[kind === 'ios' ? 'ios' : 'android'].join('</li><li>') + '</li></ol>';
    var pics = kind === 'inapp' ? ['s-inapp-1'] : (kind === 'ios' || !deferred) ? [1, 2, 3, 4].map(function (n) { return 's-' + (kind === 'ios' ? 'ios' : 'and') + '-' + n; }) : [];
    if (pics.length) body += '<p class="pa-pics-t">' + T.pics + '</p><div class="pa-pics' + (pics.length === 1 ? ' one' : '') + '">' + pics.map(function (f, i) {
      return '<figure><img src="/prilozhenie/img/' + (UK ? 'uk' : 'ru') + '/' + f + '.jpg" width="390" height="150" alt="" loading="lazy">' + (pics.length > 1 ? '<b>' + (i < 3 ? i + 1 : '✓') + '</b>' : '') + '</figure>'; }).join('') + '</div>';
    var h = '<aside class="pa-card" role="dialog" aria-label="' + T.title + '"><div class="pa-head"><img src="/fav/icon-192.png" alt=""><div>' +
      '<h3>' + T.title + '<button type="button" class="pa-q" aria-label="?" aria-expanded="false">?</button></h3><p>' + T.lead + '</p></div></div>' +
      '<div class="pa-help">' + T.help + '</div>' + body + '<p class="pa-guide"><a href="' + P + '/prilozhenie/">' + T.guide + '</a></p>' + (kind !== 'inapp' ? '<div class="pa-note">' + T.note + '</div>' : '') +
      '<div class="pa-btns">' + (kind === 'android' && deferred ? '<button type="button" class="pa-go">' + T.install + '</button>' : '') +
      '<button type="button" class="pa-later">' + T.later + '</button></div></aside>';
    var c = el(h); document.body.appendChild(c);
    if (!HAS_TOOL && kind !== 'inapp') { var n = c.querySelector('.pa-note'); if (n && !force) n.remove(); }
    c.querySelector('.pa-q').addEventListener('click', function () { var hp = c.querySelector('.pa-help'); hp.classList.toggle('on'); this.setAttribute('aria-expanded', hp.classList.contains('on')); });
    c.querySelector('.pa-later').addEventListener('click', function () { later(true); c.remove(); });
    var go = c.querySelector('.pa-go');
    if (go) go.addEventListener('click', function () { deferred.prompt(); deferred.userChoice.then(function () { deferred = null; c.remove(); }); });
  }
  window.svoiInstallHint = function () { card(force); };

  /* 4. кнопка «Установить приложение «Свои люди»» под верхним меню (10.10.2026): Android и компьютер с Chrome — окно установки браузера,
     iPhone и iPad — подсказка с шагами и картинками, Instagram и Telegram — «открой в браузере». В приложении кнопки нет. */
  function installBtn() {
    if (STANDALONE || document.querySelector('.pa-ibtn')) return;
    var page = document.querySelector('header.top .page'); if (!page) return;
    var b = el('<button type="button" class="pa-ibtn" title="' + T.install_btn + '" aria-label="' + T.install_btn + '"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M12 7.5v7M9.2 11.8 12 14.6l2.8-2.8M10.5 18.5h3"/></svg><span>' + T.install_btn + '</span></button>');
    b.addEventListener('click', function () {
      if (deferred && !INAPP) { deferred.prompt(); deferred.userChoice.then(function (r) { deferred = null; if (r && r.outcome === 'accepted') b.remove(); }); return; }
      card(force);
    });
    page.appendChild(b);
  }

  function footerLink() {
    var f = document.querySelector('footer'); if (!f) return;
    var b = el('<button type="button" class="pa-foot">' + T.install_app + '</button>');
    b.addEventListener('click', function () { card(force); });
    var box = document.createElement('div'); box.appendChild(b);
    box.appendChild(el('<a class="pa-flink" href="' + P + '/prilozhenie/">' + T.guide + '</a>'));   // пошаговая инструкция (10.10.2026)
    f.insertBefore(box, f.firstChild);
  }

  function miniBar() {   /* телефон и планшет: шапка уходит при прокрутке, сверху остаётся узкая строка; «Меню» разворачивает разделы, «Свернуть» прячет их (10.10.2026) */
    var h = document.querySelector('header.top'); if (!h || document.querySelector('.pa-mini') || !('IntersectionObserver' in window)) return;
    var m = document.createElement('header'); m.className = 'top pa-mini';
    var pg = document.createElement('div'); pg.className = 'page';
    var mk = h.querySelector('.mark'); if (mk) pg.appendChild(mk.cloneNode(true));
    var b = el('<button type="button" class="pa-mbtn" aria-expanded="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg><span>' + T.menu + '</span></button>');
    pg.appendChild(b);
    var sb = el('<button type="button" class="pa-msrch" aria-label="' + T.search + '" title="' + T.search + '"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/></svg></button>');
    sb.addEventListener('click', function () { var o = h.querySelector('.ss-btn'); if (o) o.click(); });
    pg.appendChild(sb);
    var c = h.querySelector('.navcta'); if (c) pg.appendChild(c.cloneNode(true));
    var n = h.querySelector('nav[aria-label]'); if (n) pg.appendChild(n.cloneNode(true));
    m.appendChild(pg); document.body.appendChild(m);
    function set(o) { m.classList.toggle('open', o); b.setAttribute('aria-expanded', o ? 'true' : 'false'); b.lastChild.textContent = o ? T.fold : T.menu; }
    b.addEventListener('click', function () { set(!m.classList.contains('open')); });
    m.addEventListener('click', function (e) { if (e.target.closest('nav a')) set(false); });
    new IntersectionObserver(function (es) { var v = es[0].isIntersecting; m.classList.toggle('on', !v); if (v) set(false); }).observe(h);
  }

  function start() {
    topTiles();
    if (STANDALONE) { tabBar(); return; }
    miniBar();
    if (deferred) installBtn();
    if (!(TOUCH || force)) return;
    installBtn();
    footerLink();
    if (force) { setTimeout(function () { card(force); }, 300); return; }
    if (later()) return;
    var shown = false;
    function show() { if (shown) return; shown = true; window.removeEventListener('scroll', onScroll); card(); }
    function onScroll() { if (scrollY > innerHeight * 1.5) show(); }
    window.addEventListener('scroll', onScroll, { passive: true });
    setTimeout(show, 8000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
