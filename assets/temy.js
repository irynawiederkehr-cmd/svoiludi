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
      const FZ = window.KANTONY_FZ || {}, f = FZ[k];
      out.innerHTML = keys.filter(x => LBL[x] && c.u && c.u[x]).map(x => {
        const fb = (c.fb || []).includes(x);
        return '<a class="kt-link" href="' + esc(c.u[x]) + '" target="_blank" rel="noopener"><b>' + LBL[x][0] + '</b><span>' + (fb ? 'сайт кантона, в поиске набери «' + LBL[x][li] + '»' : LBL[x][li] + ' · ' + esc(c.n)) + ' ↗</span></a>';
      }).join('') + (keys.includes('einbuergerung') && c.einb ? '<p class="kt-note"><b>Кантон ' + esc(c.n) + ' добавляет:</b> ' + esc(c.einb) + '.</p>' : '') +
        (keys.includes('fz') && f ? '<p class="kt-note"><b>Семейные пособия · ' + esc(c.n) + ', 2026:</b> ' + ('на ребёнка до 16 лет ' + esc(f.k) + ' в месяц, на учащегося с 16 до 25 лет ' + esc(f.a) + ' в месяц' + (f.g ? ', при рождении один раз ' + esc(f.g) : '')).replace(/\.?$/, '.') + '</p>' : '') +
        '<p class="kt-hint">Если что-то в статье расходится со страницей кантона, верь кантону.</p>';
    };
    kt.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Твой кантон</b><select aria-label="Твой кантон">' + opts + '</select></div><div class="kt-out"></div>';
      const sel = box.querySelector('select'); sel.value = cur; draw(box);
      sel.addEventListener('change', () => { cur = sel.value; try { localStorage.setItem(KEY, cur); } catch (e) {} kt.forEach(b => { b.querySelector('select').value = cur; draw(b); }); });
    });
  }

  const med = document.querySelectorAll('.med');
  if (med.length && window.KANTONY && window.KANTONY_MED) {
    const K = window.KANTONY, M = window.KANTONY_MED, KEY = 'svoiludi.kanton';
    const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    const tel = n => 'tel:' + n.replace(/\s/g, '');
    const codes = Object.keys(K).sort((a, b) => K[a].n.localeCompare(K[b].n, 'ru'));
    let cur = ''; try { cur = localStorage.getItem(KEY) || ''; } catch (e) {}
    const SOS = [['144', 'Скорая помощь', 'Sanität'], ['117', 'Полиция', 'Polizei'], ['118', 'Пожарные', 'Feuerwehr'], ['112', 'Общий номер', 'Notruf'], ['1414', 'Rega, вертолёт', 'Rega'], ['145', 'Отравления', 'Tox Info'], ['143', 'Если тяжело на душе', 'Die Dargebotene Hand'], ['147', 'Детям и подросткам', 'Pro Juventute']];
    const rows = k => {
      const m = M[k]; if (!m) return '';
      let h = m.l.map(r => '<li><a class="med-n" href="' + tel(r[1]) + '">' + esc(r[1]) + '</a><span><b>' + esc(r[0]) + '</b>' + (r[2] ? ' · ' + esc(r[2]) : '') + '</span></li>').join('');
      if (!m.l.length) h = '<li class="med-none">В этом кантоне номер зависит от региона. Список — на странице по ссылке ниже.</li>';
      return (m.r && m.l.length ? '<p class="kt-hint">Номер зависит от того, где ты живёшь.</p>' : '') + '<ul class="med-l">' + h + '</ul>' +
        (m.u ? '<p class="med-src"><a href="' + esc(m.u) + '" target="_blank" rel="noopener">Официальная страница · ' + esc(K[k].n) + ' ↗</a></p>' : '');
    };
    const opts = '<option value="">Выбери кантон</option>' + codes.map(c => '<option value="' + c + '">' + esc(K[c].n) + '</option>').join('');
    const dlg = document.createElement('dialog');
    dlg.className = 'med-dlg';
    dlg.setAttribute('aria-label', 'Дежурный врач по кантонам');
    document.body.appendChild(dlg);
    const openAll = () => {
      dlg.innerHTML = '<div class="med-dh"><b>Дежурный врач по кантонам</b><button type="button" class="med-x" aria-label="Закрыть">×</button></div><p class="kt-hint">Звони, если тебе нужен врач, а свой не отвечает и это не угроза жизни. Нажми на кантон, чтобы увидеть номера.</p>' +
        codes.map(c => '<details' + (c === cur ? ' open' : '') + '><summary>' + esc(K[c].n) + '</summary>' + rows(c) + '</details>').join('') +
        '<p class="kt-hint">Номера мы проверили 8 октября 2026 года. Если номер не отвечает, смотри официальную страницу кантона. При угрозе жизни — 144.</p>';
      dlg.querySelector('.med-x').addEventListener('click', () => dlg.close());
      dlg.showModal();
    };
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    med.forEach(box => {
      box.innerHTML = '<div class="kt-h"><b>Дежурный врач в твоём кантоне</b><select aria-label="Твой кантон">' + opts + '</select></div><div class="med-out"></div>' +
        '<div class="med-btns"><button type="button" class="med-all">Все кантоны</button><a class="med-print" href="' + (document.body.dataset.root || '/') + 'instrumenty/ekstrennye-nomera/' + (/index\.html$/.test(location.pathname) ? 'index.html' : '') + '">Сделать карточку с номерами (PDF)</a></div>';
      const sel = box.querySelector('select'), out = box.querySelector('.med-out');
      const draw = () => { out.innerHTML = cur && M[cur] ? rows(cur) : '<p class="kt-hint">Выбери кантон, и здесь появится номер дежурного врача. Его набирают, когда свой врач не отвечает, а в скорую не нужно.</p>'; };
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
})();
