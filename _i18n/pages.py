"""Украинская версия svoiludi.ch — зеркало русской: /uk/… из русских страниц.
Запуск из корня репозитория: python3 _i18n/pages.py — пишет uk/… и список непереведённого в _i18n/missing.json.
Память переводов: _i18n/tm_uk.json {ru: uk}; отдельные значения для одной страницы — _i18n/tm_uk_pages.json {страница: {ru: uk}}."""
import sys, os, re, json, hashlib
sys.path.insert(0, os.path.dirname(__file__))
from htmlunits import page_units, translate_page
from units import units_of as js_units, apply as js_apply
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
I18N = os.path.join(ROOT, '_i18n')
SITE = 'https://svoiludi.ch'
L = 'uk'
KEY = 'svoiludiLang'
PAGES = [('index.html', '/'), ('events/index.html', '/events/'), ('kursy/index.html', '/kursy/'), ('vakansii/index.html', '/vakansii/'), ('join/index.html', '/join/'), ('opros/index.html', '/opros/'),
         ('badge/index.html', '/badge/'), ('instrumenty/index.html', '/instrumenty/'), ('instrumenty/moj-den/index.html', '/instrumenty/moj-den/'),
         ('instrumenty/moj-god/index.html', '/instrumenty/moj-god/'), ('instrumenty/moi-emocii/index.html', '/instrumenty/moi-emocii/'),
         ('instrumenty/moj-budget/index.html', '/instrumenty/moj-budget/'),
         ('instrumenty/uchet-vremeni/index.html', '/instrumenty/uchet-vremeni/'), ('privacy/index.html', '/privacy/'),
         ('instrumenty/chasy-po-klientam/index.html', '/instrumenty/chasy-po-klientam/'),
         ('instrumenty/rezyume/index.html', '/instrumenty/rezyume/'),
         ('instrumenty/zarplata/index.html', '/instrumenty/zarplata/'),
         ('instrumenty/anketa-klienta/index.html', '/instrumenty/anketa-klienta/'),
         ('instrumenty/bolezn-zarplata/index.html', '/instrumenty/bolezn-zarplata/'),
         ('instrumenty/diplomy-shema/index.html', '/instrumenty/diplomy-shema/'),
         ('instrumenty/dogovor-nyani/index.html', '/instrumenty/dogovor-nyani/'),
         ('instrumenty/dohody-rashody/index.html', '/instrumenty/dohody-rashody/'),
         ('instrumenty/dogovor-arendy-obrazec/index.html', '/instrumenty/dogovor-arendy-obrazec/'),
         ('instrumenty/grafik-prachechnoj/index.html', '/instrumenty/grafik-prachechnoj/'),
         ('instrumenty/obyavleniya-sosedyam/index.html', '/instrumenty/obyavleniya-sosedyam/'),
         ('instrumenty/protokol-kvartiry/index.html', '/instrumenty/protokol-kvartiry/'),
         ('instrumenty/dosye-arendatora/index.html', '/instrumenty/dosye-arendatora/'),
         ('instrumenty/ekstrennye-nomera/index.html', '/instrumenty/ekstrennye-nomera/'),
         ('instrumenty/etiketka-eda/index.html', '/instrumenty/etiketka-eda/'),
         ('instrumenty/franshiza-shema/index.html', '/instrumenty/franshiza-shema/'),
         ('instrumenty/grazhdanstvo-shema/index.html', '/instrumenty/grazhdanstvo-shema/'),
         ('instrumenty/ipoteka-raschet/index.html', '/instrumenty/ipoteka-raschet/'),
         ('instrumenty/kartochka-pitomca/index.html', '/instrumenty/kartochka-pitomca/'),
         ('instrumenty/kuda-obratitsya/index.html', '/instrumenty/kuda-obratitsya/'),
         ('instrumenty/moi-dannye/index.html', '/instrumenty/moi-dannye/'),
         ('instrumenty/musor-pamyatka/index.html', '/instrumenty/musor-pamyatka/'),
         ('instrumenty/nalogi-shema/index.html', '/instrumenty/nalogi-shema/'),
         ('instrumenty/obyavlenie-pitomec/index.html', '/instrumenty/obyavlenie-pitomec/'),
         ('instrumenty/pensiya-shema/index.html', '/instrumenty/pensiya-shema/'),
         ('instrumenty/pereezd-spisok/index.html', '/instrumenty/pereezd-spisok/'),
         ('instrumenty/pisma-arenda/index.html', '/instrumenty/pisma-arenda/'),
         ('instrumenty/pisma-prodavcu/index.html', '/instrumenty/pisma-prodavcu/'),
         ('instrumenty/plan-pohoda/index.html', '/instrumenty/plan-pohoda/'),
         ('instrumenty/posobiya-raschet/index.html', '/instrumenty/posobiya-raschet/'),
         ('instrumenty/proezdnoj-vybor/index.html', '/instrumenty/proezdnoj-vybor/'),
         ('instrumenty/put-obrazovaniya/index.html', '/instrumenty/put-obrazovaniya/'),
         ('instrumenty/schet-qr/index.html', '/instrumenty/schet-qr/'),
         ('instrumenty/srok-pisma/index.html', '/instrumenty/srok-pisma/'),
         ('instrumenty/sroki-goda/index.html', '/instrumenty/sroki-goda/'),
         ('instrumenty/statuty-fereyna/index.html', '/instrumenty/statuty-fereyna/'),
         ('instrumenty/strahovki-obyazatelnye/index.html', '/instrumenty/strahovki-obyazatelnye/'),
         ('instrumenty/tamozhnya-limity/index.html', '/instrumenty/tamozhnya-limity/'),
         ('instrumenty/yazyk-trebovaniya/index.html', '/instrumenty/yazyk-trebovaniya/'),
         ('instrumenty/zhurnal-shuma/index.html', '/instrumenty/zhurnal-shuma/'),
         ('instrumenty/vse-fayly/index.html', '/instrumenty/vse-fayly/'),
         ('shveycariya/index.html', '/shveycariya/'),
         ('shveycariya/arenda/index.html', '/shveycariya/arenda/'),
         ('shveycariya/bank/index.html', '/shveycariya/bank/'),
         ('shveycariya/beremennost/index.html', '/shveycariya/beremennost/'),
         ('shveycariya/betreibung/index.html', '/shveycariya/betreibung/'),
         ('shveycariya/bolezn-na-rabote/index.html', '/shveycariya/bolezn-na-rabote/'),
         ('shveycariya/bolezn-travma/index.html', '/shveycariya/bolezn-travma/'),
         ('shveycariya/brak-razvod/index.html', '/shveycariya/brak-razvod/'),
         ('shveycariya/drony-video/index.html', '/shveycariya/drony-video/'),
         ('shveycariya/rybalka-griby-ohota/index.html', '/shveycariya/rybalka-griby-ohota/'),
         ('shveycariya/voskresenye/index.html', '/shveycariya/voskresenye/'),
         ('shveycariya/detskie-posobiya/index.html', '/shveycariya/detskie-posobiya/'),
         ('shveycariya/diplomy/index.html', '/shveycariya/diplomy/'),
         ('shveycariya/dogovor-arendy/index.html', '/shveycariya/dogovor-arendy/'),
         ('shveycariya/domashniy-personal/index.html', '/shveycariya/domashniy-personal/'),
         ('shveycariya/dop-strahovanie/index.html', '/shveycariya/dop-strahovanie/'),
         ('shveycariya/fide/index.html', '/shveycariya/fide/'),
         ('shveycariya/gemeinde/index.html', '/shveycariya/gemeinde/'),
         ('shveycariya/grazhdanstvo/index.html', '/shveycariya/grazhdanstvo/'),
         ('shveycariya/kesb/index.html', '/shveycariya/kesb/'),
         ('shveycariya/kita-detsad/index.html', '/shveycariya/kita-detsad/'),
         ('shveycariya/medstrahovka/index.html', '/shveycariya/medstrahovka/'),
         ('shveycariya/musor/index.html', '/shveycariya/musor/'),
         ('shveycariya/nalogi/index.html', '/shveycariya/nalogi/'),
         ('shveycariya/nalogovaya-deklaraciya/index.html', '/shveycariya/nalogovaya-deklaraciya/'),
         ('shveycariya/nyani/index.html', '/shveycariya/nyani/'),
         ('shveycariya/pensiya/index.html', '/shveycariya/pensiya/'),
         ('shveycariya/permit-b/index.html', '/shveycariya/permit-b/'),
         ('shveycariya/permit-c/index.html', '/shveycariya/permit-c/'),
         ('shveycariya/permit-g/index.html', '/shveycariya/permit-g/'),
         ('shveycariya/permit-l/index.html', '/shveycariya/permit-l/'),
         ('shveycariya/pisma-sroki/index.html', '/shveycariya/pisma-sroki/'),
         ('shveycariya/pokupka-zhilya/index.html', '/shveycariya/pokupka-zhilya/'),
         ('shveycariya/poterya-raboty/index.html', '/shveycariya/poterya-raboty/'),
         ('shveycariya/prava-pokupatelya/index.html', '/shveycariya/prava-pokupatelya/'),
         ('shveycariya/pravila-doma/index.html', '/shveycariya/pravila-doma/'),
         ('shveycariya/priroda/index.html', '/shveycariya/priroda/'),
         ('shveycariya/professii-avto/index.html', '/shveycariya/professii-avto/'),
         ('shveycariya/professii-dom/index.html', '/shveycariya/professii-dom/'),
         ('shveycariya/professii-konsultirovanie/index.html', '/shveycariya/professii-konsultirovanie/'),
         ('shveycariya/professii-krasota/index.html', '/shveycariya/professii-krasota/'),
         ('shveycariya/professii-prepodavanie/index.html', '/shveycariya/professii-prepodavanie/'),
         ('shveycariya/profsoyuzy/index.html', '/shveycariya/profsoyuzy/'),
         ('shveycariya/psihoterapiya/index.html', '/shveycariya/psihoterapiya/'),
         ('shveycariya/rabota/index.html', '/shveycariya/rabota/'),
         ('shveycariya/samozanyatost/index.html', '/shveycariya/samozanyatost/'),
         ('shveycariya/shkola-lehre/index.html', '/shveycariya/shkola-lehre/'),
         ('shveycariya/shtrafy/index.html', '/shveycariya/shtrafy/'),
         ('shveycariya/skrytye-rashody/index.html', '/shveycariya/skrytye-rashody/'),
         ('shveycariya/sozialhilfe/index.html', '/shveycariya/sozialhilfe/'),
         ('shveycariya/status-f/index.html', '/shveycariya/status-f/'),
         ('shveycariya/status-n/index.html', '/shveycariya/status-n/'),
         ('shveycariya/status-s/index.html', '/shveycariya/status-s/'),
         ('shveycariya/strahovki/index.html', '/shveycariya/strahovki/'),
         ('shveycariya/tamozhnya/index.html', '/shveycariya/tamozhnya/'),
         ('shveycariya/transport/index.html', '/shveycariya/transport/'),
         ('shveycariya/trudovoe-pravo/index.html', '/shveycariya/trudovoe-pravo/'),
         ('shveycariya/vereine/index.html', '/shveycariya/vereine/'),
         ('shveycariya/vuz/index.html', '/shveycariya/vuz/'),
         ('shveycariya/zhivotnye/index.html', '/shveycariya/zhivotnye/')]
