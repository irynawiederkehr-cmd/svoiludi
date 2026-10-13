# Штамп «ЗРАЗОК» только на свободное место (13.10.2026, Ирина: «текст как-то некрасиво размещён»).
# Ищем самое большое положение штампа, при котором он не задевает ни текст, ни QR, ни фото, ни плашки.
import io, os, glob, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from scipy.signal import fftconvolve
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
import pypdfium2 as pdfium

# Запуск: python3 -I _i18n/shtamp_zrazok.py <папка с файлами> <папка для файлов со штампом> [uk|ru]
# Берёт все PNG и PDF из первой папки и кладёт копии «…-ZRAZOK» во вторую. Штамп — на языке письма (uk по умолчанию).
SRC, OUT = (sys.argv[1].rstrip('/') + '/', sys.argv[2].rstrip('/') + '/') if len(sys.argv) > 2 else ('pw/obrazci/', 'zrazok/')
LANG = sys.argv[3] if len(sys.argv) > 3 else 'uk'
B = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
RED = (184, 71, 46)
ANG = 11

def stamp_img(w):
    big = ImageFont.truetype(B, int(w * 0.16)); small = ImageFont.truetype(B, int(w * 0.036))
    t1, t2 = ('ЗРАЗОК', 'ПРОБНИЙ ВАРІАНТ · ЩЕ НЕ НА САЙТІ') if LANG == 'uk' else ('ОБРАЗЕЦ', 'ПРОБНЫЙ ВАРИАНТ · ЕЩЁ НЕ НА САЙТЕ')
    d0 = ImageDraw.Draw(Image.new('RGBA', (10, 10)))
    b1 = d0.textbbox((0, 0), t1, font=big); b2 = d0.textbbox((0, 0), t2, font=small)
    tw = max(b1[2] - b1[0], b2[2] - b2[0]); pad = int(w * 0.04)
    W = tw + pad * 2; H = (b1[3] - b1[1]) + (b2[3] - b2[1]) + pad * 3
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    col = RED + (150,); lw = max(3, int(w * 0.008))
    d.rounded_rectangle([lw, lw, W - lw, H - lw], radius=int(w * 0.03), outline=col, width=lw)
    d.rounded_rectangle([lw * 3, lw * 3, W - lw * 3, H - lw * 3], radius=int(w * 0.022), outline=col, width=max(2, lw // 2))
    d.text(((W - (b1[2] - b1[0])) / 2 - b1[0], pad - b1[1]), t1, font=big, fill=col)
    d.text(((W - (b2[2] - b2[0])) / 2 - b2[0], pad * 2 + (b1[3] - b1[1]) - b2[1]), t2, font=small, fill=col)
    return im.rotate(ANG, expand=True, resample=Image.BICUBIC)

def busy_mask(page_rgb, work_w=500):
    """что на странице занято: тёмный текст, цветные элементы, фото, QR, края плашек. Бледный водяной знак не считается."""
    sc = work_w / page_rgb.width
    im = page_rgb.resize((work_w, int(page_rgb.height * sc)), Image.LANCZOS)
    a = np.asarray(im).astype(int)
    g = a.mean(2); sat = a.max(2) - a.min(2)
    edges = np.asarray(im.convert('L').filter(ImageFilter.FIND_EDGES)).astype(int)
    busy = (g < 205) | (sat > 45) | (edges > 28)
    # запас вокруг занятого, чтобы штамп не прилипал к тексту
    m = Image.fromarray((busy * 255).astype('uint8')).filter(ImageFilter.MaxFilter(9))
    return np.asarray(m) > 0, sc

def best_place(page_rgb, fracs):
    busy, sc = busy_mask(page_rgb)
    H, W = busy.shape
    margin = int(W * 0.03)
    for fr in fracs:                      # от большого штампа к маленькому
        big = stamp_img(1200)
        sw = int(W * fr); sh = int(big.height * sw / big.width)
        if sh >= H - 2 * margin: continue
        m = np.asarray(big.resize((sw, sh)).split()[3]) > 20
        # сколько занятых точек окажется под штампом в каждом положении
        ov = fftconvolve(busy.astype(float), m[::-1, ::-1].astype(float), mode='valid')
        ov = np.rint(ov)
        ov[:margin, :] = 1e9; ov[:, :margin] = 1e9
        ov[ov.shape[0] - margin:, :] = 1e9; ov[:, ov.shape[1] - margin:] = 1e9
        y, x = np.unravel_index(np.argmin(ov), ov.shape)
        if ov[y, x] <= m.sum() * 0.004:
            # среди свободных положений берём то, что ближе к центру свободного места
            free = ov <= m.sum() * 0.004
            ys, xs = np.nonzero(free); cy, cx = ys.mean(), xs.mean()
            k = np.argmin((ys - cy) ** 2 + (xs - cx) ** 2); y, x = ys[k], xs[k]
            return dict(frac=fr, x=x / W, y=y / H, w=sw / W, h=sh / H, overlap=int(ov[y, x]))
    return None

FRACS = [0.62, 0.56, 0.5, 0.45, 0.4, 0.36, 0.32, 0.29, 0.26]
os.makedirs(OUT, exist_ok=True)
report = []
for f in sorted(glob.glob(SRC + '*.png')):
    im = Image.open(f).convert('RGB'); pl = best_place(im, FRACS)
    name = os.path.basename(f).replace('.png', '-ZRAZOK.png')
    if not pl: report.append((name, 'НЕТ МЕСТА')); continue
    st = stamp_img(int(im.width * pl['w'] * 1.0 / 1.0 * 1)).resize((int(im.width * pl['w']), int(im.height * pl['h'])), Image.LANCZOS)
    out = im.convert('RGBA'); out.alpha_composite(st, (int(im.width * pl['x']), int(im.height * pl['y'])))
    out.convert('RGB').save(OUT + name, optimize=True); report.append((name, pl))
for f in sorted(glob.glob(SRC + '*.pdf')):
    r = PdfReader(f); w = PdfWriter(); doc = pdfium.PdfDocument(f)
    for i, pg in enumerate(r.pages):
        pw, ph = float(pg.mediabox.width), float(pg.mediabox.height)
        ras = doc[i].render(scale=1.5).to_pil().convert('RGB')
        pl = best_place(ras, FRACS)
        if not pl: report.append((os.path.basename(f), i, 'НЕТ МЕСТА')); w.add_page(pg); continue
        st = stamp_img(1600); bio = io.BytesIO(); st.save(bio, 'PNG'); bio.seek(0)
        sw, sh = pw * pl['w'], ph * pl['h']; x = pw * pl['x']; y = ph - ph * pl['y'] - sh
        buf = io.BytesIO(); c = canvas.Canvas(buf, pagesize=(pw, ph)); c.drawImage(ImageReader(bio), x, y, sw, sh, mask='auto'); c.save(); buf.seek(0)
        pg.merge_page(PdfReader(buf).pages[0]); w.add_page(pg); report.append((os.path.basename(f), i, pl))
    w.write(OUT + os.path.basename(f).replace('.pdf', '-ZRAZOK.pdf'))
for x in report: print(x)
