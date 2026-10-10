// Элементы voznesenskaya.ch для библиотеки стиля: где снимать и как назвать.
// w — phone (390 px) и/или desk (1280 px); themes — light и/или dark; text — что это и когда брать (заполняется в texts.js).
const D = ['light', 'dark'], L = ['light'];
const showStart = async (p) => { await p.evaluate(() => { const t = document.getElementById('testStart'); if (t) { t.hidden = false; t.style.display = ''; } }); };
const click = (sel) => async (p) => { await p.locator(sel).first().scrollIntoViewIfNeeded(); await p.locator(sel).first().click(); await p.waitForTimeout(500); };
module.exports = [
  // Шапка и навигация
  { id: 'first', group: 'Шапка и навигация', title: 'Первый экран: шапка, меню плитками, кнопка установки', page: '/', sel: 'body', viewport: true, w: ['phone', 'desk'], themes: D },
  { id: 'header', group: 'Шапка и навигация', title: 'Шапка главного сайта', page: '/', sel: 'header.top', w: ['phone', 'desk'], themes: L },
  { id: 'langbar', group: 'Шапка и навигация', title: 'Переключатель языков RU · UA · DE · EN', page: '/', sel: '#langbar', keep: true, w: ['phone'], themes: D, pad: 8 },
  { id: 'sitebar', group: 'Шапка и навигация', title: 'Шапка страниц тестов', page: '/testy/', sel: 'header.sitebar', w: ['phone', 'desk'], themes: L },
  { id: 'tabs', group: 'Шапка и навигация', title: 'Вкладки внизу в режиме приложения', page: '/?app=1', sel: '.pa-tabs', keep: true, w: ['phone'], themes: D },
  { id: 'more', group: 'Шапка и навигация', title: 'Лист «Ещё» в приложении', page: '/?app=1', sel: '.pa-sheet', keep: true, w: ['phone'], themes: D, before: click('.pa-tabs li:last-child > *') },
  { id: 'langask', group: 'Шапка и навигация', title: 'Вопрос о языке при первом заходе', page: '/?lang=ask', sel: '.pa-lang', keep: true, w: ['phone'], themes: D, wait: 1200 },
  { id: 'hint', group: 'Шапка и навигация', title: 'Подсказка «Установить как приложение»', page: '/?install=ios', sel: '.pa-card', keep: true, w: ['phone'], themes: D, wait: 1200 },
  { id: 'footer', group: 'Шапка и навигация', title: 'Подвал', page: '/', sel: 'footer', w: ['phone'], themes: L },
  // Главная
  { id: 'hero', group: 'Главная', title: 'Первый блок главной: заголовок, вступление, кнопки-переходы', page: '/', sel: '.w-hero', w: ['phone', 'desk'], themes: D },
  { id: 'who', group: 'Главная', title: '«Привет! Меня зовут Ирина»: картинка, плашки, пути', page: '/', sel: '#who', w: ['phone', 'desk'], themes: L, maxH: 1700 },
  { id: 'requests', group: 'Главная', title: '«Узнаёшь себя?» — список запросов', page: '/', sel: '#requests', w: ['phone'], themes: D },
  { id: 'qm', group: 'Главная', title: 'Окно запроса (открывается по нажатию на фразу)', page: '/', sel: 'dialog#qm .qm-card', keep: true, w: ['phone'], themes: D, before: click('#requests .rq') },
  { id: 'approach', group: 'Главная', title: '«На чём держится наша работа» — опоры', page: '/', sel: '#approach', w: ['phone', 'desk'], themes: L },
  { id: 'session', group: 'Главная', title: '«Первая встреча — это не экзамен»: факты и шаги', page: '/', sel: '#session', w: ['phone'], themes: L, maxH: 1800 },
  { id: 'path', group: 'Главная', title: 'Пути работы: карточки продуктов с ценой', page: '/', sel: '#path', w: ['desk'], themes: D, maxH: 2200 },
  { id: 'pblock', group: 'Главная', title: 'Карточка продукта на телефоне', page: '/', sel: '#path .pblock', w: ['phone'], themes: D },
  { id: 'pdlg', group: 'Главная', title: 'Окно продукта «Подробнее»', page: '/', sel: 'dialog#pdlg .qm-card', keep: true, w: ['phone'], themes: L, before: click('#path .pb-more') },
  { id: 'result', group: 'Главная', title: '«Что меняется для тебя» — результаты', page: '/', sel: '#result', w: ['phone'], themes: L },
  { id: 'reviews', group: 'Главная', title: 'Отзывы клиентов (листаются)', page: '/', sel: '#reviews', w: ['phone'], themes: D },
  { id: 'faq', group: 'Главная', title: 'Вопросы и ответы', page: '/', sel: '#faq', w: ['phone'], themes: L, before: click('#faq summary') },
  { id: 'limits', group: 'Главная', title: '«Когда коучинг не подходит»', page: '/', sel: '.limits', w: ['phone'], themes: L },
  { id: 'novoe', group: 'Главная', title: 'Блок «Новое»', page: '/', sel: '#novoe', w: ['phone', 'desk'], themes: L },
  { id: 'contact', group: 'Главная', title: '«Давай познакомимся» — контакты', page: '/', sel: '#contact', w: ['phone', 'desk'], themes: D },
  // Твой путь
  { id: 'p-hero', group: 'Твой путь', title: 'Первый блок страницы «Твой путь»', page: '/put/', sel: '.p-hero', w: ['phone', 'desk'], themes: L },
  { id: 'rules', group: 'Твой путь', title: 'Правила пути', page: '/put/', sel: '.rules', w: ['phone'], themes: L },
  { id: 'trail', group: 'Твой путь', title: 'Дорога пути: восемь ступеней снизу вверх', page: '/put/', sel: '#trailWrap', w: ['phone'], themes: D, maxH: 2000 },
  { id: 'help', group: 'Твой путь', title: 'Окно ступени: «Что ты собираешь в себе» и «Что поможет на этой ступени»', page: '/put/', sel: 'dialog#qm .qm-help', viewport: true, keep: true, w: ['phone', 'desk'], themes: L, before: async (p) => { await click('.stop .card[data-k="4"]')(p); await p.evaluate(() => { const h = document.querySelector('dialog#qm .qm-help'); if (h) h.scrollIntoView({ block: 'start' }); window.scrollTo(0, 0); }); await p.waitForTimeout(400); } },
  { id: 'where', group: 'Твой путь', title: '«Где ты сейчас на этом пути?»', page: '/put/', sel: '.where', w: ['phone'], themes: L },
  { id: 'rvs', group: 'Твой путь', title: 'Отзывы на странице пути', page: '/put/', sel: '.rvs', w: ['phone'], themes: L },
  { id: 'share', group: 'Твой путь', title: 'Поделиться страницей', page: '/put/', sel: '.shr', w: ['phone'], themes: L },
  // Тесты
  { id: 'hub-top', group: 'Тесты', title: 'Вступление страницы тестов с веером отчёта', page: '/testy/', sel: '.hub-top', w: ['phone', 'desk'], themes: D },
  { id: 'hub-tests', group: 'Тесты', title: 'Карточки тестов', page: '/testy/', sel: '.hub-tests', w: ['phone', 'desk'], themes: D, maxH: 2200 },
  { id: 'hub-steps', group: 'Тесты', title: '«Как это устроено» — шаги', page: '/testy/', sel: '.hub-steps', w: ['phone'], themes: L },
  { id: 'hub-me', group: 'Тесты', title: 'Коротко об авторе', page: '/testy/', sel: '.hub-me-mini', w: ['phone'], themes: L },
  { id: 'disclaimer', group: 'Тесты', title: 'Пометка «это не диагноз»', page: '/testy/', sel: '.disclaimer', w: ['phone'], themes: L },
  { id: 't-author', group: 'Тесты', title: 'Начало теста: приветствие автора', page: '/stupeni/', sel: '#intro .author', w: ['phone'], themes: D },
  { id: 't-survey', group: 'Тесты', title: 'Короткий опрос перед тестом', page: '/stupeni/', sel: '#intro .surveys', w: ['phone'], themes: L },
  { id: 't-tiles', group: 'Тесты', title: 'Плитки ступеней («Ступени устойчивости»)', page: '/stupeni/', sel: '.st-tiles', w: ['phone', 'desk'], themes: D, before: showStart },
  { id: 't-ab', group: 'Тесты', title: '«Точка А → точка Б»', page: '/kompas/', sel: '#intro .ab', w: ['phone'], themes: D, before: showStart },
  { id: 't-roles', group: 'Тесты', title: 'Роли в паре («Быть рядом и быть собой»)', page: '/blizost/', sel: '.roles', w: ['phone'], themes: D, before: showStart },
];
