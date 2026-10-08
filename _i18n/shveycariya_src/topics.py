# «Как устроена Швейцария» — карта тем (черновик 08.10.2026, ветка kopiya-shveycariya).
# Одна тема = одна страница shveycariya/<slug>/. Разделы взяты из бота Swiss Guide (@swisscompass_bot),
# тексты на сайте свои и короче; поле bot — номер раздела в боте, чтобы всегда знать, где та же тема там.
# tools — инструменты svoiludi.ch/instrumenty/<slug>/; help — (направление справочника, [специализации]) из CATS в index.html;
# tabs — другие вкладки сайта (kursy, events). ready=True — статья написана (файл articles/<slug>.html).

MODULES = [
    ('status', 'Статус и пермиты', 'Какие бывают разрешения, на сколько их дают и как их не потерять.'),
    ('money', 'Налоги, деньги и долги', 'Как платить налоги, не попасть в Betreibung и копить на пенсию.'),
    ('insure', 'Страховки и здоровье', 'Медстраховка, врачи, психотерапия и страховки, без которых здесь нельзя.'),
    ('learn', 'Дети, учёба и профессия', 'Ясли, школа, дипломы, язык и правила для твоей профессии.'),
    ('work', 'Работа и соцзащита', 'Своё дело, трудовой договор, болезнь, потеря работы и пособия.'),
    ('home', 'Жильё и транспорт', 'Как снять квартиру, что в договоре и как ездить без штрафов.'),
    ('life', 'Семья и быт', 'Брак, KESB, община, правила дома, мусор, посылки и права покупателя.'),
]

TOOLS = {
    'moj-budget': 'Мой бюджет',
    'moj-god': 'Мой год',
    'moj-den': 'Мой день',
    'moi-emocii': 'Мои эмоции',
    'uchet-vremeni': 'Учёт моего времени',
    'chasy-po-klientam': 'Часы по клиентам',
    'rezyume': 'Резюме по-швейцарски',
    'ekstrennye-nomera': 'Экстренные номера',
    'put-obrazovaniya': 'Путь образования',
    'yazyk-trebovaniya': 'Язык: что и где требуют',
    'strahovki-obyazatelnye': 'Обязательные страховки',
    'nalogi-shema': 'Как устроены налоги',
    'pensiya-shema': 'Как устроена пенсия',
    'dogovor-nyani': 'Договор с няней',
    'dohody-rashody': 'Доходы и расходы',
    'schet-qr': 'Счёт клиенту с QR-кодом',
    'moi-dannye': 'Мои данные',
    'kuda-obratitsya': 'Куда обратиться за помощью',
    'franshiza-shema': 'Франшиза медстраховки',
    'zarplata': 'Расчёт зарплаты',
    'diplomy-shema': 'Признание дипломов',
    'grazhdanstvo-shema': 'Путь к гражданству',
}

TABS = {'kursy': ('Курсы и занятия', '../../kursy/'), 'events': ('События', '../../events/')}

T = lambda slug, mod, bot, title, lead, tools=(), help=(), tabs=(), ready=False: dict(
    slug=slug, mod=mod, bot=bot, title=title, lead=lead, tools=list(tools), help=list(help), tabs=list(tabs), ready=ready)

