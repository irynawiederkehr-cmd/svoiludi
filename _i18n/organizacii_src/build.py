"""Раздел «Организации» на движке справочника специалистов (решение Ирины 12.10.2026, копия).
Ирина: «в организациях карточки должны быть идентичными карточкам специалистов со всеми лайками, сердечками, файлами для скачивания
и проверкой и т. д.; единственное — это организация, а так дизайн и правила все одинаково».

Поэтому organizacii/index.html собирается из главной страницы (index.html — справочник специалистов): та же шапка и стили, тот же подбор
(кантон, город, язык, направление, поиск по слову, пометки), те же карточки, окно карточки, сердечки, «Мой список», «В контакты»,
«Поделиться», «Визитка PNG», «Прайс-лист PNG», «PDF», блок проверки, предпросмотр по ссылке с «Подтверждаю», режим Ирины, карта,
VIP-партнёр, VIP-партнёр ТОП, VIP-онлайн, VIP-онлайн ТОП. Меняются только: первый экран, слова «специалист» → «организация»,
направления организаций, блоки о размещении и заявка организации (body.html, forma.js), данные (data/organizations.js через adapter.js).

Правка главной (index.html) сразу попадает сюда при следующей сборке. Если строка из списка REPL ниже в главной поменялась, сборка
остановится с ошибкой — тогда поправить строку здесь.
Запуск из корня репозитория: python3 _i18n/organizacii_src/build.py ; потом python3 _i18n/struktura_src/nav.py, python3 _i18n/pwa.py,
python3 _i18n/sync.py check, python3 _i18n/build_search.py, node _i18n/og.js organizacii. Правила — документ проекта «obshchestvennye-organizacii.md»."""
import os, re, hashlib
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
os.chdir(ROOT)
ver = lambda p: hashlib.md5(open(p, 'rb').read()).hexdigest()[:8]
src = open('index.html', encoding='utf-8').read()
src = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', src, flags=re.S)        # переключатель языка ставит sync.py
src = re.sub(r'<!--pwa-->.*?<!--/pwa-->', '', src, flags=re.S) if '<!--/pwa-->' in src else src
body_html = open(os.path.join(HERE, 'body.html'), encoding='utf-8').read()

def need(s, a, n=1):
    c = s.count(a)
    assert c == n if n else c >= 1, f'в главной не найдено ({c} вместо {n}): {a[:90]}'

# ---------- шапка ----------
head = src[:src.index('</head>')]
T = 'Организации для украинцев и русскоязычных в Швейцарии — ферайны, фонды, центры помощи и фирмы своих · Свои люди'
D = 'Украинские и русскоязычные организации в Швейцарии: центры помощи, школы выходного дня, общества, хоры, деловые сообщества и фирмы своих. С проверкой регистрации, по кантонам.'
OGT = 'Организации, которые помогают своим — Свои люди в Швейцарии'
OGD = 'Центры помощи, школы, общества и деловые сообщества для украинцев и русскоязычных в Швейцарии. Кто помогает людям бесплатно, размещается бесплатно всегда.'
head = re.sub(r'<title>[^<]*</title>', f'<title>{T}</title>', head, 1)
head = head.replace('<link rel="canonical" href="https://svoiludi.ch/">', '<link rel="canonical" href="https://svoiludi.ch/organizacii/">')
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{D}">', head, 1)
head = re.sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{OGT}">', head, 1)
head = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{OGD}">', head, 1)
head = head.replace('<meta property="og:url" content="https://svoiludi.ch/">', '<meta property="og:url" content="https://svoiludi.ch/organizacii/">')
head = head.replace('https://svoiludi.ch/fav/og-svoi-ludi.jpg', 'https://svoiludi.ch/organizacii/og-image.jpg')
# стили формы заявки и блоков о размещении — со страницы «Вакансии» (как было), только нужные правила
vak = open('vakansii/index.html', encoding='utf-8').read()
vcss = ''.join(re.findall(r'<style[^>]*>(.*?)</style>', vak[:vak.index('</head>')], flags=re.S))
KEEP = ('.form', '.f ', '.f>', '.f.', '.f{', '.f:', '.chk', '.zok', '.vac-add', '.vac-kinds', '.jc', '.steps', '.terms', '.careful', '.fine',
        '.f-row', '.f-2', '.f-3', '.hint', '.req', '.miss', '.draft', '.lnk', '.zfind', '.zf', '.addr', '.plz', '.msg', '.send')
