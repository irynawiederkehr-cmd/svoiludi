"""Сайт как приложение (08.10.2026): в <head> каждой русской страницы из PAGES ставит блок <!--pwa-->…<!--pwa-->:
манифест, иконка и мета-теги для iPhone/iPad/Android и скрипт /assets/pwa-app.js (панель вкладок, подсказка об установке).
Украинские страницы получают его при сборке pages.py (манифест site.uk.webmanifest — в post()).
Запуск: python3 _i18n/pwa.py — ставит/обновляет; python3 _i18n/pwa.py check — страницы без блока."""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from pages import PAGES, ROOT
M = '<!--pwa-->'
TILES = 'html header.top nav[aria-label] a .pa-ni{display:none}@media (max-width:1100px){html header.top .page{flex-wrap:wrap;row-gap:8px}html header.top nav[aria-label]{order:3;width:100%;display:grid!important;grid-template-columns:repeat(var(--pa-cols,3),minmax(0,1fr));gap:8px;overflow:visible;padding:4px 0 12px;margin:0}html header.top nav[aria-label] a{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:62px;padding:9px 6px;border-radius:14px;background:var(--paper,#FFFCF8);border:1px solid color-mix(in srgb,var(--sage,#66704F) 30%,transparent);box-shadow:0 3px 10px -6px rgba(60,70,40,.45);color:var(--ink,#2F2924)!important;font:600 .78rem/1.18 var(--body,system-ui);text-align:center;white-space:normal;text-decoration:none;-webkit-tap-highlight-color:transparent}html header.top nav[aria-label] a::after{content:none!important}html header.top nav[aria-label] a .pa-ni{display:block;width:22px;height:22px;fill:none;stroke:var(--sage,#66704F);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}html header.top nav[aria-label] a[aria-current="page"]{background:var(--sage,#66704F);border-color:var(--sage,#66704F);color:var(--paper,#FFFCF8)!important;box-shadow:0 4px 12px -6px rgba(60,70,40,.6)}html header.top nav[aria-label] a[aria-current="page"] .pa-ni{stroke:var(--paper,#FFFCF8)}html header.top nav[aria-label] a:active{transform:scale(.97)}}'
BLOCK = (M + '<link rel="manifest" href="/fav/site.webmanifest">'
         '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
         '<meta name="apple-mobile-web-app-title" content="Свои люди"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
         '{extra}<style id="pa-tiles">/* верхнее меню на телефоне и планшете: прямоугольные плитки с закруглением в два ряда, иконки ставит pwa-app.js (08.10.2026) */' + TILES + '</style>'
         '<script src="/assets/pwa-app.js" defer></script>' + M)

def apply(html):
    html = re.sub(re.escape(M) + '.*?' + re.escape(M), '', html, flags=re.S)
    html = re.sub(r'<link rel="manifest" href="[^"]*">', '', html)
    extra = ''
    if 'apple-touch-icon' not in html: extra += '<link rel="apple-touch-icon" href="/fav/apple-touch-icon.png">'
    if 'name="theme-color"' not in html: extra += '<meta name="theme-color" content="#4F5E3E">'
    b = BLOCK.replace('{extra}', extra)
    i = html.find('<!--i18n-->'); j = html.find('</head>')
    pos = i if 0 <= i < j else j
    return html[:pos] + b + html[pos:]

if __name__ == '__main__':
    bad = []
    for src, _ in PAGES:
        p = os.path.join(ROOT, src); h = open(p, encoding='utf-8').read()
        if len(sys.argv) > 1 and sys.argv[1] == 'check':
            if M not in h: bad.append(src)
            continue
        n = apply(h)
        if n != h: open(p, 'w', encoding='utf-8').write(n)
    print('Без блока приложения:', bad) if bad else print('Блок приложения есть на всех страницах' if len(sys.argv) > 1 else 'ok')