# «Устройство сайта» (09.10.2026): О проекте, Для специалистов, Что нового, Моя ситуация, тема «Адаптация»
PAGES += [x for x in [('o-proekte/index.html', '/o-proekte/'), ('dlya-specialistov/index.html', '/dlya-specialistov/'), ('novosti/index.html', '/novosti/'), ('situacii/index.html', '/situacii/'), ('shveycariya/adaptaciya/index.html', '/shveycariya/adaptaciya/'), ('situacii/tolko-priehala/index.html', '/situacii/tolko-priehala/'), ('situacii/rabota/index.html', '/situacii/rabota/'), ('situacii/deti/index.html', '/situacii/deti/'), ('situacii/dengi/index.html', '/situacii/dengi/'), ('situacii/zhilye/index.html', '/situacii/zhilye/'), ('situacii/svoe-delo/index.html', '/situacii/svoe-delo/'), ('situacii/zdorovye/index.html', '/situacii/zdorovye/'), ('situacii/pismo-problema/index.html', '/situacii/pismo-problema/')] if x not in PAGES]
OWN = sorted({p for _, p in PAGES}, key=len, reverse=True)
CODE_WORDS = ['ВСТРЕЧА', 'ОТЗЫВ', 'ЗАЯВКА', 'РАССЫЛКА', 'ПОРЯДОК']

