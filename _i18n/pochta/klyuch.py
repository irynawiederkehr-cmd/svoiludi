#!/usr/bin/env python3
"""Ключ подтверждения для ссылки из письма (11.10.2026).

Зачем. Ссылка подтверждения (svoiludi.ch/#preview=<id>.<ключ>, events/#ok=…, kursy/#ok=…, akcii/#ok=…, vakansii/#ok=…)
должна быть только у владельца карточки или записи: она приходит на e-mail из карточки. Поэтому в открытых данных сайта
(data/specialists.js, data/afisha.js, data/vacancies.js — их может прочитать любой, репозиторий тоже публичный)
хранится не ключ, а только его отпечаток keyHash = SHA-256 ключа. По отпечатку страница и скрипты Google проверяют ключ
из ссылки, а сам ключ из отпечатка получить нельзя. Так никто не подтвердит и не исправит запись за другого человека.

Запуск из корня репозитория:
  python3 -I _i18n/pochta/klyuch.py <id> [<id> …]
    Новый ключ (24 случайных знака) для карточки специалиста, события, курса, акции или объявления: пишет новый keyHash
    в данные и печатает ссылки. Старая ссылка перестаёт работать. Сам ключ нигде не сохраняется — ссылку сразу вставить
    в черновик письма. Потеряли ссылку — запустить ещё раз и отправить новую.
Дальше: python3 _i18n/sync.py build → node _i18n/smoke.js → commit, push.

  У события, курса, акции и объявления печатается и ссылка off — «Снять с сайта» (…/#off=<id>.<ключ>, тот же ключ): она идёт в письмо
  о публикации, по ней автор сам снимает запись в архив, а потом повторяет её в заявке кнопкой «Повторить» (решение Ирины 11.10.2026, 21:45).
  Ключ потерян, а ссылка подтверждения есть в переписке — ссылка «Снять с сайта» та же, только #ok= заменить на #off=.

  python3 -I _i18n/pochta/klyuch.py --check <id> <ключ или вся ссылка>
    Проверить ключ из ссылки (например, из письма «Подтверждаю карточку»): совпадает ли его отпечаток с keyHash записи.
    Ничего не меняет.

  python3 -I _i18n/pochta/klyuch.py --lead <id карточки> [<ключ или вся ссылка предпросмотра>]
    Черновики лида (правило Ирины 12.10.2026, 14:34: «всё, что мы прописываем в лидах, должно быть в черновиках размещено на сайте,
    и в письме на всё это ссылки как на образцы»): всем записям «на подтверждении» и «черновик», где эта карточка (специалист или
    организация) — организатор или автор (события, курсы, акции в data/afisha.js, объявления в data/vacancies.js), ставит тот же
    keyHash, что у карточки. Тогда одна ссылка из письма открывает и карточку, и каждую запись: …/events/#ok=<id>.<ключ карточки>,
    kursy/#ok=…, akcii/#ok=…, vakansii/#ok=…. С ключом — проверяет его по отпечатку карточки и печатает все ссылки для письма.
    Запускать после каждого нового черновика лида (Claude делает это сам, перед сборкой). Новый ключ карточки — klyuch.py <id карточки>,
    потом снова --lead.

Поле key (сам ключ) в данных запрещено: python3 _i18n/sync.py check и build останавливаются, если находят его.
kartochka.py и zapis.py ставят новый ключ сами (через функции этого файла).
"""
import sys, os, re, json, hashlib, secrets, string, subprocess

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FILES = (('spec', 'specialists.js', 'SPECIALISTS'), ('afisha', 'afisha.js', 'AFISHA'), ('vacancy', 'vacancies.js', 'VACANCIES'))
ORG = ('org', 'organizations.js', 'ORGANIZATIONS')   # карточки «Организаций»: новый ключ — тем же klyuch.py <id> (12.10.2026)
ABC = string.ascii_lowercase + string.digits


def new_key(n=24):
    return ''.join(secrets.choice(ABC) for _ in range(n))


def sha(k):
    return hashlib.sha256(k.encode('utf-8')).hexdigest()


