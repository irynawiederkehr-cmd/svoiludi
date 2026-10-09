"""ПРЕДПРОСМОТР КОПИИ для Ирины (07.10.2026): она смотрит невыложенные изменения как настоящий сайт по одной постоянной ссылке https://claude.ai/artifact/8whPvBXP54ytYF8gfRJQEN .
После каждой правки в ветке-копии: python3 _i18n/preview_copy.py . <папка>, положить _i18n/preview_copy_landing.html как <папка>/index.html и опубликовать артефакт по той же ссылке (root=<папка>, files=все файлы site/...).
Новые страницы копии — добавить в PAGES и INSET, ссылку — в оглавление preview_copy_landing.html."""
"""Собирает предпросмотр КОПИИ svoiludi.ch (ветка) для артефакта: папка out/site/... + out/index.html (оглавление).
Запуск: python3 preview_site.py <repo> <out>"""
import sys, os, re, shutil, json, datetime
REPO, OUT = sys.argv[1], sys.argv[2]
PAGES = ['index.html', 'vakansii/index.html', 'events/index.html', 'join/index.html']
INSET = {'vakansii', 'events', 'join'}
LIVE = 'https://svoiludi.ch/'
ASSETS = ['assets/fonts.css', 'assets/wm.css', 'assets/help.js', 'assets/share.js', 'assets/samesite.js',
          'assets/lib/html2canvas.min.js', 'assets/lib/jspdf.umd.min.js', 'assets/lib/qrcode.js', 'assets/lib/jszip.min.js',
          'assets/lib/leaflet/leaflet.css', 'assets/lib/leaflet/leaflet.js', 'data/specialists.js', 'data/vacancies.js', 'fav/favicon.svg']
ASSETS += ['assets/fonts/' + f for f in os.listdir(os.path.join(REPO, 'assets/fonts'))]
ASSETS += ['img/' + f for f in os.listdir(os.path.join(REPO, 'img'))]
BANNER = ('<div style="position:sticky;top:0;z-index:999;background:#2f2924;color:#FFFCF8;font:600 13px/1.45 Manrope,system-ui,sans-serif;'
          'padding:8px 16px;text-align:center">Предпросмотр КОПИИ · на сайт не выложено · {date}. Карты и часть ссылок здесь не работают.</div>')

def fix(html, depth):
    up = '../' * depth
    html = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', html, flags=re.S)
    html = re.sub(r'(src|href)="/(data|assets|img|fav)/', lambda m: f'{m.group(1)}="{up}{m.group(2)}/', html)
    html = re.sub(r'href="/(vakansii|events|join)/', lambda m: f'href="{up}{m.group(1)}/index.html', html)
    # каталоги внутри предпросмотра → явный index.html
    def dirlink(m):
        pre, d, rest = m.group(1), m.group(2), m.group(3)
        if d in INSET: return f'{pre}{d}/index.html{rest}'
        return f'{pre}{d}/{rest}'
    html = re.sub(r'((?:href="|`)(?:\.\./|\./)?)(vakansii|events|join)/(#|"|`)', dirlink, html)
    html = re.sub(r'((?:href="|`)(?:\.\./)?)(vakansii|events|join)/(#\$\{)', dirlink, html)
    html = html.replace('href="./"', 'href="index.html"').replace('href="../"', 'href="../index.html"').replace('href="../#', 'href="../index.html#')
    html = html.replace('`../#${', '`../index.html#${')
    # всё, чего нет в предпросмотре, — на живой сайт
    for d in ['instrumenty', 'opros', 'badge', 'privacy']:
        html = re.sub(rf'href="(?:\.\./|\./)?{d}/', f'href="{LIVE}{d}/', html)
    html = html.replace('href="files/anketa', f'href="{LIVE}join/files/anketa')
    html = html.replace('<body>', '<body>\n' + BANNER.format(date=datetime.date.today().strftime('%d.%m.%Y')), 1)
    return html

if os.path.exists(OUT): shutil.rmtree(OUT)
for p in PAGES:
    src = open(os.path.join(REPO, p), encoding='utf-8').read()
    dst = os.path.join(OUT, 'site', p); os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(fix(src, p.count('/')))
for a in ASSETS:
    dst = os.path.join(OUT, 'site', a); os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy(os.path.join(REPO, a), dst)
files = {}
for root, _, fs in os.walk(os.path.join(OUT, 'site')):
    for f in fs:
        full = os.path.join(root, f); files[os.path.relpath(full, OUT)] = full
json.dump(files, open(os.path.join(OUT, 'files.json'), 'w'), ensure_ascii=False, indent=0)
print(len(files), 'files')
