/* =====================================================================
   АФИША «СВОИ ЛЮДИ В ШВЕЙЦАРИИ» — ОДНА база всего, что проводят специалисты и сообщества:
   события, встречи, праздники, курсы, регулярные занятия, мастер-классы, вебинары (решение Ирины 07.10.2026).
   Файл подключают: страница «События» (events/), страница «Курсы» (kursy/) и справочник —
   в карточке специалиста один блок «Встречи, курсы и вебинары» со всем, где он указан организатором.
   Добавляет и меняет Claude по заявке организатора. Размещение бесплатно до конца 2027 года.

   sections  — где показывать: ['events'] — во вкладке «События» (встретиться, отпраздновать: клубы, встречи,
               праздники, ретриты), ['kursy'] — во вкладке «Курсы» (научиться, заниматься: регулярные занятия, курсы,
               мастер-классы, ВЕБИНАРЫ), ['events', 'kursy'] — в обеих (например, бесплатная онлайн-встреча с вопросами)
   id        — латиницей, уникальный: ссылка svoiludi.ch/events/#id или svoiludi.ch/kursy/#id
   status    — 'активен' | 'пауза' | 'черновик' | 'на подтверждении' (на сайте видны только «активен»)
   key       — секрет для ссылки подтверждения svoiludi.ch/events/#ok=<id>.<key> или kursy/#ok=<id>.<key> (8 букв и цифр);
               ссылку отправляем на e-mail ИЗ КАРТОЧКИ организатора, он подтверждает одной кнопкой (assets/podtverdit.js, 10.10.2026)
   confirm   — { date: 'ГГГГ-ММ-ДД', via: 'кнопка на сайте' | 'письмо с адреса организатора' } — ставится после подтверждения
   title     — название
   type      — для «Событий»: meet — встречи и общение, lang — разговорные клубы и тандемы, kids — дети и семья,
               retreat — ретриты и выезды, culture — праздники и культура, talk — лекции и мастер-классы
               для «Курсов»: body — йога, танцы и движение, lang — языки, kids — для детей, create — творчество и рукоделие,
               pro — профессия и своё дело, life — жизнь в Швейцарии и саморазвитие
               (у записи в обеих вкладках: type — для «Событий», ktype — для «Курсов»)
   kind      — только для «Курсов»: 'regular' — регулярные занятия, 'course' — курс с общим началом,
               'once' — мастер-класс (очно) или вебинар (онлайн); sessions — сколько встреч в курсе
   date      — дата 'ГГГГ-ММ-ДД' (у повторяющихся — первая); dateEnd — последний день многодневного события
   time / timeEnd — '19:00' / '21:00' (без времени — на весь день)
   repeat    — { freq: 'weekly' } каждую неделю, { freq: 'weekly', interval: 2 } раз в две недели,
               { freq: 'monthly' } каждый месяц в тот же «n-й день недели»; until — до какой даты; except — даты без встречи
   canton, address, geo — место; online: true — онлайн (адреса может не быть)
   langs     — языки; level — для кого (уровень, возраст)
   price     — КОНЕЧНАЯ цена в CHF со всеми обязательными расходами и MWST: 'CHF 25' или 'бесплатно'
   per       — за что цена (для курсов): 'за занятие', 'за курс из 20 занятий', 'за вебинар'; priceNote — что ещё важно о цене
   commercial — true: платно — только организаторы с регистрацией в Швейцарии (UID, фирма или ферайн);
               false: бесплатно или взнос на расходы без заработка организатора
   organizers — id специалиста из справочника (data/specialists.js) или { name: 'Название', link: 'https://…' }
   link      — запись или подробности; about — 2–3 предложения
   contact   — для вопросов: e-mail, телефон или Telegram, несколько через « · » (другой телефон и e-mail из заявки — вместо карточки);
               если пусто, а организатор — карточка справочника, показываются телефон и e-mail из карточки (10.10.2026)
   address   — адрес из карточки организатора или другой адрес из заявки (он показывается вместо адреса карточки)

   Правила (проверка 07.10.2026): без обещаний лечения и «гарантированно найдём работу»; терапия (логопедия, психотерапия,
   физиотерапия) — не курс, а услуга специалиста с разрешением кантона; «fide» в названии — только с fide-Label;
   публикуем только по заявке самого организатора, его письмо или сообщение храним как согласие; платных выделений сейчас нет,
   если появятся — пометка «Реклама» (документы проекта «kursy-svoiludi.md», «svoiludi-vizitka-png.md»).
   ВНИМАНИЕ: сейчас здесь только ВЫМЫШЛЕННЫЕ образцы (sample: true).
   ===================================================================== */
