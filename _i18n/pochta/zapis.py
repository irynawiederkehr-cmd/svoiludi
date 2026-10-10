#!/usr/bin/env python3
"""Заявка с сайта (событие, курс, объявление) → черновик записи на подтверждение (10.10.2026, новые формы — 10.10.2026, 22:30).

Запуск из корня репозитория svoiludi:
  python3 -I _i18n/pochta/zapis.py <письмо.txt> [--write]
    письмо.txt — текст письма-заявки из формы events/#zayavka, kursy/#zayavka или vakansii/#zayavka (RU или UA), как пришёл в Gmail.
    Без --write только печатает черновик (JSON) — проверить глазами. С --write ставит запись первой в data/afisha.js
    или data/vacancies.js со статусом «на подтверждении» и ключом key: на сайте её не видно, ссылка предпросмотра работает.

Формы теперь почти без свободного текста (решение Ирины 10.10.2026, 22:00–22:09): адрес отдельными полями (улица, индекс, город,
кантон «Цюрих (ZH)»), даты ДД.ММ.ГГГГ (первый и последний день → date, dateEnd или repeat.until), время, повтор из списка,
цена — число («Цена, CHF») и «За что», контакты по полям (Контактное лицо, Телефон, WhatsApp, Telegram, E-mail, Instagram)
и «Как записаться» (signup: wa, tg, mail, tel, ig, link, none), галочки — списком через запятую.

Что делает:
  - находит строку «Карточка в справочнике: …» (её добавляет форма, когда человек нашёл свою карточку по UID или номеру)
    и берёт из карточки организатора/автора, кантон, адрес и координаты. Карточка должна быть АКТИВНОЙ (статус «активен»,
    срок не прошёл, у организации есть confirm) — иначе скрипт останавливается: записи неактивных карточек не размещаем;
  - контакты из заявки (contacts) показываются ВМЕСТО контактов карточки; e-mail карточки остаётся для подтверждений;
  - строки «Это моё…, за других не размещаю» и «В моей компетенции и по закону» должны быть в письме — иначе предупреждение;
  - печатает ссылку предпросмотра и e-mail, куда её отправлять: ВСЕГДА e-mail из карточки (если карточки нет — e-mail из заявки).
Черновик ОБЯЗАТЕЛЬНО проверить по правилам «kursy-svoiludi.md» и «vakansii-svoiludi.md» (цена конечная в CHF, без обещаний
лечения, компетенция, AVG, RAV и т. д.) и по списку «Исключены» в «Реестре специалистов».
Дальше: python3 _i18n/sync.py check → перевести (apply) → node _i18n/smoke.js → commit, push → черновик письма со ссылкой в Gmail.
"""
import sys, os, re, json, random, string, datetime, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TODAY = datetime.date.today()

def load(name, var):
    js = subprocess.run(['node', '-e', f"global.window={{}};require(process.argv[1]);console.log(JSON.stringify(window.{var}))", os.path.join(ROOT, 'data', name)],
                        capture_output=True, text=True, check=True).stdout
    return json.loads(js)

TM = json.load(open(os.path.join(ROOT, '_i18n', 'tm_uk.json'), encoding='utf-8'))
def both(d):
    """словарь «русская подпись → значение» дополняем украинскими подписями из памяти переводов"""
    for k in list(d): d.setdefault(TM.get(k, k), d[k])
    return d

