"""Сайт как приложение (08.10.2026): в <head> каждой русской страницы из PAGES ставит блок <!--pwa-->…<!--pwa-->:
манифест, иконка и мета-теги для iPhone/iPad/Android и скрипт /assets/pwa-app.js (панель вкладок, подсказка об установке).
Украинские страницы получают его при сборке pages.py (манифест site.uk.webmanifest — в post()).
Запуск: python3 _i18n/pwa.py — ставит/обновляет; python3 _i18n/pwa.py check — страницы без блока."""
import os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from pages import PAGES, ROOT
M = '<!--pwa-->'
BLOCK = (M + '<link rel="manifest" href="/fav/site.webmanifest">'
         '<meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-capable" content="yes">'
         '<meta name="apple-mobile-web-app-title" content="Свои люди"><meta name="apple-mobile-web-app-status-bar-style" content="default">'
         '{extra}<script src="/assets/pwa-app.js" defer></script>' + M)

def apply(html):
    html = re.sub(re.escape(M) + '.*?' + re.escape(M), '', html, flags=re.S)
    html = re.sub(r'<link rel="manifest" href="[^"]*">', '', html)
    extra = ''
    if 'apple-touch-icon' not in html: extra += '<link rel="apple-touch-icon" href="/fav/apple-touch-icon.png">'
    if 'name="theme-color"' not in html: extra += '<meta name="theme-color" content="#4F5E3E">'
    b = BLOCK.format(extra=extra)
    i = html.find('<!--i18n-->'); j = html.find('</head>')
    pos = i if 0 <= i < j else j
    return html[:pos] + b + html[pos:]

if __name__ == '__main__':
    bad = []
    for src, _ in PAGES:
        p = os.path.join(ROOT, src); h = open(p, encoding='utf-8').read()
        if len(sys.argv) > 1 and sys.argv[1] == 'check':
            if M not in h: bad.append(src)
            continue
        n = apply(h)
        if n != h: open(p, 'w', encoding='utf-8').write(n)
    print('Без блока приложения:', bad) if bad else print('Блок приложения есть на всех страницах' if len(sys.argv) > 1 else 'ok')