TOPICS = [
    # 1. Статус
    T('permit-l', 'status', '1.1.1', 'Пермит L — краткосрочное разрешение', 'На сколько дают L, можно ли менять работу и когда из L получается B.', ['moj-god', 'rezyume', 'pensiya-shema', 'strahovki-obyazatelnye', 'moi-dannye'], [('status', ['Разрешения и статус']), ('law', ['Миграционное право'])], ready=True),
    T('permit-b', 'status', '1.1.2', 'Пермит B — вид на жительство', 'Как получить ВНЖ, на сколько и что нужно, чтобы его продлили.', ['strahovki-obyazatelnye', 'nalogi-shema', 'yazyk-trebovaniya', 'grazhdanstvo-shema', 'moj-god', 'moj-budget', 'moi-dannye', 'kuda-obratitsya'],
      [('status', ['Разрешения и статус']), ('law', ['Миграционное право']), ('learn', ['Немецкий язык', 'Подготовка к fide'])], ['kursy'], ready=True),
    T('permit-c', 'status', '1.1.3', 'Пермит C — постоянный ВНЖ', 'Когда можно подать на C, какой нужен язык и как его не потерять.', ['yazyk-trebovaniya', 'moj-god', 'grazhdanstvo-shema'], [('status', ['Разрешения и статус', 'Натурализация']), ('learn', ['Немецкий язык', 'Подготовка к fide'])], ['kursy'], ready=True),
    T('grazhdanstvo', 'status', '', 'Гражданство Швейцарии и натурализация', 'Когда можно подавать на швейцарский паспорт, какой нужен язык и чем отличаются кантоны.', ['grazhdanstvo-shema', 'yazyk-trebovaniya', 'moj-god'], [('status', ['Натурализация', 'Разрешения и статус']), ('law', ['Миграционное право']), ('learn', ['Немецкий язык', 'Подготовка к fide'])], ['kursy'], ready=True),
    T('permit-g', 'status', '1.1.4', 'Пермит G — работа в Швейцарии, жизнь за границей', 'Кто может ездить сюда на работу, на сколько дают G и как платят налоги.', ['uchet-vremeni', 'nalogi-shema', 'pensiya-shema', 'zarplata'], [('status', ['Разрешения и статус']), ('money', ['Налоговая декларация'])], ready=True),
    T('status-s', 'status', '1.2.1', 'Статус S для украинцев', 'Сколько продлится защита, работа, поездки в Украину и пермит B через 5 лет.', ['diplomy-shema', 'yazyk-trebovaniya', 'rezyume', 'zarplata', 'put-obrazovaniya', 'ekstrennye-nomera', 'grazhdanstvo-shema', 'moj-budget', 'moj-god', 'moi-dannye', 'kuda-obratitsya'], [('status', ['Разрешения и статус', 'Социальные вопросы и пособия']), ('law', ['Миграционное право']), ('learn', ['Немецкий язык'])], ['kursy'], ready=True),
    T('status-f', 'status', '1.2.2', 'Статус F — временно принятые', 'Работа, поездки, семья и путь от F к пермиту B.', ['yazyk-trebovaniya', 'diplomy-shema', 'rezyume', 'zarplata', 'put-obrazovaniya', 'grazhdanstvo-shema', 'ekstrennye-nomera', 'moj-budget', 'moi-dannye'], [('status', ['Разрешения и статус']), ('law', ['Миграционное право']), ('learn', ['Немецкий язык'])], ['kursy'], ready=True),
    T('status-n', 'status', '1.2.3', 'Статус N — пока идёт процедура убежища', 'Как идёт процедура, когда можно работать и что делать при отказе.', ['moj-god', 'ekstrennye-nomera', 'moi-dannye'], [('law', ['Миграционное право']), ('status', ['Разрешения и статус'])], ready=True),
    # 2. Налоги, деньги, долги
    T('nalogi', 'money', '2.1.1', 'Налоги в Швейцарии', 'Три уровня налога и почему община влияет на сумму.', ['nalogi-shema', 'moj-budget'], [('money', ['Налоговая декларация'])], ready=True),
    T('nalogovaya-deklaraciya', 'money', '2.1.2', 'Налоги на зарплату и декларация', 'Налог у источника: когда декларация обязательна, когда выгодна и почему назад дороги нет.', ['nalogi-shema', 'moj-budget', 'chasy-po-klientam', 'pensiya-shema', 'zarplata', 'dohody-rashody'],
      [('money', ['Налоговая декларация', 'Бухгалтерия и Treuhand']), ('insure', ['Пенсия AHV и BVG'])], ready=True),
    T('bank', 'money', '2.1.3', 'Банковский счёт', 'Как открыть счёт, почему PostFinance не может просто отказать и что сделать перед отъездом.', ['moj-budget', 'pensiya-shema'], [('money', ['Ипотека и банки'])], ready=True),
    T('betreibung', 'money', '2.1.4', 'Долги в Швейцарии и Betreibung', 'Что делать, если пришёл Zahlungsbefehl, и как убрать запись из реестра.', ['moj-budget', 'nalogi-shema', 'kuda-obratitsya'],
      [('law', ['Долги и взыскания']), ('money', ['Консультации по долгам'])], ready=True),
    T('pensiya', 'money', '2.1.5', 'Пенсия: три колонны', 'AHV, пенсионная касса и 3a — что обязательно, а что добровольно.', ['pensiya-shema', 'zarplata', 'nalogi-shema', 'strahovki-obyazatelnye', 'moj-budget'], [('insure', ['Пенсия AHV и BVG']), ('money', ['Финансовое планирование'])], ready=True),
    T('skrytye-rashody', 'money', '2.1.6', 'Скрытые расходы и штрафы', 'Serafe, зубной, Nebenkosten, штрафы — что ломает бюджет чаще всего.', ['moj-budget', 'nalogi-shema', 'strahovki-obyazatelnye', 'franshiza-shema'], [('money', ['Финансовое планирование', 'Консультации по долгам'])], ready=True),
    # 3. Страховки и здоровье
    T('medstrahovka', 'insure', '3.1', 'Медстраховка KVG', 'Франшиза, доля расходов, модели и смена страховой.', ['franshiza-shema', 'moj-budget', 'ekstrennye-nomera', 'strahovki-obyazatelnye', 'moi-dannye', 'kuda-obratitsya'], [('insure', ['Страховой брокер']), ('health', ['Семейный врач'])], ready=True),
    T('dop-strahovanie', 'insure', '3.2', 'Дополнительное страхование', 'Зубы, очки, палата в больнице — что стоит денег, а что нет.', ['moj-budget', 'strahovki-obyazatelnye', 'franshiza-shema', 'kuda-obratitsya'], [('insure', ['Страховой брокер']), ('health', ['Стоматолог'])], ready=True),
    T('psihoterapiya', 'insure', '3.3', 'Психотерапия через страховку', 'Направление от врача, сколько сеансов оплачивают и куда звонить в кризис.', ['moi-emocii', 'ekstrennye-nomera'], [('psy', ['Психотерапевт', 'Психиатр']), ('health', ['Семейный врач'])], ready=True),
    T('strahovki', 'insure', '3.4', 'Нужные страховки', 'Ответственность, имущество, юрзащита, несчастный случай и машина.', ['strahovki-obyazatelnye', 'moj-budget', 'ekstrennye-nomera', 'pensiya-shema', 'franshiza-shema', 'kuda-obratitsya'], [('insure', ['Страховой брокер'])], ready=True),
    T('bolezn-travma', 'insure', '3.5', 'Заболел или травма: что делать', 'Чек-листы на болезнь, несчастный случай, ДТП и больного ребёнка.', ['ekstrennye-nomera', 'moj-god', 'strahovki-obyazatelnye', 'franshiza-shema', 'kuda-obratitsya'], [('health', ['Семейный врач', 'Педиатр']), ('insure', ['Страховой брокер'])], ready=True),
    # 4. Дети, учёба, профессия
    T('kita-detsad', 'learn', '4.1', 'Ясли, детский сад и начальная школа', 'Сколько стоит, как работают субсидии и спецшколы.', ['put-obrazovaniya', 'moj-god', 'moj-budget', 'ekstrennye-nomera', 'dogovor-nyani'], [('kids', ['Ясли и детский сад', 'Логопед', 'Няня'])], ['kursy'], ready=True),
    T('shkola-lehre', 'learn', '4.2', 'Секундарная школа, гимназия, Lehre', 'Как выбирается путь подростка и почему Lehre — не «второй сорт».', ['put-obrazovaniya', 'moj-god', 'diplomy-shema'], [('kids', ['Подготовка к гимназии', 'Репетитор']), ('learn', ['Карьера и резюме'])], ready=True),
    T('vuz', 'learn', '4.3', 'Университет и PhD', 'Сколько стоит учёба для иностранцев и как устроена докторантура.', ['put-obrazovaniya', 'diplomy-shema'], [('learn', ['Курсы и переквалификация'])], ready=True),
    T('diplomy', 'learn', '4.4', 'Признание дипломов', 'Регламентируемые профессии, SBFI, ECUS и частые ошибки.', ['diplomy-shema', 'yazyk-trebovaniya', 'put-obrazovaniya', 'rezyume'], [('learn', ['Признание дипломов', 'Карьера и резюме']), ('status', ['Заверенные переводы'])], ready=True),
    T('professii-krasota', 'learn', '4.5.1', 'Красота: маникюр, косметика, массаж', 'Какие нужны разрешения и где проходит граница с медициной.', ['chasy-po-klientam', 'diplomy-shema', 'strahovki-obyazatelnye', 'nalogi-shema', 'schet-qr', 'dohody-rashody'], [('body', ['Маникюр', 'Косметолог', 'Массаж']), ('learn', ['Открытие своего дела'])], ready=True),
    T('professii-dom', 'learn', '4.5.2', 'Уборка, кейтеринг, домашняя кухня', 'Правила гигиены, регистрация и страховки.', ['chasy-po-klientam', 'zarplata', 'uchet-vremeni', 'strahovki-obyazatelnye', 'nalogi-shema', 'diplomy-shema', 'schet-qr', 'kuda-obratitsya', 'dohody-rashody'], [('home', ['Уборка и помощь по дому', 'Уборка со сдачей квартиры']), ('events', ['Торты и домашняя кухня'])], ready=True),
    T('professii-konsultirovanie', 'learn', '4.5.3', 'Коучинг, консультирование, психология', 'Какие звания защищены и что можно обещать клиенту.', ['chasy-po-klientam', 'diplomy-shema', 'nalogi-shema', 'strahovki-obyazatelnye', 'schet-qr', 'dohody-rashody'], [('coach', ['Коуч', 'Консультант по адаптации']), ('psy', ['Психолог'])], ready=True),
    T('professii-prepodavanie', 'learn', '4.5.5', 'Преподавание и онлайн-курсы', 'Что нужно, чтобы учить людей и брать за это деньги.', ['chasy-po-klientam', 'yazyk-trebovaniya', 'put-obrazovaniya', 'diplomy-shema', 'nalogi-shema', 'schet-qr', 'dohody-rashody'], [('learn', ['Открытие своего дела'])], ['kursy'], ready=True),
    T('nyani', 'learn', '4.5.6', 'Няня и Tagesmutter', 'Когда нужен договор, разрешение и страховка.', ['dogovor-nyani', 'ekstrennye-nomera', 'zarplata', 'chasy-po-klientam', 'uchet-vremeni', 'diplomy-shema', 'moi-dannye', 'kuda-obratitsya'], [('kids', ['Няня'])], ready=True),
    T('professii-avto', 'learn', '4.5.7', 'Автосервис, такси, Uber', 'Разрешения, лицензии и страховки для работы с машиной.', ['chasy-po-klientam', 'zarplata', 'strahovki-obyazatelnye', 'nalogi-shema', 'diplomy-shema', 'schet-qr', 'dohody-rashody'], [('home', ['Автосервис', 'Автошкола'])], ready=True),
    T('fide', 'learn', '4.6', 'Язык и fide', 'Какой уровень нужен для B, C и паспорта и как получить скидку на курс.', ['yazyk-trebovaniya', 'moj-den', 'grazhdanstvo-shema'], [('learn', ['Немецкий язык', 'Французский язык', 'Подготовка к fide'])], ['kursy'], ready=True),
    # 5. Работа и соцзащита
    T('rabota', 'work', '5.4', 'Работа в Швейцарии для украинцев и русскоязычных', 'Где искать вакансии (jobs.ch, jobup, Indeed, RAV), резюме по-швейцарски и что можно с твоим пермитом.', ['rezyume', 'zarplata', 'diplomy-shema', 'yazyk-trebovaniya', 'strahovki-obyazatelnye', 'pensiya-shema', 'uchet-vremeni', 'moj-den', 'kuda-obratitsya', 'moi-dannye'],
      [('learn', ['Поиск работы и рекрутинг', 'Карьера и резюме', 'Немецкий язык']), ('status', ['Заверенные переводы'])], ['kursy'], ready=True),
    T('samozanyatost', 'work', '5.1', 'Как открыть ИП в Швейцарии (selbständig)', 'Уведомить до начала, AHV, налоги, страховки — шаг за шагом.', ['schet-qr', 'chasy-po-klientam', 'moj-budget', 'strahovki-obyazatelnye', 'nalogi-shema', 'pensiya-shema', 'kuda-obratitsya', 'dohody-rashody'], [('learn', ['Открытие своего дела']), ('money', ['Бухгалтерия и Treuhand']), ('insure', ['Страховой брокер'])], ready=True),
    T('trudovoe-pravo', 'work', '5.2', 'Трудовой договор и увольнение', 'Договор, испытательный срок и сроки увольнения.', ['uchet-vremeni', 'zarplata', 'rezyume', 'kuda-obratitsya'], [('law', ['Трудовое право'])], ready=True),
    T('profsoyuzy', 'work', '', 'Профсоюзы и консультации', 'Куда вступить за небольшой взнос, чтобы получать консультации и защиту, и где помогают бесплатно.', ['kuda-obratitsya'], [('law', ['Трудовое право'])], ready=True),
    T('bolezn-na-rabote', 'work', '5.3', 'Болезнь и травма на работе', 'Кто платит зарплату и чем Krankheit отличается от Unfall.', ['uchet-vremeni'], [('law', ['Трудовое право']), ('insure', ['Страховой брокер'])]),
    T('poterya-raboty', 'work', '5.4', 'Потеря работы и RAV', 'Что сделать в первые дни, чтобы не потерять деньги.', ['rezyume', 'moj-budget', 'moj-den', 'pensiya-shema', 'zarplata', 'kuda-obratitsya'], [('learn', ['Поиск работы и рекрутинг', 'Карьера и резюме']), ('law', ['Трудовое право'])], ready=True),
    T('domashniy-personal', 'work', '5.5', 'Домашний персонал', 'Если нанимаешь няню или уборщицу — твои обязанности как работодателя.', ['dogovor-nyani', 'zarplata', 'uchet-vremeni', 'strahovki-obyazatelnye', 'ekstrennye-nomera', 'kuda-obratitsya', 'moi-dannye'], [('money', ['Бухгалтерия и Treuhand'])], ready=True),
    T('sozialhilfe', 'work', '5.6', 'Социальная помощь', 'Права, контроль, возврат и влияние на статус.', ['moj-budget'], [('status', ['Социальные вопросы и пособия']), ('law', ['Миграционное право'])]),
    # 6. Жильё и транспорт
    T('arenda', 'home', '6.1.1', 'Как снять квартиру', 'Поиск, досье арендатора и что хозяин не вправе требовать.', ['moj-budget'], [('home', ['Риелтор', 'Переезд'])]),
    T('dogovor-arendy', 'home', '6.1.2', 'Договор аренды и ловушки', 'Залог, Nebenkosten, сдача квартиры и споры.', ['moj-budget', 'kuda-obratitsya'], [('law', ['Аренда']), ('home', ['Уборка со сдачей квартиры'])]),
    T('pokupka-zhilya', 'home', '6.1.4', 'Покупка жилья', 'Кто может купить, сколько нужно своих денег и ипотека.', ['moj-budget'], [('money', ['Ипотека и банки']), ('home', ['Риелтор'])]),
    T('transport', 'home', '6.2', 'Транспорт, машина и права', 'Проездные, обмен прав, машина после переезда и штрафы.', ['moj-budget'], [('home', ['Автошкола', 'Автосервис'])]),
    # 7. Семья и быт
    T('brak-razvod', 'life', '7.1.1', 'Брак, развод и алименты', 'Признание брака, развод и алименты в Швейцарии.', ['grazhdanstvo-shema'], [('law', ['Семейное право', 'Медиация']), ('status', ['Заверенные переводы'])]),
    T('kesb', 'life', '7.1.3', 'KESB', 'Что это за служба, когда она приходит и как себя вести.', ['moi-emocii'], [('law', ['Семейное право']), ('coach', ['Семейный консультант'])]),
    T('vereine', 'life', '7.1.4', 'Ферайны, волонтёрство и свои люди', 'Как найти круг общения и почему это помогает с интеграцией.', ['moj-den'], [('coach', ['Консультант по адаптации'])], ['events', 'kursy']),
    T('gemeinde', 'life', '7.2.1', 'Община (Gemeinde)', 'Регистрация, переезд и где искать помощь на месте.', ['moj-god', 'moi-dannye'], [('status', ['Письма и формы'])]),
    T('pravila-doma', 'life', '7.2.2', 'Тишина, прачечная и правила дома', 'Hausordnung, общая стиральная и соседи.', [], [('law', ['Аренда'])]),
    T('musor', 'life', '7.2.4', 'Мусор и сортировка', 'Платные мешки, сортировка и штрафы.', ['moj-god'], []),
    T('zhivotnye', 'life', '7.2.5', 'Животные', 'Регистрация собаки, чип, налог и ветеринар.', [], [('home', ['Ветеринар и уход за животными'])]),
    T('priroda', 'life', '7.2.6', 'Горы, хайкинг и безопасность', 'Как ходить в горы без риска и кто спасает.', ['ekstrennye-nomera'], [], ['events']),
    T('tamozhnya', 'life', '7.3', 'Таможня и посылки', 'Лимиты, НДС, пошлины и что нельзя ввозить.', [], [('home', ['Международный переезд и таможня'])]),
    T('prava-pokupatelya', 'life', '7.4', 'Права покупателя', 'Гарантия, возврат, подписки и Abofallen.', ['kuda-obratitsya'], [('law', ['Права потребителей'])]),
]