LABELS = ['Карточка в справочнике', 'Ссылку на подтверждение прислать на',
  # событие и курс
  'Название', 'Вид события', 'Для кого', 'Возраст детей', 'Язык', 'Язык занятий', 'Как часто', 'Первый день', 'Последний день', 'Первое занятие', 'Последнее занятие',
  'Начало', 'Окончание', 'Где', 'Название места', 'Улица и дом', 'Индекс', 'Город', 'Кантон', 'Платформа', 'Вход', 'Плата', 'Цена, CHF', 'За что', 'Скидки', 'Как оплатить',
  'Как записаться', 'Мест', 'Мест в группе', 'Ссылка', 'Организатор', 'Кто ведёт', 'Кто это', 'UID, фирма или ферайн', 'UID', 'Коротко о событии', 'Коротко о курсе',
  'Направление', 'Формат', 'Встреч в курсе', 'Уровень', 'Дни недели', 'Пробное занятие', 'Что взять с собой',
  'Контактное лицо', 'Телефон', 'WhatsApp', 'Telegram', 'E-mail', 'Instagram',
  # объявление
  'Кого ищу', 'Кто нужен', 'Занятость', 'Договор', 'Начало работы', 'Дата начала', 'Опыт', 'Образование', 'Навыки', 'Другие навыки', 'Разрешение на работу',
  'Водительские права', 'Зарплата', 'Зарплата, CHF', 'Что предлагаем', 'Какое сотрудничество', 'Условия', 'Кого ищу в партнёры', 'Нужные языки', 'Местный язык на уровне',
  'Показывать с', 'Показывать до', 'О работе или сотрудничестве', 'Автор объявления', 'Как откликнуться',
  # подтверждения галочками
  'Согласие на обработку данных и публикацию', 'Это моё событие, за других не размещаю', 'Это мой курс, за других не размещаю', 'Ищу для себя, за других не размещаю',
  'В моей компетенции и по закону', 'Не работа по найму']
BACK = {TM.get(l, l): l for l in LABELS}; BACK.update({l: l for l in LABELS})
SUBJ = {'Событие для': 'event', 'Подія для': 'event', 'Курс для': 'kurs', 'Объявление для': 'vacancy', 'Оголошення для': 'vacancy'}
EV_TYPES = both({'Встречи и общение': 'meet', 'Разговорные клубы и тандемы': 'lang', 'Дети и семья': 'kids', 'Ретриты и выезды': 'retreat', 'Праздники и культура': 'culture', 'Лекции и мастер-классы': 'talk'})
K_TYPES = both({'Йога, танцы и движение': 'body', 'Языки': 'lang', 'Для детей': 'kids', 'Творчество и рукоделие': 'create', 'Профессия и своё дело': 'pro', 'Жизнь в Швейцарии и саморазвитие': 'life'})
K_KINDS = both({'Регулярные занятия: можно прийти в любой момент': 'regular', 'Курс с общим началом': 'course', 'Мастер-класс: один раз, очно': 'mk', 'Вебинар: один раз, онлайн': 'web'})
REP = both({'Один раз, один день': 'once', 'Несколько дней подряд (выезд, фестиваль)': 'days', 'Каждую неделю': 'weekly', 'Несколько раз в неделю': 'several',
            'Раз в две недели': 'biweekly', 'Раз в месяц, в тот же день недели': 'monthly'})
PAY = both({'Бесплатно': 'free', 'Бесплатно, можно оставить пожертвование': 'donation', 'Взнос на расходы (зал, чай, материалы)': 'cost',
            'Взнос на расходы (материалы, аренда зала)': 'cost', 'Платно: билет или плата за участие': 'paid', 'Платно': 'paid'})
SIGN = both({'Без записи, просто приходи': 'none', 'Написать в WhatsApp': 'wa', 'Написать в Telegram': 'tg', 'Написать на e-mail': 'mail',
             'Позвонить или написать SMS': 'tel', 'Написать в Instagram': 'ig', 'Записаться на сайте, по ссылке': 'link'})
TRIAL = both({'Нет': '', 'Да, бесплатно': 'free', 'Да, со скидкой': 'disc'})
DAYS = both({'Пн': 1, 'Вт': 2, 'Ср': 3, 'Чт': 4, 'Пт': 5, 'Сб': 6, 'Вс': 0})
CATS = both({'Документы и статус': 'status', 'Юристы': 'law', 'Налоги и финансы': 'money', 'Страхование и пенсия': 'insure', 'Врачи и здоровье': 'health',
             'Психологическая помощь': 'psy', 'Коучинг и личное развитие': 'coach', 'Тело и красота': 'body', 'Дети и семья': 'kids', 'Язык, учёба и работа': 'learn',
             'Дом, быт и транспорт': 'home', 'Праздники, фото и еда': 'events'})
