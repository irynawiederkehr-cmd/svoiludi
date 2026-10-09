"""Страницы «устройства сайта» (решение Ирины 09.10.2026, документ проекта «struktura-saytov.md»):
  o-proekte/ — О проекте; dlya-specialistov/ — Для специалистов; novosti/ — Что нового (+ data/news.js, novosti/rss.xml);
  situacii/ и situacii/<slug>/ — «Моя ситуация», 8 маршрутов; блоки «Моя ситуация» и «Что нового» на главной (метки <!--sit-->);
  переключатель «События | Курсы» на events/ и kursy/ (метки <!--evk-->).
Шапка, стили и подвал — из kursy/index.html, меню — из nav.py. Тексты — data.py.
Запуск из корня: python3 _i18n/struktura_src/build.py ; потом nav.py, sync.py (UA), og.js, build_search.py."""
import os, re, sys, json, html, datetime
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE); sys.path.insert(0, os.path.join(HERE, '..', 'shveycariya_src'))
import nav as NAV
from data import SITUACII, NEWS, TG_CHANNEL
from topics import TOPICS, TOOLS as TOOLNAMES
BYSLUG = {t['slug']: t for t in TOPICS}
SITE = 'https://svoiludi.ch/'
HAS = lambda x: os.path.isfile(os.path.join('instrumenty', x, 'index.html'))
src = open('kursy/index.html', encoding='utf-8').read()
src = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', src, flags=re.S)
HEAD = src[:src.index('</head>')]
TOP = src[src.index('<body>'):src.index('<main class="page">')]
ART = re.search(r'<div class="hero-art".*?</div>', src, re.S).group(0)
CATT = dict(re.findall(r"^\s*(\w+):\s*\{ t: '([^']+)'", open('index.html', encoding='utf-8').read(), flags=re.M))
E = html.escape
MON = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
def ddate(iso):
    d = datetime.date.fromisoformat(iso); return f'{d.day} {MON[d.month - 1]} {d.year}'
KIND = {'change': 'Изменилось в Швейцарии', 'site': 'Новое на сайте', 'month': 'Сроки месяца'}

# --- общие куски ---
def head(title, desc, url, depth, extra=''):
    h = HEAD
    h = re.sub(r'<title>.*?</title>', f'<title>{E(title)}</title>', h)
    h = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{url}">', h)
    h = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{E(desc)}">', h)
    h = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{E(title)}">', h)
    h = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{E(desc)}">', h)
    h = h.replace('content="https://svoiludi.ch/kursy/"', f'content="{url}"').replace('https://svoiludi.ch/kursy/og-image.jpg', url + 'og-image.jpg')
    if depth == 2: h = h.replace('href="../', 'href="../../')
    h += '<link rel="stylesheet" href="' + ('../' * depth) + 'assets/temy.css">\n<link rel="stylesheet" href="' + ('../' * depth) + 'assets/struktura.css">\n' + extra
    return h + '</head>\n'

def top(rel, cta=('Найти специалиста', '')):
    depth = rel.count('/'); up = '../' * depth
    t = TOP
    if depth == 2: t = re.sub(r'href="\.\./', 'href="../../', t)
    t = NAV.NAV.sub(lambda m: m.group(1) + NAV.build(rel) + '\n    </nav>', t, count=1)
    t = re.sub(r'<a class="navcta" href="[^"]*">[^<]*</a>', f'<a class="navcta" href="{up}{cta[1]}">{cta[0]}</a>', t)
    return t[len('<body>'):]

def foot(depth, extra=''):
    up = '../' * depth
    return f'''
  <footer>
    <span>© 2026 Свои люди в Швейцарии · <a href="{up}o-proekte/">О проекте</a> · проект <a href="https://voznesenskaya.ch/">Ирины Вознесенской</a></span>
    <span><a href="{up}">Специалисты</a> · <a href="{up}shveycariya/">Как устроена Швейцария</a> · <a href="{up}instrumenty/">Полезные инструменты</a> · <a href="{up}events/">События</a> · <a href="{up}kursy/">Курсы</a> · <a href="{up}novosti/">Что нового</a> · <a href="{up}dlya-specialistov/">Для специалистов</a> · <a href="https://svoiludi.ch/privacy/">Политика конфиденциальности</a> · <a href="https://voznesenskaya.ch/impressum/">Выходные данные</a></span>
  </footer>
</main>
{extra}<script src="/assets/temy.js" defer></script>
<script data-goatcounter="https://svoiludi.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
<script src="/assets/share.js" defer></script>
<script src="/assets/samesite.js"></script>
</body>
</html>
'''

