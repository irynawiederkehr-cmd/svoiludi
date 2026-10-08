/* «Без цвета, для дешёвой печати» и строка «Создано на сайте проекта «Свои люди»» для инструментов со своим движком PDF (08.10.2026).
   Подключение: <script src="/assets/bwprint.js"></script> после jspdf. Галочка встаёт сама рядом с кнопкой PDF (id dlPdf, dlCli). В резюме не подключён: там свои цвета на выбор, и это документ человека от своего имени.
   Как работает: листы этих инструментов рисуются на canvas и попадают в PDF через toDataURL — здесь лист копируется, при «Без цвета»
   переводится в оттенки серого (светлый фон становится белым, чтобы не тратить чернила), и внизу справа добавляется строка о сайте.
   В векторных PDF (резюме) «Без цвета» переводит цвета jsPDF в серые. Резюме — документ человека от своего имени: строки о сайте там нет.
   Совсем без знаков — только по подписке (window.SVL_VIP). */
(function(){
  var uk = document.documentElement.lang === 'uk', KEY = 'svoiludi.bw';
  var T = uk ? {lbl: 'Без кольору, для дешевого друку', credit: 'Створено на сайті проєкту «Свої люди» · svoiludi.ch'} : {lbl: 'Без кольору, для дешевого друку', credit: 'Створено на сайті проєкту «Свої люди» · svoiludi.ch'};
  var noCredit = /\/rezyume\//.test(location.pathname) || window.SVL_NOCREDIT;
  var bw = false; try { bw = localStorage.getItem(KEY) === '1'; } catch (e) {}
  window.SVL_BW = bw;
  /* галочка рядом с кнопкой PDF */
  function addToggle(){
    var btn = document.getElementById('dlPdf') || document.getElementById('dlCli') || document.getElementById('pdf');
    if (!btn || document.querySelector('.bwp')) return;
    var lab = document.createElement('label'); lab.className = 'bwp';
    lab.style.cssText = 'display:flex;gap:8px;align-items:center;font-size:.9rem;cursor:pointer;margin:8px 0;flex-basis:100%';
    lab.innerHTML = '<input type="checkbox" style="width:18px;height:18px;accent-color:var(--sage,#4F5E3E)"> <span></span>';
    lab.querySelector('span').textContent = T.lbl;
    var cb = lab.querySelector('input'); cb.checked = bw;
    cb.addEventListener('change', function(){ bw = window.SVL_BW = cb.checked; try { localStorage.setItem(KEY, bw ? '1' : '0'); } catch (e) {} });
    var host = btn.parentElement; host.parentElement.insertBefore(lab, host.nextSibling);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addToggle); else addToggle();
  /* листы на canvas: копия с серым цветом и строкой о сайте */
  var orig = HTMLCanvasElement.prototype.toDataURL;
  function isSheet(c){ var w = c.width, h = c.height, r = w > h ? w / h : h / w; return Math.max(w, h) >= 1200 && Math.abs(r - Math.SQRT2) < 0.08; }
  HTMLCanvasElement.prototype.toDataURL = function(){
    if (this.__svl || !isSheet(this) || (!bw && (noCredit || window.SVL_VIP))) return orig.apply(this, arguments);
    var c = document.createElement('canvas'); c.width = this.width; c.height = this.height; c.__svl = true;
    var x = c.getContext('2d'); x.drawImage(this, 0, 0);
    if (bw) {
      var d = x.getImageData(0, 0, c.width, c.height), p = d.data;
      for (var i = 0; i < p.length; i += 4) { var l = 0.299 * p[i] + 0.587 * p[i + 1] + 0.114 * p[i + 2]; l = l > 238 ? 255 : l < 110 ? l * 0.55 : l; p[i] = p[i + 1] = p[i + 2] = l; }
      x.putImageData(d, 0, 0);
    }
    if (!noCredit && !window.SVL_VIP) {
      var pw = c.width > c.height ? 297 : 210, k = c.width / pw;
      x.font = '400 ' + Math.round(1.7 * k) + 'px Manrope, Arial, sans-serif'; x.fillStyle = bw ? '#555555' : '#7A6E62'; x.textAlign = 'right'; x.textBaseline = 'alphabetic';
      x.fillText(T.credit, c.width - 8 * k, c.height - 2.4 * k);
    }
    return orig.apply(c, arguments);
  };
  /* векторные PDF (резюме): цвета в серые при «Без цвета» */
  function patch(){
    var J = window.jspdf && window.jspdf.jsPDF; if (!J || J.API.__svlbw) return; J.API.__svlbw = true;
    var gray = function(args, text){
      if (!bw || !args.length) return args;
      var r, g, b, a = args[0];
      if (typeof a === 'string' && /^#?[0-9a-f]{6}$/i.test(a)) { var h = a.replace('#', ''); r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16); }
      else if (args.length >= 3 && typeof a === 'number') { r = args[0]; g = args[1]; b = args[2]; }
      else return args;
      var l = Math.round(0.299 * r + 0.587 * g + 0.114 * b); l = text ? (l < 150 ? 0 : l) : (l > 222 ? 255 : l);
      return [l, l, l];
    };
    ['setFillColor', 'setDrawColor'].forEach(function(m){ var f = J.API[m]; if (f) J.API[m] = function(){ return f.apply(this, gray([].slice.call(arguments), false)); }; });
    var ft = J.API.setTextColor; if (ft) J.API.setTextColor = function(){ return ft.apply(this, gray([].slice.call(arguments), true)); };
  }
  patch(); window.addEventListener('load', patch);
})();
