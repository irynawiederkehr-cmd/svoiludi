// Картинки для галереи «Как установить приложение» (prilozhenie/img/<lang>/*.jpg), 10.10.2026
// Макеты телефона: реальные скриншоты сайта (shots/) + условные экраны браузера. Без логотипов чужих брендов.
const { chromium } = require('playwright');
const fs = require('fs');
const DIR = __dirname, SITE = require('path').resolve(__dirname, '../..');
const OUT = process.argv[2];
const d64 = (f, t = 'png') => `data:image/${t};base64,` + fs.readFileSync(f).toString('base64');
const ICON = d64(SITE + '/fav/apple-touch-icon.png'), MASK = d64(SITE + '/fav/icon-maskable-192.png');

const L = {
  ru: {
    name: 'Свои люди', title: 'Свои люди в Швейцарии',
    share: ['Скопировать', 'Добавить в список для чтения', 'Добавить закладку', 'Добавить в Избранное', 'Найти на странице', 'На экран «Домой»', 'Разметка', 'Напечатать'],
    contacts: ['Сообщения', 'Почта', 'Заметки', 'Ещё'],
    cancel: 'Отменить', addTitle: 'На экран «Домой»', add: 'Добавить',
    addNote: 'Значок будет добавлен на экран «Домой» для быстрого доступа к этому веб-сайту.',
    iosApps: ['Календарь', 'Фото', 'Камера', 'Почта', 'Часы', 'Карты', 'Погода', 'Заметки', 'Банк', 'Свои люди', 'Музыка', 'Настройки'],
    dock: ['Телефон', 'Сообщения', 'Браузер', 'Музыка'],
    chrome: ['Новая вкладка', 'Новая вкладка инкогнито', 'История', 'Скачанные файлы', 'Закладки', 'Недавние вкладки', 'Поделиться…', 'Найти на странице', 'Перевести…', 'Установить приложение', 'Версия для ПК', 'Настройки'],
    instTitle: 'Установить приложение', instCancel: 'Отмена', inst: 'Установить',
    andApps: ['Календарь', 'Галерея', 'Камера', 'Почта', 'Часы', 'Карты', 'Погода', 'Заметки', 'Свои люди', 'Банк', 'Музыка', 'Настройки'],
    andDock: ['Телефон', 'Сообщения', 'Браузер', 'Камера'],
    search: 'Поиск',
    inapp: ['Открыть в браузере', 'Копировать ссылку', 'Поделиться', 'Обновить'],
  },
  uk: {
    name: 'Свої люди', title: 'Свої люди у Швейцарії',
    share: ['Скопіювати', 'Додати до списку читання', 'Додати закладку', 'Додати до Вибраного', 'Знайти на сторінці', 'На початковий екран', 'Розмітка', 'Друкувати'],
    contacts: ['Повідомлення', 'Пошта', 'Нотатки', 'Ще'],
    cancel: 'Скасувати', addTitle: 'На початковий екран', add: 'Додати',
    addNote: 'Іконку буде додано на початковий екран для швидкого доступу до цього вебсайту.',
    iosApps: ['Календар', 'Фото', 'Камера', 'Пошта', 'Годинник', 'Карти', 'Погода', 'Нотатки', 'Банк', 'Свої люди', 'Музика', 'Параметри'],
    dock: ['Телефон', 'Повідомлення', 'Браузер', 'Музика'],
    chrome: ['Нова вкладка', 'Нова вкладка в анонімному режимі', 'Історія', 'Завантаження', 'Закладки', 'Нещодавні вкладки', 'Поділитися…', 'Знайти на сторінці', 'Перекласти…', 'Встановити застосунок', 'Версія для ПК', 'Налаштування'],
    instTitle: 'Встановити застосунок', instCancel: 'Скасувати', inst: 'Встановити',
    andApps: ['Календар', 'Галерея', 'Камера', 'Пошта', 'Годинник', 'Карти', 'Погода', 'Нотатки', 'Свої люди', 'Банк', 'Музика', 'Налаштування'],
    andDock: ['Телефон', 'Повідомлення', 'Браузер', 'Камера'],
    search: 'Пошук',
    inapp: ['Відкрити в браузері', 'Копіювати посилання', 'Поділитися', 'Оновити'],
  },
};

