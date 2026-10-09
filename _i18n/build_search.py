#!/usr/bin/env python3
"""Поиск по сайту svoiludi.ch (правило Ирины, 08.10.2026): в шапке каждой страницы — поиск по слову.
Собирает data/search.js: разделы сайта, все статьи «Как устроена Швейцария» (с терминами DE/FR/IT/EN),
все инструменты и схемы. Специалисты и события подгружаются в браузере из data/specialists.js и data/afisha.js,
поэтому они всегда свежие. Запускать после любой новой страницы или инструмента: python3 _i18n/build_search.py"""
import json, os, re, sys, html
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, '_i18n', 'shveycariya_src'))
os.chdir(ROOT)
from topics import TOPICS, MODULES  # noqa
from articles import ARTICLES  # noqa

strip = lambda s: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html.unescape(s or ''))).strip()
items = []
PAGES = [
    ('Специалисты', '/', 'Справочник: найти русскоязычного специалиста в Швейцарии', 'специалист врач юрист психолог коуч бухгалтер найти'),
    ('События', '/events/', 'Встречи, клубы, праздники и мероприятия', 'события мероприятия встречи афиша клуб праздник'),
    ('Курсы', '/kursy/', 'Курсы, занятия, мастер-классы и вебинары', 'курсы занятия мастер-класс вебинар обучение немецкий язык'),
    ('Полезные инструменты', '/instrumenty/', 'Бесплатные инструменты и схемы с PDF', 'инструменты калькулятор схема pdf шаблон'),
    ('Все файлы и инструменты по темам', '/instrumenty/vse-fayly/', 'Список всех бесплатных файлов: письма, договоры, протоколы, схемы, расчёты, карточки и планеры', 'файлы список каталог документы скачать pdf образец письмо договор шаблон распечатка'),
    ('Как устроена Швейцария', '/shveycariya/', 'Пермиты, налоги, страховки, школа, работа, жильё — простыми словами', 'швейцария как устроена статьи справочник'),
    ('Как разместиться', '/join/', 'Как специалисту разместиться в справочнике', 'разместиться регистрация специалист анкета пакет'),
    ('Политика конфиденциальности', '/privacy/', 'Какие данные собирает сайт', 'данные конфиденциальность privacy datenschutz'),
]
if os.path.isfile('vakansii/index.html'):
    PAGES.insert(3, ('Вакансии', '/vakansii/', 'Ищу сотрудника, ищу партнёра — для членов сообщества', 'вакансии работа сотрудник партнёр'))
for t, u, d, k in PAGES:
    items.append({'g': 'Разделы', 't': t, 'u': u, 'd': d, 'k': k})

MOD = {m[0]: m[1] for m in MODULES}
for tp in TOPICS:
    a = ARTICLES.get(tp['slug']) if tp['ready'] else None
    if a:
        terms = ' '.join(v for _, v in a.get('terms', []))
        items.append({'g': 'Как устроена Швейцария', 't': tp['title'], 'u': f"/shveycariya/{tp['slug']}/",
                      'd': strip(a.get('lead', ''))[:150], 'k': ' '.join([strip(a.get('seo', '')), strip(a.get('h1', '')), terms, MOD.get(tp['mod'], '')])})
    else:
        items.append({'g': 'Как устроена Швейцария', 't': tp['title'] + ' (скоро)', 'u': f"/shveycariya/#{tp['mod']}",
                      'd': tp['lead'], 'k': MOD.get(tp['mod'], '')})

