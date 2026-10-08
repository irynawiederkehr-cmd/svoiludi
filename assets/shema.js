/* Общий движок схем svoiludi.ch (08.10.2026): один набор «операций» (прямоугольник, линия, треугольник, текст)
   рисует и предпросмотр (SVG), и PDF (jsPDF, шрифт Manrope), и PNG (canvas). Страница задаёт window.SH_PAGE = {build, name, title}. */
(function(){
  const PT = 0.3528;
  const mctx = document.createElement('canvas').getContext('2d');
  const tw = (s, b, size) => { mctx.font = (b ? '700 ' : '400 ') + size + 'px Manrope'; return mctx.measureText(s).width * PT; };
  function wrap(s, b, size, w){ const out = []; let line = ''; String(s || '').split(/\s+/).filter(Boolean).forEach(wd => { const t = line ? line + ' ' + wd : wd; if (tw(t, b, size) <= w || !line) line = t; else { out.push(line); line = wd; } }); if (line) out.push(line); return out; }
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  function pal(bw){
    return bw ? {band: '#FFFFFF', bandTx: '#000000', bandLine: '#000000', ink: '#000000', mut: '#444444', line: '#999999', head: '#000000', soft: '#FFFFFF', zebra: '#F2F2F2', hi: '#E6E6E6', warn: '#000000',
      c: {sage: ['#FFFFFF', '#000000'], blue: ['#FFFFFF', '#000000'], pink: ['#FFFFFF', '#000000'], green: ['#FFFFFF', '#000000'], mustard: ['#FFFFFF', '#000000'], brown: ['#FFFFFF', '#000000'], red: ['#FFFFFF', '#000000']}}
      : {band: '#4F5E3E', bandTx: '#FFFFFF', bandLine: null, ink: '#2F2924', mut: '#7A6E62', line: '#C9BBA8', head: '#4F5E3E', soft: '#F8F3EC', zebra: '#F8F3EC', hi: '#F3E3C2', warn: '#A0523D',
      c: {sage: ['#E3E8D6', '#4F5E3E'], blue: ['#E1E8F5', '#2F5FB8'], pink: ['#F7E1EC', '#B5357A'], green: ['#E2F0E2', '#3A8A48'], mustard: ['#F3E3C2', '#B98324'], brown: ['#EFE5D7', '#6E4F3C'], red: ['#F6E0D9', '#A0523D']}};
  }
  /* холст страницы с удобными функциями */
  function page(w, h, C){
    const ops = [];
    const P = {w, h, ops, C,
      text: (s, x, y, size, b, color, align, font) => { ops.push({t: 'text', s: String(s), x, y, size, b: !!b, color: color || C.ink, align: align || 'left', f: font || ''}); },
      rect: (x, y, w2, h2, fill, stroke, r, dash) => ops.push({t: 'rect', x, y, w: w2, h: h2, fill: fill || null, stroke: stroke || null, r: r || 0, dash: !!dash}),
      line: (x1, y1, x2, y2, color, wd, dash) => ops.push({t: 'line', x1, y1, x2, y2, color: color || C.line, w: wd || 0.3, dash: !!dash}),
      tri: (p, fill) => ops.push({t: 'tri', p, fill}),
      arrowDown: (x, y1, y2, color) => { ops.push({t: 'line', x1: x, y1, x2: x, y2: y2 - 2, color, w: 0.6}); ops.push({t: 'tri', p: [[x, y2 - 0.3], [x - 1.3, y2 - 2.3], [x + 1.3, y2 - 2.3]], fill: color}); },
      arrowRight: (x1, x2, y, color) => { ops.push({t: 'line', x1, y1: y, x2: x2 - 2, y2: y, color, w: 0.6}); ops.push({t: 'tri', p: [[x2 - 0.3, y], [x2 - 2.3, y - 1.3], [x2 - 2.3, y + 1.3]], fill: color}); },
      /* абзац: возвращает новую y */
      para: (s, x, y, size, b, color, width, lh) => { wrap(s, b, size, width).forEach(l => { P.text(l, x, y, size, b, color); y += lh || size * PT * 1.45; }); return y; },
      header: (ru, local, right) => { P.rect(0, 0, w, 17, C.band, C.bandLine); P.text(ru, 12, 10.5, 16, true, C.bandTx); if (local) P.text(local, 12, 15, 7, false, C.bandTx); if (right) P.text(right, w - 12, 10.5, 8, false, C.bandTx, 'right'); },
      foot: (s) => { wrap(s, false, 4.8, w - 24).forEach((l, i) => P.text(l, 12, h - 7 + i * 2, 4.8, false, C.mut)); },
      sec: (t, x, y, width, sub) => { P.text(t, x, y, 9.5, true, C.head); if (sub) P.text(sub, x + tw(t, true, 9.5) + 2.5, y, 6.5, false, C.mut); y += 1.8; P.line(x, y, x + width, y, C.head, 0.4); return y + 4.6; },
      /* карточка с заголовком и текстом, высота по содержимому; возвращает высоту */
      card: (x, y, wd, col, title, sub, body, opts) => {
        opts = opts || {}; const pad = 3, iw = wd - pad * 2, lines = [];
        wrap(title, true, opts.ts || 8.4, iw).forEach(l => lines.push([l, true, opts.ts || 8.4, col[1]]));
        if (sub) wrap(sub, false, 6.4, iw).forEach(l => lines.push([l, false, 6.4, C.mut]));
        (Array.isArray(body) ? body : [body]).filter(Boolean).forEach(b => wrap(b, false, opts.bs || 7, iw).forEach(l => lines.push([l, false, opts.bs || 7, C.ink])));
        const lh = l => l[2] * PT * 1.42, h2 = Math.max(opts.minH || 0, lines.reduce((a, l) => a + lh(l), 0) + pad * 2 + 1);
        if (!opts.dry) { P.rect(x, y, wd, h2, col[0], col[1], 1.6, opts.dash); let yy = y + pad + lines[0][2] * PT; lines.forEach(l => { P.text(l[0], x + pad, yy, l[2], l[1], l[3]); yy += lh(l); }); }
        return h2;
      }
    };
    return P;
  }
  function svg(pg){
    let o = `<svg viewBox="0 0 ${pg.w} ${pg.h}" xmlns="http://www.w3.org/2000/svg" role="img"><rect width="${pg.w}" height="${pg.h}" fill="#fff"/>`;
    pg.ops.forEach(p => {
      if (p.t === 'rect') o += `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}"${p.r ? ` rx="${p.r}"` : ''} fill="${p.fill || 'none'}"${p.stroke ? ` stroke="${p.stroke}" stroke-width="0.35"${p.dash ? ' stroke-dasharray="1.4 1"' : ''}` : ''}/>`;
      else if (p.t === 'line') o += `<line x1="${p.x1}" y1="${p.y1}" x2="${p.x2}" y2="${p.y2}" stroke="${p.color}" stroke-width="${p.w}"${p.dash ? ' stroke-dasharray="1.2 0.9"' : ''}/>`;
      else if (p.t === 'tri') o += `<polygon points="${p.p.map(q => q.join(',')).join(' ')}" fill="${p.fill}"/>`;
      else o += `<text x="${p.x}" y="${p.y}" font-family="${p.f === 'h' ? 'Helvetica, Arial, sans-serif' : 'Manrope'}" font-weight="${p.b ? 700 : 400}" font-size="${(p.size * PT).toFixed(3)}" fill="${p.color}" text-anchor="${p.align === 'right' ? 'end' : p.align === 'center' ? 'middle' : 'start'}">${esc(p.s)}</text>`;
    });
    return o + '</svg>';
  }
  const FONT_FILES = {'Manrope-Regular': '/assets/lib/fonts-pdf/Manrope-Regular.ttf', 'Manrope-Bold': '/assets/lib/fonts-pdf/Manrope-Bold.ttf'};
  let fontCache = null;
  async function fonts(){
    if (fontCache) return fontCache;
    const base = (window.PV_BASE || '/').replace(/\/$/, ''), out = {};
    for (const [k, u] of Object.entries(FONT_FILES)) {
      const r = await fetch(window.PV_BASE ? base + u : u); if (!r.ok) throw new Error('font');
      const buf = new Uint8Array(await r.arrayBuffer()); let s = '';
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
      out[k] = btoa(s);
    }
    return fontCache = out;
  }
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  async function makePdf(pages, title){
    if (!window.jspdf) throw new Error('lib'); if (!pages.length) throw new Error('empty');
    const F = await fonts(), doc = new window.jspdf.jsPDF({unit: 'mm', format: 'a4', orientation: pages[0].w > pages[0].h ? 'l' : 'p', compress: true});
    for (const [k, b64] of Object.entries(F)) { doc.addFileToVFS(k + '.ttf', b64); doc.addFont(k + '.ttf', k, 'normal'); }
    pages.forEach((pg, i) => {
      if (i) doc.addPage('a4', pg.w > pg.h ? 'l' : 'p');
      pg.ops.forEach(o => {
        if (o.t === 'rect') {
          if (o.stroke) { doc.setDrawColor(...hex(o.stroke)); doc.setLineWidth(0.35); doc.setLineDashPattern(o.dash ? [1.4, 1] : [], 0); }
          if (o.fill) doc.setFillColor(...hex(o.fill));
          const st = o.fill && o.stroke ? 'FD' : o.fill ? 'F' : 'S';
          if (o.r) doc.roundedRect(o.x, o.y, o.w, o.h, o.r, o.r, st); else doc.rect(o.x, o.y, o.w, o.h, st);
          doc.setLineDashPattern([], 0);
        } else if (o.t === 'line') { doc.setDrawColor(...hex(o.color)); doc.setLineWidth(o.w); doc.setLineDashPattern(o.dash ? [1.2, 0.9] : [], 0); doc.line(o.x1, o.y1, o.x2, o.y2); doc.setLineDashPattern([], 0); }
        else if (o.t === 'tri') { doc.setFillColor(...hex(o.fill)); doc.triangle(o.p[0][0], o.p[0][1], o.p[1][0], o.p[1][1], o.p[2][0], o.p[2][1], 'F'); }
        else { if (o.f === 'h') doc.setFont('helvetica', o.b ? 'bold' : 'normal'); else doc.setFont(o.b ? 'Manrope-Bold' : 'Manrope-Regular', 'normal'); doc.setFontSize(o.size); doc.setTextColor(...hex(o.color)); doc.text(o.s, o.x, o.y, {align: o.align}); }
      });
    });
    doc.setProperties({title});
    return doc.output('blob');
  }
  async function pagePng(pg){
    try { await Promise.all([document.fonts.load('400 20px Manrope'), document.fonts.load('700 20px Manrope')]); } catch (e) {}
    const k = 8, cv = document.createElement('canvas'); cv.width = Math.round(pg.w * k); cv.height = Math.round(pg.h * k);
    const c = cv.getContext('2d'); c.scale(k, k); c.fillStyle = '#FFFFFF'; c.fillRect(0, 0, pg.w, pg.h);
    pg.ops.forEach(o => {
      if (o.t === 'rect') { c.beginPath(); if (o.r && c.roundRect) c.roundRect(o.x, o.y, o.w, o.h, o.r); else c.rect(o.x, o.y, o.w, o.h); if (o.fill) { c.fillStyle = o.fill; c.fill(); } if (o.stroke) { c.strokeStyle = o.stroke; c.lineWidth = 0.35; c.setLineDash(o.dash ? [1.4, 1] : []); c.stroke(); c.setLineDash([]); } }
      else if (o.t === 'line') { c.beginPath(); c.moveTo(o.x1, o.y1); c.lineTo(o.x2, o.y2); c.strokeStyle = o.color; c.lineWidth = o.w; c.setLineDash(o.dash ? [1.2, 0.9] : []); c.stroke(); c.setLineDash([]); }
      else if (o.t === 'tri') { c.beginPath(); c.moveTo(o.p[0][0], o.p[0][1]); c.lineTo(o.p[1][0], o.p[1][1]); c.lineTo(o.p[2][0], o.p[2][1]); c.closePath(); c.fillStyle = o.fill; c.fill(); }
      else { c.font = (o.b ? '700 ' : '400 ') + (o.size * PT) + 'px ' + (o.f === 'h' ? 'Helvetica, Arial, sans-serif' : 'Manrope'); c.fillStyle = o.color; c.textAlign = o.align === 'right' ? 'right' : o.align === 'center' ? 'center' : 'left'; c.textBaseline = 'alphabetic'; c.fillText(o.s, o.x, o.y); }
    });
    return new Promise(r => cv.toBlob(r, 'image/png'));
  }
  function save(blob, name){ const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }
  /* подключение страницы: кнопки PDF/PNG, предпросмотр */
  function mount(cfg){
    const $ = id => document.getElementById(id), st = $('status'), say = t => { if (st) st.textContent = t; };
    const render = () => { const pages = cfg.build(); $('sheet').innerHTML = pages.map((p, i) => `<div class="sheet">${svg(p)}</div><div class="acts"><button type="button" class="btn ghost sm" data-png="${i}">Эту страницу в PNG</button></div>`).join('') || '<p class="hint">Отметь, что должно быть в PDF.</p>'; };
    async function pdf(btns, share){
      btns.forEach(b => b.disabled = true); say('Готовлю PDF…');
      try { const blob = await makePdf(cfg.build(), cfg.title), name = cfg.name() + '.pdf';
        if (share) { await navigator.share({files: [new File([blob], name, {type: 'application/pdf'})], title: name}); say('Готово.'); } else { save(blob, name); say('PDF скачан.'); } }
      catch (e) { if (e && e.name === 'AbortError') say(''); else if (e && e.message === 'empty') say('Отметь хотя бы одну часть.'); else say('Не получилось сделать PDF. Обнови страницу и попробуй ещё раз.'); }
      btns.forEach(b => b.disabled = false);
    }
    async function png(i){ const pages = cfg.build(); if (!pages[i]) return; say('Готовлю PNG…'); try { save(await pagePng(pages[i]), cfg.name() + (pages.length > 1 ? '-' + (i + 1) : '') + '.png'); say('PNG скачан. Его удобно отправить в мессенджере или поставить на экран телефона.'); } catch (e) { say('Не получилось сделать PNG. Попробуй ещё раз.'); } }
    const btns = [$('pdf')]; $('pdf').addEventListener('click', () => pdf(btns));
    $('sheet').addEventListener('click', e => { const b = e.target.closest('[data-png]'); if (b) png(+b.dataset.png); });
    try { if (navigator.canShare && navigator.canShare({files: [new File(['x'], 'x.pdf', {type: 'application/pdf'})]}) && matchMedia('(pointer:coarse)').matches) { const sb = $('share'); sb.hidden = false; sb.addEventListener('click', () => pdf(btns.concat(sb), true)); } } catch (e) {}
    render(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(render);
    return {render, say};
  }
  window.SH = {PT, tw, wrap, esc, pal, page, svg, makePdf, pagePng, mount};
})();
