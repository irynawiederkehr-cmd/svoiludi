"""Собирает вкладку «Как устроена Швейцария»: shveycariya/index.html и статьи shveycariya/<slug>/index.html.
Шапка, меню, стили и подвал берутся из kursy/index.html, чтобы вкладка выглядела как остальной сайт.
Запуск из корня репозитория: python3 _i18n/shveycariya_src/build.py
Тексты — articles.py, карта тем — topics.py. Украинское зеркало потом собирает _i18n/sync.py (добавить страницы в PAGES)."""
import os, re, json, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from topics import MODULES, TOPICS, TOOLS, TABS
# инструмент показываем, только если его страница есть в этой ветке (например, «Расчёт зарплаты» живёт в своей копии)
HAS = lambda x: os.path.isfile(os.path.join('instrumenty', x, 'index.html'))
from articles import ARTICLES

UPD = '08.10.2026'
BOT = 'https://t.me/swisscompass_bot'
SITE = 'https://svoiludi.ch/'
src = open('kursy/index.html', encoding='utf-8').read()
src = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', src, flags=re.S)
HEAD = src[:src.index('</head>')]
TOP = src[src.index('<body>'):src.index('<main class="page">')]
BYSLUG = {t['slug']: t for t in TOPICS}
MODNAME = {m[0]: m[1] for m in MODULES}

