"""Одна и та же шапка на ВСЕХ страницах svoiludi.ch (замечание Ирины 09.10.2026: «на разных страницах меню сверху разное»).
Логотип, меню из 7 пунктов в одном порядке, «Поиск» (ставит assets/sitesearch.js) и кнопка «Разместиться».
Текущий раздел выделен (aria-current). У страниц без шапки (инструменты, политика) шапка вставляется сразу после <body>.
Стили шапки — блок <style id="sl-top"> в <head> (ставит pwa.py вместе с блоком приложения), шапка всегда поверх
содержимого страницы (z-index 40: раньше веер страниц инструментов наезжал на меню).
Пункты меню: если в ветке есть _i18n/struktura_src/nav.py (новое устройство сайта, ветка kopiya-struktura) — берутся оттуда
(ITEMS, без «Сайт Ирины»), иначе — список NAV ниже. Так после слияния новое меню само встанет на все страницы, включая инструменты.
Вызывается из _i18n/pwa.py для каждой русской страницы из PAGES; украинские получают её при сборке pages.py."""
import re

NAV = [('', 'Специалисты'), ('events/', 'События'), ('kursy/', 'Курсы'), ('shveycariya/', 'Как устроена Швейцария'),
       ('instrumenty/', 'Полезные инструменты'), ('join/', 'Как разместиться')]
IRINA = ('https://voznesenskaya.ch/', 'Сайт Ирины')
CTA = ('join/', 'Разместиться')

MARK_SVG = None


def _mark(root_html):
    global MARK_SVG
    if MARK_SVG is None:
        MARK_SVG = re.search(r'<span class="mono av">.*?</span>', root_html, re.S).group(0)
    return MARK_SVG


def _struktura():
    import os, importlib.util
    f = os.path.join(os.path.dirname(__file__), 'struktura_src', 'nav.py')
    if not os.path.isfile(f):
        return None
    spec = importlib.util.spec_from_file_location('struktura_nav', f); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m.ITEMS


def header(url, home_html):
    depth = len([x for x in url.strip('/').split('/') if x])
    up = '../' * depth
    sec = url.strip('/').split('/')[0] + '/' if url.strip('/') else ''
    rel = (url.strip('/') + '/index.html') if url.strip('/') else 'index.html'
    home = up or './'
    items = []
    S = _struktura()
    if S:
        for href, name, cur in S:
            items.append(f'      <a href="{(up + href) or "./"}"' + (' aria-current="page"' if cur(rel) else '') + f'>{name}</a>')
    else:
        for href, name in NAV:
            cur = (sec == href) if href else (url == '/')
            link = (up + href) or './'
            items.append(f'      <a href="{link}"' + (' aria-current="page"' if cur else '') + f'>{name}</a>')
        items.append(f'      <a href="{IRINA[0]}">{IRINA[1]}</a>')
    cta = '#form' if sec == 'join/' else up + CTA[0]
    return ('<header class="top">\n  <div class="page">\n'
            f'    <a class="mark" href="{home}" aria-label="Свои люди в Швейцарии — в начало">\n'
            f'      {_mark(home_html)}\n'
            '      <span><b>Свои люди</b><small>в Швейцарии</small></span>\n    </a>\n'
            '    <nav aria-label="Разделы">\n' + '\n'.join(items) + '\n    </nav>\n'
            f'    <a class="navcta" href="{cta}">{CTA[1]}</a>\n  </div>\n</header>')


# Стили шапки для любой страницы (у части страниц своих стилей шапки нет). Всё внутри header.top — на страницу не влияет.
CSS = ('<style id="sl-top">/* единая шапка svoiludi.ch (09.10.2026), собирается _i18n/topnav.py */'
       'header.top{position:sticky;top:env(safe-area-inset-top,0px);z-index:40;background:color-mix(in srgb,var(--bg,#EEF1E6) 92%,transparent);'
       '-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--line,#D9DFCB);font-family:"Manrope","Segoe UI",system-ui,sans-serif;line-height:1.5;margin:0}'
       'header.top .page{max-width:1120px;margin:0 auto;padding-inline:20px;display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:12px;box-sizing:border-box;width:auto}'
       'header.top .mark{display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--ink,#2F2924)}'
       'header.top .mono{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;flex:none}'
       'header.top .mono.av{border:none;padding:0}header.top .mono.av svg{width:100%;height:100%;display:block}'
       'header.top .mark b{font-family:"Forum","Cormorant Garamond",Georgia,serif;font-weight:400;font-size:1.25rem;line-height:1;color:var(--ink,#2F2924)}'
       'header.top .mark small{display:block;font-size:.72rem;color:var(--muted,#7A6E62);letter-spacing:.04em;margin-top:3px}'
       'header.top nav{display:flex;gap:22px;font-size:.88rem;font-weight:600;margin:0;padding:0}'
       'header.top nav a{text-decoration:none;color:var(--muted,#7A6E62)}header.top nav a:hover{color:var(--ink,#2F2924)}'
       'header.top nav a[aria-current="page"]{color:var(--ink,#2F2924)}'
       'header.top .navcta{font-size:.86rem;font-weight:700;text-decoration:none;border:1.5px solid #4F5E3E;color:#4F5E3E;background:transparent;border-radius:12px;padding:8px 16px;white-space:nowrap}'
       '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) header.top .navcta{border-color:#B9C69F;color:#B9C69F}}'
       ':root[data-theme="dark"] header.top .navcta{border-color:#B9C69F;color:#B9C69F}'
       '@media (max-width:1100px){header.top{position:static}}'
       '@media (max-width:420px){header.top .page{padding-block:8px;gap:8px}header.top .mono{width:32px;height:32px}header.top .mark{gap:8px}'
       'header.top .mark b{font-size:1.06rem}header.top .mark small{display:none}header.top .navcta{font-size:.8rem;padding:6px 11px}}'
       '@media print{header.top{display:none!important}}'
       '</style>')


def apply(html, url, home_html):
    h = header(url, home_html)
    if re.search(r'<header class="top">', html):
        return re.sub(r'<header class="top">.*?</header>', lambda m: h, html, count=1, flags=re.S)
    m = re.search(r'<body[^>]*>', html)
    return html[:m.end()] + '\n' + h + '\n' + html[m.end():]