// простые значки (линии), без чужих логотипов
const S = (p, w = 22, c = 'currentColor', sw = 1.9) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const G = {
  share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-8a1 1 0 0 0-1-1h-1"/>',
  back: '<path d="M15 5l-7 7 7 7"/>', fwd: '<path d="M9 5l7 7-7 7"/>',
  book: '<path d="M4 5.5C6.5 4 9.5 4 12 5.5 14.5 4 17.5 4 20 5.5V19c-2.5-1.5-5.5-1.5-8 0-2.5-1.5-5.5-1.5-8 0z"/><path d="M12 5.5V19"/>',
  tabs: '<rect x="4" y="7" width="13" height="13" rx="2.5"/><path d="M8 4h9.5A2.5 2.5 0 0 1 20 6.5V16"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>',
  glasses: '<circle cx="6.5" cy="14" r="3.5"/><circle cx="17.5" cy="14" r="3.5"/><path d="M10 14h4M3 13l2-6M21 13l-2-6"/>',
  star: '<path d="M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.6 9.6l5.8-.8z"/>',
  find: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  plusq: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8.5v7M8.5 12h7"/>',
  pen: '<path d="M4 20l4-1 11-11-3-3L5 16z"/>', print: '<path d="M7 9V4h10v5"/><rect x="4" y="9" width="16" height="7" rx="2"/><path d="M7 14h10v6H7z"/>',
  dots: '<circle cx="12" cy="5.5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="18.5" r="1.3" fill="currentColor"/>',
  hdots: '<circle cx="5.5" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="18.5" cy="12" r="1.3" fill="currentColor"/>',
  home: '<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
  lock: '<rect x="6" y="11" width="12" height="9" rx="2"/><path d="M8.5 11V8a3.5 3.5 0 0 1 7 0v3"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>', reload: '<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', inc: '<circle cx="8" cy="16" r="3"/><circle cx="16" cy="16" r="3"/><path d="M3 11h18M7 11l1.5-6h7L17 11"/>',
  hist: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>', dl: '<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>',
  recent: '<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M4 9h16"/>', tr: '<path d="M4 6h9M8.5 4v2M6 6c0 4 3 7 6 8M11 6c0 3-3 7-6 9M13 20l4-9 4 9M14.5 17h5"/>',
  install: '<rect x="6" y="3" width="12" height="18" rx="2.5"/><path d="M12 8v6M9.5 11.5L12 14l2.5-2.5"/>', pc: '<rect x="3" y="5" width="18" height="11" rx="2"/><path d="M8 20h8M12 16v4"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
  globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.5 3.5 5.5 3.5 8.5s-1 6-3.5 8.5c-2.5-2.5-3.5-5.5-3.5-8.5s1-6 3.5-8.5z"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  // значки «условных» приложений на экране телефона
  cal: '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M8 3v4M16 3v4"/>', photo: '<path d="M12 4c2 2.5 2 5.5 0 8-2-2.5-2-5.5 0-8zM12 12c2.5-2 5.5-2 8 0-2.5 2-5.5 2-8 0zM12 12c2 2.5 2 5.5 0 8-2-2.5-2-5.5 0-8zM12 12c-2.5 2-5.5 2-8 0 2.5-2 5.5-2 8 0z"/>',
  cam: '<rect x="3" y="7" width="18" height="13" rx="3"/><circle cx="12" cy="13.5" r="3.5"/><path d="M9 7l1.5-2.5h3L15 7"/>', mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7l8.5 6 8.5-6"/>',
  clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.5 2"/>', map: '<path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6z"/><path d="M9 4v14M15 6v14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8"/>',
  note: '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 9h7M8.5 13h7M8.5 17h4"/>', bank: '<path d="M3.5 9.5L12 4l8.5 5.5M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3.5 20h17"/>',
  music: '<path d="M9 18V6l10-2v12"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="16.5" cy="16" r="2.5"/>',
  phone: '<path d="M6.5 3.5h3l1.5 4-2 1.5a10 10 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/>',
  chat: '<path d="M4 11.5C4 7.4 7.6 4.5 12 4.5s8 2.9 8 7-3.6 7-8 7c-1 0-2-.1-2.9-.4L5 19.5l1.2-3.4C4.8 14.9 4 13.3 4 11.5z"/>',
  compass: '<circle cx="12" cy="12" r="8.5"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
};
const APPC = { // цвет и значок условных приложений
  'cal': ['#F4F4F4', '#E5484D'], 'photo': ['#FFFFFF', '#E59B2E'], 'cam': ['#8E8E93', '#fff'], 'mail': ['#3D8BF2', '#fff'], 'clock': ['#1C1C1E', '#fff'],
  'map': ['#6BBF73', '#fff'], 'sun': ['#4C8FE0', '#FFD45C'], 'note': ['#F7D35B', '#fff'], 'bank': ['#4F6F8F', '#fff'], 'music': ['#F2565D', '#fff'],
  'gear': ['#8E8E93', '#fff'], 'phone': ['#4CC764', '#fff'], 'chat': ['#4CC764', '#fff'], 'compass': ['#3E8CF0', '#fff'],
};
const IOSKEYS = ['cal', 'photo', 'cam', 'mail', 'clock', 'map', 'sun', 'note', 'bank', 'OURS', 'music', 'gear'];
const ANDKEYS = ['cal', 'photo', 'cam', 'mail', 'clock', 'map', 'sun', 'note', 'OURS', 'bank', 'music', 'gear'];