# Иконки разделов (08.10.2026, просьба Ирины): круг как у иконок инструментов, свой рисунок у каждого раздела
_C = '<circle cx="50" cy="50" r="46" fill="#FFFCF8" stroke="#4F5E3E" stroke-width="3"/>'
MODICON = {
    'status': _C + '<rect x="22" y="30" width="56" height="40" rx="6" fill="#E1E8F5" stroke="#2F5FB8" stroke-width="3"/><circle cx="38" cy="47" r="6.5" fill="#FFFCF8" stroke="#2F5FB8" stroke-width="2.6"/><path d="M29 62c1.5-5 5-7 9-7s7.5 2 9 7" fill="none" stroke="#2F5FB8" stroke-width="2.6" stroke-linecap="round"/><path d="M53 44h17M53 52h17M53 60h11" stroke="#2F5FB8" stroke-width="3" stroke-linecap="round"/>',
    'money': _C + '<ellipse cx="44" cy="66" rx="16" ry="5.5" fill="#F3E3C2" stroke="#B98324" stroke-width="2.6"/><path d="M28 66v-7c0 3 7 5.5 16 5.5s16-2.5 16-5.5v7" fill="#F3E3C2" stroke="#B98324" stroke-width="2.6"/><ellipse cx="44" cy="59" rx="16" ry="5.5" fill="#F3E3C2" stroke="#B98324" stroke-width="2.6"/><path d="M28 59v-7c0 3 7 5.5 16 5.5s16-2.5 16-5.5v7" fill="#F3E3C2" stroke="#B98324" stroke-width="2.6"/><ellipse cx="44" cy="52" rx="16" ry="5.5" fill="#FFF6DF" stroke="#B98324" stroke-width="2.6"/><circle cx="66" cy="36" r="11" fill="#FFF6DF" stroke="#B98324" stroke-width="2.6"/><path d="M63 41V31h7M63 36h5" fill="none" stroke="#B98324" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
    'insure': _C + '<path d="M50 22l22 8v16c0 14-9 24-22 30-13-6-22-16-22-30V30z" fill="#E2F0E2" stroke="#3A8A48" stroke-width="3" stroke-linejoin="round"/><path d="M50 60c-8-5-13-9.5-13-15 0-4 3-7 6.5-7 3 0 5 1.8 6.5 4 1.5-2.2 3.5-4 6.5-4 3.5 0 6.5 3 6.5 7 0 5.5-5 10-13 15z" fill="#F6E0D9" stroke="#A0523D" stroke-width="2.4" stroke-linejoin="round"/>',
    'learn': _C + '<path d="M50 52c-7-4-16-5.5-26-4.5v22c10-1 19 .5 26 5 7-4.5 16-6 26-5v-22c-10-1-19 .5-26 4.5z" fill="#ECE6F5" stroke="#6B4FA0" stroke-width="3" stroke-linejoin="round"/><path d="M50 52v23" stroke="#6B4FA0" stroke-width="2.6"/><path d="M30 55.5c5-.3 10 .5 14 2.3M30 62c5-.3 10 .5 14 2.3M56 57.8c4-1.8 9-2.6 14-2.3M56 64.3c4-1.8 9-2.6 14-2.3" fill="none" stroke="#6B4FA0" stroke-width="1.8" stroke-linecap="round" opacity=".55"/><path d="M37 33v7c0 3.5 6 6 13 6s13-2.5 13-6v-7" fill="#6B4FA0" stroke="#6B4FA0" stroke-width="2.6" stroke-linejoin="round"/><path d="M50 18l27 11-27 11-27-11z" fill="#FFFCF8" stroke="#6B4FA0" stroke-width="3" stroke-linejoin="round"/><path d="M50 29l19 4v9" fill="none" stroke="#B98324" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/><circle cx="69" cy="44.5" r="2.8" fill="#B98324"/>',  # 09.10.2026: новая иконка (книга + шапочка выпускника), старая Ирине не понравилась
    'work': _C + '<rect x="22" y="36" width="56" height="34" rx="6" fill="#EFE5D7" stroke="#6E4F3C" stroke-width="3"/><path d="M40 36v-5c0-2.5 2-4 4.5-4h11c2.5 0 4.5 1.5 4.5 4v5" fill="none" stroke="#6E4F3C" stroke-width="3"/><path d="M22 51h56" stroke="#6E4F3C" stroke-width="3"/><rect x="45" y="47" width="10" height="8" rx="2" fill="#F3E3C2" stroke="#B98324" stroke-width="2.4"/>',
    'home': _C + '<path d="M24 48L50 26l26 22" fill="none" stroke="#A0523D" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M30 44v28h40V44" fill="#F6E0D9" stroke="#A0523D" stroke-width="3" stroke-linejoin="round"/><rect x="44" y="55" width="12" height="17" rx="2" fill="#FFFCF8" stroke="#A0523D" stroke-width="2.6"/><rect x="62" y="28" width="6" height="10" fill="#F6E0D9" stroke="#A0523D" stroke-width="2.4"/>',
    'life': _C + '<circle cx="37" cy="36" r="7" fill="#F7E1EC" stroke="#B5357A" stroke-width="2.6"/><circle cx="63" cy="36" r="7" fill="#F7E1EC" stroke="#B5357A" stroke-width="2.6"/><circle cx="50" cy="52" r="5.5" fill="#FFF6DF" stroke="#B98324" stroke-width="2.4"/><path d="M24 70c0-10 5.5-17 13-17 3 0 5.5 1 7.5 3M76 70c0-10-5.5-17-13-17-3 0-5.5 1-7.5 3" fill="none" stroke="#B5357A" stroke-width="2.6" stroke-linecap="round"/><path d="M41 72c0-6 4-10 9-10s9 4 9 10" fill="none" stroke="#B98324" stroke-width="2.6" stroke-linecap="round"/>',
}
def modicon(k, size):
    return f'<svg class="tm-ic" viewBox="0 0 100 100" width="{size}" height="{size}" aria-hidden="true">{MODICON.get(k, _C)}</svg>'
CATT = {}   # направление → название, из главной страницы
for k, t in re.findall(r"^\s*(\w+):\s*\{ t: '([^']+)'", open('index.html', encoding='utf-8').read(), flags=re.M):
    CATT[k] = t


def head(title, desc, url, depth):
    h = HEAD
    h = re.sub(r'<title>.*?</title>', f'<title>{html.escape(title)}</title>', h)
    h = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', h)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(desc)}">', h)
    h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{html.escape(title)}">', h)
    h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{html.escape(desc)}">', h)
    h = h.replace('content="https://svoiludi.ch/kursy/"', f'content="{url}"').replace('https://svoiludi.ch/kursy/og-image.jpg', url + 'og-image.jpg')
    h = h.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">' if depth == 2 else '<meta property="og:type" content="website">')
    if depth == 2:
        h = h.replace('href="../', 'href="../../')
    h += '<link rel="stylesheet" href="' + ('../' * depth) + 'assets/temy.css">\n'
    return h + '</head>\n'


