# ===== «На природе»: рыбалка, грибы, ягоды и травы, охота — отдельные темы (17.10.2026, просьба Ирины:
# «у нас есть на сайте статьи про правила рыбалки в швейцарии, правила охоты, сбора грибов и ягод и т д… можно отдельными статьями сделать»).
# Прежняя общая тема rybalka-griby-ohota остаётся по тому же адресу и становится короткой страницей «На природе» со ссылками на четыре темы.
# Отдельный файл, чтобы не мешать параллельной работе над articles.py; подключается в конце articles.py.
# Факты сверены 17.10.2026 (пять параллельных проверок по официальным источникам; федеральные законы — fedlex, тексты сверены по копиям SR
# на droit-bilingue.ch и lexfind.ch, кантональные — по сайтам и сборникам законов кантонов). Подробно — документ проекта «priroda-statyi.md».

UPD = '17.10.2026'


def add(ARTICLES):
    ARTICLES['rybalka-griby-ohota'] = NA_PRIRODE   # прежняя общая тема: тот же адрес, теперь короткая страница со ссылками
    ARTICLES['yagody-travy'] = YAGODY


NA_PRIRODE = dict(
    upd=UPD,
    updw='рыбалка, грибы, ягоды и охота теперь — отдельные подробные темы, здесь коротко о главном',
    h1='На природе в Швейцарии: <em>что можно в лесу, на озере и в горах</em>',
    seo='Природа в Швейцарии: рыбалка, грибы, ягоды, охота, костёр и собака в лесу — что можно и где нужно разрешение',
    desc='Что можно на природе в Швейцарии простыми словами на русском: лес открыт для всех, ягоды и грибы для себя — без разрешения, рыбалка и охота — с разрешением кантона, костёр и гриль при опасности лесных пожаров, собака на поводке весной (с 1 апреля по 31 июля или по 15 июля), зоны покоя дичи и национальный парк, штраф за мусор с 1 августа 2026 года и экстренные номера. Подробные темы: рыбалка, грибы, ягоды и травы, охота. По-немецки Waldbrandgefahr, Feuerverbot, Leinenpflicht, Wildruhezone, по-французски danger d’incendie, obligation de tenir les chiens en laisse, zone de tranquillité, по-итальянски pericolo d’incendi, obbligo del guinzaglio, zona di tranquillità.',
    lead='Лес, озёра и горы в Швейцарии открыты для всех. Ягоды и грибы для себя можно собирать без бумаг, а рыбачить и охотиться — только с разрешением кантона. Здесь коротко о главном и о правилах, которые касаются каждого, кто идёт в лес: костёр, собака, зоны покоя и мусор.',
    body='''
<nav class="toc" aria-label="Содержание"><b>В этой статье</b>
<ul>
  <li><a href="#temy">Рыбалка, грибы, ягоды и охота</a></li>
  <li><a href="#les">Лес и пастбища открыты для всех</a></li>
  <li><a href="#koster">Костёр и гриль: опасность лесных пожаров</a></li>
  <li><a href="#sobaka">Собака на поводке весной</a></li>
  <li><a href="#zony">Зоны покоя дичи, заповедники и национальный парк</a></li>
  <li><a href="#musor">Мусор и ночёвка в палатке</a></li>
  <li><a href="#nomera">Если что-то случилось</a></li>
</ul></nav>

<h2 id="temy">Рыбалка, грибы, ягоды и охота</h2>
<p>У каждой темы есть своя подробная статья: что можно без разрешения, где его получить, правила твоего кантона и что будет за нарушение.</p>
<div class="pm-g">
  <a class="pm-c" href="../rybalka/"><b>Рыбалка: патент и SaNa</b><span>Почти везде нужен патент кантона, а для годового патента — сертификат SaNa. На некоторых больших озёрах с берега можно ловить без патента.</span><em>Читать →</em></a>
  <a class="pm-c" href="../griby/"><b>Грибы: лимиты и грибной контроль</b><span>Сколько можно собрать, в какие дни нельзя и где бесплатно проверить корзину. В каждом кантоне свои правила.</span><em>Читать →</em></a>
  <a class="pm-c" href="../yagody-travy/"><b>Ягоды, травы и цветы</b><span>Что можно собирать для себя, черемша и её ядовитые двойники, охраняемые растения и эдельвейс.</span><em>Читать →</em></a>
  <a class="pm-c" href="../ohota/"><b>Охота и дикие животные</b><span>Как стать охотником, патент или угодья, оружие, а ещё — что делать, если сбил косулю или нашёл раненое животное.</span><em>Читать →</em></a>
</div>

<h2 id="les">Лес и пастбища открыты для всех</h2>
<ul class="ul">
  <li>В Швейцарии любой человек может ходить по лесу и пастбищам и собирать дикие ягоды и грибы в обычном для этой местности количестве, даже если земля частная. Так написано в Гражданском кодексе (<a href="https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699">ZGB, ст. 699</a>). Власти могут закрыть для сбора отдельные места, например молодой лес.</li>
  <li class="attn"><i class="wi"></i>Рыба и дикие животные в это свободное право не входят. Ловить рыбу и охотиться можно только по разрешению кантона — подробно в темах «<a href="../rybalka/">Рыбалка</a>» и «<a href="../ohota/">Охота</a>».</li>
  <li>Сколько грибов и ягод можно взять и в какие дни, решают кантоны и общины, поэтому правила в разных местах разные. Если едешь в соседний кантон, проверь и его правила.</li>
</ul>

<h2 id="koster">Костёр и гриль: опасность лесных пожаров</h2>
<ul class="ul">
  <li>Летом в засуху кантоны объявляют уровень опасности лесных пожаров (Waldbrandgefahr, danger d’incendie de forêt, pericolo d’incendi boschivi). Карта на сегодня для всей Швейцарии — на портале Федерального ведомства окружающей среды <a href="https://www.waldbrandgefahr.ch/">waldbrandgefahr.ch</a>. Запрет огня в лесу объявляет кантон, а общины могут добавить свои правила (<a href="https://www.gr.ch/DE/institutionen/verwaltung/diem/awn/htm/waldbrandgefahr.htm">кантон Граубюнден</a>, <a href="https://www.zh.ch/de/umwelt-tiere/wald/waldbrandgefahr.html">кантон Цюрих</a>). Например, летом 2018 года 18 кантонов запретили разводить огонь в лесу и рядом с ним (<a href="https://www.admin.ch/de/nsb?id=71708">Федеральный совет, 30.07.2018</a>).</li>
  <li>У опасности пять уровней. При низкой не бросай окурки и спички. При умеренной следи за огнём и сразу туши искры. При значительной жарь только в готовых кострищах и слушай местные власти (<a href="https://www.gr.ch/DE/institutionen/verwaltung/diem/awn/htm/waldbrandgefahr.htm">кантон Граубюнден</a>).</li>
  <li class="attn"><i class="wi"></i>При большой опасности костры под открытым небом, как правило, запрещены, а при очень большой и при полном запрете (absolutes Feuerverbot) запрещён любой огонь вне домов, даже в кострищах (<a href="https://www.gr.ch/DE/institutionen/verwaltung/diem/awn/htm/waldbrandgefahr.htm">кантон Граубюнден</a>). Например, в Цуге в августе 2026 года при высшем уровне были запрещены все кострища, угольные и одноразовые грили и фейерверки; можно было только газовый или электрический гриль на твёрдом покрытии (<a href="https://zg.ch/de/news/2026/August/hoechste-waldbrandgefahr-absolutes-feuerverbot-im-freien">кантон Цуг</a>).</li>
  <li>Перед пикником с грилем летом посмотри уровень опасности на карте и на сайте своего кантона.</li>
</ul>

<h2 id="sobaka">Собака на поводке весной</h2>
<ul class="ul">
  <li>Весной и в начале лета у диких животных и птиц появляются детёныши (Brut- und Setzzeit). В это время во многих кантонах собаку в лесу нужно вести на поводке (Leinenpflicht, obligation de tenir les chiens en laisse, obbligo del guinzaglio).</li>
  <li><b>С 1 апреля по 31 июля</b> — в кантонах Цюрих, Люцерн, Ури, Цуг, Аргау, Золотурн, оба Базеля и Тургау, обычно в лесу и у опушки (в Цюрихе и Люцерне — до 50 м от леса) (<a href="https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2022/11/neues-jagdgesetz-beim-schutz-der-wildtiere-ist-auch-die-bevoelkerung-gefragt.html">Цюрих</a>, <a href="https://opendata.swiss/en/dataset/hundeleinenpflicht-im-wald">Люцерн</a>, <a href="https://www.ur.ch/_doc/374215">Ури</a>, <a href="https://zg.ch/news/news~_2025_3_hundeleinenpflicht-im-wald-und-am-waldrand-von-april-bis-juli~.html">Цуг</a>, <a href="https://www.ag.ch/de/verwaltung/bvu/wald/erholungsraum-wald/leinenpflicht">Аргау</a>, <a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/wildtiere/mit-hund-im-wald-leinenpflicht/">Золотурн</a>, <a href="https://www.bs.ch/medienmitteilungen/wsu/2026-ab-1-april-wieder-leinenpflicht-zum-schutz-der-wildtiere">Базель</a>, <a href="https://frauenfeld.ch/public/upload/assets/44181/Merkblatt%20Leinenpflicht%202024.pdf?fp=1">Тургау</a>).</li>
  <li><b>С 1 апреля по 15 июля</b> — во Фрибуре, Женеве и Во (<a href="https://www.fr.ch/diaf/sfn/actualites/obligation-de-tenir-les-chiens-en-laisse-en-foret-1">Фрибур</a>, <a href="https://www.ge.ch/cohabiter-avec-faune-sauvage/se-promener-avec-chien-dans-nature">Женева</a>, <a href="https://vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Bonnes_pratiques/01_Chiens_en_laisse_ou_quand_et_pourquoi/Flyer_chien_en_laisse_DEF.PDF">Во</a>). В Во поводок нужен ещё и на лугах у леса, а в заповедниках для дичи — весь год.</li>
  <li>В остальных кантонах сроки и места свои, а в зонах покоя дичи поводок часто нужен и зимой. Смотри таблички у входа в лес и правила кантона и общины.</li>
  <li class="attn"><i class="wi"></i>За собаку без поводка в это время штрафуют, даже если она никого не тронула: например, в Цюрихе — 60 франков на месте (<a href="https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2022/11/neues-jagdgesetz-beim-schutz-der-wildtiere-ist-auch-die-bevoelkerung-gefragt.html">кантон Цюрих</a>). <i class="wi"></i>Если собака поранит или загрызёт дикое животное, за ущерб отвечает её владелец (<a href="https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_56">OR, ст. 56</a>). О таком случае нужно сразу сообщить егерю или в полицию по номеру 117 (<a href="https://www.tierimrecht.org/documents/10009/Zeitlupe-2025-04-10-Leinenpflicht-waehrend-der-Setz-und-Brutzeit.pdf">Tier im Recht, 10.04.2025</a>). Подробно о собаках — в теме «<a href="../zhivotnye/">Животные</a>».</li>
</ul>

<h2 id="zony">Зоны покоя дичи, заповедники и национальный парк</h2>
<ul class="ul">
  <li class="attn"><b>Зоны покоя дичи</b> (Wildruhezone, zone de tranquillité, zona di tranquillità) — места в горах, где зимой и весной животных нельзя тревожить, обычно с 15 декабря по 30 апреля. Там ходят только по отмеченным тропам и маршрутам, а собаку ведут на поводке. <i class="wi"></i>Правила написаны на табличках, за нарушение штрафуют (<a href="https://www.bafu.admin.ch/dam/bafu/de/dokumente/biodiversitaet/uv-umwelt-vollzug/wildruhezonen_markierungshandbuch.pdf.download.pdf/wildruhezonen_markierungshandbuch.pdf">BAFU</a>). Все зоны покоя на одной карте — слой «Wildruhezonen» на <a href="https://map.geo.admin.ch/?lang=de&amp;layers=ch.bafu.wrz-wildruhezonen_portal">map.geo.admin.ch</a>, а подробнее — на портале <a href="https://www.wildruhezonen.ch/">wildruhezonen.ch</a>. Посмотри карту перед зимним походом на снегоступах или лыжах вне трасс.</li>
  <li><b>Заповедники</b> (Naturschutzgebiet, réserve naturelle, riserva naturale). У каждого свои правила, они написаны на табличках у входа. Часто там нельзя сходить с тропы, рвать растения и отпускать собаку.</li>
  <li class="attn"><b>Швейцарский национальный парк</b> в Граубюндене охраняется строже всего. Ходить можно только по размеченным тропам и только днём, нельзя брать собаку (даже на поводке), разводить огонь, ночевать, рвать цветы, собирать ягоды и грибы и уносить камни (<a href="https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file">правила национального парка</a>, <a href="https://nationalpark.ch/wp-content/uploads/2024/04/2024_SNP_Basisprospekt_Deutsch_k.pdf">буклет парка</a>). <i class="wi"></i>Смотрители штрафуют на месте: за то, что сошёл с тропы, — 250 франков, за огонь — 300, за ночёвку — 200, за собаку — 200, за сорванные цветы или ягоды — 150, за мусор — 100 франков (<a href="https://gr.lexwork.naz.ch/de/dta/498.210.pdf">список штрафов национального парка</a>).</li>
</ul>

<h2 id="musor">Мусор и ночёвка в палатке</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i><b>Мусор.</b> С 1 августа 2026 года штраф за брошенный мусор одинаковый по всей Швейцарии: за окурок или одну мелочь — 80 франков, за несколько мелочей — 100, за пакет до 35 литров — 150, за большой мешок — 250 франков. Детям до 15 лет штраф не выписывают (<a href="https://www.bafu.admin.ch/dam/de/sd-web/VaJjizZsf40B/Faktenblatt%20Abfall%20-%20Schweizweit%20einheitliche%20Littering-Busse.pdf">BAFU, памятка об едином штрафе</a>). Забирай мусор с пикника с собой. Подробно — в теме «<a href="../musor/">Мусор и сортировка</a>».</li>
  <li><b>Палатка.</b> Единого федерального правила нет, решают кантоны и общины. Например, в Цюрихе в лесу на одну ночь палатку поставить можно, а дольше — только с согласия владельца участка (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/wald/merkblaetter/merkblatt_2_besucher_im_wald_2017.pdf">кантон Цюрих</a>). В Во вне кемпингов — только с согласия владельца земли (<a href="https://vd.ch/fileadmin/user_upload/organisation/gc/fichiers_pdf/2022-2027/24_INT_58_TexteCE.pdf">кантон Во</a>). <i class="wi"></i>В заповедниках, национальном парке и зонах покоя дичи ночевать почти везде запрещено (<a href="https://www.ur.ch/_doc/433504">кантон Ури</a>). Подробнее — в теме «<a href="../priroda/">Горы, хайкинг и безопасность</a>».</li>
</ul>

<h2 id="nomera">Если что-то случилось</h2>
<ul class="ul">
  <li>Скорая помощь — <b>144</b>, полиция — <b>117</b>, пожарные — <b>118</b>, общий европейский номер — <b>112</b>. Вертолёт Rega в горах — <b>1414</b>, из-за границы +41 333 333 333 (<a href="https://www.ag.ch/de/themen/sicherheit/bevoelkerungsschutz/verhaltensempfehlungen">кантон Аргау</a>, <a href="https://www.rega.ch/">Rega</a>).</li>
  <li>Отравление грибами, ягодами или растениями — токсикологический центр Tox Info Suisse, <b>145</b>, круглосуточно и бесплатно, из-за границы +41 44 251 51 51 (<a href="https://www.toxinfo.ch/">Tox Info Suisse</a>).</li>
  <li>Если видишь дым или огонь в лесу, сразу звони пожарным по номеру 118.</li>
</ul>
''',
    steps=[
        'Перед прогулкой летом посмотри на waldbrandgefahr.ch, можно ли сегодня жарить, и разводи огонь только в готовых кострищах.',
        'С апреля по июль веди собаку в лесу на поводке, а в зонах покоя и заповедниках — всегда, когда это написано на табличке.',
        'Мусор с пикника забирай с собой: за брошенный окурок штраф 80 франков.',
        'Если идёшь на рыбалку, за грибами, ягодами или на охоту, прочитай подробную тему и правила своего кантона.',
        'Сохрани в телефоне номера 144, 1414, 117, 118 и 145.',
    ],
    tools={'ekstrennye-nomera': 'Tox Info 145, скорая помощь 144, Rega 1414 и дежурный врач твоего кантона — на одной карточке в рюкзак.',
           'plan-pohoda': 'Идёшь в лес, на озеро или в горы — оставь близким маршрут и время возвращения на русском и языке кантона.'},
    tabs={'events': 'Прогулки, походы за грибами и выезды на природу с группой на русском и украинском — во встречах рядом с тобой.'},
    related=['rybalka', 'griby', 'yagody-travy', 'ohota', 'priroda', 'zhivotnye'],
    sources=[
        ('Гражданский кодекс (ZGB), ст. 699 — доступ в лес и на пастбища', 'https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699'),
        ('Кодекс обязательственного права (OR), ст. 56 — ответственность владельца животного', 'https://www.fedlex.admin.ch/eli/cc/27/317_321_377/de#art_56'),
        ('BAFU — карта опасности лесных пожаров', 'https://www.waldbrandgefahr.ch/'),
        ('Кантон Граубюнден — опасность лесных пожаров и запрет огня', 'https://www.gr.ch/DE/institutionen/verwaltung/diem/awn/htm/waldbrandgefahr.htm'),
        ('Кантон Цюрих — опасность лесных пожаров', 'https://www.zh.ch/de/umwelt-tiere/wald/waldbrandgefahr.html'),
        ('Кантон Цуг — высшая опасность лесных пожаров, 11.08.2026', 'https://zg.ch/de/news/2026/August/hoechste-waldbrandgefahr-absolutes-feuerverbot-im-freien'),
        ('Федеральный совет — запреты огня в 18 кантонах, 30.07.2018', 'https://www.admin.ch/de/nsb?id=71708'),
        ('Кантон Цюрих — поводок для собак весной, 03.11.2022', 'https://www.zh.ch/de/news-uebersicht/medienmitteilungen/2022/11/neues-jagdgesetz-beim-schutz-der-wildtiere-ist-auch-die-bevoelkerung-gefragt.html'),
        ('Кантон Люцерн — поводок в лесу (открытые данные)', 'https://opendata.swiss/en/dataset/hundeleinenpflicht-im-wald'),
        ('Кантон Ури — поводок весной, 25.03.2024', 'https://www.ur.ch/_doc/374215'),
        ('Кантон Цуг — поводок в лесу и у опушки с апреля по июль, 27.03.2025', 'https://zg.ch/news/news~_2025_3_hundeleinenpflicht-im-wald-und-am-waldrand-von-april-bis-juli~.html'),
        ('Кантон Аргау — поводок в лесу', 'https://www.ag.ch/de/verwaltung/bvu/wald/erholungsraum-wald/leinenpflicht'),
        ('Кантон Золотурн — с собакой в лесу', 'https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/wildtiere/mit-hund-im-wald-leinenpflicht/'),
        ('Кантон Базель-Штадт — поводок с 1 апреля, 30.03.2026', 'https://www.bs.ch/medienmitteilungen/wsu/2026-ab-1-april-wieder-leinenpflicht-zum-schutz-der-wildtiere'),
        ('Город Фрауэнфельд — памятка о поводке по закону Тургау, 2024', 'https://frauenfeld.ch/public/upload/assets/44181/Merkblatt%20Leinenpflicht%202024.pdf?fp=1'),
        ('Кантон Фрибур — поводок в лесу, 30.03.2026', 'https://www.fr.ch/diaf/sfn/actualites/obligation-de-tenir-les-chiens-en-laisse-en-foret-1'),
        ('Кантон Женева — прогулка с собакой на природе', 'https://www.ge.ch/cohabiter-avec-faune-sauvage/se-promener-avec-chien-dans-nature'),
        ('Кантон Во — когда собака должна быть на поводке', 'https://vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Bonnes_pratiques/01_Chiens_en_laisse_ou_quand_et_pourquoi/Flyer_chien_en_laisse_DEF.PDF'),
        ('Tier im Recht — поводок весной по кантонам, 10.04.2025', 'https://www.tierimrecht.org/documents/10009/Zeitlupe-2025-04-10-Leinenpflicht-waehrend-der-Setz-und-Brutzeit.pdf'),
        ('BAFU — разметка зон покоя дичи', 'https://www.bafu.admin.ch/dam/bafu/de/dokumente/biodiversitaet/uv-umwelt-vollzug/wildruhezonen_markierungshandbuch.pdf.download.pdf/wildruhezonen_markierungshandbuch.pdf'),
        ('map.geo.admin.ch — карта зон покоя дичи', 'https://map.geo.admin.ch/?lang=de&layers=ch.bafu.wrz-wildruhezonen_portal'),
        ('Правила Швейцарского национального парка (Nationalparkordnung)', 'https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file'),
        ('Список штрафов национального парка (OBVN, 498.210)', 'https://gr.lexwork.naz.ch/de/dta/498.210.pdf'),
        ('Швейцарский национальный парк — буклет для посетителей, 2024', 'https://nationalpark.ch/wp-content/uploads/2024/04/2024_SNP_Basisprospekt_Deutsch_k.pdf'),
        ('BAFU — единый штраф за мусор с 01.08.2026', 'https://www.bafu.admin.ch/dam/de/sd-web/VaJjizZsf40B/Faktenblatt%20Abfall%20-%20Schweizweit%20einheitliche%20Littering-Busse.pdf'),
        ('Кантон Цюрих — памятка «Посетители в лесу»', 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/wald/merkblaetter/merkblatt_2_besucher_im_wald_2017.pdf'),
        ('Кантон Во — ответ правительства о палатках вне кемпингов, 20.11.2024', 'https://vd.ch/fileadmin/user_upload/organisation/gc/fichiers_pdf/2022-2027/24_INT_58_TexteCE.pdf'),
        ('Кантон Ури — ответ правительства о ночёвке на природе, 04.11.2025', 'https://www.ur.ch/_doc/433504'),
        ('Кантон Аргау — экстренные номера', 'https://www.ag.ch/de/themen/sicherheit/bevoelkerungsschutz/verhaltensempfehlungen'),
        ('Tox Info Suisse — 145', 'https://www.toxinfo.ch/'),
    ],
    terms=[('Deutsch', 'Wald und Weide, im ortsüblichen Umfang, Waldbrandgefahr, Feuerverbot, absolutes Feuerverbot, Feuerstelle, Waldrand, Leinenpflicht, Brut- und Setzzeit, Wildruhezone, Wildruhegebiet, eidgenössisches Jagdbanngebiet, Naturschutzgebiet, Schweizerischer Nationalpark, Ordnungsbusse, Littering, Wildcampieren, Biwak, Notruf'),
           ('Français', 'forêts et pâturages, selon l’usage local, danger d’incendie de forêt, interdiction de faire du feu, foyer, lisière, obligation de tenir les chiens en laisse, période de reproduction, zone de tranquillité pour la faune, district franc fédéral, réserve naturelle, Parc national suisse, amende d’ordre, littering, camping sauvage, bivouac, appel d’urgence'),
           ('Italiano', 'boschi e pascoli, secondo l’uso locale, pericolo d’incendi boschivi, divieto di accendere fuochi, focolare, margine del bosco, obbligo del guinzaglio, periodo di riproduzione, zona di tranquillità per la fauna, bandita federale di caccia, riserva naturale, Parco Nazionale Svizzero, multa disciplinare, littering, campeggio libero, bivacco, chiamata d’emergenza'),
           ('English', 'forest access, forest fire danger, fire ban, fire pit, leash requirement, breeding season, wildlife rest area, federal game reserve, nature reserve, Swiss National Park, on-the-spot fine, littering, wild camping, bivouac, emergency call')],
)


YAGODY = dict(
    upd=UPD,
    h1='Ягоды, травы и цветы в Швейцарии: <em>что можно собирать в лесу и в горах</em>',
    seo='Ягоды, черемша и травы в Швейцарии: что можно собирать, охраняемые растения и эдельвейс (Bärlauch, geschützte Pflanzen)',
    desc='Ягоды, травы и цветы в Швейцарии простыми словами на русском: сколько черники и малины можно собрать для себя, где запрещены гребёнки, черемша (Bärlauch) и её ядовитые двойники безвременник и ландыш, ядовитые ягоды и номер Tox Info 145, совет BAG про лисий цепень, какие растения охраняются (орхидеи, лилия кудреватая, эдельвейс), штраф до 20 000 франков, каштаны в Тичино, кристаллы и камни, национальный парк. По-немецки Beeren sammeln, Bärlauch, geschützte Pflanzen, по-французски cueillette, ail des ours, plantes protégées, по-итальянски raccolta di bacche, aglio orsino, piante protette.',
    lead='Малину, чернику, ежевику, черемшу и травы для чая в лесу можно собирать без разрешения — для себя и в обычном количестве. Но некоторые растения рвать нельзя совсем, у черемши есть смертельно ядовитый двойник, а в национальном парке нельзя унести даже камень. Здесь — что можно, сколько и как не ошибиться.',
    body='''
<nav class="toc" aria-label="Содержание"><b>В этой статье</b>
<ul>
  <li><a href="#mozhno">Что можно собирать без разрешения</a></li>
  <li><a href="#yagody">Ягоды: сколько и чем собирать</a></li>
  <li><a href="#yadovitye">Ядовитые ягоды и лисий цепень</a></li>
  <li><a href="#cheremsha">Черемша и её ядовитые двойники</a></li>
  <li><a href="#travy">Травы, цветы и каштаны</a></li>
  <li><a href="#ohrana">Охраняемые растения и эдельвейс</a></li>
  <li><a href="#kamni">Камни и кристаллы</a></li>
  <li><a href="#nelzya">Где нельзя трогать ничего</a></li>
</ul></nav>

<h2 id="mozhno">Что можно собирать без разрешения</h2>
<ul class="ul">
  <li>В лес и на пастбища может заходить каждый, даже если земля частная. Дикие ягоды, грибы и похожие дары природы там можно брать в обычном для этой местности количестве. Так написано в Гражданском кодексе (<a href="https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699">ZGB, ст. 699</a>). Власти могут запретить сбор в отдельных местах, например чтобы защитить молодой лес или посадки.</li>
  <li>Травы для чая и лекарственные травы, ягоды и грибы можно собирать для себя без разрешения, если растение не охраняется. Так сказано в законе об охране природы (<a href="https://www.fedlex.admin.ch/eli/cc/1966/1637_1694_1679/de#art_19">NHG, ст. 19</a>). Сколько именно можно взять, кантоны и общины решают своими правилами, поэтому лимиты в разных кантонах разные.</li>
  <li class="attn"><i class="wi"></i><b>Собирать на продажу</b> можно только с разрешения кантона. Кантон может ограничить такой сбор по видам, местам и количеству и запретить организованные сборы и рекламу таких сборов (<a href="https://www.fedlex.admin.ch/eli/cc/1966/1637_1694_1679/de#art_19">NHG, ст. 19</a>). Например, в Аргау организованные сборы и их реклама запрещены, а для сбора на продажу нужно разрешение кантонального отдела ландшафта и водоёмов (<a href="https://www.ag.ch/de/themen/umwelt-natur/wald/erholungsraum-wald/sammeln-von-beeren-pilzen-und-holz">кантон Аргау</a>).</li>
  <li class="attn"><i class="wi"></i>Это право касается только дикорастущего в лесу и на пастбищах. В чужом саду, на огороде, в питомнике и с посаженных фруктовых деревьев ничего не рви без разрешения хозяина.</li>
  <li>Если ветки соседского дерева свисают над твоим садом или участком и ты их терпишь, плоды на этих ветках принадлежат тебе. Для деревьев в лесу это правило не действует (<a href="https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_687">ZGB, ст. 687</a>).</li>
</ul>

<h2 id="yagody">Ягоды: сколько и чем собирать</h2>
<p>Чернику, малину, ежевику, бруснику и землянику для себя собирать можно почти везде. Но многие кантоны ограничивают количество и запрещают инструменты, которые портят кусты. Вот примеры.</p>
<ul class="ul">
  <li class="attn"><b>Кантон Берн.</b> Ягоды, травы для чая, мох и лишайники можно брать в обычном количестве, если вид здесь не охраняется и растёт часто. Собирать нужно бережно, не повреждая соседние растения. <i class="wi"></i>Нельзя снимать верхний слой почвы и пользоваться приспособлениями вроде гребёнки для черники (Heitisträhl) (<a href="https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file">постановление Берна об охране природы, ст. 22</a>).</li>
  <li class="attn"><b>Кантон Во.</b> Чернику и малину можно собирать для нужд семьи. <i class="wi"></i>Инструменты для массового сбора запрещены, а собирать ради заработка нельзя (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/protection-des-especes">кантон Во</a>).</li>
  <li class="attn"><b>Кантон Тичино.</b> <i class="wi"></i>Ягод можно собрать не больше 5 кг на человека в день. Гребёнки для черники разрешены, а машинки, грабли и другие инструменты, которые вредят природе, запрещены (<a href="https://www.lexfind.ch/tolv/189885/it">положение Тичино об охране флоры, фауны и грибов, ст. 2a</a>).</li>
  <li><b>Кантон Ури.</b> Собирать можно только спелые ягоды. С какого дня в общине можно начинать собирать чернику и бруснику и с какого дня можно гребёнки, решает и объявляет совет общины. В огороженных лесах и на участках с особым запретом собирать ягоды нельзя (<a href="https://www.lexfind.ch/tolv/89496/de">постановление Ури о сборе ягод</a>).</li>
  <li>Самое простое правило: бери столько, сколько съешь или переработаешь дома, рви руками и не ломай кусты. Если в твоём кантоне есть свои правила, они обычно на сайте кантонального отдела охраны природы (Naturschutz, protection de la nature, protezione della natura).</li>
</ul>

<h2 id="yadovitye">Ядовитые ягоды и лисий цепень</h2>
<ul class="ul">
  <li>Токсикологический центр Tox Info Suisse объясняет так. До пяти местных красных ягод обычно не вызывают тяжёлых симптомов даже у маленького ребёнка. <i class="wi"></i>Если ребёнок съел чёрные ягоды, всегда звони по номеру <b>145</b>, чтобы вместе определить растение (<a href="https://www.toxinfo.ch/red_berries_black_when_dangerous">Tox Info Suisse</a>).</li>
  <li class="attn"><b>Белладонна</b> (Tollkirsche, belladone, belladonna) — блестящие чёрные ягоды размером 10–15 мм с зелёной звёздочкой из пяти листиков у основания. <i class="wi"></i>Маленькому ребёнку достаточно одной ягоды, чтобы появились заметные симптомы (<a href="https://www.toxinfo.ch/red_berries_black_when_dangerous">Tox Info Suisse</a>). Её путают даже взрослые: в 2024 году в Tox Info обратились из-за человека, который думал, что ест лесную ежевику, а съел белладонну и попал в больницу (<a href="https://www.toxinfo.ch/customer/files/1206/Tox_Jahresbericht-2024-DE-Web-150dpi.pdf">годовой отчёт Tox Info Suisse за 2024 год</a>).</li>
  <li><b>Лисий цепень</b> (Fuchsbandwurm) — паразит, яйца которого могут попасть на ягоды и грибы у земли. Болезнь редкая: в Швейцарии около 10–20 новых случаев в год. Федеральное ведомство здравоохранения BAG советует мыть лесные ягоды, грибы, овощи с огорода и падалицу, а лучше варить их. Заморозка яйца не убивает. После работы с землёй мой руки, а кошек и собак, которые ловят мышей, регулярно лечи от глистов (<a href="https://www.bag.admin.ch/de/fuchsbandwurm-echinokokkose">BAG</a>).</li>
</ul>

<h2 id="cheremsha">Черемша и её ядовитые двойники</h2>
<ul class="ul">
  <li><b>Черемша</b> (Bärlauch, ail des ours, aglio orsino) растёт весной в сырых лиственных лесах, её собирают многие. <i class="wi"></i>Но её путают с ядовитыми растениями. Самое опасное из них — безвременник (Herbstzeitlose), он сильно ядовит. Менее опасен ландыш (Maiglöckchen), иногда рядом растёт ещё и аронник (Aronstab). За последние 10–15 лет звонков об этом в Tox Info Suisse стало вдвое больше, а с 2000 года в Швейцарии от безвременника умерли четыре человека (<a href="https://www.toxinfo.ch/wild_garlics_toxic_lookalikes">Tox Info Suisse</a>).</li>
  <li><b>Как отличить.</b> У черемши каждый лист растёт из земли сам по себе, на своём тонком черешке, нижняя сторона листа матовая, лист пахнет чесноком. У безвременника узкие листья без черешка сидят прямо на стебле и не пахнут чесноком. У ландыша 2–3 листа обхватывают один общий стебель, нижняя сторона блестящая, запаха чеснока нет (<a href="https://www.toxinfo.ch/wild_garlics_toxic_lookalikes">Tox Info Suisse</a>).</li>
  <li class="attn"><i class="wi"></i><b>Запах — ненадёжная проверка.</b> После первого же листа черемши пальцы пахнут чесноком, и дальше «пахнет» всё подряд. Поэтому определяй растение на месте, проверяй каждый лист отдельно и не собирай на опушке, где черемша и безвременник часто растут рядом. Если сомневаешься, купи черемшу в магазине (<a href="https://www.toxinfo.ch/wild_garlics_toxic_lookalikes">Tox Info Suisse</a>).</li>
  <li class="attn"><i class="wi"></i><b>Если через несколько часов после еды с черемшой началась тошнота, рвота или сильный понос</b>, сразу звони в Tox Info Suisse по номеру <b>145</b>. Номер работает круглосуточно и бесплатно, из-за границы — +41 44 251 51 51. Отравление безвременником опасно для жизни, человеку нужна больница. Если человек теряет сознание, звони в скорую помощь по номеру <b>144</b> (<a href="https://www.toxinfo.ch/wild_garlics_toxic_lookalikes">Tox Info Suisse</a>).</li>
</ul>

<h2 id="travy">Травы, цветы и каштаны</h2>
<ul class="ul">
  <li>Травы для чая и лекарственные травы, если они не охраняются, можно собирать для себя без разрешения (<a href="https://www.fedlex.admin.ch/eli/cc/1966/1637_1694_1679/de#art_19">NHG, ст. 19</a>). Это касается, например, цветов бузины и липы, крапивы и шиповника, если они растут в лесу или на пастбище, а не в чужом саду.</li>
  <li><b>Цветы.</b> Обычные полевые цветы можно сорвать на небольшой букет. Например, в Берне разрешён «средний букет», а условно охраняемых видов — не больше пяти стеблей и только там, где их много (<a href="https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file">постановление Берна об охране природы, ст. 20–21</a>). В Тичино других диких растений можно взять не больше, чем помещается в одной руке (<a href="https://www.lexfind.ch/tolv/189885/it">положение Тичино, ст. 2</a>).</li>
  <li class="attn"><b>Каштаны в Тичино.</b> Многие каштановые рощи (selve castanili) частные. По правилам, о которых пишет туристическая организация Тичино, до праздника Сан-Мартино 11 ноября нельзя собирать каштаны под деревьями, где скошена трава или сгребены листья: это значит, что хозяин соберёт их сам (<a href="https://www.ticino.ch/de/inspirations/stories/chestnut.html">Ticino Turismo</a>). <i class="wi"></i>В долине Бергель (Граубюнден) гостям можно собирать каштаны только в зоне Брентан над Кастазеньей и не больше 2 кг на человека в день (<a href="https://www.suedostschweiz.ch/panorama/vom-engadin-zum-kastaniensammeln-ins-bergell-diese-regel-sollten-ausfluegler-kennen-2198448">Südostschweiz</a>).</li>
  <li>Хворост, шишки и еловые ветки к празднику: единого правила нет. Деревья и кусты в лесу не ломай и не пили, за повреждение леса кантоны штрафуют. Если хочешь взять что-то больше горсти шишек, спроси лесника (Förster) или общину.</li>
</ul>

<h2 id="ohrana">Охраняемые растения и эдельвейс</h2>
<ul class="ul">
  <li class="attn"><b>Растения из федерального списка</b> охраняются по всей Швейцарии. <i class="wi"></i>Без разрешения их нельзя рвать, выкапывать, вырывать, уносить, продавать, покупать и уничтожать (<a href="https://www.fedlex.admin.ch/eli/cc/1991/249_249_249/de#art_20">постановление об охране природы NHV, ст. 20 и приложение 2</a>). В этом списке, например, все дикие орхидеи, лилия кудреватая (Türkenbund), белая кувшинка (Weisse Seerose) и горечавка лёгочная (Lungen-Enzian). Удобный список с картинками есть у кантона Цюрих (<a href="https://www.zh.ch/de/umwelt-tiere/naturschutz/artenschutz.html">кантон Цюрих</a>).</li>
  <li class="attn"><b>Эдельвейс</b> по федеральному закону не охраняется, но его охраняют законы многих кантонов, например Граубюндена, Берна и Нидвальдена (<a href="https://www.aboutswitzerland.eda.admin.ch/en/the-mystical-and-mythical-edelweiss">aboutswitzerland, EDA</a>, <a href="https://www.gr.ch/DE/institutionen/verwaltung/ekud/anu/ANU_Dokumente/ANU-404-82d_Liste_geschuetzte_Pflanzen.pdf">кантон Граубюнден</a>, <a href="https://www.belex.sites.be.ch/frontend/structured_documents/507/download_pdf_annex?locale=de">кантон Берн</a>). <i class="wi"></i>Рвать эдельвейс нельзя.</li>
  <li>Кантоны добавляют к федеральному списку свои. Например, в Тичино охраняются ещё подснежник, морозник, падуб и иглица (<a href="https://www.lexfind.ch/tolv/189885/it">положение Тичино</a>), а в Во — свои полностью и частично охраняемые виды (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/protection-des-especes">кантон Во</a>). Плакат «Охраняемые растения Швейцарии» с 20 видами выпустили в 2026 году Pro Natura, BAFU и Info Flora (<a href="https://www.infoflora.ch/poster-7">Info Flora</a>).</li>
  <li class="attn"><i class="wi"></i><b>Штраф.</b> За сорванное или выкопанное охраняемое растение грозит штраф до 20 000 франков (<a href="https://www.fedlex.admin.ch/eli/cc/1966/1637_1694_1679/de#art_24_a">NHG, ст. 24a</a>). Info Flora предупреждает, что наказать могут, даже если вокруг этого растения много. Самое простое правило: в горах цветы фотографируй, а не рви.</li>
</ul>

<h2 id="kamni">Камни и кристаллы</h2>
<ul class="ul">
  <li>Искать кристаллы и минералы в горах (strahlen) — старое швейцарское увлечение. <i class="wi"></i>Во многих местах для этого нужно разрешение, и выдаёт его не одно ведомство на всю страну, а кантон, община или корпорация, которой принадлежит земля.</li>
  <li class="attn"><b>Ури.</b> <i class="wi"></i>Нужен патент Корпорации Ури (Korporation Uri) — на год, неделю или день. Годовой патент выдают со 2 января по 31 марта, он личный, нужна страховка ответственности (Haftpflichtversicherung). Зоны, где искать кристаллы запрещено, кантон публикует в официальном бюллетене (<a href="https://www.ur.ch/_doc/51724">кантон Ури</a>, <a href="https://www.ur.ch/_doc/446644">официальный бюллетень Ури, 17.04.2026</a>).</li>
  <li class="attn"><b>Граубюнден.</b> <i class="wi"></i>Правила устанавливают общины. Например, в общине Тухеч (Tujetsch) с 1 июня 2026 года годовое разрешение стоит 300 франков для местных жителей, 600 для других жителей Швейцарии и иностранцев с пермитом C и 1100 для остальных иностранцев, на неделю — 200, на день — 30 франков (<a href="https://www.tujetsch.ch/wp-content/uploads/2026/04/260331_Impurtonts-puncts_Tud.pdf">община Тухеч</a>).</li>
  <li><b>Берн, заповедник Гримзель.</b> С обычным инструментом искать можно без разрешения. Для большого инструмента, дрели или взрывчатки нужно особое разрешение кантона (<a href="https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/umwelt/naturschutz/GESUCH-A-Vorlage-2022-DE.pdf">кантон Берн</a>).</li>
  <li>Прежде чем искать кристаллы, спроси в общине или в туристическом бюро, нужно ли разрешение и где искать запрещено.</li>
</ul>

<h2 id="nelzya">Где нельзя трогать ничего</h2>
<ul class="ul">
  <li class="attn"><b>Швейцарский национальный парк</b> (Граубюнден). <i class="wi"></i>Там нельзя рвать цветы, собирать ягоды и грибы, выкапывать и повреждать растения и уносить камни. Ходить можно только по размеченным тропам, собак брать и разводить огонь нельзя. За нарушение штрафуют, на месте могут взять залог и забрать собранное (<a href="https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file">правила национального парка, ст. 2, 5 и 8</a>).</li>
  <li class="attn"><b>Заповедники</b> (Naturschutzgebiet, réserve naturelle, riserva naturale). У каждого свои правила, они написаны на табличках у входа и в решении об охране. <i class="wi"></i>Часто там нельзя рвать никаких растений, даже обычных, например в заповедниках Фрибура и Тичино.</li>
  <li>Что ещё можно и нельзя в лесу (костёр, собака весной, зоны покоя дичи), — на странице «<a href="../rybalka-griby-ohota/">На природе в Швейцарии</a>». Про грибы — в теме «<a href="../griby/">Грибы</a>».</li>
</ul>
''',
    steps=[
        'Собирай ягоды и травы для себя, руками и в обычном количестве. Перед сбором в незнакомом месте посмотри правила кантона и не заходи в огороженные участки.',
        'Чёрные ягоды детям не давай, а если ребёнок их съел, звони по номеру 145. Лесные ягоды мой, а лучше вари.',
        'Черемшу собирай только если уверенно отличаешь её от безвременника и ландыша. Проверяй каждый лист, а при тошноте или рвоте через несколько часов звони 145.',
        'Орхидеи, эдельвейс и другие охраняемые цветы не рви — фотографируй.',
        'Перед поиском кристаллов спроси в общине, нужно ли разрешение, а в национальном парке и заповедниках ничего не трогай.',
    ],
    tools={'ekstrennye-nomera': 'Tox Info 145, скорая помощь 144, Rega 1414 и дежурный врач твоего кантона — на одной карточке в рюкзак.',
           'plan-pohoda': 'Идёшь в лес или в горы — оставь близким маршрут и время возвращения на русском и языке кантона.'},
    tabs={'events': 'Прогулки по лесу и выезды на природу с группой на русском и украинском — во встречах рядом с тобой.'},
    related=['rybalka-griby-ohota', 'griby', 'priroda', 'bolezn-travma'],
    sources=[
        ('Гражданский кодекс (ZGB), ст. 699 — лес, пастбища, ягоды и грибы', 'https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699'),
        ('Гражданский кодекс (ZGB), ст. 687 — ветки и плоды соседского дерева', 'https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_687'),
        ('Закон об охране природы (NHG), ст. 19 — сбор растений, ст. 24a — штрафы', 'https://www.fedlex.admin.ch/eli/cc/1966/1637_1694_1679/de#art_19'),
        ('Постановление об охране природы (NHV), ст. 20 и приложение 2 — охраняемые растения', 'https://www.fedlex.admin.ch/eli/cc/1991/249_249_249/de#art_20'),
        ('Кантон Аргау — сбор ягод, грибов и дров', 'https://www.ag.ch/de/themen/umwelt-natur/wald/erholungsraum-wald/sammeln-von-beeren-pilzen-und-holz'),
        ('Кантон Берн — постановление об охране природы (NSchV), ст. 20–23', 'https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file'),
        ('Кантон Берн — список охраняемых растений (приложение к NSchV)', 'https://www.belex.sites.be.ch/frontend/structured_documents/507/download_pdf_annex?locale=de'),
        ('Кантон Во — охрана видов, сбор растений', 'https://www.vd.ch/environnement/biodiversite-et-paysage/protection-des-especes'),
        ('Кантон Тичино — положение об охране флоры, фауны и грибов (текст на lexfind.ch)', 'https://www.lexfind.ch/tolv/189885/it'),
        ('Кантон Ури — постановление о сборе ягод (текст на lexfind.ch)', 'https://www.lexfind.ch/tolv/89496/de'),
        ('Tox Info Suisse — ядовитые двойники черемши', 'https://www.toxinfo.ch/wild_garlics_toxic_lookalikes'),
        ('Tox Info Suisse — красные и чёрные ягоды: когда опасно', 'https://www.toxinfo.ch/red_berries_black_when_dangerous'),
        ('Tox Info Suisse — годовой отчёт 2024', 'https://www.toxinfo.ch/customer/files/1206/Tox_Jahresbericht-2024-DE-Web-150dpi.pdf'),
        ('BAG — лисий цепень (эхинококкоз)', 'https://www.bag.admin.ch/de/fuchsbandwurm-echinokokkose'),
        ('Кантон Цюрих — охраняемые виды', 'https://www.zh.ch/de/umwelt-tiere/naturschutz/artenschutz.html'),
        ('Info Flora — плакат «Охраняемые растения Швейцарии», 2026', 'https://www.infoflora.ch/poster-7'),
        ('aboutswitzerland (EDA) — эдельвейс', 'https://www.aboutswitzerland.eda.admin.ch/en/the-mystical-and-mythical-edelweiss'),
        ('Кантон Граубюнден — список охраняемых растений', 'https://www.gr.ch/DE/institutionen/verwaltung/ekud/anu/ANU_Dokumente/ANU-404-82d_Liste_geschuetzte_Pflanzen.pdf'),
        ('Ticino Turismo — каштаны', 'https://www.ticino.ch/de/inspirations/stories/chestnut.html'),
        ('Südostschweiz — каштаны в Бергеле', 'https://www.suedostschweiz.ch/panorama/vom-engadin-zum-kastaniensammeln-ins-bergell-diese-regel-sollten-ausfluegler-kennen-2198448'),
        ('Кантон Ури — патент на поиск кристаллов', 'https://www.ur.ch/_doc/51724'),
        ('Официальный бюллетень Ури, 17.04.2026 — зоны запрета для искателей кристаллов', 'https://www.ur.ch/_doc/446644'),
        ('Община Тухеч — разрешение на поиск кристаллов с 01.06.2026', 'https://www.tujetsch.ch/wp-content/uploads/2026/04/260331_Impurtonts-puncts_Tud.pdf'),
        ('Кантон Берн — разрешение для заповедника Гримзель', 'https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/umwelt/naturschutz/GESUCH-A-Vorlage-2022-DE.pdf'),
        ('Правила Швейцарского национального парка (Nationalparkordnung)', 'https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file'),
    ],
    terms=[('Deutsch', 'Beeren sammeln, im ortsüblichen Umfang, Heidelbeere, Himbeere, Brombeere, Preiselbeere, Walderdbeere, Beerenkamm, Tee- und Heilkräuter, Bärlauch, Herbstzeitlose, Maiglöckchen, Aronstab, Tollkirsche, Fuchsbandwurm, geschützte Pflanzen, Türkenbund, Weisse Seerose, Lungen-Enzian, Orchideen, Edelweiss, Edelkastanie, Kastanienselve, Strahler, Strahlerpatent, Naturschutzgebiet, Nationalpark'),
           ('Français', 'cueillette, selon l’usage local, myrtille, framboise, mûre, airelle rouge, fraise des bois, peigne à myrtilles, plantes médicinales, ail des ours, colchique, muguet, arum, belladone, ténia du renard, plantes protégées, lis martagon, nénuphar blanc, gentiane pneumonanthe, orchidées, edelweiss, châtaigne, châtaigneraie, cristallier, réserve naturelle, Parc National Suisse'),
           ('Italiano', 'raccolta, secondo l’uso locale, mirtillo, lampone, mora, mirtillo rosso, fragolina di bosco, pettine per mirtilli, erbe medicinali, aglio orsino, colchico, mughetto, gigaro, belladonna, tenia della volpe, piante protette, giglio martagone, ninfea bianca, genziana mettimborsa, orchidee, stella alpina, castagna, selva castanile, cercatore di cristalli, riserva naturale, Parco Nazionale Svizzero'),
           ('English', 'foraging, berries, blueberry, raspberry, blackberry, lingonberry, wild strawberry, berry comb, herbs for tea, wild garlic, autumn crocus, lily of the valley, deadly nightshade, fox tapeworm, protected plants, martagon lily, white water lily, marsh gentian, orchids, edelweiss, sweet chestnut, crystal hunting, nature reserve, Swiss National Park')],
)
