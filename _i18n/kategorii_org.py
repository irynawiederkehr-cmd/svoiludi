"""НАПРАВЛЕНИЯ И КАТЕГОРИИ «ОРГАНИЗАЦИЙ» — один источник для всего сайта (решение Ирины 12.10.2026:
«направлений там очень уж мало, возьми по крайней мере как у специалистов», «значки нужны разные, чтобы отображали суть»).
Устроено как у специалистов (_i18n/kategorii.py): группа → направление → категории; у направления свой цвет и свой значок,
у категории немецкое слово (для поиска) и строка «что проверяем» при размещении ('' — ничего особого).
Правила: направление — что организация делает (вид помощи, занятия, товары), «для кого» — пометками-фильтрами (статус S, дети, женщины…);
кто работает сам, без команды и помещения, — в справочник специалистов; регулируемое (ясли, частная школа, ресторан, перевозка людей,
сбор пожертвований) — только с проверенным разрешением; защищённые слова — по «zashchishchennye-slova.md». Церквей и общин здесь нет:
раздел «Общины» — открытый вопрос Ирины. Названия категорий уникальны в этом списке.

Запуск из корня: python3 _i18n/kategorii_org.py — переписывает:
  _i18n/organizacii_src/orgdirs.js (направления, категории, значки, подсказка «?» — вставляется в organizacii/ при сборке build.py),
  badge/index.html (const DIRS — название и цвет направления на значке организации),
  events/index.html и akcii/index.html (const ORG_FOOD — направления еды: у акций и событий еды «Кроме спиртных напитков»).
Потом: python3 _i18n/organizacii_src/build.py, struktura_src/build.py, nav.py, pwa.py, sync.py, build_search.py.
Карточкам (data/organizations.js) направление (dir, dir2) и до трёх категорий (cats) ставит Claude при размещении."""
import os, re, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GROUPS = [
    ('pomosh', 'Помощь и поддержка'),
    ('deti', 'Дети, учёба и языки'),
    ('obshchestvo', 'Общество, культура и досуг'),
    ('delo', 'Работа и деловые сообщества'),
    ('firmy', 'Фирмы своих: еда, товары и услуги'),
]