def top(depth):
    t = TOP
    t = t.replace('<a href="./" aria-current="page" style="color:var(--ink)">Курсы</a>', '<a href="../kursy/">Курсы</a>\n      <a href="./" aria-current="page" style="color:var(--ink)">Как устроена Швейцария</a>')
    t = t.replace('<a class="navcta" href="#add">Добавить курс</a>', '<a class="navcta" href="../">Найти специалиста</a>')
    if depth == 2:
        t = re.sub(r'href="\.\./', 'href="../../', t)
        t = t.replace('href="./" aria-current="page"', 'href="../" aria-current="page"')
    return t


def foot(depth, extra=''):
    up = '../' * depth
    return f'''
  <footer>
    <span>© 2026 Свои люди в Швейцарии · проект <a href="https://voznesenskaya.ch/">Ирины Вознесенской</a></span>
    <span><a href="{up}">Специалисты</a> · <a href="{up}events/">События</a> · <a href="{up}kursy/">Курсы</a> · <a href="{up}join/">Разместиться</a> · <a href="https://svoiludi.ch/privacy/">Политика конфиденциальности</a> · <a href="https://voznesenskaya.ch/impressum/">Выходные данные</a></span>
  </footer>
</main>
{extra}<script src="/assets/temy.js" defer></script>
<script data-goatcounter="https://svoiludi.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
<script src="/assets/share.js" defer></script>
<script src="/assets/samesite.js"></script>
</body>
</html>
'''


DISC = ('<p class="fine"><b>Это общая информация, а не юридическая или налоговая консультация.</b> Правила зависят от кантона и меняются. '
        'Проверяй актуальное в своём кантоне или у специалиста. «Свои люди» не отвечают за решения, принятые на основе этой страницы.</p>')


def chips(t):
    out = [f'<span class="t">{TOOLS[x]}</span>' for x in t['tools'] if HAS(x)]
    out += [f'<span>{CATT.get(c, c)}</span>' for c, _ in t['help'][:2]]
    return '<div class="tm-chips">' + ''.join(out) + '</div>' if out else ''


