/* «Тайна» (15.10.2026): открывает на странице скрытые записи справочника — пробные карточки лидов и всё «на подтверждении».
   Этот код вставляет в начало data/*.js скрипт публикации (_i18n/tajna/zakryt.js); в репозитории данные лежат открытыми,
   зашифрованы они только в опубликованной копии сайта. Подробно — _i18n/tajna/README.md.

   Скрытая запись в опубликованных данных — заглушка { tajna: 1, g, w, a, e }: без ключа из неё нельзя узнать ни имя, ни контакты.
   Открыть её можно двумя способами:
   - ключом из ссылки письма (#preview=<id>.<ключ>, #ok=, #off=, #price=, #afisha=) — так лид видит свою карточку и свои черновики;
   - ключом владельца сайта — он хранится на устройстве Ирины после пароля (svoiludi.ch/?ira=1).
   Открывает синхронно, до кода страницы: страница видит те же записи, что и раньше, а чужие скрытые записи для неё не существуют.
   Шифр — HMAC-SHA-256 в режиме счётчика и HMAC-подпись (тот же алгоритм в zakryt.js и в скриптах Google). */
(function () {
  'use strict';
  if (window.__tajna) return;
  var LS = 'svoiludi-tajna', ADM = 'svoiludi-admin';

  /* ---------- SHA-256 и HMAC ---------- */
  var K = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
    0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
    0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
    0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  var W = new Int32Array(64);
  function sha256(m) {
    var l = m.length, n = ((l + 9 + 63) >> 6) << 6, b = new Uint8Array(n), i, j;
    b.set(m); b[l] = 0x80; var bits = l * 8;
    b[n - 4] = bits >>> 24; b[n - 3] = (bits >>> 16) & 255; b[n - 2] = (bits >>> 8) & 255; b[n - 1] = bits & 255;
    b[n - 5] = Math.floor(l / 0x20000000) & 255;
    var h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a, h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;
    for (i = 0; i < n; i += 64) {
      for (j = 0; j < 16; j++) W[j] = (b[i + 4 * j] << 24) | (b[i + 4 * j + 1] << 16) | (b[i + 4 * j + 2] << 8) | b[i + 4 * j + 3];
      for (j = 16; j < 64; j++) {
        var x = W[j - 15], y = W[j - 2];
        W[j] = (((x >>> 7) | (x << 25)) ^ ((x >>> 18) | (x << 14)) ^ (x >>> 3)) + W[j - 16] + (((y >>> 17) | (y << 15)) ^ ((y >>> 19) | (y << 13)) ^ (y >>> 10)) + W[j - 7] | 0;
      }
      var a = h0, c = h2, d = h3, e = h4, f = h5, g = h6, h = h7, bb = h1;
      for (j = 0; j < 64; j++) {
        var t1 = h + (((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7))) + ((e & f) ^ (~e & g)) + K[j] + W[j] | 0;
        var t2 = (((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10))) + ((a & bb) ^ (a & c) ^ (bb & c)) | 0;
        h = g; g = f; f = e; e = d + t1 | 0; d = c; c = bb; bb = a; a = t1 + t2 | 0;
      }
      h0 = h0 + a | 0; h1 = h1 + bb | 0; h2 = h2 + c | 0; h3 = h3 + d | 0; h4 = h4 + e | 0; h5 = h5 + f | 0; h6 = h6 + g | 0; h7 = h7 + h | 0;
    }
    var o = new Uint8Array(32), hs = [h0, h1, h2, h3, h4, h5, h6, h7];
    for (i = 0; i < 8; i++) { o[4 * i] = hs[i] >>> 24; o[4 * i + 1] = (hs[i] >>> 16) & 255; o[4 * i + 2] = (hs[i] >>> 8) & 255; o[4 * i + 3] = hs[i] & 255; }
    return o;
  }
  function cat(a, b) { var o = new Uint8Array(a.length + b.length); o.set(a); o.set(b, a.length); return o; }
  function hmac(k, m) {
    if (k.length > 64) k = sha256(k);
    var ip = new Uint8Array(64), op = new Uint8Array(64);
    for (var i = 0; i < 64; i++) { ip[i] = (k[i] || 0) ^ 0x36; op[i] = (k[i] || 0) ^ 0x5c; }
    return sha256(cat(op, sha256(cat(ip, m))));
  }
  var enc = window.TextEncoder ? new TextEncoder() : null, dec = window.TextDecoder ? new TextDecoder() : null;
  function u8(s) { return enc.encode(String(s)); }
  function hex(b) { var s = ''; for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16); return s; }
  function unhex(s) { var o = new Uint8Array(s.length >> 1); for (var i = 0; i < o.length; i++) o[i] = parseInt(s.substr(2 * i, 2), 16); return o; }
  function unb64(s) { var t = atob(s), o = new Uint8Array(t.length); for (var i = 0; i < t.length; i++) o[i] = t.charCodeAt(i); return o; }
  function same(a, b) { if (a.length !== b.length) return false; var d = 0; for (var i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; }

  /* запечатанный блок: nonce(16) | шифротекст | подпись(16); ключи шифра и подписи — из одного ключа */
  function unseal(key, box) {
    if (box.length < 32) return null;
    var ek = hmac(key, u8('svoiludi-tajna-enc1')), mk = hmac(key, u8('svoiludi-tajna-mac1'));
    var nonce = box.subarray(0, 16), ct = box.subarray(16, box.length - 16), tag = box.subarray(box.length - 16);
    if (!same(hmac(mk, cat(nonce, ct)).subarray(0, 16), tag)) return null;
    var out = new Uint8Array(ct.length), blk = new Uint8Array(20); blk.set(nonce);
    for (var i = 0, n = 0; i < ct.length; i += 32, n++) {
      blk[16] = n >>> 24; blk[17] = (n >>> 16) & 255; blk[18] = (n >>> 8) & 255; blk[19] = n & 255;
      var ks = hmac(ek, blk);
      for (var j = 0; j < 32 && i + j < ct.length; j++) out[i + j] = ct[i + j] ^ ks[j];
    }
    return out;
  }
  function kek(k) { return hmac(u8(k), u8('svoiludi-tajna-k1')); }
  function gtag(k) { return hex(hmac(u8(k), u8('svoiludi-tajna-g1'))).slice(0, 16); }
  function openStub(s, wrapKey, box) {
    try {
      var dk = unseal(wrapKey, unb64(box)); if (!dk) return null;
      var pt = unseal(dk, unb64(s.e)); return pt ? JSON.parse(dec.decode(pt)) : null;
    } catch (_) { return null; }
  }

  /* ключи из адреса: #preview=<id>.<ключ>, #ok=, #off=, #price=, #afisha=; несколько — через & */
  function hashKeys() {
    var h = '', out = [], m, re = /(?:^|[#&?])[a-z]+=([a-z0-9-]+)\.([A-Za-z0-9_-]{6,64})/g;
    try { h = decodeURIComponent(location.hash || ''); } catch (_) { h = location.hash || ''; }
    while ((m = re.exec(h))) if (out.indexOf(m[2]) < 0) out.push(m[2]);
    return out;
  }

  var st = { meta: null, admin: null, tried: {}, stash: [], ira: false, ask: false };
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (_) { return null; } }

  function init(meta) {
    st.meta = meta;
    var q = location.search || '', want = /[?&]ira=1(?:&|$)/.test(q);
    if (/[?&]ira=0(?:&|$)/.test(q)) ls(LS, null);
    var a = ls(LS);
    if (a && /^[0-9a-f]{64}$/.test(a) && hex(hmac(unhex(a), u8('svoiludi-tajna-chk1'))).slice(0, 16) === meta.chk) st.admin = unhex(a);
    else if (a) ls(LS, null);
    if (!st.admin) {
      /* режим Ирины без ключа владельца ничего скрытого не покажет — выключаем его и спрашиваем пароль */
      var was = ls(ADM) === '1';
      if (was || want) {
        ls(ADM, null);
        try { document.documentElement.classList.remove('sl-ira'); } catch (_) {}
        if (want && history.replaceState) {
          var nq = q.replace(/([?&])ira=1(&|$)/, function (_, p, s) { return s ? p : ''; }).replace(/[?&]$/, '');
          history.replaceState(history.state, '', location.pathname + nq + location.hash);
        }
        st.ask = true;
        if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', askPassword); else setTimeout(askPassword, 0);
      }
    }
    window.addEventListener('hashchange', function () {
      var ks = hashKeys().filter(function (k) { return !st.tried[k]; });
      if (!ks.length || !st.stash.length) return;
      for (var i = 0; i < ks.length; i++) {
        var g = gtag(ks[i]), w = kek(ks[i]);
        for (var j = 0; j < st.stash.length; j++) if (st.stash[j].g === g && openStub(st.stash[j], w, st.stash[j].w)) { location.reload(); return; }
      }
    });
  }

  function open(arr, meta) {
    if (!Array.isArray(arr)) return arr;
    if (!st.meta) init(meta || {});
    var has = false;
    for (var i = 0; i < arr.length; i++) if (arr[i] && arr[i].tajna) { has = true; break; }
    if (!has) return arr;
    if (!enc || !dec) return arr.filter(function (r) { return !(r && r.tajna); });
    var keys = hashKeys(), tags = keys.map(gtag), keks = keys.map(kek), out = [];
    keys.forEach(function (k) { st.tried[k] = 1; });
    for (i = 0; i < arr.length; i++) {
      var s = arr[i];
      if (!s || !s.tajna) { out.push(s); continue; }
      var r = null;
      if (st.admin && s.a) r = openStub(s, st.admin, s.a);
      for (var j = 0; !r && j < keys.length; j++) if (s.g && s.w && s.g === tags[j]) r = openStub(s, keks[j], s.w);
      if (r) out.push(r); else st.stash.push(s);
    }
    return out;
  }

  /* окно пароля владельца (только по ?ira=1 или если режим был включён на устройстве) */
  function askPassword() {
    if (!st.ask || document.getElementById('tajna-pass')) return;
    var d = document.createElement('div');
    d.id = 'tajna-pass';
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-labelledby', 'tajna-t');
    d.innerHTML = '<style>#tajna-pass{position:fixed;inset:0;z-index:2147483000;background:rgba(30,34,24,.55);display:flex;align-items:center;justify-content:center;padding:16px;font:16px/1.45 Manrope,system-ui,sans-serif}'
      + '#tajna-pass form{background:#fff;color:#2b2b28;border-radius:16px;max-width:380px;width:100%;padding:22px 20px;box-shadow:0 12px 40px rgba(0,0,0,.25)}'
      + '#tajna-pass h2{margin:0 0 6px;font-size:19px}#tajna-pass p{margin:0 0 14px;font-size:14px;color:#5b5e52}'
      + '#tajna-pass input{width:100%;box-sizing:border-box;font:inherit;padding:11px 12px;border:1px solid #c9cbbf;border-radius:12px}'
      + '#tajna-pass .b{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}#tajna-pass button{font:inherit;font-weight:600;border-radius:12px;padding:10px 16px;border:0;cursor:pointer}'
      + '#tajna-pass .ok{background:#66704F;color:#fff}#tajna-pass .no{background:#eceee6;color:#2b2b28}#tajna-pass .er{color:#a33;font-size:14px;margin-top:10px;min-height:1em}'
      + '@media (prefers-color-scheme:dark){#tajna-pass form{background:#24261f;color:#ecebe4}#tajna-pass p{color:#b9bbad}#tajna-pass input{background:#1b1c17;color:#ecebe4;border-color:#4a4d40}#tajna-pass .no{background:#34372d;color:#ecebe4}}</style>'
      + '<form><h2 id="tajna-t">Режим владельца</h2><p>Введи пароль. На этом устройстве его больше не спросят, пока не выйдешь ссылкой ?ira=0.</p>'
      + '<input type="password" autocomplete="current-password" name="password" aria-label="Пароль" required>'
      + '<div class="b"><button class="ok" type="submit">Войти</button><button class="no" type="button">Отмена</button></div><div class="er" aria-live="polite"></div></form>';
    document.body.appendChild(d);
    var f = d.querySelector('form'), inp = d.querySelector('input'), er = d.querySelector('.er');
    d.querySelector('.no').onclick = function () { d.remove(); };
    f.onsubmit = function (ev) {
      ev.preventDefault(); er.textContent = 'Проверяю…';
      var m = st.meta || {};
      if (!window.crypto || !crypto.subtle) { er.textContent = 'Этот браузер не умеет проверять пароль. Открой сайт в Safari или Chrome.'; return; }
      crypto.subtle.importKey('raw', u8(inp.value.trim()), 'PBKDF2', false, ['deriveBits']).then(function (pk) {
        return crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: unhex(m.salt || ''), iterations: m.iter || 310000 }, pk, 256);
      }).then(function (bits) {
        var a = new Uint8Array(bits);
        if (hex(hmac(a, u8('svoiludi-tajna-chk1'))).slice(0, 16) !== m.chk) { er.textContent = 'Пароль не подходит.'; inp.select(); return; }
        ls(LS, hex(a)); ls(ADM, '1'); location.reload();
      }).catch(function () { er.textContent = 'Не получилось проверить пароль. Попробуй ещё раз.'; });
    };
    setTimeout(function () { inp.focus(); }, 30);
  }

  window.__tajna = { open: open, v: 1 };
})();
