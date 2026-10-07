/* =====================================================================
   КУРСЫ И ЗАНЯТИЯ «СВОИ ЛЮДИ В ШВЕЙЦАРИИ» — единственное место, где хранятся курсы.
   Файл подключают страница курсов (kursy/) и справочник (карточка специалиста, блок «Курсы и занятия»).
   Добавляет и меняет Claude по заявке организатора (решено 07.10.2026). Размещение бесплатно до конца 2027 года.

   id        — латиницей, уникальный: ссылка на курс svoiludi.ch/kursy/#id
   status    — 'активен' | 'пауза' | 'черновик' (на сайте видны только «активен»)
   title     — название; type — направление (список KTYPES на странице курсов):
               body — йога, танцы и движение, lang — языки, kids — для детей, create — творчество и рукоделие,
               pro — профессия и своё дело, life — жизнь в Швейцарии и саморазвитие
   kind      — формат: 'regular' — регулярные занятия (можно прийти в любой момент), 'course' — курс с общим началом,
               'once' — мастер-класс или вебинар (одна встреча)
   sessions  — сколько встреч в курсе (для kind: 'course')
   date      — первое занятие 'ГГГГ-ММ-ДД'; time — '19:00'; timeEnd — '20:15'
   repeat    — как у событий: { freq: 'weekly' } каждую неделю, { freq: 'weekly', interval: 2 } раз в две недели,
               { freq: 'monthly' } каждый месяц в тот же «n-й день недели»; until — до какой даты; except — даты без занятия
   canton, address, geo — место (кантон как в справочнике); online: true — онлайн (адреса может не быть)
   langs     — языки занятий; level — для кого (уровень, возраст)
   price     — КОНЕЧНАЯ цена в швейцарских франках со всеми обязательными расходами и MWST: 'CHF 25' или 'бесплатно'
   per       — за что цена: 'за занятие', 'за курс из 20 занятий', 'за мастер-класс', 'за вебинар'
   priceNote — что ещё важно о цене: абонемент, пробное занятие, что включено (материалы, запись)
   commercial — true: платный курс — только организаторы с регистрацией в Швейцарии (UID, фирма или ферайн);
               false: бесплатный кружок или клуб без заработка организатора
   organizers — id специалиста из справочника (data/specialists.js) или { name: 'Название', link: 'https://…' }
   link      — запись; contact — e-mail или Telegram для вопросов; about — 2–3 предложения о курсе

   Правила (07.10.2026): без обещаний лечения и результата для здоровья, без «гарантированно найдём работу»;
   никаких платных выделений сейчас; если появятся — пометка «Реклама» (документ проекта «svoiludi-vizitka-png.md»).
   ВНИМАНИЕ: сейчас здесь только ВЫМЫШЛЕННЫЕ курсы-образцы (sample: true).
   ===================================================================== */
