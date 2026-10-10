/* «Записаться», «Задать вопрос», «Откликнуться» — готовое сообщение организатору или автору объявления (svoiludi.ch, решение Ирины 10.10.2026, 22:18:
   «на самих эвентах кнопка записаться … с перенаправлением в контакт, который он выбирает, и готовое сообщение … можно и имя запросить»).
   Сайт ничего не отправляет и не сохраняет на сервере: кнопка открывает WhatsApp, Telegram, почту, телефон, SMS или Instagram человека
   с готовым текстом. Имя и «на вы / на ты» запоминаются только в этом браузере (localStorage, ключ svoi-napisat).
   В файле нет текста для людей: все надписи — атрибуты data-t-* у элемента #napisat-t на странице (переводятся вместе со страницей).

   Вызов: SVL_NAPISAT(slot, { kind: 'event'|'kurs'|'staff'|'partner', ask: true (вопрос вместо записи), title, when, url,
                              main: 'wa'|'tg'|'mail'|'tel'|'ig'|'link', ch: { wa, tg, mail, tel, ig, link } })
   main — куда организатор просит писать (поле «Как записаться» в заявке); остальные каналы — кнопками ниже. */
(function(){
  if (window.SVL_NAPISAT) return;
  var css = document.createElement('style');
  css.textContent = ''
    + '.wr{margin:0}.wr-p{margin-top:12px;padding:14px;border:1.5px solid var(--line,#D9DFCB);border-radius:16px;background:var(--paper,#FFFCF8);display:grid;gap:10px;text-align:left}'
    + '.wr-p[hidden]{display:none}'
    + '.wr-f{display:flex;flex-direction:column;gap:6px}.wr-f label{font-size:.74rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted,#7A6E62)}'
    + '.wr-f input,.wr-f select,.wr-f textarea{width:100%;box-sizing:border-box;font:inherit;font-size:1rem;color:var(--ink,#2F2924);background:var(--bg,#F6F1EA);border:1.5px solid var(--line,#D9DFCB);border-radius:12px;padding:10px 12px}'
    + '.wr-f textarea{resize:vertical;line-height:1.45;min-height:150px}'
    + '.wr-acts{display:flex;flex-direction:column;gap:8px}.wr-acts .btn{margin:0;justify-content:center;text-align:center}'
    + '.wr-more{display:flex;flex-wrap:wrap;gap:8px}.wr-more .btn{flex:1 1 auto}'
    + '.wr-n{font-size:.82rem;color:var(--muted,#7A6E62);line-height:1.45;margin:0}';
  document.head.appendChild(css);

  var KEY = 'svoi-napisat';
  var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var enc = encodeURIComponent;
  var TT = function(k){ var t = document.getElementById('napisat-t'); return (t && t.getAttribute('data-t-' + k)) || ''; };
  var load = function(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } };
  var keep = function(d){ try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  /* номер для wa.me: только цифры с кодом страны (079… → 4179…) */
  var waNum = function(x){ var d = String(x || '').replace(/[^\d+]/g, ''); if (/^00/.test(d)) d = d.slice(2); if (/^\+/.test(d)) d = d.slice(1); else if (/^0\d{9}$/.test(d)) d = '41' + d.slice(1); return d; };
  var telNum = function(x){ var d = String(x || '').replace(/[^\d+]/g, ''); return d; };
  var user = function(x){ return String(x || '').trim().replace(/^https?:\/\/(www\.)?(t\.me|telegram\.me|instagram\.com)\//i, '').replace(/^@/, '').replace(/[/?#].*$/, ''); };
  var ORDER = ['wa', 'tg', 'mail', 'tel', 'sms', 'ig', 'link'];

  function href(k, to, text, subj){
    if (k === 'wa') return 'https://wa.me/' + waNum(to) + '?text=' + enc(text);
    if (k === 'tg'){ var u = user(to); return /^\+?\d[\d\s]{6,}$/.test(u) ? 'https://t.me/+' + waNum(u) : 'https://t.me/' + u + '?text=' + enc(text); }
    if (k === 'mail') return 'mailto:' + String(to).trim() + '?subject=' + enc(subj) + '&body=' + enc(text);
    if (k === 'tel') return 'tel:' + telNum(to);
    if (k === 'sms') return 'sms:' + telNum(to) + '?&body=' + enc(text);
    if (k === 'ig') return 'https://ig.me/m/' + user(to);
    return String(to);
  }

  window.SVL_NAPISAT = function(slot, o){
    if (!slot) return;
    var ch = {}; Object.keys(o.ch || {}).forEach(function(k){ if (o.ch[k]) ch[k] = o.ch[k]; });
    if (ch.tel && !ch.sms && /^(\+41|0041|0)7[5-9]/.test(String(ch.tel).replace(/\s/g, ''))) ch.sms = ch.tel;   // мобильный — можно и SMS
    var keys = ORDER.filter(function(k){ return ch[k]; });
    if (!keys.length) { slot.innerHTML = ''; return; }
    var main = o.main && ch[o.main] ? o.main : keys[0];
    var kind = o.kind || 'event', purpose = o.ask ? 'ask' : 'join';
    var btn = TT('btn-' + kind + (o.ask ? '-ask' : '')) || TT('btn-' + kind);
    var only = main === 'link' && keys.length === 1;
    var d = load();
    slot.innerHTML = '<div class="wr">'
      + (only ? '<a class="btn" href="' + esc(ch.link) + '" target="_blank" rel="noopener">' + esc(btn) + '</a>'
        : '<button class="btn" type="button" data-wr-open aria-expanded="false">' + esc(btn) + '</button>'
        + '<div class="wr-p" hidden>'
        + '<div class="wr-f"><label for="wr-name">' + esc(TT('name')) + '</label><input id="wr-name" data-wr-name autocomplete="given-name" placeholder="' + esc(TT('nameph')) + '" value="' + esc(d.n || '') + '"></div>'
        + '<div class="wr-f"><label for="wr-tone">' + esc(TT('tone')) + '</label><select id="wr-tone" data-wr-tone><option value="vy">' + esc(TT('vy')) + '</option><option value="ty">' + esc(TT('ty')) + '</option></select></div>'
        + '<div class="wr-f"><label for="wr-text">' + esc(TT('text')) + '</label><textarea id="wr-text" data-wr-text rows="7"></textarea></div>'
        + '<div class="wr-acts">' + '<a class="btn" data-wr-k="' + main + '" target="_blank" rel="noopener">' + esc(TT('go-' + main)) + '</a>'
        + (keys.length > 1 ? '<span class="wr-n">' + esc(TT('or')) + '</span><div class="wr-more">' + keys.filter(function(k){ return k !== main; }).map(function(k){ return '<a class="btn ghost" data-wr-k="' + k + '" target="_blank" rel="noopener">' + esc(TT('go-' + k)) + '</a>'; }).join('') + '</div>' : '')
        + '<button class="btn ghost" type="button" data-wr-copy>' + esc(TT('copy')) + '</button></div>'
        + '<p class="wr-n">' + esc(TT('note-' + kind) || TT('note')) + '</p>'
        + '</div>')
      + '</div>';
    if (only) return;
    var p = slot.querySelector('.wr-p'), nm = slot.querySelector('[data-wr-name]'), tone = slot.querySelector('[data-wr-tone]'), tx = slot.querySelector('[data-wr-text]');
    tone.value = d.t === 'ty' ? 'ty' : 'vy';
    var edited = false;
    var subj = (TT('subj-' + kind) || '{title}').replace('{title}', o.title || '');
    function make(){
      var t = tone.value, n = nm.value.trim();
      var s = TT('msg-' + kind + '-' + purpose + '-' + t) || TT('msg-' + kind + '-join-' + t);
      return s.replace('{hi}', TT('hi-' + t)).replace('{name}', n ? ' ' + TT('me').replace('{n}', n) : '').replace('{title}', o.title || '')
        .replace('{when}', o.when ? ' (' + o.when + ')' : '').replace(/\\n/g, '\n') + (o.url ? '\n' + o.url : '');
    }
    function links(){
      var text = tx.value;
      Array.prototype.forEach.call(slot.querySelectorAll('[data-wr-k]'), function(a){ var k = a.getAttribute('data-wr-k'); a.href = href(k, ch[k], text, subj); });
    }
    function upd(){ if (!edited) tx.value = make(); links(); keep({ n: nm.value.trim(), t: tone.value }); }
    nm.addEventListener('input', upd); tone.addEventListener('change', upd);
    tx.addEventListener('input', function(){ edited = true; links(); });
    upd();
    var copy = function(){ try { return navigator.clipboard.writeText(tx.value).then(function(){ return true; }, function(){ return false; }); } catch (e) { return Promise.resolve(false); } };
    var say = function(t){ if (typeof window.toast === 'function') window.toast(t); };
    slot.querySelector('[data-wr-open]').addEventListener('click', function(){
      p.hidden = !p.hidden; this.setAttribute('aria-expanded', String(!p.hidden));
      if (!p.hidden) (nm.value ? tx : nm).focus();
    });
    slot.addEventListener('click', function(e){
      var a = e.target.closest('[data-wr-k]');
      if (a){ var k = a.getAttribute('data-wr-k'); if (k === 'tg' || k === 'ig') copy().then(function(ok){ if (ok) say(TT('copied-' + k) || TT('copied')); }); return; }
      if (e.target.closest('[data-wr-copy]')) copy().then(function(ok){ say(ok ? TT('copied') : TT('copyfail')); });
    });
  };

  /* каналы записи из записи афиши/объявления и карточки: другой контакт из заявки — вместо карточки */
  window.SVL_NAPISAT.channels = function(card, e){
    var c = (card && card.contacts) || {}, x = e.contacts || {}, out = {};
    var pick = function(a, b){ return a || b || ''; };
    out.wa = pick(x.whatsapp, c.whatsapp);
    out.tg = pick(x.telegram, c.telegram);
    out.mail = pick(x.email || e.email, c.email);
    out.tel = pick(x.phone || e.phone, c.phone);
    out.ig = pick(x.instagram, c.instagram);
    out.link = e.link || '';
    if (!card && e.contact) String(e.contact).split(/\s*[·;]\s*/).forEach(function(v){
      var m = v.match(/^(tg|mail|tel|wa|ig):\s*(.+)$/);
      if (m){ var k = { tg: 'tg', mail: 'mail', tel: 'tel', wa: 'wa', ig: 'ig' }[m[1]]; if (!out[k]) out[k] = m[2]; return; }
      if (/@.+\./.test(v)) { if (!out.mail) out.mail = v; }
      else if (/^\+?[\d\s()\-]{7,}$/.test(v)) { if (!out.tel) out.tel = v; }
      else if (/^@/.test(v) || /t\.me\//.test(v)) { if (!out.tg) out.tg = v; }
    });
    return out;
  };
})();
