/* «Как устроена Швейцария»: в статье блок «Кто поможет» берёт специалистов из data/specialists.js
   по направлению и специализации темы (атрибут data-help). Показываются только видимые на сайте карточки,
   сначала настоящие, потом образцы. На вкладке — поиск по темам. (08.10.2026) */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = new Date().toISOString().slice(0, 10);
  const visible = s => s.status === 'активен' && s.photo && !(s.paidUntil && s.paidUntil < today);
  const city = a => (String(a).match(/\d{4}\s+(.+)$/) || [, a])[1];
  const root = document.body.dataset.root || '../../';

  const box = document.getElementById('sp');
  if (box) {
    let help = [];
    try { help = JSON.parse(box.dataset.help || '[]'); } catch (e) {}
    const all = (window.SPECIALISTS || []).filter(visible);
    const hit = all.filter(s => help.some(([cat, specs]) => s.cat === cat && (!specs.length || (s.specs || []).some(x => specs.includes(x)))));
    hit.sort((a, b) => (a.sample ? 1 : 0) - (b.sample ? 1 : 0));
    const list = box.querySelector('.sp-list');
    if (!hit.length) {
      list.innerHTML = '<p class="sp-none">Пока в справочнике нет специалиста по этой теме. Знаешь хорошего — <a href="' + root + 'join/">расскажи ему о «Своих людях»</a>.</p>';
    } else {
      list.innerHTML = hit.slice(0, 6).map(s => {
        const p = (s.places || [])[0];
        const where = s.online && !p ? 'онлайн' : p ? city(p.address) : '';
        return '<a class="sp" href="' + root + '#' + encodeURIComponent(s.id) + '"><img src="' + root + 'img/' + esc(s.photo) + '" alt="" loading="lazy">' +
          '<span><b>' + esc(s.name) + (s.sample ? '<span class="smp">Образец</span>' : '') + '</b><small>' + esc(s.role) + (where ? ' · ' + esc(where) : '') + '</small></span></a>';
      }).join('');
    }
  }

  const q = document.getElementById('tmq');
  if (q) {
    const norm = s => String(s).toLowerCase().replace(/ё/g, 'е');
    const cards = [...document.querySelectorAll('.tm-card')];
    const mods = [...document.querySelectorAll('.tm-mod')];
    const empty = document.getElementById('tmempty');
    q.addEventListener('input', () => {
      const v = norm(q.value.trim());
      cards.forEach(c => { c.hidden = !!v && !norm(c.textContent + ' ' + (c.dataset.k || '')).includes(v); });
      mods.forEach(m => { m.hidden = !m.querySelector('.tm-card:not([hidden])'); });
      empty.hidden = mods.some(m => !m.hidden);
    });
  }
})();
