#!/usr/bin/env python3
"""Письма с чистыми ссылками (12.10.2026).

Зачем. Коннектор Gmail, через который Claude готовит черновики писем, при сохранении черновика сам заменяет каждую ссылку
(и в тексте, и в HTML) на переход через Google: https://www.google.com/url?q=<настоящий адрес>&source=gmail&ust=…&sa=E.
Так он хранит и отправит письмо. Получатель тогда видит не svoiludi.ch, а google.com, сначала попадает на страницу Google
о переходе на другой сайт, а такие ссылки чаще уходят в спам. Это нарушает правило Ирины: ссылки в письмах — полностью,
с https:// и только на домены сайтов. Обойти это в самом коннекторе нельзя (проверено 12.10.2026: &#58;, HTTPS://,
голый адрес в тексте и //адрес — всё заменяется или ломается).

Поэтому к черновикам со ссылками Claude делает страницу «Письма с чистыми ссылками»: тот же текст писем, ссылки уже
настоящие, у каждого письма кнопка «Скопировать письмо» и ссылка «Открыть черновик в Gmail». Ирина копирует письмо,
в черновике щёлкает в текст, Ctrl+A, Ctrl+V — и в письме остаются настоящие ссылки (Gmail при вставке их не меняет).

Запуск из корня репозитория (данные писем в репозиторий не кладём — в них ключи предпросмотра):
  python3 -I _i18n/pochta/chistye_ssylki.py --jsonl <журнал сессии .jsonl или файл с ответом get_draft> [--jsonl …]
         [--html <id черновика>=<файл.html> …] [-o <страница.html>] [<id черновика> …]
  --jsonl  где искать ответы get_draft (messageFormat FULL_CONTENT): берётся самый свежий ответ по каждому черновику.
  --html   свой чистый HTML для черновика (например, только что написанный), вместо HTML из ответа get_draft.
  id       какие черновики взять; без id — все найденные с «Свои люди» / «Свої люди» в теме.
Страницу кладём на компьютер Ирины: «Coaching - my business\\25 Продвижение — воронка, каналы, встречи\\Письма с чистыми
ссылками.html» (обновлять после каждого нового или изменённого черновика со ссылками).
"""
import argparse, html, json, re, sys, urllib.parse
from datetime import datetime
from zoneinfo import ZoneInfo

WRAP = re.compile(r'https://www\.google\.com/url\?q=[^"\s<>]+?(?:&amp;|&)sa=E')


def unwrap_one(u):
    raw = html.unescape(u)
    q = urllib.parse.parse_qs(urllib.parse.urlsplit(raw).query).get('q')
    return q[0] if q else raw


def unwrap(s):
    """Заменяет все переходы google.com/url?q=… на настоящие адреса (в href — с экранированием для HTML)."""
    s = re.sub(r'href="(https://www\.google\.com/url\?[^"]+)"',
               lambda m: 'href="%s"' % html.escape(unwrap_one(m.group(1)), quote=True), s)
    return WRAP.sub(lambda m: html.escape(unwrap_one(m.group(0)), quote=False), s)


def iter_results(path):
    """Ответы get_draft из журнала сессии (.jsonl) или из файла с одним ответом / списком."""
    txt = open(path, encoding='utf-8').read()
    try:
        d = json.loads(txt)
        items = d.get('drafts') if isinstance(d, dict) and 'drafts' in d else (d if isinstance(d, list) else [d])
        for x in items:
            if isinstance(x, dict) and x.get('htmlBody'):
                yield x
        return
    except Exception:
        pass
    for line in txt.splitlines():
        if '"htmlBody"' not in line:
            continue
        try:
            o = json.loads(line)
        except Exception:
            continue
        for b in (o.get('message') or {}).get('content') or []:
            if not isinstance(b, dict) or b.get('type') != 'tool_result':
                continue
            c = b.get('content')
            texts = [c] if isinstance(c, str) else [x.get('text', '') for x in (c or []) if isinstance(x, dict)]
            for t in texts:
                try:
                    r = json.loads(t)
                except Exception:
                    continue
                if isinstance(r, dict) and r.get('htmlBody') and r.get('id'):
                    yield r


