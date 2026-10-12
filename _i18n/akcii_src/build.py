"""Страница «Акции» (11.10.2026, копия): собирает akcii/index.html из events/index.html.
Решение Ирины (11.10.2026, 18:48): «где на сайте будут акции? где в меню или фильтрах?» — акции получили свою вкладку рядом
с «События» и «Курсы». Код (список, окна, фильтры) общий: страница включает режим акций атрибутом <html data-mode="akcii">
(в events/index.html переменная AK). Здесь меняются только шапка страницы, первый экран, подписи фильтров, блок «Проводишь акции?»
и форма заявки на акцию (forma.html — единственное место, где она лежит; на «События» её нет).
Порядок после правки events/index.html или forma.html (идемпотентно):
  python3 _i18n/akcii_src/build.py && python3 _i18n/struktura_src/build.py && python3 _i18n/struktura_src/nav.py
  python3 _i18n/pwa.py && python3 _i18n/sync.py check   (потом перевод, sync.py apply/build) && python3 _i18n/build_search.py && node _i18n/og.js akcii
Правила — документ проекта «akcii-specialistov.md»."""
import os, re
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(HERE))
os.chdir(ROOT)
h = open('events/index.html', encoding='utf-8').read()
h = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', h, flags=re.S)           # переключатель языка и переход ставит pages.py

def rep(old, new, cnt=1):
    global h
    assert h.count(old) == cnt, (h.count(old), old[:90])
    h = h.replace(old, new)
def sub(pat, new, flags=re.S):
    global h
    h, n = re.subn(pat, lambda m: new, h, count=1, flags=flags)
    assert n == 1, pat[:90]

T = 'Акции специалистов — Свои люди в Швейцарии: скидки и подарки по кантонам'
D = 'Скидки, акционные цены, подарки и бесплатные знакомства от специалистов и организаций из справочника «Свои люди» — по кантонам Швейцарии, на русском и украинском.'
OGT = 'Акции — Свои люди в Швейцарии'
OGD = 'Скидки и подарки от специалистов и организаций на русском и украинском по кантонам Швейцарии. Акция видна прямо в карточке специалиста.'
rep('<html lang="ru">', '<html lang="ru" data-mode="akcii">')
sub(r'<title>[^<]*</title>', f'<title>{T}</title>')
rep('<link rel="canonical" href="https://svoiludi.ch/events/">', '<link rel="canonical" href="https://svoiludi.ch/akcii/">')
sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{D}">')
sub(r'<meta property="og:title" content="[^"]*">', f'<meta property="og:title" content="{OGT}">')
sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{OGD}">')
rep('<meta property="og:url" content="https://svoiludi.ch/events/"><meta property="og:image" content="https://svoiludi.ch/events/og-image.jpg">',
    '<meta property="og:url" content="https://svoiludi.ch/akcii/"><meta property="og:image" content="https://svoiludi.ch/akcii/og-image.jpg">')

# меню сверху: страница акций внутри «События и курсы» (nav.py выделит пункт сам)
# первый экран
ART = ('<svg viewBox="0 0 360 330" role="img" aria-hidden="true" focusable="false"><circle cx="180" cy="165" r="150" fill="#E3E8D6" fill-opacity=".55"/>'
       '<circle cx="262" cy="70" r="34" fill="#F3E3C2" fill-opacity=".7"/><circle cx="92" cy="268" r="22" fill="#F3E3C2" fill-opacity=".6"/>'
       '<circle cx="180" cy="165" r="118" fill="none" stroke="#B98324" stroke-width="2" stroke-dasharray="1 9" stroke-linecap="round"/>'
       '<g transform="rotate(-10 180 165)"><path d="M112 112h98a14 14 0 0 1 10 4l46 49-46 49a14 14 0 0 1-10 4h-98a16 16 0 0 1-16-16v-74a16 16 0 0 1 16-16z" fill="#FFFCF8" stroke="#B8472E" stroke-width="3.2" stroke-linejoin="round"/>'
       '<circle cx="236" cy="165" r="7" fill="#F3E3C2" stroke="#B8472E" stroke-width="2.6"/>'
       '<circle cx="136" cy="146" r="10" fill="none" stroke="#B8472E" stroke-width="4"/><circle cx="178" cy="184" r="10" fill="none" stroke="#B8472E" stroke-width="4"/>'
       '<path d="M184 138L130 192" stroke="#4F5E3E" stroke-width="4.4" stroke-linecap="round"/></g>'
       '<circle cx="86" cy="96" r="21" fill="#FFFCF8" stroke="#4F5E3E" stroke-width="2.6"/><circle cx="86" cy="90.5" r="5.6" fill="#4F5E3E"/><path d="M76 108c0-6.5 4.500-10.500 10-10.500s10 4 10 10.500" fill="#4F5E3E" fill-opacity=".85"/>'
       '<circle cx="288" cy="244" r="21" fill="#FFFCF8" stroke="#B98324" stroke-width="2.6"/><circle cx="288" cy="238.500" r="5.6" fill="#B98324"/><path d="M278 256c0-6.500 4.500-10.500 10-10.500s10 4 10 10.500" fill="#B98324" fill-opacity=".85"/></svg>')