GLYPH = {  # знак в центре «круга своих» (правило: у каждой страницы svoiludi.ch свой знак)
    'info': '<circle cx="180" cy="165" r="22" fill="#F3E3C2" stroke="#6E4F3C" stroke-width="3"/><path d="M180 160v16" stroke="#6E4F3C" stroke-width="4" stroke-linecap="round"/><circle cx="180" cy="151" r="2.8" fill="#6E4F3C"/>',
    'news': '<rect x="160" y="146" width="34" height="38" rx="4" fill="#F3E3C2" stroke="#6E4F3C" stroke-width="3"/><path d="M194 156h7v22a6 6 0 0 1-6 6M167 156h20M167 165h20M167 174h13" fill="none" stroke="#6E4F3C" stroke-width="3" stroke-linecap="round"/>',
    'pro': '<circle cx="180" cy="156" r="9" fill="#F3E3C2" stroke="#6E4F3C" stroke-width="3"/><path d="M162 184c2-10 9-15 18-15s16 5 18 15" fill="#F3E3C2" stroke="#6E4F3C" stroke-width="3" stroke-linejoin="round"/><path d="M188 176l5 5 9-10" fill="none" stroke="#4F5E3E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    'path': '<path d="M162 184c10-4 4-14 14-18s10-10 2-16" fill="none" stroke="#6E4F3C" stroke-width="3.4" stroke-linecap="round" stroke-dasharray="1 6"/><circle cx="162" cy="184" r="4.5" fill="#B98324"/><path d="M178 146v-10l12 4-12 4" fill="#F3E3C2" stroke="#6E4F3C" stroke-width="2.6" stroke-linejoin="round"/>',
}
def art(kind):
    a = re.sub(r'(<circle cx="180" cy="165" r="40"[^>]*/>).*?(<circle cx="180\.0" cy="47\.0")', lambda m: m.group(1) + GLYPH[kind] + m.group(2), ART, count=1, flags=re.S)
    return a

def hero(eyebrow, h1, lead, kind, extra=''):
    return f'''  <section class="s-hero has-art" aria-labelledby="h1">
    <div class="hero-txt">
      <div class="eyebrow">{eyebrow}</div>
      <h1 id="h1">{h1}</h1>
      <p class="lead">{lead}</p>{extra}
    </div>
    {art(kind)}
  </section>
'''

def share(url, lead, text):
    return f'  <div class="share-slot" data-url="{url}" data-lead="{E(lead)}" data-text="{E(text)}"></div>\n'

def fan(x, up):
    d = os.path.join('instrumenty', 'preview', x)
    imgs = sorted([f for f in os.listdir(d) if f.endswith('.jpg')], key=lambda f: int(f.split('.')[0]))[:3] if os.path.isdir(d) else []
    if not imgs: return ''
    pics = ''.join(f'<img src="{up}instrumenty/preview/{x}/{f}" alt="" loading="lazy" style="--i:{i - (len(imgs) - 1) / 2}">' for i, f in enumerate(imgs))
    return f'<span class="tfan" aria-hidden="true">{pics}</span>'

def subscribe(up, where=''):
    if TG_CHANNEL:
        btn = f'<a class="btn sub-btn" href="{TG_CHANNEL}">Подписаться на новости в Telegram</a>'
        note = 'Раз в месяц: сроки, что изменилось в Швейцарии, новое на сайте. Отписаться можно в любой момент.'
    else:
        btn = f'<a class="btn sub-btn" href="{up}novosti/#podpiska">Подписаться на новости</a>'
        note = 'Раз в месяц: сроки, что изменилось в Швейцарии, новое на сайте. Telegram-канал «Свои люди» скоро откроется, ссылка появится здесь.'
    return f'<div class="sub{where}"><div><b>Новости «Своих людей»</b><p>{note}</p></div>{btn}</div>'

def write(rel, out):
    os.makedirs(os.path.dirname(rel) or '.', exist_ok=True)
    open(rel, 'w', encoding='utf-8').write(out)