def pick(css):
    out, i = [], 0
    while i < len(css):
        j = css.find('{', i)
        if j < 0: break
        sel = css[i:j].strip()
        if sel.startswith('@media') or sel.startswith('@supports'):
            depth, k = 1, j + 1
            while depth and k < len(css):
                depth += {'{': 1, '}': -1}.get(css[k], 0); k += 1
            inner = pick(css[j + 1:k - 1])
            if inner: out.append(f'{sel}{{{inner}}}')
            i = k; continue
        k = css.find('}', j); rule = css[i:k + 1].strip()
        if all(any(x.strip().startswith(p) or (' ' + p.strip()) in ' ' + x.strip() for p in KEEP) for x in sel.split(',')) and sel:
            out.append(rule)
        i = k + 1
    return ''.join(out)
extra = open(os.path.join(HERE, 'extra.css'), encoding='utf-8').read()
head += '<style id="org-forms">' + pick(vcss) + '</style>\n<style id="org-extra">' + extra + '''
/* плитка организации без логотипа (решение Ирины 12.10.2026: «отработай красивый дизайн»): медальон со значком направления на мягком фоне цвета направления */
.ph.org-ico{position:relative;display:grid;place-items:center;overflow:hidden;border:1px solid color-mix(in srgb,var(--oc,#4F5E3E) 24%,#fff)!important;border-style:solid!important;
  background:radial-gradient(120% 90% at 85% 100%,color-mix(in srgb,var(--oc,#4F5E3E) 26%,#FFFCF8) 0%,transparent 60%),linear-gradient(160deg,color-mix(in srgb,var(--oc,#4F5E3E) 8%,#FFFCF8),color-mix(in srgb,var(--oc,#4F5E3E) 16%,#FFFCF8))!important}
.ph.org-ico::before{content:"";position:absolute;width:76%;aspect-ratio:1;border-radius:50%;background:#FFFCF8;box-shadow:0 8px 18px -10px color-mix(in srgb,var(--oc,#4F5E3E) 70%,transparent),inset 0 0 0 1.5px color-mix(in srgb,var(--oc,#4F5E3E) 32%,#fff)}
.ph.org-ico::after{content:"";position:absolute;width:88%;aspect-ratio:1;border-radius:50%;border:1px dashed color-mix(in srgb,var(--oc,#4F5E3E) 32%,transparent)}
.ph.org-ico svg{position:relative;width:46%;height:46%}
#qmCard>.free-line{margin:2px 0 14px;font-size:.88rem}
</style>\n'''

# ---------- страница ----------
top = src[src.index('</head>'):src.index('<main class="page">')]
main = src[src.index('<main class="page">'):src.index('</main>')]
rest = src[src.index('</main>'):]
# первый экран — организации (body.html), подбор — как у специалистов
ob = body_html
o_hero = ob[ob.index('<section class="s-hero"'):ob.index('</section>', ob.index('<section class="s-hero"')) + len('</section>')]
i = main.index('<section class="s-hero'); j = main.index('</section>', i) + len('</section>')
main = main[:i] + o_hero + main[j:]
# блоки о проекте и «Ты специалист?» → «Будь внимательна», «Разместите организацию», заявка, условия раздела, подвал (body.html)
i = main.index('<section class="about"'); o_low = ob[ob.index('<section class="careful"'):ob.index('</main>')]
main = main[:i] + o_low
REPL_HTML = [
    ('Настоящие специалисты стоят выше образцов.', 'Настоящие организации стоят выше образцов.'),
    ('<section class="finder" role="search" aria-label="Подбор специалиста">', '<section class="finder" role="search" aria-label="Подбор организации">'),
    ('placeholder="Например: массаж, налоги, логопед"', 'placeholder="Например: школа, хор, помощь с документами"'),
    ('<div class="fld w3">\n        <label for="spec">', '<div class="fld w3" id="spec-fld">\n        <label for="spec">'),
    ('<label for="cat"><i>4</i>Направление</label>', '<label for="cat"><i>4</i>Направление<button type="button" class="qh" data-help="dir" aria-label="Подсказка: Направление" aria-expanded="false">?</button></label>'),
    ('aria-label="Карта специалистов"', 'aria-label="Карта организаций"'),
]
for a, b in REPL_HTML: need(main, a); main = main.replace(a, b)
# «Не нашли нужного специалиста?»
i = main.index('<div class="nf">'); j = main.index('</div>\n', main.index('</span>', i)) + len('</div>\n')
main = main[:i] + '''<div class="nf">
    <div><b>Знаете организацию, которой здесь нет?</b><p>Расскажите ей о «Своих людях»: заявку она подаёт сама, прямо на этой странице. Так её найдут и те, кто только приехал, и те, кто живёт здесь давно и ищет свой круг.</p></div>
    <span style="display:flex;flex-wrap:wrap;gap:10px"><a class="btn" href="#zayavka">Заявка на размещение организации</a><a class="btn ghost" id="nfbtn" href="mailto:voznesenskaya.iryna@gmail.com">Написать письмо</a></span>
  </div>
''' + main[j:]

