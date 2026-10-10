#!/usr/bin/env python3
"""Заявка с сайта (событие, курс, объявление) → черновик записи на подтверждение (10.10.2026).

Запуск из корня репозитория svoiludi:
  python3 -I _i18n/pochta/zapis.py <письмо.txt> [--write]
    письмо.txt — текст письма-заявки из формы events/#zayavka, kursy/#zayavka или vakansii/#zayavka (RU или UA), как пришёл в Gmail.
    Без --write только печатает черновик (JSON) — проверить глазами. С --write ставит запись первой в data/afisha.js
    или data/vacancies.js со статусом «на подтверждении» и ключом key: на сайте её не видно, ссылка предпросмотра работает.

Что делает:
  - находит строку «Карточка в справочнике: …» (её добавляет форма, когда человек нашёл свою карточку по UID или номеру)
    и берёт из карточки (data/specialists.js или data/organizations.js) организатора/автора, кантон, адрес и координаты;
  - «Другой адрес», «Другой телефон», «Другой e-mail» из заявки ставит ВМЕСТО данных карточки (address, phone, email; у объявлений — contact);
  - без карточки — организатор/автор, адрес и контакт берутся из полей заявки как есть (это потом проверяет Claude);
  - печатает ссылку предпросмотра и e-mail, куда её отправлять: ВСЕГДА e-mail из карточки — он один для всех подтверждений
    (решение Ирины 10.10.2026), письмо-подтверждение принимаем только с него; «Другой e-mail» из заявки на подтверждение не влияет
    (если карточки нет — e-mail из заявки).
Дату, время, повтор, вид и цену скрипт разбирает только приблизительно: черновик ОБЯЗАТЕЛЬНО проверить и поправить
по правилам «kursy-svoiludi.md» и «vakansii-svoiludi.md» (цена конечная в CHF, без обещаний лечения, AVG и т. д.).
Дальше: python3 _i18n/sync.py check → перевести (apply) → node _i18n/smoke.js → commit, push → черновик письма со ссылкой в Gmail.
"""
import sys, os, re, json, random, string, datetime, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TODAY = datetime.date.today()

def load(name, var):
    js = subprocess.run(['node', '-e', f"global.window={{}};require(process.argv[1]);console.log(JSON.stringify(window.{var}))", os.path.join(ROOT, 'data', name)],
                        capture_output=True, text=True, check=True).stdout
    return json.loads(js)

# подписи полей: русские (data-a в формах) и украинские — из памяти переводов
TM = json.load(open(os.path.join(ROOT, '_i18n', 'tm_uk.json'), encoding='utf-8'))
LABELS = ['Карточка в справочнике', 'Ссылку на подтверждение прислать на', 'Название', 'Вид события', 'Дата и время', 'Место', 'Где', 'Другой адрес (вместо адреса из карточки)',
          'Язык', 'Цена', 'Какое событие', 'Организатор', 'UID, фирма или ферайн', 'Ссылка на запись', 'Коротко о событии', 'Контакт для вопросов',
          'Другой телефон (вместо телефона из карточки)', 'Другой e-mail (вместо e-mail из карточки)', 'Направление', 'Формат', 'Расписание', 'Для кого', 'Кто ведёт',
          'Коротко о курсе', 'Кого ищу', 'Кто нужен', 'Занятость и с какого времени', 'Нужные языки', 'О работе или сотрудничестве', 'Что я предлагаю',
          'Автор объявления', 'Как откликнуться']
BACK = {TM.get(l, l): l for l in LABELS}; BACK.update({l: l for l in LABELS})
SUBJ = {'Событие для': 'event', 'Подія для': 'event', 'Курс для': 'kurs', 'Объявление для': 'vacancy', 'Оголошення для': 'vacancy'}
EV_TYPES = {'Встречи и общение': 'meet', 'Разговорные клубы и тандемы': 'lang', 'Дети и семья': 'kids', 'Ретриты и выезды': 'retreat', 'Праздники и культура': 'culture', 'Лекции и мастер-классы': 'talk'}
K_TYPES = {'Йога, танцы и движение': 'body', 'Языки': 'lang', 'Для детей': 'kids', 'Творчество и рукоделие': 'create', 'Профессия и своё дело': 'pro', 'Жизнь в Швейцарии и саморазвитие': 'life'}
K_KINDS = {'Регулярные занятия': 'regular', 'Курс с общим началом': 'course', 'Мастер-класс или вебинар': 'once'}
LANGS = {'Русский': 'русский', 'Украинский': 'украинский', 'Немецкий': 'немецкий', 'Французский': 'французский', 'Итальянский': 'итальянский', 'Английский': 'английский'}
for d in (EV_TYPES, K_TYPES, K_KINDS, LANGS):
    for k in list(d): d[TM.get(k, k)] = d[k]