# --- «О проекте» ---
def o_proekte():
    rel = 'o-proekte/index.html'; url = SITE + 'o-proekte/'
    title = 'О проекте «Свои люди в Швейцарии» — кто мы и как проверяем специалистов'
    desc = 'Кто создал «Свои люди в Швейцарии», зачем этот проект, как мы проверяем специалистов, что бесплатно, что платно и как с нами связаться. Справочник и сообщество для тех, кто говорит по-русски и по-украински.'
    main = '<main class="page">\n' + hero('О проекте · Свои люди в Швейцарии', 'Чтобы в новой стране <em>было на кого опереться</em>',
        'Справочник специалистов, которые говорят по-русски и по-украински, простые ответы о жизни в Швейцарии, бесплатные инструменты, события и курсы. Здесь рассказываем, кто это делает, на какие деньги и как мы проверяем тех, кого показываем.', 'info') + f'''
  <div class="prose">
    <section aria-labelledby="h-why"><h2 id="h-why">Зачем это всё</h2>
      <p>Переезд в Швейцарию — это сразу пермит, страховка, налоги, школа, жильё и письма на немецком, французском или итальянском. Ответы есть, но разбросаны по сотне сайтов ведомств. А хорошего врача, юриста или мастера, с которым можно говорить на своём языке, ищут по чатам и знакомым.</p>
      <p>«Свои люди» собирают это в одном месте. Простыми словами — как здесь всё устроено. Бесплатные инструменты — чтобы письмо, расчёт или заявление сделать самой. И справочник специалистов, которые работают официально и говорят на твоём языке.</p>
    </section>
    <section aria-labelledby="h-who"><h2 id="h-who">Кто это делает</h2>
      <p>Проект создала и ведёт <b>Ирина Вознесенская</b>. Она живёт в Швейцарии, работает коучем по адаптации и сама прошла путь эмигрантки: от первого письма из общины до своего дела. Тексты статей проверяются по официальным источникам, ссылки на них стоят внизу каждой статьи.</p>
      <p>Ирина есть и в справочнике, на общих правилах, как все специалисты. Её личный сайт о коучинге — <a href="https://voznesenskaya.ch/">voznesenskaya.ch</a>. «Свои люди» — отдельный проект, и здесь никто не получает преимуществ из-за знакомства.</p>
    </section>
    <section aria-labelledby="h-check"><h2 id="h-check">Как мы проверяем специалистов</h2>
      <ul class="okl">
        <li><b>У всех одинаково.</b> Проверяем регистрацию в официальных реестрах: номер UID (CHE-…) или письмо AHV-кассы о самозанятости.</li>
        <li><b>Для регулируемых профессий</b> — номер в официальном реестре: врачи в MedReg, психологи и психотерапевты в PsyReg, физиотерапевты, остеопаты и акушерки в GesReg.</li>
        <li><b>Защищённые звания</b> («психолог», «психотерапевт» и другие) показываем, только если они подтверждены.</li>
        <li><b>Дипломы, награды, стаж и отзывы мы не проверяем.</b> За эти сведения отвечает сам специалист.</li>
        <li><b>Каждую карточку подтверждает сам специалист</b> перед публикацией. Ошибку можно исправить в любой момент одним письмом.</li>
      </ul>
    </section>
    <section aria-labelledby="h-money"><h2 id="h-money">Что бесплатно и на что живёт проект</h2>
      <ul class="okl">
        <li><b>Для тебя бесплатно всё:</b> статьи, инструменты, PDF, поиск специалистов, события и курсы. Без регистрации.</li>
        <li><b>Для специалистов</b> базовая карточка бесплатна в период запуска. Платные только дополнительные возможности, например «VIP-партнёр».</li>
        <li><b>Платное место всегда видно.</b> У карточки VIP есть пометка «Платное размещение», а вне каталога — «Реклама». Слов «рекомендуем» или «лучший» рядом с платным местом нет.</li>
        <li><b>Вакансии и партнёрство</b> — бесплатно для всех и всегда. Это поддержка сообщества, а не коммерческая услуга.</li>
      </ul>
    </section>
    <section aria-labelledby="h-data"><h2 id="h-data">Твои данные</h2>
      <p>Всё, что ты вводишь в инструментах, остаётся в твоём браузере и никуда не отправляется. Статистику посещений мы считаем без cookies и без IP-адресов. Подробно — в <a href="https://svoiludi.ch/privacy/">политике конфиденциальности</a>.</p>
    </section>
    <section aria-labelledby="h-contact"><h2 id="h-contact">Как с нами связаться</h2>
      <p>Нашла ошибку, хочешь предложить тему или разместиться — пиши на <a href="mailto:voznesenskaya.iryna@gmail.com">voznesenskaya.iryna@gmail.com</a>. Адрес проекта: c/o Alonira.ch AG, Poststrasse 6, 6302 Zug. <a href="https://voznesenskaya.ch/impressum/">Выходные данные</a>.</p>
      <span class="addbtns"><a class="btn" href="../">Найти специалиста</a><a class="btn ghost" href="../shveycariya/">Как устроена Швейцария</a><a class="btn ghost" href="../dlya-specialistov/">Для специалистов</a></span>
    </section>
    {subscribe('../')}
  </div>
''' + share(url, 'Перешли тем, кто недавно переехал. Сообщение уже готово.', f'Привет! «Свои люди в Швейцарии» — специалисты на русском и украинском, простые ответы о жизни здесь и бесплатные инструменты. {url}')
    write(rel, head(title, desc, url, 1) + '<body>' + top(rel) + main + foot(1))