# (ключ, название, группа, цвет, значок, [(категория, немецкое слово, что проверяем при размещении)])
DIRS = [
    # --- Помощь и поддержка
    ('help', 'Помощь беженцам и интеграция', 'pomosh', '#4F5E3E', 'orgHelp', [
        ('Центр помощи и консультации', 'Beratungsstelle, Anlaufstelle', ''),
        ('Помощь людям со статусом S', 'Schutzstatus S', ''),
        ('Помощь с жильём и бытом', 'Wohnhilfe', ''),
        ('Курсы интеграции и ориентации', 'Integrationskurs', ''),
        ('Сопровождение в ведомства', 'Begleitung zu Ämtern', ''),
        ('Одежда, продукты и вещи', 'Kleiderbörse, Lebensmittelhilfe', ''),
    ]),
    ('ukraine', 'Помощь Украине', 'pomosh', '#3F6FBF', 'orgUkraine', [
        ('Гуманитарная помощь и отправка', 'humanitäre Hilfe, Hilfsgüter', ''),
        ('Сбор пожертвований', 'Spendensammlung', 'собирать деньги для других — только зарегистрированный ферайн или фонд с уставом'),
        ('Восстановление и проекты в Украине', 'Wiederaufbau Ukraine', ''),
        ('Поддержка семей из Украины', 'Unterstützung ukrainischer Familien', ''),
    ]),
    ('support', 'Поддержка и взаимопомощь', 'pomosh', '#B5648E', 'orgSupport', [
        ('Группы поддержки и встречи для разговора', 'Selbsthilfegruppe, Gesprächsgruppe', 'без слов «терапия», «психолог» — только если группу ведёт специалист с признанным документом'),
        ('Помощь женщинам и семьям', 'Frauenberatung, Familienhilfe', ''),
        ('Помощь пожилым', 'Seniorenhilfe', ''),
        ('Люди с инвалидностью и их близкие', 'Behinderung, Angehörige', ''),
    ]),
    ('advice', 'Бесплатные консультации', 'pomosh', '#4F6D7A', 'orgAdvice', [
        ('Правовая консультация', 'Rechtsberatung', 'слово «адвокат» — только при записи консультанта в реестре адвокатов кантона'),
        ('Долги и бюджет', 'Schuldenberatung, Budgetberatung', ''),
        ('Работа, учёба и профессия', 'Berufsberatung', ''),
        ('Письма и документы', 'Schreibdienst', ''),
    ]),
    # --- Дети, учёба и языки
    ('kita', 'Детские сады и игровые группы', 'deti', '#D08A2E', 'orgKita', [
        ('Игровая группа', 'Spielgruppe', ''),
        ('Ясли и детский сад', 'Kita, Kinderkrippe', 'ясли и детский сад — разрешение кантона или общины (Bewilligung)'),
        ('Встречи мам с малышами', 'Eltern-Kind-Treff', ''),
        ('Продлёнка и присмотр после школы', 'Hort, Tagesstruktur', 'присмотр за детьми за плату — разрешение общины или кантона'),
    ]),
    ('school', 'Школы родного языка и культуры', 'deti', '#2E7D9A', 'orgSchool', [
        ('Субботняя и воскресная школа', 'Wochenendschule', ''),
        ('Уроки родного языка и культуры HSK', 'HSK-Unterricht', ''),
        ('Украинская школа дистанционно', 'ukrainische Fernschule', ''),
        ('Библиотека и книжный клуб', 'Bibliothek, Buchclub', ''),
    ]),
    ('circles', 'Кружки, секции и лагеря для детей', 'deti', '#C2577A', 'orgCircles', [
        ('Творчество для детей', 'Malkurs, Basteln für Kinder', ''),
        ('Музыка и танцы для детей', 'Musikschule, Kindertanz', ''),
        ('Спорт для детей', 'Kindersport', ''),
        ('Лагеря и каникулы', 'Ferienlager', 'лагерь с ночёвкой — правила кантона для детских лагерей'),
        ('Скауты', 'Pfadi', ''),
    ]),
    ('languages', 'Языковые школы и курсы', 'deti', '#2894A0', 'orgLang', [
        ('Курсы немецкого', 'Deutschkurs', ''),
        ('Курсы французского и итальянского', 'Französischkurs, Italienischkurs', ''),
        ('Курсы английского', 'Englischkurs', ''),
        ('Украинский и русский для детей и взрослых', 'Ukrainischkurs, Russischkurs', ''),
        ('Подготовка к экзаменам fide, Goethe, telc', 'Sprachprüfung fide', ''),
    ]),
    ('edu', 'Частные школы и учебные центры', 'deti', '#5B6FB0', 'orgEdu', [
        ('Частная школа', 'Privatschule', 'частная школа — разрешение кантона'),
        ('Учебный центр и курсы для взрослых', 'Weiterbildung', ''),
        ('Репетиторский центр', 'Nachhilfe', ''),
        ('Компьютерные курсы и IT', 'Informatikkurs', ''),
        ('Подготовка к гимназии и экзаменам', 'Gymivorbereitung', ''),
    ]),
    # --- Общество, культура и досуг
    ('community', 'Общества и землячества', 'obshchestvo', '#7A5A8C', 'orgCommunity', [
        ('Общество в городе или кантоне', 'Verein, Gemeinschaft', ''),
        ('Землячество и диаспора', 'Diaspora-Verein', ''),
        ('Клуб по интересам', 'Freizeitclub', ''),
        ('Женский клуб', 'Frauenverein', ''),
        ('Молодёжная организация', 'Jugendverein', ''),
    ]),
    ('culture', 'Культура и искусство', 'obshchestvo', '#A0523D', 'orgCulture', [
        ('Театр и кино', 'Theater, Kino', ''),
        ('Хор, ансамбль и музыка', 'Chor, Ensemble', ''),
        ('Народное искусство и ремёсла', 'Volkskunst, Handwerk', ''),
        ('Выставки и галереи', 'Ausstellung, Galerie', ''),
        ('Литература и поэзия', 'Literatur, Lesung', ''),
    ]),
    ('traditions', 'Праздники и традиции', 'obshchestvo', '#B98324', 'orgTraditions', [
        ('Праздники и концерты', 'Feste, Konzerte', ''),
        ('Ярмарки и базары', 'Markt, Basar', 'продажа еды и билетов — это деньги с людей (условия как у фирм)'),
        ('Памятные дни', 'Gedenkveranstaltung', ''),
        ('Кухня и кулинарные встречи', 'Kochtreff', ''),
    ]),
    ('sport', 'Спорт и активный отдых', 'obshchestvo', '#3E8E5E', 'orgSport', [
        ('Футбол и командные виды спорта', 'Fussballverein, Mannschaftssport', ''),
        ('Шахматы и настольные игры', 'Schachclub', ''),
        ('Походы и туризм', 'Wandergruppe', ''),
        ('Бег, велосипед и йога', 'Laufgruppe, Velo, Yoga', ''),
        ('Боевые искусства', 'Kampfsport', ''),
    ]),
    ('media', 'Медиа, чаты и каналы', 'obshchestvo', '#5C6670', 'orgMedia', [
        ('Новостной канал или сайт', 'Nachrichten, Newsportal', ''),
        ('Чат или группа по городу', 'Chatgruppe', ''),
        ('Журнал или газета', 'Zeitschrift, Zeitung', ''),
        ('Радио и подкасты', 'Radio, Podcast', ''),
    ]),
    # --- Работа и деловые сообщества
    ('business', 'Деловые сообщества и нетворкинг', 'delo', '#4C6A9A', 'orgBusiness', [
        ('Бизнес-клуб и нетворкинг', 'Business-Netzwerk', ''),
        ('Торговая палата и ассоциация', 'Handelskammer, Wirtschaftsverband', ''),
        ('Сообщество предпринимательниц', 'Unternehmerinnen-Netzwerk', ''),
        ('Стартапы и IT-сообщества', 'Startup, IT-Community', ''),
    ]),
    ('prof', 'Профессиональные сообщества', 'delo', '#6B5B95', 'orgProf', [
        ('Медицина и здоровье: профессиональное сообщество', 'Berufsverband Gesundheit', 'сообщество не оказывает медицинских услуг; звания участников — по «zashchishchennye-slova.md»'),
        ('Учителя и педагоги', 'Lehrerverband', ''),
        ('Инженеры и IT-специалисты', 'Ingenieure, Informatik', ''),
        ('Юристы и экономисты', 'Juristen, Ökonomen', ''),
        ('Люди искусства и творческих профессий', 'Kulturschaffende', ''),
    ]),
    ('career', 'Работа и карьера: помощь в поиске', 'delo', '#1F7A8C', 'orgCareer', [
        ('Консультации по поиску работы', 'Stellensuche, Bewerbungshilfe', 'без обещаний «гарантированно найдём работу»; платное посредничество — разрешение кантона (AVG)'),
        ('Признание дипломов и практика', 'Anerkennung, Praktikum', ''),
        ('Наставничество и менторинг', 'Mentoring', ''),
        ('Переобучение и новая профессия', 'Umschulung', ''),
    ]),
    # --- Фирмы своих
    ('food', 'Рестораны, кафе и пекарни', 'firmy', '#A84E3C', 'orgFood', [
        ('Ресторан', 'Restaurant', 'разрешение кантона на ресторан (Gastgewerbebewilligung)'),
        ('Кафе и кофейня', 'Café', 'разрешение кантона на кафе (Gastgewerbebewilligung)'),
        ('Пекарня и кондитерская', 'Bäckerei, Konditorei', 'регистрация в пищевом контроле кантона (Lebensmittelkontrolle)'),
        ('Еда навынос и доставка', 'Take-away, Lieferservice', 'регистрация в пищевом контроле кантона (Lebensmittelkontrolle)'),
    ]),
    ('catering', 'Кейтеринг и еда на заказ', 'firmy', '#C0663A', 'orgCatering', [
        ('Кейтеринг для праздников и фирм', 'Catering', 'регистрация в пищевом контроле кантона (Lebensmittelkontrolle)'),
        ('Торты на заказ', 'Torten auf Bestellung', 'регистрация в пищевом контроле кантона (Lebensmittelkontrolle)'),
        ('Домашняя еда и заготовки', 'Hausgemachtes', 'регистрация в пищевом контроле кантона (Lebensmittelkontrolle)'),
    ]),
    ('shop', 'Магазины продуктов и товаров', 'firmy', '#6B8E3E', 'orgShop', [
        ('Продукты из Украины и Восточной Европы', 'osteuropäische Lebensmittel', 'продажа продуктов — регистрация в пищевом контроле кантона'),
        ('Онлайн-магазин', 'Onlineshop', ''),
        ('Книги, сувениры и подарки', 'Buchhandlung, Geschenke', ''),
        ('Одежда и вышиванки', 'Kleider, Wyschywanka', ''),
    ]),
    ('beauty', 'Салоны красоты', 'firmy', '#C25468', 'orgBeauty', [
        ('Парикмахерская и барбершоп', 'Coiffeur, Barbershop', ''),
        ('Маникюр и косметика', 'Nagelstudio, Kosmetik', ''),
        ('Массаж для отдыха и wellness', 'Wellness-Massage', '«медицинский массаж» — только с признанным в Швейцарии документом'),
    ]),
    ('studio', 'Студии танца, спорта и йоги', 'firmy', '#8E5A86', 'orgStudio', [
        ('Танцевальная студия', 'Tanzstudio', ''),
        ('Фитнес и спортзал', 'Fitnessstudio', ''),
        ('Йога и пилатес', 'Yoga, Pilates', ''),
        ('Студия музыки и вокала', 'Musikstudio, Gesang', ''),
    ]),
    ('services', 'Мастерские и сервисы', 'firmy', '#8E8470', 'orgServices', [
        ('Ремонт и строительство', 'Renovation, Bau', 'электромонтаж — разрешение ESTI'),
        ('Ателье и ремонт одежды', 'Schneiderei, Änderungsatelier', ''),
        ('Ремонт техники и телефонов', 'Reparaturservice', ''),
        ('Уборка', 'Reinigung', ''),
        ('Фото- и видеостудия', 'Fotostudio', ''),
        ('Автосервис и шины', 'Autowerkstatt, Garage, Reifen', ''),   # 12.10.2026, Autocustom & Services GmbH (Biberist)
        ('Помощь в покупке автомобиля', 'Autokauf, Autoauktion', ''),
    ]),
    ('transport', 'Перевозки и посылки', 'firmy', '#4F7FA8', 'orgTransport', [
        ('Посылки в Украину и обратно', 'Paketdienst Ukraine', ''),
        ('Пассажирские перевозки', 'Personentransport, Reisebus', 'перевозка людей за плату — разрешение Федерального ведомства транспорта (BAV)'),
        ('Переезды и грузоперевозки', 'Umzug, Transport', ''),
        ('Туристическое агентство', 'Reisebüro', ''),
    ]),
    ('office', 'Бюро и агентства', 'firmy', '#56708A', 'orgOffice', [
        ('Бюро переводов', 'Übersetzungsbüro', ''),
        ('Бухгалтерская фирма и Treuhand', 'Treuhandbüro', ''),
        ('Страховое агентство', 'Versicherungsagentur', 'посредник — запись в реестре FINMA'),
        ('Агентство недвижимости', 'Immobilienagentur', ''),
        ('IT и веб-студия', 'Webagentur, IT-Firma', ''),
    ]),
]

