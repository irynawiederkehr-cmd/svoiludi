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
OHOTA = {}


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