# ---------- скрипты ----------
need(rest, '<script src="/data/specialists.js')
rest = re.sub(r'<script src="/data/specialists\.js\?v=[0-9a-f]+"></script>', f'<script src="/data/specialists.js?v={ver("data/specialists.js")}"></script>', rest)
a = "window.IMG_BASE = 'img/';"; need(rest, a); rest = rest.replace(a, "window.IMG_BASE = '/img/org/';")
a = 'const SPECIALISTS = window.SPECIALISTS || [];'; need(rest, a)
adapter = open(os.path.join(HERE, 'orgdirs.js'), encoding='utf-8').read() + '\n' + open(os.path.join(HERE, 'adapter.js'), encoding='utf-8').read()   # направления и значки (kategorii_org.py) + перевод карточек
rest = rest.replace(a, '</script>\n<script>\n' + adapter + '\n</script>\n<script>\nconst SPECIALISTS = window.SVL_ORG.items;   // организации в виде карточек справочника (adapter.js)')
# слова и пути движка
REPL = [
    # направления, группы и пометки — организаций
    ('const CATS = {', 'const CATS = window.SVL_ORG.cats || {'),
    ('const GROUPS = {', 'const GROUPS = window.SVL_ORG.groups || {'),
    ('const TAGS = {', 'const TAGS = window.SVL_ORG.tags || {'),
    ("const LANG_FIRST = ['русский', 'украинский',", "const LANG_FIRST = ['украинский', 'русский',"),
    # фото: у организации логотип (по желанию), иначе значок направления; без логотипа карточка не скрывается
    ("  if (!s.photo) return 'Нет фото';\n", ''),
    ('const photo = s => s.photo ?', 'const photo = s => !s.photo ? `<span class="ph none org-ico" style="--oc:${(CATS[s.cat] || {}).c || \'#4F5E3E\'}" role="img" aria-label="${esc((CATS[s.cat] || {}).t || \'Организация\')}">${ico((CATS[s.cat] || {}).i || \'orgCommunity\', (CATS[s.cat] || {}).c, null, 48)}</span>` : s.photo ?'),
    (', портрет"', ', логотип"'),
    # тексты
    ("'Сердечки ставят посетители сайта. Один браузер даёт одно сердечко на карточку, регистрации нет. Сердечки не меняют порядок карточек и не заменяют проверку специалиста.", "'Сердечки ставят посетители сайта. Один браузер даёт одно сердечко на карточку, регистрации нет. Сердечки не меняют порядок карточек и не заменяют проверку организации."),
    ("Платное размещение. Специалист работает только онлайн и оплатил пакет «VIP-онлайн» или «VIP-онлайн ТОП», поэтому его карточка выделена и стоит выше в онлайн-списке во всей Швейцарии. Проверяем мы всех одинаково: работает ли специалист официально и есть ли он в официальном реестре.",
     "Платное размещение. Организация работает только онлайн и оплатила пакет «VIP-онлайн» или «VIP-онлайн ТОП», поэтому её карточка выделена и стоит выше в онлайн-списке во всей Швейцарии. Проверяем мы всех одинаково: зарегистрирована ли организация и есть ли она в официальном реестре или у неё есть устав."),
    ("Платное размещение. Специалист оплатил пакет «VIP-партнёр» или «VIP-партнёр ТОП», поэтому его карточка выделена и стоит выше. Проверяем мы всех одинаково: работает ли специалист официально и есть ли он в официальном реестре.",
     "Платное размещение. Организация оплатила пакет «VIP-партнёр» или «VIP-партнёр ТОП», поэтому её карточка выделена и стоит выше. Проверяем мы всех одинаково: зарегистрирована ли организация и есть ли она в официальном реестре или у неё есть устав."),
    ('title="Вымышленный специалист — так будет выглядеть ваша карточка"', 'title="Вымышленная организация — так будет выглядеть ваша карточка"'),
    ("plural(n, 'специалист', 'специалиста', 'специалистов')", "plural(n, 'организация', 'организации', 'организаций')"),
    ("'Нажми значок закладки на карточке, чтобы сохранить специалиста сюда.'", "'Нажми значок закладки на карточке, чтобы сохранить организацию сюда.'"),
    ('Ищу специалиста в справочнике «Свои люди в Швейцарии».\\n\\nКого ищу:', 'Ищу организацию в «Своих людях в Швейцарии».\\n\\nКакую ищу:'),
    ("encodeURIComponent('Ищу специалиста' +", "encodeURIComponent('Ищу организацию' +"),
    ('Онлайн-специалисты из других мест на карте не показываются.', 'Организации, которые работают онлайн из других мест, на карте не показываются.'),
    ("'Пока нет специалистов'", "'Пока нет организаций'"),
    ("'Акции специалиста' : 'Акция специалиста'", "'Акции организации' : 'Акция организации'"),
    ('Акцию объявляет и выполняет сам специалист.', 'Акцию объявляет и выполняет сама организация.'),
    ('договаривайся напрямую со специалистом.</p></div>', 'договаривайся напрямую с организацией.</p></div>'),
    ('<span class="qm-sample">Образец карточки · специалист вымышленный</span>', '<span class="qm-sample">Образец карточки · организация вымышленная</span>'),
    ('Объявления размещает сам специалист и отвечает за их содержание.', 'Объявления размещает сама организация и отвечает за их содержание.'),
    ('Справочник проверяет только официальную регистрацию. Дипломы и сертификаты указывает сам специалист. Договорённости — напрямую со специалистом.',
     'Мы проверяем регистрацию организации: запись в торговом реестре (Zefix) или устав. Всё остальное в карточке указывает сама организация. Договорённости — напрямую с организацией.'),
    ("'ОБРАЗЕЦ — специалист вымышленный'", "'ОБРАЗЕЦ — организация вымышленная'"),
    ('Цены указал сам специалист', 'Цены указала сама организация'),
    ('Справочник русско- и украиноязычных специалистов', 'Организации для украинцев и русскоязычных'),
    ('<b>Вы специалист? Разместите свою анкету — сейчас бесплатно</b>\n      <span class="u">https://svoiludi.ch/join/</span>',
     '<b>Ваша организация работает для своих? Разместите её — сейчас бесплатно</b>\n      <span class="u">https://svoiludi.ch/organizacii/#add</span>'),
    ('Справочник проверяет только официальную регистрацию. Договорённости — напрямую со специалистом.', 'Мы проверяем регистрацию организации. Договорённости — напрямую с организацией.'),
    # подписи блоков карточки, PDF и визитки
    ('<h4>Профиль</h4>', '<h4>Что делает организация</h4>'),
    ('<h4>Услуги</h4>', '<h4>Что можно получить</h4>'),
    ('<h4>Формат</h4>', '<h4>Как прийти или записаться</h4>'),
    ('<h4>Где принимает</h4>', '<h4>Где</h4>'),
    ('<h4>Особенности</h4>', '<h4>Для кого и как</h4>'),
    ('<h4>Встречи, курсы и вебинары</h4>', '<h4>События и курсы</h4>'),
    # ссылки и адреса: страница лежит в /organizacii/
    ("const previewUrl = s => `${SITE}#preview=", "const previewUrl = s => `${SITE}organizacii/#preview="),
    ("const priceUrl = s => `${SITE}#price=", "const priceUrl = s => `${SITE}organizacii/#price="),
    ("'kursy/#' : 'events/#'", "'../kursy/#' : '../events/#'"),
    ('href="vakansii/#', 'href="../vakansii/#'),
    ('href="akcii/', 'href="../akcii/'),
    ("'assets/lib/", "'/assets/lib/"),
    # объявления и события организации: автор и организатор — { org: id }
    ("v.author === s.id &&", "v.author && typeof v.author === 'object' && v.author.org === s.id &&"),
    ("(e.organizers || []).includes(s.id)", "(e.organizers || []).some(x => x && typeof x === 'object' && x.org === s.id)"),
    # блоки организации в окне карточки: пометка «бесплатно», форма, взнос, руководитель, «Важно»
    # пометка «… · размещение бесплатно» с сердечком — во всю ширину окна под шапкой (на телефоне колонка шапки узкая)
    ("""    ${promoStrip(s)}\n    <div class="d-body">""", """    ${SVL_ORG.head(s)}${promoStrip(s)}\n    <div class="d-body">"""),
    ("""<div class="d-block"><h4>Контакты</h4><ul class="ctl">${contacts}</ul></div>""",
     """<div class="d-block"><h4>Контакты</h4><ul class="ctl">${contacts}</ul></div>${SVL_ORG.side(s)}"""),
    ("""${s.firm ? `<div class="firm">${esc(s.firm)}</div>` : ''}${catsLine(s)}""", """${s.firm ? `<div class="firm">${esc(s.firm)}</div>` : ''}${SVL_ORG.line(s)}${catsLine(s)}"""),
    ("${whereBlock(s)}", "${whereBlock(s)}${SVL_ORG.main(s)}"),
    # форма организации — в строке под названием, с кружком «?»; отдельного блока «Форма» в окне нет (12.10.2026, 20:04: без повторов)
    ('font-size:1.25rem;color:var(--brown)">${esc(s.role)}</div>', 'font-size:1.25rem;color:var(--brown)">${esc(s.role)}${SVL_ORG.roleHelp(s)}</div>'),
    # подтверждение организации: в письмах — «карточку организации»
    ('Я подготовила вашу карточку для справочника «Свои люди в Швейцарии». Пока её видите только вы. Посмотрите, пожалуйста, всё ли верно: фото, профиль, услуги, адреса и контакты.',
     'Я подготовила карточку вашей организации для раздела «Организации» в «Своих людях в Швейцарии». Пока её видите только вы. Посмотрите, пожалуйста, всё ли верно: описание, что можно получить, взносы, адреса и контакты.'),
    ('Всё верно, подтверждаю публикацию своей карточки на сайте «Свои люди в Швейцарии».', 'Всё верно, подтверждаю публикацию карточки нашей организации на сайте «Свои люди в Швейцарии».'),
    ('. Я даю согласие на публикацию карточки и фото на сайте svoiludi.ch.</span>', '. От имени организации я даю согласие на публикацию карточки на сайте svoiludi.ch.</span>'),
    ("&kind=${kind}&id=", "&kind=${kind}&type=org&id="),
]
for a, b in REPL:
    need(rest, a, 0); rest = rest.replace(a, b)
