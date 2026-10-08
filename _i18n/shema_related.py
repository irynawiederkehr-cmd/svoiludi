"""Блок «Связанные схемы» внизу страниц схем (08.10.2026). Запускать после сборки страниц схем:
python3 _i18n/shema_related.py  — вставляет/обновляет блок между <!--rel--> метками перед «Важно»."""
import os, re
T = {
    'ekstrennye-nomera': ('Экстренные номера', 'Номера, дежурный врач кантона и твои контакты на одной карточке.'),
    'put-obrazovaniya': ('Путь образования', 'От яслей до доктора наук: переходы, экзамены, сравнение с нашей школой.'),
    'yazyk-trebovaniya': ('Язык: что и где требуют', 'Уровни A1–C2, требования кантонов для паспорта и твой план.'),
    'strahovki-obyazatelnye': ('Обязательные страховки', 'Что нельзя не оформить: медстраховка, AHV, Serafe, машина, дом.'),
    'nalogi-shema': ('Как устроены налоги', 'Три уровня налога, налог у источника или декларация, сроки.'),
    'pensiya-shema': ('Как устроена пенсия', 'AHV, пенсионная касса и 3a, пенсия по возрасту и твой ориентир.'),
    'grazhdanstvo-shema': ('Путь к гражданству', '9 шагов к паспорту, как его можно потерять и твой расчёт.'),
    'diplomy-shema': ('Признание дипломов', 'Кто признаёт, цены и сроки в месяцах, язык и твой план.'),
    'franshiza-shema': ('Франшиза медстраховки', 'Сколько платишь сама, какая франшиза выгоднее и до какого числа менять.'),
}
REL = {
    'ekstrennye-nomera': ['franshiza-shema', 'strahovki-obyazatelnye'],
    'put-obrazovaniya': ['diplomy-shema', 'yazyk-trebovaniya', 'ekstrennye-nomera'],
    'yazyk-trebovaniya': ['grazhdanstvo-shema', 'diplomy-shema', 'put-obrazovaniya'],
    'strahovki-obyazatelnye': ['franshiza-shema', 'pensiya-shema', 'nalogi-shema'],
    'franshiza-shema': ['strahovki-obyazatelnye', 'ekstrennye-nomera', 'nalogi-shema'],
    'nalogi-shema': ['pensiya-shema', 'strahovki-obyazatelnye', 'grazhdanstvo-shema'],
    'pensiya-shema': ['strahovki-obyazatelnye', 'nalogi-shema'],
    'grazhdanstvo-shema': ['yazyk-trebovaniya', 'nalogi-shema', 'diplomy-shema'],
    'diplomy-shema': ['yazyk-trebovaniya', 'put-obrazovaniya', 'grazhdanstvo-shema'],
}
CSS = ('<style>.relsh{margin:34px 0 8px}.relsh h2{font-size:1.35rem;margin:0 0 14px}'
       '.relsh-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:14px}'
       '.relsh-g a{display:flex;gap:12px;align-items:center;padding:12px;border:1.5px solid var(--line,#E4DCCF);border-radius:18px;background:var(--paper,#FFFCF8);color:inherit;text-decoration:none}'
       '.relsh-g a:hover{border-color:var(--sage,#5E6B48)}'
       '.relsh-g img{width:72px;height:auto;flex:none;border-radius:4px;box-shadow:0 2px 8px rgba(60,50,30,.18)}'
       '.relsh-g b{display:block;font-size:.98rem;margin-bottom:3px}.relsh-g span{font-size:.84rem;line-height:1.35;opacity:.85}</style>')
for s, rel in REL.items():
    f = f'instrumenty/{s}/index.html'
    if not os.path.isfile(f): continue
    t = open(f, encoding='utf-8').read()
    cards = ''.join(f'<a href="/instrumenty/{r}/"><img src="../preview/{r}/1.jpg" alt="" loading="lazy"><span><b>{T[r][0]}</b><span>{T[r][1]}</span></span></a>' for r in rel if os.path.isfile(f'instrumenty/{r}/index.html'))
    block = f'<!--rel-->{CSS}<section class="relsh" aria-labelledby="h-rel"><h2 id="h-rel">Связанные схемы</h2><div class="relsh-g">{cards}</div></section><!--rel-->'
    if '<!--rel-->' in t: t = re.sub(r'<!--rel-->.*?<!--rel-->', lambda m: block, t, flags=re.S)
    else:
        i = t.index('<p class="imp">'); t = t[:i] + block + '\n  ' + t[i:]
    open(f, 'w', encoding='utf-8').write(t); print('ok', s)
