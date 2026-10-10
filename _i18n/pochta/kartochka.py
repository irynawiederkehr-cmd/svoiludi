#!/usr/bin/env python3
"""Черновик карточки специалиста в data/specialists.js (скрытая, пока Ирина и специалист не подтвердят).

Запуск из корня репозитория svoiludi:
  python3 -I _i18n/pochta/kartochka.py <card.json> <фото> [--box x0,y0,x1,y1]
    card.json — карточка в формате data/specialists.js (поля описаны в шапке файла). Скрипт сам ставит:
                status «черновик» (если не задан), key (8 знаков, если нет), added/checked = сегодня, photo = <id>.jpg.
    фото      — оригинал от специалиста. Кадр 4:5 → img/<id>.jpg 480×600. Без --box — по центру сверху (лицо обычно там);
                --box задаёт область кадра в пикселях оригинала. После сборки ОБЯЗАТЕЛЬНО посмотреть img/<id>.jpg глазами.
Если карточка с таким id уже есть, она заменяется (номер SG и key сохраняются), иначе встаёт первой в списке.
Дальше: python3 _i18n/sync.py check → перевести новые строки (apply) → node _i18n/smoke.js → commit, push.
Ссылка предпросмотра: https://svoiludi.ch/#preview=<id>.<key>
Данные людей (анкеты, оригиналы фото, письма) в репозиторий НЕ кладём — только в папку специалиста на компьютере Ирины.
"""
import sys, os, json, random, string, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DATA = os.path.join(ROOT, 'data', 'specialists.js')
ANCHOR = 'window.SPECIALISTS = [\n'


def load():
    s = open(DATA, encoding='utf-8').read()
    assert s.count(ANCHOR) == 1, 'не нашла начало списка карточек'
    return s


def crop(src, dst, box=None):
    from PIL import Image, ImageOps
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    w, h = im.size
    if box:
        x0, y0, x1, y1 = box
    else:
        cw = min(w, int(h * 0.8)); ch = int(cw * 1.25)
        if ch > h: ch = h; cw = int(ch * 0.8)
        x0 = (w - cw) // 2; y0 = max(0, int((h - ch) * 0.2)); x1 = x0 + cw; y1 = y0 + ch
    im.crop((x0, y0, x1, y1)).resize((480, 600), Image.LANCZOS).save(dst, quality=86, optimize=True, progressive=True)


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        print(__doc__); sys.exit(1)
    card = json.load(open(a[0], encoding='utf-8'))
    box = None
    if '--box' in a:
        box = [int(v) for v in a[a.index('--box') + 1].split(',')]
    cid = card['id']
    today = datetime.date.today().isoformat()
    s = load()
    marker = f'"id": "{cid}"'
    old = None
    if marker in s:
        sys.path.insert(0, ROOT)
        import subprocess
        js = subprocess.run(['node', '-e', "global.window={};require(process.argv[1]);console.log(JSON.stringify(window.SPECIALISTS))", DATA],
                            capture_output=True, text=True, check=True).stdout
        old = next(x for x in json.loads(js) if x['id'] == cid)
        card.setdefault('num', old.get('num')); card.setdefault('key', old.get('key'))
    card.setdefault('status', 'черновик')
    card.setdefault('key', ''.join(random.choice(string.ascii_lowercase + string.digits) for _ in range(8)))
    card.setdefault('added', today); card['checked'] = card.get('checked') or today
    card['photo'] = f'{cid}.jpg'
    for k, v in (('paidUntil', ''), ('tiers', []), ('onlineCH', ''), ('tags', [])):
        card.setdefault(k, v)
    crop(a[1], os.path.join(ROOT, 'img', card['photo']), box)
    block = '\n'.join('  ' + l for l in json.dumps(card, ensure_ascii=False, indent=2).split('\n'))
    if old:
        # заменить старый объект: от его открывающей «{» до парной «}»
        i = s.find(marker); i = s.rfind('\n  {', 0, i) + 1
        depth = 0; j = i
        while True:
            c = s[j]
            if c == '{': depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0: break
            j += 1
        s = s[:i] + block + s[j + 1:]
    else:
        s = s.replace(ANCHOR, ANCHOR + block + ',\n')
    open(DATA, 'w', encoding='utf-8').write(s)
    print(json.dumps({'id': cid, 'num': card.get('num'), 'status': card['status'], 'key': card['key'],
                      'preview': f"https://svoiludi.ch/#preview={cid}.{card['key']}", 'photo': 'img/' + card['photo'],
                      'replaced': bool(old)}, ensure_ascii=False))


if __name__ == '__main__':
    main()