def hub():
    url = SITE + 'shveycariya/'
    title = 'Как устроена Швейцария — простые ответы на русском · Свои люди'
    desc = 'Пермиты, налоги, долги, страховки, школа, работа, жильё и быт в Швейцарии простыми словами на русском. К каждой теме — полезные инструменты и специалисты, которые помогут.'
    mods = ''.join(f'<a href="#{m[0]}">{modicon(m[0], 26)}<span>{m[1]}</span></a>' for m in MODULES)
    SCHEMES = ''.join(f'<a href="../instrumenty/{s}/"><img src="../instrumenty/preview/{s}/1.jpg" alt="" loading="lazy"><b>{t}</b></a>' for s, t in [('put-obrazovaniya', 'Образование в Швейцарии: от яслей до вуза'), ('yazyk-trebovaniya', 'Какой уровень языка нужен для пермита, паспорта и работы'), ('nalogi-shema', 'Как устроены налоги в Швейцарии'), ('pensiya-shema', 'Как устроена пенсия: три колонны'), ('strahovki-obyazatelnye', 'Какие страховки обязательны в Швейцарии'), ('grazhdanstvo-shema', 'Путь к швейцарскому паспорту'), ('diplomy-shema', 'Как признать иностранный диплом'), ('franshiza-shema', 'Какая франшиза медстраховки тебе выгоднее'), ('kuda-obratitsya', 'Профсоюзы и консультации: взносы, сроки, телефоны')])
    body = []
    for key, name, lead in MODULES:
        cards = []
        for t in [t for t in TOPICS if t['mod'] == key]:
            k = html.escape(' '.join([t['title'], t['lead']] + [TOOLS[x] for x in t['tools'] if HAS(x)] + [s for _, ss in t['help'] for s in ss]))
            if t['ready']:
                cards.append(f'<a class="tm-card" href="{t["slug"]}/" data-k="{k}"><b>{t["title"]}</b><p>{t["lead"]}</p>{chips(t)}<span class="go">Читать →</span></a>')
            else:
                cards.append(f'<div class="tm-card soon" data-k="{k}"><span class="soon-tag">Скоро</span><b>{t["title"]}</b><p>{t["lead"]}</p>{chips(t)}</div>')
        body.append(f'<section class="tm-mod" id="{key}" aria-labelledby="h-{key}"><h2 id="h-{key}" class="tm-modh">{modicon(key, 52)}<span>{name}</span></h2><p>{lead}</p><div class="tm-grid">{"".join(cards)}</div></section>')
    main = f'''<main class="page">
  <section class="s-hero" aria-labelledby="h1">
    <div class="eyebrow">Как устроена Швейцария · Свои люди в Швейцарии</div>
    <h1 id="h1">Как здесь всё устроено, <em>простыми словами</em></h1>
    <p class="lead">Пермиты, налоги, долги, страховки, школа, работа и жильё. Коротко о главном по каждой теме, что сделать самой, какие инструменты помогут и кто из специалистов справочника разбирается в этом вопросе.</p>
    <label class="tm-search"><input id="tmq" type="search" placeholder="Например, Betreibung, пермит B, Kita, 3a" aria-label="Поиск по темам"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></label>
    <nav class="tm-mods" aria-label="Разделы тем">{mods}</nav>
  </section>
  <a class="tm-sos" href="../instrumenty/ekstrennye-nomera/"><span class="tfan" aria-hidden="true"><img src="../instrumenty/preview/ekstrennye-nomera/1.jpg" alt="" loading="lazy" style="--i:-0.5"><img src="../instrumenty/preview/ekstrennye-nomera/2.jpg" alt="" loading="lazy" style="--i:0.5"></span><span><b>Сохрани сразу: экстренные номера</b><span>144, 117, 118, 145, дежурный врач твоего кантона и твои контакты на одной карточке, на русском и языке кантона. Распечатай: в кошелёк, на холодильник, няне.</span><em>Бесплатно · PDF · сделать карточку →</em></span></a>
  <section class="tm-schemes" aria-labelledby="sch-h"><h2 id="sch-h">Схемы на одном листе</h2><p>Как всё устроено — на картинке, с твоими данными. Бесплатно, PDF и PNG.</p><div class="tm-sch">{SCHEMES}</div></section>
  {''.join(body)}
  <p class="tm-empty" id="tmempty" hidden>Ничего не нашлось. Попробуй другое слово или спроси в боте.</p>
  <section class="tm-ask" aria-labelledby="ask-h">
    <h2 id="ask-h">Не нашла свой вопрос?</h2>
    <p style="max-width:64ch">Советы о жизни в Швейцарии можно получать и в Telegram, в бесплатном боте «Гайд по Швейцарии». А если нужен человек, который разберётся именно в твоей ситуации, выбери специалиста в справочнике.</p>
    <span class="addbtns"><a class="btn" href="{BOT}">Открыть бот в Telegram</a><a class="btn ghost" href="../">Найти специалиста</a></span>
  </section>
  {DISC}
  <div class="share-slot" data-url="{url}" data-lead="Перешли тем, кто недавно переехал. Сообщение уже готово." data-text="Привет! Тут простыми словами на русском, как устроена Швейцария: пермиты, налоги, долги, страховки, школа и жильё. К каждой теме ещё инструменты и специалисты. {url}"></div>
'''
    out = head(title, desc, url, 1) + '<body data-root="../">' + top(1)[len('<body>'):] + main + foot(1)
    os.makedirs('shveycariya', exist_ok=True)
    open('shveycariya/index.html', 'w', encoding='utf-8').write(out)




# «Кто поможет» (08.10.2026, просьба Ирины): профсоюзы, союзы арендаторов, защита покупателей, бесплатные консультации.
# Данные — pomosh.py; в браузер уходят как assets/pomosh.js (блок «Твой кантон» и инструмент «Куда обратиться за помощью»).
import pomosh as PM
open('assets/pomosh.js', 'w', encoding='utf-8').write('/* Собирается _i18n/shveycariya_src/build.py из pomosh.py — руками не править. Проверено ' + PM.CHECKED + '. */\nwindow.POMOSH = ' + json.dumps({'checked': PM.CHECKED, 'areas': PM.AREAS, 'info': PM.AREA_INFO, 'orgs': PM.ORGS, 'kant': PM.KANT}, ensure_ascii=False, separators=(',', ':')) + ';\n')
def _host(u):
    m = re.match(r'https?://(?:www\.)?([^/]+)', u); return m.group(1) if m else u
