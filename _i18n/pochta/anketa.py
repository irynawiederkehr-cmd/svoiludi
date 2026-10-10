#!/usr/bin/env python3
"""Письмо в справочник «Свои люди»: вложения и анкета специалиста → JSON.

Запуск (из любой папки, лучше с python3 -I):
  python3 -I _i18n/pochta/anketa.py <raw.json> <папка>
    raw.json — ответ Gmail get_message с messageFormat RAW (Claude сохраняет его в файл);
    <папка>  — куда сложить вложения (scratchpad, НЕ репозиторий: данные людей в публичный репозиторий не кладём).
  python3 -I _i18n/pochta/anketa.py --docx <анкета.docx>
    только разобрать анкету Word.

Печатает JSON: заголовки письма, список вложений, поля анкеты по подписям (как в анкете на сайте join/,
RU и UA одинаково), отмеченные галочки (специализации, языки, услуги), размер и пропорции фото.
Анкета — файл _i18n/docx.py (поля — элементы управления Word с тегами f1…, d1…, cb…).
Порядок работы с письмами — документ проекта «pochta-svoiludi.md».
"""
import sys, os, json, base64, email, zipfile, re
from email import policy

NS = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
      'w14': 'http://schemas.microsoft.com/office/word/2010/wordml'}
W = '{%s}' % NS['w']
W14 = '{%s}' % NS['w14']


def save_attachments(raw_json, out):
    d = json.load(open(raw_json, encoding='utf-8'))
    raw = d['raw']
    try:
        b = base64.urlsafe_b64decode(raw + '=' * (-len(raw) % 4))
    except Exception:
        b = base64.b64decode(raw)
    m = email.message_from_bytes(b, policy=policy.default)
    os.makedirs(out, exist_ok=True)
    files = []
    for part in m.walk():
        fn = part.get_filename()
        if not fn:
            continue
        fn = re.sub(r'[\\/:*?"<>|]', '_', fn)
        data = part.get_payload(decode=True) or b''
        p = os.path.join(out, fn)
        open(p, 'wb').write(data)
        files.append({'file': p, 'name': fn, 'bytes': len(data), 'type': part.get_content_type()})
    body = m.get_body(preferencelist=('plain', 'html'))
    text = body.get_content() if body else ''
    head = {k: str(m[k] or '') for k in ('From', 'To', 'Cc', 'Date', 'Subject', 'Message-ID')}
    return head, text, files


def _text(e):
    return ''.join(t.text or '' for t in e.iter(W + 't')).replace('\xa0', ' ').strip()


def parse_docx(path):
    from lxml import etree
    z = zipfile.ZipFile(path)
    x = etree.fromstring(z.read('word/document.xml'))
    fields, checks = [], []
    # подпись поля — текст первой ячейки той же строки таблицы
    for sdt in x.iter(W + 'sdt'):
        pr = sdt.find('w:sdtPr', NS)
        if pr is None:
            continue
        tag = pr.find('w:tag', NS)
        name = tag.get(W + 'val') if tag is not None else ''
        cb = pr.find('w14:checkbox', NS)
        if cb is not None:
            continue
        content = sdt.find('w:sdtContent', NS)
        empty = pr.find('w:showingPlcHdr', NS) is not None
        val = '' if empty or content is None else _text(content)
        label = ''
        tr = sdt.getparent()
        while tr is not None and tr.tag != W + 'tr':
            tr = tr.getparent()
        if tr is not None:
            tc = tr.find('w:tc', NS)
            if tc is not None:
                label = ' / '.join(_text(p) for p in tc.findall('.//w:p', NS) if _text(p))
        fields.append({'tag': name, 'label': label, 'value': val})
    # галочки: подпись — текст сразу после галочки
    seq = []
    def walk(e):
        for c in e:
            if c.tag == W + 'sdt':
                pr = c.find('w:sdtPr', NS); cb = pr.find('w14:checkbox', NS) if pr is not None else None
                if cb is not None:
                    ch = cb.find('w14:checked', NS)
                    on = ch is not None and ch.get(W14 + 'val') in ('1', 'true')
                    tag = pr.find('w:tag', NS)
                    seq.append(('cb', tag.get(W + 'val') if tag is not None else '', on))
                    continue
                seq.append(('field', '', None))
                continue
            if c.tag == W + 't':
                seq.append(('t', c.text or '', None))
            else:
                walk(c)
    walk(x.find('w:body', NS))
    for i, (k, n, on) in enumerate(seq):
        if k != 'cb':
            continue
        lab = ''
        for k2, n2, _ in seq[i + 1:i + 8]:
            if k2 != 't':
                break
            lab += n2.replace('\xa0', ' ')
        lab = re.split(r'\s{2,}|Другой язык:|Другая:', lab.strip())[0].strip()
        if on:
            checks.append({'tag': n, 'label': lab})
    return {'fields': fields, 'checked': checks,
            'filled': {f['label'] or f['tag']: f['value'] for f in fields if f['value']}}


def photo_info(path):
    try:
        from PIL import Image, ImageOps
        im = ImageOps.exif_transpose(Image.open(path))
        w, h = im.size
        return {'width': w, 'height': h, 'ratio': round(w / h, 3),
                'ok_size': w >= 800 and h >= 1000, 'vertical': h > w}
    except Exception as e:
        return {'error': str(e)}


def main():
    a = sys.argv[1:]
    if len(a) == 2 and a[0] == '--docx':
        print(json.dumps(parse_docx(a[1]), ensure_ascii=False, indent=1)); return
    if len(a) != 2:
        print(__doc__); sys.exit(1)
    head, text, files = save_attachments(a[0], a[1])
    res = {'head': head, 'text': text.strip()[:4000], 'attachments': files, 'anketa': None, 'photos': []}
    for f in files:
        n = f['name'].lower()
        if n.endswith('.docx'):
            try:
                res['anketa'] = parse_docx(f['file'])
            except Exception as e:
                res['anketa'] = {'error': str(e), 'file': f['file']}
        elif n.endswith(('.jpg', '.jpeg', '.png', '.heic', '.webp')):
            res['photos'].append({'file': f['file'], **photo_info(f['file'])})
    print(json.dumps(res, ensure_ascii=False, indent=1))


if __name__ == '__main__':
    main()