window.KURSY = [
  {
    sample: true,
    id: 'myagkaya-joga-zurich', status: 'активен', title: 'Мягкая йога по вечерам', type: 'body', kind: 'regular',
    date: '2026-10-13', time: '19:00', timeEnd: '20:15', repeat: { freq: 'weekly', until: '2027-06-29', except: ['2026-12-22', '2026-12-29'] },
    canton: 'Zürich', address: 'Seefeldstrasse 45, 8008 Zürich', geo: [47.3600, 8.5520], online: false,
    langs: ['русский', 'украинский'], level: 'любой уровень, можно без опыта',
    price: 'CHF 25', per: 'за занятие', priceNote: 'абонемент на 10 занятий — CHF 220, первое занятие — CHF 10; коврики есть в зале',
    commercial: true, organizers: ['olga-marti'],
    link: 'https://example.ch/joga', contact: 'olga.marti@example.ch',
    about: 'Спокойная практика после рабочего дня: дыхание, растяжка и долгое расслабление в конце. Группа до 10 человек, можно прийти на любое занятие и остаться.'
  },
  {
    sample: true,
    id: 'nemeckij-a1-aarau', status: 'активен', title: 'Немецкий с нуля: курс A1 для взрослых', type: 'lang', kind: 'course', sessions: 20,
    date: '2026-10-19', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2027-03-15', except: ['2026-12-21', '2026-12-28'] },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['немецкий', 'русский'], level: 'с нуля, взрослые',
    price: 'CHF 480', per: 'за курс из 20 занятий', priceNote: 'учебник и рабочая тетрадь включены; можно платить двумя частями',
    commercial: true, organizers: ['irina-frei'],
    link: 'https://example.ch/deutsch-a1', contact: 'irina.frei@example.ch',
    about: 'Группа до 8 человек, раз в неделю по полтора часа. Учимся говорить о себе, понимать письма из коммуны и разговаривать в магазине и у врача. Объясняю по-русски, говорим по-немецки.'
  },
  {
    sample: true,
    id: 'nalogi-samozanyatyh-vebinar', status: 'активен', title: 'Налоги для самозанятых: первый год', type: 'pro', kind: 'once',
    date: '2026-11-12', time: '19:00', timeEnd: '20:30',
    canton: 'Zug', address: '', online: true,
    langs: ['русский'], level: 'для тех, кто работает на себя или только начинает',
    price: 'CHF 35', per: 'за вебинар', priceNote: 'запись вебинара включена',
    commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.ch/webinar-steuern', contact: 'dmitri.huber@example.ch',
    about: 'Как платить AHV на своё дело, какие расходы можно вычесть и что делать с налоговой декларацией в первый год. В конце отвечаю на вопросы участников.'
  },
  {
    sample: true,
    id: 'vremya-dlya-sebya-onlajn', status: 'активен', title: 'Время для себя: 6 вечеров в женском кругу', type: 'life', kind: 'course', sessions: 6,
    date: '2026-11-05', time: '19:30', timeEnd: '21:00', repeat: { freq: 'weekly', until: '2026-12-10' },
    canton: 'Zürich', address: '', online: true,
    langs: ['русский'], level: 'для женщин, которые недавно переехали',
    price: 'CHF 240', per: 'за курс из 6 встреч', priceNote: 'рабочая тетрадь в PDF включена',
    commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.ch/krug', contact: 'alina@example.ch',
    about: 'Шесть онлайн-встреч в небольшой группе. Говорим о том, как найти опору после переезда, выстроить свой ритм и не потерять себя между работой, семьёй и новым языком.'
  },
  {
    sample: true,
    id: 'logoritmika-luzern', status: 'активен', title: 'Логоритмика для малышей', type: 'kids', kind: 'regular',
    date: '2026-10-17', time: '10:00', timeEnd: '10:45', repeat: { freq: 'weekly', until: '2027-06-26', except: ['2026-12-26', '2027-01-02'] },
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['русский'], level: 'дети 3–5 лет вместе с мамой или папой',
    price: 'CHF 20', per: 'за занятие', priceNote: 'пробное занятие бесплатно',
    commercial: true, organizers: ['oksana-roth'],
    link: 'https://example.ch/logoritmika', contact: 'oksana.roth@example.ch',
    about: 'Игровые занятия под музыку: движения, стишки, пальчиковые игры. Малыши слышат русскую речь и играют вместе с другими детьми.'
  },
  {
    sample: true,
    id: 'akvarel-master-klass-zug', status: 'активен', title: 'Акварель для начинающих', type: 'create', kind: 'once',
    date: '2026-11-21', time: '14:00', timeEnd: '17:00',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: false,
    langs: ['русский', 'украинский'], level: 'без опыта, с 14 лет',
    price: 'CHF 60', per: 'за мастер-класс', priceNote: 'краски, кисти и бумага включены, чай тоже',
    commercial: true, organizers: [{ name: 'Ателье «Палитра»', link: 'https://example.ch/palitra' }],
    link: 'https://example.ch/palitra', contact: 'atelier@example.ch',
    about: 'За три часа рисуем осенний пейзаж и пробуем главные приёмы акварели. Каждый уносит домой свою готовую работу.'
  },
  {
    sample: true,
    id: 'shahmaty-deti-bern', status: 'активен', title: 'Шахматный кружок для детей', type: 'kids', kind: 'regular',
    date: '2026-10-16', time: '17:00', timeEnd: '18:00', repeat: { freq: 'weekly', until: '2027-06-25', except: ['2026-12-25', '2027-01-01'] },
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['русский', 'украинский', 'немецкий'], level: 'дети 6–12 лет, можно без опыта',
    price: 'бесплатно', per: '', priceNote: 'родители по очереди приносят чай и печенье',
    commercial: false, organizers: [{ name: 'Свои люди Берн', link: 'https://t.me/example_bern' }],
    link: 'https://t.me/example_bern', contact: '@example_bern',
    about: 'Каждую пятницу играем, решаем задачки и устраиваем маленькие турниры. Ведут родители, которые сами любят шахматы.'
  }
];
