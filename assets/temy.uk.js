/* «Как устроена Швейцария»: в статье блок «Кто поможет» берёт специалистов из data/specialists.js
   по направлению и специализации темы (атрибут data-help). Показываются только видимые на сайте карточки,
   сначала настоящие, потом образцы. На вкладке — поиск по темам. (08.10.2026) */
(function () {
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const today = new Date().toISOString().slice(0, 10);
  const visible = s => s.status === 'активен' && s.photo && !(s.paidUntil && s.paidUntil < today);
  const city = a => (String(a).match(/\d{4}\s+(.+)$/) || [, a])[1];
  const root = document.body.dataset.root || '../../';
  const lroot = document.documentElement.lang === 'uk' ? '/uk/' : root;   // ссылки на страницы: на украинской версии — в /uk/ (09.10.2026); картинки — по root

  const box = document.getElementById('sp');
  if (box) {
    let help = [];
    try { help = JSON.parse(box.dataset.help || '[]'); } catch (e) {}
    /* только настоящие карточки: образцы в статьях не показываем и не считаем, чтобы не было пустых обращений (правило Ирины 10.10.2026: справочник только открылся — пишем «есть категории, посмотри, найдётся ли специалист») */
    const all = (window.SPECIALISTS || []).filter(s => visible(s) && !s.sample);
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
      return '<a class="sp" href="' + lroot + '#' + encodeURIComponent(s.id) + '"><img src="' + root + 'img/' + esc(s.photo) + '" alt="" loading="lazy">' +
        '<span><b>' + esc(s.name) + (s.sample ? '<span class="smp">Зразок</span>' : '') + '</b><small>' + esc(s.role) + (where ? ' · ' + esc(where) : '') + '</small></span></a>';
    };
    /* Карточка-приглашение «Здесь может быть твоё имя» — всегда последней в списке (09.10.2026, просьба Ирины) */
    const invite = '<a class="sp sp-inv" href="' + lroot + 'join/#form"><span class="sp-plus" aria-hidden="true">+</span>' +
      '<span><b>Тут може бути твоє ім’я</b><small>Працюєш за цією темою? Розмістися в довіднику, зараз безкоштовно →</small></span></a>';
    if (!order.length) {
      list.innerHTML = '<p class="sp-none">Довідник щойно відкрився і поповнюється. Ці категорії в ньому є — <a href="' + lroot + '">подивися, чи знайдеться там фахівець для тебе</a>. Знаєш хорошого фахівця — <a href="' + lroot + 'join/">розкажи йому про «Своїх людей»</a>.</p>' + invite;
    } else {
      let from = 0;
      const draw = () => {
        const part = order.slice(from, from + N); if (part.length < N && order.length > N) part.push(...order.slice(0, N - part.length));
        list.innerHTML = '<p class="sp-cnt">' + (order.length === 1 ? 'З цієї теми 1 фахівець' : 'З цієї теми ' + order.length + ' ' + (order.length < 5 ? 'фахівці' : 'фахівців')) + '</p>' + part.map(card).join('') +
          (order.length > N ? '<button type="button" class="sp-next">Показати інших →</button>' : '') + invite;
        const nb = list.querySelector('.sp-next'); if (nb) nb.onclick = () => { from = (from + N) % order.length; draw(); };
      };
      draw();
    }
  }

  /* «Твой кантон»: ссылки на официальные страницы выбранного кантона; выбор запоминается для всех статей */
  const kt = document.querySelectorAll('.kt');
  if (kt.length && window.KANTONY) {
    const K = window.KANTONY, KEY = 'svoiludi.kanton';
    const LBL = {steuern: ['Податкова: декларація', 'Steuererklärung', 'déclaration d’impôt', 'dichiarazione d’imposta'], quellensteuer: ['Податок у джерела', 'Quellensteuer', 'impôt à la source', 'imposta alla fonte'],
      migration: ['Міграційне відомство: пермити', 'Migrationsamt', 'service de la population', 'ufficio della migrazione'], einbuergerung: ['Натуралізація в кантоні', 'Einbürgerung', 'naturalisation', 'naturalizzazione'],
      betreibung: ['Де твій Betreibungsamt', 'Betreibungsamt', 'office des poursuites', 'ufficio di esecuzione'],
      stva: ['Дорожнє відомство: права і машина', 'Strassenverkehrsamt', 'service des automobiles', 'ufficio della circolazione'], sozial: ['Соціальна допомога в кантоні', 'Sozialhilfe', 'aide sociale', 'assistenza sociale'],
      kesb: ['Служба захисту дітей і дорослих', 'KESB', 'APEA', 'ARP']};
    const LI2 = {de: 1, fr: 2, it: 3};
    let cur = ''; try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
    const opts = '<option value="">Вибери свій кантон</option>' + Object.entries(K).sort((a, b) => a[1].n.localeCompare(b[1].n, 'ru')).map(([k, v]) => '<option value="' + k + '">' + esc(v.n) + '</option>').join('');
    const draw = box => {
      const k = box.querySelector('select').value, out = box.querySelector('.kt-out'), keys = (box.dataset.k || '').split(',').filter(Boolean);
      if (!k || !K[k]) { out.innerHTML = '<p class="kt-hint">Правила, строки і бланки в кожному кантоні свої. Вибери кантон, і тут з’являться посилання на його офіційні сторінки.</p>'; return; }
      const c = K[k], li = LI2[c.l] || 1;
      const FZ = window.KANTONY_FZ || {}, f = FZ[k];
      out.innerHTML = keys.filter(x => LBL[x] && c.u && c.u[x]).map(x => {
        const fb = (c.fb || []).includes(x);
        return '<a class="kt-link" href="' + esc(c.u[x]) + '" target="_blank" rel="noopener"><b>' + LBL[x][0] + '</b><span>' + (fb ? 'сайт кантону, у пошуку набери «' + LBL[x][li] + '»' : LBL[x][li] + ' · ' + esc(c.n)) + ' ↗</span></a>';
      }).join('') + (keys.includes('einbuergerung') && c.einb ? '<p class="kt-note"><b>Кантон ' + esc(c.n) + ' додає:</b> ' + esc(c.einb) + '.</p>' : '') +
        (keys.includes('fz') && f ? '<p class="kt-note"><b>Сімейні допомоги · ' + esc(c.n) + ', 2026:</b> ' + ('на дитину до 16 років ' + esc(f.k) + ' на місяць, на учня з 16 до 25 років ' + esc(f.a) + ' на місяць' + (f.g ? ', при народженні один раз ' + esc(f.g) : '')).replace(/\.?$/, '.') + '</p>' : '') +
        '<p class="kt-hint">Якщо щось у статті розходиться зі сторінкою кантону, вір кантону.</p>';
    };
    kt.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Твій кантон</b><select aria-label="Твій кантон">' + opts + '</select></div><div class="kt-out"></div>';
      const sel = box.querySelector('select'); sel.value = cur; draw(box);
      sel.addEventListener('change', () => { cur = sel.value; try { localStorage.setItem(KEY, cur); } catch (e) {} kt.forEach(b => { b.querySelector('select').value = cur; draw(b); }); });
    });
  }


  /* «Где помогут в твоём кантоне» (08.10.2026): союз арендаторов, справочная адвокатов, бесплатные справки по работе и аренде. Данные — assets/pomosh.js */
  const pmk = document.querySelectorAll('.pmk');
  if (pmk.length && window.POMOSH && window.KANTONY) {
    const K = window.KANTONY, P = window.POMOSH.kant, KEY = 'svoiludi.kanton';
    const e2 = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
    const T = {mv: 'Спілка орендарів', adv: 'Довідкова адвокатів', arb: 'Безкоштовно з трудового права', miet: 'Безкоштовно з оренди', x: 'Ще'};
    let cur = ''; try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
    const opts = '<option value="">Вибери свій кантон</option>' + Object.keys(K).sort((a, b) => K[a].n.localeCompare(K[b].n, 'ru')).map(k => '<option value="' + k + '">' + e2(K[k].n) + '</option>').join('');
    const row = (k, v) => {
      if (!v) return '';
      if (k === 'mv') return '<div class="pmk-r"><b>' + T.mv + ' · ' + e2(v[0]) + '</b><p><span class="pmk-fee">' + e2(v[1]) + '.</span> ' + e2(v[2]) + '</p><a href="' + e2(v[3]) + '" target="_blank" rel="noopener">Вступити або дізнатися більше ↗</a></div>';
      return '<div class="pmk-r"><b>' + T[k] + '</b><p>' + e2(v[0]) + '</p><a href="' + e2(v[1]) + '" target="_blank" rel="noopener">Джерело ↗</a></div>';
    };
    const draw = box => {
      const k = box.querySelector('select').value, out = box.querySelector('.pmk-out'), keys = (box.dataset.k || 'mv,adv,arb,miet').split(',').concat('x');
      if (!k || !P[k]) { out.innerHTML = '<p class="kt-hint">Вибери кантон — і тут з’являться спілка орендарів з її внеском, довідкова адвокатів і безкоштовні довідки щодо роботи й оренди.</p>'; return; }
      const html = keys.map(x => row(x, P[k][x])).join('');
      out.innerHTML = (html || '<p class="kt-hint">Для цього кантону поки немає даних.</p>') + '<p class="kt-hint">Перевірено ' + e2(window.POMOSH.checked) + '. Години й ціни змінюються — перед візитом зазирни на сайт.</p>';
    };
    pmk.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Де допоможуть у твоєму кантоні</b><select aria-label="Твій кантон">' + opts + '</select></div><div class="pmk-out"></div>';
      const sel = box.querySelector('select'); sel.value = cur; draw(box);
      sel.addEventListener('change', () => { cur = sel.value; try { localStorage.setItem(KEY, cur); } catch (e) {} document.querySelectorAll('.pmk, .kt').forEach(b => { const s = b.querySelector('select'); if (s) { s.value = cur; s.dispatchEvent(new Event('sync')); } }); pmk.forEach(draw); });
    });
  }


  /* ссылка на организацию (#org-…) сразу раскрывает её карточку */
  const openOrg = () => { const h = location.hash; if (/^#org-/.test(h)) { const d = document.getElementById(h.slice(1)); if (d && d.tagName === 'DETAILS') { d.open = true; d.scrollIntoView({block: 'start'}); } } };
  window.addEventListener('hashchange', openOrg); openOrg();

  const med = document.querySelectorAll('.med');
  if (med.length && window.KANTONY && window.KANTONY_MED) {
    const K = window.KANTONY, M = window.KANTONY_MED, KEY = 'svoiludi.kanton';
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const tel = n => 'tel:' + n.replace(/\s/g, '');
    const codes = Object.keys(K).sort((a, b) => K[a].n.localeCompare(K[b].n, 'ru'));
    let cur = ''; try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
    const SOS = [['144', 'Швидка допомога', 'Sanität'], ['117', 'Поліція', 'Polizei'], ['118', 'Пожежники', 'Feuerwehr'], ['112', 'Загальний номер', 'Notruf'], ['1414', 'Rega, гелікоптер', 'Rega'], ['145', 'Отруєння', 'Tox Info'], ['143', 'Якщо важко на душі', 'Die Dargebotene Hand'], ['147', 'Дітям і підліткам', 'Pro Juventute'], ['142', 'Допомога постраждалим від насильства', 'Opferhilfe']];
    const rows = k => {
      const m = M[k]; if (!m) return '';
      let h = m.l.map(r => '<li><a class="med-n" href="' + tel(r[1]) + '">' + esc(r[1]) + '</a><span><b>' + esc(r[0]) + '</b>' + (r[2] ? ' · ' + esc(r[2]) : '') + '</span></li>').join('');
      if (!m.l.length) h = '<li class="med-none">У цьому кантоні номер залежить від регіону. Список — на сторінці за посиланням нижче.</li>';
      return (m.r && m.l.length ? '<p class="kt-hint">Номер залежить від того, де ти живеш.</p>' : '') + '<ul class="med-l">' + h + '</ul>' +
        (m.u ? '<p class="med-src"><a href="' + esc(m.u) + '" target="_blank" rel="noopener">Офіційна сторінка · ' + esc(K[k].n) + ' ↗</a></p>' : '');
    };
    const opts = '<option value="">Обери кантон</option>' + codes.map(c => '<option value="' + c + '">' + esc(K[c].n) + '</option>').join('');
    const dlg = document.createElement('dialog');
    dlg.className = 'med-dlg';
    dlg.setAttribute('aria-label', 'Черговий лікар за кантонами');
    document.body.appendChild(dlg);
    const openAll = () => {
      dlg.innerHTML = '<div class="med-dh"><b>Черговий лікар за кантонами</b><button type="button" class="med-x" aria-label="Закрити">×</button></div><p class="kt-hint">Дзвони, якщо тобі потрібен лікар, а свій не відповідає і це не загроза життю. Натисни на кантон, щоб побачити номери.</p>' +
        codes.map(c => '<details' + (c === cur ? ' open' : '') + '><summary>' + esc(K[c].n) + '</summary>' + rows(c) + '</details>').join('') +
        '<p class="kt-hint">Номери ми перевірили 8 жовтня 2026 року. Якщо номер не відповідає, дивись офіційну сторінку кантону. При загрозі життю — 144.</p>';
      dlg.querySelector('.med-x').addEventListener('click', () => dlg.close());
      dlg.showModal();
    };
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    med.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Черговий лікар у твоєму кантоні</b><select aria-label="Твій кантон">' + opts + '</select></div><div class="med-out"></div>' +
        '<div class="med-btns"><button type="button" class="med-all">Усі кантони</button><a class="med-print" href="' + (document.documentElement.lang === 'uk' ? '/uk/' : (document.body.dataset.root || '/')) + 'instrumenty/ekstrennye-nomera/' + (/index\.html$/.test(location.pathname) ? 'index.html' : '') + '">Зробити картку з номерами (PDF)</a></div>';
      const sel = box.querySelector('select'), out = box.querySelector('.med-out');
      const draw = () => { out.innerHTML = cur && M[cur] ? rows(cur) : '<p class="kt-hint">Вибери кантон, і тут з’явиться номер чергового лікаря. Його набирають, коли свій лікар не відповідає, а в швидку не потрібно.</p>'; };
      sel.value = cur; draw();
      sel.addEventListener('change', () => { cur = sel.value; try { localStorage.setItem(KEY, cur); } catch (e) {} med.forEach(b => { b.querySelector('select').value = cur; }); document.querySelectorAll('.med .med-out').forEach(o => { o.innerHTML = cur && M[cur] ? rows(cur) : ''; }); draw(); });
      box.querySelector('.med-all').addEventListener('click', openAll);
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

  /* Таблицы в статьях с тремя и больше колонками на телефоне показываются карточками: у каждой ячейки подпись из заголовка (09.10.2026) */
  document.querySelectorAll('.art-main .tbl table').forEach(t => {
    const hs = [...t.querySelectorAll('thead th')].map(th => th.textContent.trim());
    if (hs.length < 3) return;
    t.classList.add('stk');
    t.querySelectorAll('tbody tr').forEach(tr => [...tr.children].forEach((td, i) => { if (hs[i]) td.setAttribute('data-label', hs[i]); }));
  });
})();