def pm_org(o):
    """Подробная карточка организации для статьи (раскрывается)."""
    rows = [('Для кого', o['who']), ('Как поможет', o['help']), ('Взнос', o['fee']), ('Когда помогут', o['wait'])] + ([('Ещё', o['extra'])] if o.get('extra') else [])
    cont = ' · '.join(x for x in [html.escape(o.get('tel') or ''), (f'<a href="mailto:{html.escape(o["mail"])}">{html.escape(o["mail"])}</a>' if o.get('mail') else ''), (f'<a href="{html.escape(o["find"])}">найти офис рядом ↗</a>' if o.get('find') else '')] if x)
    srcs = ' · '.join(f'<a href="{html.escape(u)}">{html.escape(_host(u))}</a>' for u in o['src'])
    return (f'<details class="pmo" id="org-{o["id"]}"><summary><b>{html.escape(o["name"])}</b><span class="pmo-chips"><span>{html.escape(o["sfee"])}</span><span>{html.escape(o["swait"])}</span></span></summary>'
            + '<dl>' + ''.join(f'<dt>{k}</dt><dd>{html.escape(v)}</dd>' for k, v in rows) + (f'<dt>Контакты</dt><dd>{cont}</dd>' if cont else '') + '</dl>'
            + f'<p class="pmo-go"><a href="{html.escape(o["url"])}">{"Вступить" if o["m"] else "Сайт"}: {html.escape(_host(o["url"]))} ↗</a></p><p class="pmo-src">Проверено {PM.CHECKED}: {srcs}</p></details>')
def pm_table(ids):
    rows = ''.join(f'<tr><th scope="row"><a href="#org-{i}">{html.escape(PM.BYID[i]["name"])}</a></th><td>{html.escape(PM.BYID[i]["sfee"])}</td><td>{html.escape(PM.BYID[i]["swait"])}</td></tr>' for i in ids)
    return f'<div class="pm-tw"><table class="pm-t"><thead><tr><th>Организация</th><th>Взнос</th><th>Когда помогут</th></tr></thead><tbody>{rows}</tbody></table></div>'
def pm_kt(keys):
    return f'<section class="pmk" data-k="{keys}" aria-label="Где помогут в твоём кантоне"></section>'
def pm_area(a):
    h, ps = PM.AREA_INFO[a]
    return f'<div class="pm-info"><b>Что это такое: {html.escape(h)}</b>' + ''.join(f'<p>{html.escape(x)}</p>' for x in ps) + '</div>'
def pm_expand(body):
    body = re.sub(r'<!--AREA:([a-z]+)-->', lambda m: pm_area(m.group(1)), body)
    body = re.sub(r'<!--ORGS:([a-z,]+)-->', lambda m: ''.join(pm_org(o) for o in PM.ORGS if o['area'] in m.group(1).split(',')), body)
    body = re.sub(r'<!--TABLE:([a-z0-9,-]+)-->', lambda m: pm_table(m.group(1).split(',')), body)
    return re.sub(r'<!--PMK:([a-z,]+)-->', lambda m: pm_kt(m.group(1)), body)
def pm_box(a):
    """Блок «Кто поможет» в других статьях: короткие карточки + твой кантон + ссылки."""
    p = a.get('pomosh')
    if not p: return ''
    cards = ''.join(f'<a class="pm-c" href="../profsoyuzy/#org-{i}"><b>{html.escape(PM.BYID[i]["name"])}</b><span>{html.escape(PM.BYID[i]["short"])}</span><em>{html.escape(PM.BYID[i]["sfee"])} · {html.escape(PM.BYID[i]["swait"])}</em></a>' for i in p['ids'])
    return (f'<section class="pm" aria-labelledby="pm-h"><h2 id="pm-h">Кто поможет: за небольшой взнос и бесплатно</h2><p>{p["t"]}</p><div class="pm-g">{cards}</div>'
            + (pm_kt(p['k']) if p.get('k') else '')
            + '<p class="pm-more">Подробно о каждой организации, взносы и сроки — в теме <a href="../profsoyuzy/">«Профсоюзы и консультации»</a>. Свой список с номерами членства — в списке <a href="../../instrumenty/kuda-obratitsya/">«Профсоюзы и консультации: взносы, сроки, телефоны»</a>.</p></section>')