const CSS = `
*{box-sizing:border-box}body{margin:0;background:#E3E8D6;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
.tile{width:470px;height:930px;display:flex;align-items:center;justify-content:center;background:#E3E8D6}
.phone{position:relative;width:412px;height:866px;border-radius:60px;background:#1F1D1B;padding:11px;box-shadow:0 22px 44px -14px rgba(40,50,30,.45),inset 0 0 0 2px #3A3733}
.scr{position:relative;width:390px;height:844px;border-radius:49px;overflow:hidden;background:#fff}
.and .phone{border-radius:44px}.and .scr{border-radius:33px}
.sb{position:absolute;left:0;right:0;top:0;height:47px;display:flex;align-items:center;justify-content:space-between;padding:4px 30px 0 40px;font:600 16px Inter;color:#111;z-index:5}
.sb .isl{position:absolute;left:50%;top:11px;width:122px;height:35px;margin-left:-61px;border-radius:20px;background:#000}
.sb .r{display:flex;gap:6px;align-items:center}
.and .sb{height:32px;padding:0 20px;font-size:13px}.and .sb .isl{width:12px;height:12px;top:10px;margin-left:-6px;border-radius:50%}
.sb.light{color:#fff}
.shot{position:absolute;left:0;width:390px;display:block}
.hl{outline:3.5px solid #E0572B!important;outline-offset:3px;box-shadow:0 0 0 9px rgba(224,87,43,.22)!important;border-radius:12px}
.hlc{outline:3.5px solid #E0572B;outline-offset:2px;box-shadow:0 0 0 9px rgba(224,87,43,.22);border-radius:50%}
.hi{position:absolute;bottom:8px;left:50%;width:134px;height:5px;margin-left:-67px;border-radius:3px;background:#111;z-index:6}
.hi.w{background:#fff}
.dim{position:absolute;inset:0;background:rgba(0,0,0,.38);z-index:3}
/* Safari (условный) */
.sf{position:absolute;left:0;right:0;bottom:0;height:134px;background:rgba(248,248,248,.97);border-top:1px solid #D6D6D6;z-index:4}
.sf .addr{margin:8px 12px 0;height:46px;border-radius:13px;background:#E8E8EA;display:flex;align-items:center;justify-content:space-between;padding:0 14px;font:500 17px Inter;color:#111}
.sf .addr span{display:flex;align-items:center;gap:6px}
.sf .bar{display:flex;justify-content:space-around;align-items:center;height:48px;color:#0A7AFF;padding:0 8px}
.sf .bar i{width:46px;height:40px;display:grid;place-items:center}
.sf .bar .off{color:#B5B5B8}
/* лист «Поделиться» */
.sheet{position:absolute;left:0;right:0;bottom:0;background:#F2F2F7;border-radius:14px 14px 0 0;z-index:4;padding:14px 16px 30px}
.sh-h{display:flex;align-items:center;gap:12px;padding:4px 2px 14px;border-bottom:1px solid #DCDCE0}
.sh-h img{width:48px;height:48px;border-radius:11px}
.sh-h b{display:block;font:600 16px Inter;color:#111}.sh-h small{font:400 14px Inter;color:#8A8A8E}
.sh-h .xx{margin-left:auto;width:30px;height:30px;border-radius:50%;background:#E3E3E8;display:grid;place-items:center;color:#7A7A7E}
.ppl{display:flex;justify-content:space-between;padding:14px 6px 14px}
.ppl div{display:flex;flex-direction:column;align-items:center;gap:6px;font:400 11.5px Inter;color:#333;width:76px;text-align:center}
.ppl i{width:58px;height:58px;border-radius:50%;display:grid;place-items:center}
.grp{background:#fff;border-radius:12px;margin-top:10px;overflow:visible}
.row{display:flex;justify-content:space-between;align-items:center;height:50px;padding:0 16px;font:400 16.5px Inter;color:#111;border-bottom:1px solid #E5E5EA;background:#fff}
.row:last-child{border-bottom:0;border-radius:0 0 12px 12px}.row:first-child{border-radius:12px 12px 0 0}
.row svg{color:#111}
/* экран «Добавить» */
.addv{position:absolute;left:0;right:0;top:56px;bottom:0;background:#F2F2F7;border-radius:12px 12px 0 0;z-index:4}
.addv .nav{display:flex;justify-content:space-between;align-items:center;gap:8px;height:56px;padding:0 12px;font:400 16px Inter;color:#0A7AFF}
.addv .nav b{color:#111;font-weight:600;font-size:15px;white-space:nowrap}.addv .nav .go{font-weight:600;padding:6px 8px}
.addv .card{margin:14px 16px 0;background:#fff;border-radius:12px;display:flex;gap:14px;padding:14px;align-items:flex-start}
.addv .card img{width:64px;height:64px;border-radius:15px;box-shadow:0 0 0 1px #E3E3E3}
.addv .card .f{flex:1}.addv .card .f div{font:400 17px Inter;color:#111;padding:6px 0 10px;border-bottom:1px solid #E5E5EA}.addv .card .f small{display:block;padding-top:9px;font:400 14px Inter;color:#8A8A8E}
.addv p{margin:10px 30px;font:400 13px/1.4 Inter;color:#6D6D72}
/* домашний экран */
.wall{position:absolute;inset:0;background:linear-gradient(165deg,#7F9670 0%,#A9B78F 35%,#D9C9A3 70%,#C79F82 100%)}
.grid{position:absolute;left:22px;right:22px;top:76px;display:grid;grid-template-columns:repeat(4,1fr);row-gap:24px;justify-items:center}
.app{display:flex;flex-direction:column;align-items:center;gap:6px;width:80px;font:500 12px Inter;color:#fff;text-shadow:0 1px 3px rgba(0,0,0,.35);text-align:center}
.app i{width:62px;height:62px;border-radius:15px;display:grid;place-items:center;box-shadow:0 2px 6px rgba(0,0,0,.15);overflow:hidden}
.app img{width:62px;height:62px;display:block}
.and .app i{border-radius:50%;width:58px;height:58px}.and .app img{width:58px;height:58px}
.dock{position:absolute;left:14px;right:14px;bottom:24px;height:92px;border-radius:32px;background:rgba(255,255,255,.32);display:flex;justify-content:space-around;align-items:center;-webkit-backdrop-filter:blur(10px)}
.pdots{position:absolute;bottom:130px;left:50%;transform:translateX(-50%);display:flex;gap:8px}.pdots i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.55)}.pdots i:first-child{background:#fff}
.srch{position:absolute;left:24px;right:24px;bottom:34px;height:52px;border-radius:26px;background:rgba(255,255,255,.85);display:flex;align-items:center;gap:10px;padding:0 20px;font:500 16px Inter;color:#555}
.anddock{position:absolute;left:22px;right:22px;bottom:104px;display:flex;justify-content:space-around}
.clockw{position:absolute;left:0;right:0;top:44px;text-align:center;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.25)}
/* Chrome (условный) */
.cb{position:absolute;left:0;right:0;top:32px;height:56px;background:#fff;display:flex;align-items:center;gap:6px;padding:0 6px 0 10px;z-index:4;border-bottom:1px solid #E2E2E2;color:#444}
.cb .pill{flex:1;height:42px;border-radius:21px;background:#EFF1F3;display:flex;align-items:center;gap:8px;padding:0 14px;font:400 16px Inter;color:#222}
.cb i{width:40px;height:40px;display:grid;place-items:center}
.cb .tabn{width:22px;height:22px;border:2px solid #444;border-radius:5px;display:grid;place-items:center;font:700 11px Inter}
.gest{position:absolute;left:0;right:0;bottom:0;height:20px;background:#fff;z-index:4}.gest::after{content:"";position:absolute;left:50%;bottom:7px;width:108px;height:4px;margin-left:-54px;border-radius:2px;background:#333}
.menu{position:absolute;right:6px;top:38px;width:262px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.28);z-index:6;padding:4px 0 8px}
.menu .ic{display:flex;justify-content:space-around;height:52px;align-items:center;color:#444;border-bottom:1px solid #EEE;margin-bottom:4px}
.mi{display:flex;align-items:center;gap:16px;height:46px;padding:0 18px;font:400 15.5px Inter;color:#1F1F1F}
.mi svg{flex:none;color:#555}
.dlg{position:absolute;left:39px;right:39px;top:300px;background:#fff;border-radius:28px;padding:24px 24px 18px;z-index:5;box-shadow:0 10px 40px rgba(0,0,0,.3)}
.dlg h3{margin:0 0 18px;font:400 23px Inter;color:#1F1F1F}
.dlg .who{display:flex;align-items:center;gap:14px;margin-bottom:24px}.dlg .who img{width:48px;height:48px;border-radius:50%}
.dlg .who b{display:block;font:600 16px Inter;color:#1F1F1F}.dlg .who small{font:400 14px Inter;color:#666}
.dlg .bt{display:flex;justify-content:flex-end;gap:10px;font:600 15px Inter;color:#0B57D0}.dlg .bt span{padding:10px 14px;border-radius:20px}
/* встроенный браузер */
.ia{position:absolute;left:0;right:0;top:47px;height:50px;background:#fff;border-bottom:1px solid #DDD;display:flex;align-items:center;justify-content:space-between;padding:0 8px;z-index:4;color:#222}
.ia i{width:42px;height:42px;display:grid;place-items:center}
.ia .t{text-align:center;line-height:1.2}.ia .t b{display:block;font:600 14.5px Inter}.ia .t small{font:400 12px Inter;color:#777}
.iam{position:absolute;right:10px;top:100px;width:270px;background:#fff;border-radius:14px;box-shadow:0 8px 30px rgba(0,0,0,.28);z-index:6;overflow:visible;padding:6px 0}
`;