TR = dict(zip('абвгдеёжзийклмнопрстуфхцчшщъыьэюяіїєґ', ['a','b','v','g','d','e','e','zh','z','i','j','k','l','m','n','o','p','r','s','t','u','f','h','ts','ch','sh','shch','','y','','e','yu','ya','i','yi','ye','g']))

def slug(t):
    t = ''.join(TR.get(c, c) for c in t.lower())
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', t)).strip('-')[:48] or 'zapis'

def parse(text):
    kind, f = None, {}
    for k, v in SUBJ.items():
        if k in text: kind = v
    for line in text.splitlines():
        m = re.match(r'^\s*([^:]{2,60}):\s*(.+?)\s*$', line)
        if m and m.group(1).strip() in BACK: f[BACK[m.group(1).strip()]] = m.group(2)
    return kind, f

def card_of(ref):
    if not ref: return None, None
    m = re.search(r'svoiludi\.ch/(organizacii/)?#([a-z0-9-]+)', ref)
    if not m: return None, None
    if m.group(1):
        o = next((x for x in load('organizations.js', 'ORGANIZATIONS') if x['id'] == m.group(2)), None); return ('org', o) if o else (None, None)
    s = next((x for x in load('specialists.js', 'SPECIALISTS') if x['id'] == m.group(2)), None); return ('spec', s) if s else (None, None)

def when(t):
    d = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', t or ''); tm = re.findall(r'(?<![\d.])(\d{1,2}:\d{2})', t or '')
    out = {}
    if d: out['date'] = f'{d.group(3)}-{int(d.group(2)):02d}-{int(d.group(1)):02d}'
    if tm: out['time'] = tm[0].zfill(5)
    if len(tm) > 1: out['timeEnd'] = tm[1].zfill(5)
    return out

