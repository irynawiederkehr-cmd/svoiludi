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
    /* сначала точное совпадение по специализации темы, потом та же категория; настоящие раньше образцов.
       Внутри — случайный порядок при каждом открытии, чтобы все специалисты по теме показывались по очереди.
       Порядок по пакетам (VIP и т. п.) решим позже, пока у всех одинаково (08.10.2026). */
    const shuffle = a => { for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const exact = s => help.some(([cat, specs]) => s.cat === cat && (!specs.length || (s.specs || []).some(x => specs.includes(x))));
    const near = s => help.some(([cat]) => s.cat === cat);
    const tierOf = s => (exact(s) ? 0 : 2) + (s.sample ? 1 : 0);
    const hit = all.filter(s => exact(s) || near(s));
    const groups = [0, 1, 2, 3].map(t => shuffle(hit.filter(s => tierOf(s) === t)));
    const order = [].concat(...groups);
    const list = box.querySelector('.sp-list'), N = 3;
    const card = s => {
      const p = (s.places || [])[0];
      const where = s.online && !p ? 'онлайн' : p ? city(p.address) : '';
      return '<a class="sp" href="' + root + '#' + encodeURIComponent(s.id) + '"><img src="' + root + 'img/' + esc(s.photo) + '" alt="" loading="lazy">' +
        '<span><b>' + esc(s.name) + (s.sample ? '<span class="smp">Образец</span>' : '') + '</b><small>' + esc(s.role) + (where ? ' · ' + esc(where) : '') + '</small></span></a>';
    };
    if (!order.length) {
      list.innerHTML = '<p class="sp-none">Пока в справочнике нет специалиста по этой теме. Знаешь хорошего — <a href="' + root + 'join/">расскажи ему о «Своих людях»</a>.</p>';
    } else {
      let from = 0;
      const draw = () => {
        const part = order.slice(from, from + N); if (part.length < N && order.length > N) part.push(...order.slice(0, N - part.length));
        list.innerHTML = '<p class="sp-cnt">' + (order.length === 1 ? 'По этой теме 1 специалист' : 'По этой теме ' + order.length + ' ' + (order.length < 5 ? 'специалиста' : 'специалистов')) + '</p>' + part.map(card).join('') +
          (order.length > N ? '<button type="button" class="sp-next">Показать других →</button>' : '');
        const nb = list.querySelector('.sp-next'); if (nb) nb.onclick = () => { from = (from + N) % order.length; draw(); };
      };
      draw();
    }
  }

  /* «Твой кантон»: ссылки на официальные страницы выбранного кантона; выбор запоминается для всех статей */
  const kt = document.querySelectorAll('.kt');
  if (kt.length && window.KANTONY) {
    const K = window.KANTONY, KEY = 'svoiludi.kanton';
    const LBL = {steuern: ['Налоговая: декларация', 'Steuererklärung', 'déclaration d’impôt', 'dichiarazione d’imposta'], quellensteuer: ['Налог у источника', 'Quellensteuer', 'impôt à la source', 'imposta alla fonte'],
      migration: ['Миграционное ведомство: пермиты', 'Migrationsamt', 'service de la population', 'ufficio della migrazione'], einbuergerung: ['Натурализация в кантоне', 'Einbürgerung', 'naturalisation', 'naturalizzazione'],
      betreibung: ['Где твой Betreibungsamt', 'Betreibungsamt', 'office des poursuites', 'ufficio di esecuzione']};
    const LI2 = {de: 1, fr: 2, it: 3};
    let cur = ''; try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
    const opts = '<option value="">Выбери свой кантон</option>' + Object.entries(K).sort((a, b) => a[1].n.localeCompare(b[1].n, 'ru')).map(([k, v]) => '<option value="' + k + '">' + esc(v.n) + '</option>').join('');
    const draw = box => {
      const k = box.querySelector('select').value, out = box.querySelector('.kt-out'), keys = (box.dataset.k || '').split(',').filter(Boolean);
      if (!k || !K[k]) { out.innerHTML = '<p class="kt-hint">Правила, сроки и бланки в каждом кантоне свои. Выбери кантон, и здесь появятся ссылки на его официальные страницы.</p>'; return; }
      const c = K[k], li = LI2[c.l] || 1;
      out.innerHTML = keys.map(x => {
        const fb = (c.fb || []).includes(x);
        return '<a class="kt-link" href="' + esc(c.u[x]) + '" target="_blank" rel="noopener"><b>' + LBL[x][0] + '</b><span>' + (fb ? 'сайт кантона, в поиске набери «' + LBL[x][li] + '»' : LBL[x][li] + ' · ' + esc(c.n)) + ' ↗</span></a>';
      }).join('') + (keys.includes('einbuergerung') && c.einb ? '<p class="kt-note"><b>Кантон ' + esc(c.n) + ' добавляет:</b> ' + esc(c.einb) + '.</p>' : '') +
        '<p class="kt-hint">Если что-то в статье расходится со страницей кантона, верь кантону.</p>';
    };
    kt.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Твой кантон</b><select aria-label="Твой кантон">' + opts + '</select></div><div class="kt-out"></div>';
      const sel = box.querySelector('select'); sel.value = cur; draw(box);
      sel.addEventListener('change', () => { cur = sel.value; try { localStorage.setItem(KEY, cur); } catch (e) {} kt.forEach(b => { b.querySelector('select').value = cur; draw(b); }); });
    });
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