function sb(and, light) {
  const bat = `<svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".45"/><rect x="2" y="2" width="18" height="9" rx="2" fill="currentColor"/><path d="M25 4.5v4" stroke="currentColor" stroke-width="1.6" opacity=".45" stroke-linecap="round"/></svg>`;
  const wifi = `<svg width="17" height="13" viewBox="0 0 17 13"><path d="M8.5 12.2l2.2-2.6a3.2 3.2 0 0 0-4.4 0zM3.9 7.2a6.7 6.7 0 0 1 9.2 0l1.4-1.6a8.9 8.9 0 0 0-12 0zM1.3 4.2a10.6 10.6 0 0 1 14.4 0L17 2.6a12.8 12.8 0 0 0-17 0z" fill="currentColor"/></svg>`;
  const sig = `<svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor"/><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor"/><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor"/></svg>`;
  return `<div class="sb${light ? ' light' : ''}"><span>9:41</span><div class="isl"></div><div class="r">${and ? wifi + bat : sig + wifi + bat}</div></div>`;
}
const page = (lang, name, top) => `<img class="shot" style="top:${top}px" src="${d64(DIR + '/shots/' + lang + '-' + name + '.png')}">`;
const appIcon = (k, label, and, hl) => {
  if (k === 'OURS') return `<div class="app"><i class="${hl ? (and ? 'hlc' : 'hl') : ''}" style="${hl && !and ? 'border-radius:15px' : ''}"><img src="${and ? MASK : ICON}"></i>${label}</div>`;
  const [bg, fg] = APPC[k];
  return `<div class="app"><i style="background:${bg}">${S(G[k], 32, fg, 1.8)}</i>${label}</div>`;
};