START = both({'Сразу': 'сразу', 'По договорённости': 'по договорённости'})
PAYT = both({'В час': 'в час', 'В месяц': 'в месяц', 'В год': 'в год', 'По договорённости': ''})
LANGS = both({'Русский': 'русский', 'Украинский': 'украинский', 'Немецкий': 'немецкий', 'Французский': 'французский', 'Итальянский': 'итальянский', 'Английский': 'английский'})
KT = {'AG': 'Aargau', 'AR': 'Appenzell Ausserrhoden', 'AI': 'Appenzell Innerrhoden', 'BL': 'Basel-Landschaft', 'BS': 'Basel-Stadt', 'BE': 'Bern', 'FR': 'Fribourg',
      'GE': 'Genève', 'GL': 'Glarus', 'GR': 'Graubünden', 'JU': 'Jura', 'LU': 'Luzern', 'NE': 'Neuchâtel', 'NW': 'Nidwalden', 'OW': 'Obwalden', 'SH': 'Schaffhausen',
      'SZ': 'Schwyz', 'SO': 'Solothurn', 'SG': 'St. Gallen', 'TG': 'Thurgau', 'TI': 'Ticino', 'UR': 'Uri', 'VS': 'Valais', 'VD': 'Vaud', 'ZG': 'Zug', 'ZH': 'Zürich'}
RU_BACK = {v: k for k, v in TM.items()}   # украинский текст галочки → русский (в данных храним по-русски)
TR = dict(zip('абвгдеёжзийклмнопрстуфхцчшщъыьэюяіїєґ', ['a','b','v','g','d','e','e','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','shch','','y','','e','yu','ya','i','yi','ye','g']))

def slug(t):
    t = ''.join(TR.get(c, c) for c in t.lower())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t)).strip('-')[:48] or 'zapis'

def parse(text):
    kind, f = None, {}
    for k, v in SUBJ.items():
        if k in text: kind = v
    for line in text.splitlines():
        m = re.match(r'^\s*([^:]{2,70}):\s*(.+?)\s*$', line)
        if m and m.group(1).strip() in BACK: f[BACK[m.group(1).strip()]] = m.group(2)
    return kind, f

def lst(x):
    return [RU_BACK.get(y.strip(), y.strip()) for y in (x or '').split(',') if y.strip()]

def iso(d):
    m = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', d or '')
    return f'{m.group(3)}-{int(m.group(2)):02d}-{int(m.group(1)):02d}' if m else ''

def card_of(ref):
    if not ref: return None, None
    m = re.search(r'svoiludi\.ch/(organizacii/)?#([a-z0-9-]+)', ref)
    if not m: return None, None
    if m.group(1):
        o = next((x for x in load('organizations.js', 'ORGANIZATIONS') if x['id'] == m.group(2)), None); return ('org', o) if o else (None, None)
    s = next((x for x in load('specialists.js', 'SPECIALISTS') if x['id'] == m.group(2)), None); return ('spec', s) if s else (None, None)

def active(ct, c):
    if ct == 'spec': return c.get('status') == 'активен' and not (c.get('paidUntil') and c['paidUntil'] < TODAY.isoformat())
    return c.get('status') == 'активен' and bool(c.get('confirm'))

def contacts(f):
    c = {'person': f.get('Контактное лицо', ''), 'phone': f.get('Телефон', ''), 'whatsapp': f.get('WhatsApp', ''), 'telegram': f.get('Telegram', ''),
         'email': f.get('E-mail', ''), 'instagram': f.get('Instagram', '')}
    return {k: v for k, v in c.items() if v}