def tm():
    t = json.load(open(os.path.join(I18N, 'tm_uk.json'), encoding='utf-8'))
    pp = os.path.join(I18N, 'tm_uk_pages.json')
    return t, (json.load(open(pp, encoding='utf-8')) if os.path.exists(pp) else {})

def resolve(base, url):
    """относительный адрес на странице base → путь от корня сайта"""
    if url.startswith('/'): stack = []
    else: stack = [x for x in base.split('/') if x]
    for seg in url.split('/'):
        if seg == '..': stack = stack[:-1]
        elif seg in ('', '.'): continue
        else: stack.append(seg)
    return '/' + '/'.join(stack) + ('/' if (url.endswith('/') or url in ('', '.', './', '..', '../')) and stack else '')

def own_uk(path):
    """путь своей страницы → её украинская версия (или None, если это не страница)"""
    p = path if path.endswith('/') else path
    if p in OWN: return '/uk' + p
    return None

def fix_links(html, base):
    # 1) ссылки на свои страницы в разметке: href="join/", href="../events/#x", href="/"
    def attr(m):
        url = m.group(2)
        if re.match(r'^(https?:|mailto:|tel:|data:|javascript:|\$\{)', url) or url.startswith('#'): return m.group(0)
        u, h = (url.split('#', 1) + [''])[:2]
        p = resolve(base, u)
        uk = own_uk(p)
        if not uk: return m.group(0)
        return f'{m.group(1)}="{uk}{"#" + h if "#" in url else ""}"'
    html = re.sub(r'\b(href)="([^"]*)"', attr, html)
    # 2) якоря внутри страницы: из-за <base> их нужно привязать к этой странице
    html = re.sub(r'href=(\\?["\'])#', lambda m: f'href={m.group(1)}/uk{base}#', html)
    # 3) пути к своим страницам в скриптах: 'join/', "../events/", `events/#${…}`
    def js(m):
        q, url, rest = m.group(1), m.group(2), m.group(3)
        uk = own_uk(resolve(base, url))
        return q + (uk or url) + rest
    html = re.sub(r"(['\"`])((?:\.\./)*(?:events|kursy|join|opros|badge|instrumenty(?:/[a-z-]+)?|shveycariya(?:/[a-z0-9-]+)?)/)(#|\1)", js, html)
    # 4) абсолютные ссылки https://svoiludi.ch/страница (в разметке, скриптах и готовых сообщениях)
    def absu(m):
        return SITE + (own_uk(m.group(1) or '/') or (m.group(1) or '/'))
    html = re.sub(r'https://svoiludi\.ch(/(?:events/|kursy/|join/|opros/|badge/|privacy/|instrumenty/(?:[a-z-]+/)?|shveycariya/(?:[a-z0-9-]+/)?)?)(?=["\'`#?<)\s]|$)', absu, html)
    # 4б) ссылки на сайт Ирины — на его украинскую версию
    html = re.sub(r'https://voznesenskaya\.ch/(#[\w-]*)?(?=["\'`<)\s])', lambda m: 'https://voznesenskaya.ch/uk/' + (m.group(1) or ''), html)
    html = re.sub(r'https://voznesenskaya\.ch/(privacy|impressum)/(?=["\'`<)\s])', lambda m: f'https://voznesenskaya.ch/{m.group(1)}/#lang=uk', html)
    # 5) смена адреса без перезагрузки: '#id' через <base> ушёл бы на русскую страницу
    html = html.replace("history.replaceState(null, '', '#'", "history.replaceState(null, '', location.pathname + '#'")
    return html