const shot = (n, top, w) => `<img class="shot" style="top:${top}px;${w ? 'width:' + w + 'px' : ''}" src="${d64(DIR + '/shots2/' + n + '.png')}">`;
const appF = (n, bg = '#EEF1E6', dark) => `<div class="scr" style="background:${bg}">${sb(false, dark)}${shot(n, 47)}<div style="position:absolute;left:0;right:0;bottom:0;height:20px;background:${dark ? '#26221E' : '#FFFCF8'}"></div><div class="hi${dark ? ' w' : ''}"></div></div>`;
const safF = (n, host = 'svoiludi.ch', bg = '#EEF1E6') => `<div class="scr" style="background:${bg}">${sb()}${shot(n, 47)}
    <div class="sf"><div class="addr"><span style="font-size:15px">ᴀA</span><span>${S(G.lock, 13, '#555', 2.2)}${host}</span><span>${S(G.reload, 18, '#333')}</span></div>
    <div class="bar"><i>${S(G.back, 24)}</i><i class="off">${S(G.fwd, 24)}</i><i>${S(G.share, 25)}</i><i>${S(G.book, 25)}</i><i>${S(G.tabs, 24)}</i></div></div><div class="hi"></div></div>`;
const chrF = (n, dark, host = 'svoiludi.ch') => `<div class="scr" style="background:${dark ? '#1C2019' : '#fff'}"><div style="position:absolute;left:0;right:0;top:0;height:32px;background:${dark ? '#202124' : '#fff'}"></div>${sb(true, dark)}
    <div class="cb" style="${dark ? 'background:#202124;color:#ddd;border-color:#333' : ''}"><i>${S(G.home, 22)}</i><div class="pill" style="${dark ? 'background:#303134;color:#eee' : ''}">${S(G.lock, 15, dark ? '#bbb' : '#555', 2.2)}${host}</div><i><span class="tabn" style="${dark ? 'border-color:#ddd' : ''}">2</span></i><i>${S(G.dots, 24)}</i></div>${shot(n, 88)}<div class="gest" style="${dark ? 'background:#202124' : ''}"></div></div>`;