# Ссылки по названию (правило Ирины 08.10.2026): «Расчёт зарплаты», схема «Признание дипломов», тема «Домашний персонал»,
# вкладка «Курсы» — в тексте статьи сразу активная ссылка. Тема без статьи остаётся текстом и станет ссылкой, когда статья будет готова.
TOPIC_ALIAS = {'Домашний персонал': 'domashniy-personal', 'Психотерапия через страховку': 'psihoterapiya', 'Своё дело': 'samozanyatost',
               'Транспорт, машина и права': 'transport', 'Работа': 'rabota', 'Признание дипломов': 'diplomy'}

# Новые названия инструментов (просьба Ирины 08.10.2026: название говорит, что это за документ). Старые названия в текстах статей заменяются на новые при сборке.
RENAME = {'Мой год': 'Годовой календарь дел и сроков', 'Мой день': 'План дня по часам', 'Мои эмоции': 'Дневник эмоций', 'Мой бюджет': 'Бюджет: все обязательные расходы в Швейцарии', 'Учёт моего времени': 'Табель рабочих часов за месяц', 'Часы по клиентам': 'Учёт часов и оплат по клиентам', 'Резюме по-швейцарски': 'Резюме для Швейцарии (Lebenslauf)', 'Экстренные номера': 'Карточка экстренных номеров и дежурного врача', 'Путь образования': 'Образование в Швейцарии: от яслей до вуза', 'Язык: что и где требуют': 'Какой уровень языка нужен для пермита, паспорта и работы', 'Обязательные страховки': 'Какие страховки обязательны в Швейцарии', 'Как устроены налоги': 'Как устроены налоги в Швейцарии', 'Как устроена пенсия': 'Как устроена пенсия: три колонны', 'Путь к гражданству': 'Путь к швейцарскому паспорту', 'Признание дипломов': 'Как признать иностранный диплом', 'Франшиза медстраховки': 'Какая франшиза медстраховки тебе выгоднее', 'Куда обратиться за помощью': 'Профсоюзы и консультации: взносы, сроки, телефоны', 'Мои данные': 'Лист личных данных семьи: AHV, страховки, врачи', 'Счёт клиенту с QR-кодом': 'Счёт клиенту с QR-квитанцией для оплаты', 'Доходы и расходы': 'Книга доходов и расходов для своего дела', 'Договор с няней': 'Трудовой договор с няней', 'Анкета клиента и согласие': 'Анкета здоровья и согласие клиента на процедуру', 'Этикетка для домашней еды': 'Этикетки с составом и аллергенами для домашней еды', 'Расчёт зарплаты': 'Расчёт зарплаты и расчётка', 'Письма управляющей': 'Письма управляющей: снижение аренды, дефект, расторжение, залог', 'Досье арендатора': 'Досье на квартиру: письмо управляющей и анкета жильцов', 'Расчёт ипотеки': 'Сколько стоит жильё, которое я потяну: расчёт ипотеки', 'Какой проездной выгоднее': 'Какой проездной выгоднее: Halbtax, GA или билеты', 'Зарплата при болезни': 'Сколько недель зарплаты при болезни: бернская, цюрихская, базельская шкала', 'Переезд': 'Переезд: кого известить и до какого числа'}
def renamed(s):
    for o, nw in RENAME.items():
        s = re.sub(r'(?<!тема )(?<!теме )(?<!тему )(?<!темы )(?<!темой )«' + re.escape(o) + '»', '«' + nw + '»', s)
    return s