# Значки направлений: рисунок 24 × 24 в стиле библиотеки значков сайта (линия {c} 1,8 px, светлая заливка {f}, {s} — общий стиль линии).
# Каждый значок — про суть направления; ни один не повторяет значки направлений специалистов (index.html, ICONS).
ICONS = {
    # дом с сердцем внутри — помощь и новый дом
    'orgHelp': '<path d="M3.5 11 12 4l8.5 7v9.5h-17z" fill="{f}" stroke="{c}" {s}/><path d="M12 17.2c-2.3-1.5-3.6-2.7-3.6-4.2a1.8 1.8 0 0 1 3.6-.8 1.8 1.8 0 0 1 3.6.8c0 1.5-1.3 2.7-3.6 4.2z" fill="{c}" stroke="{c}" stroke-width="1.2" stroke-linejoin="round"/>',
    # коробка помощи и сердце над ней
    'orgUkraine': '<path d="M4.5 11.5h15v8a1 1 0 0 1-1 1h-13a1 1 0 0 1-1-1z" fill="{f}" stroke="{c}" {s}/><path d="M3.5 11.5h17M12 11.5v9M9.5 11.5v2.5h5v-2.5" fill="none" stroke="{c}" {s}/><path d="M12 8.6c-2-1.3-3.1-2.3-3.1-3.6a1.55 1.55 0 0 1 3.1-.7 1.55 1.55 0 0 1 3.1.7c0 1.3-1.1 2.3-3.1 3.6z" fill="{c}" stroke="{c}" stroke-width="1.2" stroke-linejoin="round"/>',
    # два облачка разговора, в первом сердце
    'orgSupport': '<path d="M3.8 4.5h9.4a1.8 1.8 0 0 1 1.8 1.8v5a1.8 1.8 0 0 1-1.8 1.8H8.5L5.5 15.5v-2.4H3.8A1.8 1.8 0 0 1 2 11.3v-5a1.8 1.8 0 0 1 1.8-1.8z" fill="{f}" stroke="{c}" {s}/><path d="M17.5 8.5h2.7A1.8 1.8 0 0 1 22 10.3v5a1.8 1.8 0 0 1-1.8 1.8h-1v2.4l-3-2.4h-4a1.8 1.8 0 0 1-1.8-1.8v-.6" fill="none" stroke="{c}" {s}/><path d="M8.5 11c-1.5-1-2.4-1.8-2.4-2.8a1.2 1.2 0 0 1 2.4-.5 1.2 1.2 0 0 1 2.4.5c0 1-.9 1.8-2.4 2.8z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/>',
    # документ и кружок «i» — консультация
    'orgAdvice': '<path d="M5 3h8l4.5 4.5V13M10.5 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1" fill="{f}" stroke="{c}" {s}/><path d="M13 3v4.5h4.5M7.5 10h6M7.5 13h4" fill="none" stroke="{c}" {s}/><circle cx="16.8" cy="17.3" r="4.2" fill="#fff" stroke="{c}" {s}/><path d="M16.8 16.6v3" fill="none" stroke="{c}" stroke-width="2" stroke-linecap="round"/><circle cx="16.8" cy="14.9" r="1.05" fill="{c}"/>',
    # кубики — игровая группа и детский сад
    'orgKita': '<rect x="3" y="13" width="8" height="7.5" rx="1.3" fill="{f}" stroke="{c}" {s}/><rect x="13" y="13" width="8" height="7.5" rx="1.3" fill="#fff" stroke="{c}" {s}/><rect x="8" y="4" width="8" height="8" rx="1.3" fill="#fff" stroke="{c}" {s}/><path d="M7 15l1.8 3.4H5.2z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/><circle cx="17" cy="16.8" r="1.7" fill="{c}"/><path d="M12 6.3c.5 1 1 1.4 2 1.6-1 .3-1.5.6-2 1.7-.5-1.1-1-1.4-2-1.7 1-.2 1.5-.6 2-1.6z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/>',
    # школа с флажком
    'orgSchool': '<path d="M5 20.5V10.3L12 6l7 4.3v10.2" fill="{f}" stroke="{c}" {s}/><path d="M3 20.5h18M10 20.5v-4.3h4v4.3M12 6V2.6" fill="none" stroke="{c}" {s}/><path d="M12 2.6h4.3l-1.2 1.4 1.2 1.4H12z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/><circle cx="12" cy="11.6" r="1.8" fill="#fff" stroke="{c}" {s}/>',
    # палитра — творчество и кружки
    'orgCircles': '<path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-.8 1.9-1.7 0-1.3-1.2-1.7-1.2-2.9 0-1 .8-1.6 1.9-1.6h2.3a3.6 3.6 0 0 0 3.6-3.6C20.5 6.6 16.7 3.5 12 3.5z" fill="{f}" stroke="{c}" {s}/><circle cx="7.6" cy="11" r="1.4" fill="{c}"/><circle cx="9.6" cy="7.2" r="1.4" fill="{c}"/><circle cx="14.2" cy="6.9" r="1.4" fill="{c}"/><circle cx="17.4" cy="10" r="1.4" fill="{c}"/>',
    # два облачка с буквами A и Я — языки
    'orgLang': '<path d="M3.5 4h9a1.5 1.5 0 0 1 1.5 1.5v6a1.5 1.5 0 0 1-1.5 1.5H8l-3 2.5V13H3.5A1.5 1.5 0 0 1 2 11.5v-6A1.5 1.5 0 0 1 3.5 4z" fill="{f}" stroke="{c}" {s}/><path d="M11.5 15.5v.5a1.5 1.5 0 0 0 1.5 1.5h3.5l3 2.5v-2.5h1A1.5 1.5 0 0 0 22 16v-6a1.5 1.5 0 0 0-1.5-1.5h-4.5" fill="#fff" stroke="{c}" {s}/><path d="M5.6 11l2.4-5.2 2.4 5.2M6.4 9.4h3.2" fill="none" stroke="{c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.2 16v-5.2h-1.6a1.55 1.55 0 0 0 0 3.1h1.6M17.6 13.9l-1.8 2.1" fill="none" stroke="{c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
    # стопка книг — учебный центр
    'orgEdu': '<rect x="3.5" y="15.5" width="17" height="4.5" rx="1.2" fill="{f}" stroke="{c}" {s}/><rect x="5.5" y="10.8" width="13" height="4.7" rx="1.2" fill="#fff" stroke="{c}" {s}/><rect x="4.5" y="6" width="14" height="4.8" rx="1.2" fill="{f}" stroke="{c}" {s}/><path d="M7 15.5v4.5M9 10.8v4.7M7.5 6v4.8M17.5 3.5 19 6" fill="none" stroke="{c}" {s}/>',
    # три человека — общество, землячество
    'orgCommunity': '<circle cx="12" cy="7.2" r="2.8" fill="{f}" stroke="{c}" {s}/><circle cx="5.6" cy="9.6" r="2.1" fill="#fff" stroke="{c}" {s}/><circle cx="18.4" cy="9.6" r="2.1" fill="#fff" stroke="{c}" {s}/><path d="M6.8 20c.4-3.6 2.5-6 5.2-6s4.8 2.4 5.2 6z" fill="{f}" stroke="{c}" {s}/><path d="M2 18.5c.3-2.4 1.6-4 3.6-4 .9 0 1.6.3 2.2.8M22 18.5c-.3-2.4-1.6-4-3.6-4-.9 0-1.6.3-2.2.8" fill="none" stroke="{c}" {s}/>',
    # две театральные маски
    'orgCulture': '<path d="M9.5 6.5c3.2-1.6 7.3-1.3 10.5.6l-.6 5.2c-.4 3.6-3.2 5.9-6.2 5.6" fill="#fff" stroke="{c}" {s}/><path d="M15 10.4c.8-.4 1.8-.3 2.5.3M14.6 14.4c1-.6 2.2-.5 3 .3" fill="none" stroke="{c}" {s}/><path d="M3 7.6c3.6-1.4 7.6-1.4 11 .2l-.4 5.6c-.3 3.8-3.1 6.4-6.4 6.2-3.3-.3-5.4-3.3-5-7.1z" fill="{f}" stroke="{c}" {s}/><path d="M5.6 11.2c.7-.6 1.7-.7 2.6-.3M10.3 11.6c.8-.5 1.8-.4 2.5.2M6.4 15c1.6 1.4 3.6 1.5 5.2.3" fill="none" stroke="{c}" {s}/>',
    # венок с лентами — праздники и традиции
    'orgTraditions': '<path d="M2.5 5.5c3.2 2.2 6.3 3.2 9.5 3.2s6.3-1 9.5-3.2" fill="none" stroke="{c}" {s}/><path d="M4.6 7 5.2 13l3.3-4.3z" fill="{f}" stroke="{c}" {s}/><path d="M9.6 8.5l1.4 5.6 2.1-5.5z" fill="{c}" stroke="{c}" {s}/><path d="M14.6 8.6l2 5.4 1.2-5.9z" fill="{f}" stroke="{c}" {s}/><path d="M19.4 7l-.2 5.9-2.9-4.6z" fill="#fff" stroke="{c}" {s}/><path d="M12 15.6c.4 1.3.9 1.8 2.2 2.2-1.3.4-1.8.9-2.2 2.2-.4-1.3-.9-1.8-2.2-2.2 1.3-.4 1.8-.9 2.2-2.2zM5.6 17.5v.05M18.4 17.5v.05" fill="{c}" stroke="{c}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"/>',
    # кубок — спорт
    'orgSport': '<path d="M7.2 3.8h9.6v4.8a4.8 4.8 0 0 1-9.6 0z" fill="{f}" stroke="{c}" {s}/><path d="M7.2 5.5H4.6a2.7 2.7 0 0 0 2.9 4.1M16.8 5.5h2.6a2.7 2.7 0 0 1-2.9 4.1M12 13.4v3.1M8.2 20.5h7.6" fill="none" stroke="{c}" {s}/><path d="M9.5 20.5l.6-4h3.8l.6 4z" fill="#fff" stroke="{c}" {s}/><path d="M12 6.1l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" fill="{c}" stroke="{c}" stroke-width=".8" stroke-linejoin="round"/>',
    # газета — медиа
    'orgMedia': '<path d="M3.5 5h13.2v13.6a1.9 1.9 0 0 0 1.9 1.9H5.4a1.9 1.9 0 0 1-1.9-1.9z" fill="{f}" stroke="{c}" {s}/><path d="M16.7 9h3.8v9.6a1.9 1.9 0 0 1-3.8 0" fill="#fff" stroke="{c}" {s}/><rect x="6.3" y="8" width="4.4" height="4" rx=".6" fill="#fff" stroke="{c}" stroke-width="1.4"/><path d="M12.5 8.5h1.8M12.5 11.5h1.8M6.3 14.8h8M6.3 17.4h5.5" fill="none" stroke="{c}" {s}/>',
    # сеть связей — деловое сообщество
    'orgBusiness': '<path d="M12 6.5 6 16M12 6.5 18 16M7.5 18.5h9" fill="none" stroke="{c}" {s}/><circle cx="12" cy="5.5" r="3" fill="{f}" stroke="{c}" {s}/><circle cx="5.5" cy="17.5" r="3" fill="#fff" stroke="{c}" {s}/><circle cx="18.5" cy="17.5" r="3" fill="{f}" stroke="{c}" {s}/><circle cx="12" cy="13.3" r="1.5" fill="{c}"/>',
    # бейдж на шнурке — профессиональное сообщество
    'orgProf': '<rect x="3" y="6.5" width="18" height="13" rx="2.2" fill="{f}" stroke="{c}" {s}/><path d="M10 6.5V4.2h4v2.3" fill="none" stroke="{c}" {s}/><circle cx="8.2" cy="11.6" r="2" fill="#fff" stroke="{c}" {s}/><path d="M5.2 16.6c.5-1.6 1.6-2.4 3-2.4s2.5.8 3 2.4M13.5 11h4.5M13.5 14h4.5M13.5 17h2.8" fill="none" stroke="{c}" {s}/>',
    # ступени и флажок — работа и карьера
    'orgCareer': '<path d="M3 20.5V17h4.5v-4h4.5V9h4.5v11.5z" fill="{f}" stroke="{c}" {s}/><path d="M21 20.5H3M16.5 9V3" fill="none" stroke="{c}" {s}/><path d="M16.5 3h4l-1.1 1.5 1.1 1.5h-4z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/>',
    # колпак повара — рестораны, кафе и пекарни (12.10.2026, 10:55 по просьбе Ирины; до этого — тарелка с вилкой и ножом)
    'orgFood': '<path d="M7 14c-2.4-.2-4-2.1-4-4.3a4.3 4.3 0 0 1 5.6-4.1A4.6 4.6 0 0 1 12 4a4.6 4.6 0 0 1 3.4 1.6A4.3 4.3 0 0 1 21 9.7c0 2.2-1.6 4.1-4 4.3v3.7H7z" fill="{f}" stroke="{c}" {s}/><rect x="6.5" y="17.7" width="11" height="3" rx="1" fill="#fff" stroke="{c}" {s}/><path d="M9.3 9.6c.5-1 1.4-1.6 2.4-1.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    # блюдо под крышкой — кейтеринг
    'orgCatering': '<path d="M4.5 17a7.5 7.5 0 0 1 15 0z" fill="{f}" stroke="{c}" {s}/><path d="M2.8 17h18.4M3.5 20.3h17M12 9.5V8M10.6 8h2.8" fill="none" stroke="{c}" {s}/><path d="M8 13.6a4.6 4.6 0 0 1 2.4-1.8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>',
    # корзина — магазин
    'orgShop': '<path d="M3.5 10h17l-1.8 9.2a1.6 1.6 0 0 1-1.6 1.3H6.9a1.6 1.6 0 0 1-1.6-1.3z" fill="{f}" stroke="{c}" {s}/><path d="M8 10l3-5.5M16 10l-3-5.5M2.5 10h19M9 13.5v3.8M12 13.5v3.8M15 13.5v3.8" fill="none" stroke="{c}" {s}/>',
    # ножницы и искорка — салон красоты
    'orgBeauty': '<circle cx="6.5" cy="17.5" r="2.8" fill="{f}" stroke="{c}" {s}/><circle cx="15.5" cy="17.5" r="2.8" fill="{f}" stroke="{c}" {s}/><path d="M8.4 15.4 15 4.5M13.6 15.4 7 4.5" fill="none" stroke="{c}" {s}/><path d="M19.5 3.2c.3 1.5.9 2.1 2.3 2.4-1.4.3-2 .9-2.3 2.4-.3-1.5-.9-2.1-2.3-2.4 1.4-.3 2-.9 2.3-2.4z" fill="{c}" stroke="{c}" stroke-width="1" stroke-linejoin="round"/>',
    # цветок лотоса — студии танца, спорта и йоги (12.10.2026, 10:55 по просьбе Ирины «сделай другой дизайн»; до этого — танцовщица)
    'orgStudio': '<path d="M12 4c2 2.3 2.9 4.8 2.9 7.3S13.9 16 12 17.5c-1.9-1.5-2.9-3.7-2.9-6.2S10 6.3 12 4z" fill="{f}" stroke="{c}" {s}/><path d="M9.3 9.4C7 8.6 4.6 8.8 2.8 9.7c.6 3.8 3.6 7 9.2 7.8M14.7 9.4c2.3-.8 4.7-.6 6.5.3-.6 3.8-3.6 7-9.2 7.8" fill="#fff" stroke="{c}" {s}/><path d="M4 20.2c2.6-1.4 5.3-2 8-2s5.4.6 8 2" fill="none" stroke="{c}" {s}/>',
    # молоток и отвёртка крест-накрест — мастерские и сервисы (12.10.2026, 10:55 по просьбе Ирины; до этого — гаечный ключ)
    'orgServices': '<path d="M14.5 9.5 4.7 19.3a1.5 1.5 0 0 0 2.1 2.1l9.8-9.8" fill="{f}" stroke="{c}" {s}/><path d="M12.4 6.2l3.3-3.3 5.4 5.4-3.3 3.3z" fill="#fff" stroke="{c}" {s}/><path d="M9.6 9.6 4.2 4.2M11 11l2 2" fill="none" stroke="{c}" {s}/><path d="M13.7 13.7l5.7 5.7a1.5 1.5 0 0 1-2.1 2.1l-5.7-5.7z" fill="{f}" stroke="{c}" {s}/><path d="M3.2 3.2l1.6-.6.6 1.6" fill="none" stroke="{c}" stroke-width="1.4"/>',
    # грузовик с посылкой — перевозки
    'orgTransport': '<path d="M2.5 6.5h11v10h-11z" fill="{f}" stroke="{c}" {s}/><path d="M13.5 9.5h4l3 3.4v3.6h-7z" fill="#fff" stroke="{c}" {s}/><path d="M6.2 6.5v3.4h3.6V6.5" fill="none" stroke="{c}" {s}/><circle cx="6.5" cy="17.2" r="2" fill="{c}"/><circle cx="16.8" cy="17.2" r="2" fill="{c}"/>',
    # здание бюро
    'orgOffice': '<rect x="4" y="3.5" width="10" height="17" rx="1" fill="{f}" stroke="{c}" {s}/><path d="M14 9h5a1 1 0 0 1 1 1v10.5h-6" fill="#fff" stroke="{c}" {s}/><path d="M2.5 20.5h19M7 7h1.5M9.8 7h1.5M7 10.5h1.5M9.8 10.5h1.5M7 14h1.5M9.8 14h1.5M16.5 12.5h1M16.5 15.5h1M8 20.5v-3h2.2v3" fill="none" stroke="{c}" {s}/>',
}

