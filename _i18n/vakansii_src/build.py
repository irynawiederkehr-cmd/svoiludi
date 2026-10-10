# Сборка vakansii/index.html из частей (07.10.2026). Запуск: python3 _i18n/vakansii_src/build.py _i18n/vakansii_src  (вторым шагом пишет ещё предпросмотр в <папка>/prev)
import sys,re,os,json,base64,subprocess
S=sys.argv[1]; os.chdir('/home/claude/svoiludi')
js=open(S+'/vak_script_head.js',encoding='utf-8').read()+open(S+'/vak_script_mid.js',encoding='utf-8').read()+open(S+'/vak_script_tail.js',encoding='utf-8').read()
ICO_STAFF='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="8" r="3.5" fill="none" stroke="currentColor" stroke-width="1.7"/><path d="M3.5 19.5c.8-3.4 3.4-5.3 6.5-5.3s5.7 1.9 6.5 5.3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/><path d="M18.5 7.5v5M16 10h5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>'
ICO_PART='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 11.5l4-4 3.2 1.4L13 7l3.5 1.2 4.5 3.3-4.6 4.8" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"/><path d="M7 15l2.2 2.2a1.4 1.4 0 0 0 2-2M10 13l2.6 2.6a1.4 1.4 0 0 0 2-2l-3-3" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>'
js=js.replace("<b>${v.kind === 'partner' ? '🤝' : '👋'}</b>", "<b>${v.kind === 'partner' ? ICO.partner : ICO.staff}</b>")
if 'const ICO =' not in js: js=js.replace("const KINDS =", "const ICO = { staff: '"+ICO_STAFF+"', partner: '"+ICO_PART+"' };\nconst KINDS =",1)
src=open('events/index.html',encoding='utf-8').read().split('\n')
h='\n'.join(src[:17]); _se=next(i for i,l in enumerate(src) if i>=17 and l.startswith('</style>'))+1   # конец стиля ищем по </style>, а не по номеру строки
style='\n'.join(src[17:_se]).replace('</style>','')
ns=[i for i,l in enumerate(src) if l.startswith('<style id="nav-chips">')][0]; ne=[i for i,l in enumerate(src) if i>ns and l.startswith('</style>')][0]
navchips='\n'.join(src[ns:ne+1])
hs=[i for i,l in enumerate(src) if l.startswith('<header class="top">')][0]; he=[i for i,l in enumerate(src) if l.startswith('</header>')][0]
header='\n'.join(src[hs:he+1])
header=header.replace('<a href="./" aria-current="page" style="color:var(--ink)">События</a>','<a href="../events/">События</a>\n      <a href="./" aria-current="page" style="color:var(--ink)">Вакансии</a>')
header=header.replace('\n      <a href="../vakansii/">Вакансии</a>','')
header=header.replace('<a class="navcta" href="#add">Добавить событие</a>','<a class="navcta" href="#add">Разместить</a>')
h=h.replace('<title>События — Свои люди в Швейцарии: встречи, клубы, ретриты по кантонам</title>','<title>Вакансии и партнёрство — Свои люди в Швейцарии</title>').replace('https://svoiludi.ch/events/','https://svoiludi.ch/vakansii/')
h=re.sub(r'<meta name="description" content="[^"]*">','<meta name="description" content="Вакансии и предложения о партнёрстве от русско- и украиноязычных специалистов в Швейцарии. Бесплатно, для поддержки сообщества «Свои люди».">',h)
h=h.replace('<meta property="og:title" content="События — Свои люди в Швейцарии">','<meta property="og:title" content="Вакансии и партнёрство — Свои люди в Швейцарии">')
h=re.sub(r'<meta property="og:description" content="[^"]*">','<meta property="og:description" content="Кого ищут свои: сотрудники в команду и партнёры для общего дела. Бесплатно, для поддержки сообщества.">',h)
h=h.replace('og:image" content="https://svoiludi.ch/vakansii/og-image.jpg"','og:image" content="https://svoiludi.ch/events/og-image.jpg"')
extra=open(S+'/vak_extra.css',encoding='utf-8').read()
style=style+extra
body=open(S+'/vak_body.html',encoding='utf-8').read()
scripts=f'''<script src="/data/specialists.js?v=7fef69e3"></script>
<script src="/data/organizations.js"></script>
<script src="/data/vacancies.js"></script>
<script>window.IMG_BASE = '../img/';</script>
<script>
{js}</script>
<script src="/assets/help.js" defer></script>
<script defer src="/assets/zayavka.js"></script>
<script defer src="/assets/podtverdit.js"></script>
<script data-goatcounter="https://svoiludi.goatcounter.com/count" async src="https://gc.zgo.at/count.js"></script>
<script src="/assets/share.js" defer></script>
<script src="/assets/samesite.js"></script>
</body>
</html>
'''
page='\n'.join([h, style, '</style>', '</head>','<body>','',navchips,'',header,'',body,'',scripts])
open('vakansii/index.html','w',encoding='utf-8').write(page)
# preview
out=subprocess.run(['node','-e',"global.window={};require('./data/specialists.js');process.stdout.write(JSON.stringify(window.SPECIALISTS.filter(x=>['anna-keller','olga-marti'].includes(x.id))))"],capture_output=True,text=True).stdout
sp=json.loads(out); imgs={x['photo']:'data:image/jpeg;base64,'+base64.b64encode(open('img/'+x['photo'],'rb').read()).decode() for x in sp}
pjs=js.replace("const photoSrc = f => (window.IMG_BASE || '../img/') + f;","const photoSrc = f => (window.SP_IMG || {})[f] || f;")
assert 'window.SP_IMG' in pjs
pbody=re.sub(r'href="(\.\./|https://svoiludi\.ch/|https://voznesenskaya\.ch/)[^"]*"','href="#" data-inert',body)
pheader=re.sub(r'href="(\.\./|\./|https://voznesenskaya\.ch/)[^"]*"','href="#" data-inert',header)
banner='<div class="pv-banner" role="note"><b>Предпросмотр копии.</b> Так вкладка «Вакансии и партнёрство» будет выглядеть на svoiludi.ch. На сайт она пока не выложена, меню здесь не работает, объявления — образцы. <button type="button" id="pvAuthor">Что увидит автор при подтверждении</button> <button type="button" id="pvAdmin">Режим Ирины</button></div>'
pstyle=style+'.pv-banner{background:#2f2924;color:#FFFCF8;font-size:.86rem;line-height:1.5;padding:10px 16px;text-align:center}.pv-banner b{font-weight:800}.pv-banner button{font:inherit;font-weight:700;color:#2f2924;background:#F3E3C2;border:0;border-radius:999px;padding:4px 12px;margin:4px 2px 0;cursor:pointer}'
fonts='<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Forum&family=Manrope:wght@400;500;600;700;800&display=swap">'
wm=open('assets/wm.css',encoding='utf-8').read(); vac=open('data/vacancies.js',encoding='utf-8').read(); helpjs=open('assets/help.js',encoding='utf-8').read()
pjs=pjs.replace("const ADMIN = (() => {","let ADMIN = (() => {",1)
prev=f'''<title>Вакансии и партнёрство</title>
{fonts}
<style>{wm}</style>
{pstyle}
</style>
{banner}
{navchips}
{pheader}
{pbody}
<script>window.SPECIALISTS = {json.dumps(sp,ensure_ascii=False)};
window.SP_IMG = {json.dumps(imgs)};</script>
<script>{vac}</script>
<script>
{pjs}
document.addEventListener('click', e => {{ const a = e.target.closest('a[data-inert]'); if (a) e.preventDefault(); }});
document.getElementById('pvAuthor').onclick = () => confirmView(VACANCIES.find(v => v.id === 'obrazec-na-podtverzhdenii'));
document.getElementById('pvAdmin').onclick = e => {{ ADMIN = !ADMIN; e.target.textContent = ADMIN ? 'Режим Ирины: включён' : 'Режим Ирины'; document.getElementById('trial').hidden = !ADMIN; toast(ADMIN ? 'Открой любое объявление — внизу блок «Для Ирины».' : 'Режим Ирины выключен.'); }};
</script>
<script>{helpjs}</script>
'''
os.makedirs(S+'/prev',exist_ok=True)
open(S+'/prev/vakansii-predprosmotr.html','w',encoding='utf-8').write(prev)
print('built',len(page),len(prev))
