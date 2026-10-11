/* Флаер акции и сердечки (решение Ирины 11.10.2026, 19:16: «кнопка скачать флаер… png размером для мобильного телефона с данными автора акции
   и условиями и датой сроков… карточку сделай с сердечками, с любовью к клиентам… о своих людях с водяными знаками… игровые варианты»).
   Всё считается в браузере человека, на сервер ничего не уходит.
   window.SVL_FLYER.open(o)  — собирает PNG 1080×1920 (экран телефона) и показывает его в окне с кнопками «Скачать на телефон» и «Отправить подруге».
   window.SVL_FLYER.burst(el) — несколько сердечек из места нажатия (не показываются, если у человека включено «уменьшить движение»).
   o: { id, big, title, sub, more[], conds[], days, until, who, role, place, signup, c:{tel,wa,tg,mail,ig,link}, url, sample }
   Язык: по <html lang>. Знак «Свои люди · svoiludi.ch» и строка «Создано на сайте проекта «Свои люди»» — по правилу проекта для PNG svoiludi.ch.
   Изменить вид флаера — только здесь; после правки пересобрать превью «Копии» и (если меняется текст) проверить русский и украинский. */
(function(){
  'use strict';
  var W = 1080, H = 1920;
  var C = { sage: '#4F5E3E', sageSoft: '#E3E8D6', paper: '#FFFCF8', ink: '#2F2924', muted: '#6F6458', red: '#B8472E', pink: '#F7E4DC', rose: '#D9768A', mustard: '#B98324', mustardSoft: '#F3E3C2', line: '#E5D9C9' };
  var T = {
    ru: {
      brand: 'Свои люди', brand2: 'в Швейцарии', kicker: 'АКЦИЯ ДЛЯ ТЕБЯ', ad: 'Реклама', sample: 'ОБРАЗЕЦ · всё вымышленное',
      care: ['Мы думаем о тебе и хотим, чтобы в новой стране было чуть легче.', 'Ты не одна: свои рядом и рады помочь.', 'Заботься о себе, ты этого заслуживаешь.', 'Небольшой подарок от своих, только для тебя.'],
      cond: 'УСЛОВИЯ', term: 'СРОК АКЦИИ', by: 'КТО ОБЪЯВИЛ АКЦИЮ', signup: 'Записаться: ',
      ch: { wa: 'WhatsApp', tg: 'Telegram', mail: 'e-mail', tel: 'телефон или SMS', ig: 'Instagram', link: 'по ссылке', none: 'без записи' },
      lab: { tel: 'Телефон', wa: 'WhatsApp', tg: 'Telegram', mail: 'E-mail', ig: 'Instagram', link: 'Сайт' },
      show: 'Покажи этот листок при записи или визите', check: 'Проверь, что акция действует',
      disc: 'Акцию объявляет и выполняет её автор. «Свои люди» не продают услугу и не отвечают за условия: уточни их у автора.',
      made: 'Создано на сайте проекта «Свои люди»', wm: 'Свои люди · svoiludi.ch',
      h: 'Твой флаер готов', p: 'Сохрани его на телефон и покажи при записи или визите. Сердечки в нём для тебя.', dl: 'Скачать на телефон', sh: 'Отправить подруге', cl: 'Закрыть',
      busy: 'Готовлю флаер…', err: 'Не получилось собрать флаер. Попробуй ещё раз.', ok: 'Флаер готов. Покажи его при записи ♡', fname: 'svoi-lyudi-akciya-'
    },
    uk: {
      brand: 'Свої люди', brand2: 'у Швейцарії', kicker: 'АКЦІЯ ДЛЯ ТЕБЕ', ad: 'Реклама', sample: 'ЗРАЗОК · усе вигадане',
      care: ['Ми думаємо про тебе й хочемо, щоб у новій країні було трохи легше.', 'Ти не сама: свої поруч і раді допомогти.', 'Дбай про себе, ти на це заслуговуєш.', 'Невеликий подарунок від своїх, тільки для тебе.'],
      cond: 'УМОВИ', term: 'ТЕРМІН АКЦІЇ', by: 'ХТО ОГОЛОСИВ АКЦІЮ', signup: 'Записатися: ',
      ch: { wa: 'WhatsApp', tg: 'Telegram', mail: 'e-mail', tel: 'телефон або SMS', ig: 'Instagram', link: 'за посиланням', none: 'без запису' },
      lab: { tel: 'Телефон', wa: 'WhatsApp', tg: 'Telegram', mail: 'E-mail', ig: 'Instagram', link: 'Сайт' },
      show: 'Покажи цей листок під час запису або візиту', check: 'Перевір, що акція діє',
      disc: 'Акцію оголошує й виконує її автор. «Свої люди» не продають послугу й не відповідають за умови: уточни їх в автора.',
      made: 'Створено на сайті проєкту «Свої люди»', wm: 'Свої люди · svoiludi.ch',
      h: 'Твій флаєр готовий', p: 'Збережи його на телефон і покажи під час запису або візиту. Серденька в ньому для тебе.', dl: 'Завантажити на телефон', sh: 'Надіслати подрузі', cl: 'Закрити',
      busy: 'Готую флаєр…', err: 'Не вдалося зібрати флаєр. Спробуй ще раз.', ok: 'Флаєр готовий. Покажи його під час запису ♡', fname: 'svoi-lyudi-akciya-'
    }
  };
  var lang = function(){ return /^uk/i.test(document.documentElement.lang || '') ? 'uk' : 'ru'; };
  var FF = '"Forum","Cormorant Garamond",Georgia,serif', FB = '"Manrope","Segoe UI",system-ui,sans-serif';

  /* ---------- рисование ---------- */
  function heart(ctx, cx, cy, s, fill, alpha, rot){
    ctx.save(); ctx.translate(cx, cy); if (rot) ctx.rotate(rot); ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = fill;
    ctx.beginPath(); ctx.moveTo(0, s * 0.92);
    ctx.bezierCurveTo(-s * 1.45, s * 0.05, -s * 0.98, -s * 1.02, 0, -s * 0.38);
    ctx.bezierCurveTo(s * 0.98, -s * 1.02, s * 1.45, s * 0.05, 0, s * 0.92);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function rrect(ctx, x, y, w, h, r){
    r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  /* перенос по словам; слишком длинное слово режется по буквам; больше maxL строк — последняя обрезается «…» */
  function wrap(ctx, text, maxW, maxL){
    var words = String(text == null ? '' : text).replace(/\s+/g, ' ').trim().split(' '), out = [], cur = '';
    var fit = function(w){ while (ctx.measureText(w).width > maxW && w.length > 1){ var n = w.length; while (n > 1 && ctx.measureText(w.slice(0, n)).width > maxW) n--; out.push(w.slice(0, n)); w = w.slice(n); } return w; };
    words.forEach(function(w){
      if (!w) return;
      var t = cur ? cur + ' ' + w : w;
      if (ctx.measureText(t).width <= maxW) cur = t; else { if (cur) out.push(cur); cur = fit(w); }
    });
    if (cur) out.push(cur);
    if (maxL && out.length > maxL){ out = out.slice(0, maxL); var l = out[maxL - 1]; while (l.length > 1 && ctx.measureText(l + '…').width > maxW) l = l.slice(0, -1); out[maxL - 1] = l.replace(/[\s,.;:]+$/, '') + '…'; }
    return out;
  }
  /* цвет фона на высоте y: так же, как градиент в paint() — им закрашиваем «надрезы» перфорации */
  function bgAt(y){ var t = Math.max(0, Math.min(1, y / H)), a = t < 0.55 ? [[246, 241, 228], [243, 235, 221], t / 0.55] : [[243, 235, 221], [241, 223, 215], (t - 0.55) / 0.45];
    return 'rgb(' + [0, 1, 2].map(function(i){ return Math.round(a[0][i] + (a[1][i] - a[0][i]) * a[2]); }).join(',') + ')'; }
  function seeded(str){ var h = 2166136261; for (var i = 0; i < str.length; i++){ h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function(){ h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; }; }

  /* блоки карточки: считаем высоту при множителе k, потом рисуем */
  function build(ctx, o, t, k){
    var IW = 808, bl = [], total = 0;
    var font = function(w, px, fam){ return w + ' ' + Math.round(px * k) + 'px ' + fam; };
    var add = function(h, fn, gap){ total += gap || 0; bl.push({ y: total, fn: fn }); total += h; };
    var text = function(str, w, px, fam, col, maxL, lh, gap, dx, maxW){
      ctx.font = font(w, px, fam); var L = wrap(ctx, str, (maxW || IW) - (dx || 0), maxL), step = Math.round(px * k * lh);
      if (!L.length) return;
      add(step * L.length, function(c, x, y){ c.font = font(w, px, fam); c.fillStyle = col; c.textBaseline = 'alphabetic'; L.forEach(function(s, i){ c.fillText(s, x + (dx || 0), y + step * i + Math.round(px * k * 0.86)); }); }, gap);
    };
    if (o.sample) add(Math.round(54 * k), function(c, x, y){ c.font = font('800', 26, FB); var w = c.measureText(t.sample).width + 48 * k; rrect(c, x, y, w, 54 * k, 27 * k); c.fillStyle = C.mustardSoft; c.fill(); c.fillStyle = '#7A5A12'; c.textBaseline = 'middle'; c.fillText(t.sample, x + 24 * k, y + 28 * k); });
    /* крупное предложение */
    var bp = 168 * k, bigS = String(o.big || '');
    ctx.font = '400 ' + Math.round(bp) + 'px ' + FF; while (ctx.measureText(bigS).width > IW - 90 && bp > 60){ bp -= 6; ctx.font = '400 ' + Math.round(bp) + 'px ' + FF; }
    var bw = ctx.measureText(bigS).width + 90, bh = Math.round(bp * 1.22) + 12;
    add(bh, function(c, x, y){ rrect(c, x, y, bw, bh, 34 * k); c.fillStyle = C.pink; c.fill(); c.font = '400 ' + Math.round(bp) + 'px ' + FF; c.fillStyle = C.red; c.textBaseline = 'alphabetic'; c.fillText(bigS, x + 45, y + bh - Math.round(bp * 0.27)); heart(c, x + bw - 6, y + 4, 20 * k, C.rose, 1, 0.35); }, o.sample ? 24 * k : 0);
    text(o.title, '400', 62, FF, C.ink, 3, 1.14, 34 * k);
    text(o.sub, '600', 38, FB, C.ink, 3, 1.35, 12 * k);
    (o.more || []).slice(0, 2).forEach(function(m){ text(m, '500', 33, FB, C.muted, 2, 1.35, 6 * k); });
    /* слова заботы */
    var care = t.care[(parseInt(o.hash || 0, 10) || 0) % t.care.length];
    ctx.font = font('400', 44, FF); var cl = wrap(ctx, care, IW - 118, 3), cs = Math.round(44 * k * 1.24), ch = cl.length * cs + 52 * k;
    add(ch, function(c, x, y){ rrect(c, x, y, IW, ch, 30 * k); c.fillStyle = C.mustardSoft; c.fill(); heart(c, x + 44 * k, y + ch / 2, 17 * k, C.rose, 1);
      c.font = font('400', 44, FF); c.fillStyle = C.sage; c.textBaseline = 'alphabetic'; cl.forEach(function(s, i){ c.fillText(s, x + 86 * k, y + 26 * k + cs * i + Math.round(44 * k * 0.86)); }); }, 34 * k);
    /* условия */
    var cd = (o.conds || []).slice(0, 5);
    if (cd.length){
      text(t.cond, '800', 25, FB, C.muted, 1, 1.2, 34 * k);
      cd.forEach(function(s){
        ctx.font = font('600', 35, FB); var L = wrap(ctx, s, IW - 58, 2), st = Math.round(35 * k * 1.3);
        add(st * L.length, function(c, x, y){ heart(c, x + 14 * k, y + st * 0.52, 11 * k, C.rose, 1); c.font = font('600', 35, FB); c.fillStyle = C.ink; c.textBaseline = 'alphabetic'; L.forEach(function(q, i){ c.fillText(q, x + 44 * k, y + st * i + Math.round(35 * k * 0.9)); }); }, 8 * k);
      });
    }
    /* срок */
    text(t.term, '800', 25, FB, C.muted, 1, 1.2, 34 * k);
    text(o.days, '400', 52, FF, C.red, 2, 1.15, 6 * k);
    if (o.until) text(o.until, '500', 29, FB, C.muted, 2, 1.3, 4 * k);
    /* перфорация */
    add(8, function(c, x, y){ c.save(); c.setLineDash([14, 12]); c.strokeStyle = C.line; c.lineWidth = 4; c.beginPath(); c.moveTo(x - 56, y + 4); c.lineTo(x + IW + 56, y + 4); c.stroke(); c.restore();
      c.fillStyle = bgAt(y); c.beginPath(); c.arc(x - 56, y + 4, 22, 0, 6.3); c.fill(); c.beginPath(); c.arc(x + IW + 56, y + 4, 22, 0, 6.3); c.fill(); }, 38 * k);
    /* автор */
    text(t.by, '800', 25, FB, C.muted, 1, 1.2, 38 * k);
    text(o.who, '400', 58, FF, C.ink, 2, 1.1, 6 * k);
    if (o.role) text(o.role, '500', 31, FB, C.muted, 2, 1.3, 4 * k);
    if (o.place) text(o.place, '600', 33, FB, C.ink, 2, 1.3, 14 * k, 44);
    var pl = o.place ? 1 : 0; if (pl){ var last = bl[bl.length - 1], lf = last.fn; last.fn = function(c, x, y){ lf(c, x, y); c.fillStyle = C.red; c.beginPath(); c.arc(x + 14, y + 20 * k, 11 * k, 0, 6.3); c.fill(); c.beginPath(); c.moveTo(x + 14 - 8 * k, y + 24 * k); c.lineTo(x + 14, y + 44 * k); c.lineTo(x + 14 + 8 * k, y + 24 * k); c.fill(); c.fillStyle = C.paper; c.beginPath(); c.arc(x + 14, y + 20 * k, 4.5 * k, 0, 6.3); c.fill(); }; }
    var cc = o.c || {}, rows = [];
    ['tel', 'wa', 'tg', 'mail', 'ig', 'link'].forEach(function(key){ if (cc[key]) rows.push([t.lab[key], String(cc[key]).replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')]); });
    rows.slice(0, 5).forEach(function(r, i){
      ctx.font = font('800', 29, FB); var lw = ctx.measureText(r[0]).width + 18 * k; ctx.font = font('600', 34, FB); var L = wrap(ctx, r[1], IW - lw, 2), st = Math.round(34 * k * 1.28);
      add(st * L.length, function(c, x, y){ c.font = font('800', 29, FB); c.fillStyle = C.sage; c.textBaseline = 'alphabetic'; c.fillText(r[0], x, y + Math.round(34 * k * 0.86)); c.font = font('600', 34, FB); c.fillStyle = C.ink; L.forEach(function(q, j){ c.fillText(q, x + lw, y + st * j + Math.round(34 * k * 0.86)); }); }, i ? 6 * k : 4 * k);
    });
    if (o.signup && t.ch[o.signup]){
      var sg = t.signup + t.ch[o.signup]; ctx.font = font('700', 32, FB); var sw = ctx.measureText(sg).width + 60 * k;
      add(Math.round(68 * k), function(c, x, y){ rrect(c, x, y, Math.min(IW, sw), 68 * k, 34 * k); c.fillStyle = C.sageSoft; c.fill(); heart(c, x + 32 * k, y + 35 * k, 13 * k, C.rose, 1); c.font = font('700', 32, FB); c.fillStyle = C.sage; c.textBaseline = 'middle'; c.fillText(sg, x + 56 * k, y + 36 * k); }, 22 * k);
    }
    return { blocks: bl, h: total };
  }

  function qrDraw(ctx, text, x, y, size){
    rrect(ctx, x, y, size, size, 22); ctx.fillStyle = '#fff'; ctx.fill(); ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.stroke();
    try {
      qrcode.stringToBytes = qrcode.stringToBytesFuncs['UTF-8']; var q = qrcode(0, 'M'); q.addData(text, 'Byte'); q.make();
      var n = q.getModuleCount(), pad = 16, m = (size - pad * 2) / n; ctx.fillStyle = C.ink;
      for (var r = 0; r < n; r++) for (var cl = 0; cl < n; cl++) if (q.isDark(r, cl)) ctx.fillRect(Math.round(x + pad + cl * m), Math.round(y + pad + r * m), Math.ceil(m), Math.ceil(m));
    } catch (e) {}
  }

  function paint(o){
    var t = T[lang()], cv = document.createElement('canvas'); cv.width = W; cv.height = H; var ctx = cv.getContext('2d');
    var h = 0; for (var i = 0; i < String(o.id || '').length; i++) h = (h * 31 + String(o.id).charCodeAt(i)) >>> 0; o.hash = h;
    /* фон и сердечки по краям */
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#F6F1E4'); g.addColorStop(0.55, '#F3EBDD'); g.addColorStop(1, '#F1DFD7'); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    var rd = seeded('flyer' + (o.id || '')), cols = [C.rose, C.mustard, C.sage, '#E39A8B'];
    for (var n = 0; n < 34; n++){ var hx = rd() * W, hy = rd() * H; heart(ctx, hx, hy, 14 + rd() * 34, cols[Math.floor(rd() * cols.length)], 0.12 + rd() * 0.16, (rd() - 0.5) * 0.9); }
    /* шапка */
    heart(ctx, 100, 96, 20, C.rose, 1); ctx.fillStyle = C.sage; ctx.textBaseline = 'alphabetic'; ctx.font = '400 58px ' + FF; ctx.fillText(t.brand, 132, 112);
    ctx.font = '600 26px ' + FB; ctx.fillStyle = C.muted; ctx.fillText(t.brand2, 134, 148);
    ctx.font = '800 26px ' + FB; var aw = ctx.measureText(t.ad).width + 40; rrect(ctx, W - 80 - aw, 70, aw, 52, 26); ctx.strokeStyle = C.red; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = C.red; ctx.textBaseline = 'middle'; ctx.fillText(t.ad, W - 80 - aw + 20, 97);
    ctx.textBaseline = 'alphabetic'; ctx.font = '800 32px ' + FB; var kw = ctx.measureText(t.kicker).width; ctx.fillStyle = C.sage; ctx.fillText(t.kicker, (W - kw) / 2, 232);
    heart(ctx, (W - kw) / 2 - 40, 220, 16, C.rose, 1); heart(ctx, (W + kw) / 2 + 40, 220, 16, C.rose, 1);
    /* карточка: выбираем самый крупный размер, при котором всё помещается */
    var top = 290, footH = 392, maxH = H - top - footH - 44, ks = [1.14, 1.07, 1, 0.94, 0.88, 0.82, 0.76, 0.7, 0.64, 0.58], lay = null;
    for (var q = 0; q < ks.length; q++){ lay = build(ctx, o, t, ks[q]); if (lay.h + 120 <= maxH) break; }
    var pad = 56, cardH = Math.min(maxH, lay.h + pad * 2 + 8), cy = top + Math.max(0, (maxH - cardH) / 2) * 0.7;
    ctx.save(); ctx.shadowColor = 'rgba(79,94,62,.20)'; ctx.shadowBlur = 44; ctx.shadowOffsetY = 16; rrect(ctx, 80, cy, W - 160, cardH, 46); ctx.fillStyle = C.paper; ctx.fill(); ctx.restore();
    rrect(ctx, 80, cy, W - 160, cardH, 46); ctx.strokeStyle = C.line; ctx.lineWidth = 3; ctx.stroke();
    lay.blocks.forEach(function(b){ b.fn(ctx, 80 + pad, cy + pad + b.y); });
    /* подвал: «покажи листок», QR, оговорка */
    var fy = cy + cardH + 40;
    ctx.font = '700 34px ' + FB; var sh = wrap(ctx, t.show, W - 160 - 120, 2), sh2 = 52 + sh.length * 44;
    rrect(ctx, 80, fy, W - 160, sh2, sh2 / 2 > 60 ? 44 : sh2 / 2); ctx.fillStyle = C.sage; ctx.fill(); ctx.fillStyle = C.paper; ctx.textBaseline = 'alphabetic';
    sh.forEach(function(s, i){ var w = ctx.measureText(s).width; ctx.fillText(s, (W - w) / 2 + 20, fy + 36 + 44 * i + 30); }); heart(ctx, 80 + 54, fy + sh2 / 2, 17, '#F3C6CF', 1);
    /* лёгкий водяной знак «Свои люди · svoiludi.ch» */
    ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(-0.5); ctx.font = '700 46px ' + FB; ctx.fillStyle = 'rgba(79,94,62,.055)'; ctx.textBaseline = 'middle';
    var ww = ctx.measureText(t.wm).width + 120; for (var yy = -H; yy < H; yy += 170) for (var xx = -W - ((yy / 170) % 2 ? ww / 2 : 0); xx < W + ww; xx += ww) ctx.fillText(t.wm, xx, yy);
    ctx.restore();
    var qy = fy + sh2 + 28, qs = 216;
    qrDraw(ctx, o.url || 'https://svoiludi.ch/akcii/', 80, qy, qs);
    ctx.fillStyle = C.sage; ctx.font = '700 26px ' + FB; var cl2 = wrap(ctx, t.check, 700, 1); ctx.fillText(cl2[0], 80 + qs + 36, qy + 38);
    ctx.fillStyle = C.muted; ctx.font = '500 25px ' + FB; var ds = wrap(ctx, t.disc, W - 80 - (80 + qs + 36), 5); ds.forEach(function(s, i){ ctx.fillText(s, 80 + qs + 36, qy + 80 + 33 * i); });
    ctx.fillStyle = C.sage; ctx.font = '700 25px ' + FB; ctx.fillText(t.made, 80 + qs + 36, qy + qs - 6);
    return cv;
  }

  /* ---------- окно с готовым флаером ---------- */
  var DLG = null, URLS = [];
  function css(){
    if (document.getElementById('slfl-css')) return;
    var s = document.createElement('style'); s.id = 'slfl-css';
    s.textContent = '.slfl{border:0;padding:0;background:transparent;max-width:min(94vw,520px);width:100%;color:var(--ink,#2F2924)}.slfl::backdrop{background:rgba(32,28,24,.55)}'
      + '.slfl-in{position:relative;background:var(--paper,#FFFCF8);border-radius:24px;padding:22px 20px 20px;display:flex;flex-direction:column;gap:12px;max-height:94vh;overflow:auto}'
      + '.slfl-x{position:absolute;right:12px;top:10px;border:0;background:none;font-size:1.3rem;cursor:pointer;color:inherit;padding:6px 10px}'
      + '.slfl-h{font:400 1.5rem/1.15 var(--display,"Forum"),Georgia,serif;margin:0;padding-right:34px}.slfl-p{margin:0;font-size:.95rem;color:var(--muted,#6F6458)}'
      + '.slfl-img{display:flex;justify-content:center}.slfl-img img{width:auto;max-width:100%;max-height:62vh;border-radius:14px;box-shadow:0 8px 28px rgba(0,0,0,.18)}'
      + '.slfl-acts{display:flex;flex-wrap:wrap;gap:10px}.slfl-b{flex:1 1 180px;text-align:center;text-decoration:none;font:700 .98rem/1.2 var(--body,Manrope),system-ui,sans-serif;border-radius:14px;padding:13px 16px;cursor:pointer;border:1.5px solid var(--brown,#4F5E3E);background:var(--brown,#4F5E3E);color:var(--paper,#FFFCF8)}'
      + '.slfl-b.g{background:transparent;color:var(--brown,#4F5E3E)}'
      + '.slfl-heart{position:fixed;z-index:2147483000;pointer-events:none;font-size:22px;line-height:1;animation:slflUp 1.15s ease-out forwards;will-change:transform,opacity}'
      + '@keyframes slflUp{0%{transform:translate(-50%,-50%) scale(.4) rotate(0);opacity:0}15%{opacity:1}100%{transform:translate(calc(-50% + var(--dx)),calc(-50% + var(--dy))) scale(1.15) rotate(var(--rot));opacity:0}}'
      + '@media (prefers-reduced-motion:reduce){.slfl-heart{display:none}}';
    document.head.appendChild(s);
  }
  function dlg(){
    if (DLG) return DLG; css();
    DLG = document.createElement('dialog'); DLG.className = 'slfl'; DLG.setAttribute('aria-labelledby', 'slfl-h');
    DLG.innerHTML = '<div class="slfl-in"><button type="button" class="slfl-x" data-x aria-label="×">✕</button><h2 class="slfl-h" id="slfl-h"></h2><p class="slfl-p"></p><div class="slfl-img"><img alt=""></div>'
      + '<div class="slfl-acts"><a class="slfl-b" data-dl></a><button type="button" class="slfl-b g" data-sh hidden></button><button type="button" class="slfl-b g" data-x></button></div></div>';
    document.body.appendChild(DLG);
    DLG.addEventListener('click', function(e){ if (e.target === DLG || (e.target.closest && e.target.closest('[data-x]'))) DLG.close(); });
    DLG.addEventListener('close', function(){ URLS.forEach(function(u){ URL.revokeObjectURL(u); }); URLS = []; });
    return DLG;
  }
  function ready(cb){
    var p = [];
    if (document.fonts && document.fonts.load) p = ['400 60px Forum', '600 30px Manrope', '700 30px Manrope', '800 30px Manrope', '500 30px Manrope'].map(function(f){ return document.fonts.load(f, 'АБВабв123'); });
    var qr = typeof qrcode === 'function' ? Promise.resolve() : new Promise(function(res){ var s = document.createElement('script'); s.src = '/assets/lib/qrcode.js'; s.onload = res; s.onerror = res; document.head.appendChild(s); });
    Promise.all(p.concat([qr])).then(cb, cb);
  }
  function open(o, btn){
    var t = T[lang()], old = btn && btn.textContent;
    if (btn){ btn.disabled = true; btn.textContent = t.busy; }
    var done = function(){ if (btn){ btn.disabled = false; btn.textContent = old; } };
    ready(function(){
      try {
        var cv = paint(o);
        cv.toBlob(function(b){
          done();
          if (!b){ if (window.toast) window.toast(t.err); return; }
          var d = dlg(), url = URL.createObjectURL(b); URLS.push(url);
          var name = t.fname + String(o.id || 'akciya').replace(/[^a-z0-9\-]+/gi, '-') + '.png', file = null;
          try { file = new File([b], name, { type: 'image/png' }); } catch (e) {}
          d.querySelector('.slfl-h').textContent = t.h; d.querySelector('.slfl-p').textContent = t.p;
          var im = d.querySelector('img'); im.src = url; im.alt = o.title || '';
          var a = d.querySelector('[data-dl]'); a.href = url; a.setAttribute('download', name); a.textContent = t.dl;
          a.onclick = function(){ burst(a, 12); if (window.toast) window.toast(t.ok); };
          var sh = d.querySelector('[data-sh]'); sh.textContent = t.sh; sh.hidden = !(file && navigator.canShare && navigator.canShare({ files: [file] }));
          sh.onclick = function(){ try { navigator.share({ files: [file], title: o.title || '', text: (o.title || '') + ' · ' + (o.url || '') }); } catch (e) {} };
          d.querySelectorAll('[data-x]').forEach(function(x){ if (x.classList.contains('slfl-b')) x.textContent = t.cl; });
          if (!d.open) d.showModal();
          burst(a, 14);
        }, 'image/png');
      } catch (e) { done(); if (window.toast) window.toast(t.err); }
    });
  }
  function burst(el, n){
    try {
      if (!el || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) return; css();
      var r = el.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2, cols = ['#D9768A', '#B8472E', '#B98324', '#E39A8B', '#4F5E3E'];
      for (var i = 0; i < (n || 10); i++){
        var s = document.createElement('span'); s.className = 'slfl-heart'; s.textContent = '♥'; s.setAttribute('aria-hidden', 'true');
        s.style.left = (cx + (Math.random() - 0.5) * Math.min(120, r.width)) + 'px'; s.style.top = cy + 'px'; s.style.color = cols[i % cols.length];
        s.style.fontSize = (14 + Math.random() * 20) + 'px'; s.style.setProperty('--dx', ((Math.random() - 0.5) * 170) + 'px'); s.style.setProperty('--dy', (-70 - Math.random() * 150) + 'px'); s.style.setProperty('--rot', ((Math.random() - 0.5) * 70) + 'deg');
        s.style.animationDelay = (Math.random() * 0.25) + 's'; document.body.appendChild(s); s.addEventListener('animationend', function(){ this.remove(); });
      }
    } catch (e) {}
  }
  window.SVL_FLYER = { open: open, burst: burst, paint: paint, ready: ready };
})();
