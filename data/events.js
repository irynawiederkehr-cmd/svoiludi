/* =====================================================================
   СОБЫТИЯ «СВОИ ЛЮДИ В ШВЕЙЦАРИИ» — единственное место, где хранятся события.
   Файл подключают страница событий (events/) и справочник (карточка специалиста, блок «Ближайшие мероприятия»).
   Добавляет и меняет Claude по письму организатора (решено 04.10.2026).

   id        — латиницей, уникальный: ссылка на событие svoiludi.ch/events/#id
   status    — 'активен' | 'пауза' | 'черновик' (на сайте видны только «активен»)
   title     — название; type — вид события (список TYPES на странице событий):
               meet — встречи и общение, lang — разговорные клубы и тандемы, kids — дети и семья,
               retreat — ретриты и выезды, culture — праздники и культура, talk — лекции и мастер-классы
   date      — дата 'ГГГГ-ММ-ДД' (у повторяющихся — первая дата); dateEnd — последний день, если событие длится несколько дней
   time      — '19:00'; timeEnd — '21:00' (без времени — событие на весь день)
   repeat    — повторение: { freq: 'weekly' } каждую неделю в тот же день, { freq: 'weekly', interval: 2 } раз в две недели,
               { freq: 'monthly' } каждый месяц в тот же «n-й день недели», что у первой даты (например, каждая первая суббота);
               until — до какой даты; except — список дат, когда события нет
   canton, address, geo — место (кантон как в справочнике; geo — координаты для карты); online: true — онлайн (адреса может не быть)
   langs     — языки события; price — 'бесплатно' или 'CHF 20' / 'CHF 15, дети бесплатно'
   commercial — true: коммерческое (платный вход, продажа услуг) — только организаторы с регистрацией (UID, фирма или ферайн);
               false: некоммерческое (клуб, встреча, взнос на расходы) — без регистрации
   organizers — список: id специалиста из справочника (data.js) или { name: 'Название сообщества', link: 'https://…' }
   link      — запись или подробности; contact — e-mail или Telegram для вопросов
   about     — описание в 2–3 предложениях

   ВНИМАНИЕ: сейчас здесь только ВЫМЫШЛЕННЫЕ события для пробной страницы.
   ===================================================================== */
