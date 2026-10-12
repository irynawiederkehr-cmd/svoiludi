"""НАПРАВЛЕНИЯ И КАТЕГОРИИ СПРАВОЧНИКА — один источник для всего сайта (решение Ирины 11.10.2026, документ проекта «kategorii-spravochnika.md»).
Правила: направление — вид помощи, а не аудитория («для кого» — пометки-фильтры TAGS на главной); регулируемое и свободное — в разных
категориях; у каждой категории немецкое слово (для поиска) и строка «что проверяем» при размещении; люди — в справочнике, организации — в «Организациях».
Названия категорий уникальны на весь справочник: по названию понятно, к какому направлению относится категория.

Запуск из корня: python3 _i18n/kategorii.py — переписывает список во всех местах:
  index.html (CATS, GROUPS), opros/index.html (CATS), join/index.html (CATS, PROVERKA), join/files/anketa.docx (раздел 2),
  _i18n/vakansii_src/vak_script_head.js и vak_body.html + vakansii/index.html (названия и список направлений), _i18n/pochta/zapis.py (CATS).
Потом: shveycariya_src/build.py, struktura_src/build.py, struktura_src/nav.py, pwa.py, sync.py (UA, анкета UA), build_search.py.
Карточкам (data/specialists.js) направление и категории ставит Claude по таблице переноса в документе проекта."""
import os, re, json, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

GROUPS = [
    ('docs', 'Документы, право и деньги'),
    ('zdorovye', 'Здоровье и душевное состояние'),
    ('semya', 'Семья, близкие и животные'),
    ('ucheba', 'Учёба, работа и своё дело'),
    ('zhizn', 'Дом и повседневная жизнь'),
]