# ---------------------------------------------------------------------------
names = [s[0] for d in DIRS for s in d[5]]
dup = {n for n in names if names.count(n) > 1}
assert not dup, f'названия категорий повторяются: {dup}'
assert {g for g, _ in GROUPS} == {d[2] for d in DIRS}
assert all(d[4] in ICONS for d in DIRS), 'у направления нет значка'
assert len({d[4] for d in DIRS}) == len(DIRS), 'значки направлений повторяются'
FOOD = [d[0] for d in DIRS if d[0] in ('food', 'catering', 'shop')]   # у акций и событий еды — «Кроме спиртных напитков»

def js_str(s): return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

def help_dir():
    """подсказка «?» у поля «Направление» в заявке организации: все группы и направления"""
    out = []
    for g, gt in GROUPS:
        ds = [d for d in DIRS if d[2] == g]
        out.append(f'<p><b>{esc(gt)}</b>: ' + ', '.join(esc(d[1]) for d in ds) + '.</p>')
    out.append('<p>Выберите главное направление, по желанию второе, и до трёх категорий. По ним люди находят вас в подборе. «Для кого» (статус S, дети, женщины) отмечается отдельно.</p>')
    return ''.join(out)

def orgdirs_js():
    L = ['/* Направления и категории «Организаций» — собирается _i18n/kategorii_org.py, руками не править (решение Ирины 12.10.2026). */',
         'window.SVL_ORG_GROUPS = { ' + ', '.join(f'{g}: {js_str(t)}' for g, t in GROUPS) + ' };',
         'window.SVL_ORG_DIRS = {']
    for key, t, g, c, i, cats in DIRS:
        s = ', '.join(js_str(x[0]) for x in cats)
        w = ', '.join(js_str(x[1]) for x in cats)
        L.append(f"  {key}: {{ t: {js_str(t)}, g: '{g}', c: '{c}', i: '{i}', s: [{s}], w: [{w}] }},")
    L[-1] = L[-1].rstrip(',')
    L.append('};')
    chk = {x[0]: x[2] for d in DIRS for x in d[5] if x[2]}
    L.append('window.SVL_ORG_CHECK = ' + json.dumps(chk, ensure_ascii=False) + ';   // что проверяем при размещении')
    L.append('window.SVL_ORG_FOOD = ' + json.dumps(FOOD) + ';')
    L.append('window.SVL_ORG_HELP_DIR = ' + js_str(help_dir()) + ';')
    L.append('window.SVL_ORG_ICONS = {')
    for k, v in ICONS.items():
        body = v.replace('`', '').replace('{c}', '${c}').replace('{f}', '${f}').replace('{s}', '${s}')
        L.append(f'  {k}: (c, f, s) => `{body}`,')
    L[-1] = L[-1].rstrip(',')
    L.append('};')
    return '\n'.join(L) + '\n'