def autolink(html_txt):
    html_txt = renamed(html_txt)
    import re as _re
    tool_by_name = {v: k for k, v in TOOLS.items()}
    def fix(seg):
        # тема «…»
        def topic(m):
            word, name = m.group(1), m.group(2)
            slug = TOPIC_ALIAS.get(name) or next((x['slug'] for x in TOPICS if x['title'] == name), None)
            if slug and BYSLUG.get(slug, {}).get('ready'):
                return f'{word} <a href="../{slug}/">«{name}»</a>'
            return m.group(0)
        seg = _re.sub(r'(тем[аеуыо]й?)\s+«([^»]+)»', topic, seg)
        # инструменты и схемы по точному названию
        def tool(m):
            name = m.group(1); x = tool_by_name.get(name)
            if x and HAS(x): return f'<a href="../../instrumenty/{x}/">«{name}»</a>'
            return m.group(0)
        seg = _re.sub(r'«([^»]+)»', tool, seg)
        seg = _re.sub(r'(вкладк[аеуи])\s+«Курсы»', r'\1 <a href="../../kursy/">«Курсы»</a>', seg)
        return seg
    parts = _re.split(r'(<a\b[^>]*>.*?</a>|<h[1-6][^>]*>.*?</h[1-6]>)', html_txt, flags=_re.S)
    return ''.join(p if i % 2 else fix(p) for i, p in enumerate(parts))