# (ключ, название, группа, цвет, значок, [(категория, немецкое слово, что проверяем при размещении — '' если ничего)])
DIRS = [
    ('status', 'Документы, переводы и ведомства', 'docs', '#3F6FBF', 'dirStatus', [
        ('Письма и формы', 'Briefe, Formulare', ''),
        ('Пермит: заявления и продление', 'Aufenthaltsbewilligung', ''),
        ('Подготовка к натурализации', 'Einbürgerung', ''),
        ('Социальные пособия и соцконсультация', 'Sozialberatung', ''),
        ('Письменный перевод', 'Übersetzung', ''),
        ('Заверенный перевод и апостиль', 'beglaubigte Übersetzung, Apostille', 'кто заверяет перевод — по правилам кантона'),
        ('Устный перевод: врач, ведомство, суд', 'Dolmetschen', 'для суда — список переводчиков суда кантона'),
    ]),
    ('law', 'Юристы и нотариусы', 'docs', '#4F6D7A', 'dirLaw', [
        ('Миграционное право', 'Migrationsrecht', 'адвокат'),
        ('Семья и развод', 'Familienrecht, Scheidung', 'адвокат'),
        ('Трудовое право', 'Arbeitsrecht', 'адвокат'),
        ('Аренда и жильё', 'Mietrecht', 'адвокат'),
        ('Наследство и завещание', 'Erbrecht, Testament', 'адвокат'),
        ('Договоры и права потребителей', 'Vertragsrecht, Konsumentenrecht', 'адвокат'),
        ('Взыскание долгов и Betreibung', 'Betreibungsrecht, SchKG', 'адвокат'),
        ('Штрафы и уголовные дела', 'Strafrecht, Strafbefehl', 'адвокат'),
        ('Право для фирм', 'Gesellschaftsrecht', 'адвокат'),
        ('Право Украины и других стран', 'ausländisches Recht', 'диплом и допуск в своей стране'),
        ('Нотариус', 'Notar, Notariat', 'реестр нотариусов кантона'),
    ]),
    ('money', 'Налоги, бухгалтерия и деньги', 'docs', '#C97E52', 'dirMoney', [
        ('Налоговая декларация', 'Steuererklärung', ''),
        ('Бухгалтерия и Treuhand', 'Buchhaltung, Treuhand', ''),
        ('Зарплата и взносы для работодателей', 'Lohnbuchhaltung', ''),
        ('Финансовое планирование и инвестиции', 'Finanzplanung, Anlageberatung', 'советы по финансовым продуктам — реестр консультантов (FIDLEG)'),
        ('Ипотека и покупка жилья', 'Hypothek', ''),
        ('Бюджет и долги', 'Budgetberatung, Schuldenberatung', ''),
    ]),
    ('insure', 'Страхование и пенсия', 'docs', '#A99A2E', 'dirInsure', [
        ('Страховой брокер', 'Versicherungsbroker', 'независимый посредник — реестр FINMA'),
        ('Медстраховка: выбор и смена кассы', 'Krankenkasse wechseln', 'независимый посредник — реестр FINMA'),
        ('Пенсия: AHV, BVG и 3a', 'Vorsorge, Säule 3a', 'независимый посредник — реестр FINMA'),
        ('Страхование для своего дела', 'Betriebsversicherung', 'независимый посредник — реестр FINMA'),
    ]),
    ('health', 'Врачи и медицина', 'zdorovye', '#C25468', 'dirHealth', [
        ('Семейный врач', 'Hausarzt', 'MedReg и разрешение кантона'),
        ('Педиатр', 'Kinderarzt', 'MedReg и разрешение кантона'),
        ('Гинеколог', 'Frauenarzt, Gynäkologie', 'MedReg и разрешение кантона'),
        ('Стоматолог и гигиена полости рта', 'Zahnarzt, Dentalhygiene', 'MedReg и разрешение кантона'),
        ('Другие врачи-специалисты', 'Facharzt', 'MedReg и разрешение кантона'),
        ('Акушерка', 'Hebamme', 'GesReg и разрешение кантона'),
        ('Физиотерапия', 'Physiotherapie', 'GesReg и разрешение кантона'),
        ('Эрготерапия', 'Ergotherapie', 'GesReg и разрешение кантона'),
        ('Остеопатия', 'Osteopathie', 'GesReg и разрешение кантона'),
        ('Диетолог', 'Ernährungsberatung', 'GesReg и разрешение кантона'),
        ('Оптометрист', 'Optometrie', 'GesReg и разрешение кантона'),
        ('Логопед — дети и взрослые', 'Logopädie', 'признанный диплом, разрешение кантона'),
        ('Медицинский массаж', 'medizinische Massage', 'разрешение кантона'),
    ]),
    ('alt', 'Комплементарная медицина', 'zdorovye', '#6B8E3E', 'dirAlt', [
        ('Натуропатия', 'Naturheilpraktik', 'разрешение кантона, где оно нужно'),
        ('Китайская медицина и акупунктура', 'TCM, Akupunktur', 'разрешение кантона, где оно нужно'),
        ('Кинезиология', 'Kinesiologie', ''),
        ('Гомеопатия', 'Homöopathie', 'разрешение кантона, где оно нужно'),
        ('Терапии по методам EMR и ASCA', 'Shiatsu, Reflexzonentherapie', ''),
    ]),
    ('psy', 'Психологическая помощь', 'zdorovye', '#6A5FB8', 'dirPsy', [
        ('Психотерапевт', 'Psychotherapie', 'PsyReg и разрешение кантона'),
        ('Психиатр', 'Psychiater', 'MedReg и разрешение кантона'),
        ('Психолог', 'Psychologe', 'признанный диплом, PsyReg'),
        ('Детский и подростковый психолог или психотерапевт', 'Kinder- und Jugendpsychologie', 'признанный диплом, PsyReg'),
        ('Парная и семейная психотерапия', 'Paartherapie, Familientherapie', 'PsyReg и разрешение кантона'),
    ]),
    ('coach', 'Коучинг, консультирование и медиация', 'zdorovye', '#8E5A86', 'dirCoach', [
        ('Коуч', 'Coaching', ''),
        ('Консультант по адаптации и интеграции', 'Integrationsberatung', ''),
        ('Консультации для пар и семей, без терапии', 'Paarberatung, Familienberatung', ''),
        ('Медиатор', 'Mediation', ''),
        ('Ментор для специалистов и руководителей', 'Mentoring', ''),
    ]),
    ('kids', 'Дети: уход и учёба', 'semya', '#B5648E', 'dirKids', [
        ('Няня', 'Nanny, Kinderbetreuung', ''),
        ('Дневная мама', 'Tagesmutter, Tagesfamilie', 'сообщение о себе в кантоне, в части кантонов разрешение'),
        ('Репетитор по школьным предметам', 'Nachhilfe', ''),
        ('Подготовка к гимназии и экзаменам', 'Gymiprüfung', ''),
    ]),
    ('care', 'Уход за пожилыми и близкими', 'semya', '#B5735A', 'dirCare', [
        ('Помощь пожилым дома и компания', 'Seniorenbetreuung', ''),
        ('Помощница с проживанием', '24-Stunden-Betreuung', ''),
        ('Медицинский уход на дому', 'Spitex, Pflege', 'GesReg и разрешение кантона'),
        ('Ассистент для людей с инвалидностью', 'Assistenz', ''),
    ]),
    ('pets', 'Животные', 'semya', '#8A6A45', 'dirPets', [
        ('Ветеринар', 'Tierarzt', 'MedReg и разрешение кантона'),
        ('Передержка и выгул', 'Tierbetreuung, Hundesitter', 'больше 5 животных в сутки — разрешение ветеринарной службы кантона'),
        ('Груминг', 'Hundecoiffeur', ''),
        ('Дрессировка собак', 'Hundetraining', ''),
    ]),
    ('learn', 'Языки', 'ucheba', '#2894A0', 'dirLearn', [
        ('Немецкий язык', 'Deutsch', ''),
        ('Швейцарский немецкий', 'Schweizerdeutsch', ''),
        ('Французский язык', 'Französisch', ''),
        ('Итальянский язык', 'Italienisch', ''),
        ('Английский язык', 'Englisch', ''),
        ('Подготовка к fide и языковым экзаменам', 'fide, telc, Goethe', '«преподаватель fide» — только с сертификатом fide'),
        ('Русская школа и билингвизм', 'Bilingualität', ''),
    ]),
    ('work', 'Работа и карьера', 'ucheba', '#1F7A8C', 'dirWork', [
        ('Резюме и собеседование', 'Bewerbung, Lebenslauf', ''),
        ('Карьерный консультант', 'Laufbahnberatung', ''),
        ('Поступление в университет и бизнес-школу', 'Studium, Hochschulzulassung, MBA', ''),
        ('Признание дипломов', 'Diplomanerkennung', ''),
        ('Переквалификация и профессиональные курсы', 'Weiterbildung, Umschulung', ''),
    ]),
    ('biz', 'Своё дело и услуги для бизнеса', 'ucheba', '#4C6A9A', 'dirBiz', [
        ('Открытие своего дела и фирмы', 'Gründungsberatung', ''),
        ('Сайты и IT', 'Webdesign, IT', ''),
        ('Маркетинг и соцсети', 'Marketing, Social Media', ''),
        ('Дизайн и печать', 'Grafikdesign, Druck', ''),
    ]),
    ('home', 'Жильё, ремонт и быт', 'zhizn', '#8E8470', 'dirHome', [
        ('Риелтор: покупка и продажа', 'Immobilienmakler', ''),
        ('Поиск квартиры и релокация', 'Wohnungssuche, Relocation', ''),
        ('Переезд и грузчики', 'Umzug', ''),
        ('Международный переезд и таможня', 'internationaler Umzug, Zoll', ''),
        ('Уборка со сдачей квартиры', 'Endreinigung mit Abgabegarantie', ''),
        ('Уборка и помощь по дому', 'Reinigung, Haushaltshilfe', ''),
        ('Ремонт и отделка', 'Renovation, Malerarbeiten', ''),
        ('Мастер на час и сборка мебели', 'Handwerker, Möbelmontage', ''),
        ('Электрик', 'Elektroinstallation', 'разрешение ESTI'),
        ('Сантехник', 'Sanitär', ''),
        ('Сад и озеленение', 'Gartenpflege', ''),
        ('Швея, ремонт одежды и обуви', 'Änderungsschneiderei', ''),
        ('Компьютер, телефон и интернет дома', 'Computerhilfe', ''),
    ]),
    ('auto', 'Авто и транспорт', 'zhizn', '#5C6670', 'dirAuto', [
        ('Автошкола', 'Fahrschule', 'разрешение инструктора'),
        ('Автосервис и шины', 'Autogarage, Reifen', ''),
        ('Такси и трансфер', 'Taxi, Transfer', 'запись BPT 121 в правах, в части кантонов регистрация'),
        ('Курьер, перевозки и посылки в Украину', 'Kurier, Transport', ''),
    ]),
    ('body', 'Красота и уход за собой', 'zhizn', '#4E9A70', 'dirBody', [
        ('Косметолог', 'Kosmetik', 'лазер, IPL, криолиполиз — сертификат; инъекции — только врач'),
        ('Маникюр и педикюр', 'Nageldesign, Fusspflege', ''),
        ('Парикмахер и барбер', 'Coiffeur, Barbier', ''),
        ('Брови и ресницы', 'Augenbrauen, Wimpern', ''),
        ('Визажист', 'Make-up', ''),
        ('Перманентный макияж и тату', 'Permanent Make-up, Tattoo', 'регистрация в кантональной службе'),
        ('Удаление волос и лазер', 'Haarentfernung', 'лазер и IPL — сертификат'),
        ('Массаж для отдыха', 'Wellnessmassage', 'без медицинских обещаний'),
    ]),
    ('sport', 'Спорт, музыка и творчество', 'zhizn', '#D08A2E', 'dirSport', [
        ('Фитнес и персональный тренер', 'Personal Training', ''),
        ('Йога и пилатес', 'Yoga, Pilates', ''),
        ('Танцы', 'Tanz', ''),
        ('Тренер по спорту', 'Sporttraining, Schwimmen', ''),
        ('Музыка и вокал', 'Musikunterricht', ''),
        ('Рисование и творчество', 'Kunst, Gestalten', ''),
        ('Авторские изделия и хендмейд', 'Kunsthandwerk, Handmade', ''),   # 12.10.2026: декор, керамика, украшения, текстиль ручной работы (Алёна SG-0021)
        ('Шахматы и развивающие занятия', 'Schach', ''),
    ]),
    ('events', 'Праздники и события', 'zhizn', '#C0663A', 'dirEvents', [
        ('Фотограф и видеограф', 'Fotograf, Videograf', ''),
        ('Организация праздников и свадеб', 'Eventplanung, Hochzeit', ''),
        ('Ведущий, музыканты и DJ', 'Moderation, DJ', ''),
        ('Детские праздники и аниматоры', 'Kinderanimation', ''),
        ('Декор и флорист', 'Dekoration, Floristik', ''),
        ('Экскурсии и гиды', 'Stadtführung', ''),
    ]),
    ('food', 'Еда на заказ', 'zhizn', '#A84E3C', 'dirFood', [
        ('Торты и десерты', 'Torten', 'регистрация в кантональной службе контроля продуктов'),
        ('Кейтеринг', 'Catering', 'регистрация в кантональной службе контроля продуктов'),
        ('Домашняя кухня на заказ', 'hausgemachtes Essen', 'регистрация в кантональной службе контроля продуктов'),
    ]),
]

