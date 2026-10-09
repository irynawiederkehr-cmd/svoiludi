#!/usr/bin/env python3
"""«Все файлы и инструменты по темам» — instrumenty/vse-fayly/index.html (просьба Ирины, 09.10.2026).
Один список: каждый инструмент svoiludi.ch и КАЖДЫЙ файл или лист, который он даёт (из FANS в assets/pdffan.js),
по темам, со ссылками, поиском по слову и фильтром по виду. У некоторых инструментов по несколько файлов — здесь они видны все.
Запуск из корня репозитория после нового инструмента: python3 _i18n/katalog.py
Новый инструмент нужно вписать в CATS ниже, иначе скрипт остановится и скажет, какой slug не разложен по темам.
Шапка, меню и подвал берутся из instrumenty/index.html. Украинское зеркало — _i18n/pages.py / sync.py как обычно."""
import os, re, json, sys, html, subprocess
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sys.path.insert(0, os.path.join(ROOT, '_i18n', 'shveycariya_src'))
from topics import TOPICS  # noqa

OUT = 'instrumenty/vse-fayly/index.html'
URL = 'https://svoiludi.ch/instrumenty/vse-fayly/'
UPD = '09.10.2026'

# Темы: (ключ, название, пояснение, [инструменты по порядку]). Каждый инструмент — в одной теме.
CATS = [
    ('dom', 'Жильё, соседи и переезд', 'Найти квартиру, понять договор, принять и сдать квартиру, жить в доме по правилам.',
     ['dosye-arendatora', 'dogovor-arendy-obrazec', 'protokol-kvartiry', 'pisma-arenda', 'zhurnal-shuma', 'grafik-prachechnoj', 'obyavleniya-sosedyam', 'musor-pamyatka', 'pereezd-spisok', 'ipoteka-raschet']),
    ('dokumenty', 'Документы, пермит и сроки', 'Свои данные под рукой, сроки ответа на письма, путь к паспорту, язык и диплом.',
     ['moi-dannye', 'srok-pisma', 'sroki-goda', 'grazhdanstvo-shema', 'yazyk-trebovaniya', 'diplomy-shema']),
    ('dengi', 'Деньги, налоги и пенсия', 'Сколько уходит в месяц, как устроены налоги и пенсия.',
     ['moj-budget', 'nalogi-shema', 'pensiya-shema']),
    ('zdorovye', 'Страховки, здоровье и экстренные случаи', 'Куда звонить, какие страховки обязательны и что платят при болезни.',
     ['ekstrennye-nomera', 'strahovki-obyazatelnye', 'franshiza-shema', 'bolezn-zarplata']),
    ('rabota', 'Работа', 'Резюме, расчёт зарплаты, рабочие часы и кто поможет при споре с работодателем.',
     ['rezyume', 'zarplata', 'uchet-vremeni', 'kuda-obratitsya']),
    ('delo', 'Своё дело и ферайн', 'Счета с QR, доходы и расходы, часы по клиентам, анкеты, этикетки и устав ферайна.',
     ['schet-qr', 'dohody-rashody', 'chasy-po-klientam', 'anketa-klienta', 'etiketka-eda', 'statuty-fereyna']),
    ('semya', 'Семья, дети и учёба', 'Школа и учёба, детские пособия и договор с няней.',
     ['put-obrazovaniya', 'posobiya-raschet', 'dogovor-nyani']),
    ('byt', 'Покупки, транспорт, отдых и питомцы', 'Письма продавцу, лимиты на границе, проездной, поход в горы и животные.',
     ['pisma-prodavcu', 'tamozhnya-limity', 'proezdnoj-vybor', 'plan-pohoda', 'kartochka-pitomca', 'obyavlenie-pitomec']),
    ('plan', 'Планеры и дневник', 'Год и день на одном листе и дневник эмоций.',
     ['moj-god', 'moj-den', 'moi-emocii']),
]
# Вид инструмента по первому слову метки на вкладке «Полезные инструменты»
KIND = {'Документ': 'doc', 'Образец': 'doc', 'Схема': 'shema', 'Расчёт': 'calc', 'Учёт': 'calc', 'Бесплатно': 'calc',
        'Карточка': 'print', 'Памятка': 'print', 'Листовка': 'print', 'Распечатка': 'print', 'Распечатки': 'print', 'Список': 'print',
        'Планер': 'plan', 'Дневник': 'plan', 'Календарь': 'plan'}
