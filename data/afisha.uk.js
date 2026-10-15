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
   status    — 'активен' | 'пауза' | 'черновик' | 'на подтверждении' | 'снято' (на сайте видны только «активен»)
               'снято' — автор сам снял запись по ссылке «Снять с сайта» из письма о публикации (…/#off=<id>.<ключ>, решение Ирины 11.10.2026, 21:45);
               ставим и off: { date: 'ГГГГ-ММ-ДД', via: 'кнопка на сайте' | 'письмо с адреса организатора' }. Запись в архиве: по ссылке видно
               «снято с сайта», в заявке по номеру карточки — «Снято с сайта ДД.ММ.ГГГГ» и кнопка «Повторить»
   keyHash   — ОТПЕЧАТОК (SHA-256) ключа из ссылки подтверждения svoiludi.ch/events/#ok=<id>.<ключ>, kursy/#ok=… или akcii/#ok=… (11.10.2026).
               Сам ключ в этот открытый файл НЕ пишем никогда (поле key запрещено, sync.py останавливается): ключ есть только в ссылке из письма.
               Новый ключ и ссылка — python3 -I _i18n/pochta/klyuch.py <id> (zapis.py ставит его сам);
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
   акция считается отдельно от событий пакета, событие не тратит (проект цен от 11.10.2026, до «утверждаю» не опубликован; до 31.12.2027 бесплатно). Размещается только своя акция, только для
   специалиста или организации с карточкой (форма «Заявка на размещение акции» на странице «Акции», svoiludi.ch/akcii/, поиск по SG-…/OR-…/UID; страницу собирает _i18n/akcii_src/build.py).
   promo     — { kind, value, what, regular, cond, limit }:
               kind  'percent' скидка в процентах (value — число, одно, без «до»), 'amount' скидка в франках (value — CHF),
                     'price' акционная цена (value — CHF, конечная, с MWST), 'gift' подарок или бонус к услуге, 'free' бесплатное
                     знакомство или пробное занятие;
               what  на что акция (для percent, amount, price) или что получит человек (для gift, free) — коротко;
               regular — обычная цена CHF: та, что действовала не меньше 30 дней подряд прямо перед акцией и действует для остальных клиентов
                     (Art. 16 PBV с 01.01.2025; юридическая проверка 11.10.2026, «akcii-pravo-proverka.md»). У percent и amount на одну услугу —
                     ОБЯЗАТЕЛЬНО: на сайте «По акции CHF 48 вместо CHF 60» (цена к оплате); у price — необязательно («Вместо CHF …»);
               group — true: одинаковая скидка (percent или amount) на целую группу услуг или товаров, ясно названную в what
                     («все стрижки», «всё меню»); тогда regular не нужна, на сайте «Скидка одинаковая на всё перечисленное»;
               cond  — условия кодами: 'new' только новым клиентам, 'book' по предварительной записи, 'nosum' не суммируется с другими
                     скидками, 'wd' только в будни, 'online' только онлайн, 'first' первым limit клиентам, 'noalc' кроме спиртных напитков
                     (обязательно у еды и напитков: ресторан, кафе, кейтеринг, магазин — AlkG Art. 42b);
               limit — число клиентов для 'first' (обязательно; места считает автор, закончились — снимает акцию по ссылке «Снять с сайта»);
               Акции врачей, психотерапевтов, психологов и других профессий здоровья НЕ размещаем (MedBG Art. 40, PsyG Art. 27; форма их не пропускает);
               always — true: ПОСТОЯННАЯ акция (решение Ирины 11.10.2026, 19:19: «всегда первая уборка, стрижка или маникюр за 50 %»). Только на первое
                     посещение нового клиента: в заявке условие «только новым клиентам» обязательно. date — первый день, dateEnd — конец текущего года
                     подтверждения (ровно 12 месяцев); владелец подтверждает акцию раз в год письмом, Claude продлевает dateEnd на 12 месяцев; не подтвердил —
                     после dateEnd акция сама уходит с сайта. На сайте «Действует постоянно» и «Подтверждена владельцем до …»; в проекте цен считается за две акции
                     (одна постоянная акция на карточку).
   date / dateEnd — первый и последний день акции; не дольше 90 дней (у постоянной акции — год подтверждения, см. always). В карточке акция видна с первого до последнего дня включительно,
               на странице «События» — с публикации (вид «Акции специалистов»). Потом запись уходит в архив на 12 месяцев (можно повторить).
   В карточке и на странице акции всегда помечены «Реклама · акция специалиста»; рядом с ними нельзя «рекомендуем», «лучший».
   Не размещаем: акции на услуги, где нужно разрешение, которого нет у карточки; обещания лечения и результата; розыгрыши и конкурсы
   (нужны разрешения); акции за других людей и организации. Организации, которые ничего не берут с людей, акций не размещают.
   Сколько событий потрачено: считаем записи карточки (события + курсы; акции считаются отдельно) за срок пакета; специалисту «использовано N из M» пишет Claude
   в ответном письме и в письме-подтверждении, на сайте остаток не показываем.

   Правила (проверка 07.10.2026): без обещаний лечения и «гарантированно найдём работу»; терапия (логопедия, психотерапия,
   физиотерапия) — не курс, а услуга специалиста с разрешением кантона; «fide» в названии — только с fide-Label;
   публикуем только по заявке самого организатора, его письмо или сообщение храним как согласие; платных выделений сейчас нет,
   если появятся — пометка «Реклама» (документы проекта «kursy-svoiludi.md», «svoiludi-vizitka-png.md»).
   ВНИМАНИЕ: сейчас здесь только ВЫМЫШЛЕННЫЕ образцы (sample: true).
   ===================================================================== */
window.AFISHA = [
  {
    "sections": [
      "events"
    ],
    "type": "promo",
    "id": "olga-sofitness-myagkiy-start",
    "keyHash": "b6d2518b93b31cf9f0f58c5c30bef26c74750cda58ee9cf8a5fb1caec8bfd3ca",
    "status": "на підтвердженні",
    "title": "Безкоштовний онлайн-марафон «М’який старт»",
    "promo": {
      "kind": "free",
      "what": "онлайн-марафон «М’який старт» — 10 хвилин ранкової розминки, легкої розтяжки й дихання щодня",
      "cond": [
        "online"
      ]
    },
    "date": "2026-10-15",
    "dateEnd": "2027-01-12",
    "canton": "Genève",
    "address": "",
    "online": true,
    "langs": [
      "російська"
    ],
    "commercial": true,
    "organizers": [
      "olga-sofitness-geneve"
    ],
    "signup": "link",
    "contacts": {
      "phone": "+41 76 476 47 26",
      "email": "info@sofitness.ch"
    },
    "link": "https://www.sofitness.ch/challenges",
    "about": "Ранкові тренування, які м’яко будять тіло: розминка після сну, легка розтяжка й дихання — без поспіху й без навантаження. 10 хвилин на день допомагають стати гнучкішою, покращити поставу й почати день спокійно та з турботою про себе. Брати участь безкоштовно — на моєму сайті, у розділі «Марафони»."
  },
  {
    sections: ['kursy'], type: 'pro', ktype: 'pro', kind: 'once',
    id: 'iryna-pani-nail-bern-progel-kombi-2026-10-28', keyHash: 'e0be0590cd26f08a41e51a25606fc901bb0d39e762f209798bdb637958d910e1', status: 'на підтвердженні', title: 'Курс підвищення кваліфікації «ProGel + Комбі» — живий курс у Берні',
    date: '2026-10-28', time: '09:00', timeEnd: '19:00',
    canton: 'Bern', address: 'Spitalgasse 34, 3011 Bern', online: false,
    langs: ['російська'], level: 'для майстрів манікюру після базового курсу та з досвідом',
    price: 'CHF 470', per: 'за курс (1 день)', priceNote: '2 моделі, сертифікат і 2 місяці онлайн-уроків зі зворотним зв’язком', commercial: true,
    organizers: ['iryna-pani-nail-bern'], link: 'https://iilschool.com/downloads/kurs-povysheniya-kvalifikaczii-progel-kombi/',
    about: 'Один день із 9:00 до 19:00 і дві моделі — квадрат і овал. Зранку теорія: гелі, архітектура нігтя та причини відшарувань. Потім практика: зняття «на готовність», підготовка без пилки, опил за схемою, швидкі дизайни й покриття під кутикулу без лайнера. Розбираємо саме ваш запит і виправляємо помилки.'
  },
  {
    sections: ['kursy'], type: 'pro', ktype: 'pro', kind: 'once',
    id: 'iryna-pani-nail-bern-progel-kombi-2026-12-19', keyHash: 'e0be0590cd26f08a41e51a25606fc901bb0d39e762f209798bdb637958d910e1', status: 'на підтвердженні', title: 'Курс підвищення кваліфікації «ProGel + Комбі» — живий курс у Берні',
    date: '2026-12-19', time: '09:00', timeEnd: '19:00',
    canton: 'Bern', address: 'Spitalgasse 34, 3011 Bern', online: false,
    langs: ['російська'], level: 'для майстрів манікюру після базового курсу та з досвідом',
    price: 'CHF 470', per: 'за курс (1 день)', priceNote: '2 моделі, сертифікат і 2 місяці онлайн-уроків зі зворотним зв’язком', commercial: true,
    organizers: ['iryna-pani-nail-bern'], link: 'https://iilschool.com/downloads/kurs-povysheniya-kvalifikaczii-progel-kombi/',
    about: 'Один день із 9:00 до 19:00 і дві моделі — квадрат і овал. Зранку теорія: гелі, архітектура нігтя та причини відшарувань. Потім практика: зняття «на готовність», підготовка без пилки, опил за схемою, швидкі дизайни й покриття під кутикулу без лайнера. Розбираємо саме ваш запит і виправляємо помилки.'
  },
  {
    "sections": [
      "events"
    ],
    "type": "promo",
    "id": "diana-lupanova-konsultaciya",
    "keyHash": "92b7de7ac2cfc337884e545ad094ac45ea53fb64a45947d6c18ec62eb73d2fed",
    "status": "на підтвердженні",
    "title": "Безкоштовна консультація перед перманентним макіяжем",
    "promo": {
      "kind": "free",
      "what": "консультація перед перманентним макіяжем — форма, техніка й підбір відтінку",
      "cond": [
        "book"
      ],
      "always": true
    },
    "date": "2026-10-14",
    "dateEnd": "2027-10-13",
    "canton": "Solothurn",
    "address": "4632 Trimbach",
    "geo": [
      47.3653,
      7.8862
    ],
    "online": false,
    "langs": [
      "українська",
      "німецька"
    ],
    "commercial": true,
    "organizers": [
      "diana-lupanova-trimbach"
    ],
    "signup": "ig",
    "contacts": {
      "instagram": "diana.lupanova.pmu"
    },
    "link": "",
    "about": "Напишіть мені в особисті повідомлення в Instagram — безкоштовно й без зобов’язань розповім, як проходить перманентний макіяж, і разом підберемо форму, техніку та відтінок для брів, губ чи міжвійкової стрілки. Консультація — до запису на процедуру."
  },
  {
    "sections": [
      "events"
    ],
    "type": "promo",
    "id": "vika-foto-glarus-konsultaciya",
    "keyHash": "ef425914d53422cb49025d347bdfad17b144d4e5971b462cd5e265bf726142fd",
    "status": "на підтвердженні",
    "title": "Безкоштовна консультація перед фотосесією",
    "promo": {
      "kind": "free",
      "what": "індивідуальна консультація перед фотосесією — ідея, образи, реквізит, місце й мудборд",
      "cond": [
        "new"
      ],
      "always": true
    },
    "date": "2026-10-14",
    "dateEnd": "2027-10-13",
    "canton": "Glarus",
    "address": "",
    "online": false,
    "langs": [
      "українська",
      "німецька"
    ],
    "commercial": true,
    "organizers": [
      "vika-foto-glarus"
    ],
    "signup": "mail",
    "contacts": {
      "email": "vikafotoch@gmail.com",
      "instagram": "vikafoto.ch"
    },
    "link": "https://vikafoto.ch/uk/contact",
    "about": "Напишіть мені — безкоштовно й без зобов’язань обговоримо вашу майбутню фотосесію: ідею, образи, реквізит і місце, вдома чи на швейцарській природі. Така консультація входить і в кожен пакет."
  },
  {
    sections: ['events'], type: 'meet',
    id: 'slava-photographer-luzern-korabl-2026-09', keyHash: '144a048c0c63ee28246cfb3c9b2b7563290a57fd5d326855e9f95fb1de9f9c0c', status: 'на підтвердженні', title: 'Фотосесія на історичному пароплаві Schiller — Люцерн',
    date: '2026-09-27',
    canton: 'Luzern', address: 'Люцерн, Фірвальдштетське озеро, пароплав Schiller', online: false,
    langs: ['російська'], level: 'для жінок', price: 'CHF 289', priceNote: 'усе включено: прогулянка, обід і фотосесія', commercial: true,
    organizers: ['slava-photographer-luzern'],
    about: 'П’ять годин на історичному пароплаві Schiller 1906 року озерами довкола Люцерна: перший клас, швейцарська кухня, знайомства з жінками зі Швейцарії та Німеччини й професійна фотосесія на тлі Альп. Зустріч жіночої спільноти організували разом із Power Woman Europa.'
  },
  {
    "sections": [
      "events"
    ],
    "type": "culture",
    "id": "olga-tango-rapperswil-tango-bar-2026-10",
    "keyHash": "d29dd445f9da4ff44dd3540fa0c88af2d75faaae04f04b1c7b606a2c6f3c27b7",
    "status": "на підтвердженні",
    "title": "Tango Bar у Рапперсвілі — шоу, воркшоп і практика аргентинського танго",
    "date": "2026-10-25",
    "time": "15:30",
    "timeEnd": "19:30",
    "canton": "St. Gallen",
    "address": "Vinoteca Mi Tierra, Alpenstrasse 7, 8640 Rapperswil",
    "geo": [
      47.2261,
      8.8173
    ],
    "online": false,
    "langs": [],
    "level": "для дорослих, можна без досвіду",
    "price": "шоу та практика — безкоштовно; воркшоп — CHF 25 з людини, пара студентів — CHF 25 за двох",
    "commercial": true,
    "organizers": [
      "olga-tango-rapperswil"
    ],
    "signup": "wa",
    "contacts": {
      "phone": "+41 76 346 52 60",
      "whatsapp": "+41 76 346 52 60",
      "email": "info@tangoparavos.ch",
      "instagram": "tangoparavos"
    },
    "link": "https://tangoparavos.ch/",
    "about": "Недільний вечір аргентинського танго в аргентинській винотеці Mi Tierra. О 15:30 — шоу, о 16:00 — воркшоп, з 17:00 до 19:30 — Tango Bar і практика (Practica — вільні танці, де можна спокійно потренуватися). Шоу та практика — вільний вхід. Приходьте разом потанцювати й провести чудовий вечір."
  },
  {
    "sections": [
      "kursy"
    ],
    "kind": "regular",
    "ktype": "body",
    "type": "body",
    "id": "olga-tango-rapperswil-kurs-rapperswil",
    "keyHash": "d29dd445f9da4ff44dd3540fa0c88af2d75faaae04f04b1c7b606a2c6f3c27b7",
    "status": "на підтвердженні",
    "title": "Аргентинське танго для початківців у Рапперсвілі",
    "date": "2026-10-19",
    "time": "19:00",
    "timeEnd": "20:30",
    "repeat": {
      "freq": "weekly",
      "until": "2026-12-21"
    },
    "canton": "St. Gallen",
    "address": "Vinoteca Mi Tierra, Alpenstrasse 7, 8640 Rapperswil",
    "geo": [
      47.2261,
      8.8173
    ],
    "online": false,
    "langs": [],
    "level": "початківці, дорослі",
    "price": "CHF 25 за заняття, студентам CHF 12.50",
    "commercial": true,
    "organizers": [
      "olga-tango-rapperswil"
    ],
    "signup": "wa",
    "contacts": {
      "phone": "+41 76 346 52 60",
      "whatsapp": "+41 76 346 52 60",
      "email": "info@tangoparavos.ch",
      "instagram": "tangoparavos"
    },
    "link": "https://tangoparavos.ch/",
    "about": "Група для початківців щопонеділка, з 19:00 до 20:30, в аргентинській винотеці Mi Tierra. Вчимося танцювати в парі так, щоб обом було комфортно й спокійно, — з увагою до себе та до партнера."
  },
  {
    "sections": [
      "kursy"
    ],
    "kind": "regular",
    "ktype": "body",
    "type": "body",
    "id": "olga-tango-rapperswil-kurs-zug",
    "keyHash": "d29dd445f9da4ff44dd3540fa0c88af2d75faaae04f04b1c7b606a2c6f3c27b7",
    "status": "на підтвердженні",
    "title": "Аргентинське танго для початківців у Цузі",
    "date": "2026-10-13",
    "time": "19:30",
    "repeat": {
      "freq": "weekly",
      "until": "2026-12-22"
    },
    "canton": "Zug",
    "address": "Loreto, Löberenstrasse 40, 6300 Zug",
    "geo": [
      47.171,
      8.5231
    ],
    "online": false,
    "langs": [],
    "level": "початківці, дорослі",
    "price": "CHF 330 за 13 відвідувань",
    "commercial": true,
    "organizers": [
      "olga-tango-rapperswil"
    ],
    "signup": "wa",
    "contacts": {
      "phone": "+41 76 346 52 60",
      "whatsapp": "+41 76 346 52 60",
      "email": "info@tangoparavos.ch",
      "instagram": "tangoparavos"
    },
    "link": "https://tangoparavos.ch/",
    "about": "Група для початківців щовівторка, з 19:30, у Loreto в Цузі. Абонемент на 13 відвідувань. Вчимося танцювати в парі так, щоб обом було комфортно й спокійно, — з увагою до себе та до партнера."
  },
  {
    "sections": [
      "events"
    ],
    "type": "promo",
    "id": "olga-tango-rapperswil-studenty",
    "keyHash": "d29dd445f9da4ff44dd3540fa0c88af2d75faaae04f04b1c7b606a2c6f3c27b7",
    "status": "на підтвердженні",
    "title": "Студентам — курс танго в Рапперсвілі за пів ціни",
    "promo": {
      "kind": "price",
      "value": 12.5,
      "regular": 25,
      "what": "заняття курсу аргентинського танго для початківців у Рапперсвілі — для студенток і студентів",
      "cond": [],
      "always": true
    },
    "date": "2026-10-12",
    "dateEnd": "2027-10-11",
    "canton": "St. Gallen",
    "address": "Vinoteca Mi Tierra, Alpenstrasse 7, 8640 Rapperswil",
    "geo": [
      47.2261,
      8.8173
    ],
    "online": false,
    "langs": [],
    "commercial": true,
    "organizers": [
      "olga-tango-rapperswil"
    ],
    "signup": "wa",
    "contacts": {
      "phone": "+41 76 346 52 60",
      "whatsapp": "+41 76 346 52 60",
      "email": "info@tangoparavos.ch",
      "instagram": "tangoparavos"
    },
    "link": "https://tangoparavos.ch/",
    "about": "Студенткам і студентам — заняття курсу для початківців у Рапперсвілі щопонеділка за CHF 12.50 замість CHF 25. А на воркшопі Tango Bar пара студентів платить CHF 25 за двох."
  },
  /* ---------- события ---------- */
  {
    sample: true,
    sections: ['events'],
    id: 'razgovornyj-klub-zurich', keyHash: '0589015053b089780ec301be313b747772ae829fe469660cadc43c2c3167ce96', status: 'активен', title: 'Розмовний клуб німецької мови', type: 'lang',
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
    id: 'myagkaya-joga-zurich', keyHash: 'ec8d934c6c207568ed20ec7e18323ebc3c1eb15f02bbbbfa2d81fe55dc1506eb', status: 'активен', title: 'М’яка йога вечорами', type: 'body', kind: 'regular',
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
    id: 'akciya-razgovornyj-klub', keyHash: '3e0121c886a2fb824d32b5b3edabc6e202d571e8bcb8a5f9a9166d2fd390d500', status: 'активен', title: 'Знижка 20 % на перший місяць розмовного клубу', type: 'promo',
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
    id: 'akciya-pervye-30-dnej', keyHash: '7eece2805c2d8cec267931156952e3d0b7c2e6a1370669f3694e08e8ab3a2a5c', status: 'активен', title: 'Чек-лист «Перші 30 днів» у подарунок до консультації', type: 'promo',
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
    id: 'akciya-znakomstvo-onlajn', keyHash: 'c375c11c539e63dad1d46fdf08d64fb1f6d3d59bfbe27c42b70b49135de8ef19', status: 'активен', title: 'Безкоштовне знайомство 30 хвилин онлайн', type: 'promo',
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
    id: 'akciya-deklaraciya', keyHash: '72c8824d13be4a4c8013e4e359218bc6d68fcb4016b2e6bb5f5b7765e577b713', status: 'активен', title: 'Перевірка податкової декларації за CHF 120', type: 'promo',
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
    id: 'akciya-kejtering', keyHash: '6b2ccc844650c59c790d2881fdf454937a168828b3d3610983dd73dee1a19c29', status: 'активен', title: 'Знижка 15 % на перше замовлення кейтерингу', type: 'promo',
    promo: { kind: 'percent', value: 15, what: 'усе меню кейтерингу при замовленні на 10 осіб і більше', group: true, cond: ['new', 'book', 'noalc'] },
    date: '2026-10-10', dateEnd: '2026-12-20',
    canton: 'Zürich', address: 'Musterstrasse 5, 8004 Zürich', geo: [47.3769, 8.5417], online: false,
    langs: ['українська', 'російська', 'німецька'], commercial: true, organizers: [{ org: 'obrazec-firma-kejtering', name: 'Кейтеринг «Приклад» GmbH (зразок)' }],
    contacts: { email: 'catering@example.com' }, link: 'https://example.com/catering',
    about: 'Перше замовлення кейтерингу для свята, офісу чи шкільної події зі знижкою. Українська та швейцарська кухня, доставка по Цюриху й околицях. Замовлення за три дні.'
  },
  /* постоянная акция (promo.always: true): «всегда первая услуга за полцены для новых клиентов»; date — первый день, dateEnd — конец года подтверждения (владелец подтверждает раз в год) */
  {
    sample: true,
    sections: ['events'],
    id: 'akciya-salon', keyHash: 'd45c93cdbfaaecc272f711c865280d9dc22ac2767dc391ad6e4859a5e554bae6', status: 'активен', title: 'Перша стрижка за пів ціни', type: 'promo',
    promo: { kind: 'percent', value: 50, what: 'перша жіноча стрижка з миттям і укладанням', regular: 80, cond: ['new', 'book'], always: true },
    date: '2026-10-11', dateEnd: '2027-10-11',
    canton: 'Zürich', address: 'Musterstrasse 5, 8004 Zürich', geo: [47.3769, 8.5417], online: false,
    langs: ['українська', 'російська', 'німецька'], commercial: true, organizers: [{ org: 'obrazec-salon-krasoty', name: 'Салон «Приклад» GmbH (зразок)' }],
    signup: 'wa', contacts: { phone: '+41 00 000 00 00', whatsapp: '+41 79 000 00 00', instagram: '@salon_primer' }, link: 'https://example.com/salon',
    about: 'Для тих, хто прийшов у салон уперше: перша стрижка за половину ціни, завжди. Ми раді новим клієнтам і хочемо, щоб вам у нас було спокійно й приємно. Запис телефоном або у WhatsApp.'
  },
  /* «Рідне Слово» (12.10.2026): расписание школы с её страницы — ждёт подтверждения школы вместе с карточкой организации (organizacii/#preview=…) */
  {
    sections: ['kursy'], kind: 'regular', ktype: 'kids',
    id: 'ridne-slovo-zanyatiya', keyHash: '166a038502e1ad58594ee1333a0553f505f30f146afa54c2b34255c649ceb4ea', status: 'на підтвердженні', title: 'Українська суботня школа «Рідне Слово»: заняття I семестру 2026–2027', type: 'kids',
    date: '2026-08-15', repeat: { freq: 'weekly', until: '2027-01-30', except: ['2026-09-19', '2026-09-26', '2026-10-03', '2026-10-10', '2026-12-26', '2027-01-02', '2027-01-09'] },
    canton: 'Bern', address: 'Gotthelfstrasse 40, 3013 Bern', online: false,
    langs: ['українська'], level: 'діти: садочок, дошкільнята, молодша, середня й старша групи', price: '', commercial: true,
    organizers: [{ org: 'ridne-slovo-bern', name: 'Українська школа «Рідне Слово»' }], link: 'https://ridneslovo.ch/register/',
    about: 'Заняття щосуботи за розкладом школи: українська мова й література, традиції, культура та історія України. Записати дитину можна анкетою для батьків на сайті школи.'
  },
  /* пробная карточка «Рідне Слово» (лид, 12.10.2026): события школы по её постам в Facebook (facebook.com/ridneslovo.bern, фото с анонсами).
     Все уже прошли — в предпросмотре карточки они стоят с пометкой «прошло», для примера. Личные телефоны из постов не берём. */
  {
    sections: ['events'], type: 'retreat',
    id: 'ridne-slovo-tabir-osin-2026', keyHash: '166a038502e1ad58594ee1333a0553f505f30f146afa54c2b34255c649ceb4ea', status: 'на підтвердженні', title: 'Осінній табір «Мандрівка країнами світу» для підлітків 13–16 років у Мюмлісвілі',
    date: '2026-09-20', dateEnd: '2026-09-26',
    canton: 'Solothurn', address: '4717 Mümliswil', online: false,
    langs: ['українська'], level: 'підлітки 13–16 років', price: 'CHF 250', per: 'за тиждень', commercial: true,
    organizers: [{ org: 'ridne-slovo-bern', name: 'Українська школа «Рідне Слово»' }, { name: 'Ukraine Hilfe Bern', link: 'https://www.ukraine-hilfe-bern.ch' }, { name: 'Ukrainer in Bern' }], link: 'https://www.facebook.com/ridneslovo.bern/',
    about: 'Тиждень у горах кантону Золотурн: щодня — нова країна (Швейцарія, Україна, Німеччина, Франція, Англія, Італія та інші), її культура, традиції, мова, музика й кухня. Квести та командні ігри, творчі майстер-класи, музика й танці, спорт і прогулянки на природі.'
  },
  {
    sections: ['events'], type: 'culture',
    id: 'ridne-slovo-kino-chervona-ruta', keyHash: '166a038502e1ad58594ee1333a0553f505f30f146afa54c2b34255c649ceb4ea', status: 'на підтвердженні', title: 'Кіно українською для підлітків 14–17 років: комедія «Потяг «Червона Рута» у Фрібурі',
    date: '2026-08-29', time: '17:00', timeEnd: '20:56',
    canton: 'Bern', address: 'Treffpunkt, Bahnhof Bern, 3011 Bern', online: false,
    langs: ['українська'], level: 'підлітки 14–17 років', price: 'CHF 10', priceNote: 'благодійний внесок', commercial: false,
    organizers: [{ org: 'ridne-slovo-bern', name: 'Українська школа «Рідне Слово»' }, { name: 'Ukraine Hilfe Bern', link: 'https://www.ukraine-hilfe-bern.ch' }, { name: 'Ukrainer in Bern' }], link: 'https://www.facebook.com/ridneslovo.bern/',
    about: 'Збір біля Treffpunkt на вокзалі Берна, разом їдемо до Фрібура на українську комедію «Потяг «Червона Рута», потім фото й спілкування, близько 21:00 — знову в Берні. Із собою — перекус і вода. Потрібна реєстрація, місць небагато.'
  },
  {
    sections: ['events'], type: 'kids',
    id: 'ridne-slovo-kozacki-zabavy', keyHash: '166a038502e1ad58594ee1333a0553f505f30f146afa54c2b34255c649ceb4ea', status: 'на підтвердженні', title: '«Козацькі забави» — інтелектуальні ігри для учнів школи «Рідне Слово»',
    date: '2026-09-12', time: '10:00',
    canton: 'Bern', address: 'Gotthelfstrasse 40, 3013 Bern', online: false,
    langs: ['українська'], level: 'учні школи, у межах суботніх занять', price: '', commercial: true,
    organizers: [{ org: 'ridne-slovo-bern', name: 'Українська школа «Рідне Слово»' }], link: 'https://www.facebook.com/ridneslovo.bern/',
    about: 'На уроках української мови, літератури та культури — змагання в знаннях і кмітливості: сторінки української літератури, ігри зі словами й мовні загадки, козацькі традиції та звичаї.'
  },
  {
    sections: ['events'], type: 'culture',
    id: 'jewish-culture-shabat', keyHash: '75318fbbb1510d6477b59476d04f17fd965ae98df6b1ddbf9f2f89831d768fd5', status: 'на підтвердженні', title: 'Шабат у Берні — щотижнева зустріч громади Jewish Culture Switzerland',
    date: '2026-10-17', time: '11:00', timeEnd: '14:00', repeat: { freq: 'weekly', until: '2027-01-30' },
    canton: 'Bern', address: 'Marktgasse, Käfiggässchen 63, 3011 Bern', online: false,
    langs: ['українська', 'російська', 'англійська'], level: 'для всіх, можна з дітьми', price: 'безкоштовно', commercial: false,
    organizers: [{ org: 'jewish-culture-bern', name: 'Jewish Culture Switzerland' }], link: 'https://jewishculture.ch/uk/events/shabbat-shalom',
    about: 'Щосуботи громада зустрічає Шабат у теплій, невимушеній, родинній атмосфері. Молитва й хвала, читання Писання, спілкування та спільний стіл. Українською та російською з перекладом англійською, вхід вільний.'
  },
  /* Jewish Culture Switzerland (12.10.2026): события и занятия с их сайта jewishculture.ch для примера — ждут подтверждения общины вместе с карточкой (organizacii/#preview=…);
     прошедшие даты Claude заменяет следующими с их сайта перед каждым письмом (правило Ирины 12.10.2026, «lidy-svoiludi.md») */
  {
    sections: ['events'], type: 'meet',
    id: 'jewish-culture-teens-tribe', keyHash: '75318fbbb1510d6477b59476d04f17fd965ae98df6b1ddbf9f2f89831d768fd5', status: 'на підтвердженні', title: 'Teens Tribe & Youvin — вечір для молоді',
    date: '2026-10-23', time: '18:30', timeEnd: '21:30',
    canton: 'Bern', address: 'Marktgasse, Käfiggässchen 63, 3011 Bern', online: false,
    langs: ['німецька'], level: 'молодь', price: '', commercial: false,
    organizers: [{ org: 'jewish-culture-bern', name: 'Jewish Culture Switzerland' }], link: 'https://jewishculture.ch/uk/events/teens-tribe-youvin',
    about: 'Спільний вечір молоді громади та Vineyard Bern, щоб подружитися й змістовно провести час. Буде знайомство, хвала, коротке слово, перекус і спілкування. Літературною німецькою, запис — через форму на сайті громади.'
  },
  {
    sections: ['events'], type: 'culture',
    id: 'jewish-culture-erev-shabat', keyHash: '75318fbbb1510d6477b59476d04f17fd965ae98df6b1ddbf9f2f89831d768fd5', status: 'на підтвердженні', title: 'Ерев Шабат — зустрічаємо Шабат разом',
    date: '2026-10-30', time: '18:30', timeEnd: '20:30',
    canton: 'Bern', address: 'Marktgasse, Käfiggässchen 63, 3011 Bern', online: false,
    langs: ['німецька', 'англійська'], level: 'для всіх', price: '', commercial: false,
    organizers: [{ org: 'jewish-culture-bern', name: 'Jewish Culture Switzerland' }], link: 'https://jewishculture.ch/uk/events/erev-shabbat',
    about: 'Вечір п’ятниці, щоб залишити метушню тижня позаду й зустріти Шабат із радістю, хвалою та теплим спілкуванням. Німецькою та англійською. Будемо раді, якщо принесете щось до святкового столу.'
  },
  {
    sections: ['kursy'], kind: 'regular', ktype: 'kids',
    id: 'jewish-culture-kinder-club', keyHash: '75318fbbb1510d6477b59476d04f17fd965ae98df6b1ddbf9f2f89831d768fd5', status: 'на підтвердженні', title: 'Kinder Club — вечір для дітей 8–13 років', type: 'kids',
    date: '2026-10-15', time: '18:30', timeEnd: '20:00', repeat: { freq: 'weekly', until: '2026-12-03' },
    canton: 'Bern', address: 'Marktgasse, Käfiggässchen 63, 3011 Bern', online: false,
    langs: ['українська'], level: 'діти 8–13 років', price: '', commercial: false,
    organizers: [{ org: 'jewish-culture-bern', name: 'Jewish Culture Switzerland' }], link: 'https://jewishculture.ch/uk/workshops',
    about: 'Воркшоп для дітей 8–13 років щочетверга. Творчість, нові друзі й вечір разом. Осінній сезон триває з 17 вересня до 3 грудня 2026 року, дитину записують через форму на сайті громади.'
  },
  {
    sections: ['kursy'], kind: 'regular', ktype: 'lang',
    id: 'jewish-culture-deutsch-club', keyHash: '75318fbbb1510d6477b59476d04f17fd965ae98df6b1ddbf9f2f89831d768fd5', status: 'на підтвердженні', title: 'Deutsch Sprechclub — розмовний клуб німецької', type: 'lang',
    date: '2026-10-15', time: '18:30', timeEnd: '21:00', repeat: { freq: 'weekly', until: '2026-12-03' },
    canton: 'Bern', address: 'Marktgasse, Käfiggässchen 63, 3011 Bern', online: false,
    langs: ['німецька'], level: '', price: '', commercial: false,
    organizers: [{ org: 'jewish-culture-bern', name: 'Jewish Culture Switzerland' }], link: 'https://jewishculture.ch/uk/workshops',
    about: 'Розмовний клуб німецької щочетверга — місце, де можна просто бути, відчувати й насолоджуватися процесом. Осінній сезон триває з 17 вересня до 3 грудня 2026 року, запис — через форму на сайті громади.'
  },
  /* VIDNOVA (12.10.2026): цена форума в анонсе не указана — commercial: true, чтобы в предпросмотре не было «бесплатно»; цену спросить. Их ближайшее событие с их канала «Українці в Швейцарії» — для примера в пробной карточке, ждёт подтверждения вместе с карточкой
     (organizacii/#preview=vidnova-zurich…); прошедшее Claude заменяет следующим их событием перед каждым письмом (правило Ирины 12.10.2026, «lidy-svoiludi.md») */
  {
    sections: ['events'], type: 'talk',
    id: 'vidnova-vitalis-2026', keyHash: '09e960beed9572499e1ba030273dfc4cd7f04a55d1b49f6b709212320041cc2c', status: 'на підтвердженні', title: 'VITALIS INTERNATIONAL — міжнародний онлайн-форум «Здоров’я · Краса · Мода»',
    date: '2026-10-17',
    canton: 'Zürich', address: '', online: true,
    langs: ['українська'], level: 'для дорослих', price: '', commercial: true,
    organizers: [{ org: 'vidnova-zurich', name: 'VIDNOVA' }, { name: 'Harmonia Akademie' }], link: 'https://forms.gle/A7zsoW7qQ6UL4BaH9',
    about: 'Спікери зі Швейцарії, Ізраїлю, Іспанії та України говорять про здоров’я, красу, стиль, довголіття та якість життя. У програмі — виступи, практичні підходи й професійні кейси, а ще нові знайомства для співпраці. Форум проводять VIDNOVA і Harmonia Akademie. Участь — за попередньою реєстрацією, форма за посиланням.'
  },
  {
    "sections": [
      "events"
    ],
    "id": "rubin-beauty-studenty",
    "keyHash": "61bdd3a84ac0066144160cf39b0ac3673b81c08d32efb9dc6332fd6a471d7a6e",
    "status": "на підтвердженні",
    "title": "Студентам знижка 10 % на всі послуги",
    "type": "promo",
    "promo": {
      "kind": "percent",
      "value": 10,
      "what": "усі послуги салону — для студенток і студентів",
      "group": true,
      "cond": [
        "book"
      ],
      "always": true
    },
    "date": "2026-10-12",
    "dateEnd": "2027-10-11",
    "canton": "Zug",
    "address": "Suurstoffi 16, 6343 Risch-Rotkreuz",
    "geo": [
      47.1442162,
      8.4370922
    ],
    "online": false,
    "langs": [
      "російська",
      "румунська",
      "німецька",
      "англійська"
    ],
    "commercial": true,
    "organizers": [
      {
        "org": "rubin-beauty-rotkreuz",
        "name": "Rubin Beauty"
      }
    ],
    "signup": "wa",
    "contacts": {
      "email": "florearubin@mail.ru",
      "phone": "+41 79 626 89 18",
      "whatsapp": "+41 79 626 89 18",
      "instagram": "rubinbeauty"
    },
    "link": "https://www.rubinbeauty.ch",
    "about": "Студенткам і студентам — знижка 10 % на всі послуги салону: манікюр і педикюр, вії та брови, догляд за обличчям, депіляція, масаж і стрижки. Знижка діє постійно, подробиці — під час запису."
  },
  /* пробная карточка SG-0021 «Алёна» (лид, 12.10.2026): её мастер-класс из поста в группе Facebook — уже прошёл, в предпросмотре стоит примером с пометкой «прошло» */
  {
    sections: ['kursy'], ktype: 'create', kind: 'once',
    id: 'alena-botanical-relief-mk-2026-04', keyHash: '938a0e2512f863022d161db158254afb3add2f944fecd96070743835930b85bc', status: 'на підтвердженні', title: 'Майстер-клас із рельєфу, світла й композиції — Botanical Relief Series',
    date: '2026-04-11', time: '12:00', timeEnd: '16:00',
    canton: 'Zürich', address: 'INTWINE Conceptual Showroom, Heidbachstrasse 42, 8032 Zürich', online: false,
    langs: ['російська'], level: 'для дорослих', price: '', commercial: true,
    organizers: ['alena-botanical-relief'],
    about: 'Декоративна рельєфна панель власноруч: ботанічний рельєф, робота зі світлом і композицією. Свою роботу забираєте із собою.'
  },
  {
    "sections": [
      "events"
    ],
    "id": "maryna-geneva-gajd-stipendii",
    "keyHash": "03c5aaf1152dc86720fe6171beb91a296913565ce8466092bf50e664057dcd44",
    "status": "на підтвердженні",
    "title": "Гайд «Стипендії у Швейцарії» в подарунок",
    "type": "promo",
    "promo": {
      "kind": "gift",
      "what": "гайд «Стипендії у Швейцарії» у PDF — для тих, хто планує навчатися у Швейцарії",
      "cond": [
        "online"
      ],
      "always": true
    },
    "date": "2026-10-12",
    "dateEnd": "2027-10-11",
    "canton": "Genève",
    "address": "",
    "online": true,
    "langs": [
      "російська"
    ],
    "commercial": true,
    "organizers": [
      "maryna-geneva"
    ],
    "signup": "tg",
    "contacts": {
      "telegram": "marynabakh",
      "instagram": "marynabakh"
    },
    "link": "https://t.me/marynabakhmatova",
    "about": "Дарую гайд «Стипендії у Швейцарії» у PDF — для тих, хто планує навчатися у Швейцарії та шукає, як оплатити навчання. Гайд закріплено в моєму Telegram-каналі «Education & Career Switzerland», а можна просто написати мені в особисті повідомлення — надішлю."
  },
  {
    "sections": [
      "events"
    ],
    "type": "talk",
    "id": "maryna-geneva-efir-perevod-2026-09",
    "keyHash": "03c5aaf1152dc86720fe6171beb91a296913565ce8466092bf50e664057dcd44",
    "status": "на підтвердженні",
    "title": "Як перевестися з університету в Україні до університету у Швейцарії — прямий ефір",
    "date": "2026-09-28",
    "canton": "Genève",
    "address": "",
    "online": true,
    "langs": [
      "російська"
    ],
    "level": "для дорослих",
    "price": "",
    "commercial": true,
    "organizers": [
      "maryna-geneva"
    ],
    "link": "https://t.me/marynabakhmatova",
    "about": "Відповідаю на одне з найчастіших запитань. Як студентові, який зараз навчається в Україні, перевестися до університету у Швейцарії? І що робити, якщо навчання в Україні довелося перервати, — як поновитися й продовжити його вже тут. Розбираю можливі варіанти та важливі моменти."
  },
  {
    "sections": [
      "events"
    ],
    "type": "talk",
    "id": "maryna-geneva-efir-ucheba-2026-09",
    "keyHash": "03c5aaf1152dc86720fe6171beb91a296913565ce8466092bf50e664057dcd44",
    "status": "на підтвердженні",
    "title": "Плюси й мінуси навчання за кордоном — прямий ефір",
    "date": "2026-09-24",
    "canton": "Genève",
    "address": "",
    "online": true,
    "langs": [
      "російська"
    ],
    "level": "для дорослих",
    "price": "",
    "commercial": true,
    "organizers": [
      "maryna-geneva"
    ],
    "link": "https://t.me/marynabakhmatova",
    "about": "Говоримо про плюси й мінуси навчання за кордоном — очного та онлайн. Головне питання не у форматі, а в меті: навіщо вам ця освіта і що має змінитися в житті після навчання. Коли зрозуміло, для чого, обрати формат набагато простіше."
  },
  {
    "sections": [
      "events"
    ],
    "type": "talk",
    "id": "maryna-geneva-efir-linkedin-2026-09",
    "keyHash": "03c5aaf1152dc86720fe6171beb91a296913565ce8466092bf50e664057dcd44",
    "status": "на підтвердженні",
    "title": "Як бути помітним у LinkedIn саме у Швейцарії — прямий ефір",
    "date": "2026-09-07",
    "canton": "Genève",
    "address": "",
    "online": true,
    "langs": [
      "російська"
    ],
    "level": "для дорослих",
    "price": "",
    "commercial": true,
    "organizers": [
      "maryna-geneva"
    ],
    "link": "https://t.me/marynabakhmatova",
    "about": "Як створити й оформити сторінку в LinkedIn, щоб вона працювала на вас саме на швейцарському ринку."
  },
  {
    "sections": [
      "events"
    ],
    "id": "nora-zurich-modeli",
    "keyHash": "409bbf753826dcdacf2a97f54e802d3ad3589504c278349fe28f30e55ee02429",
    "status": "на підтвердженні",
    "title": "Моделям для портфоліо — ламінування брів за особливою ціною",
    "type": "promo",
    "promo": {
      "kind": "price",
      "value": 30,
      "what": "ламінування брів без фарбування для моделей у портфоліо, з фарбуванням — CHF 40",
      "cond": [
        "book"
      ]
    },
    "date": "2026-10-12",
    "dateEnd": "2027-01-09",
    "canton": "Zürich",
    "address": "",
    "online": false,
    "langs": [
      "російська"
    ],
    "commercial": true,
    "organizers": [
      "nora-zurich"
    ],
    "signup": "wa",
    "contacts": {},
    "link": "",
    "about": "Я поповнюю портфоліо і шукаю моделей на ламінування брів (Brow Lamination) у кантоні Цюрих. Для моделей особлива ціна: CHF 40 з фарбуванням і CHF 30 без фарбування. Записатися можна у WhatsApp."
  },
  /* Украинская греко-католическая миссия Цюрих (12.10.2026): занятия и события с их страницы forum-magazin.ch/ukrainische-mission — для примера в пробной карточке,
     ждут подтверждения миссии (правило Ирины 12.10.2026, «lidy-svoiludi.md», разделы 6–7) */
  {
    sections: ['events'], type: 'meet',
    id: 'ugcc-zurich-liturgiya', keyHash: '2c680732bc95c4dd38447e0ee83f36af69096eb505701d542378e008f0c90c0c', status: 'на підтвердженні', title: 'Божественна літургія українською в Цюриху',
    date: '2026-10-18', time: '14:00', repeat: { freq: 'weekly', until: '2026-12-27' },
    canton: 'Zürich', address: 'Krypta der Liebfrauenkirche, Weinbergstrasse 32, 8006 Zürich', online: false,
    langs: ['українська'], level: 'для всіх, можна з дітьми', price: 'безкоштовно', commercial: false,
    organizers: [{ org: 'ugcc-zurich', name: 'Українська греко-католицька місія в Цюриху' }], link: 'https://www.forum-magazin.ch/ukrainische-mission/agenda/',
    about: 'Щонеділі, крім п’ятої неділі місяця, місія служить Божественну літургію в крипті церкви Liebfrauen. Запрошують усіх християн і всіх, кому цікаво. Після служби — спілкування за чашкою кави у фоє.'
  },
  {
    sections: ['kursy'], kind: 'regular', ktype: 'kids',
    id: 'ugcc-zurich-katehizis', keyHash: '2c680732bc95c4dd38447e0ee83f36af69096eb505701d542378e008f0c90c0c', status: 'на підтвердженні', title: 'Катехизація для дітей і підлітків 3–15 років', type: 'kids',
    date: '2026-10-18', time: '15:30', timeEnd: '17:00', repeat: { freq: 'weekly', until: '2026-12-27' },
    canton: 'Zürich', address: 'Pfarreizentrum Liebfrauen, Weinbergstrasse 32, 8006 Zürich', online: false,
    langs: ['українська'], level: 'діти й підлітки 3–15 років', price: 'безкоштовно', commercial: false,
    organizers: [{ org: 'ugcc-zurich', name: 'Українська греко-католицька місія в Цюриху' }], link: 'https://www.forum-magazin.ch/ukrainische-mission/updates/20251028-kinderkatechese/',
    about: 'Після недільної літургії діти й підлітки від 3 до 15 років мають катехизацію в залах парафії Liebfrauen, зазвичай з 15:30 до 17:00.'
  },
  {
    sections: ['events'], type: 'meet',
    id: 'ugcc-zurich-bibleyskiy-chas', keyHash: '2c680732bc95c4dd38447e0ee83f36af69096eb505701d542378e008f0c90c0c', status: 'на підтвердженні', title: 'Біблійна година українською',
    date: '2026-10-18', time: '16:00',
    canton: 'Zürich', address: 'Foyer der Liebfrauenkirche, Weinbergstrasse 32, 8006 Zürich', online: false,
    langs: ['українська'], level: 'для дорослих', price: 'безкоштовно', commercial: false,
    organizers: [{ org: 'ugcc-zurich', name: 'Українська греко-католицька місія в Цюриху' }], link: 'https://www.forum-magazin.ch/ukrainische-mission/updates/20251028-bibelstunde/',
    about: 'У першу й третю неділю місяця після літургії, близько 16:00, у фоє церкви Liebfrauen разом читають і обговорюють недільне Євангеліє. Наступні зустрічі — 1 і 15 листопада.'
  },
  {
    sections: ['events'], type: 'meet',
    id: 'ugcc-zurich-einsiedeln', keyHash: '2c680732bc95c4dd38447e0ee83f36af69096eb505701d542378e008f0c90c0c', status: 'на підтвердженні', title: 'Паломництво до Айнзідельна — літургія й молитва за мир в Україні',
    date: '2026-10-31', time: '14:00',
    canton: 'Schwyz', address: 'Kloster Einsiedeln, 8840 Einsiedeln', online: false,
    langs: ['українська'], level: 'для всіх', price: 'безкоштовно', commercial: false,
    organizers: [{ org: 'ugcc-zurich', name: 'Українська греко-католицька місія в Цюриху' }], link: 'https://www.forum-magazin.ch/ukrainische-mission/updates/20260203-gottliche-liturgie-und-gebet-fur-den-frieden-in-de/',
    about: 'В останню суботу місяця місія вирушає до монастиря Айнзідельн. О 14:00 — Божественна літургія, зазвичай у каплиці Святої Магдалини, потім молитва за мир в Україні й у всьому світі та можливість сповідатися. Після — кава або невеликий перекус у кімнаті для паломників.'
  },
  /* UA-DO (13.10.2026, черновик для афиши): расписание по fricktal.info (05.2024) — с 14.10.2026 — по списку ферайнов общины Зиссельн (пн, ср 16:30–19:00, пт 16:00–18:00), Володимир подтверждает в карточке; Штайн убран 14.10.2026: филиала нет */
  {
    sections: ['kursy'], type: 'kids', kind: 'regular',
    id: 'ua-do-sisseln-pn', keyHash: '09de5945781020e152796fdec5fcf631c0debd478625a7f2e7305f29d38834cf', status: 'на підтвердженні', title: 'Тренування UA-DO у Зіссельні',
    date: '2026-10-19', time: '16:30', timeEnd: '19:00', repeat: { freq: 'weekly' },
    canton: 'Aargau', address: 'Schulhausstrasse 11, 4334 Sisseln', online: false,
    langs: ['українська'], level: 'діти, підлітки й дорослі', price: 'ціну уточнюємо', commercial: true,
    organizers: [{ org: 'ua-do-sisseln', name: 'Спортивна школа UA-DO' }], link: 'https://ua-do.ch/',
    about: 'Регулярні тренування спортивної школи UA-DO з українського єдиноборства UA-DO, «Козацького двобою», дзюдо та джиу-джитсу.'
  },
  {
    sections: ['kursy'], type: 'kids', kind: 'regular',
    id: 'ua-do-sisseln-sr', keyHash: '09de5945781020e152796fdec5fcf631c0debd478625a7f2e7305f29d38834cf', status: 'на підтвердженні', title: 'Тренування UA-DO у Зіссельні',
    date: '2026-10-14', time: '16:30', timeEnd: '19:00', repeat: { freq: 'weekly' },
    canton: 'Aargau', address: 'Schulhausstrasse 11, 4334 Sisseln', online: false,
    langs: ['українська'], level: 'діти, підлітки й дорослі', price: 'ціну уточнюємо', commercial: true,
    organizers: [{ org: 'ua-do-sisseln', name: 'Спортивна школа UA-DO' }], link: 'https://ua-do.ch/',
    about: 'Регулярні тренування спортивної школи UA-DO з українського єдиноборства UA-DO, «Козацького двобою», дзюдо та джиу-джитсу.'
  },
  {
    sections: ['kursy'], type: 'kids', kind: 'regular',
    id: 'ua-do-sisseln-pt', keyHash: '09de5945781020e152796fdec5fcf631c0debd478625a7f2e7305f29d38834cf', status: 'на підтвердженні', title: 'Тренування UA-DO у Зіссельні',
    date: '2026-10-16', time: '16:00', timeEnd: '18:00', repeat: { freq: 'weekly' },
    canton: 'Aargau', address: 'Schulhausstrasse 11, 4334 Sisseln', online: false,
    langs: ['українська'], level: 'діти, підлітки й дорослі', price: 'ціну уточнюємо', commercial: true,
    organizers: [{ org: 'ua-do-sisseln', name: 'Спортивна школа UA-DO' }], link: 'https://ua-do.ch/',
    about: 'Регулярні тренування спортивної школи UA-DO з українського єдиноборства UA-DO, «Козацького двобою», дзюдо та джиу-джитсу.'
  },
  /* Спортивная школа UA-DO (12.10.2026): будущих событий на их сайте нет (новости — до 12.2023), поэтому для примера — их последний открытый чемпионат, с пометкой «прошло»
     (правило Ирины 12.10.2026, «lidy-svoiludi.md», раздел 6); на сайт для всех прошедшие не выходят никогда */
  {
    sections: ['events'], type: 'kids',
    id: 'ua-do-open-2023', keyHash: '09de5945781020e152796fdec5fcf631c0debd478625a7f2e7305f29d38834cf', status: 'на підтвердженні', title: 'Відкритий чемпіонат UA-DO School для дітей до 14 років',
    date: '2023-12-09', time: '10:00',
    canton: 'Aargau', address: 'Sportcenter Bustelbach, Sportplatzweg 2, 4332 Stein AG', online: false,
    langs: ['українська'], level: 'діти до 14 років', price: 'CHF 20', commercial: true,
    organizers: [{ org: 'ua-do-sisseln', name: 'Спортивна школа UA-DO' }], link: 'https://ua-do.ch/2023/12/01/ua-do-school/',
    about: 'Спортивне свято для маленьких спортсменів до 14 років — веселі змагання в дисциплінах Rumble Do і Stiktug Do. Реєстрація учасників — з 9:00 до 10:00, початок змагань — о 10:00.'
  },
  /* пробная карточка SG-0037 «Стас» (лид из Instagram, 14.10.2026): его туры из Telegram-канала t.me/stanych — оба уже прошли,
     в предпросмотре стоят примером с пометкой «прошло» («lidy-svoiludi.md», раздел 6); на сайт для всех прошедшие не выходят никогда */
  {
    sections: ['events'], type: 'retreat',
    id: 'stas-lauterbrunnen-2026-07', keyHash: 'b3fc6034f3e116862423a76c7e188c45e70773453bca757c427e1c2f1e1fb8fa', status: 'на підтвердженні', title: 'Дві сторони Лаутербруннена: два дні з наметами, водоспадами й льодовиками',
    date: '2026-07-18', dateEnd: '2026-07-19',
    canton: 'Bern', address: '3822 Lauterbrunnen', online: false,
    langs: ['російська'], level: 'для дорослих', price: '', commercial: true,
    organizers: ['stas-gid-zurich'], link: 'https://t.me/stanych/293',
    about: 'Два дні в одній із найкрасивіших долин Швейцарії. Першого дня — водоспад Штауббах і похід зі Штехельберга до оглядового майданчика з видом на водоспади Шмадрібах і льодовики, увечері в кемпінгу — м’ясо на грилі та борщ у казані. Другого — підйом до Мюррена й панорамна стежка North Face Trail з видом на Ейгер, Менх і Юнгфрау, спуск через Гіммельвальд. У тур входять кемпінг, вечеря та супровід на всьому маршруті.'
  },
  {
    sections: ['events'], type: 'retreat',
    id: 'stas-tur-mayringen-2026-08', keyHash: 'b3fc6034f3e116862423a76c7e188c45e70773453bca757c427e1c2f1e1fb8fa', status: 'на підтвердженні', title: 'Тур на вихідні в Майрінген: шале, водоспади й гори',
    date: '2026-08-14', dateEnd: '2026-08-16',
    canton: 'Bern', address: '3860 Meiringen', online: false,
    langs: ['російська'], level: 'для дорослих', price: 'CHF 600', priceNote: 'за тур: 3 дні та 2 ночі', commercial: true,
    organizers: ['stas-gid-zurich'], link: 'https://t.me/stanych/305',
    about: 'Три дні та дві ночі в Альпах. Живемо в триповерховому шале, ходимо до Райхенбахського водоспаду, в ущелину Розенлауї та в долину Лаутербруннен, піднімаємося на Хардер-Кульм і Бріенцер-Ротгорн. Вечорами — борщ на вогнищі, млинці, картопля з м’ясом і фондю, ігри та історії. Група — до 20 людей.'
  },
  {
    sections: ['events'], type: 'retreat',
    id: 'stas-pohod-appenzell-2026-09', keyHash: 'b3fc6034f3e116862423a76c7e188c45e70773453bca757c427e1c2f1e1fb8fa', status: 'на підтвердженні', title: 'Осінній похід у горах Аппенцелля',
    date: '2026-09-12',
    canton: 'Appenzell Innerrhoden', address: 'Bahnhof Appenzell, 9050 Appenzell', online: false,
    langs: ['російська'], level: 'для дорослих', price: '', commercial: true,
    organizers: ['stas-gid-zurich'], link: 'https://t.me/stanych/309',
    about: 'Вересень, жовтень і травень — найкращий час для походів у гори. Зустрічаємося на вокзалі Аппенцелля й ідемо осінніми стежками. Запитання про похід — в особистих повідомленнях.'
  }
];