SWITCH_CSS = ('#langbar.langbar{position:fixed;bottom:14px;right:14px;z-index:60;display:flex;gap:2px;background:rgba(255,255,255,.92);'
              'border:1px solid rgba(0,0,0,.08);border-radius:999px;padding:3px;font:600 12px Manrope,system-ui,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.08)}'
              '#langbar.langbar a{color:#5d554d;padding:5px 9px;border-radius:999px;text-decoration:none;font:inherit;display:inline-block}'
              '#langbar.langbar a[aria-current="true"]{background:#2f2924;color:#fff}@media print{.langbar{display:none!important}}')
def switcher(cur, path):
    a = [f'<a href="{path}" hreflang="ru" data-lang="ru"{" aria-current=\"true\"" if cur == "ru" else ""}>RU</a>',
         f'<a href="/uk{path}" hreflang="uk" data-lang="uk"{" aria-current=\"true\"" if cur == "uk" else ""}>UA</a>']
    js = ("<script>(function(){var b=document.getElementById('langbar');if(!b)return;b.addEventListener('click',function(e){var a=e.target.closest('a[data-lang]');"
          f"if(a){{try{{localStorage.setItem('{KEY}',a.dataset.lang)}}catch(x){{}}a.href=a.getAttribute('href').split('#')[0]+location.hash;}}}});}})();</script>")
    return f'<style>{SWITCH_CSS}</style><div class="langbar" id="langbar" role="navigation" aria-label="Мова / Язык">' + ''.join(a) + '</div>' + js