# --- «Для специалистов» ---
def dlya_specialistov():
    rel = 'dlya-specialistov/index.html'; url = SITE + 'dlya-specialistov/'
    title = 'Для специалистов: разместиться в справочнике «Свои люди», вакансии и инструменты для своего дела'
    desc = 'Всё для специалистов, которые работают в Швейцарии и говорят по-русски или по-украински: как разместиться в справочнике (в период запуска бесплатно), значок для сайта, вакансии и партнёрство, бесплатные инструменты для своего дела — счёт с QR-кодом, учёт доходов, часы по клиентам.'
    tools = ['schet-qr', 'dohody-rashody', 'chasy-po-klientam', 'uchet-vremeni', 'anketa-klienta', 'zarplata', 'etiketka-eda', 'statuty-fereyna']
    cards = ''.join(f'<a class="tool tpv" href="../instrumenty/{x}/">{fan(x, "../")}<span class="ttxt"><b>{TOOLNAMES.get(x, x)}</b><em>Бесплатно · открыть →</em></span></a>' for x in tools if HAS(x))
    vak = os.path.isfile('vakansii/index.html')
    main = '<main class="page">\n' + hero('Для специалистов · Свои люди в Швейцарии', 'Вас ищут <em>на вашем языке</em>',
        'Если вы работаете в Швейцарии официально и помогаете людям на русском или украинском, здесь всё для вас: размещение в справочнике, значок для сайта, вакансии и партнёрство и бесплатные инструменты для своего дела.', 'pro',
        '\n      <span class="addbtns"><a class="btn" href="../join/">Разместиться в справочнике</a><a class="btn ghost" href="../join/#form">Заполнить анкету</a></span>') + f'''
  <div class="pro-grid">
    <a class="pro-card" href="../join/"><b>Разместиться в справочнике</b><p>Анкета за 15 минут. Базовая карточка в период запуска бесплатна: фото, профиль, услуги, контакты, визитка и прайс-лист для телефона и PDF.</p><span class="go">Как разместиться →</span></a>
    <a class="pro-card" href="../join/#form"><b>Анкета специалиста</b><p>Заполните основное на сайте, скачайте анкету в Word, допишите и отправьте с портретным фото.</p><span class="go">Заполнить →</span></a>
    <a class="pro-card" href="../badge/"><b>Значок «Свои люди» для сайта</b><p>Поставьте значок со ссылкой на свою карточку на сайт, в Instagram или подпись письма. Клиентам проще вас найти и проверить.</p><span class="go">Взять значок →</span></a>
    {'<a class="pro-card" href="../vakansii/"><b>Вакансии и партнёрство</b><p>Ищете сотрудника или партнёра? Бесплатно для всех и всегда.</p><span class="go">Открыть →</span></a>' if vak else '<div class="pro-card soon"><span class="soon-tag">Скоро</span><b>Вакансии и партнёрство</b><p>«Ищу сотрудника» и «Ищу партнёра». Бесплатно для членов сообщества «Свои люди». Не коммерческая услуга.</p></div>'}
    <a class="pro-card" href="../kursy/#add"><b>Добавить курс или занятие</b><p>Регулярные занятия, курсы, мастер-классы, вебинары. Размещение бесплатно до конца 2027 года. Курсы видны и в вашей карточке.</p><span class="go">Добавить курс →</span></a>
    <a class="pro-card" href="../events/#add"><b>Добавить событие</b><p>Встреча, праздник, выставка, лекция. События видны в афише и в вашей карточке.</p><span class="go">Добавить событие →</span></a>
  </div>
  <section class="tm-schemes" aria-labelledby="h-tools"><h2 id="h-tools">Инструменты для своего дела</h2><p>Бесплатно, без регистрации, PDF на русском и на языке кантона.</p><div class="pro-tools">{cards}</div></section>
  <section aria-labelledby="h-know"><h2 id="h-know">Полезно знать</h2><div class="rel">
    <a href="../shveycariya/samozanyatost/">Как открыть ИП в Швейцарии (selbständig)</a>
    <a href="../situacii/svoe-delo/">Своё дело: всё по порядку</a>
    <a href="../shveycariya/professii-krasota/">Красота: маникюр, косметика, массаж</a>
    <a href="../shveycariya/professii-konsultirovanie/">Коучинг, консультирование, психология</a>
    <a href="../shveycariya/professii-prepodavanie/">Преподавание и онлайн-курсы</a>
    <a href="../shveycariya/vereine/">Ферайны и волонтёрство</a>
  </div></section>
  <p class="fine">Проверка у всех одинаковая: регистрация в официальных реестрах. Платные возможности всегда помечены. <a href="../o-proekte/">О проекте и как мы проверяем</a>.</p>
''' + share(url, 'Перешлите коллегам, которые работают на русском или украинском.', f'Здравствуйте! В справочнике «Свои люди в Швейцарии» можно разместиться бесплатно в период запуска. Там же бесплатные инструменты для своего дела: счёт с QR-кодом, учёт доходов и часов. {url}')
    write(rel, head(title, desc, url, 1) + '<body>' + top(rel, ('Разместиться', 'join/')) + main + foot(1))

