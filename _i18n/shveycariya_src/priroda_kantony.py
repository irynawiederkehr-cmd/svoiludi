# «Твой кантон» для тем «Рыбалка», «Грибы», «Охота» (17.10.2026). Собирается в assets/kantony.js (window.KANTONY_PRIRODA) командой
# python3 _i18n/shveycariya_src/build.py — между метками /*PRIRODA*/ … /*/PRIRODA*/. Руками assets/kantony.js в этом месте не править.
# Только проверенные ссылки (открыты 17.10.2026). Где официального текста кантона открыть не удалось, правило взято из сводного списка
# VAPKO (объединение официальных грибных контролёров, версия 08.02.2026) — так и написано в тексте. Обновлять раз в год (январь)
# вместе с проверкой статей. Подробно — документ проекта «priroda-statyi.md».

CHECKED = '17.10.2026'
VAPKO_LIST = 'https://www.vapko.ch/index.php/de/oekologie/kantonale-und-kommunale-pilzsammelbestimmungen'
VAPKO_FIND = 'https://www.vapko.ch/index.php/de/eine-pilzkontrollstelle-finden'
ZH_MEMO = 'https://www.zh.ch/content/dam/zhweb/bilder-dokumente/themen/gesundheit/lebensmittelkontrollen/MD-00134.pdf'
NO_LIMIT = 'Кантон количество не ограничивает: собирать можно в обычном для местности количестве (по списку VAPKO)'

