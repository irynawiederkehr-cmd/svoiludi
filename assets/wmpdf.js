/* Водяной знак «Свои люди · svoiludi.ch» и строка «Создано на сайте проекта «Свои люди»» для инструментов со своим движком
   (правило Ирины 08.10.2026; движок схем assets/shema.js делает это сам). Без знака — только по будущей подписке (window.SVL_VIP).
   Резюме остаётся чистым — это документ человека от своего имени. */
(function(){
  const T = 'Свои люди · svoiludi.ch', S = 8.5, COL = '#6E4F3C', A = 0.075, PT = 0.3528;
  const CR = {ru: 'Создано на сайте проекта «Свои люди» · svoiludi.ch', uk: 'Створено на сайті проєкту «Свої люди» · svoiludi.ch', de: 'Erstellt mit svoiludi.ch', fr: 'Créé avec svoiludi.ch', it: 'Creato con svoiludi.ch', en: 'Made with svoiludi.ch'};
  const on = () => !window.SVL_VIP;
  const lang = l => CR[l] ? l : (document.documentElement.lang === 'uk' ? 'uk' : 'ru');
  const marks = (w, h) => { const o = [], dx = 66, dy = 27; for (let r = 0, y = 14; y < h - 2; y += dy, r++) for (let x = (r % 2) * dx / 2 - 10; x < w; x += dx) o.push([x, y]); return o; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  window.SVLWM = {
    svg(w, h, l){ if (!on()) return ''; return `<g fill="${COL}" fill-opacity="${A}" font-family="Manrope" font-weight="700" font-size="${(S * PT).toFixed(3)}">` + marks(w, h).map(([x, y]) => `<text transform="translate(${x} ${y}) rotate(-24)">${esc(T)}</text>`).join('') + '</g>' +
      `<text x="${w - 8}" y="${h - 2.6}" font-family="Manrope" font-size="${(4.6 * PT).toFixed(3)}" fill="#7A6E62" text-anchor="end">${esc(CR[lang(l)])}</text>`; },
    pdf(doc, w, h, l){ if (!on()) return; const hx = [110, 79, 60]; const gs = doc.GState ? a => doc.setGState(new doc.GState({opacity: a})) : null;
      if (gs) gs(A); doc.setFont('Manrope-Bold', 'normal'); doc.setFontSize(S); doc.setTextColor(...(gs ? hx : [240, 235, 228])); marks(w, h).forEach(([x, y]) => doc.text(T, x, y, {angle: 24})); if (gs) gs(1);
      doc.setFont('Manrope-Regular', 'normal'); doc.setFontSize(4.6); doc.setTextColor(122, 110, 98); doc.text(CR[lang(l)], w - 8, h - 2.6, {align: 'right'}); },
    png(c, w, h, l){ if (!on()) return; c.save(); c.globalAlpha = A; c.fillStyle = COL; c.font = '700 ' + (S * PT) + 'px Manrope'; c.textAlign = 'left';
      marks(w, h).forEach(([x, y]) => { c.save(); c.translate(x, y); c.rotate(-24 * Math.PI / 180); c.fillText(T, 0, 0); c.restore(); }); c.restore();
      c.font = '400 ' + (4.6 * PT) + 'px Manrope'; c.fillStyle = '#7A6E62'; c.textAlign = 'right'; c.fillText(CR[lang(l)], w - 8, h - 2.6); }
  };
})();