# --- «Моя ситуация» ---
def tiles(up, cls='sit-grid'):
    return f'<div class="{cls}">' + ''.join(f'<a class="sit-card" href="{up}situacii/{s["slug"]}/"><svg class="tm-ic" viewBox="0 0 100 100" width="40" height="40" aria-hidden="true">{MODICON.get(s["icon"], "")}</svg><span><b>{s["title"]}</b><span>{s["short"]}</span></span></a>' for s in SITUACII) + '</div>'

def situacii_index():
    rel = 'situacii/index.html'; url = SITE + 'situacii/'
    title = 'Моя ситуация в Швейцарии: что делать по порядку · Свои люди'
    desc = 'Выбери свою ситуацию — только приехала, ищу работу, дети и школа, деньги и налоги, жильё, своё дело, здоровье, пришло письмо — и получи шаги по порядку, статьи, инструменты и специалистов на русском.'
    main = '<main class="page">\n' + hero('Моя ситуация · Свои люди в Швейцарии', 'С чего начать <em>именно тебе</em>',
        'Выбери, что сейчас происходит. Покажем шаги по порядку, статьи, бесплатные инструменты и специалистов, которые разбираются именно в этом.', 'path') + '  ' + tiles('../') + '\n' + share(url, 'Перешли тем, кто недавно переехал. Сообщение уже готово.', f'Привет! Тут по шагам, что делать в Швейцарии в разных ситуациях: только приехала, работа, дети, налоги, жильё. {url}')
    write(rel, head(title, desc, url, 1) + '<body>' + top(rel) + main + foot(1))

