"""Меню сайта (решение Ирины 09.10.2026, «устройство сайта»): 6 пунктов во всех русских страницах.
Специалисты · Как устроена Швейцария · Полезные инструменты · События и курсы · Что нового · Вакансии и партнёрство (с 11.10.2026; до этого «Работа и своё дело», ещё раньше «Для специалистов»).
«Сайт Ирины» — в подвале, на странице «О проекте» и в «Ещё» приложения (справочник нейтральный, см. документ проекта «struktura-saytov.md»).
Запуск из корня: python3 _i18n/struktura_src/nav.py  (идемпотентно; после слияния веток запускать заново, потом _i18n/sync.py для UA)."""
import os, re
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ITEMS = [  # (путь, название, условие «текущий»)
    ('', 'Специалисты', lambda p: p == 'index.html'),
    ('shveycariya/', 'Как устроена Швейцария', lambda p: p.startswith(('shveycariya/', 'situacii/'))),
    ('instrumenty/', 'Полезные инструменты', lambda p: p.startswith('instrumenty/')),
    ('events/', 'События и курсы', lambda p: p.startswith(('events/', 'akcii/', 'kursy/'))),
    ('novosti/', 'Что нового', lambda p: p.startswith('novosti/')),
    # 11.10.2026, Ирина: «у нас на сайте нет вкладки вакансии и партнерство… название работа и свое дело не подходит, оно о другом…
    # в категории вакансии и партнерство должна открываться страница, где можно найти, кто кого ищет… и разместить свою вакансию».
    # Страница dlya-specialistov/ теперь «Для специалистов и организаций» — в подвале, в «Ещё» приложения и на «Условиях размещения».
    ('vakansii/', 'Вакансии и партнёрство', lambda p: p.startswith('vakansii/')),
]
# Пункты, которые выложены, но СКРЫТЫ: в меню их видит только Ирина (режим svoiludi.ch/?ira=1, его включает pwa-app.js
# классом html.sl-ira), посетители — нет. 11.10.2026, Ирина: «размести но скрой пока» — вкладка вакансий ждёт первых настоящих
# объявлений. Открыть для всех: убрать путь отсюда и VAK_OPEN = True в _i18n/struktura_src/build.py, потом сборка (см. «struktura-saytov.md»).
HIDDEN = set()   # 11.10.2026, 14:39 — Ирина: «Вкладку вакансии можно разместить» (скрыта была с 12:15)
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

# «Акции» в подвале рядом с «События» и «Курсы» (11.10.2026): подвалы собирают разные скрипты, поэтому ссылка ставится здесь, на всех страницах сразу
FOOT = re.compile(r'(<a href="((?:\.\./)*|https://svoiludi\.ch/)events/">События</a> · )(<a href="\2kursy/">Курсы</a>)')

def main():
    n = 0
    for rel in files():
        p = os.path.join(ROOT, rel); h = open(p, encoding='utf-8').read()
        m = NAV.search(h)
        if not m: continue
        new = h[:m.start(2)] + build(rel) + '\n    </nav>' + h[m.end(3):] if False else NAV.sub(lambda m: m.group(1) + build(rel) + '\n    </nav>', h, count=1)
        new = FOOT.sub(lambda m: m.group(1) + f'<a href="{m.group(2)}akcii/">Акции</a> · ' + m.group(3), new)
        if new != h:
            open(p, 'w', encoding='utf-8').write(new); n += 1
    print('меню обновлено:', n, 'страниц')

if __name__ == '__main__':
    main()