def redirect_js(path):
    return ("<script>(function(){try{if(localStorage.getItem('" + KEY + "')==='uk'&&!/[?&]lang=ru/.test(location.search))"
            "location.replace('/uk" + path + "'+location.search+location.hash);}catch(e){}})();</script>")
def alternates(path):
    return f'<link rel="alternate" hreflang="ru" href="{SITE}{path}"><link rel="alternate" hreflang="uk" href="{SITE}/uk{path}">'
MARK = '<!--i18n-->'
def strip_injected(html): return re.sub(re.escape(MARK) + r'.*?' + re.escape(MARK), '', html, flags=re.S)
def head_inject(html, extra): return html.replace('</head>', extra + '</head>', 1)
def body_inject(html, extra):
    i = html.rfind('</body>'); return html[:i] + extra + html[i:]

def localize_assets(html, tr, missing):
    """общие файлы с русским текстом → украинские копии: share.js → share.uk.js, wm.css → wm.uk.css,
    data/specialists.js, data/afisha.js → *.uk.js (карточки; афиша — события, курсы, вебинары одной базой)"""
    def rep(m):
        folder, name = m.group(2), m.group(3)
        code = open(os.path.join(ROOT, folder, name + '.js'), encoding='utf-8').read()
        units = list(dict.fromkeys(js_units(code)))
        if not units: return m.group(0)
        miss = [u for u in units if u not in tr]
        if miss: missing.extend(u for u in miss if u not in missing); return m.group(0)
        uk = js_apply(code, tr)
        open(os.path.join(ROOT, folder, f'{name}.uk.js'), 'w', encoding='utf-8').write(uk)
        v = f'?v={ver(uk)}' if folder == 'data' else ''
        return f'{m.group(1)}/{folder}/{name}.uk.js{v}"'
    html = re.sub(r'(<script src=")/(assets|data)/([a-z]+)\.js(?:\?v=\w+)?"', rep, html)
    css = os.path.join(ROOT, 'assets', 'wm.css')
    if os.path.exists(css):
        s = open(css, encoding='utf-8').read()
        enc = lambda t: ''.join(c if c.isascii() and (c.isalnum() or c in '-_.~') else ''.join('%%%02X' % b for b in c.encode()) for c in t)
        s2 = s.replace(enc('Свои люди'), enc('Свої люди')).replace('Свои люди', 'Свої люди')
        open(os.path.join(ROOT, 'assets', 'wm.uk.css'), 'w', encoding='utf-8').write(s2)
        html = re.sub(r'href="((?:\.\./)*|/)?assets/wm\.css"', 'href="/assets/wm.uk.css"', html)
    return html