window.EVENTS = [
  {
    sample: true,
    id: 'razgovornyj-klub-zurich', status: 'активен', title: 'Разговорный клуб немецкого языка', type: 'lang',
    date: '2026-10-08', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2026-12-17', except: ['2026-12-24'] },
    canton: 'Zürich', address: 'Limmatquai 70, 8001 Zürich', geo: [47.3740, 8.5440], online: false,
    langs: ['немецкий', 'русский'], price: 'CHF 15', commercial: true, organizers: ['irina-frei'],
    link: 'https://t.me/example_deutsch_club', contact: 'irina.frei@example.ch',
    about: 'Говорим по-немецки на бытовые темы: школа, врач, работа, письма из коммуны. Уровень A2–B1, небольшие группы до 8 человек, без домашних заданий.'
  },
  {
    sample: true,
    id: 'vstrecha-mam-aarau', status: 'активен', title: 'Встреча мам с малышами', type: 'kids',
    date: '2026-10-10', time: '10:00', timeEnd: '12:00', repeat: { freq: 'monthly', until: '2027-06-30' },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['русский', 'украинский'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Клуб «Мамы Аарау»', link: 'https://t.me/example_mamy' }],
    link: 'https://t.me/example_mamy', contact: '@example_mamy',
    about: 'Каждую вторую субботу месяца: игровая комната для детей до 4 лет, чай для мам, обмен опытом о яслях, педиатрах и детских кружках. Взнос на чай по желанию.'
  },
  {
    sample: true,
    id: 'adaptatsiya-onlajn', status: 'активен', title: 'Первые полгода в Швейцарии: вопросы и ответы', type: 'talk',
    date: '2026-10-15', time: '19:30', timeEnd: '21:00',
    canton: 'Zürich', address: '', online: true,
    langs: ['русский'], price: 'бесплатно', commercial: false, organizers: ['anna-keller', 'alina-shteuber'],
    link: 'https://example.ch/webinar', contact: 'anna.keller@example.ch',
    about: 'Онлайн-встреча для тех, кто недавно переехал: разрешения, страховки, коммуна, школа. Отвечаем на вопросы и рассказываем, с чего начать, чтобы не потеряться в первые месяцы.'
  },
  {
    sample: true,
    id: 'osennij-retrit-graubuenden', status: 'активен', title: 'Осенний ретрит «Дома в себе»', type: 'retreat',
    date: '2026-10-23', dateEnd: '2026-10-25',
    canton: 'Graubünden', address: 'Via Maistra 12, 7500 St. Moritz', geo: [46.4983, 9.8390], online: false,
    langs: ['русский'], price: 'CHF 480 (проживание и питание включены)', commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.ch/retreat', contact: 'alina@example.ch',
    about: 'Три дня в горах: прогулки, коучинговые практики и время для себя. Для женщин, которые переехали и хотят снова почувствовать опору. Группа до 12 человек.'
  },
  {
    sample: true,
    id: 'yazykovoj-tandem-basel', status: 'активен', title: 'Языковой тандем: русский ↔ немецкий', type: 'lang',
    date: '2026-10-14', time: '19:00', timeEnd: '21:00', repeat: { freq: 'weekly', interval: 2, until: '2027-03-31' },
    canton: 'Basel-Stadt', address: 'Steinenvorstadt 22, 4051 Basel', geo: [47.5530, 7.5880], online: false,
    langs: ['русский', 'немецкий'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Tandem Basel', link: 'https://example.ch/tandem' }],
    link: 'https://example.ch/tandem', contact: 'tandem@example.ch',
    about: 'Полчаса говорим по-русски, полчаса по-немецки. Приходят и местные, кто учит русский, — хороший способ найти знакомых и практику языка.'
  },
  {
    sample: true,
    id: 'novogodnyaya-elka-luzern', status: 'активен', title: 'Новогодняя ёлка для детей', type: 'culture',
    date: '2026-12-19', time: '15:00', timeEnd: '17:30',
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['русский', 'украинский'], price: 'CHF 20 за ребёнка, взрослые бесплатно', commercial: true, organizers: ['oksana-roth', { name: 'Русская школа Люцерн', link: 'https://example.ch/schule' }],
    link: 'https://example.ch/elka', contact: 'oksana.roth@example.ch',
    about: 'Хоровод, Дед Мороз и Снегурочка, подарки и спектакль от учеников русской школы. Для детей 3–10 лет, записаться нужно заранее.'
  },
  {
    sample: true,
    id: 'nalogi-seminar-zug', status: 'активен', title: 'Налоговая декларация: семинар для новичков', type: 'talk',
    date: '2027-02-06', time: '10:00', timeEnd: '12:30',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: true,
    langs: ['русский'], price: 'CHF 40', commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.ch/steuern', contact: 'dmitri.huber@example.ch',
    about: 'Как заполнить первую налоговую декларацию, какие вычеты положены семьям и что делать с иностранными доходами. Очно в Цуге и онлайн одновременно.'
  },
  {
    sample: true,
    id: 'piknik-bern', status: 'активен', title: 'Летний пикник у Аре', type: 'meet',
    date: '2027-06-19', time: '12:00', timeEnd: '17:00',
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['русский', 'украинский', 'немецкий'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Свои люди Берн', link: 'https://t.me/example_bern' }],
    link: 'https://t.me/example_bern', contact: '@example_bern',
    about: 'Большой пикник для всех: каждый приносит что-то к общему столу, для детей игры и купание. Отличный способ познакомиться с теми, кто живёт рядом.'
  }
];