KINDS = [('doc', 'Письма, договоры и документы'), ('shema', 'Схемы на одном листе'), ('calc', 'Расчёты и учёт'),
         ('print', 'Карточки, памятки и распечатки'), ('plan', 'Планеры и календари')]

strip = lambda s: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', ' ', html.unescape(s or ''))).strip()

# --- инструменты с вкладки «Полезные инструменты»
ih = open('instrumenty/index.html', encoding='utf-8').read()
TOOL = {}
for m in re.finditer(r'<article class="tool(?! soon)[^"]*">(.*?)</article>', ih, re.S):
    b = m.group(1)
    u = re.search(r'href="https://svoiludi\.ch/instrumenty/([a-z0-9-]+)/"', b)
    if not u or not os.path.isfile(f'instrumenty/{u.group(1)}/index.html'):
        continue
    tag = strip(re.search(r'<span class="tag">(.*?)</span>', b).group(1))
    TOOL[u.group(1)] = dict(slug=u.group(1), title=strip(re.search(r'<h2>(.*?)</h2>', b).group(1)), tag=tag,
                            p=strip((re.search(r'<p>(.*?)</p>', b) or re.search('()', '')).group(1)),
                            ic=(re.search(r'(<svg viewBox="0 0 100 100".*?</svg>)', b, re.S) or re.search('()', '')).group(1))

# --- файлы каждого инструмента: FANS из assets/pdffan.js
js = open('assets/pdffan.js', encoding='utf-8').read()
i = js.index('var FANS = {'); j = js.index('\n  };', i)
FANS = json.loads(subprocess.run(['node', '-e', js[i:j + 4] + '\nprocess.stdout.write(JSON.stringify(FANS))'], capture_output=True, text=True, check=True).stdout)

placed = [s for c in CATS for s in c[3]]
missing = sorted(set(TOOL) - set(placed))
if missing:
    sys.exit('katalog.py: впиши в CATS новые инструменты: ' + ', '.join(missing))
dup = sorted({s for s in placed if placed.count(s) > 1})
assert not dup, dup

# --- где инструмент пригодится: статьи «Как устроена Швейцария»
USED = {}
for t in TOPICS:
    if t['ready']:
        for x in t['tools']:
            USED.setdefault(x, []).append((t['slug'], t['title']))


def fmt(tag):
    f = [x.strip() for x in tag.split('·') if 'PDF' in x or 'PNG' in x or 'ics' in x]
    return f[0] if f else 'PDF'


def thumbs(slug):
    d = f'instrumenty/preview/{slug}'
    if not os.path.isdir(d):
        return ''
    fs = sorted([f for f in os.listdir(d) if f.endswith('.jpg')], key=lambda f: int(f.split('.')[0]))[:3]
    from PIL import Image
    land = lambda f: Image.open(os.path.join(d, f)).size[0] > Image.open(os.path.join(d, f)).size[1]
    return '<span class="kf" aria-hidden="true">' + ''.join(f'<img src="../preview/{slug}/{f}" alt="" loading="lazy"{" class=\"land\"" if land(f) else ""} style="--i:{k - (len(fs) - 1) / 2}">' for k, f in enumerate(fs)) + '</span>'


