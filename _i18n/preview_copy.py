"""ПРЕДПРОСМОТР КОПИИ для Ирины (07.10.2026): она смотрит невыложенные изменения как настоящий сайт по одной постоянной ссылке https://claude.ai/artifact/8whPvBXP54ytYF8gfRJQEN .
После каждой правки в ветке-копии: python3 _i18n/preview_copy.py . <папка>, положить _i18n/preview_copy_landing.html как <папка>/index.html и опубликовать артефакт по той же ссылке (root=<папка>, files=все файлы site/...).
Новые страницы копии — добавить в PAGES и INSET, ссылку — в оглавление preview_copy_landing.html."""
"""Собирает предпросмотр КОПИИ svoiludi.ch (ветка) для артефакта: папка out/site/... + out/index.html (оглавление).
Запуск: python3 preview_site.py <repo> <out>"""
import sys, os, re, shutil, json, datetime
REPO, OUT = sys.argv[1], sys.argv[2]
TOOLS = ['zarplata', 'ekstrennye-nomera', 'put-obrazovaniya', 'yazyk-trebovaniya', 'strahovki-obyazatelnye', 'nalogi-shema', 'pensiya-shema', 'grazhdanstvo-shema', 'diplomy-shema', 'franshiza-shema', 'kuda-obratitsya', 'rezyume', 'uchet-vremeni', 'chasy-po-klientam', 'moj-budget', 'moj-den', 'moj-god', 'moi-emocii']
SHV = ['shveycariya/index.html'] + ['shveycariya/' + d + '/index.html' for d in sorted(os.listdir(os.path.join(REPO, 'shveycariya'))) if os.path.isdir(os.path.join(REPO, 'shveycariya', d))] if os.path.isdir(os.path.join(REPO, 'shveycariya')) else []
PAGES = SHV + ['index.html', 'vakansii/index.html', 'kursy/index.html', 'events/index.html', 'join/index.html', 'instrumenty/index.html'] + ['instrumenty/' + t + '/index.html' for t in TOOLS]
INSET = {'vakansii', 'kursy', 'events', 'join', 'shveycariya'}
LIVE = 'https://svoiludi.ch/'
ASSETS = ['assets/fonts.css', 'assets/wm.css', 'assets/help.js', 'assets/share.js', 'assets/samesite.js',
          'assets/lib/html2canvas.min.js', 'assets/lib/jspdf.umd.min.js', 'assets/lib/qrcode.js', 'assets/lib/jszip.min.js',
          'assets/lib/leaflet/leaflet.css', 'assets/lib/leaflet/leaflet.js', 'data/specialists.js', 'data/vacancies.js', 'data/afisha.js', 'fav/favicon.svg', 'assets/temy.css', 'assets/temy.js', 'assets/kantony.js', 'assets/rezyume-data.js', 'assets/shema.js']
ASSETS += ['assets/fonts/' + f for f in os.listdir(os.path.join(REPO, 'assets/fonts'))]
ASSETS += ['img/' + f for f in os.listdir(os.path.join(REPO, 'img'))]
ASSETS += ['assets/lib/fonts-pdf/' + f for f in os.listdir(os.path.join(REPO, 'assets/lib/fonts-pdf'))] if os.path.isdir(os.path.join(REPO, 'assets/lib/fonts-pdf')) else []
ASSETS += [a for a in ['assets/pdffan.js', 'assets/backup.js', 'assets/lib/exceljs.min.js', 'assets/lib/pdf-lib.min.js', 'assets/lib/pdfjs/pdf.min.js', 'assets/lib/pdfjs/pdf.worker.min.js'] if os.path.exists(os.path.join(REPO, a))]
for dp, dn, fn in os.walk(os.path.join(REPO, 'instrumenty/preview')):
    ASSETS += [os.path.relpath(os.path.join(dp, f), REPO) for f in fn if f.endswith('.jpg')]
BANNER = ('<div style="position:fixed;left:0;right:0;top:0;z-index:2147483000;box-shadow:0 4px 14px rgba(0,0,0,.18);background:#2f2924;color:#FFFCF8;font:600 13px/1.45 Manrope,system-ui,sans-serif;'
          'padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center;justify-content:center;text-align:center">'
          '<a href="{home}" style="background:#FFFCF8;color:#2f2924;border-radius:999px;padding:5px 14px;text-decoration:none;font-weight:800;white-space:nowrap">← Список копии</a>'
          '<a href="javascript:history.back()" style="color:#FFFCF8;text-decoration:underline;white-space:nowrap">Назад</a>'
          '<span>Предпросмотр КОПИИ · на сайт не выложено · {date}</span></div><div style="height:44px"></div>')

SHVD = set(p.split('/')[1] for p in SHV if p.count('/') == 2)