def post(html, src):
    """правки кода, которые зависят от языка не только словами"""
    html = re.sub(r"(['\"])ru-RU\1", r"\1uk-UA\1", html)                      # даты и числа по-украински
    html = html.replace('aria-label="Свои люди в Швейцарии — в начало"', 'aria-label="Свої люди у Швейцарії — на початок"')   # шапка (topnav.py)
    def ogimg(m):   # картинки превью ссылок — украинские, если есть (_i18n/og.js)
        rel = m.group(2); uk = rel[:-4] + '.uk.jpg'
        return m.group(1) + (uk if os.path.exists(os.path.join(ROOT, uk)) else rel)
    html = re.sub(r'(content="https://svoiludi\.ch/)([\w/.-]+?\.jpg)(?=")', ogimg, html)
    html = html.replace('/fav/site.webmanifest', '/fav/site.uk.webmanifest').replace('name="apple-mobile-web-app-title" content="Свои люди"', 'name="apple-mobile-web-app-title" content="Свої люди"')   # сайт как приложение (_i18n/pwa.py)
    html = re.sub(r"(localeCompare\([^()]*?,\s*)'ru'", r"\1'uk'", html)           # сортировка по украинскому алфавиту
    html = re.sub(r'href="(?:\.\./)*novosti/rss\.xml"', 'href="/uk/novosti/rss.xml"', html)   # ссылка «Лента новостей RSS» в блоке подписки на любой странице
    if src == 'novosti/index.html':   # «Что нового»: украинская лента RSS (_i18n/struktura_src/build.py)
        html = html.replace('href="rss.xml"', 'href="/uk/novosti/rss.xml"').replace('svoiludi.ch/novosti/rss.xml', 'svoiludi.ch/uk/novosti/rss.xml')
    if src == 'opros/index.html':
        html = opros_keep_russian_payload(html)
    if src == 'index.html':   # подтверждение карточки/прайс-листа: ответ специалисту — на языке страницы (как на сайте с 05.10.2026)
        html = html.replace('&lang=ru${text', '&lang=uk${text')
    if src == 'join/index.html':   # украинская анкета в Word (собирается _i18n/docx.py)
        html = html.replace("ANKETA = 'files/anketa.docx'", "ANKETA = 'files/anketa.uk.docx'")
        html = html.replace('href="files/anketa.docx" download="Анкета специалиста — Свои люди в Швейцарии.docx"',
                            'href="files/anketa.uk.docx" download="Анкета фахівця — Свої люди у Швейцарії.docx"')
    return html