nfiles = 0
secs, nav = [], []
for key, name, lead, slugs in CATS:
    rows = []
    for s in slugs:
        T = TOOL[s]; F = FANS.get(s, {})
        items = F.get('items') or [{'t': T['title'], 'd': T['p']}]
        nfiles += len(items)
        kind = KIND.get(T['tag'].split('·')[0].strip(), 'calc')
        files = ''.join(f'<li><b>{html.escape(it["t"])}</b><span>{html.escape(it["d"])}</span></li>' for it in items)
        size = f'{F["pages"]} {F["unit"]}' if F.get('pages') else ''
        used = USED.get(s, [])[:4]
        usedh = ('<p class="ku">Где пригодится: ' + ', '.join(f'<a href="../../shveycariya/{a}/">{html.escape(b)}</a>' for a, b in used) + '</p>') if used else ''
        rows.append(f'''<article class="kt" data-kind="{kind}">
      <a class="kh" href="../{s}/">{thumbs(s)}<span class="kic">{T['ic']}</span><span class="ktx"><span class="tag">{html.escape(T['tag'])}</span><b>{html.escape(T['title'])}</b></span></a>
      <p class="kp">{html.escape(T['p'])}</p>
      <p class="kn">{len(items)} {"файл" if len(items) % 10 == 1 and len(items) % 100 != 11 else "файла" if len(items) % 10 in (2, 3, 4) and len(items) % 100 not in (12, 13, 14) else "файлов"} · {html.escape(fmt(T['tag']))}{(" · " + html.escape(size)) if size else ""}</p>
      <ol class="kl">{files}</ol>
      {usedh}
      <a class="go-free" href="../{s}/">Открыть инструмент</a>
    </article>''')
    nav.append(f'<a href="#{key}">{name} <small>{len(slugs)}</small></a>')
    secs.append(f'<section class="ks" id="{key}" aria-labelledby="h-{key}"><h2 id="h-{key}">{name}</h2><p class="kd">{lead}</p><div class="kg">{"".join(rows)}</div></section>')

chips = '<button type="button" class="on" data-f="">Все</button>' + ''.join(f'<button type="button" data-f="{k}">{n}</button>' for k, n in KINDS)
ntools = len(TOOL)

# --- шапка и подвал как на вкладке «Полезные инструменты»
src = re.sub(r'<!--i18n-->.*?<!--i18n-->', '', ih, flags=re.S)
TITLE = 'Все бесплатные файлы и инструменты по темам: письма, договоры, схемы, расчёты · Свои люди'
DESC = (f'Полный список: {ntools} бесплатных инструментов svoiludi.ch и {nfiles} файлов и листов, которые они делают — письма управляющей и продавцу, '
        'образцы договоров, протоколы, схемы, расчёты, карточки и планеры. По темам, с поиском по слову и ссылками. PDF бесплатно.')
head = src[:src.index('</head>')]
head = re.sub(r'<title>.*?</title>', f'<title>{html.escape(TITLE)}</title>', head)
head = re.sub(r'<link rel="canonical" href="[^"]*">', f'<link rel="canonical" href="{URL}">', head)
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{html.escape(DESC)}">', head)
head = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="Все бесплатные файлы и инструменты по темам">', head)
head = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{ntools} инструментов и {nfiles} файлов: письма, договоры, схемы, расчёты и распечатки. По темам, с поиском.">', head)
head = re.sub(r'<meta property="og:url" content="[^"]*">', f'<meta property="og:url" content="{URL}">', head)
head = head.replace('https://svoiludi.ch/instrumenty/og-image.jpg', URL + 'og-image.jpg')
head = head.replace('href="../', 'href="../../')
top = src[src.index('<body>'):src.index('<main class="page" id="start">')]
top = top.replace('<a href="#start" aria-current="page" style="color:var(--ink)">Полезные инструменты</a>',
                  '<a href="https://svoiludi.ch/instrumenty/" aria-current="page" style="color:var(--ink)">Полезные инструменты</a>')
top = top.replace('href="../', 'href="../../')
foot = src[src.index('  <footer>'):src.index('</main>') + len('</main>')]