PAGE = """<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Письма с чистыми ссылками</title>
<style>
:root{--bg:#f6f4ef;--card:#fff;--ink:#222;--muted:#666;--line:#ddd6c8;--accent:#5f7a5a}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 Arial,Helvetica,sans-serif}
main{max-width:860px;margin:0 auto;padding:16px}
h1{font-size:22px;margin:8px 0 4px}.muted{color:var(--muted)}
.steps{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 16px;margin:12px 0}
.steps ol{margin:6px 0 0 20px;padding:0}
.letter{background:var(--card);border:1px solid var(--line);border-radius:10px;margin:18px 0;overflow:hidden}
.head{padding:12px 16px;border-bottom:1px solid var(--line);display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center}
.head .who{flex:1 1 300px}.head b{display:block}
button,.open{font:inherit;border:1px solid var(--accent);border-radius:8px;padding:8px 14px;cursor:pointer;text-decoration:none}
button{background:var(--accent);color:#fff}.open{color:var(--accent);background:#fff}
.ok{color:var(--accent);font-weight:bold;min-width:90px}
.body{padding:12px 16px;max-height:420px;overflow:auto;word-break:break-word}
details summary{cursor:pointer;color:var(--muted);padding:8px 16px}
</style></head><body><main>
<h1>Письма 🌿 «Свои люди» с чистыми ссылками</h1>
<p class="muted">Собрано {when}. Черновики в Gmail сохраняют ссылки через google.com. Получатель сначала увидел бы страницу Google о переходе на другой сайт, а такие письма чаще попадают в спам. Здесь те же письма с настоящими ссылками на svoiludi.ch.</p>
<div class="steps"><b>Перед отправкой каждого письма</b><ol>
<li>Нажми «Скопировать письмо».</li>
<li>Нажми «Открыть черновик в Gmail».</li>
<li>Щёлкни в текст письма, нажми Ctrl+A, потом Ctrl+V. Текст заменится тем же, но со ссылками на svoiludi.ch.</li>
<li>В поле «От» выбери voznesenskaya.iryna@gmail.com, приложи картинки из папки приглашения и отправь.</li>
</ol><p class="muted">Если черновик меняли после {when}, сначала попроси Claude обновить эту страницу.</p></div>
{letters}
</main><script>
function cp(i){var el=document.getElementById('b'+i),ok=document.getElementById('k'+i);
 function done(){ok.textContent='Скопировано';setTimeout(function(){ok.textContent=''},4000)}
 function old(){var r=document.createRange();r.selectNodeContents(el);var s=getSelection();s.removeAllRanges();s.addRange(r);
  try{document.execCommand('copy');done()}catch(e){ok.textContent='Выдели текст и нажми Ctrl+C'}s.removeAllRanges()}
 try{if(window.ClipboardItem&&navigator.clipboard&&navigator.clipboard.write){
  navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([el.innerHTML],{type:'text/html'}),'text/plain':new Blob([el.innerText],{type:'text/plain'})})]).then(done,old)}
  else old()}catch(e){old()}}
</script></body></html>"""

LETTER = """<section class="letter"><div class="head"><div class="who"><b>{subject}</b><span class="muted">Кому: {to}</span></div>
<button type="button" onclick="cp({i})">Скопировать письмо</button><a class="open" href="{view}" target="_blank" rel="noopener">Открыть черновик в Gmail</a><span class="ok" id="k{i}"></span></div>
<div class="body" id="b{i}">{body}</div>
<details><summary>Ссылки в этом письме ({n})</summary><ul>{links}</ul></details></section>"""


def body_of(h):
    m = re.search(r'<body[^>]*>(.*)</body>', h, re.S | re.I)
    return m.group(1) if m else h


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--jsonl', action='append', default=[])
    ap.add_argument('--html', action='append', default=[])
    ap.add_argument('-o', default='Письма с чистыми ссылками.html')
    ap.add_argument('ids', nargs='*')
    a = ap.parse_args()
    found = {}
    for p in a.jsonl:
        for r in iter_results(p):
            found[r['id']] = r  # более поздний ответ перекрывает ранний
    own = dict(x.split('=', 1) for x in a.html)
    ids = a.ids or [k for k, v in found.items() if re.search('Сво[иї] люди', v.get('subject', ''))]
    ids.sort(key=lambda k: found.get(k, {}).get('date', ''), reverse=True)
    out, bad = [], []
    for i, k in enumerate(ids):
        r = found.get(k)
        if not r:
            bad.append(k)
            continue
        h = open(own[k], encoding='utf-8').read() if k in own else r['htmlBody']
        b = unwrap(body_of(h))
        if 'google.com/url' in b:
            sys.exit('В письме %s остались ссылки через google.com' % k)
        links = [html.unescape(u) for u in re.findall(r'href="([^"]+)"', b)]
        out.append(LETTER.format(i=i, subject=html.escape(r.get('subject', '')), to=html.escape(', '.join(r.get('toRecipients') or [])),
                                 view=html.escape(r.get('viewUrl', 'https://mail.google.com/mail/#drafts'), quote=True), body=b,
                                 n=len(links), links=''.join('<li>%s</li>' % html.escape(u) for u in links)))
    if bad:
        sys.exit('Нет ответа get_draft для: ' + ', '.join(bad))
    when = datetime.now(ZoneInfo('Europe/Zurich')).strftime('%d.%m.%Y, %H:%M')
    open(a.o, 'w', encoding='utf-8').write(PAGE.replace('{when}', when).replace('{letters}', '\n'.join(out)))
    print('писем:', len(out), '→', a.o)


if __name__ == '__main__':
    main()
