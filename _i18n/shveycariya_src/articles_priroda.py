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
    ARTICLES['griby'] = GRIBY
    ARTICLES['ohota'] = OHOTA
    ARTICLES['rybalka'] = RYBALKA


BGF = 'https://www.fedlex.admin.ch/eli/cc/1991/2259_2259_2259/de'
TSCHV = 'https://www.fedlex.admin.ch/eli/cc/2008/416/de'
ZH_FISH = 'https://www.zh.ch/de/umwelt-tiere/tiere/fischerei/wie-und-wo-fischen-im-kanton-zuerich.html'
ZH_PRICES = 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/tiere/fischerei-und-jagd/fischerei/fischereipatente-beziehen/preise_f%C3%BCr_fischereipatente_ab_2026.pdf'
ANGLER_FAQ = 'https://www.anglerausbildung.ch/fragen-antworten'
VOLLZUG = 'https://www.bafu.admin.ch/dam/fr/sd-web/7rNRq0qInwqf/vollzugshilfe_angelfischerei.pdf'
RYBALKA = dict(
    upd=UPD,
    kanton=['ryba'],
    h1='Рыбалка в Швейцарии: <em>патент, сертификат SaNa и где ловить без патента</em>',
    seo='Рыбалка в Швейцарии: рыболовный патент (Fischereipatent), сертификат SaNa, где ловить без патента и цены 2026 года',
    desc='Рыбалка в Швейцарии простыми словами на русском: какой нужен патент (Fischereipatent) и сколько он стоит в 2026 году, где купить онлайн, когда нужен сертификат SaNa и как пройти курс, на каких озёрах можно ловить с берега без патента (Цюрихское, Тунское, Бриенцское, Бильское, Боденское, Женевское, Невшательское, Цугское, Фирвальдштетское), запрет живой рыбки, крючков с бородкой и «поймал-отпустил», как правильно убить рыбу, мойка лодок, дети, штрафы. По-французски permis de pêche, attestation de compétence SaNa, по-итальянски patente di pesca, attestato di competenza.',
    lead='Рыбачить в Швейцарии можно почти везде, но почти везде нужен патент кантона. На многих больших озёрах с берега можно ловить и без него, а для патента на год понадобится короткий курс SaNa. Здесь — какой патент выбрать, сколько он стоит, где его купить и какие правила действуют на воде. Выбери свой кантон — и увидишь его страницы и цены.',
    body='''
<nav class="toc" aria-label="Содержание"><b>В этой статье</b>
<ul>
  <li><a href="#kto">Кто разрешает рыбалку</a></li>
  <li><a href="#patent">Патент: какой выбрать и сколько стоит</a></li>
  <li><a href="#sana">Сертификат SaNa</a></li>
  <li><a href="#bez-patenta">Где можно ловить без патента</a></li>
  <li><a href="#pravila">Правила на воде</a></li>
  <li><a href="#ryba">Что делать с пойманной рыбой</a></li>
  <li><a href="#chuzhie">Чужие виды и мойка лодок</a></li>
  <li><a href="#deti">Дети на рыбалке</a></li>
  <li><a href="#shtrafy">Что будет за нарушения</a></li>
</ul></nav>

<h2 id="kto">Кто разрешает рыбалку</h2>
<ul class="ul">
  <li>Рыбалку в Швейцарии регулирует кантон (<a href="''' + BGF + '''#art_3">федеральный закон о рыболовстве BGF, ст. 3</a>). Право ловить рыбу в озёрах и реках принадлежит кантону, и он продаёт разрешение — <b>рыболовный патент</b> (Fischereipatent, permis de pêche, patente di pesca). Поэтому правила, цены и места в каждом кантоне свои.</li>
  <li>На многих реках и ручьях право ловить сдано в аренду обществам рыбаков или частным людям (Pachtrevier, lot affermé). Там разрешение на день, неделю или год продаёт арендатор участка. Например, в Аппенцелле-Ауссерродене все 26 участков сданы в аренду, а в Базеле-Ланде право ловли в основном у общин (<a href="https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-umwelt/fischerei/fischen-in-appenzell-ausserrhoden/">кантон Аппенцелль-Ауссерроден</a>, <a href="https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/fischerei/fischerei-im-kanton-aargau">кантон Аргау</a>).</li>
  <li>Ссылки на страницу рыбалки и магазин патентов твоего кантона — в блоке «Твой кантон» вверху.</li>
</ul>

<h2 id="patent">Патент: какой выбрать и сколько стоит</h2>
<ul class="ul">
  <li>Патенты бывают на день, несколько дней, неделю, месяц и год, на одно озеро, на все озёра или на реки. Для начала обычно хватает дневного патента: он дешёвый, и для него почти везде не нужен сертификат SaNa.</li>
  <li><b>Примеры цен 2026 года для взрослых.</b> Цюрих: дневной на одно озеро — 30 франков, для молодёжи 10–18 лет — 12, годовой — от 100 до 170 франков, бумажный патент — на 10 франков дороже (<a href="''' + ZH_PRICES + '''">кантон Цюрих</a>). Берн: день — 32 франка, 7 дней — 100, 30 дней — 180, год — 250 и 50 франков взноса на рыбное хозяйство (<a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatente-preise.html">кантон Берн</a>). Граубюнден: день — 36 франков, сезон — 235 (<a href="https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/fischerei/Documents/Fischen%20in%20Graub%c3%bcnden/Fischereipatente/Preisliste%20Fischereipatente%202026.pdf">кантон Граубюнден</a>). Во: день на Женевском озере — 10 франков, на реках — 20 (<a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/Comment_obtenir_un_permis_de_p%C3%AAche__/Prix_permis_2026_Internet_20251225.pdf">кантон Во</a>). Женева: день на озере — 10 франков, до 16 лет — 5 (<a href="https://www.ge.ch/permis-peche/categories-permis-tarifs">кантон Женева</a>).</li>
  <li>Тем, кто живёт в другом кантоне или за границей, патент часто стоит дороже, иногда вдвое (<a href="https://www.sg.ch/umwelt-natur/jagd-fischerei/fischerei/fischereipatente.html">кантон Санкт-Галлен</a>, <a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatente-preise.html">кантон Берн</a>).</li>
  <li><b>Где купить.</b> Почти во всех кантонах патент покупают онлайн или в приложении и сразу могут им пользоваться. Например, в Цюрихе — в <a href="https://webshop.efj.zh.ch">веб-магазине кантона</a> или в приложении eFJ-Mobile (<a href="''' + ZH_FISH + '''">кантон Цюрих</a>), в Берне — в <a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatent-beziehen.html">магазине кантона и в приложении «Fischen Bern»</a>. Покупай патент только на сайте кантона или по ссылке с него.</li>
  <li class="attn"><i class="wi"></i><b>Патент всегда носи с собой</b> и показывай по требованию рыбнадзора. В Берне при себе должны быть ещё учёт улова и удостоверение личности с фото (<a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatent-beziehen.html">кантон Берн</a>). Учёт улова (Fangstatistik) ведут сразу после поимки и в конце сезона отправляют в кантон. В Цюрихе за опоздание или отсутствие статистики берут 50 франков (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/tiere/fischerei-und-jagd/fischerei/verf%C3%BCgungen/fischereivorschriften_auszug_fuer_die_angelfischerei_202603.pdf">кантон Цюрих, выписка правил 03.2026</a>).</li>
</ul>

<h2 id="sana">Сертификат SaNa</h2>
<ul class="ul">
  <li><b>SaNa</b> (Sachkunde-Nachweis, attestation de compétence, attestato di competenza) — это подтверждение, что ты знаешь рыб и правила и умеешь ловить и убивать рыбу без лишних мучений. Его получают после короткого курса.</li>
  <li class="attn"><i class="wi"></i>По федеральному закону без SaNa можно ловить только там, где патент не нужен, или с коротким патентом сроком не больше месяца (<a href="''' + TSCHV + '''#art_97">постановление о защите животных TSchV, ст. 97</a>). Многие кантоны строже: в Берне и Граубюндене SaNa нужен уже для патента на 30 дней, в Ури — для патента на 3 дня, в Цуге — для всех, кроме дневного и гостевого, в Золотурне — даже для дневного, в Санкт-Галлене — для любого патента (<a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatente-preise.html">Берн</a>, <a href="https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/fischerei/Fischen-in-Graubuenden/Seiten/Sachkundenachweis.aspx">Граубюнден</a>, <a href="https://www.ur.ch/fischerei">Ури</a>, <a href="https://zg.ch/de/natur-umwelt-tiere/wasser-und-gewaesser/fischen">Цуг</a>, <a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/fischerei/fischen-im-kanton-solothurn/">Золотурн</a>, <a href="https://www.sg.ch/umwelt-natur/jagd-fischerei/fischerei/fischereipatente.html">Санкт-Галлен</a>). Годовой патент без SaNa не дают нигде.</li>
  <li class="attn"><i class="wi"></i>С коротким патентом без SaNa нельзя ловить на крючок с бородкой и на живую рыбку и нельзя держать пойманную рыбу живой (<a href="https://www.anglerausbildung.ch/kurzzeitpatent">Netzwerk Anglerausbildung</a>, <a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/Formation___comment_obtenir_une_attestation_SaNa__/INFO_PECHEURS_SaNa_v14__20251215.pdf">кантон Во</a>).</li>
  <li><b>Курс.</b> Он длится не меньше 5 часов, обычно это один день. Курс стоит обычно 60–90 франков, ещё 36 франков — сама карта SaNa (с 2026 года), учебник покупают отдельно. Записаться можно на сайте швейцарской сети обучения рыбаков: <a href="https://www.anglerausbildung.ch/sana-kurse/komplette-kurse">anglerausbildung.ch</a> (по-немецки), <a href="https://www.formation-pecheurs.ch">formation-pecheurs.ch</a> (по-французски) или <a href="https://www.formazione-pescatori.ch/">formazione-pescatori.ch</a> (по-итальянски) (<a href="''' + ANGLER_FAQ + '''">Netzwerk Anglerausbildung</a>). В Женеве курс нужен всем с 14 лет, кто покупает не только дневные патенты, и стоит около 100 франков (<a href="https://www.ge.ch/permis-peche/attestation-competence-peche-sana">кантон Женева</a>).</li>
  <li>Документ рыбака из другой страны SaNa не заменяет. Признают только экзаменационные свидетельства Германии, Австрии, Лихтенштейна и Южного Тироля, остальным нужно пройти курс (<a href="https://www.anglerausbildung.ch/auslaendischer-fischereiausweis">Netzwerk Anglerausbildung</a>).</li>
</ul>

<h2 id="bez-patenta">Где можно ловить без патента</h2>
<p>На многих больших озёрах с берега можно ловить без патента (Freiangelrecht, pêche sans permis). Снасти при этом простые, а сроки запрета, минимальные размеры и дневная норма действуют так же, как с патентом. Ловят всегда с берега, мостов и причалов, а не с лодки.</p>
<ul class="ul">
  <li><b>Цюрих</b> — Цюрихское озеро, Грайфензее, Пфеффикерзее и Тюрлерзее: одна удочка, один простой крючок без бородки, без рыбки-наживки (<a href="''' + ZH_FISH + '''">кантон Цюрих</a>).</li>
  <li><b>Берн</b> — Бриенцское, Тунское и Бильское озёра: одна удочка, один крючок без бородки, без рыбки-наживки. Перед ловлей нужно прочитать памятку кантона о видах, размерах и сроках. У устьев рек и в заповедниках ловить нельзя (<a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischen-ohne-angelpatent.html">кантон Берн</a>).</li>
  <li><b>Санкт-Галлен</b> — Боденское озеро, Валензее, Цюрихское озеро и Оберзее: одна удочка, без живой рыбки (<a href="https://www.sg.ch/umwelt-natur/jagd-fischerei/fischerei/fischereipatente/freiangelrecht.html">кантон Санкт-Галлен</a>). <b>Тургау</b> — Боденское озеро и Рейн: удочка с поплавком, крючок без бородки, без искусственных приманок; пойманную рыбу сразу убить (<a href="https://jfv.tg.ch/fischerei/freiangelei.html/8656">кантон Тургау</a>).</li>
  <li><b>Фирвальдштетское озеро</b> (Vierwaldstättersee) — со стороны Люцерна, Нидвальдена и Ури с общедоступного берега можно бесплатно: одна удочка, крючок без бородки, натуральная наживка. В Люцерне ночью ловить нельзя (<a href="https://lawa.lu.ch/fischerei/angelfischerei/fischereiausuebung_vierwaldstaettersee">кантон Люцерн</a>). В Обвальдене так можно на Зарнерзее и Альпнахерзее с 1 апреля по 15 октября (<a href="https://www.ow.ch/_doc/435695">кантон Обвальден</a>). <b>Цугское озеро</b> — со стороны Цуга удочка с поплавком, крючок без бородки, натуральная наживка (<a href="https://zg.ch/de/natur-umwelt-tiere/wasser-und-gewaesser/fischen">кантон Цуг</a>).</li>
  <li class="attn"><b>Швиц.</b> <i class="wi"></i>На швицких берегах Фирвальдштетского, Цугского и Цюрихского озёр без патента можно только с картой Freiangelkarte, а для неё нужен SaNa; крючок с бородкой с берега запрещён (<a href="https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-gewaesser/fischerei/haeufig-gestellte-fragen.html/8756-8758-8802-9447-9450-10713-10821">кантон Швиц</a>).</li>
  <li><b>Женевское, Невшательское и Муртенское озёра</b> — с берега одной удочкой с поплавком и одним крючком; на Невшательском — до трёх удочек и можно с лодки (<a href="https://www.ge.ch/permis-peche/conditions-pecher-sans-permis">кантон Женева</a>, <a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/D%C3%A9couvrez_la_p%C3%AAche_dans_le_canton_de_Vaud__/DGE_Reglement_2026_Leman_Def.pdf">кантон Во</a>, <a href="https://www.ne.ch/sites/default/files/2025-11/Reglement%20p%C3%AAche%20lac%20NE.pdf">кантон Невшатель</a>).</li>
  <li class="attn"><i class="wi"></i><b>Тичино</b> — на Лаго-Маджоре и Луганском озере патент нужен и для ловли с берега (<a href="https://www4.ti.ch/dt/da/ucp/temi/pesca/per-saperne-di-piu/domande-frequenti">кантон Тичино</a>). <b>Аргау</b> — на Хальвилерзее и участках рек «свободная» ловля только с картой за 50 франков и с SaNa, с 12 лет (<a href="https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/fischerei/fischerei-im-kanton-aargau/freianglerrecht">кантон Аргау</a>).</li>
</ul>

<h2 id="pravila">Правила на воде</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i><b>«Поймал и отпустил»</b> ради удовольствия запрещено: нельзя ловить рыбу с намерением сразу её отпустить. <i class="wi"></i>Нельзя ловить на живую рыбку и на крючки с бородкой — исключения разрешает только кантон, обычно тем, у кого есть SaNa (<a href="''' + TSCHV + '''#art_23">TSchV, ст. 23</a>). Например, на Женевском озере держателям патента можно ловить на живую рыбку, прицепленную за рот (<a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/D%C3%A9couvrez_la_p%C3%AAche_dans_le_canton_de_Vaud__/DGE_Reglement_2026_Leman_Def.pdf">кантон Во</a>).</li>
  <li class="attn">Рыбу меньше минимального размера, пойманную в период запрета, и охраняемые виды нужно, наоборот, <b>сразу и бережно отпустить</b> (<a href="''' + VOLLZUG + '''">BAFU и BLV, памятка для рыбаков</a>). <i class="wi"></i>Сроки запрета (Schonzeit), минимальный размер (Fangmindestmass) и дневная норма у каждого вида и в каждом кантоне свои и меняются. Каждый год скачивай свежую памятку своего кантона.</li>
  <li><b>Ночью и в запретных местах.</b> Во многих местах ночью ловить нельзя: например, на Фирвальдштетском озере со стороны Люцерна ловят только с часа до восхода до часа после заката (<a href="https://lawa.lu.ch/fischerei/angelfischerei/fischereiausuebung_vierwaldstaettersee">кантон Люцерн</a>). Нельзя ловить в рыбоходах, а в Цюрихе ещё с 16 ноября по 31 января ближе 100 м от устьев некоторых притоков и ближе 50 м от сетей профессиональных рыбаков (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/tiere/fischerei-und-jagd/fischerei/verf%C3%BCgungen/fischereivorschriften_auszug_fuer_die_angelfischerei_202603.pdf">кантон Цюрих</a>).</li>
  <li><b>С лодки.</b> Для рыбалки с лодки часто нужен отдельный патент или добавка к годовому. Например, в Цюрихе добавка «Boot» стоит 160 франков, а дневной патент на одно озеро уже включает лодку (<a href="''' + ZH_PRICES + '''">кантон Цюрих</a>). Сколько удочек можно, тоже решает кантон: на Цюрихском озере с берега — две, с лодки — три (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/tiere/fischerei-und-jagd/fischerei/verf%C3%BCgungen/fischereivorschriften_auszug_fuer_die_angelfischerei_202603.pdf">кантон Цюрих</a>).</li>
</ul>

<h2 id="ryba">Что делать с пойманной рыбой</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Рыбу, которую берёшь себе, нужно сразу оглушить и убить (<a href="''' + TSCHV + '''#art_100">TSchV, ст. 100</a>). Оглушают сильным ударом по голове колотушкой. Рыбу длиной от 22 см после этого сразу обескровливают — надрезают жабры — или потрошат (<a href="''' + VOLLZUG + '''">BAFU и BLV, памятка для рыбаков</a>). Крючок вынимай уже после оглушения, а если его не вынуть без травмы — обрежь леску.</li>
  <li class="attn"><i class="wi"></i>Живую рыбу нельзя перевозить на льду или в ледяной воде (<a href="''' + TSCHV + '''#art_23">TSchV, ст. 23</a>). На Женевском озере голову и хвост рыбы до дома не отрезают, чтобы рыбнадзор мог проверить размер (<a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/D%C3%A9couvrez_la_p%C3%AAche_dans_le_canton_de_Vaud__/DGE_Reglement_2026_Leman_Def.pdf">кантон Во</a>).</li>
  <li class="attn"><i class="wi"></i>Щуку и окуня из Цугского озера можно есть только самому и нельзя отдавать другим: в них найдены вещества PFAS (<a href="https://zg.ch/de/natur-umwelt-tiere/wasser-und-gewaesser/fischen">кантон Цуг</a>). Для Хальвилерзее кантон Аргау даёт советы, как часто такую рыбу можно есть (<a href="https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/fischerei/fischerei-im-kanton-aargau">кантон Аргау</a>).</li>
</ul>

<h2 id="chuzhie">Чужие виды и мойка лодок</h2>
<ul class="ul">
  <li>Квагга-мидия, американские раки и рыба-бычок (Schwarzmundgrundel) вытесняют местных животных, а раки переносят рачью чуму. <i class="wi"></i>Не выпускай в воду рыбу, раков и растения из аквариума или из другого водоёма. Пойманного бычка не используй как наживку и сообщи о нём в кантон (<a href="https://www.zh.ch/de/umwelt-tiere/umweltschutz/gebietsfremde-arten/aquatische-neobiota-als-unbemerkte-fracht.html">кантон Цюрих</a>).</li>
  <li class="attn"><i class="wi"></i>Лодку с номером перед спуском в другое озеро нужно заранее заявить и помыть на признанной станции: в Цюрихе — с 1 апреля 2025 года, в Центральной Швейцарии (Люцерн, Нидвальден, Обвальден, Швиц, Ури, Цуг) — с августа 2024 года, в Берне — с 23 сентября 2024 года (<a href="https://www.zh.ch/de/umwelt-tiere/umweltschutz/gebietsfremde-arten/aquatische-neobiota-als-unbemerkte-fracht.html">кантон Цюрих</a>, <a href="https://umwelt-zentralschweiz.ch/schiffsreinigungspflicht">кантоны Центральной Швейцарии</a>). SUP, каноэ, снасти и сапоги перед другим водоёмом тоже мой, лучше горячей водой, и давай им полностью высохнуть.</li>
</ul>

<h2 id="deti">Дети на рыбалке</h2>
<ul class="ul">
  <li>Детям во многих кантонах можно рыбачить бесплатно или почти бесплатно вместе со взрослым. В Берне с 2026 года до двух детей младше 12 лет ловят бесплатно вместе с держателем годового патента, каждый одной удочкой, улов идёт в счёт взрослого (<a href="https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatente-preise.html">кантон Берн</a>). В Женеве на реках дети до 14 лет ловят без разрешения, но с удостоверением личности (<a href="https://www.ge.ch/permis-peche/conditions-pecher-sans-permis">кантон Женева</a>). В Тичино дети до 8 лет ловят бесплатно со взрослым, а с 9 до 13 лет получают бесплатную лицензию с согласия родителей (<a href="https://www4.ti.ch/dt/da/ucp/temi/pesca/per-saperne-di-piu/domande-frequenti">кантон Тичино</a>).</li>
  <li>Свободная ловля с берега в Цюрихе открыта для всех, без возраста, а молодёжный патент там стоит в несколько раз дешевле взрослого (<a href="''' + ZH_FISH + '''">кантон Цюрих</a>). Сеть обучения рыбаков советует проходить курс SaNa не раньше 10 лет (<a href="''' + ANGLER_FAQ + '''">Netzwerk Anglerausbildung</a>).</li>
</ul>

<h2 id="shtrafy">Что будет за нарушения</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Рыбнадзор (Fischereiaufsicht, garde-pêche) проверяет патенты, снасти и улов. За ловлю без патента наказывает кантон. Например, в Граубюндене штраф на месте — 500 франков за ловлю без действующего патента, 100 — за ловлю ночью и 50 — если не можешь показать патент, удостоверение личности или SaNa (<a href="https://www.gr-lex.gr.ch/frontend/annex_document_dictionaries/6583">кантон Граубюнден</a>).</li>
  <li class="attn"><i class="wi"></i>За нарушение сроков запрета и минимальных размеров и за продажу незаконно пойманной рыбы федеральный закон грозит штрафом до 20 000 франков (<a href="''' + BGF + '''#art_17">BGF, ст. 17</a>). За вред рыбным запасам, например за выпуск чужих видов, — денежное наказание (<a href="''' + BGF + '''#art_16">BGF, ст. 16</a>). Суд может запретить человеку рыбачить до 5 лет (<a href="''' + BGF + '''#art_19">BGF, ст. 19</a>). Приговор может повлиять и на пермит — подробно в теме «<a href="../shtrafy/">Штрафы и полиция</a>».</li>
</ul>
''',
    steps=[
        'Выбери вверху свой кантон и открой его страницу рыбалки: там места, цены и магазин патентов.',
        'Для начала купи дневной патент онлайн или лови с берега там, где патент не нужен. Патент носи с собой.',
        'Если хочешь рыбачить часто, запишись на курс SaNa на anglerausbildung.ch — без него не дадут годовой патент.',
        'Лови на крючки без бородки и без живой рыбки, каждый год скачивай свежую памятку кантона о сроках запрета и размерах.',
        'Пойманную рыбу, которую берёшь себе, сразу оглуши и убей; мелкую и пойманную в период запрета бережно отпусти.',
        'Перед рыбалкой в другом озере вымой и высуши снасти, сапоги и лодку.',
    ],
    tools={'plan-pohoda': 'Идёшь на рыбалку без компании, на дальний берег или в горы — оставь близким маршрут и время возвращения на русском и языке кантона.',
           'ekstrennye-nomera': 'Скорая помощь 144, полиция 117, Rega 1414 и дежурный врач твоего кантона — на одной карточке в рюкзак.'},
    tabs={'events': 'Выезды на рыбалку и на природу с группой на русском и украинском — во встречах рядом с тобой.'},
    related=['rybalka-griby-ohota', 'priroda', 'zhivotnye', 'shtrafy'],
    sources=[
        ('Федеральный закон о рыболовстве (BGF), ст. 3, 16, 17, 19', BGF),
        ('Постановление о защите животных (TSchV), ст. 23, 97, 100', TSCHV),
        ('BAFU и BLV — памятка о защите животных при ловле рыбы удочкой, 2014', VOLLZUG),
        ('Netzwerk Anglerausbildung — вопросы и ответы о SaNa', ANGLER_FAQ),
        ('Netzwerk Anglerausbildung — короткий патент без SaNa', 'https://www.anglerausbildung.ch/kurzzeitpatent'),
        ('Netzwerk Anglerausbildung — курсы SaNa', 'https://www.anglerausbildung.ch/sana-kurse/komplette-kurse'),
        ('Netzwerk Anglerausbildung — иностранные документы рыбака', 'https://www.anglerausbildung.ch/auslaendischer-fischereiausweis'),
        ('Кантон Цюрих — как и где рыбачить', ZH_FISH),
        ('Кантон Цюрих — цены патентов с 2026 года', ZH_PRICES),
        ('Кантон Цюрих — выписка правил для рыбаков, 03.2026', 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/umwelt-tiere/tiere/fischerei-und-jagd/fischerei/verf%C3%BCgungen/fischereivorschriften_auszug_fuer_die_angelfischerei_202603.pdf'),
        ('Кантон Цюрих — чужие виды в воде, мойка лодок', 'https://www.zh.ch/de/umwelt-tiere/umweltschutz/gebietsfremde-arten/aquatische-neobiota-als-unbemerkte-fracht.html'),
        ('Кантон Берн — патенты и цены', 'https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatente-preise.html'),
        ('Кантон Берн — как купить патент', 'https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischereipatent-beziehen.html'),
        ('Кантон Берн — рыбалка без патента', 'https://www.weu.be.ch/de/start/themen/jagd-fischerei/fischerei/fischen-kanton-bern/fischen-ohne-angelpatent.html'),
        ('Кантон Граубюнден — цены патентов 2026', 'https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/fischerei/Documents/Fischen%20in%20Graub%c3%bcnden/Fischereipatente/Preisliste%20Fischereipatente%202026.pdf'),
        ('Кантон Граубюнден — сертификат SaNa', 'https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/fischerei/Fischen-in-Graubuenden/Seiten/Sachkundenachweis.aspx'),
        ('Кантон Граубюнден — штрафы на месте', 'https://www.gr-lex.gr.ch/frontend/annex_document_dictionaries/6583'),
        ('Кантон Санкт-Галлен — рыболовные патенты', 'https://www.sg.ch/umwelt-natur/jagd-fischerei/fischerei/fischereipatente.html'),
        ('Кантон Санкт-Галлен — ловля без патента', 'https://www.sg.ch/umwelt-natur/jagd-fischerei/fischerei/fischereipatente/freiangelrecht.html'),
        ('Кантон Швиц — вопросы о рыбалке', 'https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-gewaesser/fischerei/haeufig-gestellte-fragen.html/8756-8758-8802-9447-9450-10713-10821'),
        ('Кантон Люцерн — рыбалка на Фирвальдштетском озере', 'https://lawa.lu.ch/fischerei/angelfischerei/fischereiausuebung_vierwaldstaettersee'),
        ('Кантон Обвальден — памятка о рыбалке, 2026', 'https://www.ow.ch/_doc/435695'),
        ('Кантон Ури — рыбалка', 'https://www.ur.ch/fischerei'),
        ('Кантон Цуг — рыбалка', 'https://zg.ch/de/natur-umwelt-tiere/wasser-und-gewaesser/fischen'),
        ('Кантон Золотурн — рыбалка в кантоне', 'https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/fischerei/fischen-im-kanton-solothurn/'),
        ('Кантон Тургау — ловля без патента', 'https://jfv.tg.ch/fischerei/freiangelei.html/8656'),
        ('Кантон Аргау — рыбалка в кантоне', 'https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/fischerei/fischerei-im-kanton-aargau'),
        ('Кантон Аргау — карта для свободной ловли', 'https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/fischerei/fischerei-im-kanton-aargau/freianglerrecht'),
        ('Кантон Аппенцелль-Ауссерроден — рыбалка', 'https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-umwelt/fischerei/fischen-in-appenzell-ausserrhoden/'),
        ('Кантон Во — цены разрешений 2026', 'https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/Comment_obtenir_un_permis_de_p%C3%AAche__/Prix_permis_2026_Internet_20251225.pdf'),
        ('Кантон Во — правила рыбалки на Женевском озере 2026', 'https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/D%C3%A9couvrez_la_p%C3%AAche_dans_le_canton_de_Vaud__/DGE_Reglement_2026_Leman_Def.pdf'),
        ('Кантон Во — SaNa, памятка 15.12.2025', 'https://www.vd.ch/fileadmin/user_upload/themes/environnement/biodiversite/fichiers_pdf/P%C3%AAche/Formation___comment_obtenir_une_attestation_SaNa__/INFO_PECHEURS_SaNa_v14__20251215.pdf'),
        ('Кантон Женева — категории разрешений и цены', 'https://www.ge.ch/permis-peche/categories-permis-tarifs'),
        ('Кантон Женева — где можно без разрешения', 'https://www.ge.ch/permis-peche/conditions-pecher-sans-permis'),
        ('Кантон Женева — сертификат SaNa', 'https://www.ge.ch/permis-peche/attestation-competence-peche-sana'),
        ('Кантон Невшатель — правила рыбалки на Невшательском озере 2025–2027', 'https://www.ne.ch/sites/default/files/2025-11/Reglement%20p%C3%AAche%20lac%20NE.pdf'),
        ('Кантон Тичино — вопросы о рыбалке', 'https://www4.ti.ch/dt/da/ucp/temi/pesca/per-saperne-di-piu/domande-frequenti'),
        ('Кантоны Центральной Швейцарии — заявка и мойка лодок', 'https://umwelt-zentralschweiz.ch/schiffsreinigungspflicht'),
    ],
    terms=[('Deutsch', 'Fischerei, Angelfischerei, Fischereipatent, Tagespatent, Wochenpatent, Jahrespatent, Kurzzeitpatent, Freiangelrecht, Freiangelkarte, Sachkunde-Nachweis (SaNa), Pachtrevier, Fischereiaufsicht, Fangstatistik, Schonzeit, Fangmindestmass, Fanglimite, Widerhaken, lebender Köderfisch, Naturköder, Zapfen, Schleppfischerei, Uferfischerei, Bootsfischerei, betäuben, töten, Fischtöter, Schongebiet, Schiffsreinigungspflicht, gebietsfremde Arten, Schwarzmundgrundel, Quaggamuschel'),
           ('Français', 'pêche, permis de pêche, permis journalier, permis annuel, permis de courte durée, pêche sans permis, attestation de compétence (SaNa), lot de pêche affermé, garde-pêche, statistique de pêche, période de protection, taille minimale de capture, quota journalier, ardillon, poisson d’appât vivant, appât naturel, flotteur, pêche à la traîne, pêche depuis la rive, étourdir, mettre à mort, assommoir, réserve de pêche, obligation de nettoyage des bateaux, espèces exotiques envahissantes, gobie à taches noires, moule quagga'),
           ('Italiano', 'pesca, patente di pesca, patente giornaliera, patente annuale, patente turistica, pesca senza patente, attestato di competenza (SaNa), riserva in affitto, guardapesca, statistica delle catture, periodo di divieto, misura minima, limite di cattura giornaliero, ardiglione, pesce esca vivo, esca naturale, galleggiante, pesca alla traina, pesca da riva, stordire, uccidere, zona di protezione, obbligo di pulizia delle barche, specie esotiche invasive, cozza quagga'),
           ('English', 'fishing, fishing licence, day licence, annual licence, short-term licence, free fishing from the shore, certificate of competence (SaNa), leased fishing area, fishing warden, catch record, closed season, minimum size, daily limit, barbed hook, live bait fish, natural bait, float, trolling, shore fishing, boat fishing, stun, kill, priest, boat cleaning obligation, invasive species, round goby, quagga mussel')],
)


JSG = 'https://www.fedlex.admin.ch/eli/cc/1988/506_506_506/de'
CHCH_JAGD = 'https://ch.ch/de/sicherheit-und-recht/jagd'
BAFU_JAGD = 'https://www.bafu.admin.ch/de/jagd'
OHOTA = dict(
    upd=UPD,
    kanton=['ohota'],
    h1='Охота в Швейцарии: <em>как стать охотником, оружие и что делать с дикими животными</em>',
    seo='Охота в Швейцарии: экзамен на охотника (Jagdprüfung), патент или угодья, оружие и что делать, если сбил косулю (Wildunfall)',
    desc='Охота в Швейцарии простыми словами на русском: охотиться можно только после экзамена кантона (Jagdprüfung), подготовка от года до трёх лет, сколько это стоит в разных кантонах, охота по патенту и в угодьях, Женева без охоты, обязательная страховка, оружие для иностранцев (Waffenerwerbsschein), наказания. И для всех: что делать, если сбил косулю на дороге (позвонить 117), нашёл детёныша дикого животного или встретил волка или медведя. По-немецки Jagd, Jagdprüfung, Jagdpatent, Wildunfall, по-французски chasse, examen de chasse, accident avec la faune, по-итальянски caccia, esame di caccia, incidente con la selvaggina.',
    lead='Охотиться в Швейцарии можно и тем, кто приехал недавно, но путь долгий: сначала курс и экзамен кантона, а подготовка длится от года до трёх лет. А если охотиться ты не собираешься, здесь полезное для каждого: что делать, если сбил косулю на дороге, нашёл детёныша в траве или встретил волка.',
    body='''
<nav class="toc" aria-label="Содержание"><b>В этой статье</b>
<ul>
  <li><a href="#razreshenie">Охотиться можно только с разрешением кантона</a></li>
  <li><a href="#sistemy">Патент или угодья</a></li>
  <li><a href="#ekzamen">Как стать охотником</a></li>
  <li><a href="#oruzhie">Оружие</a></li>
  <li><a href="#nakazaniya">Что будет за охоту без разрешения</a></li>
  <li><a href="#sezon">Сезон охоты и прогулки в лесу</a></li>
  <li><a href="#wildunfall">Если сбил дикое животное</a></li>
  <li><a href="#detenysh">Если нашёл раненое животное или детёныша</a></li>
  <li><a href="#volk">Волк, медведь и собаки у стада</a></li>
  <li><a href="#myaso">Мясо дичи</a></li>
</ul></nav>

<h2 id="razreshenie">Охотиться можно только с разрешением кантона</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Кто хочет охотиться, должен получить разрешение кантона (Jagdberechtigung). Его дают только тем, кто сдал экзамен кантона (<a href="''' + JSG + '''">закон об охоте JSG, ст. 4</a>). Своя земля права охотиться не даёт (<a href="''' + BAFU_JAGD + '''">BAFU</a>).</li>
  <li>Кантон может выдать разрешение на отдельные дни гостям-охотникам и тем, кто готовится к экзамену (<a href="''' + JSG + '''">JSG, ст. 4</a>). Подготовку к экзамену каждый кантон устраивает по-своему, она длится до трёх лет. Часть кантонов признаёт экзамены других кантонов (<a href="''' + CHCH_JAGD + '''">ch.ch</a>).</li>
  <li class="attn"><i class="wi"></i>В федеральных и кантональных заповедниках охотиться нельзя (<a href="''' + CHCH_JAGD + '''">ch.ch</a>).</li>
</ul>

<h2 id="sistemy">Патент или угодья</h2>
<ul class="ul">
  <li><b>Охота по патенту</b> (Patentjagd, chasse à patente, caccia a patente) — в кантонах Берн, Ури, Швиц, Обвальден, Нидвальден, Гларус, Цуг, Фрибур, оба Аппенцелля, Граубюнден, Тичино, Во, Вале, Невшатель и Юра. Охотник покупает патент кантона и может охотиться по всему кантону, кроме охраняемых зон, обычно несколько недель осенью (<a href="''' + BAFU_JAGD + '''">BAFU</a>). Патент для жителей кантона обычно дешевле: например, в Швице патент на крупную дичь стоит 600 франков для жителей и 2400 для приезжих (<a href="https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/jagd.html/8756-8758-8802-9447-9454-9460-10682">кантон Швиц</a>).</li>
  <li><b>Охота в угодьях</b> (Revierjagd, chasse affermée) — в кантонах Цюрих, Люцерн, Золотурн, оба Базеля, Шаффхаузен, Санкт-Галлен, Аргау и Тургау. Общины сдают право охоты обществам охотников (Jagdgesellschaft) в аренду, обычно на 8 лет. Охотиться можно членом или гостем такого общества (<a href="''' + BAFU_JAGD + '''">BAFU</a>). Например, в Цюрихе нынешний период аренды — 2025–2033 годы (<a href="https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdreviere.html">кантон Цюрих</a>).</li>
  <li><b>Женева</b> — кантон без охоты. Её отменили на народном голосовании в 1974 году, численность диких животных при необходимости регулируют профессиональные сотрудники кантона (<a href="https://www.ge.ch/cohabiter-avec-faune-sauvage/canton-sans-chasse">кантон Женева</a>).</li>
</ul>

<h2 id="ekzamen">Как стать охотником</h2>
<ul class="ul">
  <li>Курс и экзамен проводит кантон. Обычно это теория (дикие животные, лес, законы, гигиена мяса дичи), стрельба и практика в угодье. Многие кантоны берут за основу учебник «Jagen in der Schweiz» («Chasser en Suisse»). Экзамен сдают в кантоне, где хотят охотиться; часть кантонов признаёт экзамены других. Условия и сроки записи своего кантона смотри в блоке «Твой кантон» вверху.</li>
  <li><b>Кого допускают.</b> Возраст — обычно с 17–18 лет (<a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_Examen_chasse_2021.pdf">Во</a>, <a href="https://www.vs.ch/web/scpf/formation-jeunes-chasseurs">Вале</a>, <a href="https://www4.ti.ch/dt/da/ucp/temi/caccia/sportello/domanda-per-lottenimento-del-certificato-di-abilitazione-alla-caccia">Тичино</a>). Во многих кантонах нужна выписка из реестра судимостей. <i class="wi"></i>Есть ограничения по статусу: в Тичино на курс берут только граждан Швейцарии и иностранцев с пермитом C или B, а в Аппенцелле-Ауссерродене патент дают только гражданам Швейцарии и людям с пермитом C (<a href="https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-raum-und-wald/abteilung-natur-und-wildtiere/jagd/jagdpruefung/">кантон Аппенцелль-Ауссерроден</a>).</li>
  <li><b>Сколько длится и сколько стоит.</b> В Цюрихе после теории и стрельбы нужно не меньше двух лет быть кандидатом в цюрихском угодье (<a href="https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdausbildung-im-kanton-zuerich.html">кантон Цюрих</a>). В Во курс длится год или два и стоит около 1050 франков (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/chasse-1">кантон Во</a>), в Вале — два года и 750 франков, в Обвальдене — 15 месяцев, курс 900 и экзамен 400 франков (<a href="https://www.ow.ch/dienstleistungen/2163">кантон Обвальден</a>). В Санкт-Галлене курс 2027–2029 годов обойдётся примерно в 2200 франков без учебника и снаряжения (<a href="https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/jagdausbildung-2025/ausbildung-zur-jaegerin-jaeger.html">кантон Санкт-Галлен</a>). В Берне до экзамена нужно 80 часов работы по уходу за угодьями (Hegestunden), сам экзамен стоит 350 франков и 100 за стрельбище (<a href="https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/jagd/02%20Daten%20Jagdpr%C3%BCfung%202027%20de.pdf">кантон Берн</a>).</li>
  <li class="attn"><b>Сроки записи.</b> <i class="wi"></i>Курсы начинаются не каждый год, а мест мало. Например, в Во запись на следующий курс — до 31 октября 2026 года, в Золотурне — до 15 ноября 2026 года, в Тургау запись на курс 2027/28 откроется 2 ноября 2026 года и мест не больше 50 (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/chasse-1">Во</a>, <a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/jagen-im-kanton-so/jagdausbildung-jagdpruefung/">Золотурн</a>, <a href="https://jfv.tg.ch/jagd/jaegerpruefung.html/8712">Тургау</a>).</li>
  <li class="attn"><b>Страховка и меткость.</b> <i class="wi"></i>Каждый охотник обязан иметь страховку ответственности (Jagdhaftpflichtversicherung) не меньше чем на 2 миллиона франков (<a href="https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1988/517_517_517/20250201/de/pdf-a/fedlex-data-admin-ch-eli-cc-1988-517_517_517-20250201-de-pdf-a.pdf">постановление об охоте JSV, ст. 14</a>, <a href="''' + JSG + '''">JSG, ст. 16</a>). Меткость нужно регулярно подтверждать на стрельбище (Treffsicherheitsnachweis), в большинстве кантонов — каждый год (<a href="''' + CHCH_JAGD + '''">ch.ch</a>).</li>
  <li><b>Экзамен из другой страны.</b> Некоторые кантоны признают иностранные экзамены. Например, Берн признаёт экзамены Германии, Австрии, Италии и ещё ряда стран, если человек прожил в этой стране не меньше двух лет. Экзаменов Украины и России в этом списке нет (<a href="https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/jagd/Liste-anerkannten-Jagdpruefungen-DE.pdf">кантон Берн, список от 01.09.2026</a>).</li>
</ul>

<h2 id="oruzhie">Оружие</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Если у тебя нет швейцарского гражданства или пермита C, для покупки <b>любого</b> оружия, в том числе охотничьего ружья, нужно разрешение на покупку оружия (Waffenerwerbsschein, permis d’acquisition d’armes) — каждый раз заново. К заявлению прикладывают официальную справку из страны гражданства, что там тебе можно купить такое оружие (<a href="https://www.zh.ch/de/sicherheit-justiz/delikte-praevention/waffen.html">кантон Цюрих</a>, <a href="https://www.sg.ch/content/dam/sgch/sicherheit/kantonspolizei/waffen/Waffenerwerb%20durch%20Personen%20ohne%20Schweizer%20%20Staatsangeh%C3%B6rigkeit%20.pdf">кантон Санкт-Галлен</a>).</li>
  <li class="attn"><i class="wi"></i>Граждане Сербии, Боснии и Герцеговины, Косово, Северной Македонии, Турции, Шри-Ланки, Алжира и Албании не могут в Швейцарии покупать, иметь и носить оружие (<a href="https://www.zh.ch/de/sicherheit-justiz/delikte-praevention/waffen.html">кантон Цюрих</a>). Украины и России в этом списке нет.</li>
  <li class="attn"><i class="wi"></i>Оружие перевозят только незаряженным: патронов не должно быть ни в оружии, ни в магазинах (<a href="https://www.zh.ch/de/sicherheit-justiz/delikte-praevention/waffen.html">кантон Цюрих</a>).</li>
  <li><b>Своё ружьё из-за границы.</b> Охотнику из страны Шенгенского пространства, который едет на охоту в Швейцарию, достаточно Европейского паспорта огнестрельного оружия и приглашения на охоту (<a href="https://www.ejpd.admin.ch/fedpol/en/home/sicherheit/waffen/einfuhr.html">fedpol</a>). <i class="wi"></i>Чтобы ввезти ружьё насовсем, например при переезде, нужно разрешение федеральной полиции fedpol и разрешение на покупку оружия своего кантона, оружие декларируют на таможне и потом маркируют (<a href="https://www.ejpd.admin.ch/fedpol/en/home/sicherheit/waffen/einfuhr.html">fedpol</a>).</li>
</ul>

<h2 id="nakazaniya">Что будет за охоту без разрешения</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Охота без разрешения — преступление. Кто нарочно охотится без права или убивает дикое животное, тому грозит до года лишения свободы или денежное наказание (<a href="''' + JSG + '''">JSG, ст. 17</a>). За более лёгкие нарушения, например если на охоте нет при себе нужных документов, — штраф до 20 000 франков (<a href="''' + JSG + '''">JSG, ст. 18</a>). Суд может запретить человеку охотиться на срок от 1 года до 10 лет по всей Швейцарии (<a href="''' + JSG + '''">JSG, ст. 20</a>). Приговор может повлиять и на пермит — подробно в теме «<a href="../shtrafy/">Штрафы и полиция</a>».</li>
  <li>Закон об охоте пересмотрели в 2022 году. Правила о регулировании волков действуют с декабря 2023 года, остальные новые правила и новое постановление об охоте — с 1 февраля 2025 года (<a href="https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1988/506_506_506/20250201/de/pdf-a/fedlex-data-admin-ch-eli-cc-1988-506_506_506-20250201-de-pdf-a.pdf">JSG, редакция от 01.02.2025</a>).</li>
</ul>

<h2 id="sezon">Сезон охоты и прогулки в лесу</h2>
<ul class="ul">
  <li>Сроки охоты задаёт федеральный закон, а кантоны их сокращают. Охота по патенту обычно идёт несколько недель осенью, на отдельных животных — дольше. Например, во Фрибуре сезон 2026/27 длится с 1 сентября 2026 года по 28 февраля 2027 года (<a href="https://www.fr.ch/diaf/sfn/chasse">кантон Фрибур</a>).</li>
  <li>Охотники обязаны соблюдать правила безопасности: в ряде кантонов на охоте они носят яркую сигнальную одежду, а стрелять в сторону людей, домов, дорог и тропинок нельзя (<a href="https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/jagd.html/8756-8758-8802-9447-9454-9460-10682">кантон Швиц</a>, <a href="https://www4.ti.ch/dt/da/ucp/temi/caccia">кантон Тичино</a>).</li>
  <li>Осенью гуляй по тропам, особенно с собакой, и держи собаку рядом. Если видишь охотников в ярких жилетах или слышишь выстрелы, оставайся на тропе и дай о себе знать голосом.</li>
</ul>

<h2 id="wildunfall">Если сбил дикое животное</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i><b>Сразу звони в полицию по номеру 117</b>, даже если животное убежало или кажется целым. Так требует закон о дорожном движении: о каждом столкновении с животным нужно без промедления сообщить полиции (<a href="https://www.fedlex.admin.ch/eli/cc/1959/679_705_685/de#art_51">SVG, ст. 51</a>, <a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/">кантон Золотурн</a>). Кто уезжает, не сообщив, совершает наказуемое нарушение (<a href="https://www.zh.ch/de/umwelt-tiere/tiere/jagd/umgang-mit-wildtieren-im-siedlungsraum.html">кантон Цюрих</a>). Раненое животное прячется и может мучиться несколько дней, поэтому полиция вызывает охотника или егеря, чтобы его найти.</li>
  <li><b>Что делать на месте.</b> Остановись, включи аварийку, надень светоотражающий жилет и поставь знак аварийной остановки. Запомни, куда убежало животное. К раненому животному не подходи и не трогай его: оно может сильно поранить. Дождись полиции или егеря — они выдадут подтверждение для страховки (<a href="https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/wildtiere.html">кантон Санкт-Галлен</a>, <a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/">кантон Золотурн</a>).</li>
  <li class="attn"><i class="wi"></i><b>Мёртвое животное себе не забирай</b> — это считается браконьерством (<a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/">кантон Золотурн</a>). Только в некоторых кантонах, например в Во, водителю могут отдать сбитое животное, и только после рапорта и осмотра (<a href="https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_gibier_p%C3%A9ri_VFINALE_2019.04.16.pdf">кантон Во</a>).</li>
  <li>Ремонт машины обычно оплачивает каско (Teilkasko или Vollkasko), если оно у тебя есть. Для страховой нужно подтверждение полиции или егеря (<a href="https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/">кантон Золотурн</a>). Условия смотри в своём договоре страховки.</li>
</ul>

<h2 id="detenysh">Если нашёл раненое животное или детёныша</h2>
<ul class="ul">
  <li>Детёныш, который лежит один в траве или в лесу, чаще всего не брошен: мать рядом и вернётся. Не трогай его и не уноси, а лучше уйди и понаблюдай издалека. Помощь нужна только явно раненым и страдающим животным (<a href="https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/wildtiere.html/8756-8758-8802-9447-9454-9460-10683">кантон Швиц</a>, <a href="https://www.ge.ch/cohabiter-avec-faune-sauvage/oisillons-animaux-sauvages-morts-detresse">кантон Женева</a>). Птенец на земле — тоже часто норма.</li>
  <li class="attn"><i class="wi"></i>Если животное ранено или ему грозит опасность, не забирай его домой, а звони в полицию по номеру 117 или егерю (Wildhut, garde-faune) своего кантона. Мёртвое животное не трогай голыми руками (<a href="https://www.ge.ch/cohabiter-avec-faune-sauvage/oisillons-animaux-sauvages-morts-detresse">кантон Женева</a>). Держать диких животных у себя без разрешения нельзя.</li>
  <li>Если у тебя луг, который весной косят, косулят перед покосом можно найти дроном с тепловизором. В Цуге это бесплатно, участок нужно заранее заявить в кантональное ведомство леса и диких животных (<a href="https://zg.ch/de/natur-umwelt-tiere/arten-und-lebensraeume/wildtierunfaelle">кантон Цуг</a>).</li>
</ul>

<h2 id="volk">Волк, медведь и собаки у стада</h2>
<ul class="ul">
  <li><b>Волк</b> — охраняемое животное. На 1 февраля 2026 года в Швейцарии жили 30 волчьих стай, ещё 10 — на границе с соседними странами (<a href="https://www.bafu.admin.ch/de/wolf">BAFU</a>). Регулировать стаи кантоны могут только с согласия BAFU и в определённые сроки (<a href="''' + JSG + '''">JSG, ст. 7a</a>). С тех пор как волк вернулся в Швейцарию, нападений на людей не было (<a href="https://lawa.lu.ch/jagd/Konflikte_mit_Wildtieren/Wolf">кантон Люцерн</a>).</li>
  <li class="attn"><b>Если встретил волка</b>, остановись и не беги. Если он тебя не заметил, хлопни в ладоши или скажи что-нибудь. Уходи медленно. Если волк идёт следом, шуми и сделай шаг к нему. <i class="wi"></i>Собаку держи на поводке, волков не корми и не преследуй. О встрече сообщи егерю (<a href="https://so.ch/fileadmin/internet/vwd/vwd-awjf-jagd/pdf/Wildtiere_pdf_HP_neu/Flyer___Begegnungen_mit_dem_Wolf__.pdf">памятка KORA на сайте кантона Золотурн</a>).</li>
  <li class="attn"><b>Медведь</b> иногда заходит в Швейцарию из Италии, но не остаётся. Если встретил медведя, остановись и громко говори, чтобы он тебя заметил. Не подходи и не убегай, а медленно отходи. <i class="wi"></i>Никогда не корми медведя (<a href="https://www.bafu.admin.ch/de/braunbaer">BAFU</a>).</li>
  <li><b>Собаки, которые охраняют стадо</b> (Herdenschutzhunde), летом встречаются на горных пастбищах. Успокойся, держись подальше от стада, свою собаку возьми на поводок и обойди стадо по широкой дуге или поверни назад (<a href="https://ur.ch/_doc/164855">кантон Ури</a>).</li>
</ul>

<h2 id="myaso">Мясо дичи</h2>
<ul class="ul">
  <li>Продавать можно только безупречное мясо дичи, и происхождение каждой туши должно прослеживаться. Охотник передаёт дичь покупателю или мастерской вместе с сопроводительным документом, а если на туше есть отклонения, мясо сначала официально проверяют (<a href="https://www.zh.ch/de/umwelt-tiere/tiere/jagd/fachinformationen-jagdberechtigte.html">кантон Цюрих</a>, <a href="https://www.ne.ch/sites/default/files/2025-11/Formulaire_examen_sanitaire_gibier.pdf">кантон Невшатель</a>).</li>
  <li>Дичь из стран вне ЕС ввозить нельзя. Из ЕС, Норвегии и Исландии для себя можно без ограничения количества, но с учётом лимитов по НДС (<a href="https://www.bazg.admin.ch/de/jagdreisen-ins-ausland-waffen-wildfleisch-trophaeen">BAZG</a>). Подробно — в теме «<a href="../tamozhnya/">Таможня и посылки</a>».</li>
</ul>
''',
    steps=[
        'Сохрани в телефоне номер полиции 117: он нужен, если сбил дикое животное, даже если оно убежало.',
        'Если нашёл детёныша дикого животного, не трогай его и понаблюдай издалека. Раненое животное — звони 117 или егерю.',
        'При встрече с волком или медведем не беги, а медленно отходи. Собаку держи на поводке.',
        'Если хочешь охотиться, выбери вверху свой кантон, открой страницу об экзамене и запишись на курс заранее: мест мало, курсы начинаются не каждый год.',
        'Если у тебя нет пермита C, до покупки ружья узнай в кантональной полиции, какие документы нужны для разрешения на покупку оружия.',
    ],
    tools={'ekstrennye-nomera': 'Полиция 117, скорая помощь 144, Rega 1414 и дежурный врач твоего кантона — на одной карточке в машину и в рюкзак.'},
    tabs={},
    related=['rybalka-griby-ohota', 'priroda', 'transport', 'shtrafy'],
    sources=[
        ('Закон об охоте (JSG), ст. 4, 7a, 15–20', JSG),
        ('Закон об охоте (JSG), редакция от 01.02.2025 (PDF)', 'https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1988/506_506_506/20250201/de/pdf-a/fedlex-data-admin-ch-eli-cc-1988-506_506_506-20250201-de-pdf-a.pdf'),
        ('Постановление об охоте (JSV), ст. 2 и 14, редакция от 01.02.2025 (PDF)', 'https://www.fedlex.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1988/517_517_517/20250201/de/pdf-a/fedlex-data-admin-ch-eli-cc-1988-517_517_517-20250201-de-pdf-a.pdf'),
        ('Закон о дорожном движении (SVG), ст. 51', 'https://www.fedlex.admin.ch/eli/cc/1959/679_705_685/de#art_51'),
        ('ch.ch — охота', CHCH_JAGD),
        ('BAFU — охота', BAFU_JAGD),
        ('BAFU — волк', 'https://www.bafu.admin.ch/de/wolf'),
        ('BAFU — бурый медведь', 'https://www.bafu.admin.ch/de/braunbaer'),
        ('Кантон Женева — кантон без охоты', 'https://www.ge.ch/cohabiter-avec-faune-sauvage/canton-sans-chasse'),
        ('Кантон Женева — птенцы, раненые и мёртвые дикие животные', 'https://www.ge.ch/cohabiter-avec-faune-sauvage/oisillons-animaux-sauvages-morts-detresse'),
        ('Кантон Цюрих — охотничьи угодья', 'https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdreviere.html'),
        ('Кантон Цюрих — подготовка охотников', 'https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdausbildung-im-kanton-zuerich.html'),
        ('Кантон Цюрих — дикие животные рядом с домом и столкновения на дороге', 'https://www.zh.ch/de/umwelt-tiere/tiere/jagd/umgang-mit-wildtieren-im-siedlungsraum.html'),
        ('Кантон Цюрих — информация для охотников (мясо дичи)', 'https://www.zh.ch/de/umwelt-tiere/tiere/jagd/fachinformationen-jagdberechtigte.html'),
        ('Кантон Цюрих — оружие', 'https://www.zh.ch/de/sicherheit-justiz/delikte-praevention/waffen.html'),
        ('Кантон Санкт-Галлен — покупка оружия без швейцарского гражданства', 'https://www.sg.ch/content/dam/sgch/sicherheit/kantonspolizei/waffen/Waffenerwerb%20durch%20Personen%20ohne%20Schweizer%20%20Staatsangeh%C3%B6rigkeit%20.pdf'),
        ('fedpol — ввоз оружия', 'https://www.ejpd.admin.ch/fedpol/en/home/sicherheit/waffen/einfuhr.html'),
        ('Кантон Санкт-Галлен — подготовка охотников', 'https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/jagdausbildung-2025/ausbildung-zur-jaegerin-jaeger.html'),
        ('Кантон Санкт-Галлен — дикие животные и столкновения на дороге', 'https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/wildtiere.html'),
        ('Кантон Берн — даты экзамена на охотника 2027', 'https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/jagd/02%20Daten%20Jagdpr%C3%BCfung%202027%20de.pdf'),
        ('Кантон Берн — признанные иностранные экзамены, 01.09.2026', 'https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/jagd/Liste-anerkannten-Jagdpruefungen-DE.pdf'),
        ('Кантон Во — охота', 'https://www.vd.ch/environnement/biodiversite-et-paysage/chasse-1'),
        ('Кантон Во — правила экзамена на охотника, 2021', 'https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_Examen_chasse_2021.pdf'),
        ('Кантон Во — сбитые и павшие дикие животные, 2019', 'https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_gibier_p%C3%A9ri_VFINALE_2019.04.16.pdf'),
        ('Кантон Вале — подготовка молодых охотников', 'https://www.vs.ch/web/scpf/formation-jeunes-chasseurs'),
        ('Кантон Тичино — охота', 'https://www4.ti.ch/dt/da/ucp/temi/caccia'),
        ('Кантон Тичино — допуск к экзамену на охотника', 'https://www4.ti.ch/dt/da/ucp/temi/caccia/sportello/domanda-per-lottenimento-del-certificato-di-abilitazione-alla-caccia'),
        ('Кантон Обвальден — экзамен на охотника', 'https://www.ow.ch/dienstleistungen/2163'),
        ('Кантон Аппенцелль-Ауссерроден — экзамен на охотника', 'https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-raum-und-wald/abteilung-natur-und-wildtiere/jagd/jagdpruefung/'),
        ('Кантон Швиц — охота', 'https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/jagd.html/8756-8758-8802-9447-9454-9460-10682'),
        ('Кантон Швиц — дикие животные', 'https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/wildtiere.html/8756-8758-8802-9447-9454-9460-10683'),
        ('Кантон Золотурн — подготовка и экзамен', 'https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/jagen-im-kanton-so/jagdausbildung-jagdpruefung/'),
        ('Кантон Золотурн — столкновения с дикими животными', 'https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/'),
        ('Кантон Золотурн — памятка KORA «Встреча с волком»', 'https://so.ch/fileadmin/internet/vwd/vwd-awjf-jagd/pdf/Wildtiere_pdf_HP_neu/Flyer___Begegnungen_mit_dem_Wolf__.pdf'),
        ('Кантон Тургау — экзамен на охотника', 'https://jfv.tg.ch/jagd/jaegerpruefung.html/8712'),
        ('Кантон Фрибур — охота', 'https://www.fr.ch/diaf/sfn/chasse'),
        ('Кантон Люцерн — волк', 'https://lawa.lu.ch/jagd/Konflikte_mit_Wildtieren/Wolf'),
        ('Кантон Цуг — дикие животные и дорога, спасение косулят', 'https://zg.ch/de/natur-umwelt-tiere/arten-und-lebensraeume/wildtierunfaelle'),
        ('Кантон Ури — собаки, охраняющие стадо', 'https://ur.ch/_doc/164855'),
        ('Кантон Невшатель — проверка мяса дичи', 'https://www.ne.ch/sites/default/files/2025-11/Formulaire_examen_sanitaire_gibier.pdf'),
        ('BAZG — охота за границей: оружие, мясо дичи, трофеи', 'https://www.bazg.admin.ch/de/jagdreisen-ins-ausland-waffen-wildfleisch-trophaeen'),
    ],
    terms=[('Deutsch', 'Jagd, Jagdberechtigung, Jagdprüfung, Jagdfähigkeitsausweis, Jagdlehrgang, Hegestunden, Patentjagd, Jagdpatent, Revierjagd, Jagdrevier, Jagdgesellschaft, Gästekarte, Wildhut, Jagdhaftpflichtversicherung, Treffsicherheitsnachweis, Waffenerwerbsschein, Europäischer Feuerwaffenpass, Jagdzeit, Schonzeit, Signalbekleidung, Wildunfall, Fallwild, Nachsuche, Wilderei, Jagdbanngebiet, Wildruhezone, Rehkitz, Herdenschutzhund, Wildfleisch'),
           ('Français', 'chasse, autorisation de chasser, examen de chasse, certificat d’aptitude, formation des candidats chasseurs, chasse à patente, permis de chasse, chasse affermée, société de chasse, permis d’invité, garde-faune, assurance responsabilité civile, attestation de sûreté du tir, permis d’acquisition d’armes, carte européenne d’arme à feu, période de chasse, accident avec la faune, gibier péri, recherche au sang, braconnage, district franc fédéral, faon, chien de protection des troupeaux, viande de gibier'),
           ('Italiano', 'caccia, autorizzazione di caccia, esame di caccia, certificato di abilitazione alla caccia, caccia a patente, patente di caccia, caccia in riserva, società di caccia, permesso per ospiti, guardiacaccia, assicurazione RC, prova di tiro, permesso d’acquisto di armi, carta europea d’arma da fuoco, periodo di caccia, incidente con la selvaggina, selvaggina perita, bracconaggio, bandita federale di caccia, piccolo di capriolo, cane da protezione del bestiame, carne di selvaggina'),
           ('English', 'hunting, hunting licence, hunting exam, licence hunting, district hunting, hunting association, guest permit, game warden, hunter liability insurance, shooting proficiency test, weapon acquisition permit, European Firearms Pass, hunting season, collision with wildlife, poaching, federal game reserve, fawn, livestock guardian dog, game meat')],
)


VAPKO_FIND = 'https://www.vapko.ch/index.php/de/eine-pilzkontrollstelle-finden'
GRIBY = dict(
    upd=UPD,
    kanton=['griby'],
    h1='Грибы в Швейцарии: <em>сколько можно собрать, дни запрета и грибной контроль</em>',
    seo='Грибы в Швейцарии: сколько можно собрать в твоём кантоне, дни запрета и бесплатный грибной контроль (Pilzkontrolle)',
    desc='Грибы в Швейцарии простыми словами на русском: сколько можно собрать в каждом кантоне (1, 2 или 3 кг в день), где нельзя собирать с 1 по 10 число, в какие часы можно, охраняемые грибы, бесплатный грибной контроль и как найти ближайший пункт, что делать при отравлении (Tox Info 145), можно ли продавать грибы. По-немецки Pilze sammeln, Pilzkontrolle, Schontage, Pilzschutz, по-французски cueillette des champignons, contrôle des champignons, по-итальянски raccolta di funghi, controllo dei funghi.',
    lead='Собирать грибы в Швейцарии можно, но в каждом кантоне свои правила: где-то не больше килограмма в день, где-то с 1 по 10 число собирать нельзя совсем. И одно правило для всех: каждую корзину покажи на бесплатном грибном контроле, прежде чем готовить. Выбери свой кантон — и увидишь его правила.',
    body='''
<nav class="toc" aria-label="Содержание"><b>В этой статье</b>
<ul>
  <li><a href="#kto">Кто устанавливает правила</a></li>
  <li><a href="#limity">Сколько и когда можно: примеры кантонов</a></li>
  <li><a href="#nelzya">Что нельзя почти везде</a></li>
  <li><a href="#kontrol">Бесплатный грибной контроль</a></li>
  <li><a href="#otravlenie">Если отравился грибами</a></li>
  <li><a href="#kak">Как собирать и хранить</a></li>
  <li><a href="#prodazha">Можно ли продавать грибы</a></li>
</ul></nav>

<h2 id="kto">Кто устанавливает правила</h2>
<ul class="ul">
  <li>В лес может зайти каждый, и дикие грибы там можно собирать в обычном для этой местности количестве (<a href="https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699">ZGB, ст. 699</a>). Единого закона о грибах на всю Швейцарию нет.</li>
  <li>Сколько и когда можно собирать, решает кантон своими правилами об охране природы. В некоторых кантонах, например в Санкт-Галлене, правила вводят общины (<a href="https://www.sg.ch/umwelt-natur/natur-landschaft/biodiversitaet/artenvielfalt/pilze.html">кантон Санкт-Галлен</a>). Поэтому в соседнем кантоне правила могут быть совсем другими.</li>
  <li>Сводная таблица правил всех кантонов и общин — у объединения официальных грибных контролёров VAPKO (<a href="https://www.vapko.ch/index.php/de/oekologie/kantonale-und-kommunale-pilzsammelbestimmungen">VAPKO, версия 08.02.2026</a>). Правила твоего кантона — в блоке «Твой кантон» вверху этой страницы.</li>
</ul>

<h2 id="limity">Сколько и когда можно: примеры кантонов</h2>
<ul class="ul">
  <li class="attn"><b>Нельзя с 1 по 10 число каждого месяца.</b> <i class="wi"></i>В Цюрихе в остальные дни можно собрать не больше 1 кг на человека в день, за нарушение — штраф до 1000 франков (<a href="https://www.zh.ch/de/news-uebersicht/mitteilungen/2025/gesundheit/lebensmittel/pilze-sicher-geniessen.html">кантон Цюрих</a>). В Граубюндене и Гларусе — не больше 2 кг (<a href="https://www.gr-lex.gr.ch/api/de/versions/3456/pdf_file">Граубюнден, KNHV ст. 12</a>, <a href="https://gl.lexwork.naz.ch/de/dta/IV-G.3.3.pdf">Гларус</a>). В Граубюндене ещё нельзя ходить за грибами группой больше трёх человек, если вы не одна семья, и пользоваться граблями и похожими инструментами. Те же дни запрета действуют во многих общинах на юге Санкт-Галлена.</li>
  <li class="attn"><b>Нельзя с 1 по 7 число.</b> <i class="wi"></i>В Люцерне можно собрать не больше 2 кг, из них сморчков и лисичек вместе — не больше 0,5 кг; штраф — до 2000 франков (<a href="https://srl.lu.ch/api/de/versions/418/pdf_file">Люцерн, постановление об охране грибов</a>). В Обвальдене — не больше 2 кг, сморчков не больше 500 г, и только при дневном свете (<a href="https://gdb.ow.ch/frontend/versions/165/download_pdf_file">Обвальден</a>).</li>
  <li><b>Можно каждый день, но только днём.</b> В Во и во Фрибуре — с 7 до 20 часов, не больше 2 кг (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/recolte-des-champignons">Во</a>, <a href="https://www.fr.ch/energie-agriculture-et-environnement/faune-et-biodiversite/champignons">Фрибур</a>). В Во прежний запрет с 1 по 7 число отменили с 1 января 2025 года. В Тичино — не больше 3 кг, нельзя с 20 до 7 часов, грабли и совки запрещены, штраф — до 10 000 франков (<a href="https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/553">закон Тичино о сборе грибов</a>).</li>
  <li><b>Без дней запрета, но с лимитом.</b> В Берне — 2 кг на человека в день, дней запрета нет с 2012 года (<a href="https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file">Берн, NSchV ст. 23</a>). В Швице — 2 кг, сморчков не больше 1 кг (<a href="https://www.sz.ch/umweltdepartement/amt-fuer-wald-und-natur/natur-und-landschaft/artenschutz/pilz-und-beerensammeln.html/8756-8758-8802-9447-9454-9459-10665-10668/print/html">Швиц</a>). В Нидвальдене и Тургау — 1 кг (<a href="https://www.nw.ch/fsnaturlandschaftdienste/8086">Нидвальден</a>, <a href="https://raumentwicklung.tg.ch/themen/natur/pilze.html/4229">Тургау</a>). В Юре с 1 января 2026 года — 3 кг всех грибов вместе (<a href="https://rsju.jura.ch/fr/viewdocument.html?idn=20085&amp;id=39311&amp;download=1">Юра</a>).</li>
  <li><b>Без своих цифр.</b> В Аргау, Цуге, Золотурне, обоих Базелях, Вале и Невшателе кантон не задаёт количество, действует общее правило — в обычном для местности количестве (<a href="https://www.ag.ch/de/themen/umwelt-natur/wald/erholungsraum-wald/sammeln-von-beeren-pilzen-und-holz">Аргау</a>, <a href="https://www.vapko.ch/index.php/de/oekologie/kantonale-und-kommunale-pilzsammelbestimmungen">VAPKO</a>). Разумно ориентироваться на 1–2 кг, как в соседних кантонах.</li>
  <li class="attn">Лимит считают на человека, а не на семью. В Обвальдене, например, дети до 12 лет собирают только вместе со взрослым и в счёт его нормы. <i class="wi"></i>За лишние килограммы во многих кантонах грибы забирают и выписывают штраф.</li>
</ul>

<h2 id="nelzya">Что нельзя почти везде</h2>
<ul class="ul">
  <li class="attn"><b>Заповедники.</b> <i class="wi"></i>В заповедниках грибы собирать нельзя, а в Швейцарском национальном парке нельзя собирать и повреждать никакие растения и грибы (<a href="https://www.vapko.ch/index.php/de/oekologie/kantonale-und-kommunale-pilzsammelbestimmungen">VAPKO</a>, <a href="https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file">правила национального парка</a>).</li>
  <li class="attn"><b>Охраняемые грибы.</b> <i class="wi"></i>12 видов грибов охраняются по всей Швейцарии, их собирать нельзя нигде, например королевский боровик (Königsröhrling) и рядовка ряженая (Krokodil-Ritterling) (<a href="https://www.fedlex.admin.ch/eli/cc/1991/249_249_249/de#art_20">NHV, ст. 20 и приложение 2</a>, <a href="https://www.vapko.ch/de/oekologie/geschutzte-pilze-in-der-schweiz">список VAPKO</a>). В Тургау и Во нельзя собирать и грибы из Красного списка (<a href="https://raumentwicklung.tg.ch/themen/natur/pilze.html/4229">Тургау</a>, <a href="https://www.vd.ch/environnement/biodiversite-et-paysage/recolte-des-champignons">Во</a>).</li>
  <li><b>Инструменты и порча.</b> Грабли, мотыги и совки, которые портят лесную почву, во многих кантонах запрещены. Несъедобные и ядовитые грибы не сбивай и не топчи: они нужны лесу, а в некоторых кантонах нарочно портить грибы запрещено законом (<a href="https://www.gr-lex.gr.ch/api/de/versions/3456/pdf_file">Граубюнден</a>, <a href="https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/553">Тичино</a>).</li>
  <li><b>Организованные сборы.</b> «Грибные походы» группой ради урожая во многих кантонах запрещены, разрешены только учебные экскурсии клубов и школ (<a href="https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file">Берн, NSchV ст. 23</a>, <a href="https://srl.lu.ch/api/de/versions/418/pdf_file">Люцерн</a>).</li>
</ul>

<h2 id="kontrol">Бесплатный грибной контроль</h2>
<ul class="ul">
  <li><b>Грибной контроль</b> (Pilzkontrolle, contrôle des champignons, controllo dei funghi) — это пункт, где официальный контролёр проверяет каждый гриб из твоей корзины и откладывает несъедобные и ядовитые. Обычно это бесплатно. Федеральное ведомство безопасности пищевых продуктов BLV советует показывать на контроле <b>все</b> собранные грибы (<a href="https://www.blv.admin.ch/dam/de/sd-web/KfZiCQXXccw6/merkblatt-pilze-de.pdf">BLV</a>).</li>
  <li>Это не формальность. В Цюрихе контролёры отбраковывают примерно 15 % принесённых грибов как несъедобные или испорченные, а около 3 % оказываются ядовитыми, в том числе смертельно (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/gesundheit/lebensmittelkontrollen/MD-00134.pdf">памятка кантона Цюрих, 2026</a>).</li>
  <li><b>Как найти пункт.</b> Ближайший пункт можно найти на сайте VAPKO по названию общины (<a href="https://www.vapko.ch/index.php/de/eine-pilzkontrollstelle-finden">поиск VAPKO</a>). В Цюрихе каждая община обязана дать жителям возможность проверить грибы, и в памятке кантона написано, какой пункт отвечает за твою общину (<a href="https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/gesundheit/lebensmittelkontrollen/MD-00134.pdf">кантон Цюрих</a>). Во Фрибуре — 13 пунктов (<a href="https://www.fr.ch/document/50976">кантон Фрибур</a>).</li>
  <li class="attn"><i class="wi"></i>Многие пункты работают примерно с начала августа до середины ноября и только в определённые часы, а некоторые закрыты в дни запрета сбора. Перед походом посмотри часы своего пункта. В кантоне Швиц своих пунктов не осталось, грибы проверяют в соседних кантонах (<a href="https://www.srf.ch/radio-srf-1/start-der-pilzsaison-essbar-oder-giftig-verband-fordert-mehr-pilzkontrollstellen">SRF, 28.08.2025</a>).</li>
  <li>На контроль приноси грибы целыми, разложенными по видам, в корзине. Незнакомые грибы возьми 2–3 штуки для определения и положи отдельно (<a href="https://www.vapko.ch/index.php/de/fragen-rund-um-pilze/empfehlungen-fur-das-pilzsammeln">VAPKO</a>).</li>
</ul>

<h2 id="otravlenie">Если отравился грибами</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i><b>Если после грибов стало плохо</b>, сразу звони в токсикологический центр <a href="https://www.toxinfo.ch">Tox Info Suisse</a> по номеру <b>145</b>, круглосуточно и бесплатно, из-за границы — +41 44 251 51 51. Если человек теряет сознание или ему очень плохо, звони в скорую помощь по номеру <b>144</b>. Остатки грибов и блюда сохрани: по ним определят гриб.</li>
  <li class="attn"><i class="wi"></i>Признаки отравления самым опасным грибом — бледной поганкой (Grüner Knollenblätterpilz) — появляются только через 6–24 часа, когда яд уже действует. Её яд не разрушается ни при варке, ни при сушке, ни при заморозке. «Проверка серебряной ложкой или луком» и правило «если грибы погрызли улитки, их можно есть» — мифы. Надёжно определить гриб может только официальный контролёр (<a href="https://www.toxinfo.ch/ammenmaerchen_pilze_blog">Tox Info Suisse, июль 2026</a>).</li>
  <li>В 2025 году в Tox Info Suisse обратились из-за грибов в 674 случаях, из них 227 — с детьми; тяжёлых отравлений среди случаев с отзывом врача было пять. Даже сморчки из магазина в редких случаях вызывали тяжёлые отравления (<a href="https://www.toxinfo.ch/customer/files/1241/977_012601-Tox-Jahresbericht-2025-DE-Web-150dpi.pdf">годовой отчёт Tox Info Suisse за 2025 год</a>).</li>
  <li class="attn"><i class="wi"></i>Не угощай других грибами, которые не проверял контролёр, и не подавай гостям блюдо из непроверенных грибов (<a href="https://www.bern.ch/themen/gesundheit-alter-und-soziales/gesundheitsvorsorge/pilzkontrolle/downloads/merkblatt-pilzesammeln.pdf/download">город Берн</a>). Не полагайся на советы знакомых и на свой опыт с родины: в Швейцарии растут и похожие, но ядовитые виды.</li>
</ul>

<h2 id="kak">Как собирать и хранить</h2>
<ul class="ul">
  <li>Собирай только грибы, которые точно знаешь. Срывай руками и аккуратно, молодые грибы оставь расти.</li>
  <li>Неси грибы в открытой корзине, а не в пластиковом пакете: в пакете они быстро портятся. Сырыми грибы не ешь (<a href="https://www.blv.admin.ch/dam/de/sd-web/KfZiCQXXccw6/merkblatt-pilze-de.pdf">BLV</a>).</li>
  <li>Свежие грибы готовь и ешь быстро. Остатки готового блюда ненадолго убери в холодильник и потом хорошо разогрей (<a href="https://www.blv.admin.ch/dam/de/sd-web/KfZiCQXXccw6/merkblatt-pilze-de.pdf">BLV</a>).</li>
  <li>Грибы с земли мой, а лучше хорошо проваривай: так советует Федеральное ведомство здравоохранения из-за лисьего цепня (<a href="https://www.bag.admin.ch/de/fuchsbandwurm-echinokokkose">BAG</a>).</li>
</ul>

<h2 id="prodazha">Можно ли продавать грибы</h2>
<ul class="ul">
  <li class="attn"><i class="wi"></i>Собирать грибы на продажу можно только там, где кантон это разрешает, и только с его разрешением. Например, в Берне такое разрешение стоит 150 франков в год и позволяет собирать до 6 кг в день, а каждую продажу нужно записывать (<a href="https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/umwelt/naturschutz/Merkblatt_Pilze_D.pdf">кантон Берн</a>). В Во нужно ещё пройти курс VAPKO (<a href="https://www.vd.ch/environnement/biodiversite-et-paysage/recolte-des-champignons">кантон Во</a>). В Люцерне и Обвальдене собирать грибы на продажу запрещено.</li>
  <li>Кто продаёт грибы, угощает ими в ресторане или на заказ, отвечает за то, что они безопасны, — это правило о продуктах питания. Грибы для торговли должен проверить квалифицированный грибной специалист (<a href="https://www.vapko.ch/index.php/de/der-pilzhandel/merkblatt-betreffend-die-vermarktung-und-die-kontrolle-von-wild-gewachsenen-speisepilzen">памятка VAPKO</a>, <a href="https://www.blv.admin.ch/de/speisepilze">BLV</a>). Подробнее о еде на продажу — в теме «<a href="../professii-dom/">Уборка, кейтеринг, домашняя кухня</a>».</li>
</ul>
''',
    steps=[
        'Перед походом за грибами выбери вверху свой кантон и посмотри лимит и дни запрета. Если идёшь в соседний кантон, проверь и его правила.',
        'Найди ближайший пункт грибного контроля на сайте VAPKO и посмотри часы работы.',
        'Собирай руками в открытую корзину, незнакомые грибы клади отдельно.',
        'Всю корзину покажи на грибном контроле, прежде чем готовить или угощать.',
        'Запиши в телефон номер Tox Info Suisse 145 и звони сразу, если после грибов стало плохо.',
    ],
    tools={'ekstrennye-nomera': 'Tox Info 145, скорая помощь 144, Rega 1414 и дежурный врач твоего кантона — на одной карточке в рюкзак.',
           'plan-pohoda': 'Идёшь за грибами в незнакомый лес — оставь близким маршрут и время возвращения на русском и языке кантона.'},
    tabs={'events': 'Прогулки и походы за грибами с группой на русском и украинском — во встречах рядом с тобой.'},
    related=['rybalka-griby-ohota', 'yagody-travy', 'priroda', 'bolezn-travma'],
    sources=[
        ('Гражданский кодекс (ZGB), ст. 699 — лес, ягоды и грибы', 'https://www.fedlex.admin.ch/eli/cc/24/233_245_233/de#art_699'),
        ('Постановление об охране природы (NHV), ст. 20 и приложение 2 — охраняемые грибы', 'https://www.fedlex.admin.ch/eli/cc/1991/249_249_249/de#art_20'),
        ('VAPKO — правила сбора грибов в кантонах и общинах, версия 08.02.2026', 'https://www.vapko.ch/index.php/de/oekologie/kantonale-und-kommunale-pilzsammelbestimmungen'),
        ('VAPKO — охраняемые грибы в Швейцарии', 'https://www.vapko.ch/de/oekologie/geschutzte-pilze-in-der-schweiz'),
        ('VAPKO — найти пункт грибного контроля', VAPKO_FIND),
        ('VAPKO — советы грибникам', 'https://www.vapko.ch/index.php/de/fragen-rund-um-pilze/empfehlungen-fur-das-pilzsammeln'),
        ('VAPKO — памятка о продаже диких грибов', 'https://www.vapko.ch/index.php/de/der-pilzhandel/merkblatt-betreffend-die-vermarktung-und-die-kontrolle-von-wild-gewachsenen-speisepilzen'),
        ('BLV — памятка «Собирать грибы»', 'https://www.blv.admin.ch/dam/de/sd-web/KfZiCQXXccw6/merkblatt-pilze-de.pdf'),
        ('BLV — съедобные грибы', 'https://www.blv.admin.ch/de/speisepilze'),
        ('Кантон Цюрих — грибы без риска, 11.08.2025', 'https://www.zh.ch/de/news-uebersicht/mitteilungen/2025/gesundheit/lebensmittel/pilze-sicher-geniessen.html'),
        ('Кантон Цюрих — памятка «Грибы и грибной контроль» (MD-00134), с 18.03.2026', 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/gesundheit/lebensmittelkontrollen/MD-00134.pdf'),
        ('Кантон Граубюнден — постановление об охране природы (KNHV), ст. 12', 'https://www.gr-lex.gr.ch/api/de/versions/3456/pdf_file'),
        ('Кантон Гларус — постановление об охране грибов', 'https://gl.lexwork.naz.ch/de/dta/IV-G.3.3.pdf'),
        ('Кантон Санкт-Галлен — грибы', 'https://www.sg.ch/umwelt-natur/natur-landschaft/biodiversitaet/artenvielfalt/pilze.html'),
        ('Кантон Люцерн — постановление об охране грибов (SRL 715c)', 'https://srl.lu.ch/api/de/versions/418/pdf_file'),
        ('Кантон Обвальден — постановление об охране грибов', 'https://gdb.ow.ch/frontend/versions/165/download_pdf_file'),
        ('Кантон Во — сбор грибов', 'https://www.vd.ch/environnement/biodiversite-et-paysage/recolte-des-champignons'),
        ('Кантон Фрибур — грибы', 'https://www.fr.ch/energie-agriculture-et-environnement/faune-et-biodiversite/champignons'),
        ('Кантон Фрибур — пункты грибного контроля, 09.10.2026', 'https://www.fr.ch/document/50976'),
        ('Кантон Тичино — закон о сборе грибов (RL 483.100)', 'https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/553'),
        ('Кантон Берн — постановление об охране природы (NSchV), ст. 22–23', 'https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file'),
        ('Кантон Берн — памятка о грибах и разрешении на продажу', 'https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/umwelt/naturschutz/Merkblatt_Pilze_D.pdf'),
        ('Город Берн — памятка грибника', 'https://www.bern.ch/themen/gesundheit-alter-und-soziales/gesundheitsvorsorge/pilzkontrolle/downloads/merkblatt-pilzesammeln.pdf/download'),
        ('Кантон Швиц — сбор грибов и ягод', 'https://www.sz.ch/umweltdepartement/amt-fuer-wald-und-natur/natur-und-landschaft/artenschutz/pilz-und-beerensammeln.html/8756-8758-8802-9447-9454-9459-10665-10668/print/html'),
        ('Кантон Нидвальден — сбор грибов', 'https://www.nw.ch/fsnaturlandschaftdienste/8086'),
        ('Кантон Тургау — грибы', 'https://raumentwicklung.tg.ch/themen/natur/pilze.html/4229'),
        ('Кантон Юра — постановление об охране природы (OPNP) с 01.01.2026', 'https://rsju.jura.ch/fr/viewdocument.html?idn=20085&id=39311&download=1'),
        ('Кантон Аргау — сбор ягод, грибов и дров', 'https://www.ag.ch/de/themen/umwelt-natur/wald/erholungsraum-wald/sammeln-von-beeren-pilzen-und-holz'),
        ('SRF — пунктов грибного контроля становится меньше, 28.08.2025', 'https://www.srf.ch/radio-srf-1/start-der-pilzsaison-essbar-oder-giftig-verband-fordert-mehr-pilzkontrollstellen'),
        ('Tox Info Suisse — мифы о грибах, июль 2026', 'https://www.toxinfo.ch/ammenmaerchen_pilze_blog'),
        ('Tox Info Suisse — годовой отчёт 2025', 'https://www.toxinfo.ch/customer/files/1241/977_012601-Tox-Jahresbericht-2025-DE-Web-150dpi.pdf'),
        ('BAG — лисий цепень', 'https://www.bag.admin.ch/de/fuchsbandwurm-echinokokkose'),
        ('Правила Швейцарского национального парка (Nationalparkordnung)', 'https://www.gr-lex.gr.ch/api/de/versions/2411/pdf_file'),
    ],
    terms=[('Deutsch', 'Pilze sammeln, Pilzkontrolle, Pilzkontrollstelle, amtliche Pilzkontrolleurin, Schontage, Schonzeit, pro Person und Tag, Pilzschutzverordnung, Pilzschutzgebiet, geschützte Pilze, Rote Liste, organisiertes Sammeln, gewerbsmässiges Sammeln, Bewilligung, Busse, Speisepilz, Giftpilz, Grüner Knollenblätterpilz, Steinpilz, Eierschwamm, Morchel'),
           ('Français', 'cueillette des champignons, contrôle des champignons, poste de contrôle, contrôleur officiel des champignons, jours d’interdiction, par personne et par jour, réserve mycologique, espèces protégées, Liste rouge, cueillette organisée, cueillette à des fins commerciales, autorisation, amende, champignon comestible, champignon vénéneux, amanite phalloïde, cèpe, chanterelle, morille'),
           ('Italiano', 'raccolta di funghi, controllo dei funghi, ufficio di controllo dei funghi, controllore ufficiale, periodo di divieto, per persona al giorno, zona di protezione dei funghi, specie protette, Lista rossa, raccolta organizzata, raccolta a scopo di lucro, autorizzazione, multa, fungo commestibile, fungo velenoso, tignosa verdognola, porcino, gallinaccio, spugnola'),
           ('English', 'mushroom picking, mushroom inspection, inspection point, official mushroom inspector, closed days, per person per day, protected mushrooms, Red List, commercial picking, permit, fine, edible mushroom, poisonous mushroom, death cap, porcini, chanterelle, morel')],
)


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
