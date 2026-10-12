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
# «Некоммерческое» (решение Ирины 12.10.2026): маленькое зелёное сердечко перед каждым «не коммерческая услуга», «поддержка сообщества»,
# «размещение бесплатно всегда» — по нему на всём сайте узнают то, что делается для сообщества бесплатно. Новое место — класс sl-nk
# у метки (<span class="sl-nk">…</span>) или пустой <i class="sl-nk" aria-hidden="true"></i> перед фразой в тексте. Розовые сердечки с числом —
# только «нравится» (index.html, likeBtn), их с этим знаком не путать. Старые метки (.free-line, .vac-note b) получают знак без правки разметки.
NK_HEART = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.2C11.5 20.9 3 15.9 3 9.3 3 6.4 5.2 4.2 8 4.2c1.7 0 3.1.8 4 2.1.9-1.3 2.3-2.1 4-2.1 2.8 0 5 2.2 5 5.1 0 6.6-8.5 11.6-9 11.9z'/%3E%3C/svg%3E")
NK = ('<style id="sl-nk-css">/* «Некоммерческое» — зелёное сердечко (12.10.2026), собирается _i18n/pwa.py */'
      ':is(.sl-nk,.free-line,.vac-note>b:first-child)::before{content:"";display:inline-block;flex:none;width:.95em;height:.95em;margin:0 .32em -.13em 0;'
      'background:var(--brown,#4F5E3E);-webkit-mask:url("' + NK_HEART + '") center/contain no-repeat;mask:url("' + NK_HEART + '") center/contain no-repeat}'
      'i.sl-nk{font-style:normal}i.sl-nk::before{margin-right:.28em}.free-badge.sl-nk::before{margin:0;width:1.05em;height:1.05em}</style>')
# «Росток» — единый маркер списков на всех страницах обоих сайтов (решение Ирины 12.10.2026, 22:29: вариант 3 «Росток»; «на будущее запоминай…
# ставишь мне эти черные точки как в вордовском файле»). Стебелёк с двумя листиками, цвет сайта (здесь шалфей, на voznesenskaya.ch коричневый).
# Рисунок — маска, цвет — --sl-bul-c, поэтому в тёмной теме и в цветных списках (карточки инструментов, --c) он перекрашивается сам.
# Новый список: ul без класса и без id (где угодно, кроме меню, кнопок и BUL_NOT) получает росток сам; ul с классом — допиши класс в BUL_UL;
# список данных без маркера (строки, суммы) — класс no-bul или контейнер в BUL_NOT.
# Не трогаем: нумерацию (ol), галочки ✓ в пакетах и «Как мы проверяем», красный треугольник предупреждений, меню и вкладки.
BUL_SVG = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%23000' stroke-width='1.6' "
           "stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M10 18V9'/%3E%3Cpath d='M10 12C6 12 3.5 9.5 3.5 6 7 6 10 8.2 10 12Z' "
           "fill='%23000' fill-opacity='.3'/%3E%3Cpath d='M10 9.5C10 5.5 12.5 3 16.5 3 16.5 6.8 14 9.5 10 9.5Z' fill='%23000' fill-opacity='.3'/%3E%3C/svg%3E")
BUL_UL = ('ul.ul,ul.marks,ul.facts,ul.k-rules,ul.effects,ul.regdoc,ul.big,ul.svplan,ul.sl-bul,ul.adm-todo,.tool ul,'
          'ul:not([class]):not([id])')
BUL_NOT = 'nav ul,header ul,footer ul,button ul,[role=navigation] ul,.pa-tabs ul,.cn-free ul,.mc ul,.no-bul'
BUL = ('<style id="sl-bul-css">/* «Росток» — единый маркер списков (12.10.2026), собирается _i18n/pwa.py */'
       ':root{--sl-bul-c:#66704F}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--sl-bul-c:#A9B98F}}:root[data-theme="dark"]{--sl-bul-c:#A9B98F}'
       ':where(:is(' + BUL_UL + '):not(' + BUL_NOT + ')){list-style:none!important;padding-left:0!important}'
       ':where(:is(' + BUL_UL + '):not(' + BUL_NOT + '))>li{list-style:none!important;position:relative!important;padding-left:1.7em!important}'
       ':where(:is(' + BUL_UL + '):not(' + BUL_NOT + '))>li::marker{content:none}'
       ':where(:is(' + BUL_UL + '):not(' + BUL_NOT + '))>li::before{content:""!important;display:block!important;position:absolute!important;left:.05em!important;top:.2em!important;'
       'width:1.15em!important;height:1.15em!important;margin:0!important;border:0!important;border-radius:0!important;transform:none!important;box-shadow:none!important;'
       'background:var(--sl-bul-c)!important;-webkit-mask:url("' + BUL_SVG + '") center/contain no-repeat!important;mask:url("' + BUL_SVG + '") center/contain no-repeat!important}'
       '.tool ul>li::before{background:var(--c,var(--sl-bul-c))!important}'
       '@media print{:is(' + BUL_UL + '):not(' + BUL_NOT + ')>li::before{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style>')
BLOCK = (M +'<link rel="manifest" href="/fav/site.webmanifest">'
         '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
         '<meta name="apple-mobile-web-app-title" content="Свои люди"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
         '{extra}<style id="pa-tiles">/* верхнее меню на телефоне и планшете: прямоугольные плитки с закруглением в два ряда, иконки ставит pwa-app.js (08.10.2026) */' + TILES + SHAPE + '</style>'
         + NK + BUL + '<script src="/assets/pwa-app.js" defer></script>' + M)

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