def situaciya(s):
    rel = f'situacii/{s["slug"]}/index.html'; url = SITE + f'situacii/{s["slug"]}/'; up = '../../'
    steps = ''.join(f'<li><span>{txt}' + (f' <a href="{up}shveycariya/{slug}/">Подробнее →</a>' if slug else '') + '</span></li>' for txt, slug in s['steps'])
    # шаги без статьи: экстренные номера и справочник
    steps = steps.replace('<b>Сохрани экстренные номера</b> и данные семьи на одном листе: AHV, страховки, врачи.</span>', f'<b>Сохрани экстренные номера</b> и данные семьи на одном листе: AHV, страховки, врачи. <a href="{up}instrumenty/ekstrennye-nomera/">Сделать карточку →</a></span>')
    steps = steps.replace('в период запуска бесплатно.</span>', f'в период запуска бесплатно. <a href="{up}dlya-specialistov/">Для специалистов →</a></span>')
    cards = ''.join(f'<a class="tm-card" href="{up}shveycariya/{t}/"><b>{BYSLUG[t]["title"]}</b><p>{BYSLUG[t]["lead"]}</p><span class="go">Читать →</span></a>' for t in s['topics'] if t in BYSLUG and BYSLUG[t]['ready'])
    tools = ''.join(f'<a class="tool tpv" href="{up}instrumenty/{x}/">{fan(x, up)}<span class="ttxt"><b>{TOOLNAMES.get(x, x)}</b><em>Бесплатно · открыть →</em></span></a>' for x in s['tools'] if HAS(x))
    tabs = {'kursy': ('Курсы и занятия', 'kursy/', 'Язык, работа и жизнь в Швейцарии — курсы рядом и онлайн.'), 'events': ('События', 'events/', 'Встречи и праздники в твоём кантоне — чтобы не быть одной.')}
    tabsh = ''.join(f'<a class="tool" href="{up}{tabs[x][1]}"><b>{tabs[x][0]}</b><span>{tabs[x][2]}</span></a>' for x in s['tabs'])
    profs = ', '.join(sorted({CATT.get(c, c) for c, _ in s['help']}))
    helpj = E(json.dumps(s['help'], ensure_ascii=False))
    other = ''.join(f'<a href="../{o["slug"]}/">{o["title"]}</a>' for o in SITUACII if o['slug'] != s['slug'])
    main = f'''<main class="page">
  <div class="crumbs"><a href="../">Моя ситуация</a> · <a href="{up}shveycariya/">Как устроена Швейцария</a></div>
  <section class="s-hero" aria-labelledby="h1" style="padding-top:18px">
    <h1 id="h1">{s['title']}</h1>
    <p class="lead">{s['lead']}</p>
  </section>
  <div class="art">
    <article class="art-main">
      <section class="todo" aria-labelledby="todo-h"><h2 id="todo-h">Что сделать по порядку</h2><ol>{steps}</ol></section>
      <section aria-labelledby="t-h"><h2 id="t-h">Читать по теме</h2><div class="tm-grid sit-topics">{cards}</div></section>
    </article>
    <aside class="side" aria-label="Что поможет">
      {f'<div class="box"><h3>Инструменты</h3>{tools}{tabsh}</div>' if tools or tabsh else ''}
      <div class="box" id="sp" data-help="{helpj}"><h3>Кто поможет</h3><p class="note" style="margin:0">{profs}</p><div class="sp-list"></div><a class="more" href="{up}">Все специалисты →</a>
        <p class="note">Специалисты сами отвечают за свои услуги. Проверка у всех одинаковая, <a href="{up}o-proekte/">как мы проверяем</a>.</p></div>
      <div class="box"><h3>Другие ситуации</h3><div class="rel">{other}</div></div>
    </aside>
    <div class="art-foot">{subscribe(up)}</div>
  </div>
  <p class="fine"><b>Это общая информация, а не юридическая или налоговая консультация.</b> Правила зависят от кантона и меняются. Проверяй актуальное в своём кантоне или у специалиста.</p>
''' + share(url, 'Перешли тому, кому это сейчас нужно. Сообщение уже готово.', f'Привет! Тут по шагам на русском: {s["title"].lower()} — что сделать, статьи, инструменты и специалисты. {url}')
    write(rel, head(s['seo'] + ' · Свои люди', s['desc'], url, 2) + '<body data-root="../../">' + top(rel) + main + foot(2, '<script src="/data/specialists.js"></script>\n'))

# --- «Что нового» ---
def news_item(n, up, full=True):
    links = ''.join(f'<a href="{up}{p}">{E(t)} →</a>' for t, p in n.get('links', []))
    warn = f'<p class="attn"><i class="wi"></i>{n["warn"]}</p>' if n.get('warn') else ''
    src = f'<p class="nsrc">Источник: <a href="{n["src"][1]}">{E(n["src"][0])}</a></p>' if n.get('src') else ''
    return f'''<article class="news k-{n['kind']}" id="{n['id']}" data-kind="{n['kind']}"><div class="nmeta"><span class="nk">{KIND[n['kind']]}</span><time datetime="{n['date']}">{ddate(n['date'])}</time><span class="nt">{E(n.get('topic', ''))}</span></div><h3>{E(n['title'])}</h3>{'<p>' + n['text'] + '</p>' + warn + src if full else ''}<div class="nlinks">{links}</div></article>'''