import subprocess
_js = open('assets/pdffan.js', encoding='utf-8').read(); _i = _js.index('var FANS = {'); _j = _js.index('\n  };', _i)
FANS = json.loads(subprocess.run(['node', '-e', _js[_i:_j + 4] + '\nprocess.stdout.write(JSON.stringify(FANS))'], capture_output=True, text=True, check=True).stdout)
_js = open('assets/pdffan.uk.js', encoding='utf-8').read(); _i = _js.index('var FANS = {'); _j = _js.index('\n  };', _i)
FANS_UK = json.loads(subprocess.run(['node', '-e', _js[_i:_j + 4] + '\nprocess.stdout.write(JSON.stringify(FANS))'], capture_output=True, text=True, check=True).stdout)
ih = open('instrumenty/index.html', encoding='utf-8').read()
for m in re.finditer(r'<article class="tool(?! soon)[^"]*">(.*?)</article>', ih, re.S):
    blk = m.group(1)
    h = re.search(r'<h2>(.*?)</h2>', blk); p = re.search(r'<p>(.*?)</p>', blk); u = re.search(r'href="https://svoiludi\.ch(/instrumenty/[a-z0-9-]+/)"', blk)
    lis = ' '.join(strip(x) for x in re.findall(r'<li[^>]*>(.*?)</li>', blk, re.S))
    # названия файлов, которые делает инструмент (FANS в pdffan.js / pdffan.uk.js), — чтобы находилось по «протокол», «перевод», «таблички» (09.10.2026)
    sl = u.group(1).split('/')[2] if u else ''
    kf = ' '.join(it['t'] for it in FANS.get(sl, {}).get('items', []))
    kfu = ' '.join(it['t'] for it in FANS_UK.get(sl, {}).get('items', []))
    if h and u and os.path.isfile(u.group(1).strip('/') + '/index.html'):
        items.append({'g': 'Инструменты', 't': strip(h.group(1)), 'u': u.group(1), 'd': strip(p.group(1) if p else '')[:150], 'k': lis, 'kf': kf, 'kfu': kfu})


# Организации из темы «Профсоюзы и консультации» (Unia, Mieterverband, Beobachter…) — ведут прямо к карточке организации
import pomosh as PM
if any(tp['slug'] == 'profsoyuzy' and tp['ready'] for tp in TOPICS):
    for o in PM.ORGS:
        items.append({'g': 'Кто поможет', 't': o['name'], 'u': f"/shveycariya/profsoyuzy/#org-{o['id']}", 'd': o['short'], 'k': ' '.join([o['who'], o['help'], PM.AREAS[o['area']], 'профсоюз консультация юрист взнос членство'])})

os.makedirs('data', exist_ok=True)
RU_ITEMS = [dict({k: v for k, v in it.items() if k not in ('kf', 'kfu')}, k=(it['k'] + ' ' + it.get('kf', '')).strip()) for it in items]
out = '/* Индекс поиска по сайту — собирается _i18n/build_search.py, руками не править. */\nwindow.SVL_SEARCH = ' + json.dumps(RU_ITEMS, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('data/search.js', 'w', encoding='utf-8').write(out)
print('ok', len(items), 'записей')

# Украинский индекс (09.10.2026): data/search.uk.js — тексты из памяти переводов (tm_uk.json и tm_search_uk.json),
# ключевые слова — русские и украинские вместе, ссылки на /uk/…. Непереведённое — в _i18n/search_todo.json.
TM = json.load(open('_i18n/tm_uk.json', encoding='utf-8'))
ps = '_i18n/tm_search_uk.json'
TS = json.load(open(ps, encoding='utf-8')) if os.path.exists(ps) else {}
CYR = re.compile('[А-Яа-яЁё]')
todo = []
def tr(s):
    if not s or not CYR.search(s): return s
    v = TS.get(s) or TM.get(s)
    if v is None: todo.append(s); return s
    return v
uk = []
for it in items:
    u = it['u']
    uu = '/uk' + u if not u.startswith('/uk') else u
    kk = tr(it.get('k', ''))
    uk.append({'g': tr(it['g']), 't': tr(it['t']), 'u': uu, 'd': tr(it.get('d', '')), 'k': (it.get('k', '') + ' ' + (kk if kk != it.get('k', '') else '') + ' ' + it.get('kf', '') + ' ' + it.get('kfu', '')).strip()})
json.dump(sorted(set(todo)), open('_i18n/search_todo.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
out = '/* Украинский индекс поиска — собирается _i18n/build_search.py, руками не править. */\nwindow.SVL_SEARCH = ' + json.dumps(uk, ensure_ascii=False, separators=(',', ':')) + ';\n'
open('data/search.uk.js', 'w', encoding='utf-8').write(out)
print('uk: непереведено', len(set(todo)))