const inF = (n) => `<div class="scr"><div style="position:absolute;left:0;right:0;top:0;height:47px;background:#fff"></div>${sb()}
    <div class="ia"><i>${S(G.x, 22)}</i><div class="t"><b>Свои люди в Швейцарии</b><small>svoiludi.ch</small></div><i>${S(G.hdots, 24)}</i></div>${shot(n, 97)}<div class="hi"></div></div>`;
const seF = (n) => `<div class="scr" style="background:#EEF1E6;width:375px;height:667px;border-radius:0">${sb()}${shot(n, 20, 375)}<div class="sf" style="height:87px"><div class="addr" style="margin-top:6px"><span style="font-size:15px">ᴀA</span><span>${S(G.lock, 13, '#555', 2.2)}svoiludi.ch</span><span>${S(G.reload, 18, '#333')}</span></div></div></div>`;
// снимок собирается, только когда нужен (можно пересобрать часть: node ramka.js <папка> yazyk)
const JOBS = {
  'app/app-home': ['p', () => appF('app-home')], 'app/app-tools': ['p', () => appF('app-tools')], 'app/app-more': ['p', () => appF('app-more')],
  'app/app-uk': ['p', () => appF('app-uk')], 'app/app-dark': ['p', () => appF('app-dark', '#1C2019', true)],
  'app/card-ios': ['p', () => safF('card-ios')], 'app/card-and': ['a', () => chrF('card-and')], 'app/card-inapp': ['p', () => inF('card-inapp')],
  'app/br-home': ['p', () => safF('br-home')], 'app/br-uk-dark': ['a', () => chrF('br-uk-dark', true)],
  'knopki/b-cards': ['p', () => safF('b-cards')], 'knopki/b-join': ['p', () => safF('b-join')], 'knopki/b-tools': ['p', () => safF('b-tools')],
  'yazyk/lang-ru': ['p', () => safF('lang-ru')], 'yazyk/lang-uk': ['p', () => safF('lang-uk')], 'yazyk/lang-app': ['p', () => appF('lang-app')],
  'yazyk/lang-dark': ['a', () => chrF('lang-dark', true)], 'yazyk/lang-vz': ['p', () => safF('lang-vz', 'voznesenskaya.ch', '#F4EDE3')],
  'yazyk/lang-vz-test': ['a', () => chrF('lang-vz-test', false, 'voznesenskaya.ch')], 'yazyk/lang-vz-app': ['p', () => appF('lang-vz-app', '#F4EDE3')],
  'org/org-list': ['p', () => safF('org-list')], 'org/org-card': ['p', () => safF('org-card')], 'org/org-card2': ['p', () => safF('org-card2')],
  'org/org-add': ['p', () => safF('org-add')], 'org/org-uk': ['a', () => chrF('org-uk')], 'org/org-main': ['p', () => safF('org-main')],
  'org/org-vac': ['p', () => safF('org-vac')], 'org/org-vac-kinds': ['a', () => chrF('org-vac-kinds')],
  'knopki/b-god': ['p', () => safF('b-god')], 'knopki/b-kursy': ['p', () => safF('b-kursy')], 'knopki/b-search': ['p', () => safF('b-search')],
  // галочка перед скачиванием (10.10.2026)
  'skachivanie/dl-off': ['p', () => safF('dl-off')], 'skachivanie/dl-need': ['p', () => safF('dl-need')], 'skachivanie/dl-toast': ['a', () => chrF('dl-toast')],
  'skachivanie/dl-uk': ['p', () => safF('dl-uk')], 'skachivanie/dl-vz': ['a', () => chrF('dl-vz', false, 'voznesenskaya.ch')],
};
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 470, height: 930 }, deviceScaleFactor: 1.32 });
  for (const [id, [kind, inner]] of Object.entries(JOBS)) {
    if (process.argv[3] && !id.startsWith(process.argv[3])) continue;
    fs.mkdirSync(OUT + '/' + id.split('/')[0], { recursive: true });
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body><div class="tile${kind === 'a' ? ' and' : ''}"><div class="phone">${inner()}</div></div></body></html>`;
    await p.setContent(html, { waitUntil: 'load' }); await p.waitForTimeout(120);
    await p.locator('.tile').screenshot({ path: `${OUT}/${id}.jpg`, type: 'jpeg', quality: 74 });
  }
  // планшет: экран 820×1160 в рамке
  const t = await b.newPage({ viewport: { width: 900, height: 1240 }, deviceScaleFactor: 1 });
  for (const n of (process.argv[3] ? [] : ['ipad', 'ipad-br'])) {
    const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}.tab{width:900px;height:1240px;display:flex;align-items:center;justify-content:center;background:#E3E8D6}.tab .fr{background:#1F1D1B;border-radius:38px;padding:18px;box-shadow:0 22px 44px -14px rgba(40,50,30,.45)}.tab .sc{width:820px;height:1180px;border-radius:22px;overflow:hidden;position:relative;background:#EEF1E6}.tab .sc img{position:absolute;left:0;top:20px;width:820px}</style></head><body><div class="tab"><div class="fr"><div class="sc"><div class="sb" style="height:20px;font-size:12px;padding:0 18px">9:41</div><img src="${d64(DIR + '/shots2/' + n + '.png')}"></div></div></div></body></html>`;
    await t.setContent(html, { waitUntil: 'load' }); await t.waitForTimeout(120);
    await t.locator('.tab').screenshot({ path: `${OUT}/app/${n}.jpg`, type: 'jpeg', quality: 72 });
  }
  await b.close();
})();