def novosti():
    rel = 'novosti/index.html'; url = SITE + 'novosti/'
    items = sorted(NEWS, key=lambda n: n['date'], reverse=True)
    title = 'Что нового в Швейцарии и на сайте «Свои люди»: изменения, сроки месяца, новые статьи'
    desc = 'Что изменилось в Швейцарии (суммы, сроки, правила), сроки месяца — медстраховка, налоги, 3a — и новое на сайте «Свои люди»: статьи и бесплатные инструменты. Коротко, на русском, с официальными источниками.'
    filt = '<div class="nfilter" role="group" aria-label="Что показать"><button type="button" aria-pressed="true" data-k="">Всё</button>' + ''.join(f'<button type="button" aria-pressed="false" data-k="{k}">{v}</button>' for k, v in [('change', KIND['change']), ('month', KIND['month']), ('site', KIND['site'])]) + '</div>'
    feed = ''.join(news_item(n, '../') for n in items)
    script = '''<script>(function(){var b=document.querySelectorAll('.nfilter button');b.forEach(function(x){x.addEventListener('click',function(){b.forEach(function(y){y.setAttribute('aria-pressed',y===x)});var k=x.dataset.k;document.querySelectorAll('.news').forEach(function(n){n.hidden=k&&n.dataset.kind!==k});var e=document.getElementById('nempty');if(e)e.hidden=!!document.querySelector('.news:not([hidden])')})})})();</script>\n'''
    main = '<main class="page">\n' + hero('Что нового · Свои люди в Швейцарии', 'Что нового <em>в Швейцарии и у нас</em>',
        'Что изменилось в правилах и суммах, какие сроки в этом месяце и что нового на сайте. Коротко, с официальными источниками и ссылками на подробные статьи.', 'news',
        '\n      ' + subscribe('../', ' sub-in')) + f'''
  {filt}
  <div class="nfeed">{feed}<p id="nempty" class="tm-empty" hidden>Здесь пока пусто. Загляни позже или подпишись на новости.</p></div>
  <section class="sub-box" id="podpiska" aria-labelledby="h-sub"><h2 id="h-sub">Подписаться на новости</h2>
    {subscribe('../')}
    <p class="note">Для программ чтения новостей есть <a href="rss.xml">лента RSS</a>.</p>
  </section>
  <p class="fine"><b>Это общая информация, а не юридическая или налоговая консультация.</b> У каждой новости дата и официальный источник. Нашла ошибку — <a href="mailto:voznesenskaya.iryna@gmail.com">напиши нам</a>, исправим и отметим «Исправлено».</p>
''' + share(url, 'Перешли тем, кому это важно. Сообщение уже готово.', f'Привет! Тут коротко, что изменилось в Швейцарии, какие сроки в этом месяце и что нового на сайте «Свои люди». {url}')
    write(rel, head(title, desc, url, 1, f'<link rel="alternate" type="application/rss+xml" title="Свои люди — что нового" href="{url}rss.xml">\n') + '<body>' + top(rel) + main + foot(1, script))
    # данные для главной и для будущей рассылки
    write('data/news.js', '/* Собирается _i18n/struktura_src/build.py из data.py — руками не править. «Что нового», 09.10.2026. */\nwindow.SVOI_NEWS = ' + json.dumps(items, ensure_ascii=False, separators=(',', ':')) + ';\n')
    # RSS
    def rfc(iso): d = datetime.datetime.fromisoformat(iso + 'T08:00:00+02:00'); return d.strftime('%a, %d %b %Y %H:%M:%S +0200')
    it = ''.join(f'<item><title>{E(n["title"])}</title><link>{url}#{n["id"]}</link><guid isPermaLink="false">svoiludi-{n["id"]}</guid><pubDate>{rfc(n["date"])}</pubDate><category>{KIND[n["kind"]]}</category><description>{E(re.sub("<[^>]+>", "", n["text"]))}</description></item>' for n in items)
    # украинская лента — тексты из памяти переводов (если перевода ещё нет, остаётся русский)
    try: TM = json.load(open('_i18n/tm_uk.json', encoding='utf-8'))
    except Exception: TM = {}
    tr = lambda t: TM.get(t, t)
    itu = ''.join(f'<item><title>{E(tr(n["title"]))}</title><link>{SITE}uk/novosti/#{n["id"]}</link><guid isPermaLink="false">svoiludi-uk-{n["id"]}</guid><pubDate>{rfc(n["date"])}</pubDate><description>{E(re.sub("<[^>]+>", "", tr(n["text"])))}</description></item>' for n in items)
    write('uk/novosti/rss.xml', f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Свої люди у Швейцарії — що нового</title><link>{SITE}uk/novosti/</link><description>Що змінилося у Швейцарії, терміни місяця і нове на сайті svoiludi.ch</description><language>uk</language>{itu}</channel></rss>\n')
    write('novosti/rss.xml', f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>Свои люди в Швейцарии — что нового</title><link>{url}</link><description>Что изменилось в Швейцарии, сроки месяца и новое на сайте svoiludi.ch</description><language>ru</language>{it}</channel></rss>\n')

# --- блоки на главной и переключатель «События | Курсы» ---
def home_blocks():
    p = 'index.html'; h = open(p, encoding='utf-8').read()
    h = re.sub(r'\n?<!--sit-->.*?<!--sit-->', '', h, flags=re.S)
    latest = ''.join(news_item(n, '', full=False) for n in sorted(NEWS, key=lambda n: n['date'], reverse=True)[:3])
    block = f'''
<!--sit--><link rel="stylesheet" href="assets/struktura.css"><section class="home-sit page" aria-labelledby="h-sit">
  <h2 id="h-sit">Моя ситуация: с чего начать</h2>
  <p class="lead" style="max-width:62ch">Выбери, что сейчас происходит. Покажем шаги по порядку, статьи, бесплатные инструменты и специалистов.</p>
  {tiles('')}
  <div class="home-news"><div class="hn-head"><h2>Что нового</h2><a href="novosti/">Все новости →</a></div><div class="nfeed short">{latest}</div>{subscribe('')}</div>
</section><!--sit-->'''
    # после первого экрана (hero) главной
    m = re.search(r'</section>', h[h.index('<main'):])
    i = h.index('<main') + m.end()
    h = h[:i] + block + h[i:]
    open(p, 'w', encoding='utf-8').write(h)

def evk():
    for p, cur in [('events/index.html', 'ev'), ('kursy/index.html', 'ku')]:
        h = open(p, encoding='utf-8').read()
        h = re.sub(r'<!--evk-->.*?<!--evk-->', '', h, flags=re.S)
        sw = ('<!--evk--><nav class="evk" aria-label="События и курсы">'
              + (f'<a href="./" aria-current="page">События</a><a href="../kursy/">Курсы и занятия</a>' if cur == 'ev' else f'<a href="../events/">События</a><a href="./" aria-current="page">Курсы и занятия</a>')
              + '</nav><style>.evk{display:inline-flex;gap:4px;background:var(--sage-soft,#E3E6D6);border-radius:12px;padding:4px;margin:0 0 14px}.evk a{padding:7px 16px;border-radius:9px;font-weight:700;font-size:.9rem;text-decoration:none;color:var(--ink)}.evk a[aria-current]{background:var(--paper,#FFFCF8);box-shadow:0 1px 4px rgba(0,0,0,.12)}</style><!--evk-->')
        h = re.sub(r'(<div class="hero-txt">\s*)', lambda m: m.group(1) + sw, h, count=1)
        open(p, 'w', encoding='utf-8').write(h)

def bridges():   # одна спокойная строка в «Мои эмоции», «Мой день», «Мой год» (мосты к теме адаптации и тестам автора проекта)
    for t in ['moi-emocii', 'moj-den', 'moj-god']:
        p = f'instrumenty/{t}/index.html'; h = open(p, encoding='utf-8').read()
        h = re.sub(r'<!--most-->.*?<!--most-->', '', h, flags=re.S)
        line = ('<!--most--><p class="most" style="max-width:72ch;margin:14px auto 0;font-size:.9rem;color:var(--muted)">Хочется разобраться глубже, что с тобой происходит после переезда? '
                'Почитай тему <a href="../../shveycariya/adaptaciya/">«Адаптация и самочувствие»</a> или пройди бесплатный тест автора проекта <a href="https://voznesenskaya.ch/kompas/">«Компас адаптации»</a>.</p><!--most-->')
        h = re.sub(r'(<div class="disc" role="note">.*?</div>)', lambda m: m.group(1) + line, h, count=1, flags=re.S)
        open(p, 'w', encoding='utf-8').write(h)

from_build = {}
exec(re.search(r"_C = .*?\n}\n", open(os.path.join(HERE, '..', 'shveycariya_src', 'build.py'), encoding='utf-8').read(), re.S).group(0), from_build)
MODICON = from_build['MODICON']

if __name__ == '__main__':
    o_proekte(); dlya_specialistov(); situacii_index()
    for s in SITUACII: situaciya(s)
    novosti(); home_blocks(); evk(); bridges()
    print('ok: o-proekte, dlya-specialistov, situacii (', len(SITUACII), '), novosti (', len(NEWS), '), главная, events/kursy')