# что значат короткие пометки «что проверяем»
CHECK_TEXT = {
    'адвокат': 'слово «адвокат» в карточке — только при записи в реестре адвокатов кантона; без неё — «юридическая консультация»',
}

# подсказка в анкете «Как разместиться»: какой документ приложить к регулируемой категории (по-русски для специалиста, на «вы»)
def need_doc(check):
    return CHECK_TEXT.get(check, check)

# ---------------------------------------------------------------------------
names = [s[0] for d in DIRS for s in d[5]]
dup = {n for n in names if names.count(n) > 1}
assert not dup, f'названия категорий повторяются: {dup}'
assert {g for g, _ in GROUPS} == {d[2] for d in DIRS}

def js_str(s): return "'" + s.replace("\\", "\\\\").replace("'", "\\'") + "'"

def cats_block():
    """блок const CATS = {…}; для index.html и opros/index.html (формат строк читают shveycariya_src/build.py, struktura_src/build.py, pages.py)"""
    w = max(len(js_str(d[1])) for d in DIRS) + 1
    lines = ['const CATS = {   // направление → название, группа, цвет, значок, категории (s) и их немецкие слова для поиска (w). Собирается _i18n/kategorii.py — правь там (11.10.2026)']
    for key, t, g, c, i, specs in DIRS:
        s = ', '.join(js_str(x[0]) for x in specs)
        de = ', '.join(js_str(x[1]) for x in specs)
        lines.append(f"  {key + ':':7} {{ t: {js_str(t) + ',':{w}} g: '{g}', c: '{c}', i: '{i}', s: [{s}], w: [{de}] }},")
    lines[-1] = lines[-1].rstrip(',')
    return '\n'.join(lines) + '\n};'

