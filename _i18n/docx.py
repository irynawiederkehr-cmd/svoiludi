"""Украинская копия Word-файлов сайта: join/files/anketa.docx → join/files/anketa.uk.docx.
Тексты берутся из той же памяти переводов (_i18n/tm_uk.json), поэтому галочки, которые ставит страница, совпадают с подписями в файле."""
import os, re, json, zipfile, html as H
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ['join/files/anketa.docx']
PARTS = re.compile(r'word/(document|footer\d*|header\d*|footnotes|endnotes|comments)\.xml$')
CYR = re.compile('[А-яЁё]')
def tr_text(t, TM, missing):
    raw = H.unescape(t)
    core = raw.strip()
    if not CYR.search(core): return t
    key = core.replace('\xa0', ' ')
    if key not in TM:
        if key not in missing: missing.append(key)
        return t
    v = TM[key]
    if '\xa0' in core:   # неразрывные пробелы там же, где в оригинале: между всеми словами
        v = v.replace(' ', '\xa0')
    lead = raw[:len(raw) - len(raw.lstrip())]; tail = raw[len(raw.rstrip()):]
    return H.escape(lead + v + tail, quote=False)
def translate_xml(x, TM, missing):
    x = re.sub(r'(<w:t(?:\s[^>]*)?>)([^<]*)(</w:t>)', lambda m: m.group(1) + tr_text(m.group(2), TM, missing) + m.group(3), x)
    x = re.sub(r'(w:(?:displayText|value)="|<w:alias w:val=")([^"]*)(")', lambda m: m.group(1) + tr_text(m.group(2), TM, missing).replace('"', '&quot;') + m.group(3), x)
    return x
def build(TM):
    missing = []
    for f in FILES:
        src = os.path.join(ROOT, f); dst = src[:-5] + '.uk.docx'
        zin = zipfile.ZipFile(src)
        parts = {n: zin.read(n) for n in zin.namelist()}
        out = {}
        for n, data in parts.items():
            out[n] = translate_xml(data.decode('utf-8'), TM, missing).encode('utf-8') if PARTS.search(n) else data
        if missing: continue
        old = None
        if os.path.exists(dst):
            zo = zipfile.ZipFile(dst); old = {n: zo.read(n) for n in zo.namelist()}
        if old != out:
            with zipfile.ZipFile(dst, 'w', zipfile.ZIP_DEFLATED) as z:
                for info in zin.infolist(): z.writestr(info, out[info.filename])
    return missing
if __name__ == '__main__':
    TM = json.load(open(os.path.join(ROOT, '_i18n', 'tm_uk.json'), encoding='utf-8'))
    m = build(TM); print('untranslated:', len(m), m[:5])