def fix(html, depth):
    up = '../' * depth
    html = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', html, flags=re.S)
    html = re.sub(r'(src|href)="/(data|assets|img|fav)/', lambda m: f'{m.group(1)}="{up}{m.group(2)}/', html)
    html = re.sub(r'href="/(vakansii|kursy|events|join|shveycariya)/', lambda m: f'href="{up}{m.group(1)}/index.html', html)
    # каталоги внутри предпросмотра → явный index.html
    def dirlink(m):
        pre, d, rest = m.group(1), m.group(2), m.group(3)
        if d in INSET: return f'{pre}{d}/index.html{rest}'
        return f'{pre}{d}/{rest}'
    html = re.sub(r'((?:href="|`)(?:\.\./|\./)?)(vakansii|kursy|events|join|shveycariya)/(#|"|`)', dirlink, html)
    html = re.sub(r'((?:href="|`)(?:\.\./)?)(vakansii|kursy|events|join|shveycariya)/(#\$\{)', dirlink, html)
    html = html.replace('href="./"', 'href="index.html"').replace('href="../"', 'href="../index.html"').replace('href="../#', 'href="../index.html#')
    html = html.replace('`../#${', '`../index.html#${')
    html = re.sub(r"'((?:\.\./)?)(vakansii|kursy|events|join|shveycariya)/#'", lambda m: f"'{m.group(1)}{m.group(2)}/index.html#'", html)   # ссылки афиши в карточке
    # инструменты — внутри предпросмотра
    html = re.sub(r'href="(?:https://svoiludi\.ch)?/instrumenty/((?:[a-z-]+/)?)(#[^"]*)?"', lambda m: f'href="{up}instrumenty/{m.group(1)}index.html{m.group(2) or ""}"', html)
    # «Как устроена Швейцария»: ссылки на папки внутри вкладки и на главную с карточкой → явный index.html
    html = re.sub(r'href="((?:\.\./)*)([a-z0-9-]+)/"', lambda m: f'href="{m.group(1)}{m.group(2)}/index.html"' if m.group(2) in ('permit-b','betreibung','nalogovaya-deklaraciya') or m.group(2) in SHVD else m.group(0), html)
    html = re.sub(r'href="((?:\.\./)+)(events|join|kursy|vakansii|instrumenty|shveycariya)/((?:[a-z0-9-]+/)?)"', lambda m: f'href="{m.group(1)}{m.group(2)}/{m.group(3)}index.html"', html)
    html = re.sub(r'href="((?:\.\./)+)"', lambda m: f'href="{m.group(1)}index.html"', html)
    html = html.replace("'<a class=\"sp\" href=\"' + root + '#'", "'<a class=\"sp\" href=\"' + root + 'index.html#'")
    html = html.replace('<head>', '<head><script>window.PV_BASE = ' + repr(up) + ';</script>', 1)
    # всё, чего нет в предпросмотре, — на живой сайт
    for d in ['opros', 'badge', 'privacy']:
        html = re.sub(rf'href="(?:\.\./|\./)?{d}/', f'href="{LIVE}{d}/', html)
    html = html.replace('href="files/anketa', f'href="{LIVE}join/files/anketa')
    html = re.sub(r'(<body[^>]*>)', lambda m: m.group(1) + '\n' + BANNER.format(home=up + '../index.html', date=datetime.date.today().strftime('%d.%m.%Y')), html, count=1)
    return html

if os.path.exists(OUT): shutil.rmtree(OUT)
for p in PAGES:
    src = open(os.path.join(REPO, p), encoding='utf-8').read()
    dst = os.path.join(OUT, 'site', p); os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(fix(src, p.count('/')))
for a in ASSETS:
    dst = os.path.join(OUT, 'site', a); os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy(os.path.join(REPO, a), dst)
    if a == 'assets/temy.js':
        t = open(dst, encoding='utf-8').read().replace("root + '#' + encodeURIComponent", "root + 'index.html#' + encodeURIComponent").replace("href=\"' + root + 'join/", "href=\"' + root + 'join/index.html")
        open(dst, 'w', encoding='utf-8').write(t)
    if a == 'assets/pdffan.js':   # картинки веера — от папки предпросмотра, а не от корня сайта
        t = open(dst, encoding='utf-8').read().replace("it.img = '/instrumenty/preview/'", "it.img = (window.PV_BASE || '/') + 'instrumenty/preview/'")
        open(dst, 'w', encoding='utf-8').write(t)
files = {}
for root, _, fs in os.walk(os.path.join(OUT, 'site')):
    for f in fs:
        full = os.path.join(root, f); files[os.path.relpath(full, OUT)] = full
json.dump(files, open(os.path.join(OUT, 'files.json'), 'w'), ensure_ascii=False, indent=0)
print(len(files), 'files')
