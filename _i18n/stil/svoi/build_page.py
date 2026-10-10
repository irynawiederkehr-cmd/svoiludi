# Собирает страницу «01 Стиль «Свои люди» — открыть.html»: всё внутри одного файла (шрифты, картинки, 4 темы).
# python3 _i18n/stil/svoi/build_page.py <папка репозитория tests (voznesenskaya.ch)> <файл страницы>
# Исходники страницы — project/ (тот же набор, что у закрытой страницы «Стиль «Свои люди»» в claude.ai).
import base64, html, json, os, re, sys
import markdown

DS = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(DS, 'project')
REPO = os.path.abspath(os.path.join(DS, '..', '..', '..'))
TESTS = os.path.abspath(sys.argv[1])
OUTFILE = os.path.abspath(sys.argv[2])
BLOBS = os.path.join(DS, 'blobs')

ds = json.load(open(os.path.join(P, 'design-system.json')))
tokens = json.load(open(os.path.join(P, 'tokens.json')))

# --- где лежит каждая картинка ---
SRC = {
 'a16d4dae2003f0e640d712f7415519e8': os.path.join(BLOBS, 'a16d4dae2003f0e640d712f7415519e8.svg'),
 '318ce3bfb293248c48c11d42b5241b48': REPO + '/fav/icon-180.png',
 'daa25bb6f1cd7e0b08643940c63aa777': os.path.join(BLOBS, 'daa25bb6f1cd7e0b08643940c63aa777.svg'),
 '1fafd51ad95b5303d36950005ceeaab8': TESTS + '/apple-touch-icon.png',
 'e1c0e26b5c7066d250ee0d98a1e786ca': os.path.join(BLOBS, 'e1c0e26b5c7066d250ee0d98a1e786ca.svg'),
}
for g in ('Phone',):
    for f in ds['assetGroups'][g]['files'].values():
        SRC[f['blob']] = REPO + '/prilozhenie/img/ru/' + f['name']
for i, f in enumerate(ds['assetGroups']['PdfFan']['order'], 1):
    pass
for f in ds['assetGroups']['PdfFan']['files'].values():
    n = re.search(r'(\d)', f['name']).group(1)
    SRC[f['blob']] = REPO + '/instrumenty/preview/zhurnal-perederzhki/%s.jpg' % n
MIME = {'.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2'}

def datauri(path):
    ext = os.path.splitext(path)[1].lower()
    return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(open(path, 'rb').read()).decode())

DU = {}
def blob_uri(b):
    if b not in DU:
        DU[b] = datauri(SRC[b])
    return DU[b]
def deblob(s):
    return re.sub(r'/_blob/([0-9a-f]{32})', lambda m: blob_uri(m.group(1)), s)