def main():
    a = sys.argv[1:]
    if not a: print(__doc__); sys.exit(1)
    text = open(a[0], encoding='utf-8').read()
    kind, f = parse(text)
    if not kind: print('Не поняла, что это за заявка (тема письма?).'); sys.exit(1)
    ct, card = card_of(f.get('Карточка в справочнике'))
    key = ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8))
    other_addr = f.get('Другой адрес (вместо адреса из карточки)', '')
    where = f.get('Где', '')
    contact = [x for x in (f.get('Другой телефон (вместо телефона из карточки)'), f.get('Другой e-mail (вместо e-mail из карточки)')) if x]
    langs = [LANGS.get(x.strip(), x.strip()) for x in (f.get('Язык') or f.get('Нужные языки') or '').split(',') if x.strip()]
    place = None
    if card:
        # в письме — подпись варианта: «<адрес> — адрес из карточки» (UA — «<адреса> — адреса з картки»)
        hit = lambda adr: bool(adr) and where.startswith(adr)
        place = next((p for p in card.get('places', []) if hit(p.get('address'))), None) if ct == 'spec' else ({'canton': card.get('canton'), 'address': card.get('address')} if hit(card.get('address')) else None)
    online = where in ('Онлайн', 'Удалённо', 'Віддалено') or (not card and re.search(r'онлайн', f.get('Место', ''), re.I) is not None)
    address = other_addr or (place or {}).get('address', '') or ('' if card or online else f.get('Место', ''))
    title = f.get('Название') or f.get('Кто нужен') or ''
    if kind in ('event', 'kurs'):
        e = {'id': slug(title), 'key': key, 'status': 'на подтверждении', 'sections': ['events' if kind == 'event' else 'kursy'], 'title': title}
        if kind == 'event': e['type'] = EV_TYPES.get(f.get('Вид события', ''), 'meet')
        else: e['type'] = K_TYPES.get(f.get('Направление', ''), 'life'); e['kind'] = K_KINDS.get(f.get('Формат', ''), 'regular')
        e.update(when(f.get('Дата и время') or f.get('Расписание')))
        e.update({'canton': (place or {}).get('canton', ''), 'address': address, 'online': bool(online)})
        if place and place.get('geo') and not other_addr: e['geo'] = place['geo']
        e.update({'langs': langs, 'price': f.get('Цена', '')})
        if kind == 'kurs': e['level'] = f.get('Для кого', '')
        e['commercial'] = 'коммер' in (f.get('Какое событие') or '').lower() or 'комер' in (f.get('Какое событие') or '').lower()
        e['organizers'] = [card['id']] if ct == 'spec' else [{'org': card['id'], 'name': card['name']}] if ct == 'org' else [{'name': f.get('Организатор') or f.get('Кто ведёт') or '', 'link': ''}]
        if card:   # другой телефон и e-mail из заявки — вместо данных карточки; e-mail карточки остаётся для подтверждений
            if f.get('Другой телефон (вместо телефона из карточки)'): e['phone'] = f['Другой телефон (вместо телефона из карточки)']
            if f.get('Другой e-mail (вместо e-mail из карточки)'): e['email'] = f['Другой e-mail (вместо e-mail из карточки)']
        e.update({'link': f.get('Ссылка на запись', ''), 'contact': '' if card else f.get('Контакт для вопросов', ''),
                  'about': f.get('Коротко о событии') or f.get('Коротко о курсе') or ''})
        page, data, var = ('events' if kind == 'event' else 'kursy'), 'afisha.js', 'window.AFISHA = [\n'
    else:
        k = 'partner' if re.search(r'партн', f.get('Кого ищу', ''), re.I) else 'staff'
        cparts = [('tel:' + x) if not '@' in x else ('mail:' + x) for x in contact]
        reply = f.get('Как откликнуться', '').strip(); is_mail = bool(re.search(r'@.+\.', reply))
        e = {'id': slug(title), 'status': 'на подтверждении', 'kind': k,
             'author': card['id'] if ct == 'spec' else {'org': card['id'], 'name': card['name'], 'role': '', 'contacts': card.get('contacts', {})} if ct == 'org'
                       else {'name': f.get('Автор объявления', ''), 'firm': '', 'role': '', 'contacts': {'email': reply if is_mail else '', 'telegram': '' if is_mail else reply.lstrip('@')}},
             'title': title, 'cat': (card or {}).get('cat', ''), 'canton': (place or {}).get('canton', ''), 'city': (re.search(r'\d{4}\s+(.+)$', address or '') or [None, ''])[1] if address else '',
             'online': bool(online), 'workload': f.get('Занятость и с какого времени', ''), 'start': '', 'langs': langs,
             'about': f.get('О работе или сотрудничестве', ''), 'offer': f.get('Что я предлагаю', ''),
             'contact': '; '.join(cparts) if card else ('mail:' + reply if is_mail else 'tg:' + reply.lstrip('@')),
             'posted': TODAY.isoformat(), 'until': (TODAY + datetime.timedelta(days=60)).isoformat(), 'key': key}
        page, data, var = 'vakansii', 'vacancies.js', 'window.VACANCIES = [\n'
    to = ((card or {}).get('contacts') or {}).get('email', '') or f.get('Ссылку на подтверждение прислать на', '') or f.get('Контакт для вопросов', '') or f.get('Как откликнуться', '')
    print(json.dumps(e, ensure_ascii=False, indent=2))
    print(f"\nПредпросмотр: https://svoiludi.ch/{page}/#ok={e['id']}.{key}")
    print(f"Ссылку отправить на: {to or '— e-mail не найден, спросить Ирину'}" + ('  (e-mail из карточки — один для всех подтверждений; письмо-подтверждение принимаем только с него)' if card else '  (карточки нет — e-mail из заявки)'))
    if '--write' in a:
        p = os.path.join(ROOT, 'data', data); s = open(p, encoding='utf-8').read()
        assert s.count(var) == 1, 'не нашла начало списка'
        if f'"id": "{e["id"]}"' in s or f"id: '{e['id']}'" in s: print('Запись с таким id уже есть — поменяй id в черновике.'); sys.exit(1)
        body = json.dumps(e, ensure_ascii=False, indent=2).replace('\n', '\n  ')
        s = s.replace(var, var + '  ' + body + ',\n', 1); open(p, 'w', encoding='utf-8').write(s)
        print(f'Записано первой строкой в data/{data} (на сайте скрыта).')

if __name__ == '__main__':
    main()