def opros_keep_russian_payload(html):
    """в таблицу опроса уходят русские значения, чтобы ответы на обоих языках считались вместе"""
    TM, _ = tm()
    ru = open(os.path.join(ROOT, 'opros/index.html'), encoding='utf-8').read()
    m = re.search(r'const CATS = \{.*?\n\};', ru, re.S)
    vals = re.findall(r"'([^']*[А-яЁё][^']*)'", m.group(0)) if m else []
    for name in ('LANGS', 'FORMAT', 'PAY', 'WHEN'):
        mm = re.search(r'const ' + name + r' = \[(.*?)\];', ru)
        if mm: vals += re.findall(r"'([^']*)'", mm.group(1))
    back = {TM[v]: v for v in vals if v in TM}
    js = '<script>window.__RU = ' + json.dumps(back, ensure_ascii=False) + '; window.__UK = ' + json.dumps({v: k for k, v in back.items()}, ensure_ascii=False) + ';</script>'
    html = html.replace('</head>', js + '</head>', 1)
    reps = [
        ("dirs: [...new Set(specs.map(specDir))].join(', '), specs: specs.join(', '), other, langs: vals('lang').join(', '), format: vals('format').join(''),",
         "dirs: [...new Set(specs.map(specDir))].map(x => __RU[x] || x).join(', '), specs: specs.map(x => __RU[x] || x).join(', '), other, langs: vals('lang').map(x => __RU[x] || x).join(', '), format: vals('format').map(x => __RU[x] || x).join(''),"),
        ("pay: vals('pay').join(''), when: vals('when').join(''),", "pay: vals('pay').map(x => __RU[x] || x).join(''), when: vals('when').map(x => __RU[x] || x).join(''),"),
        ("const c = Object.values(CATS).find(x => x.s.includes(t.name));", "const nm = __UK[t.name] || t.name; const c = Object.values(CATS).find(x => x.s.includes(nm));"),
        ("<span style=\"--w:${Math.round(t.count / max * 100)}%\">${esc(t.name)}</span>", "<span style=\"--w:${Math.round(t.count / max * 100)}%\">${esc(nm)}</span>"),
    ]
    for a, b in reps:
        if a in html: html = html.replace(a, b)
        else: print('opros patch not applied:', a[:70])
    return html

def ver(text): return hashlib.md5(text.encode('utf-8')).hexdigest()[:8]
def stamp_data(html):
    """данные (карточки, события, курсы) подключаются с ?v=<отпечаток файла>: браузер сразу берёт новую версию после правки (07.10.2026)"""
    def rep(m):
        p = os.path.join(ROOT, 'data', m.group(2) + '.js')
        return f'{m.group(1)}?v={ver(open(p, encoding="utf-8").read())}"' if os.path.exists(p) else m.group(0)
    return re.sub(r'(<script src="/data/([a-z]+)\.js)(?:\?v=\w+)?"', rep, html)

def build():
    TM, TMP = tm(); missing = []
    import docx
    missing += docx.build(TM)
    for src, path in PAGES:
        sp = os.path.join(ROOT, src)
        ru = stamp_data(strip_injected(open(sp, encoding='utf-8').read()))
        ru_out = head_inject(ru, MARK + alternates(path) + redirect_js(path) + MARK)
        ru_out = body_inject(ru_out, MARK + switcher('ru', path) + MARK)
        if ru_out != open(sp, encoding='utf-8').read(): open(sp, 'w', encoding='utf-8').write(ru_out)
        tr = dict(TM); tr.update(TMP.get(src, {}))
        units = list(dict.fromkeys(page_units(ru)))
        miss = [u for u in units if u not in tr]
        if miss: missing += [u for u in miss if u not in missing]; continue
        out = translate_page(ru, tr)
        out = out.replace('<html lang="ru"', '<html lang="uk"', 1).replace('content="ru_RU"', 'content="uk_UA"')
        out = fix_links(out, path)
        out = re.sub(r'<head>', '<head>' + MARK + f'<base href="{path}">' + MARK, out, count=1)   # ресурсы — по адресам русской страницы
        out = localize_assets(out, tr, missing)
        out = post(out, src)
        out = head_inject(out, MARK + alternates(path) + MARK)
        out = body_inject(out, MARK + switcher('uk', path) + MARK)
        dst = os.path.join(ROOT, 'uk', src)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        old = open(dst, encoding='utf-8').read() if os.path.exists(dst) else None
        if out != old: open(dst, 'w', encoding='utf-8').write(out)
    json.dump(missing, open(os.path.join(I18N, 'missing.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    return missing

if __name__ == '__main__':
    m = build()
    print('untranslated:', len(m))
    sys.exit(1 if m else 0)