CSS = '''<style>
.kat-hero{padding:34px 0 8px}.kat-hero h1{margin:.2em 0 .3em}
.kat-tools{display:flex;flex-direction:column;gap:12px;margin:18px 0 6px;max-width:760px}
.kat-q{display:flex;align-items:center;gap:8px;background:var(--paper,#FFFCF8);border:1.5px solid var(--line,#E5DCCD);border-radius:14px;padding:10px 14px}
.kat-q input{flex:1;border:0;background:none;font:inherit;font-size:1rem;outline:none;min-width:0}
.kat-f{display:flex;flex-wrap:wrap;gap:8px}.kat-f button{font:600 .86rem/1.2 inherit;padding:8px 12px;border-radius:9px;border:1.5px solid var(--line,#E5DCCD);background:var(--paper,#FFFCF8);color:var(--ink,#2F2924);cursor:pointer}
.kat-f button.on{background:var(--sage,#66704F);border-color:var(--sage,#66704F);color:#fff}
.kat-nav{display:flex;flex-wrap:wrap;gap:6px 14px;margin:14px 0 4px;font-size:.92rem}.kat-nav a{color:var(--brown,#6E4F3C);text-underline-offset:3px}.kat-nav small{color:var(--muted,#6B635A)}
.kat-cnt{color:var(--muted,#6B635A);font-size:.9rem;margin:6px 0 0}
.ks{margin:34px 0 0;scroll-margin-top:90px}.ks h2{margin:0 0 4px}.kd{margin:0 0 14px;color:var(--muted,#6B635A);max-width:70ch}
.kg{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px}
.kt{display:flex;flex-direction:column;gap:8px;background:var(--paper,#FFFCF8);border:1.5px solid var(--line,#E5DCCD);border-radius:18px;padding:16px 18px}
.kh{display:flex;align-items:center;gap:12px;text-decoration:none;color:var(--ink,#2F2924)}
.kh .kf{flex:none;position:relative;width:74px;height:62px}.kh .kf img{position:absolute;left:50%;top:50%;width:40px;height:56px;object-fit:cover;object-position:top;border-radius:4px;box-shadow:0 2px 6px rgba(0,0,0,.18);background:#fff;transform:translate(-50%,-50%) translateX(calc(var(--i)*15px)) rotate(calc(var(--i)*7deg))}
.kh .kf img.land{width:60px;height:42px}
.kh .kic{display:none}.kh .kic svg{width:52px;height:52px}.kh:not(:has(.kf)) .kic{display:block;flex:none}
.ktx{display:flex;flex-direction:column;gap:3px}.ktx b{font-size:1.04rem;line-height:1.3}.ktx .tag{font-size:.74rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--sage,#66704F)}
.kh:hover b{text-decoration:underline;text-underline-offset:3px}
.kp{margin:0;font-size:.95rem;line-height:1.45}
.kn{margin:0;font-size:.84rem;color:var(--muted,#6B635A);font-weight:600}
.kl{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:7px}.kl li{font-size:.92rem;line-height:1.4}.kl li b{display:block}.kl li span{color:var(--muted,#6B635A)}
.ku{margin:2px 0 0;font-size:.86rem}.ku a{color:var(--brown,#6E4F3C);text-underline-offset:3px}
.kt .go-free{align-self:flex-start;margin-top:auto}
.kt[hidden],.ks[hidden]{display:none}
.kat-none{background:var(--paper,#FFFCF8);border:1.5px dashed var(--line,#E5DCCD);border-radius:16px;padding:14px 18px;margin:24px 0 0}
@media (max-width:620px){.kg{grid-template-columns:1fr}.kt{padding:14px}}
</style>'''

