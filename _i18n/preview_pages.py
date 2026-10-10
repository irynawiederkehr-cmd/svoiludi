"""Живой предпросмотр нескольких страниц копии для «Копии svoiludi.ch» (10.10.2026).
Страницы работают по-настоящему (фильтры, окна, подсказки), ссылки между ними — внутри предпросмотра, всё остальное — на живой сайт.
Запуск из корня репозитория: python3 _i18n/preview_pages.py <папка> organizacii vakansii uk/organizacii uk/vakansii
Результат: <папка>/<страница>/index.html + assets, data, fav, img. Публикуется вместе с оглавлением копии (files в Artifact).
Без приложения (pwa-app.js, вопрос о языке, сервис-воркер) и без счётчика: в предпросмотре они не нужны."""
import sys, os, re, shutil, datetime
from urllib.parse import urljoin, urlsplit
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT, PAGES = sys.argv[1], [p.strip('/') for p in sys.argv[2:]]
LIVE = 'https://svoiludi.ch/'
INSIDE = {'/' + p + '/' for p in PAGES}
BANNER = ('<div style="position:sticky;top:0;z-index:999;background:#2f2924;color:#FFFCF8;font:600 13px/1.45 Manrope,system-ui,sans-serif;'
          'padding:8px 16px;text-align:center">Предпросмотр КОПИИ · на сайт не выложено · {d}. Меню ведёт на настоящий сайт.</div>')

def local(target, page):
    """ссылка на страницу внутри предпросмотра — относительно текущей страницы, с index.html"""
    sp = urlsplit(target)
    up = '../' * page.count('/') + '../'
    return up + sp.path.strip('/') + '/index.html' + (('#' + sp.fragment) if sp.fragment else '')

def fix_href(m, page, base):
    attr, url = m.group(1), m.group(2)
    if url.startswith(('#', 'mailto:', 'tel:', 'data:', 'javascript:')) or '${' in url: return m.group(0)
    if re.match(r'https?://', url) and not url.startswith(LIVE): return m.group(0)
    full = urljoin(LIVE + (base.lstrip('/') if base else page + '/'), url)   # украинские страницы считают ссылки от <base> русской
    path = urlsplit(full).path
    if page.startswith('uk/') and '/uk' + path in INSIDE: full, path = full.replace(LIVE, LIVE + 'uk/', 1), '/uk' + path   # на сайте RU-ссылку переводит на /uk/ выбранный язык
    if re.match(r'/(assets|data|fav|img)/', path):   # файлы — в копию рядом
        return f'{attr}="{"../" * (page.count("/") + 1)}{full[len(LIVE):]}"'
    if path in INSIDE: return f'{attr}="{local(full, page)}"'
    return f'{attr}="{full}"'

def build(page):
    html = open(os.path.join(ROOT, page, 'index.html'), encoding='utf-8').read()
    html = re.sub(r'<script src="/assets/pwa-app\.js"[^>]*></script>\s*', '', html)
    html = re.sub(r'<link rel="manifest"[^>]*>\s*', '', html)
    html = re.sub(r'<script data-goatcounter[^>]*></script>\s*', '', html)
    bm = re.search(r'<base href="([^"]*)">\s*', html); base = bm.group(1) if bm else ''
    if bm: html = html.replace(bm.group(0), '', 1)
    html = re.sub(r'\b(href|src)="([^"]*)"', lambda m: fix_href(m, page, base), html)
    # ссылки, которые собирает код страницы: ../vakansii/#…, /uk/organizacii/#…
    for p in PAGES:
        name = p.split('/')[-1]
        if p.startswith('uk/') == page.startswith('uk/'):
            html = re.sub(rf"([`'\"])(\.\./){name}/#", lambda m: f"{m.group(1)}../{name}/index.html#", html)
        up = '../' * (page.count('/') + 1)
        for q in '`\'"': html = html.replace(f'{q}/{p}/#', f'{q}{up}{p}/index.html#')
    live = LIVE + ('uk/' if page.startswith('uk/') else '')   # остальные ссылки из кода страницы — на живой сайт
    html = html.replace("'../#'", f"'{live}#'").replace('href="../${', f'href="{live}${{')
    html = html.replace("window.IMG_BASE = '../img/'", f"window.IMG_BASE = '{'../' * (page.count('/') + 1)}img/'")
    html = html.replace('<body>', '<body>\n' + BANNER.format(d=datetime.date.today().strftime('%d.%m.%Y')), 1)
    os.makedirs(os.path.join(OUT, page), exist_ok=True)
    open(os.path.join(OUT, page, 'index.html'), 'w', encoding='utf-8').write(html)
    return set(re.findall(r'(?:src|href)="(?:\.\./)+((?:assets|data|fav|img)/[^"?#]+)', html))

need = set()
for p in PAGES: need |= build(p)
need |= {'assets/sitesearch.js', 'data/search.js', 'data/search.uk.js', 'data/specialists.js', 'data/specialists.uk.js', 'data/afisha.js', 'data/afisha.uk.js'}   # поиск в шапке
need |= {'assets/fonts/' + f for f in os.listdir(os.path.join(ROOT, 'assets/fonts'))} | {'img/' + f for f in os.listdir(os.path.join(ROOT, 'img'))}
for f in sorted(need):
    src = os.path.join(ROOT, f)
    if os.path.isfile(src):
        os.makedirs(os.path.dirname(os.path.join(OUT, f)), exist_ok=True); shutil.copy(src, os.path.join(OUT, f))
    else: print('нет файла:', f)
print('ok', len(PAGES), 'страниц,', len(need), 'файлов')
