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
   status    — 'активен' | 'пауза' | 'черновик' (на сайте видны только «активен»)
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
   link      — запись или подробности; contact — e-mail или Telegram для вопросов; about — 2–3 предложения

   Правила: без обещаний лечения и «гарантированно найдём работу»; платных выделений сейчас нет,
   если появятся — пометка «Реклама» (документы проекта «kursy-svoiludi.md», «svoiludi-vizitka-png.md»).
   ВНИМАНИЕ: сейчас здесь только ВЫМЫШЛЕННЫЕ образцы (sample: true).
   ===================================================================== */
window.AFISHA = [
  /* ---------- события ---------- */
  {
    sample: true,
    sections: ['events'],
    id: 'razgovornyj-klub-zurich', status: 'активен', title: 'Розмовний клуб німецької мови', type: 'lang',
    date: '2026-10-08', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2026-12-17', except: ['2026-12-24'] },
    canton: 'Zürich', address: 'Limmatquai 70, 8001 Zürich', geo: [47.3740, 8.5440], online: false,
    langs: ['німецька', 'російська'], price: 'CHF 15', commercial: true, organizers: ['irina-frei'],
    link: 'https://t.me/example_deutsch_club', contact: 'irina.frei@example.ch',
    about: 'Говоримо німецькою на побутові теми: школа, лікар, робота, листи з комуни. Рівень A2–B1, невеликі групи до 8 осіб, без домашніх завдань.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'vstrecha-mam-aarau', status: 'активен', title: 'Зустріч мам із малюками', type: 'kids',
    date: '2026-10-10', time: '10:00', timeEnd: '12:00', repeat: { freq: 'monthly', until: '2027-06-30' },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['російська', 'українська'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Клуб «Мами Аарау»', link: 'https://t.me/example_mamy' }],
    link: 'https://t.me/example_mamy', contact: '@example_mamy',
    about: 'Кожної другої суботи місяця: ігрова кімната для дітей до 4 років, чай для мам, обмін досвідом про ясла, педіатрів і дитячі гуртки. Внесок на чай за бажанням.'
  },
  {
    sample: true,
    sections: ['events', 'kursy'], kind: 'once', ktype: 'life',
    id: 'adaptatsiya-onlajn', status: 'активен', title: 'Перші пів року у Швейцарії: запитання й відповіді', type: 'talk',
    date: '2026-10-15', time: '19:30', timeEnd: '21:00',
    canton: 'Zürich', address: '', online: true,
    langs: ['російська'], price: 'безкоштовно', commercial: false, organizers: ['anna-keller', 'alina-shteuber'],
    link: 'https://example.ch/webinar', contact: 'anna.keller@example.ch',
    about: 'Онлайн-зустріч для тих, хто нещодавно переїхав: дозволи, страховки, комуна, школа. Відповідаємо на запитання й розповідаємо, з чого почати, щоб не загубитися в перші місяці.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'osennij-retrit-graubuenden', status: 'активен', title: 'Осінній ретрит «Вдома в собі»', type: 'retreat',
    date: '2026-10-23', dateEnd: '2026-10-25',
    canton: 'Graubünden', address: 'Via Maistra 12, 7500 St. Moritz', geo: [46.4983, 9.8390], online: false,
    langs: ['російська'], price: 'CHF 480 (проживання й харчування включено)', commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.ch/retreat', contact: 'alina@example.ch',
    about: 'Три дні в горах: прогулянки, коучингові практики й час для себе. Для жінок, які переїхали й хочуть знову відчути опору. Група до 12 осіб.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'yazykovoj-tandem-basel', status: 'активен', title: 'Мовний тандем: російська ↔ німецька', type: 'lang',
    date: '2026-10-14', time: '19:00', timeEnd: '21:00', repeat: { freq: 'weekly', interval: 2, until: '2027-03-31' },
    canton: 'Basel-Stadt', address: 'Steinenvorstadt 22, 4051 Basel', geo: [47.5530, 7.5880], online: false,
    langs: ['російська', 'німецька'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Tandem Basel', link: 'https://example.ch/tandem' }],
    link: 'https://example.ch/tandem', contact: 'tandem@example.ch',
    about: 'Пів години говоримо російською, пів години німецькою. Приходять і місцеві, хто вчить російську, — добрий спосіб знайти знайомих і мовну практику.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'novogodnyaya-elka-luzern', status: 'активен', title: 'Новорічна ялинка для дітей', type: 'culture',
    date: '2026-12-19', time: '15:00', timeEnd: '17:30',
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['російська', 'українська'], price: 'CHF 20 за дитину, дорослі безкоштовно', commercial: true, organizers: ['oksana-roth', { name: 'Російська школа Люцерн', link: 'https://example.ch/schule' }],
    link: 'https://example.ch/elka', contact: 'oksana.roth@example.ch',
    about: 'Хоровод, Дід Мороз і Снігурочка, подарунки й вистава від учнів російської школи. Для дітей 3–10 років, записатися треба заздалегідь.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'nalogi-seminar-zug', status: 'активен', title: 'Податкова декларація: семінар для новачків', type: 'talk',
    date: '2027-02-06', time: '10:00', timeEnd: '12:30',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: true,
    langs: ['російська'], price: 'CHF 40', commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.ch/steuern', contact: 'dmitri.huber@example.ch',
    about: 'Як заповнити першу податкову декларацію, які відрахування належать сім’ям і що робити з іноземними доходами. Очно в Цугу й онлайн одночасно.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'piknik-bern', status: 'активен', title: 'Літній пікнік біля Аре', type: 'meet',
    date: '2027-06-19', time: '12:00', timeEnd: '17:00',
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['російська', 'українська', 'німецька'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Свої люди Берн', link: 'https://t.me/example_bern' }],
    link: 'https://t.me/example_bern', contact: '@example_bern',
    about: 'Великий пікнік для всіх: кожен приносить щось до спільного столу, для дітей ігри та купання. Чудовий спосіб познайомитися з тими, хто живе поруч.'
  },

  /* ---------- курсы, занятия, мастер-классы, вебинары ---------- */
  {
    sample: true,
    sections: ['kursy'],
    id: 'myagkaya-joga-zurich', status: 'активен', title: 'М’яка йога вечорами', type: 'body', kind: 'regular',
    date: '2026-10-13', time: '19:00', timeEnd: '20:15', repeat: { freq: 'weekly', until: '2027-06-29', except: ['2026-12-22', '2026-12-29'] },
    canton: 'Zürich', address: 'Seefeldstrasse 45, 8008 Zürich', geo: [47.3600, 8.5520], online: false,
    langs: ['російська', 'українська'], level: 'будь-який рівень, можна без досвіду',
    price: 'CHF 25', per: 'за заняття', priceNote: 'абонемент на 10 занять — CHF 220, перше заняття — CHF 10; килимки є в залі',
    commercial: true, organizers: ['olga-marti'],
    link: 'https://example.ch/joga', contact: 'olga.marti@example.ch',
    about: 'Спокійна практика після робочого дня: дихання, розтяжка й довге розслаблення наприкінці. Група до 10 людей, можна прийти на будь-яке заняття й залишитися.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'nemeckij-a1-aarau', status: 'активен', title: 'Німецька з нуля: курс A1 для дорослих', type: 'lang', kind: 'course', sessions: 20,
    date: '2026-10-19', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2027-03-15', except: ['2026-12-21', '2026-12-28'] },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['німецька', 'російська'], level: 'з нуля, дорослі',
    price: 'CHF 480', per: 'за курс із 20 занять', priceNote: 'підручник і робочий зошит включені; можна платити двома частинами',
    commercial: true, organizers: ['irina-frei'],
    link: 'https://example.ch/deutsch-a1', contact: 'irina.frei@example.ch',
    about: 'Група до 8 людей, раз на тиждень по півтори години. Вчимося говорити про себе, розуміти листи з комуни й розмовляти в магазині та в лікаря. Пояснюю російською, говоримо німецькою.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'nalogi-samozanyatyh-vebinar', status: 'активен', title: 'Податки для самозайнятих: перший рік', type: 'pro', kind: 'once',
    date: '2026-11-12', time: '19:00', timeEnd: '20:30',
    canton: 'Zug', address: '', online: true,
    langs: ['російська'], level: 'для тих, хто працює на себе або тільки починає',
    price: 'CHF 35', per: 'за вебінар', priceNote: 'запис вебінару включено',
    commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.ch/webinar-steuern', contact: 'dmitri.huber@example.ch',
    about: 'Як платити AHV на свою справу, які витрати можна відняти й що робити з податковою декларацією в перший рік. Наприкінці відповідаю на запитання учасників.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'vremya-dlya-sebya-onlajn', status: 'активен', title: 'Час для себе: 6 вечорів у жіночому колі', type: 'life', kind: 'course', sessions: 6,
    date: '2026-11-05', time: '19:30', timeEnd: '21:00', repeat: { freq: 'weekly', until: '2026-12-10' },
    canton: 'Zürich', address: '', online: true,
    langs: ['російська'], level: 'для жінок, які нещодавно переїхали',
    price: 'CHF 240', per: 'за курс із 6 зустрічей', priceNote: 'робочий зошит у PDF включено',
    commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.ch/krug', contact: 'alina@example.ch',
    about: 'Шість онлайн-зустрічей у невеликій групі. Говоримо про те, як знайти опору після переїзду, вибудувати свій ритм і не загубити себе між роботою, сім’єю й новою мовою.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'logoritmika-luzern', status: 'активен', title: 'Логоритміка для малюків', type: 'kids', kind: 'regular',
    date: '2026-10-17', time: '10:00', timeEnd: '10:45', repeat: { freq: 'weekly', until: '2027-06-26', except: ['2026-12-26', '2027-01-02'] },
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['російська'], level: 'діти 3–5 років разом із мамою або татом',
    price: 'CHF 20', per: 'за заняття', priceNote: 'пробне заняття безкоштовне',
    commercial: true, organizers: ['oksana-roth'],
    link: 'https://example.ch/logoritmika', contact: 'oksana.roth@example.ch',
    about: 'Ігрові заняття під музику: рухи, віршики, пальчикові ігри. Малюки чують російську мову й граються разом з іншими дітьми.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'akvarel-master-klass-zug', status: 'активен', title: 'Акварель для початківців', type: 'create', kind: 'once',
    date: '2026-11-21', time: '14:00', timeEnd: '17:00',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: false,
    langs: ['російська', 'українська'], level: 'без досвіду, з 14 років',
    price: 'CHF 60', per: 'за майстер-клас', priceNote: 'фарби, пензлі й папір включені, чай теж',
    commercial: true, organizers: [{ name: 'Ательє «Палітра»', link: 'https://example.ch/palitra' }],
    link: 'https://example.ch/palitra', contact: 'atelier@example.ch',
    about: 'За три години малюємо осінній пейзаж і пробуємо головні прийоми акварелі. Кожен забирає додому свою готову роботу.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'shahmaty-deti-bern', status: 'активен', title: 'Шаховий гурток для дітей', type: 'kids', kind: 'regular',
    date: '2026-10-16', time: '17:00', timeEnd: '18:00', repeat: { freq: 'weekly', until: '2027-06-25', except: ['2026-12-25', '2027-01-01'] },
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['російська', 'українська', 'німецька'], level: 'діти 6–12 років, можна без досвіду',
    price: 'безкоштовно', per: '', priceNote: 'батьки по черзі приносять чай і печиво',
    commercial: false, organizers: [{ name: 'Свої люди Берн', link: 'https://t.me/example_bern' }],
    link: 'https://t.me/example_bern', contact: '@example_bern',
    about: 'Щоп’ятниці граємо, розв’язуємо задачки й влаштовуємо маленькі турніри. Ведуть батьки, які самі люблять шахи.'
  }
];