# режим Ирины (письма и подсказки только для неё) и подвал PDF-списка: те же слова без проверки, если их нет
SOFT = [('Дипломы и сертификаты указывает сам специалист. Договорённости — напрямую со специалистом.', 'Всё остальное в карточках указывают сами организации. Договорённости — напрямую с организацией.'),
        ('Справочник проверяет только официальную регистрацию. Всё остальное в карточках', 'Мы проверяем регистрацию организаций: запись в торговом реестре (Zefix) или устав. Всё остальное в карточках'),
        ('Вставь его специалисту', 'Вставь его организации'), ('У специалиста нет e-mail в карточке', 'У организации нет e-mail в карточке'),
        ('Когда специалист подтвердит', 'Когда организация подтвердит'), ('Специалист ставит галочку', 'Организация ставит галочку'),
        ('— специалист вписывает цены', '— организация вписывает цены'), ('Сообщение уйдёт специалисту', 'Сообщение уйдёт организации'),
        ('письмо специалисту со ссылкой', 'письмо организации со ссылкой'),
        ('исправить карточку за специалиста', 'исправить карточку за организацию'), ('в черновик письма специалисту', 'в черновик письма организации')]
for a, b in SOFT: rest = rest.replace(a, b)

# контакты: Facebook — с 12.10.2026 есть в главной (LINK.facebook и списки контактов), здесь больше ничего не добавляем
left = [m for m in re.findall(r'[^\n]{0,50}[Сс]пециалист[^\n]{0,30}', rest) if not re.match(r'\s*(//|/\*|\*)', m)]
# форма заявки организации (своя, в отдельной области видимости), помощь «?», плашка поиска по номеру карточки
forma = open(os.path.join(HERE, 'forma.js'), encoding='utf-8').read()
a = '<script src="/assets/share.js" defer></script>'; need(rest, a)
rest = rest.replace(a, f'<script>\n{forma}</script>\n<script src="/assets/help.js" defer></script>\n<script defer src="/assets/plz.js"></script>\n<script defer src="/assets/zayavka.js"></script>\n' + a)

# ---------- пути в HTML (страница на уровень глубже) ----------
top = top.replace('href="./"', 'href="../"')
page = head + top + main + rest
page = re.sub(r'(href|src)="(fav|assets|img|data)/', r'\1="/\2/', page)
page = re.sub(r'href="(o-proekte|join|events|akcii|kursy|vakansii|opros|usloviya|novosti|instrumenty|shveycariya|dlya-specialistov|badge|prilozhenie|situacii|privacy|ceny)/', r'href="../\1/', page)
os.makedirs('organizacii', exist_ok=True)
open('organizacii/index.html', 'w', encoding='utf-8').write(page)
print('ok: organizacii/index.html', len(page))
if left: print('осталось «специалист» в коде движка (проверить):', *left[:40], sep='\n  ')