window.AFISHA = [
  /* ---------- события ---------- */
  {
    sample: true,
    sections: ['events'],
    id: 'razgovornyj-klub-zurich', key: 'obr6', status: 'активен', title: 'Разговорный клуб немецкого языка', type: 'lang',
    date: '2026-10-08', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2026-12-17', except: ['2026-12-24'] },
    canton: 'Zürich', address: 'Limmatquai 70, 8001 Zürich', geo: [47.3740, 8.5440], online: false,
    langs: ['немецкий', 'русский'], price: 'CHF 15', commercial: true, organizers: ['irina-frei'],
    link: 'https://example.com/deutsch_club', contact: 'irina.frei@example.com',
    about: 'Говорим по-немецки на бытовые темы: школа, врач, работа, письма из коммуны. Уровень A2–B1, небольшие группы до 8 человек, без домашних заданий.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'vstrecha-mam-aarau', status: 'активен', title: 'Встреча мам с малышами', type: 'kids',
    date: '2026-10-10', time: '10:00', timeEnd: '12:00', repeat: { freq: 'monthly', until: '2027-06-30' },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['русский', 'украинский'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Клуб «Мамы Аарау»', link: 'https://example.com/mamy' }],
    link: 'https://example.com/mamy', contact: 'mamy@example.com',
    about: 'Каждую вторую субботу месяца: игровая комната для детей до 4 лет, чай для мам, обмен опытом о яслях, педиатрах и детских кружках. Взнос на чай по желанию.'
  },
  {
    sample: true,
    sections: ['events', 'kursy'], kind: 'once', ktype: 'life',
    id: 'adaptatsiya-onlajn', status: 'активен', title: 'Первые полгода в Швейцарии: вопросы и ответы', type: 'talk',
    date: '2026-10-15', time: '19:30', timeEnd: '21:00',
    canton: 'Zürich', address: '', online: true,
    langs: ['русский'], price: 'бесплатно', commercial: false, organizers: ['anna-keller', 'alina-shteuber'],
    link: 'https://example.com/webinar', contact: 'anna.keller@example.com',
    about: 'Онлайн-встреча для тех, кто недавно переехал: разрешения, страховки, коммуна, школа. Отвечаем на вопросы и рассказываем, с чего начать, чтобы не потеряться в первые месяцы.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'osennij-retrit-graubuenden', status: 'активен', title: 'Осенний ретрит «Дома в себе»', type: 'retreat',
    date: '2026-10-23', dateEnd: '2026-10-25',
    canton: 'Graubünden', address: 'Via Maistra 12, 7500 St. Moritz', geo: [46.4983, 9.8390], online: false,
    langs: ['русский'], price: 'CHF 480 (проживание и питание включены)', commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.com/retreat', contact: 'alina@example.com',
    about: 'Три дня в горах: прогулки, коучинговые практики и время для себя. Для женщин, которые переехали и хотят снова почувствовать опору. Группа до 12 человек.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'yazykovoj-tandem-basel', status: 'активен', title: 'Языковой тандем: русский ↔ немецкий', type: 'lang',
    date: '2026-10-14', time: '19:00', timeEnd: '21:00', repeat: { freq: 'weekly', interval: 2, until: '2027-03-31' },
    canton: 'Basel-Stadt', address: 'Steinenvorstadt 22, 4051 Basel', geo: [47.5530, 7.5880], online: false,
    langs: ['русский', 'немецкий'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Tandem Basel', link: 'https://example.com/tandem' }],
    link: 'https://example.com/tandem', contact: 'tandem@example.com',
    about: 'Полчаса говорим по-русски, полчаса по-немецки. Приходят и местные, кто учит русский, — хороший способ найти знакомых и практику языка.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'novogodnyaya-elka-luzern', status: 'активен', title: 'Новогодняя ёлка для детей', type: 'culture',
    date: '2026-12-19', time: '15:00', timeEnd: '17:30',
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['русский', 'украинский'], price: 'CHF 20 за ребёнка, взрослые бесплатно', commercial: true, organizers: ['oksana-roth', { name: 'Русская школа Люцерн', link: 'https://example.com/schule' }],
    link: 'https://example.com/elka', contact: 'oksana.roth@example.com',
    about: 'Хоровод, Дед Мороз и Снегурочка, подарки и спектакль от учеников русской школы. Для детей 3–10 лет, записаться нужно заранее.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'nalogi-seminar-zug', status: 'активен', title: 'Налоговая декларация: семинар для новичков', type: 'talk',
    date: '2027-02-06', time: '10:00', timeEnd: '12:30',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: true,
    langs: ['русский'], price: 'CHF 40', commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.com/steuern', contact: 'dmitri.huber@example.com',
    about: 'Как заполнить первую налоговую декларацию, какие вычеты положены семьям и что делать с иностранными доходами. Очно в Цуге и онлайн одновременно.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'piknik-bern', status: 'активен', title: 'Летний пикник у Аре', type: 'meet',
    date: '2027-06-19', time: '12:00', timeEnd: '17:00',
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['русский', 'украинский', 'немецкий'], price: 'бесплатно', commercial: false, organizers: [{ name: 'Свои люди Берн', link: 'https://example.com/bern' }],
    link: 'https://example.com/bern', contact: 'bern@example.com',
    about: 'Большой пикник для всех: каждый приносит что-то к общему столу, для детей игры и купание. Отличный способ познакомиться с теми, кто живёт рядом.'
  },

  /* ---------- курсы, занятия, мастер-классы, вебинары ---------- */
  {
    sample: true,
    sections: ['kursy'],
    id: 'myagkaya-joga-zurich', key: 'obr7', status: 'активен', title: 'Мягкая йога по вечерам', type: 'body', kind: 'regular',
    date: '2026-10-13', time: '19:00', timeEnd: '20:15', repeat: { freq: 'weekly', until: '2027-06-29', except: ['2026-12-22', '2026-12-29'] },
    canton: 'Zürich', address: 'Seefeldstrasse 45, 8008 Zürich', geo: [47.3600, 8.5520], online: false,
    langs: ['русский', 'украинский'], level: 'любой уровень, можно без опыта',
    price: 'CHF 25', per: 'за занятие', priceNote: 'абонемент на 10 занятий — CHF 220, первое занятие — CHF 10; коврики есть в зале',
    commercial: true, organizers: ['olga-marti'],
    link: 'https://example.com/joga', contact: 'olga.marti@example.com',
    about: 'Спокойная практика после рабочего дня: дыхание, растяжка и долгое расслабление в конце. Группа до 10 человек, можно прийти на любое занятие и остаться.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'nemeckij-a1-aarau', status: 'активен', title: 'Немецкий с нуля: курс A1 для взрослых', type: 'lang', kind: 'course', sessions: 20,
    date: '2026-10-19', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2027-03-15', except: ['2026-12-21', '2026-12-28'] },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['немецкий', 'русский'], level: 'с нуля, взрослые',
    price: 'CHF 480', per: 'за курс из 20 занятий', priceNote: 'учебник и рабочая тетрадь включены; можно платить двумя частями',
    commercial: true, organizers: ['irina-frei'],
    link: 'https://example.com/deutsch-a1', contact: 'irina.frei@example.com',
    about: 'Группа до 8 человек, раз в неделю по полтора часа. Учимся говорить о себе, понимать письма из коммуны и разговаривать в магазине и у врача. Объясняю по-русски, говорим по-немецки.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'nalogi-samozanyatyh-vebinar', status: 'активен', title: 'Налоги для самозанятых: первый год', type: 'pro', kind: 'once',
    date: '2026-11-12', time: '19:00', timeEnd: '20:30',
    canton: 'Zug', address: '', online: true,
    langs: ['русский'], level: 'для тех, кто работает на себя или только начинает',
    price: 'CHF 35', per: 'за вебинар', priceNote: 'запись вебинара включена',
    commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.com/webinar-steuern', contact: 'dmitri.huber@example.com',
    about: 'Как платить AHV на своё дело, какие расходы можно вычесть и что делать с налоговой декларацией в первый год. В конце отвечаю на вопросы участников.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'vremya-dlya-sebya-onlajn', status: 'активен', title: 'Время для себя: 6 вечеров в женском кругу', type: 'life', kind: 'course', sessions: 6,
    date: '2026-11-05', time: '19:30', timeEnd: '21:00', repeat: { freq: 'weekly', until: '2026-12-10' },
    canton: 'Zürich', address: '', online: true,
    langs: ['русский'], level: 'для женщин, которые недавно переехали',
    price: 'CHF 240', per: 'за курс из 6 встреч', priceNote: 'рабочая тетрадь в PDF включена',
    commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.com/krug', contact: 'alina@example.com',
    about: 'Шесть онлайн-встреч в небольшой группе. Говорим о том, как найти опору после переезда, выстроить свой ритм и не потерять себя между работой, семьёй и новым языком.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'muzykalnye-igry-luzern', status: 'активен', title: 'Музыкальные игры для малышей', type: 'kids', kind: 'regular',
    date: '2026-10-17', time: '10:00', timeEnd: '10:45', repeat: { freq: 'weekly', until: '2027-06-26', except: ['2026-12-26', '2027-01-02'] },
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['русский'], level: 'дети 3–5 лет вместе с мамой или папой',
    price: 'CHF 20', per: 'за занятие', priceNote: 'пробное занятие бесплатно',
    commercial: true, organizers: ['oksana-roth'],
    link: 'https://example.com/muzykalnye-igry', contact: 'oksana.roth@example.com',
    about: 'Игровые занятия под музыку: движения, песенки, стишки, пальчиковые игры. Малыши слышат русскую речь и играют вместе с другими детьми. Это не логопедические занятия и не терапия.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'akvarel-master-klass-zug', status: 'активен', title: 'Акварель для начинающих', type: 'create', kind: 'once',
    date: '2026-11-21', time: '14:00', timeEnd: '17:00',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: false,
    langs: ['русский', 'украинский'], level: 'без опыта, с 14 лет',
    price: 'CHF 60', per: 'за мастер-класс', priceNote: 'краски, кисти и бумага включены, чай тоже',
    commercial: true, organizers: [{ name: 'Ателье «Палитра»', link: 'https://example.com/palitra' }],
    link: 'https://example.com/palitra', contact: 'atelier@example.com',
    about: 'За три часа рисуем осенний пейзаж и пробуем главные приёмы акварели. Каждый уносит домой свою готовую работу.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'shahmaty-deti-bern', status: 'активен', title: 'Шахматный кружок для детей', type: 'kids', kind: 'regular',
    date: '2026-10-16', time: '17:00', timeEnd: '18:00', repeat: { freq: 'weekly', until: '2027-06-25', except: ['2026-12-25', '2027-01-01'] },
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['русский', 'украинский', 'немецкий'], level: 'дети 6–12 лет, можно без опыта',
    price: 'бесплатно', per: '', priceNote: 'родители по очереди приносят чай и печенье',
    commercial: false, organizers: [{ name: 'Свои люди Берн', link: 'https://example.com/bern' }],
    link: 'https://example.com/bern', contact: 'bern@example.com',
    about: 'Каждую пятницу играем, решаем задачки и устраиваем маленькие турниры. Ведут родители, которые сами любят шахматы.'
  }
];
