"""Одна команда, чтобы украинская версия svoiludi.ch оставалась зеркалом русской.
Запуск из корня репозитория:
  python3 _i18n/sync.py check        — пересобрать переведённое, непереведённое записать в _i18n/todo.json
  python3 _i18n/sync.py apply FILE   — принять переводы из FILE ({"<i>": "украинский текст"}), проверить, пересобрать
  python3 _i18n/sync.py build        — только пересобрать (ошибка, если чего-то не хватает)
Порядок работы — _i18n/README.md, правила и глоссарий — _i18n/RULES.md."""
import sys, os, re, json
sys.path.insert(0, os.path.dirname(__file__))
import pages
ROOT = pages.ROOT; I18N = pages.I18N
KNOWN = {'uk', 'assets', 'data', 'img', 'fav', 'files', '_i18n'} | {p.strip('/').split('/')[0] for _, p in pages.PAGES if p != '/'}

def new_pages():
    known = {src for src, _ in pages.PAGES}
    res = []
    for dp, dn, fn in os.walk(ROOT):
        rel = os.path.relpath(dp, ROOT)
        if rel.split(os.sep)[0] in ('uk', '_i18n', '.git', 'assets', 'data'): continue
        if 'index.html' in fn:
            src = 'index.html' if rel == '.' else rel.replace(os.sep, '/') + '/index.html'
            if src not in known: res.append(src)
    return sorted(res)

def ctx_of(u):
    for src in [src for src, _ in pages.PAGES] + ['data/specialists.js']:
        s = open(os.path.join(ROOT, src), encoding='utf-8').read()
        probe = u.split('⟦')[0][:60] or u[:60]
        k = s.find(probe)
        if k >= 0: return src, s[max(0, k - 160):k + len(u) + 160]
    return '', ''

def check():
    missing = pages.build()
    units = []
    for i, u in enumerate(missing):
        src, ctx = ctx_of(u)
        units.append({'i': i, 'ru': u, 'page': src, 'ctx': ctx})
    rep = {'units': units, 'new_pages': new_pages()}
    json.dump(rep, open(os.path.join(I18N, 'todo.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f"to translate: {len(units)} units; new pages without mirror: {rep['new_pages'] or 'none'}")
    return rep

ATTR = re.compile(r'\b(alt|title|aria-label|placeholder|content|data-[\w-]+)\s*=\s*(\\?")(.*?)\2')
def problems(ru, t):
    norm = lambda x: ATTR.sub(lambda m: m.group(1) + '=""', x)
    p = []
    if not isinstance(t, str) or not t: return ['missing']
    if sorted(re.findall(r'⟦\d+⟧', ru)) != sorted(re.findall(r'⟦\d+⟧', t)): p.append('placeholders')
    if [norm(x) for x in re.findall(r'<[^>]+>', ru)] != [norm(x) for x in re.findall(r'<[^>]+>', t)]: p.append('tags')
    if ru[:len(ru) - len(ru.lstrip())] != t[:len(t) - len(t.lstrip())] or ru[len(ru.rstrip()):] != t[len(t.rstrip()):]: p.append('whitespace')
    if "'" in t and "'" not in ru: p.append('straight apostrophe')
    if t != ru and re.search('[ыэъёЫЭЪЁ]', re.sub(r'<[^>]+>|ВСТРЕЧА|ОТЗЫВ|ЗАЯВКА|РАССЫЛКА|ПОРЯДОК', '', t)): p.append('russian letters')
    for w in pages.CODE_WORDS:
        if w in ru and w not in t: p.append('code word ' + w + ' must stay')
    return p

def apply(path):
    todo = json.load(open(os.path.join(I18N, 'todo.json'), encoding='utf-8'))['units']
    done = json.load(open(path, encoding='utf-8'))
    bad = [(t['i'], pr) for t in todo for pr in [problems(t['ru'], done.get(str(t['i'])))] if pr]
    if bad: print('NOT APPLIED, fix these:', bad[:30]); sys.exit(1)
    p = os.path.join(I18N, 'tm_uk.json'); TM = json.load(open(p, encoding='utf-8'))
    for t in todo: TM[t['ru']] = done[str(t['i'])]
    json.dump(TM, open(p, 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    print(f'applied {len(todo)} units'); build()

def build():
    m = pages.build()
    print(f'built; untranslated left: {len(m)}')
    if m: sys.exit(1)

if __name__ == '__main__':
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'check'
    {'check': check, 'build': build}.get(cmd, lambda: apply(sys.argv[2]) if cmd == 'apply' else print(__doc__))()
