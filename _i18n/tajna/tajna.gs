/* «Тайна» для скриптов Google (15.10.2026) — вставить в конец скрипта, который читает data/*.js сайта
   (подтверждение карточек «Тесты — заявки», «Свои люди — подтверждение записей» _i18n/podtverzhdenie/zapisi.gs).
   После переезда сайта записи «на подтверждении» в опубликованных data/*.js зашифрованы: вместо записи — заглушка
   { tajna: 1, g, w, a, e } (_i18n/tajna/README.md). Скрипт открывает её тем же ключом из ссылки, который присылает страница.
   Работает и со старым, открытым видом файлов — поэтому новую версию можно выложить заранее.

   tajnaList_(text, name, key) → массив window.<name> из текста файла сайта; заглушки с этим ключом открыты, остальные убраны. */
function tajnaList_(text, name, key) {
  var m = new RegExp('(^|\\n)[ \\t]*window\\.' + name + '\\s*=').exec(text);   // присваивание в начале строки, не упоминание в комментарии
  if (!m) throw new Error('в файле нет window.' + name);
  var i = m.index + m[0].length;
  var src = tajnaArrayText_(text, text.indexOf('[', i)), list;
  try { list = JSON.parse(src); } catch (e) { list = new Function('return ' + src)(); }   // afisha.js в открытом виде — объект JavaScript
  return tajnaOpen_(list, key);
}

/* текст массива от '[' до парной ']' — с учётом строк и комментариев */
function tajnaArrayText_(t, j) {
  if (j < 0) throw new Error('нет массива');
  var depth = 0, q = '';
  for (var p = j; p < t.length; p++) {
    var c = t.charAt(p);
    if (q) { if (c === '\\') p++; else if (c === q) q = ''; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && t.charAt(p + 1) === '/') { p = t.indexOf('\n', p); if (p < 0) break; continue; }
    if (c === '/' && t.charAt(p + 1) === '*') { p = t.indexOf('*/', p + 2) + 1; if (p <= 0) break; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return t.slice(j, p + 1); }
  }
  throw new Error('массив не закрыт');
}

function tajnaOpen_(list, key) {
  var out = [], g = null, kek = null;
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    if (!s || !s.tajna) { out.push(s); continue; }
    if (!key || !s.g || !s.w) continue;
    if (g === null) {
      g = tajnaHex_(tajnaHmac_(tajnaBytes_(key), tajnaBytes_('svoiludi-tajna-g1'))).slice(0, 16);
      kek = tajnaHmac_(tajnaBytes_(key), tajnaBytes_('svoiludi-tajna-k1'));
    }
    if (s.g !== g) continue;
    var dk = tajnaUnseal_(kek, Utilities.base64Decode(s.w)); if (!dk) continue;
    var pt = tajnaUnseal_(dk, Utilities.base64Decode(s.e)); if (!pt) continue;
    out.push(JSON.parse(Utilities.newBlob(pt).getDataAsString('UTF-8')));
  }
  return out;
}

/* запечатанный блок: nonce(16) | шифротекст | подпись(16); HMAC-SHA-256 в режиме счётчика — как в _i18n/tajna/zakryt.js и otkryt.js */
function tajnaUnseal_(key, box) {
  if (!box || box.length < 32) return null;
  var ek = tajnaHmac_(key, tajnaBytes_('svoiludi-tajna-enc1')), mk = tajnaHmac_(key, tajnaBytes_('svoiludi-tajna-mac1'));
  var nonce = box.slice(0, 16), ct = box.slice(16, box.length - 16), tag = box.slice(box.length - 16);
  var mac = tajnaHmac_(mk, nonce.concat(ct)), d = 0;
  for (var i = 0; i < 16; i++) d |= (mac[i] ^ tag[i]) & 255;
  if (d) return null;
  var out = [];
  for (var p = 0, n = 0; p < ct.length; p += 32, n++) {
    var ks = tajnaHmac_(ek, nonce.concat([tajnaSb_(n >>> 24), tajnaSb_(n >>> 16), tajnaSb_(n >>> 8), tajnaSb_(n)]));
    for (var j = 0; j < 32 && p + j < ct.length; j++) out.push(tajnaSb_(ct[p + j] ^ ks[j]));
  }
  return out;
}
function tajnaSb_(x) { x = x & 255; return x > 127 ? x - 256 : x; }
function tajnaHmac_(k, m) { return Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, m, k); }
function tajnaBytes_(s) { return Utilities.newBlob(String(s)).getBytes(); }
function tajnaHex_(b) { return b.map(function (x) { return ('0' + ((x + 256) % 256).toString(16)).slice(-2); }).join(''); }
