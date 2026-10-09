"""Меню сайта (решение Ирины 09.10.2026, «устройство сайта»): 6 пунктов во всех русских страницах.
Специалисты · Как устроена Швейцария · Полезные инструменты · События и курсы · Что нового · Для специалистов.
«Сайт Ирины» — в подвале, на странице «О проекте» и в «Ещё» приложения (справочник нейтральный, см. документ проекта «struktura-saytov.md»).
Запуск из корня: python3 _i18n/struktura_src/nav.py  (идемпотентно; после слияния веток запускать заново, потом _i18n/sync.py для UA)."""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ITEMS = [  # (путь, название, условие «текущий»)
    ('', 'Специалисты', lambda p: p == 'index.html'),
    ('shveycariya/', 'Как устроена Швейцария', lambda p: p.startswith(('shveycariya/', 'situacii/'))),
    ('instrumenty/', 'Полезные инструменты', lambda p: p.startswith('instrumenty/')),
    ('events/', 'События и курсы', lambda p: p.startswith(('events/', 'kursy/'))),
    ('novosti/', 'Что нового', lambda p: p.startswith('novosti/')),
    ('dlya-specialistov/', 'Для специалистов', lambda p: p.startswith(('dlya-specialistov/', 'join/', 'vakansii/', 'badge/'))),
]
NAV = re.compile(r'(<nav aria-label="Разделы">)(.*?)(\n?\s*</nav>)', re.S)

def build(rel):
    depth = rel.count('/')
    pre = '../' * depth
    out = []
    for path, name, cur in ITEMS:
        href = (pre + path) or './'
        if cur(rel):
            out.append(f'\n      <a href="{href}" aria-current="page" style="color:var(--ink)">{name}</a>')
        else:
            out.append(f'\n      <a href="{href}">{name}</a>')
    return ''.join(out)

def files():
    for dp, dn, fn in os.walk(ROOT):
        r = os.path.relpath(dp, ROOT)
        if r.split(os.sep)[0] in ('.git', 'uk', '_i18n', 'node_modules'): dn[:] = []; continue
        for f in fn:
            if f.endswith('.html'):
                yield os.path.normpath(os.path.join(r, f)).replace(os.sep, '/')

def main():
    n = 0
    for rel in files():
        p = os.path.join(ROOT, rel); h = open(p, encoding='utf-8').read()
        m = NAV.search(h)
        if not m: continue
        new = h[:m.start(2)] + build(rel) + '\n    </nav>' + h[m.end(3):] if False else NAV.sub(lambda m: m.group(1) + build(rel) + '\n    </nav>', h, count=1)
        if new != h:
            open(p, 'w', encoding='utf-8').write(new); n += 1
    print('меню обновлено:', n, 'страниц')

if __name__ == '__main__':
    main()