def groups_line():
    return 'const GROUPS = { ' + ', '.join(f"{g}: {js_str(t)}" for g, t in GROUPS) + ' };   // группы направлений в списке «Направление» (11.10.2026)'

def proverka_line():
    d = {s[0]: need_doc(s[2]) for dd in DIRS for s in dd[5] if s[2]}
    return 'const PROVERKA = ' + json.dumps(d, ensure_ascii=False) + ';   // что проверяем при размещении (регулируемые категории), _i18n/kategorii.py'

def put(path, old_re, new, flags=re.S, count=1):
    p = os.path.join(ROOT, path)
    s = open(p, encoding='utf-8').read()
    s2, n = re.subn(old_re, lambda m: new, s, count=count, flags=flags)
    if not n: raise SystemExit(f'{path}: не найдено место для замены: {old_re[:60]}')
    if s2 != s: open(p, 'w', encoding='utf-8').write(s2)
    return s2 != s

def ensure_line(path, name, line, after_rx):
    """строку const NAME = … заменить, а если её нет — вставить после after_rx"""
    p = os.path.join(ROOT, path); s = open(p, encoding='utf-8').read()
    if f'const {name} = ' in s:
        return put(path, rf'const {name} = .*?\n', line + '\n')
    m = re.search(after_rx, s, re.S)
    if not m: raise SystemExit(f'{path}: не найдено место для {name}')
    open(p, 'w', encoding='utf-8').write(s[:m.end()] + line + '\n' + s[m.end():])
    return True

