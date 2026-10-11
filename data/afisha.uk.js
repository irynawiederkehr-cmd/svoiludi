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
   contact   — для вопросов у организатора БЕЗ карточки: e-mail, телефон или Telegram, несколько через « · »
   phone, email — у организатора из справочника: другой телефон и другой e-mail из заявки, показываются ВМЕСТО телефона и e-mail карточки;
               чего нет — берётся из карточки. E-mail карточки — один для всех подтверждений, на сайте его можно не показывать (решение Ирины 10.10.2026)
   address   — адрес из карточки организатора или другой адрес из заявки (он показывается вместо адреса карточки)

   АКЦИИ СПЕЦИАЛИСТОВ (решение Ирины 11.10.2026, 18:02: «в события могут входить и промоакции… они тратят свои события в пакетах на свою
   рекламу на сайте, чтобы акция сразу была видна в карточке»). Акция — это ВИД СОБЫТИЯ: type: 'promo', sections: ['events'],
   одна акция = одно событие из пакета (до 31.12.2027 бесплатно, как любое событие). Размещается только своя акция, только для
   специалиста или организации с карточкой (форма «Заявка на размещение акции» на странице «Акции», svoiludi.ch/akcii/, поиск по SG-…/OR-…/UID; страницу собирает _i18n/akcii_src/build.py).
   promo     — { kind, value, what, regular, cond, limit }:
               kind  'percent' скидка в процентах (value — число, одно, без «до»), 'amount' скидка в франках (value — CHF),
                     'price' акционная цена (value — CHF, конечная, с MWST), 'gift' подарок или бонус к услуге, 'free' бесплатное
                     знакомство или пробное занятие;
               what  на что акция (для percent, amount, price) или что получит человек (для gift, free) — коротко;
               regular — обычная цена CHF, необязательно: ставим только если специалист подтвердил, что брал её непосредственно перед акцией
                     (PBV, сравнение с прежней ценой); на сайте «обычно CHF …»; без неё «было» и «стало» не показываем;
               cond  — условия кодами: 'new' только новым клиентам, 'book' по предварительной записи, 'nosum' не суммируется с другими
                     скидками, 'wd' только в будни, 'online' только онлайн, 'first' первым limit клиентам;
               limit — число клиентов для 'first'.
   date / dateEnd — первый и последний день акции; не дольше 90 дней. В карточке акция видна с первого до последнего дня включительно,
               на странице «События» — с публикации (вид «Акции специалистов»). Потом запись уходит в архив на 12 месяцев (можно повторить).
   В карточке и на странице акции всегда помечены «Реклама · акция специалиста»; рядом с ними нельзя «рекомендуем», «лучший».
   Не размещаем: акции на услуги, где нужно разрешение, которого нет у карточки; обещания лечения и результата; розыгрыши и конкурсы
   (нужны разрешения); акции за других людей и организации. Организации, которые ничего не берут с людей, акций не размещают.
   Сколько событий потрачено: считаем записи карточки (события + акции + курсы) за срок пакета; специалисту «использовано N из M» пишет Claude
   в ответном письме и в письме-подтверждении, на сайте остаток не показываем.

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
    id: 'razgovornyj-klub-zurich', key: 'obr6', status: 'активен', title: 'Розмовний клуб німецької мови', type: 'lang',
    date: '2026-10-08', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2026-12-17', except: ['2026-12-24'] },
    canton: 'Zürich', address: 'Limmatquai 70, 8001 Zürich', geo: [47.3740, 8.5440], online: false,
    langs: ['німецька', 'російська'], price: 'CHF 15', commercial: true, organizers: ['irina-frei'],
    link: 'https://example.com/deutsch_club', contact: 'irina.frei@example.com',
    about: 'Говоримо німецькою на побутові теми: школа, лікар, робота, листи з комуни. Рівень A2–B1, невеликі групи до 8 осіб, без домашніх завдань.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'vstrecha-mam-aarau', status: 'активен', title: 'Зустріч мам із малюками', type: 'kids',
    date: '2026-10-10', time: '10:00', timeEnd: '12:00', repeat: { freq: 'monthly', until: '2027-06-30' },
    canton: 'Aargau', address: 'Bahnhofstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['російська', 'українська'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Клуб «Мами Аарау»', link: 'https://example.com/mamy' }],
    link: 'https://example.com/mamy', contact: 'mamy@example.com',
    about: 'Кожної другої суботи місяця: ігрова кімната для дітей до 4 років, чай для мам, обмін досвідом про ясла, педіатрів і дитячі гуртки. Внесок на чай за бажанням.'
  },
  {
    sample: true,
    sections: ['events', 'kursy'], kind: 'once', ktype: 'life',
    id: 'adaptatsiya-onlajn', status: 'активен', title: 'Перші пів року у Швейцарії: запитання й відповіді', type: 'talk',
    date: '2026-10-15', time: '19:30', timeEnd: '21:00',
    canton: 'Zürich', address: '', online: true,
    langs: ['російська'], price: 'безкоштовно', commercial: false, organizers: ['anna-keller', 'alina-shteuber'],
    link: 'https://example.com/webinar', contact: 'anna.keller@example.com',
    about: 'Онлайн-зустріч для тих, хто нещодавно переїхав: дозволи, страховки, комуна, школа. Відповідаємо на запитання й розповідаємо, з чого почати, щоб не загубитися в перші місяці.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'osennij-retrit-graubuenden', status: 'активен', title: 'Осінній ретрит «Вдома в собі»', type: 'retreat',
    date: '2026-10-23', dateEnd: '2026-10-25',
    canton: 'Graubünden', address: 'Via Maistra 12, 7500 St. Moritz', geo: [46.4983, 9.8390], online: false,
    langs: ['російська'], price: 'CHF 480 (проживання й харчування включено)', commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.com/retreat', contact: 'alina@example.com',
    about: 'Три дні в горах: прогулянки, коучингові практики й час для себе. Для жінок, які переїхали й хочуть знову відчути опору. Група до 12 осіб.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'yazykovoj-tandem-basel', status: 'активен', title: 'Мовний тандем: російська ↔ німецька', type: 'lang',
    date: '2026-10-14', time: '19:00', timeEnd: '21:00', repeat: { freq: 'weekly', interval: 2, until: '2027-03-31' },
    canton: 'Basel-Stadt', address: 'Steinenvorstadt 22, 4051 Basel', geo: [47.5530, 7.5880], online: false,
    langs: ['російська', 'німецька'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Tandem Basel', link: 'https://example.com/tandem' }],
    link: 'https://example.com/tandem', contact: 'tandem@example.com',
    about: 'Пів години говоримо російською, пів години німецькою. Приходять і місцеві, хто вчить російську, — добрий спосіб знайти знайомих і мовну практику.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'novogodnyaya-elka-luzern', status: 'активен', title: 'Новорічна ялинка для дітей', type: 'culture',
    date: '2026-12-19', time: '15:00', timeEnd: '17:30',
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['російська', 'українська'], price: 'CHF 20 за дитину, дорослі безкоштовно', commercial: true, organizers: ['oksana-roth', { name: 'Російська школа Люцерн', link: 'https://example.com/schule' }],
    link: 'https://example.com/elka', contact: 'oksana.roth@example.com',
    about: 'Хоровод, Дід Мороз і Снігурочка, подарунки й вистава від учнів російської школи. Для дітей 3–10 років, записатися треба заздалегідь.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'nalogi-seminar-zug', status: 'активен', title: 'Податкова декларація: семінар для новачків', type: 'talk',
    date: '2027-02-06', time: '10:00', timeEnd: '12:30',
    canton: 'Zug', address: 'Musterstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: true,
    langs: ['російська'], price: 'CHF 40', commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.com/steuern', contact: 'dmitri.huber@example.com',
    about: 'Як заповнити першу податкову декларацію, які відрахування належать сім’ям і що робити з іноземними доходами. Очно в Цугу й онлайн одночасно.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'piknik-bern', status: 'активен', title: 'Літній пікнік біля Аре', type: 'meet',
    date: '2027-06-19', time: '12:00', timeEnd: '17:00',
    canton: 'Bern', address: 'Marzilistrasse 29, 3005 Bern', geo: [46.9440, 7.4440], online: false,
    langs: ['російська', 'українська', 'німецька'], price: 'безкоштовно', commercial: false, organizers: [{ name: 'Свої люди Берн', link: 'https://example.com/bern' }],
    link: 'https://example.com/bern', contact: 'bern@example.com',
    about: 'Великий пікнік для всіх: кожен приносить щось до спільного столу, для дітей ігри та купання. Чудовий спосіб познайомитися з тими, хто живе поруч.'
  },

  /* ---------- курсы, занятия, мастер-классы, вебинары ---------- */
  {
    sample: true,
    sections: ['kursy'],
    id: 'myagkaya-joga-zurich', key: 'obr7', status: 'активен', title: 'М’яка йога вечорами', type: 'body', kind: 'regular',
    date: '2026-10-13', time: '19:00', timeEnd: '20:15', repeat: { freq: 'weekly', until: '2027-06-29', except: ['2026-12-22', '2026-12-29'] },
    canton: 'Zürich', address: 'Seefeldstrasse 45, 8008 Zürich', geo: [47.3600, 8.5520], online: false,
    langs: ['російська', 'українська'], level: 'будь-який рівень, можна без досвіду',
    price: 'CHF 25', per: 'за заняття', priceNote: 'абонемент на 10 занять — CHF 220, перше заняття — CHF 10; килимки є в залі',
    commercial: true, organizers: ['olga-marti'],
    link: 'https://example.com/joga', contact: 'olga.marti@example.com',
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
    link: 'https://example.com/deutsch-a1', contact: 'irina.frei@example.com',
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
    link: 'https://example.com/webinar-steuern', contact: 'dmitri.huber@example.com',
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
    link: 'https://example.com/krug', contact: 'alina@example.com',
    about: 'Шість онлайн-зустрічей у невеликій групі. Говоримо про те, як знайти опору після переїзду, вибудувати свій ритм і не загубити себе між роботою, сім’єю й новою мовою.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'muzykalnye-igry-luzern', status: 'активен', title: 'Музичні ігри для малюків', type: 'kids', kind: 'regular',
    date: '2026-10-17', time: '10:00', timeEnd: '10:45', repeat: { freq: 'weekly', until: '2027-06-26', except: ['2026-12-26', '2027-01-02'] },
    canton: 'Luzern', address: 'Pilatusstrasse 15, 6003 Luzern', geo: [47.0494, 8.3070], online: false,
    langs: ['російська'], level: 'діти 3–5 років разом із мамою або татом',
    price: 'CHF 20', per: 'за заняття', priceNote: 'пробне заняття безкоштовне',
    commercial: true, organizers: ['oksana-roth'],
    link: 'https://example.com/muzykalnye-igry', contact: 'oksana.roth@example.com',
    about: 'Ігрові заняття під музику: рухи, пісеньки, віршики, пальчикові ігри. Малюки чують російську мову й граються разом з іншими дітьми. Це не логопедичні заняття й не терапія.'
  },
  {
    sample: true,
    sections: ['kursy'],
    id: 'akvarel-master-klass-zug', status: 'активен', title: 'Акварель для початківців', type: 'create', kind: 'once',
    date: '2026-11-21', time: '14:00', timeEnd: '17:00',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1702, 8.5160], online: false,
    langs: ['російська', 'українська'], level: 'без досвіду, з 14 років',
    price: 'CHF 60', per: 'за майстер-клас', priceNote: 'фарби, пензлі й папір включені, чай теж',
    commercial: true, organizers: [{ name: 'Ательє «Палітра»', link: 'https://example.com/palitra' }],
    link: 'https://example.com/palitra', contact: 'atelier@example.com',
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
    commercial: false, organizers: [{ name: 'Свої люди Берн', link: 'https://example.com/bern' }],
    link: 'https://example.com/bern', contact: 'bern@example.com',
    about: 'Щоп’ятниці граємо, розв’язуємо задачки й влаштовуємо маленькі турніри. Ведуть батьки, які самі люблять шахи.'
  },
  /* ---------- акции специалистов (type: 'promo') — вымышленные образцы ---------- */
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-razgovornyj-klub', key: 'ak1m', status: 'активен', title: 'Знижка 20 % на перший місяць розмовного клубу', type: 'promo',
    promo: { kind: 'percent', value: 20, what: 'абонемент на 4 зустрічі розмовного клубу', regular: 60, cond: ['new', 'book'] },
    date: '2026-10-05', dateEnd: '2026-11-30',
    canton: 'Aargau', address: 'Musterstrasse 2, 5000 Aarau', geo: [47.3913, 8.0496], online: false,
    langs: ['німецька', 'російська'], commercial: true, organizers: ['irina-frei'],
    link: 'https://example.com/deutsch_club', contact: 'irina.frei@example.com',
    about: 'Приходь на перший місяць клубу зі знижкою. Чотири зустрічі німецькою на побутові теми: школа, лікар, робота, листи з громади. Невелика група до 8 осіб.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-pervye-30-dnej', key: 'ak2g', status: 'активен', title: 'Чек-лист «Перші 30 днів» у подарунок до консультації', type: 'promo',
    promo: { kind: 'gift', what: 'чек-лист «Перші 30 днів у Швейцарії» з посиланнями на відомства та зразками листів', cond: ['new'] },
    date: '2026-10-08', dateEnd: '2026-12-15',
    canton: 'Zürich', address: 'Musterstrasse 10, 8001 Zürich', geo: [47.3866, 8.5442], online: true,
    langs: ['російська', 'українська', 'німецька'], commercial: true, organizers: ['anna-keller'],
    link: 'https://example.com/adaptatsiya', contact: 'anna.keller@example.com',
    about: 'Тим, хто приїхав нещодавно: до першої консультації з адаптації я дарую чек-лист на 30 днів. Що зробити в перший тиждень, у перший місяць і куди звернутися, якщо щось не виходить.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-znakomstvo-onlajn', key: 'ak3z', status: 'активен', title: 'Безкоштовне знайомство 30 хвилин онлайн', type: 'promo',
    promo: { kind: 'free', what: 'знайомство з коучем: 30 хвилин по відеозв’язку, без зобов’язань', cond: ['new', 'book', 'first'], limit: 10 },
    date: '2026-10-05', dateEnd: '2026-12-31',
    canton: 'Zürich', address: '', online: true,
    langs: ['російська', 'українська'], commercial: true, organizers: ['alina-shteuber'],
    link: 'https://example.com/coaching', contact: 'alina.shteuber@example.com',
    about: 'Коротка розмова, щоб зрозуміти, що для тебе зараз важливе і чи підходить тобі такий формат роботи. Коучинг не замінює терапію й лікування.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-deklaraciya', key: 'ak4p', status: 'активен', title: 'Перевірка податкової декларації за CHF 120', type: 'promo',
    promo: { kind: 'price', value: 120, what: 'перевірка вашої податкової декларації перед надсиланням', regular: 160, cond: ['book', 'nosum'] },
    date: '2026-11-02', dateEnd: '2027-01-31',
    canton: 'Zug', address: 'Baarerstrasse 8, 6300 Zug', geo: [47.1708, 8.5170], online: true,
    langs: ['російська', 'німецька'], commercial: true, organizers: ['dmitri-huber'],
    link: 'https://example.com/steuern', contact: 'dmitri.huber@example.com',
    about: 'Погляну декларацію перед надсиланням: що можна відняти, чи не забуто щось важливе. Надсилаєш документи, за кілька днів отримуєш письмові зауваження.'
  },
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-kejtering', key: 'ak5k', status: 'активен', title: 'Знижка 15 % на перше замовлення кейтерингу', type: 'promo',
    promo: { kind: 'percent', value: 15, what: 'замовлення кейтерингу на 10 осіб і більше', cond: ['new', 'book'] },
    date: '2026-10-10', dateEnd: '2026-12-20',
    canton: 'Zürich', address: 'Musterstrasse 5, 8004 Zürich', geo: [47.3769, 8.5417], online: false,
    langs: ['українська', 'російська', 'німецька'], commercial: true, organizers: [{ org: 'obrazec-firma-kejtering', name: 'Кейтеринг «Приклад» GmbH (зразок)' }],
    contacts: { email: 'catering@example.com' }, link: 'https://example.com/catering',
    about: 'Перше замовлення кейтерингу для свята, офісу чи шкільної події зі знижкою. Українська та швейцарська кухня, доставка по Цюриху й околицях. Замовлення за три дні.'
  }
];
