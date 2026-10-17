# ===== «На природе»: рыбалка, грибы, ягоды и травы, охота — отдельные темы (17.10.2026, просьба Ирины:
# «у нас есть на сайте статьи про правила рыбалки в швейцарии, правила охоты, сбора грибов и ягод и т д… можно отдельными статьями сделать»).
# Прежняя общая тема rybalka-griby-ohota остаётся по тому же адресу и становится короткой страницей «На природе» со ссылками на четыре темы.
# Отдельный файл, чтобы не мешать параллельной работе над articles.py; подключается в конце articles.py.
# Факты сверены 17.10.2026 (пять параллельных проверок по официальным источникам; федеральные законы — fedlex, тексты сверены по копиям SR
# на droit-bilingue.ch и lexfind.ch, кантональные — по сайтам и сборникам законов кантонов). Подробно — документ проекта «priroda-statyi.md».

UPD = '17.10.2026'


def add(ARTICLES):
    ARTICLES['yagody-travy'] = YAGODY


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
