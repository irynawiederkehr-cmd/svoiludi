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