HERO = ('<section class="s-hero has-art" aria-labelledby="h1">\n    <div class="hero-txt">\n'
        '      <div class="eyebrow">Акции · Свои люди в Швейцарии</div>\n'
        '      <h1 id="h1">Скидки и подарки <em>от своих</em></h1>\n'
        '      <p class="lead">Скидки, акционные цены, подарки и бесплатные знакомства от специалистов и организаций из справочника. Выбери кантон и посмотри, что действует сейчас. Акцию объявляет и выполняет сам специалист: записывайся и договаривайся с ним напрямую. Все акции на этой странице — реклама, она помечена на каждой карточке.</p>\n'
        '      <p style="margin:6px 0 0"><a class="btn" href="#akciya">Разместить акцию</a></p>\n'
        '    </div>\n'
        f'    <div class="hero-art" aria-hidden="true">{ART}</div>\n  </section>')
sub(r'<section class="s-hero has-art" aria-labelledby="h1">.*?</section>', HERO)
# фильтры
rep('<label for="type"><i>3</i>Что ищешь</label>', '<label for="type"><i>3</i>Какая акция</label>')
rep('<label for="when"><i>5</i>Когда</label>', '<label for="when"><i>5</i>Срок</label>')
sub(r'<option value="">Все ближайшие</option><option value="week">На этой неделе</option><option value="month">В этом месяце</option><option value="next">В следующем месяце</option>',
    '<option value="">Все действующие</option><option value="always">Постоянные акции</option><option value="week">Заканчиваются на этой неделе</option><option value="month">Заканчиваются в этом месяце</option>')
rep('aria-label="Подбор событий"', 'aria-label="Подбор акций"')
# игровые сердечки (решение Ирины 11.10.2026, 19:16): «Мне повезёт» и «Мои сердечки»; сердечки хранятся только в браузере человека
PLAY = ('<div class="ak-play" role="group" aria-label="Сердечки"><button type="button" class="btn ghost" id="luck"><span aria-hidden="true">♡</span> Мне повезёт</button>'
        '<button type="button" class="btn ghost" id="myhearts" aria-pressed="false"><span aria-hidden="true">♥</span> Мои сердечки <b id="hn">0</b></button>'
        '<button type="button" class="lnk" id="hclear" hidden>Очистить сердечки</button></div>\n'
        '  <p class="ak-note">«Мне повезёт» достанет для тебя случайную акцию из тех, что ты сейчас видишь. Сердечко на карточке сохраняет акцию в «Мои сердечки»: список хранится только на этом устройстве.</p>\n  ')