def article(t):
    a = ARTICLES[t['slug']]
    url = f'{SITE}shveycariya/{t["slug"]}/'
    title = a['seo'] + ' · Свои люди'
    steps = ''.join(f'<li><span>{autolink(s)}</span></li>' for s in a['steps'])
    def fan(x):
        d = os.path.join('instrumenty', 'preview', x)
        imgs = sorted([f for f in os.listdir(d) if f.endswith('.jpg')], key=lambda f: int(f.split('.')[0]))[:3] if os.path.isdir(d) else []
        n = len([f for f in os.listdir(d) if f.endswith('.jpg')]) if imgs else 0
        if not imgs: return ''
        from PIL import Image
        land = lambda f: Image.open(os.path.join(d, f)).size[0] > Image.open(os.path.join(d, f)).size[1]
        pics = ''.join(f'<img src="../../instrumenty/preview/{x}/{f}" alt="" loading="lazy"{" class=\"land\"" if land(f) else ""} style="--i:{i - (len(imgs) - 1) / 2}">' for i, f in enumerate(imgs))
        return f'<span class="tfan" aria-hidden="true">{pics}</span>'
    def pages(x):
        d = os.path.join('instrumenty', 'preview', x)
        n = len([f for f in os.listdir(d) if f.endswith('.jpg')]) if os.path.isdir(d) else 0
        return 'Бесплатно · PDF' if n else 'Бесплатно'
    # компактная карточка: маленький веер из настоящих страниц примера слева, текст справа (08.10.2026, крупный веер в колонке был слишком большим)
    tools = ''.join(f'<a class="tool tpv" href="../../instrumenty/{x}/">{fan(x)}<span class="ttxt"><b>{TOOLS[x]}</b><span>{a["tools"].get(x, "")}</span><em>{pages(x)} · открыть →</em></span></a>' for x in t['tools'] if HAS(x))
    tabs = ''.join(f'<a class="tool" href="{TABS[x][1]}"><b>{TABS[x][0]}</b><span>{a.get("tabs", {}).get(x, "")}</span></a>' for x in t['tabs'])
    rel = ''.join(f'<a href="../{s}/">{BYSLUG[s]["title"]}</a>' if BYSLUG[s]['ready'] else f'<span class="upd">{BYSLUG[s]["title"]} (скоро)</span>' for s in a['related'])
    srcs = ''.join(f'<li><a href="{u}">{html.escape(n)}</a></li>' for n, u in a['sources'])
    profs = ', '.join(s for _, ss in t['help'] for s in ss)
    helpj = html.escape(json.dumps(t['help'], ensure_ascii=False))
    main = f'''<main class="page">
  <div class="crumbs"><a href="../">Как устроена Швейцария</a> · <a href="../#{t['mod']}">{MODNAME[t['mod']]}</a></div>
  <section class="s-hero" aria-labelledby="h1" style="padding-top:18px">
    <h1 id="h1">{a['h1']}</h1>
    <p class="lead">{a['lead']}</p>
    <p class="upd">Обновлено {UPD}</p>
  </section>
  <div class="art">
    <article class="art-main">
      {('<section class="kt" data-k="' + ','.join(a['kanton']) + '" aria-label="Твой кантон"></section>') if a.get('kanton') else ''}
      {autolink(pm_expand(a['body']))}
      {pm_box(a)}
      {('<section class="terms" aria-labelledby="terms-h"><h2 id="terms-h">Как это называется в твоём кантоне</h2><p>В письмах и на сайтах ведомств ищи эти слова.</p><dl>' + ''.join(f'<div><dt>{l}</dt><dd lang="{ {"Deutsch":"de","Français":"fr","Italiano":"it","English":"en"}[l] }">{w}</dd></div>' for l, w in a['terms']) + '</dl></section>') if a.get('terms') else ''}
      {('<div class="warn post"><b>Важные письма — заказным (Einschreiben)</b><p>' + a['post'] + ' Отправляй такие письма на почте как <a href="https://www.post.ch/de/briefe-versenden/einschreiben">Einschreiben (R)</a>, сохраняй копию письма и квитанцию с номером отправления. По номеру на post.ch видно, когда письмо получили.</p><p>Для сроков ведомства обычно важно, что письмо сдано на почту до конца последнего дня. Для расторжения аренды или работы важно, когда его получили, поэтому отправляй заранее.' + (' ' + a['post2'] if a.get('post2') else '') + '</p></div>') if a.get('post') else ''}
      <section class="todo" aria-labelledby="todo-h"><h2 id="todo-h">Что сделать</h2><ol>{steps}</ol></section>
    </article>
    <aside class="side" aria-label="Что поможет">
      {f'<div class="box"><h3>Инструменты</h3>{tools}{tabs}</div>' if tools or tabs else ''}
      <div class="box" id="sp" data-help="{helpj}"><h3>Кто поможет</h3><p class="note" style="margin:0">{profs}</p><div class="sp-list"></div><a class="more" href="../../">Все специалисты →</a>
        <p class="note">Специалисты сами отвечают за свои услуги. Проверка у всех одинаковая, <a href="../../join/">как мы проверяем</a>.</p></div>
      {f'<div class="box"><h3>Ещё по теме</h3><div class="rel">{rel}</div></div>' if rel else ''}
    </aside>
    <div class="art-foot">
      <p class="botlink">Хочешь получать советы о жизни в Швейцарии прямо в Telegram? Можно подписаться на бесплатный бот «Гайд по Швейцарии». <a href="{BOT}">Открыть бот →</a></p>
      <div class="src"><b>Источники</b> (проверено {UPD})<ol>{srcs}</ol></div>
    </div>
  </div>
  {DISC}
  <div class="share-slot" data-url="{url}" data-lead="Перешли тому, кому это сейчас нужно. Сообщение уже готово." data-text="Привет! Тут коротко и по-русски про {html.escape(t['title'])}: что важно знать и что сделать. {url}"></div>
'''
    extra = '<script src="/data/specialists.js"></script>\n' + ('<script src="/assets/kantony.js"></script>\n' if (a.get('kanton') or 'class="med"' in a['body']) else '') + ('<script src="/assets/kantony.js"></script>\n<script src="/assets/pomosh.js"></script>\n' if ((a.get('pomosh') or {}).get('k') or '<!--PMK:' in a['body']) and not (a.get('kanton') or 'class="med"' in a['body']) else '<script src="/assets/pomosh.js"></script>\n' if ((a.get('pomosh') or {}).get('k') or '<!--PMK:' in a['body']) else '')
    out = head(title, a['desc'], url, 2) + '<body data-root="../../">' + top(2)[len('<body>'):] + main + foot(2, extra)
    os.makedirs(f'shveycariya/{t["slug"]}', exist_ok=True)
    open(f'shveycariya/{t["slug"]}/index.html', 'w', encoding='utf-8').write(out)


hub()
for t in TOPICS:
    if t['ready']:
        assert t['slug'] in ARTICLES, t['slug']
        article(t)
print('ok:', 1 + sum(t['ready'] for t in TOPICS), 'pages,', len(TOPICS), 'topics')