# --- шрифты внутрь страницы ---
fonts = ''
for fam, w in [('Forum', 400)] + [('Manrope', x) for x in (400, 500, 600, 700, 800)]:
    for sub, rng in (('cyrillic', 'U+0301,U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116'),
                     ('latin', 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD')):
        fp = os.path.join(REPO, 'assets/fonts', '%s-%s-%d-normal.woff2' % (fam.lower(), sub, w))
        fonts += "@font-face{font-family:'%s';font-style:normal;font-weight:%d;font-display:swap;src:url(%s) format('woff2');unicode-range:%s}\n" % (fam, w, datauri(fp), rng)

tokcss = open(os.path.join(DS, 'tokens.css')).read()
bundle = re.sub(r'@import url\([^)]*\);', '', open(os.path.join(P, 'components', 'bundle.css')).read())

md = lambda s: markdown.markdown(s, extensions=['fenced_code', 'tables'])
esc = html.escape

# --- элементы ---
GROUPS = ['Действия', 'Навигация', 'Подсказки', 'Блоки', 'Карточки', 'Списки', 'Картинки', 'Календари', 'Копия', 'Письма']
els = []
cover = ''
for c in sorted(os.listdir(os.path.join(P, 'components'))):
    pv = os.path.join(P, 'components', c, 'preview.html')
    if not os.path.exists(pv): continue
    s = open(pv).read()
    m = re.match(r'\s*<!--\s*@dsCard([^>]*)-->', s)
    meta = m.group(1) if m else ''
    body = deblob(s[m.end():] if m else s)
    if c == 'Cover':
        cover = body; continue
    g = re.search(r'group="([^"]+)"', meta).group(1)
    sub = re.search(r'subtitle="([^"]+)"', meta).group(1)
    rd = os.path.join(P, 'components', c, 'README.md')
    els.append((GROUPS.index(g), g, c, sub, body, md(open(rd).read()) if os.path.exists(rd) else ''))
els.sort(key=lambda e: (e[0], e[2]))

def slug(s): return re.sub(r'[^a-zа-я0-9]+', '-', s.lower()).strip('-')

parts = []
cur = None
for _, g, c, sub, body, rd in els:
    if g != cur:
        if cur: parts.append('</div>')
        parts.append('<h3 class="sb-g" id="g-%s">%s</h3><div class="sb-list">' % (slug(g), esc(g)))
        cur = g
    parts.append('''<article class="sb-el" id="el-{c}"><div class="sb-elhead"><h4>{sub}</h4><code>{c}</code></div>
<div class="sb-stage">{body}</div>
<details class="sb-rd" open><summary>Правила и код</summary><div class="sb-md">{rd}</div></details></article>'''.format(c=c, sub=esc(sub), body=body, rd=rd))
parts.append('</div>')
elements_html = '\n'.join(parts)
toc_groups = ' · '.join('<a href="#g-%s">%s</a>' % (slug(g), esc(g)) for g in GROUPS if any(e[1] == g for e in els))

# --- цвета ---
themes = tokens['color']['themes']
sw = []
for t in tokens['color']['tokens']:
    sw.append('<div class="sb-sw"><span class="sb-chip" style="background:var(--%s)"></span><div><b>%s</b> <code class="sb-hex" data-tok="%s">%s</code><p>%s</p></div></div>' % (
        t['name'], t['name'], t['name'], t['value']['svoi'], esc(t['usage'])))
colors_html = '\n'.join(sw)
cvals = {t['name']: t['value'] for t in tokens['color']['tokens']}

# --- шрифты ---
ty = []
for gr in tokens['type']['groups']:
    ty.append('<h4 class="sb-sub">%s</h4>' % esc(gr['name']))
    for st in gr['styles']:
        css = 'font-family:var(--font-%s);font-size:%s;line-height:%s;font-weight:%s;%s' % (
            gr['family'], st['fontSize'], st['lineHeight'], st['fontWeight'],
            ('letter-spacing:%s;text-transform:uppercase;' % st['letterSpacing']) if st.get('letterSpacing') else '')
        ty.append('<div class="sb-ty"><div class="sb-tyname"><b>%s</b><span>%s · %s</span></div><div style="%s;color:var(--ink)">%s</div><p>%s</p></div>' % (
            st['name'], st['fontSize'], st['fontWeight'], css, esc(st['sample']), esc(st['usage'])))
type_html = '\n'.join(ty)

def rows(key, kind):
    out = []
    for t in tokens[key]['tokens']:
        if kind == 'space':
            vis = '<span class="sb-bar" style="width:%s"></span>' % t['value']
        elif kind == 'radius':
            vis = '<span class="sb-rad" style="border-radius:%s"></span>' % ('30px' if t['value'] == '999px' else t['value'])
        else:
            vis = '<span class="sb-shd" style="box-shadow:%s"></span>' % t['value']
        out.append('<div class="sb-tk">%s<div><b>%s</b> <code>%s</code><p>%s</p></div></div>' % (vis, t['name'], esc(t['value']), esc(t['usage'])))
    return '\n'.join(out)
form_html = '<h4 class="sb-sub">Отступы</h4>' + rows('spacing', 'space') + '<h4 class="sb-sub">Скругления</h4>' + rows('radius', 'radius') + '<h4 class="sb-sub">Тени</h4>' + rows('shadow', 'shadow')

# --- картинки ---
GROUP_RU = {'Logos': 'Логотипы', 'Icons': 'Значки', 'Phone': 'Картинки телефона', 'PdfFan': 'Веер страниц PDF'}
ap = []
for g, gd in ds['assetGroups'].items():
    ap.append('<h3 class="sb-g" id="a-%s">%s</h3><div class="sb-md">%s</div><div class="sb-pics sb-pics-%s">' % (g, GROUP_RU[g], md(open(os.path.join(P, 'assets', g, 'README.md')).read()), gd.get('tile', 'm')))
    for name in gd['order']:
        f = gd['files'][name]
        ap.append('<figure><img src="%s" alt="%s" loading="lazy"><figcaption>%s</figcaption></figure>' % (blob_uri(f['blob']), esc(name), esc(name)))
    ap.append('</div>')
assets_html = '\n'.join(ap)

readme_html = md(open(os.path.join(P, 'README.md')).read()).replace('здесь подключены с Google Fonts — это те же начертания', 'в эту страницу встроены те же файлы')
logo = blob_uri('a16d4dae2003f0e640d712f7415519e8')

PAGE_CSS = r'''
html{scroll-behavior:smooth;-webkit-text-size-adjust:100%}
body{background:var(--bg)}
.sb{max-width:1080px;margin:0 auto;padding:0 var(--space-gutter) 60px}
.sb-head{position:sticky;top:0;z-index:20;background:var(--bg);border-bottom:1px solid var(--line);margin:0 calc(-1*var(--space-gutter));padding:10px var(--space-gutter)}
.sb-head .in{max-width:1080px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 16px;align-items:center;justify-content:space-between}
.sb-brand{display:flex;gap:10px;align-items:center;color:var(--ink);text-decoration:none}
.sb-brand img{width:36px;height:36px}
.sb-brand b{font:400 1.45rem/1 var(--font-display)}
.sb-brand small{display:block;font:500 .78rem/1.3 var(--font-body);color:var(--muted)}
.sb-themes{display:flex;flex-wrap:wrap;gap:6px}
.sb-themes .btn{white-space:nowrap}
.sb-hero{padding:28px 0 6px}
.sb-hero h1{font:400 clamp(2.3rem,5.4vw,3.6rem)/1.06 var(--font-display);margin:0 0 10px;color:var(--ink)}
.sb-hero h1 em{font-style:normal;color:var(--brown)}
.sb-hero p{max-width:62ch;margin:0 0 8px;color:var(--ink)}
.sb-hero .sb-note{color:var(--muted);font-size:.9rem}
.sb-toc{display:flex;flex-wrap:wrap;gap:4px 14px;margin:16px 0 0;padding:12px 16px;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-card);font-size:.92rem}
.sb-toc a{color:var(--brown);font-weight:600;text-decoration:none}
.sb-toc span{color:var(--muted)}
.sb-sec{margin-top:var(--space-module)}
.sb-sec>h2{font:400 clamp(1.6rem,3.4vw,2.2rem)/1.12 var(--font-display);margin:0 0 14px;color:var(--ink)}
.sb-card{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-card);padding:var(--space-card)}
.sb-cover{overflow-x:auto;border-radius:var(--radius-card);border:1px solid var(--line)}
.sb-md{font-size:.95rem;line-height:1.6;color:var(--ink)}
.sb-md h2{font:400 1.45rem/1.2 var(--font-display);margin:22px 0 8px}
.sb-md h2:first-child{margin-top:0}
.sb-md p{margin:0 0 10px}
.sb-md ul,.sb-md ol{margin:0 0 10px;padding-left:22px}
.sb-md li{margin:3px 0}
.sb-md code,.sb-sw code,.sb-tk code,.sb-elhead code{font:500 .84em/1.4 ui-monospace,Consolas,monospace;background:var(--sage-soft);color:var(--ink);padding:1px 6px;border-radius:6px}
.sb-md pre{background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:12px 14px;overflow-x:auto;margin:0 0 12px}
.sb-md pre code{background:none;padding:0;font-size:.82rem;white-space:pre}
.sb-md table{border-collapse:collapse;width:100%;margin:0 0 12px;font-size:.9rem}
.sb-md th,.sb-md td{border:1px solid var(--line);padding:6px 9px;text-align:left;vertical-align:top}
.sb-md th{background:var(--sage-soft)}
.sb-swgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:var(--space-grid)}
.sb-sw{display:flex;gap:12px;align-items:flex-start;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-tile);padding:12px}
.sb-chip{flex:0 0 46px;height:46px;border-radius:12px;border:1px solid var(--line)}
.sb-sw p,.sb-tk p,.sb-ty p{margin:4px 0 0;font-size:.84rem;line-height:1.45;color:var(--muted)}
.sb-ty{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-tile);padding:14px 16px;margin-bottom:10px;overflow:hidden}
.sb-tyname{display:flex;gap:10px;align-items:baseline;margin-bottom:6px;font-size:.85rem}
.sb-tyname span{color:var(--muted)}
.sb-sub{font:700 .78rem/1.3 var(--font-body);letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:22px 0 10px}
.sb-tk{display:flex;gap:14px;align-items:center;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-tile);padding:10px 14px;margin-bottom:8px}
.sb-bar{display:block;flex:0 0 auto;height:18px;background:var(--sage);border-radius:4px}
.sb-tk>.sb-bar{min-width:6px}
.sb-rad{flex:0 0 60px;height:44px;border:2px solid var(--brown);background:var(--sage-soft)}
.sb-shd{flex:0 0 60px;height:40px;background:var(--paper);border-radius:12px;margin:6px 4px 12px}
.sb-g{font:400 1.5rem/1.2 var(--font-display);margin:30px 0 12px;color:var(--ink);scroll-margin-top:90px}
.sb-list{display:flex;flex-direction:column;gap:18px}
.sb-el{background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-card);padding:var(--space-card);scroll-margin-top:90px}
.sb-elhead{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;justify-content:space-between;margin-bottom:12px}
.sb-elhead h4{margin:0;font:400 1.25rem/1.25 var(--font-display);color:var(--ink)}
.sb-stage{background:var(--bg);border:1px solid var(--line);border-radius:14px;overflow:auto;position:relative}
.sb-rd{margin-top:12px}
.sb-rd .sb-md>h1:first-child{display:none}
.sb-rd>summary{cursor:pointer;font-weight:700;color:var(--brown);font-size:.92rem;margin-bottom:8px}
.sb-pics{display:grid;gap:var(--space-grid);margin:4px 0 8px}
.sb-pics-s{grid-template-columns:repeat(auto-fill,minmax(110px,1fr))}
.sb-pics-m{grid-template-columns:repeat(auto-fill,minmax(150px,1fr))}
.sb-pics-l{grid-template-columns:repeat(auto-fill,minmax(180px,1fr))}
.sb-pics figure{margin:0;background:var(--paper);border:1px solid var(--line);border-radius:var(--radius-tile);padding:10px;text-align:center}
.sb-pics img{max-width:100%;height:auto;max-height:340px;display:block;margin:0 auto}
.sb-pics-s img{max-height:60px}
.sb-pics-m img{max-height:110px}
.sb-pics figcaption{font-size:.78rem;color:var(--muted);margin-top:6px;word-break:break-all}
.sb-foot{margin-top:var(--space-module);padding-top:16px;border-top:1px solid var(--line);font-size:.86rem;color:var(--muted)}
.sb-foot a{color:var(--brown)}
@media (max-width:640px){.sb-head{position:static}.sb-swgrid{grid-template-columns:1fr}}
'''

THEME_BTNS = ''.join('<button type="button" class="btn sm%s" data-t="%s">%s</button>' % ('' if i == 0 else ' ghost', t['id'], esc(t['name'])) for i, t in enumerate(themes))

page = '''<!doctype html>
<html lang="ru" data-theme="svoi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Стиль «Свои люди»</title>
<link rel="icon" href="{logo}">
<style>
{fonts}
{tokcss}
{bundle}
{pagecss}
</style>
</head>
<body>
<div class="sb">
<header class="sb-head"><div class="in">
<a class="sb-brand" href="#top"><img src="{logo}" alt=""><span><b>Стиль «Свои люди»</b><small>только для нас · svoiludi.ch и voznesenskaya.ch</small></span></a>
<div class="sb-themes" role="group" aria-label="Тема">{btns}</div>
</div></header>
<main id="top">
<section class="sb-hero">
<h1>Один стиль, <em>два цвета</em></h1>
<p>Все элементы обоих сайтов в одном месте: цвета, шрифты, кнопки, меню, подсказки, блоки, карточки, картинки телефона и веер PDF. Перед каждым новым элементом находим здесь похожий и берём его классы и код, чтобы стиль был узнаваемым и повторялся быстро и одинаково.</p>
<p class="sb-note">Кнопки вверху переключают сайт и тему: svoiludi.ch шалфейный, voznesenskaya.ch коричневый, у каждого светлая и тёмная. Страница работает без интернета, всё внутри одного файла. Собрано 10.10.2026.</p>
<nav class="sb-toc"><a href="#golos">Голос и правила</a><span>·</span><a href="#cveta">Цвета</a><span>·</span><a href="#shrifty">Шрифты</a><span>·</span><a href="#forma">Отступы, скругления, тени</a><span>·</span><a href="#elementy">Элементы:</a> {tocg}<span>·</span><a href="#kartinki">Файлы картинок</a></nav>
</section>
<section class="sb-sec"><div class="sb-cover">{cover}</div></section>
<section class="sb-sec" id="golos"><h2>Голос и правила</h2><div class="sb-card sb-md">{readme}</div></section>
<section class="sb-sec" id="cveta"><h2>Цвета</h2><p class="sb-note" style="color:var(--muted);margin:-6px 0 14px">Цвета берутся только через переменные: <code>var(--brown)</code>, <code>var(--sage-soft)</code>… Значения ниже меняются вместе с темой.</p><div class="sb-swgrid">{colors}</div></section>
<section class="sb-sec" id="shrifty"><h2>Шрифты</h2>{types}</section>
<section class="sb-sec" id="forma"><h2>Отступы, скругления, тени</h2>{form}</section>
<section class="sb-sec" id="elementy"><h2>Элементы</h2>{elements}</section>
<section class="sb-sec" id="kartinki"><h2>Файлы картинок</h2><p style="color:var(--muted);margin:-6px 0 6px">Те же файлы лежат в папке «Картинки» рядом с этой страницей.</p>{assets}</section>
<footer class="sb-foot">
<p>Та же страница онлайн (закрытая, только для нас): <a href="https://claude.ai/artifact/LwP5ZCSfGJxxRitYA2U5EZ">Стиль «Свои люди» в claude.ai</a>. Описание словами — файл «02 Стиль элементов — описание.md» в этой папке и документ проекта «stil-elementov.md». Код элементов — папка «Код для Claude», картинки — папка «Картинки».</p>
<p>Новый элемент, который Ирина одобрила, дописываем в тот же день: в документ проекта, на онлайн-страницу и в эту папку.</p>
</footer>
</main>
</div>
<script>
(function(){{
  var C = {cvals};
  var root = document.documentElement;
  function set(t){{
    root.setAttribute('data-theme', t);
    document.querySelectorAll('.sb-themes .btn').forEach(function(b){{ b.classList.toggle('ghost', b.getAttribute('data-t') !== t); b.setAttribute('aria-pressed', b.getAttribute('data-t') === t); }});
    document.querySelectorAll('.sb-hex').forEach(function(el){{ var v = C[el.getAttribute('data-tok')]; if (v) el.textContent = v[t]; }});
    try {{ localStorage.setItem('sb-theme', t); }} catch (e) {{}}
  }}
  document.querySelectorAll('.sb-themes .btn').forEach(function(b){{ b.addEventListener('click', function(){{ set(b.getAttribute('data-t')); }}); }});
  var saved = null; try {{ saved = localStorage.getItem('sb-theme'); }} catch (e) {{}}
  set(saved && C.bg[saved] ? saved : 'svoi');
}})();
</script>
</body>
</html>
'''.format(logo=logo, fonts=fonts, tokcss=tokcss, bundle=bundle, pagecss=PAGE_CSS, btns=THEME_BTNS,
           tocg=toc_groups, cover=cover, readme=readme_html, colors=colors_html, types=type_html, form=form_html,
           elements=elements_html, assets=assets_html, cvals=json.dumps(cvals, ensure_ascii=False))
open(OUTFILE, 'w').write(page)
print('page bytes', len(page.encode()))
