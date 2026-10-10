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
  { id: 'approach', group: 'Главная', title: '«На чём держится наша работа» — метод и четыре опоры', page: '/', sel: '#approach', w: ['phone', 'desk'], themes: L },
  { id: 'session', group: 'Главная', title: '«Первая встреча — это не экзамен»: факты и шаги', page: '/', sel: '#session', w: ['phone'], themes: L, maxH: 1800 },
  { id: 'path', group: 'Главная', title: 'Программы по шагам метода: группы, цветок, точки ступеней, цена', page: '/', sel: '#path', w: ['desk'], themes: D, maxH: 2200 },
  { id: 'pblock', group: 'Главная', title: 'Карточка программы на телефоне', page: '/', sel: '#path .pblock', w: ['phone'], themes: D },
  { id: 'pdlg', group: 'Главная', title: 'Окно программы: «На каких ступенях помогает», «Куда дальше»', page: '/', sel: 'dialog#pdlg .qm-card', viewport: true, keep: true, w: ['phone', 'desk'], themes: L, before: async (p) => { await click('#path .pblock[data-p="year"]')(p); await p.evaluate(() => { const h = document.querySelector('dialog#pdlg .pd-steps'); if (h) h.scrollIntoView({ block: 'center' }); window.scrollTo(0, 0); }); await p.waitForTimeout(400); } },
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
  { id: 't-dl', group: 'Тесты', title: 'Галочка перед скачиванием разбора и бланка', page: '/stupeni/', sel: '.svl-dl', w: ['phone'], themes: D, pad: 8, wait: 900, before: async (p) => { await p.evaluate(() => { ['intro', 'quiz'].forEach(i => { const e = document.getElementById(i); if (e) e.hidden = true; }); const r = document.getElementById('result'); if (r) r.hidden = false; }); await p.waitForTimeout(700); await p.evaluate(() => { const c = document.querySelector('.svl-dl input'); if (c && c.checked) c.click(); }); await p.waitForTimeout(200); } },
  // Рабочий лист «Карта опор» (на сайте с 10.10.2026)
  { id: 'k-intro', group: 'Тесты', title: '«Карта опор»: вступление, точка А → Б, как устроено', page: '/karta-opor/', sel: '#sStart', w: ['phone'], themes: L, maxH: 2600 },
  { id: 'k-card', group: 'Тесты', title: '«Карта опор»: карточка опоры — насколько держит, снаружи и внутри', page: '/karta-opor/', sel: '#oCard', w: ['phone'], themes: D, wait: 600, before: async (p) => { await p.evaluate(() => { localStorage.removeItem('kartaOpor.v1'); }); await p.locator('#country button[data-v="ch"]').click(); await p.locator('#goStart').click(); await p.waitForTimeout(300); await p.locator('#rates .opt[data-r="2"]').click(); await p.locator('#oCard .chip').nth(0).click(); await p.locator('#oCard .chip').nth(7).click(); } },
  { id: 'd-form', group: 'Тесты', title: '«Договор о коучинге»: форма — программа, данные, подтверждения', page: '/dogovor/?p=fund', sel: '#sForm', w: ['phone'], themes: L, maxH: 2600 },
  { id: 'd-doc', group: 'Тесты', title: '«Договор о коучинге»: договор на проверку и подпись', page: '/dogovor/?p=fund', sel: '#sReview', w: ['phone'], themes: L, maxH: 2200, wait: 1500, before: async (p) => { await p.fill('#fName', 'Анна Петренко'); await p.fill('#fEmail', 'anna@example.com'); await p.selectOption('#fCountry', 'CH'); await p.fill('#fCity', 'Zürich'); for (const id of ['#cAdult', '#cCoach', '#cNotes']) await p.check(id); await p.click('#toReview'); await p.waitForTimeout(1200); } },
];
