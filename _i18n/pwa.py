"""Сайт как приложение (08.10.2026): в <head> каждой русской страницы из PAGES ставит блок <!--pwa-->…<!--pwa-->:
манифест, иконка и мета-теги для iPhone/iPad/Android и скрипт /assets/pwa-app.js (панель вкладок, подсказка об установке).
Украинские страницы получают его при сборке pages.py (манифест site.uk.webmanifest — в post()).
Запуск: python3 _i18n/pwa.py — ставит/обновляет; python3 _i18n/pwa.py check — страницы без блока."""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from pages import PAGES, ROOT
import topnav
M = '<!--pwa-->'
SHAPE = '/* кнопки сайта — прямоугольные с закруглением, как плитки меню (решение Ирины 08.10.2026); значки-метки (образец, теги, «?») остаются круглыми */:is(.navcta,.btn,.shr-btn,.pl-act a,.pl-act button,.qa,.more,.listbar button,.leaflet-popup-content button,.calmenu a,.calmenu button,.go-free,.find,.confirm,.monthics,.addb,.mbtn,.example,.viewsw,#langbar.langbar,.pa-go,.pa-x,.pa-foot){border-radius:12px!important}:is(.viewsw button,.seg button,.chips button,#langbar.langbar a,.cal-nav button){border-radius:9px!important}'
TILES = 'html header.top nav[aria-label] a .pa-ni{display:none}@media (max-width:1100px){html header.top .page{flex-wrap:wrap;row-gap:8px}html header.top nav[aria-label]{order:3;width:100%;display:grid!important;grid-template-columns:repeat(var(--pa-cols,3),minmax(0,1fr));gap:8px;overflow:visible;padding:4px 0 12px;margin:0}html header.top nav[aria-label] a{display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:5px;min-height:62px;padding:9px 6px;border-radius:14px;background:var(--paper,#FFFCF8);border:1px solid color-mix(in srgb,var(--sage,#66704F) 30%,transparent);box-shadow:0 3px 10px -6px rgba(60,70,40,.45);color:var(--ink,#2F2924)!important;font:600 .78rem/1.18 var(--body,system-ui);text-align:center;white-space:normal;text-decoration:none;-webkit-tap-highlight-color:transparent}html header.top nav[aria-label] a::after{content:none!important}html header.top nav[aria-label] a.pa-dup{display:none!important}html header.top nav[aria-label] a .pa-ni{display:block;width:22px;height:22px;fill:none;stroke:var(--sage,#66704F);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}html header.top nav[aria-label] a[aria-current="page"]{background:var(--sage,#66704F);border-color:var(--sage,#66704F);color:var(--paper,#FFFCF8)!important;box-shadow:0 4px 12px -6px rgba(60,70,40,.6)}html header.top nav[aria-label] a[aria-current="page"] .pa-ni{stroke:var(--paper,#FFFCF8)}html header.top nav[aria-label] a:active{transform:scale(.97)}}/* компьютер — как на сайте Ирины (решение 09.10.2026): на широком экране одна строка «логотип · меню · поиск · кнопка», пункты простым текстом, текущий — тёмным и жирным; на узком ноутбуке (1101–1359 px) меню переносится отдельной строкой под логотип, без переносов внутри пунктов */@media (min-width:1101px){html header.top .page{flex-wrap:wrap;row-gap:0;column-gap:14px}html header.top .mark{flex:none}html header.top .mark b,html header.top .mark small{white-space:nowrap}html header.top .page>.ss-btn{margin-left:auto}html header.top nav[aria-label]{order:3;flex:1 0 100%;display:flex!important;flex-wrap:nowrap;justify-content:center;gap:4px;overflow:visible;margin:8px 0 -2px;padding:6px 0 0;border-top:1px solid color-mix(in srgb,var(--sage,#66704F) 22%,transparent);font-size:.92rem}html header.top nav[aria-label] a{white-space:nowrap;padding:6px 10px;color:var(--muted,#6B635A);font-weight:500;text-decoration:none}html header.top nav[aria-label] a:hover{color:var(--ink,#2F2924)}html header.top nav[aria-label] a[aria-current="page"]{color:var(--ink,#2F2924)!important;font-weight:700}}@media (min-width:1360px){html header.top .page{flex-wrap:nowrap;max-width:1340px}html header.top nav[aria-label]{order:0;flex:0 1 auto;margin:0 auto;padding:0;border-top:0;gap:2px}html header.top nav[aria-label] a{padding:6px 9px}html header.top .page>.ss-btn{margin-left:0}html header.top .page>.ss-btn span{display:none}}'
BLOCK = (M + '<link rel="manifest" href="/fav/site.webmanifest">'
         '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
         '<meta name="apple-mobile-web-app-title" content="Свои люди"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
         '{extra}<style id="pa-tiles">/* верхнее меню на телефоне и планшете: прямоугольные плитки с закруглением в два ряда, иконки ставит pwa-app.js (08.10.2026) */' + TILES + SHAPE + '</style>'
         '<script src="/assets/pwa-app.js" defer></script>' + M)

def apply(html):
    html = re.sub(re.escape(M) + '.*?' + re.escape(M), '', html, flags=re.S)
    html = re.sub(r'<link rel="manifest" href="[^"]*">', '', html)
    extra = ''
    if 'apple-touch-icon' not in html: extra += '<link rel="apple-touch-icon" href="/fav/apple-touch-icon.png">'
    if 'name="theme-color"' not in html: extra += '<meta name="theme-color" content="#4F5E3E">'
    b = BLOCK.replace('{extra}', extra + topnav.CSS)
    i = html.find('<!--i18n-->'); j = html.find('</head>')
    pos = i if 0 <= i < j else j
    return html[:pos] + b + html[pos:]

if __name__ == '__main__':
    bad = []
    HOME = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
    for src, _url in PAGES:
        p = os.path.join(ROOT, src); h = open(p, encoding='utf-8').read()
        if len(sys.argv) > 1 and sys.argv[1] == 'check':
            if M not in h: bad.append(src)
            continue
        n = apply(topnav.apply(h, _url, HOME) if len(sys.argv) == 1 else h)
        if n != h: open(p, 'w', encoding='utf-8').write(n)
    print('Без блока приложения:', bad) if bad else print('Блок приложения есть на всех страницах' if len(sys.argv) > 1 else 'ok')
