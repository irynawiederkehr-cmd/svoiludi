/* Блок «Что говорят о «Своих людях»» — отзывы о проекте (13.10.2026, просьба Ирины «отзыв с разрешением… добавь на сайт»).
   Вид — как «Что говорят клиенты» на voznesenskaya.ch (#reviews .rv-track .rv .rv-prod), только в цветах svoiludi.ch.
   Вставка на страницу: <div class="otzyvy" data-otzyvy></div> (data-h="3" — заголовок h3 внутри раздела)
   + <script src="/data/otzyvy.js" defer></script><script src="/assets/otzyvy.js" defer></script>.
   Тексты отзывов — data/otzyvy.js. Украинская версия собирается сама (_i18n/pages.py → assets/otzyvy.uk.js). */
(function () {
  var UK = (document.documentElement.lang || '').slice(0, 2) === 'uk', ROOT = UK ? '/uk/' : '/';
  var T = {
    ey: 'Отзывы о проекте',
    h: 'Что говорят о «Своих людях»',
    lead: 'Слова людей, которые пользуются справочником, статьями и инструментами. Публикуем с их разрешения.',
    anon: 'Отзыв участницы',
    card: 'Карточка в справочнике →',
    more: 'Читать полностью',
    less: 'Свернуть',
    prev: 'Предыдущий отзыв',
    next: 'Следующий отзыв',
    track: 'Отзывы, листаются вбок',
    ctaQ: '«Свои люди» тебе пригодились? Нам очень ценно услышать, что помогло и чего не хватает.',
    ctaBtn: 'Написать отзыв',
    ctaNote: 'Публикуем только с твоего согласия, имя — только если ты разрешишь.',
    subj: '🌿 Свои люди: отзыв о проекте'
  };
  var CSS = '.otzyvy{margin:8px 0 0}.otzyvy .ot-head{margin:0 0 14px}' +
    '.otzyvy .ot-ey{font-size:.74rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--mustard,#B98324);margin:0 0 6px}' +
    '.otzyvy .ot-h{font-family:var(--display,Forum,Georgia,serif);font-weight:400;font-size:clamp(1.55rem,3.2vw,2rem);line-height:1.2;margin:0 0 6px;color:var(--ink,#2F2924)}' +
    '.otzyvy .ot-lead{margin:0;color:var(--muted,#7A6E62);font-size:.95rem}' +
    '.ot-track{display:flex;gap:14px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;padding:4px 2px 10px;scrollbar-width:none;outline:none;align-items:stretch}' +
    '.ot-track::-webkit-scrollbar{display:none}' +
    '.ot{flex:0 0 min(86%,400px);scroll-snap-align:start;margin:0;background:var(--paper,#FFFCF8);border:1.5px solid color-mix(in srgb,var(--mustard,#B98324) 35%,var(--line,#D9DFCB));border-radius:20px;padding:22px 24px;display:flex;flex-direction:column;gap:14px;box-sizing:border-box}' +
    '.ot-prod{align-self:flex-start;font-size:.74rem;font-weight:700;letter-spacing:.04em;color:var(--sage,#66704F);background:var(--sage-soft,#E3E8D6);border-radius:999px;padding:5px 12px}' +
    '.ot blockquote{margin:0;font-family:var(--display,Forum,Georgia,serif);font-size:1.18rem;line-height:1.4;color:var(--ink,#2F2924);display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:8;overflow:hidden}' +
    '.ot.open blockquote{-webkit-line-clamp:unset;display:block}' +
    '.ot blockquote::before{content:"«";color:var(--mustard,#B98324)}.ot blockquote::after{content:"»";color:var(--mustard,#B98324)}' +
    '.ot-more{align-self:flex-start;font:inherit;font-size:.86rem;font-weight:700;color:var(--brown,#4F5E3E);background:none;border:0;padding:0;cursor:pointer;text-decoration:underline;text-underline-offset:3px}' +
    '.ot figcaption{margin-top:auto;display:flex;flex-direction:column;gap:3px;font-size:.88rem;color:var(--muted,#7A6E62)}' +
    '.ot figcaption b{font-weight:700;color:var(--brown,#4F5E3E);font-size:.95rem}' +
    '.ot figcaption a{color:var(--brown,#4F5E3E);font-weight:700;text-decoration:none;margin-top:4px}.ot figcaption a:hover{text-decoration:underline;text-underline-offset:3px}' +
    '.ot.ot-cta{border-style:dashed;border-color:color-mix(in srgb,var(--sage,#66704F) 45%,var(--line,#D9DFCB));background:color-mix(in srgb,var(--paper,#FFFCF8) 70%,var(--sage-soft,#E3E8D6))}' +
    '.ot.ot-cta blockquote{display:block;font-size:1.12rem}.ot.ot-cta blockquote::before,.ot.ot-cta blockquote::after{content:none}' +
    '.ot.ot-cta .btn{align-self:flex-start;border-radius:12px!important;font-size:.9rem;padding:11px 18px}' +
    '.ot-nav{display:flex;gap:10px;justify-content:flex-end;margin-top:4px}.ot-nav[hidden]{display:none}' +
    '.ot-nav button{width:44px;height:44px;border-radius:12px;border:1.5px solid var(--line,#D9DFCB);background:var(--paper,#FFFCF8);color:var(--brown,#4F5E3E);font-size:1.05rem;cursor:pointer}' +
    '.ot-nav button:hover{border-color:var(--brown,#4F5E3E)}' +
    '@media (hover:none){.ot-nav{display:none}}@media print{.otzyvy{display:none}}';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function card(o) {
    var who = o.name ? '<b>' + esc(o.name) + '</b>' + (o.role ? '<span>' + esc(o.role) + '</span>' : '') : '<b>' + T.anon + '</b>';
    var link = o.card ? '<a href="' + ROOT + '#' + encodeURIComponent(o.card) + '">' + T.card + '</a>' : '';
    return '<figure class="ot">' + (o.label ? '<span class="ot-prod">' + esc(o.label) + '</span>' : '') +
      '<blockquote>' + esc(o.text) + '</blockquote><button type="button" class="ot-more" hidden>' + T.more + '</button>' +
      '<figcaption>' + who + link + '</figcaption></figure>';
  }
  function cta() {
    var mail = 'mailto:voznesenskaya.iryna@gmail.com?subject=' + encodeURIComponent(T.subj);
    return '<figure class="ot ot-cta"><blockquote>' + T.ctaQ + '</blockquote><a class="btn" href="' + mail + '">' + T.ctaBtn + '</a><figcaption>' + T.ctaNote + '</figcaption></figure>';
  }
  function mount(el) {
    var list = (window.SVOI_OTZYVY || []).filter(function (o) { return o && o.text; });
    if (!list.length) { el.hidden = true; return; }
    var hn = el.getAttribute('data-h') === '3' ? 'h3' : 'h2';
    el.innerHTML = '<div class="ot-head"><div class="ot-ey">' + T.ey + '</div><' + hn + ' class="ot-h">' + T.h + '</' + hn + '><p class="ot-lead">' + T.lead + '</p></div>' +
      '<div class="ot-track" tabindex="0" aria-label="' + T.track + '">' + list.map(card).join('') + cta() + '</div>' +
      '<div class="ot-nav" hidden><button type="button" data-d="-1" aria-label="' + T.prev + '">←</button><button type="button" data-d="1" aria-label="' + T.next + '">→</button></div>';
    var tr = el.querySelector('.ot-track'), nav = el.querySelector('.ot-nav');
    el.querySelectorAll('.ot').forEach(function (f) {
      var q = f.querySelector('blockquote'), b = f.querySelector('.ot-more');
      if (!b) return;
      if (q.scrollHeight > q.clientHeight + 4) b.hidden = false;
      b.addEventListener('click', function () { var o = f.classList.toggle('open'); b.textContent = o ? T.less : T.more; });
    });
    function fit() { nav.hidden = tr.scrollWidth <= tr.clientWidth + 4; }
    fit(); window.addEventListener('resize', fit);
    nav.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-d]'); if (!b) return;
      var w = (tr.querySelector('.ot') || {}).offsetWidth || 300;
      tr.scrollBy({ left: (+b.getAttribute('data-d')) * (w + 14), behavior: 'smooth' });
    });
  }
  function run() {
    if (!document.getElementById('ot-css')) { var s = document.createElement('style'); s.id = 'ot-css'; s.textContent = CSS; document.head.appendChild(s); }
    document.querySelectorAll('[data-otzyvy]').forEach(mount);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
