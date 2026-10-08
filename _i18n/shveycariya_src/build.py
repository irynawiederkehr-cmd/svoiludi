"""Собирает вкладку «Как устроена Швейцария»: shveycariya/index.html и статьи shveycariya/<slug>/index.html.
Шапка, меню, стили и подвал берутся из kursy/index.html, чтобы вкладка выглядела как остальной сайт.
Запуск из корня репозитория: python3 _i18n/shveycariya_src/build.py
Тексты — articles.py, карта тем — topics.py. Украинское зеркало потом собирает _i18n/sync.py (добавить страницы в PAGES)."""
import os, re, json, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from topics import MODULES, TOPICS, TOOLS, TABS
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
    h += '<link rel="stylesheet" href="' + ('../' * depth) + 'assets/temy.css">\n'
    if depth == 2:
        h = h.replace('href="../', 'href="../../')
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
    out = [f'<span class="t">{TOOLS[x]}</span>' for x in t['tools']]
    out += [f'<span>{CATT.get(c, c)}</span>' for c, _ in t['help'][:2]]
    return '<div class="tm-chips">' + ''.join(out) + '</div>' if out else ''


def hub():
    url = SITE + 'shveycariya/'
    title = 'Как устроена Швейцария — простые ответы на русском · Свои люди'
    desc = 'Пермиты, налоги, долги, страховки, школа, работа, жильё и быт в Швейцарии простыми словами на русском. К каждой теме — полезные инструменты и специалисты, которые помогут.'
    mods = ''.join(f'<a href="#{m[0]}">{m[1]}</a>' for m in MODULES)
    body = []
    for key, name, lead in MODULES:
        cards = []
        for t in [t for t in TOPICS if t['mod'] == key]:
            k = html.escape(' '.join([t['title'], t['lead']] + [TOOLS[x] for x in t['tools']] + [s for _, ss in t['help'] for s in ss]))
            if t['ready']:
                cards.append(f'<a class="tm-card" href="{t["slug"]}/" data-k="{k}"><b>{t["title"]}</b><p>{t["lead"]}</p>{chips(t)}<span class="go">Читать →</span></a>')
            else:
                cards.append(f'<div class="tm-card soon" data-k="{k}"><span class="soon-tag">Скоро</span><b>{t["title"]}</b><p>{t["lead"]}</p>{chips(t)}</div>')
        body.append(f'<section class="tm-mod" id="{key}" aria-labelledby="h-{key}"><h2 id="h-{key}">{name}</h2><p>{lead}</p><div class="tm-grid">{"".join(cards)}</div></section>')
    main = f'''<main class="page">
  <section class="s-hero" aria-labelledby="h1">
    <div class="eyebrow">Как устроена Швейцария · Свои люди в Швейцарии</div>
    <h1 id="h1">Как здесь всё устроено, <em>простыми словами</em></h1>
    <p class="lead">Пермиты, налоги, долги, страховки, школа, работа и жильё. Коротко о главном по каждой теме, что сделать самой, какие инструменты помогут и кто из специалистов справочника разбирается в этом вопросе.</p>
    <label class="tm-search"><input id="tmq" type="search" placeholder="Например, Betreibung, пермит B, Kita, 3a" aria-label="Поиск по темам"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg></label>
    <nav class="tm-mods" aria-label="Разделы тем">{mods}</nav>
  </section>
  {''.join(body)}
  <p class="tm-empty" id="tmempty" hidden>Ничего не нашлось. Попробуй другое слово или спроси в боте.</p>
  <section class="tm-ask" aria-labelledby="ask-h">
    <h2 id="ask-h">Не нашла свой вопрос?</h2>
    <p style="max-width:64ch">Ещё больше подробностей — в бесплатном боте «Гайд по Швейцарии». А если нужен человек, который разберётся именно в твоей ситуации, выбери специалиста в справочнике.</p>
    <span class="addbtns"><a class="btn" href="{BOT}">Открыть бот в Telegram</a><a class="btn ghost" href="../">Найти специалиста</a></span>
  </section>
  {DISC}
  <div class="share-slot" data-url="{url}" data-lead="Перешли тем, кто недавно переехал. Сообщение уже готово." data-text="Привет! Тут простыми словами на русском, как устроена Швейцария: пермиты, налоги, долги, страховки, школа и жильё. К каждой теме ещё инструменты и специалисты. {url}"></div>
'''
    out = head(title, desc, url, 1) + '<body data-root="../">' + top(1)[len('<body>'):] + main + foot(1)
    os.makedirs('shveycariya', exist_ok=True)
    open('shveycariya/index.html', 'w', encoding='utf-8').write(out)


def article(t):
    a = ARTICLES[t['slug']]
    url = f'{SITE}shveycariya/{t["slug"]}/'
    title = a['seo'] + ' · Свои люди'
    steps = ''.join(f'<li><span>{s}</span></li>' for s in a['steps'])
    tools = ''.join(f'<a class="tool" href="../../instrumenty/{x}/"><b>{TOOLS[x]}</b><span>{a["tools"].get(x, "")}</span></a>' for x in t['tools'])
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
      {a['body']}
      <section class="todo" aria-labelledby="todo-h"><h2 id="todo-h">Что сделать</h2><ol>{steps}</ol></section>
    </article>
    <aside class="side" aria-label="Что поможет">
      {f'<div class="box"><h3>Инструменты</h3>{tools}{tabs}</div>' if tools or tabs else ''}
      <div class="box" id="sp" data-help="{helpj}"><h3>Кто поможет</h3><p class="note" style="margin:0">{profs}</p><div class="sp-list"></div><a class="more" href="../../">Все специалисты →</a>
        <p class="note">Специалисты сами отвечают за свои услуги. Проверка у всех одинаковая, <a href="../../join/">как мы проверяем</a>.</p></div>
      {f'<div class="box"><h3>Ещё по теме</h3><div class="rel">{rel}</div></div>' if rel else ''}
    </aside>
    <div class="art-foot">
      <p class="botlink">Подробнее эта тема разобрана в бесплатном боте «Гайд по Швейцарии», раздел {t['bot']}. <a href="{BOT}">Открыть бот →</a></p>
      <div class="src"><b>Источники</b> (проверено {UPD})<ol>{srcs}</ol></div>
    </div>
  </div>
  {DISC}
  <div class="share-slot" data-url="{url}" data-lead="Перешли тому, кому это сейчас нужно. Сообщение уже готово." data-text="Привет! Тут коротко и по-русски про {html.escape(t['title'])}: что важно знать и что сделать. {url}"></div>
'''
    extra = '<script src="/data/specialists.js"></script>\n'
    out = head(title, a['desc'], url, 2) + '<body data-root="../../">' + top(2)[len('<body>'):] + main + foot(2, extra)
    os.makedirs(f'shveycariya/{t["slug"]}', exist_ok=True)
    open(f'shveycariya/{t["slug"]}/index.html', 'w', encoding='utf-8').write(out)


hub()
for t in TOPICS:
    if t['ready']:
        assert t['slug'] in ARTICLES, t['slug']
        article(t)
print('ok:', 1 + sum(t['ready'] for t in TOPICS), 'pages,', len(TOPICS), 'topics')