def write_index():
    ch = put('index.html', r'const CATS = \{.*?\n\};', cats_block())
    ch |= ensure_line('index.html', 'GROUPS', groups_line(), r'const CATS = \{.*?\n\};\n')
    return ch

def write_opros():
    return put('opros/index.html', r'const CATS = \{.*?\n\};', cats_block())

def write_join():
    arr = [{'t': t, 'g': g, 's': [x[0] for x in specs]} for _, t, g, _, _, specs in DIRS]
    ch = put('join/index.html', r'const CATS = \[.*?\];\n', 'const CATS = ' + json.dumps(arr, ensure_ascii=False) + ';\n')
    ch |= ensure_line('join/index.html', 'GROUPS', groups_line(), r'const CATS = \[.*?\];\n')
    ch |= ensure_line('join/index.html', 'PROVERKA', proverka_line(), r'const GROUPS = .*?\n')
    return ch

def vak_map():
    body = ',\n  '.join(', '.join(f'{k}: {js_str(t)}' for k, t, *_ in DIRS[i:i + 4]) for i in range(0, len(DIRS), 4))
    return 'const CATS = {\n  ' + body + '\n};'

def vak_options():
    out = '<option value="">Выбери направление</option>'
    for g, gt in GROUPS:
        out += f'<optgroup label="{gt}">' + ''.join(f'<option value="{k}">{t}</option>' for k, t, gg, *_ in DIRS if gg == g) + '</optgroup>'
    return out

