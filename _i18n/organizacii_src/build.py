"""Раздел «Организации» (10.10.2026): собирает organizacii/index.html.
Шапка, стили, меню и подвал берутся из готовой страницы vakansii/index.html (тот же вид, что «Вакансии и партнёрство»),
текст — body.html, код — script.js, данные — data/organizations.js (+ afisha.js для событий и курсов, vacancies.js для вакансий и поиска партнёров организации).
Запуск из корня репозитория: python3 _i18n/organizacii_src/build.py ; потом python3 _i18n/pwa.py, python3 _i18n/sync.py check,
python3 _i18n/build_search.py, node _i18n/og.js organizacii. Правила — документ проекта «obshchestvennye-organizacii.md»."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
os.chdir(ROOT)
src = open('vakansii/index.html', encoding='utf-8').read()
src = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', src, flags=re.S)        # переключатель языка и переход ставит pages.py
head = src[:src.index('</head>')]
top = src[src.index('</head>'):src.index('<main class="page">')]        # </head><body>, стиль меню, шапка
ver = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()[:8]
T = 'Организации для украинцев и русскоязычных в Швейцарии — ферайны, фонды, центры помощи и фирмы своих · Свои люди'
D = 'Украинские и русскоязычные организации в Швейцарии: центры помощи, школы выходного дня, общества, хоры, деловые сообщества и фирмы своих — рестораны, кейтеринг, магазины, студии — по кантонам. Некоммерческим организациям размещение бесплатно всегда.'
OGT = 'Организации, которые помогают своим — Свои люди в Швейцарии'
OGD = 'Центры помощи, школы, общества и деловые сообщества для украинцев и русскоязычных в Швейцарии. Некоммерческим — бесплатно всегда.'
head = re.sub(r'<title>[^<]*</title>', f'<title>{T}</title>', head)
head = head.replace('<link rel="canonical" href="https://svoiludi.ch/vakansii/">', '<link rel="canonical" href="https://svoiludi.ch/organizacii/">')
head = head.replace('<meta name="robots" content="noindex, nofollow">\n', '')
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{D}">', head)
head = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{OGT}">', head)
head = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{OGD}">', head)
head = head.replace('https://svoiludi.ch/vakansii/og-image.jpg', 'https://svoiludi.ch/organizacii/og-image.jpg').replace('<meta property="og:url" content="https://svoiludi.ch/vakansii/">', '<meta property="og:url" content="https://svoiludi.ch/organizacii/">')
assert 'vakansii' not in re.sub(r'<style.*?</style>', '', head, flags=re.S), 'в шапке осталась ссылка на вакансии'
extra = open(os.path.join(HERE, 'extra.css'), encoding='utf-8').read()
head = head + '<style id="org-extra">' + extra + '</style>\n'
top = top.replace(' aria-current="page" style="color:var(--ink)"', '')   # в меню нет пункта «Организации» — ничего не выделяем
body = open(os.path.join(HERE, 'body.html'), encoding='utf-8').read()
js = open(os.path.join(HERE, 'script.js'), encoding='utf-8').read()
tail = f'''
<script src="/data/organizations.js?v={ver('data/organizations.js')}"></script>
<script src="/data/afisha.js?v={ver('data/afisha.js')}"></script>
<script src="/data/vacancies.js?v={ver('data/vacancies.js')}"></script>
<script>
{js}</script>
<script src="/assets/help.js" defer></script>
<script data-goatcounter="https://svoiludi.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
<script src="/assets/share.js" defer></script>
<script src="/assets/samesite.js"></script>
</body>
</html>
'''
os.makedirs('organizacii', exist_ok=True)
page = head + top + body + tail
open('organizacii/index.html', 'w', encoding='utf-8').write(page)
print('ok: organizacii/index.html', len(page))