SCRIPT = '''<script>(function(){
var q=document.getElementById('katq'),bs=[].slice.call(document.querySelectorAll('.kat-f button')),f='';
var none=document.getElementById('katnone'),cnt=document.getElementById('katcnt');
function run(){var w=(q.value||'').toLowerCase().trim().split(/\\s+/).filter(Boolean),n=0;
document.querySelectorAll('.ks').forEach(function(s){var v=0;s.querySelectorAll('.kt').forEach(function(t){var k=t.textContent.toLowerCase(),ok=(!f||t.getAttribute('data-kind')===f)&&w.every(function(x){return k.indexOf(x)>=0});t.hidden=!ok;if(ok){v++;n++}});s.hidden=!v});
none.hidden=!!n;cnt.hidden=!(w.length||f);cnt.querySelector('b').textContent=n;}
q.addEventListener('input',run);
bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.toggle('on',x===b)});f=b.getAttribute('data-f');run()})});
if(location.hash&&location.hash.length>1&&!document.getElementById(location.hash.slice(1))){q.value=decodeURIComponent(location.hash.slice(1));run()}
})();</script>'''

main = f'''<main class="page" id="start">
  {CSS}
  <section class="kat-hero" aria-labelledby="h1">
    <p style="margin:0 0 12px"><a class="jump" href="../">← Все полезные инструменты</a></p>
    <div class="eyebrow">Полезные инструменты · Свои люди в Швейцарии</div>
    <h1 id="h1">Все файлы и инструменты <em>по темам</em></h1>
    <p class="lead">Здесь списком всё, что можно бесплатно сделать и скачать на сайте: {ntools} инструментов и {nfiles} файлов и листов. Многие инструменты делают сразу несколько документов, например письмо на языке кантона и перевод для себя. Здесь видно каждый файл, поэтому нужное найти проще. Нажми на инструмент, впиши свои данные и скачай PDF. Всё хранится только у тебя на устройстве, регистрация не нужна.</p>
    <div class="kat-tools">
      <label class="kat-q"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg><input id="katq" type="search" placeholder="Одно слово: залог, расторжение, няня, QR, налоги" aria-label="Найти файл или инструмент по слову"></label>
      <div class="kat-f" role="group" aria-label="Вид файла">{chips}</div>
      <p class="kat-cnt" id="katcnt" hidden>Нашлось инструментов: <b></b></p>
    </div>
    <nav class="kat-nav" aria-label="Темы">{"".join(nav)}</nav>
  </section>
  <div class="kat">
  {"".join(secs)}
  </div>
  <div class="kat-none" id="katnone" hidden><b>Ничего не нашлось.</b> Попробуй другое слово или поиск по всему сайту — кнопка «Поиск» вверху страницы. Нужного инструмента нет? <a href="mailto:voznesenskaya.iryna@gmail.com?subject=%D0%98%D0%BD%D1%81%D1%82%D1%80%D1%83%D0%BC%D0%B5%D0%BD%D1%82%20%D0%B4%D0%BB%D1%8F%20svoiludi.ch">Напиши нам</a>, какой документ тебе нужен, и мы подумаем, как его сделать.</div>
  <p class="fine" style="margin-top:28px">Список обновлён {UPD}. Инструменты носят информационный характер и не заменяют консультацию специалиста. На образцах договоров и уставов стоит штамп «ОБРАЗЕЦ»: мы не юристы, проверь у юриста или в профсоюзе. Как всё устроено в Швейцарии — в разделе <a href="../../shveycariya/">«Как устроена Швейцария»</a>.</p>
  <div class="share-slot" data-url="{URL}" data-lead="Перешли тем, кто ищет образец письма, договора или схему. Сообщение уже готово." data-text="Привет! Тут списком все бесплатные файлы на русском для жизни в Швейцарии: письма управляющей и продавцу, образцы договоров, протокол квартиры, схемы, расчёты и планеры. По темам, с поиском. {URL}"></div>
'''
tail = f'''
{SCRIPT}
<script src="/assets/share.js" defer></script>
<script src="/assets/samesite.js"></script>
</body>
</html>
'''
out = head + '</head>\n' + top + main + foot.replace('href="https://svoiludi.ch/', 'href="https://svoiludi.ch/') + tail
os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, 'w', encoding='utf-8').write(out)
print('ok:', OUT, ntools, 'инструментов,', nfiles, 'файлов')