def badge_line():
    return 'const DIRS = { ' + ', '.join(f"{k}: {{ t: {js_str(t)}, c: '{c}' }}" for k, t, g, c, i, s in DIRS) + ' };   // направления организаций — _i18n/kategorii_org.py'

def put(path, old_re, new, count=1):
    p = os.path.join(ROOT, path); s = open(p, encoding='utf-8').read()
    s2, n = re.subn(old_re, lambda m: new, s, count=count, flags=re.S)
    if not n: raise SystemExit(f'{path}: не найдено место для замены: {old_re[:60]}')
    if s2 != s: open(p, 'w', encoding='utf-8').write(s2)
    return s2 != s

if __name__ == '__main__':
    p = os.path.join(ROOT, '_i18n', 'organizacii_src', 'orgdirs.js')
    new = orgdirs_js(); old = open(p, encoding='utf-8').read() if os.path.exists(p) else ''
    if new != old: open(p, 'w', encoding='utf-8').write(new)
    ch = [('orgdirs.js', new != old)]
    ch.append(('badge', put('badge/index.html', r'const DIRS = \{.*?\};[^\n]*', badge_line())))
    for f in ('events/index.html', 'akcii/index.html'):
        s = open(os.path.join(ROOT, f), encoding='utf-8').read()
        if 'const ORG_FOOD = ' not in s:
            s = s.replace("  const isFood = r => !!r && (r.t === 'org' ? r.dir === 'food' :", "  const isFood = r => !!r && (r.t === 'org' ? ORG_FOOD.includes(r.dir) :", 1)
            s = s.replace("  const isFood = r =>", "  const ORG_FOOD = " + json.dumps(FOOD) + ";   // направления еды организаций — _i18n/kategorii_org.py\n  const isFood = r =>", 1)
            open(os.path.join(ROOT, f), 'w', encoding='utf-8').write(s); ch.append((f, True))
        else:
            ch.append((f, put(f, r'const ORG_FOOD = \[[^\]]*\];', 'const ORG_FOOD = ' + json.dumps(FOOD) + ';')))
    print(f'направлений {len(DIRS)}, категорий {len(names)}, групп {len(GROUPS)}; изменено:', ', '.join(n for n, c in ch if c) or 'ничего')