# griby: u — правила кантона, kontrolle — где найти пункт грибного контроля, limit / days / other — коротко
GRIBY = {
    'ZH': dict(u='https://www.zh.ch/de/news-uebersicht/mitteilungen/2025/gesundheit/lebensmittel/pilze-sicher-geniessen.html', kontrolle=ZH_MEMO,
               limit='Не больше 1 кг на человека в день', days='Нельзя с 1 по 10 число каждого месяца',
               other='В памятке кантона указано, какой пункт грибного контроля отвечает за твою общину. Штраф — до 1000 франков'),
    'BE': dict(u='https://www.belex.sites.be.ch/api/de/versions/2696/pdf_file', kontrolle='https://www.muri-guemligen.ch/public/upload/assets/4511/20240111_Oeffnungszeiten_Pilzkontrollstellen_2026_Region_Bern.pdf?fp=6',
               limit='Не больше 2 кг на человека в день', other='Дней запрета нет. Собирать на продажу — только с разрешением кантона'),
    'LU': dict(u='https://srl.lu.ch/api/de/versions/418/pdf_file', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день, из них сморчков и лисичек — не больше 0,5 кг', days='Нельзя с 1 по 7 число каждого месяца',
               other='Собирать на продажу нельзя. Штраф — до 2000 франков'),
    'UR': dict(u='https://www.ur.ch/dienstleistungen/3449', kontrolle=VAPKO_FIND,
               limit='По списку VAPKO — не больше 3 кг на человека в день, из них сморчков не больше 0,5 кг и лисичек не больше 2 кг',
               other='Сморчки — не раньше 1 апреля. Собирать на продажу нельзя'),
    'SZ': dict(u='https://www.sz.ch/umweltdepartement/amt-fuer-wald-und-natur/natur-und-landschaft/artenschutz/pilz-und-beerensammeln.html/8756-8758-8802-9447-9454-9459-10665-10668/print/html', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день, из них сморчков не больше 1 кг',
               other='Дней запрета нет. Своих пунктов грибного контроля в кантоне нет — проверяй грибы в соседнем кантоне'),
    'OW': dict(u='https://gdb.ow.ch/frontend/versions/165/download_pdf_file', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день, сморчков не больше 500 г', days='Нельзя с 1 по 7 число каждого месяца и в темноте',
               other='Дети до 12 лет собирают только со взрослым и в счёт его нормы. Собирать на продажу нельзя'),
    'NW': dict(u='https://www.nw.ch/fsnaturlandschaftdienste/8086', kontrolle=VAPKO_FIND,
               limit='Не больше 1 кг на человека в день', other='Дней запрета нет. Собирать на продажу — только с разрешением кантона'),
    'GL': dict(u='https://gl.lexwork.naz.ch/de/dta/IV-G.3.3.pdf', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день', days='Нельзя с 1 по 10 число каждого месяца', other='Организованные сборы запрещены'),
    'ZG': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'FR': dict(u='https://www.fr.ch/energie-agriculture-et-environnement/faune-et-biodiversite/champignons', kontrolle='https://www.fr.ch/document/50976',
               limit='Не больше 2 кг на человека в день', days='Собирать можно только с 7 до 20 часов',
               other='За превышение лимита грибы могут забрать'),
    'SO': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'BS': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'BL': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'SH': dict(u=VAPKO_LIST, kontrolle=ZH_MEMO,
               limit='Кантон количество не ограничивает. В общинах Бухберг и Рюдлинген — как в Цюрихе: не больше 1 кг, нельзя с 1 по 10 число (по списку VAPKO)'),
    'AR': dict(u='https://ar.lexwork.naz.ch/de/dta/422.111.3.pdf', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день', other='Собирать на продажу и организованные сборы нельзя'),
    'AI': dict(u='https://ai.clex.ch/api/de/versions/1551/pdf_file', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день', other='Правительство кантона может вводить дни запрета и зоны охраны грибов'),
    'SG': dict(u='https://www.sg.ch/umwelt-natur/natur-landschaft/biodiversitaet/artenvielfalt/pilze.html', kontrolle=VAPKO_FIND,
               limit='Правила вводят общины',
               days='Во многих общинах на юге кантона (Верденберг, Сарганзерланд, Линтгебит) нельзя с 1 по 10 число, а в остальные дни — только с 8 до 20 часов',
               other='Спроси правила в своей общине'),
    'GR': dict(u='https://www.gr-lex.gr.ch/api/de/versions/3456/pdf_file', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день', days='Нельзя с 1 по 10 число каждого месяца',
               other='Группой больше трёх человек нельзя, кроме семьи. Грабли и похожие инструменты запрещены'),
    'AG': dict(u='https://www.ag.ch/de/themen/umwelt-natur/wald/erholungsraum-wald/sammeln-von-beeren-pilzen-und-holz', kontrolle=VAPKO_FIND,
               limit='Кантон цифру не задаёт: собирать можно в обычном для местности количестве',
               other='На продажу — только с разрешением кантона. Пункты грибного контроля организуют общины'),
    'TG': dict(u='https://raumentwicklung.tg.ch/themen/natur/pilze.html/4229', kontrolle=VAPKO_FIND,
               limit='Не больше 1 кг съедобных грибов на человека в день', other='Дней запрета нет. Грибы из Красного списка нельзя. Штраф — до 5000 франков'),
    'TI': dict(u='https://m3.ti.ch/CAN/RLeggi/public/index.php/raccolta-leggi/legge/num/553', kontrolle=VAPKO_FIND,
               limit='Не больше 3 кг на человека в день', days='Нельзя с 20 до 7 часов',
               other='Грабли и совки запрещены. Штраф — до 10 000 франков'),
    'VD': dict(u='https://www.vd.ch/environnement/biodiversite-et-paysage/recolte-des-champignons', kontrolle=VAPKO_FIND,
               limit='Не больше 2 кг на человека в день', days='Собирать можно каждый день с 7 до 20 часов',
               other='Редкие грибы из Красного списка нельзя. На продажу — только с разрешением и после курса VAPKO'),
    'VS': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'NE': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit=NO_LIMIT),
    'GE': dict(u=VAPKO_LIST, kontrolle=VAPKO_FIND, limit='По списку VAPKO — не больше 2 кг на человека в день'),
    'JU': dict(u='https://rsju.jura.ch/fr/viewdocument.html?idn=20085&id=39311&download=1', kontrolle=VAPKO_FIND,
               limit='Не больше 3 кг на человека в день, все грибы вместе (с 1 января 2026 года)'),
}

RYBA = {}
OHOTA = {
    # sys: patent / revier / none; u — управление охоты кантона, exam — экзамен на охотника, wild — что делать при столкновении или с раненым животным
    'ZH': dict(sys='revier', u='https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdreviere.html', exam='https://www.zh.ch/de/umwelt-tiere/tiere/jagd/jagdausbildung-im-kanton-zuerich.html',
               wild='https://www.zh.ch/de/umwelt-tiere/tiere/jagd/umgang-mit-wildtieren-im-siedlungsraum.html',
               note='После теории и стрельбы — не меньше двух лет кандидатом в цюрихском угодье, потом экзамен. Угодья сданы на 2025–2033 годы'),
    'BE': dict(sys='patent', exam='https://www.weu.be.ch/content/dam/weu/dokumente/lanat/de/jagd/02%20Daten%20Jagdpr%C3%BCfung%202027%20de.pdf',
               note='До экзамена — 80 часов работы по уходу за угодьями (Hegestunden). Экзамен 350 франков и 100 за стрельбище; теория в марте 2027, практика в мае 2027'),
    'LU': dict(sys='revier', u='https://lawa.lu.ch/jagd', exam='https://lawa.lu.ch/jagd/jagdlehrgang', wild='https://lawa.lu.ch/jagd/Wildhut_und_Jagdaufsicht',
               note='Экзамен из трёх частей. Набор на курс 2027/28 — в январе–феврале 2027'),
    'UR': dict(sys='patent', u='https://www.ur.ch/raumumwelt/1361', exam='https://www.ur.ch/_doc/437033',
               note='Набор на курс 2027/2028 — в декабре 2026. Меткость подтверждают каждый год'),
    'SZ': dict(sys='patent', u='https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/jagd.html/8756-8758-8802-9447-9454-9460-10682',
               exam='https://www.sz.ch/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/jagd/jagdlehrgang.html/8756-8758-8802-9447-9454-9460-10682-10687',
               wild='https://www.sz.ch/verwaltung/umweltdepartement/amt-fuer-wald-und-natur/jagd-und-wildtiere/wildtiere.html/8756-8758-8802-9447-9454-9460-10683',
               note='Патент — с 20 лет. Курс раз в два года. Патент на крупную дичь — 600 франков для жителей кантона и 2400 для приезжих'),
    'OW': dict(sys='patent', u='https://www.ow.ch/fachbereiche/1813', exam='https://www.ow.ch/dienstleistungen/2163', wild='https://www.ow.ch/kantonspolizei/5324',
               note='Курс 15 месяцев: 900 франков и экзамен 400 франков'),
    'NW': dict(sys='patent', u='https://www.nw.ch/jagdhuko/1145'),
    'GL': dict(sys='patent', u='https://www.gl.ch/verwaltung/bau-und-umwelt/umwelt-wald-und-energie/jagd-und-fischerei.html/805',
               exam='https://www.gl.ch/verwaltung/bau-und-umwelt/umwelt-wald-und-energie/jagd-und-fischerei/jagdlehrgang.html/6324',
               note='Запись на курс — до 31 января года начала. О диких животных — кантональная служба экстренных вызовов 055 645 66 66'),
    'ZG': dict(sys='patent', u='https://zg.ch/de/natur-umwelt-tiere/arten-und-lebensraeume/jagen', wild='https://zg.ch/de/natur-umwelt-tiere/arten-und-lebensraeume/wildtierunfaelle',
               note='Курс около 18 месяцев, следующий — с августа 2027. Патент на крупную дичь для жителей кантона — 160 франков, для приезжих — 320'),
    'FR': dict(sys='patent', u='https://www.fr.ch/diaf/sfn/chasse', exam='https://www.fr.ch/sport-et-loisirs/sport-de-loisirs/formation-et-examens-des-candidats-et-candidates-chasseurs',
               wild='https://www.fr.ch/energie-agriculture-et-environnement/faune-aquatique-et-faune-terrestre/section-faune-chasse-et-peche/gardes-faune',
               note='Подготовка 18 месяцев, экзамен раз в два года, с 18 лет. Сезон 2026/27 — с 1 сентября по 28 февраля'),
    'SO': dict(sys='revier', u='https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/',
               exam='https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/jagen-im-kanton-so/jagdausbildung-jagdpruefung/',
               wild='https://so.ch/verwaltung/volkswirtschaftsdepartement/amt-fuer-wald-jagd-und-fischerei/jagd/wildunfaelle/',
               note='Курс и экзамен — 600 франков за всё. Запись на курс 2027/2028 — до 15 ноября 2026'),
    'BS': dict(sys='revier', u='https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/amt-fuer-wald-beider-basel/jagd',
               note='Угодья сдают общины Риэн и Беттинген. Охотой ведает ведомство леса обоих Базелей'),
    'BL': dict(sys='revier', u='https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/amt-fuer-wald-beider-basel/jagd',
               exam='https://www.baselland.ch/politik-und-behorden/direktionen/volkswirtschafts-und-gesundheitsdirektion/amt-fuer-wald-beider-basel/jagd/jagdpruefung',
               note='Перед экзаменом — «год ухода» (Hegejahr) в обществе охотников, место ищешь сам'),
    'SH': dict(sys='revier', u='https://sh.ch/CMS/Webseite/Kanton-Schaffhausen/Beh-rde/Verwaltung/Departement-des-Innern/Jagd-und-Fischerei-3318-DE.html'),
    'AR': dict(sys='patent', u='https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-raum-und-wald/abteilung-natur-und-wildtiere/jagd/',
               exam='https://ar.ch/verwaltung/departement-bau-und-volkswirtschaft/amt-fuer-raum-und-wald/abteilung-natur-und-wildtiere/jagd/jagdpruefung/',
               note='Экзамен с 17 лет, курс около 14 месяцев, экзамен 350 франков. Патент — только гражданам Швейцарии и людям с пермитом C'),
    'AI': dict(sys='patent'),
    'SG': dict(sys='revier', u='https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd.html', exam='https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/jagdausbildung-2025/ausbildung-zur-jaegerin-jaeger.html',
               wild='https://www.sg.ch/umwelt-natur/jagd-fischerei/jagd/wildtiere.html',
               note='Курс 2027–2029 годов: с февраля 2027 по июнь 2029, около 2200 франков без учебника и снаряжения'),
    'GR': dict(sys='patent', u='https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/Seiten/home.aspx',
               exam='https://www.gr.ch/DE/institutionen/verwaltung/diem/ajf/jagd/JagdDokumente/Jagdpr%c3%bcfung%20und-ausbildung/Publikation_Anmeldung_JEP_2026%20-%20DE.pdf',
               note='Экзамен с 18 лет, 300 франков и 20 франков сбор. Запись на цикл 2027/2028 закрылась 15 октября 2026'),
    'AG': dict(sys='revier', u='https://www.ag.ch/de/verwaltung/bvu/jagd-fischerei', exam='https://www.ag.ch/de/themen/landwirtschaft-tiere/wild-wassertiere/jagd/aus-und-weiterbildung/jagdpruefung',
               note='Курс обычно один-два года, практика в угодье. Меткость подтверждают каждый год'),
    'TG': dict(sys='revier', u='https://jfv.tg.ch/jagd.html/8654', exam='https://jfv.tg.ch/jagd/jaegerpruefung.html/8712',
               note='Запись на курс 2027/28 откроется 2 ноября 2026 в 8:00, мест не больше 50'),
    'TI': dict(sys='patent', u='https://www4.ti.ch/dt/da/ucp/temi/caccia', exam='https://www4.ti.ch/dt/da/ucp/temi/caccia/sportello/domanda-per-lottenimento-del-certificato-di-abilitazione-alla-caccia',
               wild='https://www4.ti.ch/dt/da/ucp/temi/caccia/per-saperne-di-piu/domande-frequenti',
               note='На курс берут с 17 лет, только граждан Швейцарии и иностранцев с пермитом C или B. Стоит 550 франков, запись с 15 сентября по 31 декабря'),
    'VD': dict(sys='patent', u='https://www.vd.ch/environnement/biodiversite-et-paysage/chasse-1',
               exam='https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_Examen_chasse_2021.pdf',
               wild='https://www.vd.ch/fileadmin/user_upload/themes/environnement/faune_nature/fichiers_pdf/Chasse/06_legislation/Directive_gibier_p%C3%A9ri_VFINALE_2019.04.16.pdf',
               note='Курс один или два года, около 1050 франков, с 18 лет. Запись — до 31 октября 2026'),
    'VS': dict(sys='patent', u='https://www.vs.ch/web/scpf', exam='https://www.vs.ch/web/scpf/formation-jeunes-chasseurs',
               note='Курс два года, 750 франков, с 18 лет. Запись до 1 октября, нужна выписка из реестра судимостей'),
    'NE': dict(sys='patent', u='https://www.ne.ch/themes/energie-et-environnement/faune/chasse', note='Перед экзаменом обязателен курс'),
    'GE': dict(sys='none', u='https://www.ge.ch/cohabiter-avec-faune-sauvage/canton-sans-chasse', wild='https://www.ge.ch/cohabiter-avec-faune-sauvage/oisillons-animaux-sauvages-morts-detresse',
               note='Охоты нет с 1974 года. О раненом или сбитом животном — 117 круглосуточно, днём — службе охраны природы 022 388 55 00'),
    'JU': dict(sys='patent'),
}


def js():
    import json
    out = {}
    for part, data in (('griby', GRIBY), ('ryba', RYBA), ('ohota', OHOTA)):
        for k, v in data.items():
            out.setdefault(k, {})[part] = {x: y for x, y in v.items() if y}
    return ('/*PRIRODA*/\n/* «Твой кантон» для тем «Рыбалка», «Грибы», «Охота» — собирается из _i18n/shveycariya_src/priroda_kantony.py командой build.py, руками не править. Проверено ' + CHECKED + '. */\n'
            'window.KANTONY_PRIRODA_CHECKED = ' + json.dumps(CHECKED) + ';\nwindow.KANTONY_PRIRODA = ' + json.dumps(out, ensure_ascii=False, separators=(',', ':')) + ';\n/*/PRIRODA*/\n')


def write(path='assets/kantony.js'):
    import re
    s = open(path, encoding='utf-8').read()
    block = js()
    if '/*PRIRODA*/' in s:
        s = re.sub(r'/\*PRIRODA\*/.*?/\*/PRIRODA\*/\n', lambda m: block, s, flags=re.S)
    else:
        s = s.rstrip('\n') + '\n' + block
    open(path, 'w', encoding='utf-8').write(s)