rep('<div class="count"><span id="count"', PLAY + '<div class="count"><span id="count"')
# assets/flyer.js с 12.10.2026 подключён прямо в events/index.html (карточка события PNG), второй раз не добавляем
assert h.count('/assets/flyer.js') == 1
# «Проводишь акции?» вместо «Проводишь встречи?» и форма заявки на акцию вместо формы события
ADD = ('''  <section class="join" id="add" aria-labelledby="add-h">
    <div><h2 id="add-h">Проводишь акции?</h2><p style="max-width:62ch">Размести свою акцию здесь. Это бесплатно в период запуска, до конца 2027 года. Она будет видна на этой странице и сразу в твоей карточке: в справочнике специалистов или в разделе «Организации». Заполни <a href="#akciya">заявку прямо здесь, на сайте</a>, или напиши нам на <a href="mailto:voznesenskaya.iryna@gmail.com">voznesenskaya.iryna@gmail.com</a>. Мы проверим и опубликуем акцию, а ты получишь ссылку на неё.</p></div>
    <div class="join-cols">
      <div class="jc"><b>Кто может</b><p>Специалисты и организации, у которых уже есть карточка на сайте и UID: фирма, самозанятый(ая) с UID или ферайн. Магазин, ресторан, студия и другие фирмы своих размещаются в разделе <a href="../organizacii/">«Организации»</a>, карточка специалиста им не нужна. Организации, которые ничего не берут с людей, акций не размещают: у них всё и так бесплатно.</p></div>
      <div class="jc"><b>Что можно предложить</b><p>Скидку в процентах или в франках, акционную цену, подарок или бонус к услуге или товару, бесплатное знакомство или пробное занятие. Только своё, в своей компетенции, правдиво и по закону. У скидки на одну услугу укажи обычную цену: на сайте покажем цену, которую человек заплатит. Розыгрыши и конкурсы мы не размещаем, как и акции на спиртные напитки, табак и вейпы, лекарства, оружие и кредиты. Врачи, психотерапевты, психологи и другие профессии здоровья акций не размещают: закон разрешает им только сдержанную рекламу. До 31.12.2027 размещение акций бесплатно.</p></div>
      <div class="jc"><b>Как прислать</b><p>Найди в заявке свою карточку по номеру (SG-0001 у специалистов, OR-0001 у организаций, он стоит внизу карточки) или по UID: имя, адрес и контакты подставятся сами. Выбери вид акции, впиши размер скидки или цену и даты. Мы пришлём ссылку на проверку, ты подтвердишь акцию одной кнопкой. Акция действует не дольше 90 дней.</p><span class="addbtns"><a class="btn" href="#akciya">Заполнить заявку на акцию</a><a class="btn ghost" id="addbtn" href="mailto:voznesenskaya.iryna@gmail.com">Написать письмо</a></span></div>
    </div>
  </section>

''')
FORMA = open(os.path.join(HERE, 'forma.html'), encoding='utf-8').read()
sub(r'  <section class="join" id="add" aria-labelledby="add-h">.*?</section>\n\n  <section class="zform" id="zayavka".*?</section>\n\n', ADD + FORMA)
# подпись внизу, «Поделиться», подвал
sub(r'<p class="fine">.*?</p>', '<p class="fine">Страница носит информационный характер. Акцию объявляет и выполняет сам специалист или организация: за её условия, цены и разрешения отвечает он. Записывайся и договаривайся напрямую. Размещение акции — реклама.</p>')
sub(r'<div class="share-slot" data-url="https://svoiludi.ch/events/"[^>]*></div>',
    '<div class="share-slot" data-url="https://svoiludi.ch/akcii/" data-lead="Позови с собой друзей. Перешли страницу с акциями, сообщение уже готово." data-text="Привет! Тут собраны скидки и подарки от специалистов и организаций на русском и украинском по всей Швейцарии. Может, что-то пригодится тебе?"></div>')
rep('<a href="../akcii/">Акции</a> · <a href="../kursy/">Курсы</a> · <a href="../join/">Разместиться</a>', '<a href="../events/">События</a> · <a href="../kursy/">Курсы</a> · <a href="../join/">Разместиться</a>')
# переключатель «События | Акции | Курсы» вставляет struktura_src/build.py (evk), метки оставляем пустыми
os.makedirs('akcii', exist_ok=True)
open('akcii/index.html', 'w', encoding='utf-8').write(h)
print('ok: akcii/index.html', len(h))