def place_of(f, ct, card):
    """адрес: из карточки («<адрес> — адрес из карточки»), онлайн или по полям «Улица и дом», «Индекс», «Город», «Кантон»"""
    where = f.get('Где', '')
    if re.match(r'^(Онлайн|Онлайн|Удалённо|Віддалено)$', where.strip()): return {'online': True, 'canton': '', 'address': ''}
    if card:
        hit = lambda adr: bool(adr) and where.startswith(adr)
        p = next((p for p in card.get('places', []) if hit(p.get('address'))), None) if ct == 'spec' else ({'canton': card.get('canton'), 'address': card.get('address')} if hit(card.get('address')) else None)
        if p: return {'online': False, 'canton': p.get('canton', ''), 'address': p.get('address', ''), 'geo': p.get('geo')}
    kt = re.search(r'\(([A-Z]{2})\)', f.get('Кантон', ''))
    street, plz, city = f.get('Улица и дом', ''), f.get('Индекс', ''), f.get('Город', '')
    addr = ', '.join(x for x in [street, ' '.join(x for x in [plz, city] if x)] if x)
    return {'online': False, 'canton': KT.get(kt.group(1), '') if kt else '', 'address': addr, 'city': city, 'venue': f.get('Название места', '')}

def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    text = open(a[0], encoding='utf-8').read()
    kind, f = parse(text)
    if not kind: print('Не поняла, что это за заявка (тема письма?).'); sys.exit(1)
    ct, card = card_of(f.get('Карточка в справочнике'))
    if card and not active(ct, card):
        print(f"Карточка {card.get('name')} ({card.get('num', '')}) НЕ АКТИВНА (статус «{card.get('status')}», срок {card.get('paidUntil', '—')}). "
              'Записи неактивных карточек не размещаем (решение Ирины 10.10.2026). Сообщить Ирине, черновик ответа — как продлить или открыть карточку.'); sys.exit(2)
    own = [k for k in ('Это моё событие, за других не размещаю', 'Это мой курс, за других не размещаю', 'Ищу для себя, за других не размещаю') if f.get(k)]
    if not own or not f.get('В моей компетенции и по закону'):
        print('ВНИМАНИЕ: в письме нет галочек «Это моё…» и/или «В моей компетенции и по закону». Без них не размещаем — попросить отправить заявку с сайта ещё раз.')
    key = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8))
    P = place_of(f, ct, card)
    title = f.get('Название') or f.get('Кто нужен') or ''
    C = contacts(f)
    if kind in ('event', 'kurs'):
        e = {'id': slug(title), 'key': key, 'status': 'на подтверждении', 'sections': ['events' if kind == 'event' else 'kursy'], 'title': title}
        if kind == 'event': e['type'] = EV_TYPES.get(f.get('Вид события', ''), 'meet')
        else:
            e['type'] = K_TYPES.get(f.get('Направление', ''), 'life'); kk = K_KINDS.get(f.get('Формат', ''), 'regular')
            e['kind'] = 'once' if kk in ('mk', 'web') else kk
            if kk == 'web': P = {'online': True, 'canton': '', 'address': ''}
            if f.get('Встреч в курсе'): e['sessions'] = int(re.sub(r'\D', '', f['Встреч в курсе']) or 0) or None
        d1 = iso(f.get('Первый день') or f.get('Первое занятие')); d2 = iso(f.get('Последний день') or f.get('Последнее занятие')) or d1
        rep = REP.get(f.get('Как часто', ''), 'once' if kind == 'event' or e.get('kind') == 'once' else 'weekly')
        e['date'] = d1
        if rep == 'days' and d2 != d1: e['dateEnd'] = d2
        elif rep in ('weekly', 'biweekly', 'several'):
            e['repeat'] = {'freq': 'weekly', 'until': d2}
            if rep == 'biweekly': e['repeat']['interval'] = 2
            if rep == 'several': e['repeat']['days'] = sorted(DAYS.get(x, 9) for x in lst(f.get('Дни недели')) if x in DAYS or TM.get(x) in DAYS)
        elif rep == 'monthly': e['repeat'] = {'freq': 'monthly', 'until': d2}
        if f.get('Начало'): e['time'] = f['Начало']
        if f.get('Окончание'): e['timeEnd'] = f['Окончание']
        e.update({'canton': P.get('canton', ''), 'address': P.get('address', ''), 'online': bool(P.get('online'))})
        if P.get('venue'): e['venue'] = P['venue']
        if P.get('geo'): e['geo'] = P['geo']
        if f.get('Платформа'): e['platform'] = f['Платформа']
        e['langs'] = [LANGS.get(x, x.lower()) for x in lst(f.get('Язык') or f.get('Язык занятий'))]
        if f.get('Для кого'): e['for'] = lst(f['Для кого'])
        if f.get('Возраст детей'): e['age'] = RU_BACK.get(f['Возраст детей'], f['Возраст детей'])
        if kind == 'kurs' and f.get('Уровень'): e['level'] = RU_BACK.get(f['Уровень'], f['Уровень'])
        pay = PAY.get(f.get('Вход') or f.get('Плата') or '', 'free'); e['pay'] = pay
        num = (f.get('Цена, CHF') or '').replace(',', '.')
        e['price'] = 'бесплатно' if pay == 'free' else 'бесплатно, можно оставить пожертвование' if pay == 'donation' else (f'CHF {num}' if num else '')
        if pay in ('cost', 'paid') and f.get('За что'): e['per'] = RU_BACK.get(f['За что'], f['За что'])
        if f.get('Скидки'): e['disc'] = lst(f['Скидки'])
        if f.get('Как оплатить'): e['payhow'] = lst(f['Как оплатить'])
        e['commercial'] = pay == 'paid'
        if kind == 'kurs' and TRIAL.get(f.get('Пробное занятие', '')): e['trial'] = TRIAL[f['Пробное занятие']]
        if kind == 'kurs' and f.get('Что взять с собой'): e['bring'] = f['Что взять с собой']
        e['organizers'] = [card['id']] if ct == 'spec' else [{'org': card['id'], 'name': card['name']}] if ct == 'org' else [{'name': f.get('Организатор') or f.get('Кто ведёт') or '', 'link': ''}]
        if C: e['contacts'] = C
        e['signup'] = SIGN.get(f.get('Как записаться', ''), '')
        seats = re.sub(r'\D', '', f.get('Мест') or f.get('Мест в группе') or '')
        if seats: e['seats'] = int(seats)
        e.update({'link': f.get('Ссылка', ''), 'about': f.get('Коротко о событии') or f.get('Коротко о курсе') or ''})
        page, data, var = ('events' if kind == 'event' else 'kursy'), 'afisha.js', 'window.AFISHA = [\n'
    else:
        k = 'partner' if re.search(r'партн', f.get('Кого ищу', ''), re.I) else 'staff'
        d1 = iso(f.get('Показывать с')) or TODAY.isoformat(); d2 = iso(f.get('Показывать до'))
        lim = (datetime.date.fromisoformat(d1) + datetime.timedelta(days=60)).isoformat()
        d2 = min(d2, lim) if d2 else lim
        e = {'id': slug(title), 'status': 'на подтверждении', 'kind': k,
             'author': card['id'] if ct == 'spec' else {'org': card['id'], 'name': card['name'], 'role': '', 'contacts': {}} if ct == 'org'
                       else {'name': f.get('Автор объявления', ''), 'firm': '', 'role': RU_BACK.get(f.get('Кто это', ''), f.get('Кто это', '')), 'contacts': {}},
             'title': title, 'cat': CATS.get(f.get('Направление', ''), ''), 'canton': P.get('canton', ''), 'city': P.get('city') or (re.search(r'\d{4}\s+(.+)$', P.get('address') or '') or [None, ''])[1],
             'online': bool(P.get('online')), 'langs': [LANGS.get(x, x.lower()) for x in lst(f.get('Нужные языки'))], 'about': f.get('О работе или сотрудничестве', '')}
        if k == 'staff':
            st = f.get('Начало работы', ''); sd = iso(f.get('Дата начала'))
            e.update({'workload': RU_BACK.get(f.get('Занятость', ''), f.get('Занятость', '')), 'contract': RU_BACK.get(f.get('Договор', ''), f.get('Договор', '')),
                      'start': START.get(st) or (f'с {f.get("Дата начала")}' if sd else ''), 'exp': RU_BACK.get(f.get('Опыт', ''), f.get('Опыт', '')),
                      'edu': RU_BACK.get(f.get('Образование', ''), f.get('Образование', '')),
                      'skills': lst(f.get('Навыки')) + [x.strip() for x in (f.get('Другие навыки') or '').split(',') if x.strip()],
                      'permits': lst(f.get('Разрешение на работу')), 'drive': RU_BACK.get(f.get('Водительские права', ''), f.get('Водительские права', '')),
                      'benefits': lst(f.get('Что предлагаем'))})
            pt = PAYT.get(f.get('Зарплата', ''), None); num = (f.get('Зарплата, CHF') or '').replace(',', '.')
            e['salary'] = f'CHF {num} {pt}' if pt and num else ('по договорённости' if pt == '' else '')
        else:
            e.update({'ptypes': lst(f.get('Какое сотрудничество')), 'pterms': RU_BACK.get(f.get('Условия', ''), f.get('Условия', '')),
                      'pform': RU_BACK.get(f.get('Формат', ''), f.get('Формат', '')), 'pwho': lst(f.get('Кого ищу в партнёры'))})
        if f.get('Местный язык на уровне'): e['level'] = RU_BACK.get(f['Местный язык на уровне'], f['Местный язык на уровне'])
        e = {x: y for x, y in e.items() if y not in ('', [], None) or x in ('author', 'title', 'about', 'canton', 'city', 'online')}
        if C: e['contacts'] = C
        e.update({'signup': SIGN.get(f.get('Как откликнуться', ''), ''), 'link': f.get('Ссылка', ''), 'contact': '', 'posted': d1, 'until': d2, 'key': key})
        page, data, var = 'vakansii', 'vacancies.js', 'window.VACANCIES = [\n'
    to = ((card or {}).get('contacts') or {}).get('email', '') or f.get('Ссылку на подтверждение прислать на', '') or C.get('email', '')
    print(json.dumps(e, ensure_ascii=False, indent=2))
    print(f"\nПредпросмотр: https://svoiludi.ch/{page}/#ok={e['id']}.{key}")
    print(f"Ссылку отправить на: {to or 'ответом на письмо с заявкой (на адрес, с которого она пришла)'}" + ('  (e-mail из карточки — один для всех подтверждений; письмо-подтверждение принимаем только с него)' if card else '  (карточки нет — e-mail из заявки)'))
    print('Перед размещением: сверить автора по листу «Исключены» в «Реестре специалистов» (имя, фирма, UID, e-mail, телефоны, Telegram, Instagram).')
    if '--write' in a:
        p = os.path.join(ROOT, 'data', data); s = open(p, encoding='utf-8').read()
        assert s.count(var) == 1, 'не нашла начало списка'
        if f'"id": "{e["id"]}"' in s or f"id: '{e['id']}'" in s: print('Запись с таким id уже есть — поменяй id в черновике.'); sys.exit(1)
        body = json.dumps(e, ensure_ascii=False, indent=2).replace('\n', '\n  ')
        s = s.replace(var, var + '  ' + body + ',\n', 1); open(p, 'w', encoding='utf-8').write(s)
        print(f'Записано первой строкой в data/{data} (на сайте скрыта).')

if __name__ == '__main__':
    main()