def write_vak():
    ch = False
    for f in ('_i18n/vakansii_src/vak_script_head.js', 'vakansii/index.html'):
        ch |= put(f, r"const CATS = \{\n  status: '.*?\n\};", vak_map())
    for f in ('_i18n/vakansii_src/vak_body.html', 'vakansii/index.html'):
        ch |= _sub(f, r'(<select id="z-v-cat"[^>]*>)<option value="">Выбери направление</option>.*?(</select>)', lambda m: m.group(1) + vak_options() + m.group(2))
    return ch

def _sub(path, rx, fn):
    p = os.path.join(ROOT, path); s = open(p, encoding='utf-8').read()
    s2, n = re.subn(rx, fn, s, count=1, flags=re.S)
    if not n: raise SystemExit(f'{path}: не найдено {rx[:50]}')
    if s2 != s: open(p, 'w', encoding='utf-8').write(s2)
    return s2 != s

def write_zapis():
    items = ', '.join(f'{js_str(t)}: {js_str(k)}' for k, t, *_ in DIRS)
    return put('_i18n/pochta/zapis.py', r"CATS = both\(\{.*?\}\)\n", 'CATS = both({' + items + '})\n')

# --- анкета Word, раздел 2: список «Главное направление» и галочки специализаций по направлениям ---
# анкета Word, раздел 2: те же слова, что в форме «Как разместиться» (до трёх категорий, второе направление)
ANKETA_TEXTS = [
    ('2. Направление и специализации', '2. Направление и категории'),
    ('Главное направление определяет, где карточка стоит в первую очередь. Специализации отметьте все подходящие — можно несколько и из разных направлений: по ним вас находят в поиске.',
     'Главное направление определяет, где карточка стоит в первую очередь. Второе направление — по желанию, если вы работаете и в нём. Отметьте до трёх категорий из главного и второго направления: по ним вас находят в поиске и в подборе. Если категория регулируется (врач, психолог, адвокат, электрик и другие), впишите номер разрешения или записи в реестре в разделе 6 — мы его проверяем.'),
    ('Нет подходящей специализации? Напишите её: ', 'Нет подходящей категории? Напишите её: '),
    ('<w:alias w:val="Другая специализация"/>', '<w:alias w:val="Другая категория"/>'),
]

# анкета Word: устаревшие подписи и тексты о данных — как в политике конфиденциальности svoiludi.ch (раздел 6)
ANKETA_FIXES = [
    ('Анкета и заявка специалиста · справочник Swiss Guide', 'Анкета и заявка специалиста · справочник «Свои люди» · svoiludi.ch'),
    ('Instagram @iryna.voznesenskaya  ·  Telegram @IrynaNeuroCoach_channel', 'Свои люди в Швейцарии  ·  https://svoiludi.ch/  ·  voznesenskaya.iryna@gmail.com'),
    ('За данные отвечает владелец справочника, указанный в Impressum на сайте https://svoiludi.ch/; связь по всем вопросам о данных — ',
     'За данные отвечает Alonira.ch AG, Poststrasse 6, 6302 Zug — владелец справочника; связь по всем вопросам о данных — '),
    ('Документы и анкета хранятся, пока действует размещение, и удаляются через 12 месяцев после его окончания; счета мы обязаны хранить 10 лет.',
     'Анкету, фото и запись о согласии мы храним, пока карточка опубликована, и не дольше трёх лет после её снятия: в течение этого срока по закону можно заявить претензию. Документы, которые нужны только для проверки (копии дипломов и разрешений), удаляем через 12 месяцев после снятия карточки. Счета мы обязаны хранить 10 лет.'),
]