def load(name):
    js = ("global.window={};new Function('window',require('fs').readFileSync(process.argv[1],'utf8'))(window);"
          "console.log(JSON.stringify(window[process.argv[2]]||[]))")
    out = subprocess.run(['node', '-e', js, os.path.join(ROOT, 'data', name[1]), name[2]], capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def bounds(s, i):
    """Начало и конец записи (объекта верхнего уровня в списке window.X = [ … ]), в которой стоит позиция i.
    Кавычки и комментарии учитываются; сканируем от начала списка, поэтому скобки в шапке файла не мешают."""
    j = re.search(r'\nwindow\.[A-Z_]+ = \[', s).end()
    depth = 0; q = None; o = None
    while j < len(s):
        c = s[j]
        if q:
            if c == '\\': j += 2; continue
            if c == q: q = None
        elif s.startswith('/*', j): j = s.index('*/', j) + 2; continue
        elif s.startswith('//', j): j = s.index('\n', j); continue
        elif c in '"\'`': q = c
        elif c == '{':
            if depth == 0: o = j
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0 and o is not None and o <= i <= j: return o, j
        j += 1
    raise AssertionError('не нашла границы записи')


def set_hash(path, rid, h):
    """Записать keyHash в запись с id=rid (стиль JSON "id": "…" или стиль JS id: '…'); убрать поле key, если оно есть."""
    s = open(path, encoding='utf-8').read()
    p0 = re.search(r'\nwindow\.[A-Z_]+ = \[', s).end()   # ищем только в самих данных, не в шапке файла
    mj = re.compile(r'"id":\s*"' + re.escape(rid) + '"').search(s, p0); ms = re.compile(r"\bid:\s*'" + re.escape(rid) + "'").search(s, p0)
    m = mj or ms
    assert m, f'нет записи {rid} в {os.path.basename(path)}'
    a, b = bounds(s, m.start()); rec = s[a:b + 1]
    if mj:
        rec2, n = re.subn(r'"keyHash":\s*"[0-9a-f]*"', f'"keyHash": "{h}"', rec)
        if not n: rec2, n = re.subn(r'"key":\s*"[^"]*"', f'"keyHash": "{h}"', rec)
        if not n:
            ind = re.search(r'\n([ \t]*)"id":', rec)
            pad = ind.group(1) if ind else '    '
            rec2 = re.sub(r'("id":\s*"' + re.escape(rid) + '",)', lambda x: x.group(1) + '\n' + pad + f'"keyHash": "{h}",', rec, count=1)
    else:
        rec2, n = re.subn(r"\bkeyHash:\s*'[0-9a-f]*'", f"keyHash: '{h}'", rec)
        if not n: rec2, n = re.subn(r"\bkey:\s*'[^']*'", f"keyHash: '{h}'", rec)
        if not n: rec2 = re.sub(r"(\bid:\s*'" + re.escape(rid) + "',)", lambda x: x.group(1) + f" keyHash: '{h}',", rec, count=1)
    assert rec2 != rec or f'{h}' in rec, 'не получилось записать keyHash'
    open(path, 'w', encoding='utf-8').write(s[:a] + rec2 + s[b + 1:])


def links(kind, r, k):
    i = r['id']
    if kind == 'spec':
        return {'preview': f'https://svoiludi.ch/#preview={i}.{k}', 'price': f'https://svoiludi.ch/#price={i}.{k}'}
    if kind == 'org':
        return {'preview': f'https://svoiludi.ch/organizacii/#preview={i}.{k}'}
    # off — «Снять с сайта» (решение Ирины 11.10.2026, 21:45): тот же ключ, ссылка идёт в письмо о публикации
    if kind == 'vacancy':
        return {'ok': f'https://svoiludi.ch/vakansii/#ok={i}.{k}', 'off': f'https://svoiludi.ch/vakansii/#off={i}.{k}'}
    page = 'akcii' if r.get('type') == 'promo' and r.get('promo') else ('events' if 'events' in (r.get('sections') or ['events']) else 'kursy')
    return {'ok': f'https://svoiludi.ch/{page}/#ok={i}.{k}', 'off': f'https://svoiludi.ch/{page}/#off={i}.{k}'}


def find(rid):
    for f in FILES + (ORG,):
        for r in load(f):
            if r.get('id') == rid: return f, r
    return None, None


def rekey(rid):
    f, r = find(rid)
    if not f: print(f'Нет записи с id «{rid}» ни в одном из файлов данных.'); return None
    k = new_key(); set_hash(os.path.join(ROOT, 'data', f[1]), rid, sha(k))
    who = (r.get('name') or r.get('title') or rid) + (f" ({r['num']})" if r.get('num') else '')
    to = ((r.get('contacts') or {}).get('email') or '') if f[0] in ('spec', 'org') else ''
    res = {'id': rid, 'kind': f[0], 'who': who, 'status': r.get('status'), 'sample': bool(r.get('sample')), 'links': links(f[0], r, k)}
    if to: res['to'] = to
    return res


def check(rid, k):
    k = re.split(r'[.#=]', k.strip().rstrip('/'))[-1] if ('.' in k or '#' in k) else k.strip()
    f, r = find(rid)
    if not f: print(f'Нет записи с id «{rid}».'); return False
    ok = bool(r.get('keyHash')) and sha(k) == r['keyHash']
    print(f"{rid}: {'ключ совпадает с отпечатком — ссылка настоящая' if ok else 'НЕ совпадает: ссылка старая или чужая, запись не подтверждаем'}")
    return ok


def lead(cid, k=''):
    """Черновики лида получают ключ карточки; с ключом — печатаем все ссылки."""
    import datetime
    card, cfile = None, None
    for f in (('spec', 'specialists.js', 'SPECIALISTS'), ('org', 'organizations.js', 'ORGANIZATIONS')):
        for r in load(f):
            if r.get('id') == cid: card, cfile = r, f
    if not card: print(f'Нет карточки «{cid}» ни в specialists.js, ни в organizations.js.'); return False
    h = card.get('keyHash')
    if not h: print(f'У карточки «{cid}» нет keyHash: сначала klyuch.py {cid}.'); return False
    mine = lambda o: o == cid or (isinstance(o, dict) and (o.get('org') == cid or o.get('spec') == cid))
    draft = lambda r: r.get('status') in ('на подтверждении', 'черновик') and not r.get('sample')
    today = datetime.date.today().isoformat()
    out = []
    for r in load(FILES[1]):
        if draft(r) and any(mine(o) for o in (r.get('organizers') or [])): out.append(('afisha', r))
    for r in load(FILES[2]):
        if draft(r) and mine(r.get('author')): out.append(('vacancy', r))
    changed = 0
    for kind, r in out:
        if r.get('keyHash') != h:
            set_hash(os.path.join(ROOT, 'data', 'afisha.js' if kind == 'afisha' else 'vacancies.js'), r['id'], h); changed += 1
    print(f"{card.get('name')} ({cid}): черновиков {len(out)}, ключ карточки поставлен {changed}.")
    if k:
        k = re.split(r'[.#=]', k.strip().rstrip('/'))[-1] if ('.' in k or '#' in k) else k.strip()
        if sha(k) != h: print('Ключ НЕ совпадает с отпечатком карточки: ссылки не печатаем.'); return False
        page = 'organizacii/' if cfile[0] == 'org' else ''
        print(f"Карточка: https://svoiludi.ch/{page}#preview={cid}.{k}")
        for kind, r in out:
            last = (r.get('repeat') or {}).get('until') or r.get('dateEnd') or r.get('date') or r.get('until') or ''
            past = ' (уже прошло — для примера)' if last and last < today and kind == 'afisha' else ''
            print(f"{r.get('title')}{past}: {links(kind, r, k)['ok']}")
    return True


if __name__ == '__main__':
    if len(sys.argv) in (3, 4) and sys.argv[1] == '--lead':
        sys.exit(0 if lead(sys.argv[2], sys.argv[3] if len(sys.argv) == 4 else '') else 3)
    if len(sys.argv) == 4 and sys.argv[1] == '--check':
        sys.exit(0 if check(sys.argv[2], sys.argv[3]) else 3)
    ids = [x for x in sys.argv[1:] if not x.startswith('-')]
    if not ids: print(__doc__); sys.exit(1)
    for rid in ids:
        res = rekey(rid)
        if res: print(json.dumps(res, ensure_ascii=False, indent=1))
    print('\nКлюч нигде не сохранён: ссылку — сразу в черновик письма (на e-mail из карточки). Дальше: sync.py build, smoke, commit, push.')