def write_anketa():
    path = os.path.join(ROOT, 'join/files/anketa.docx')
    z = zipfile.ZipFile(path); parts = {n: z.read(n) for n in z.namelist()}; infos = z.infolist(); z.close()
    orig = dict(parts)
    # старые подписи шапки и подвала (11.10.2026): справочник нейтральный — без коучинговых каналов
    for n in parts:
        if re.match(r'word/(footer|header)\d*\.xml$', n):
            t = parts[n].decode('utf-8')
            for a, b in ANKETA_FIXES: t = t.replace(a, b)
            parts[n] = t.encode('utf-8')
    x = parts['word/document.xml'].decode('utf-8')
    for a, b in ANKETA_FIXES:
        x = x.replace(a, b)
    # 0) слово «категории» вместо «специализации» (11.10.2026) — как в форме на странице «Как разместиться»
    for a, b in ANKETA_TEXTS:
        x = x.replace(a, b)
    # 0б) строка «Второе направление» сразу под «Главное направление» (копия строки, своё поле d2)
    if '<w:alias w:val="Второе направление"/>' not in x:
        a = x.find('<w:alias w:val="Главное направление"/>')
        rs = x.rfind('<w:tr>', 0, a); re_ = x.find('</w:tr>', a) + 7
        assert rs > 0 and re_ > 7, 'анкета: нет строки «Главное направление»'
        row = x[rs:re_]
        nid = max(int(v) for v in re.findall(r'<w:id w:val="(\d+)"/>', x)) + 1
        row2 = (row.replace('>Главное направление<', '>Второе направление<', 1)
                   .replace('<w:alias w:val="Главное направление"/>', '<w:alias w:val="Второе направление"/>')
                   .replace('<w:tag w:val="d1"/>', '<w:tag w:val="d%d"/>' % (max(int(v) for v in re.findall(r'<w:tag w:val="d(\d+)"/>', x)) + 1))
                   .replace('>выберите из списка<', '>по желанию, если работаете и в нём<', 1))
        row2 = re.sub(r'<w:id w:val="\d+"/>', f'<w:id w:val="{nid}"/>', row2, count=1)
        assert row2.count('Второе направление') == 2 and 'w:val="d1"' not in row2, 'анкета: строка второго направления'
        x = x[:re_] + row2 + x[re_:]
    # 1) выпадающие списки направлений
    items = '<w:listItem w:displayText="Выберите из списка" w:value=""/>' + ''.join(f'<w:listItem w:displayText="{t}" w:value="{t}"/>' for _, t, *_ in DIRS)
    for alias in ('Главное направление', 'Второе направление'):
        x2, n = re.subn(r'(<w:alias w:val="' + alias + r'"/>.*?<w:dropDownList>).*?(</w:dropDownList>)', lambda m: m.group(1) + items + m.group(2), x, count=1, flags=re.S)
        assert n, 'анкета: нет списка «' + alias + '»'
        x = x2
    # примеры регулируемых профессий в разделе 6: ясли теперь в «Организациях»
    x = x.replace('электрик, ветеринар, ясли и др.', 'электрик, ветеринар, дневная мама, тату и перманент и др.')
    # 2) таблица галочек: строка = [ячейка «направление»][ячейка с галочками категорий].
    #    Первая строка — образец, остальные пересобираем целыми строками <w:tr> (11.10.2026: раньше абзацы
    #    вынимались из ячеек — таблица ломалась и Word не открывал файл; теперь проверяем XML перед записью).
    def text(p): return ''.join(re.findall(r'<w:t[^>]*>([^<]*)</w:t>', p)).replace('\xa0', ' ').strip()
    def labels(p): return [t.strip() for t in text(p).split('☐') if t.strip()]
    m_end = re.search(r'<w:p(?: [^>]*)?>(?:(?!<w:p[ >]).)*?Нет подходящей (?:специализации|категории)', x, re.S)
    assert m_end, 'анкета: нет строки «Нет подходящей категории»'
    tb_s = x.rfind('<w:tbl>', 0, m_end.start()); tb_e = x.rfind('</w:tbl>', 0, m_end.start()) + 8
    assert tb_s > 0 and tb_e > tb_s, 'анкета: таблица галочек не найдена или повреждена'
    tbl = x[tb_s:tb_e]
    rows = re.findall(r'<w:tr(?: [^>]*)?>.*?</w:tr>', tbl, re.S)
    def cells(r): return re.findall(r'<w:tc>.*?</w:tc>', r, re.S)
    assert rows and all(len(cells(r)) == 2 for r in rows), 'анкета: в таблице галочек не по две ячейки'
    cur = [(text(cells(r)[0]), labels(cells(r)[1])) for r in rows]
    want = [(t, [s[0] for s in specs]) for _, t, _, _, _, specs in DIRS]
    if cur != want:   # те же направления и подписи — строки не трогаем, чтобы номера полей не менялись
        row_tpl = rows[0]; tc1, tc2 = cells(row_tpl)
        box_p = re.search(r'<w:p(?: [^>]*)?>(?:(?!<w:p[ >]).)*?</w:p>', tc2, re.S).group(0)
        # части абзаца с галочками: [начало абзаца][галочка+подпись][разделитель][галочка+подпись]…[конец]
        sdts = list(re.finditer(r'<w:sdt>.*?</w:sdt>', box_p, re.S))
        first_lbl_end = box_p.find('</w:r>', sdts[0].end()) + 6
        item_tpl = box_p[sdts[0].start():first_lbl_end]
        sep = box_p[first_lbl_end:sdts[1].start()]
        p_open = box_p[:sdts[0].start()]
        tail_after_last = box_p[box_p.find('</w:r>', sdts[-1].end()) + 6:]
        assert re.findall(r'<w:t[^>]*>([^<]*)</w:t>', item_tpl)[-1].startswith('\xa0'), 'анкета: неожиданный вид галочки'
        nid = [max(int(v) for v in re.findall(r'<w:id w:val="(\d+)"/>', x)) + 1]
        tag_n = [max(int(v) for v in re.findall(r'<w:tag w:val="cb(\d+)"/>', x)) + 1]
        def item(label):
            t = re.sub(r'<w:id w:val="\d+"/>', f'<w:id w:val="{nid[0]}"/>', item_tpl, count=1); nid[0] += 1
            t = re.sub(r'<w:tag w:val="cb\d+"/>', f'<w:tag w:val="cb{tag_n[0]}"/>', t, count=1); tag_n[0] += 1
            t = re.sub(r'(<w:t[^>]*>)\xa0[^<]*(</w:t>)(?![\s\S]*<w:t)', lambda m: m.group(1) + '\xa0' + label.replace(' ', '\xa0') + m.group(2), t)
            return t
        head_txt = text(tc1)
        new_rows = ''
        for _, t, _, _, _, specs in DIRS:
            box = p_open + sep.join(item(s_[0]) for s_ in specs) + tail_after_last
            new_rows += row_tpl.replace(tc1, tc1.replace('>' + head_txt + '<', '>' + t + '<', 1), 1).replace(box_p, box, 1)
        r_s = tbl.find(rows[0]); r_e = tbl.rfind(rows[-1]) + len(rows[-1])
        x = x[:tb_s] + tbl[:r_s] + new_rows + tbl[r_e:] + x[tb_e:]
    # Word не открывает файл с ошибкой в XML — проверяем до записи, а номера полей должны быть разными
    from xml.dom import minidom
    minidom.parseString(x.encode('utf-8'))
    ids = re.findall(r'<w:id w:val="(\d+)"/>', x); tags = re.findall(r'<w:tag w:val="([^"]+)"/>', x)
    assert len(ids) == len(set(ids)) and len(tags) == len(set(tags)), 'анкета: повторяются номера полей'
    parts['word/document.xml'] = x.encode('utf-8')
    if parts == orig: return False
    with zipfile.ZipFile(path, 'w', zipfile.ZIP_DEFLATED) as zo:
        for info in infos: zo.writestr(info, parts[info.filename])
    return True

if __name__ == '__main__':
    done = []
    for name, fn in (('index.html', write_index), ('opros', write_opros), ('join', write_join), ('вакансии', write_vak), ('zapis.py', write_zapis), ('анкета Word', write_anketa)):
        if fn(): done.append(name)
    print('категории:', len(DIRS), 'направлений,', len(names), 'категорий; обновлено:', ', '.join(done) or 'ничего')
