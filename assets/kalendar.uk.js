/* Календарь афиши «Свои люди»: виды «Неделя» и «Месяц» на страницах «События» (events/) и «Курсы» (kursy/).
   Копия kopiya-kalendar-afishi, 12.10.2026 — Ирина, 23:41: «Да сделай» (вопрос 23:39: «стоит ли сделать представление списком как сейчас,
   неделя, месяц, который пролистывается на месяцы вперёд? Будет ли это для клиентов полезно»).
   Что даёт человеку:
   - «Неделя» — дни недели по порядку, у каждого его записи; пустые дни сжаты в одну строку; листается вперёд по неделям;
     суббота и воскресенье помечены «выходной», сегодня и завтра — своей пометкой;
   - «Месяц» — сетка месяца; нажатие на день показывает его записи под календарём; на телефоне записи в днях — цветные полоски;
   - пустая неделя или месяц не выглядит пустым сайтом: кнопка «Ближайшее …» ведёт к ближайшей записи;
   - листается стрелками и пальцем (влево — вперёд), назад — не раньше сегодняшнего дня, вперёд — на год.
   Подключение на странице (код и данные остаются у страницы, здесь только вид):
     const CAL = SVL_CAL.create({ state, today, occ: occurrences, row: (e, d) => html строки, color: e => '#…', title: e => e.title,
                                  time: e => e.time || '', MON, MON_G, render, T: document.getElementById('kal-t').dataset });
     в render():   state.view === 'week' ? CAL.week(list) : CAL.month(list)   → { html, n }
     в обработчике кликов #results — после [data-ev]:   if (CAL.click(e)) return;
     переключатель вида:   CAL.setView('week' | 'month' | 'list' …); render();
     один раз:   CAL.bind(document.getElementById('results'));
   Поля state: view, week ('ГГГГ-ММ-ДД', понедельник), month ('ГГГГ-ММ'), day ('ГГГГ-ММ-ДД' или '').
   Тексты — в <div id="kal-t" hidden data-t-…> на странице: их переводит _i18n/pages.py вместе со страницей. Стили вставляет сам скрипт. */
(function(){
  if (window.SVL_CAL) return;
  const CSS = `
.kal-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:16px}
.kal-ttl{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:0;text-align:center}
.kal-ttl h2{font-family:var(--display);font-weight:400;font-size:clamp(1.4rem,4.6vw,1.8rem);line-height:1.12;margin:0;text-wrap:balance}
.kal-ttl small{font-size:.74rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}
.kal-back{font:inherit;font-size:.82rem;font-weight:700;color:var(--brown);background:none;border:0;padding:2px 4px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}
.kal-arr{flex:none;width:46px;height:46px;font:inherit;font-weight:700;font-size:1.15rem;line-height:1;border:1.5px solid var(--line);background:var(--paper);color:var(--ink);border-radius:12px;cursor:pointer;display:grid;place-items:center;transition:border-color .15s}
.kal-arr:hover:not(:disabled){border-color:var(--brown)}
.kal-arr:disabled{opacity:.35;cursor:default}
.kal-week{display:flex;flex-direction:column;gap:16px;margin-top:18px}
.kal-day{display:flex;flex-direction:column;gap:10px}
.kal-dh{display:flex;align-items:center;flex-wrap:wrap;gap:4px 10px;font-family:var(--body);font-size:1rem;font-weight:700;line-height:1.3;margin:0;padding-bottom:7px;border-bottom:1.5px solid var(--line);color:var(--ink)}
.kal-day.today .kal-dh{border-bottom-color:var(--brown)}
.kal-tag{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;font-weight:700;font-style:normal;border-radius:999px;padding:2px 9px;background:var(--sage-soft);color:var(--brown);white-space:nowrap}
.kal-tag.we{background:var(--mustard-soft);color:var(--ink)}
.kal-free{margin:0;font-size:.88rem;color:var(--muted);padding:3px 0 3px 12px;border-left:3px solid var(--line)}
.kal-free b{font-weight:700;color:var(--ink)}
.kal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px;margin-top:14px;touch-action:pan-y}
.kal-week{touch-action:pan-y}
.kal-wd{font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);text-align:center;padding-bottom:2px}
.kal-wd.we{color:var(--mustard)}
.kal-c{min-height:104px;background:var(--paper);border:1.5px solid var(--line);border-radius:14px;padding:6px;display:flex;flex-direction:column;gap:4px;min-width:0;color:var(--ink);-webkit-tap-highlight-color:transparent}
.kal-c[data-kday]{cursor:pointer;transition:border-color .15s}
.kal-c[data-kday]:hover{border-color:var(--sage)}
.kal-c.we:not(.out){background:color-mix(in srgb,var(--mustard-soft) 38%,var(--paper))}
.kal-c.out{background:transparent;border-color:transparent;opacity:.4}
.kal-c.past{opacity:.45}
.kal-c.sel,.kal-c.sel:hover{border-color:var(--brown);box-shadow:0 0 0 2px color-mix(in srgb,var(--brown) 22%,transparent)}
.kal-n{font-size:.8rem;font-weight:700;color:var(--muted);line-height:1;min-width:24px;height:24px;display:grid;place-items:center;border-radius:999px;align-self:flex-start}
.kal-c.has .kal-n{color:var(--ink)}
.kal-c.today .kal-n{background:var(--brown);color:var(--paper)}
.kal-chip{display:block;width:100%;text-align:left;font:600 .74rem/1.25 var(--body,Manrope),system-ui,sans-serif;border:0;border-left:3px solid var(--lc);background:color-mix(in srgb,var(--lc) 12%,var(--paper));color:var(--ink);border-radius:6px;padding:3px 5px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.kal-more{font-size:.72rem;font-weight:700;color:var(--muted);line-height:1.1}
.kal-dl{margin-top:20px;display:flex;flex-direction:column;gap:10px;scroll-margin-top:96px}
.kal-hint{margin:10px 0 0;font-size:.84rem;color:var(--muted)}
.kal-empty{margin-top:18px}
.kal-go{white-space:normal;text-align:left;justify-content:flex-start;line-height:1.35;max-width:100%;margin-top:4px}
@media (max-width:700px){
  .kal-grid{gap:4px}
  .kal-c{min-height:58px;padding:4px;gap:3px;border-radius:11px}
  .kal-n{font-size:.78rem;min-width:22px;height:22px}
  .kal-chip{font-size:0;height:7px;padding:0;border:0;border-radius:4px;background:var(--lc);pointer-events:none}
  .kal-more{font-size:.6rem}
  .kal-wd{font-size:.62rem;letter-spacing:.04em}
  .kal-arr{width:42px;height:42px}
}`;
  function style(){ if (document.getElementById('kal-css')) return; const s = document.createElement('style'); s.id = 'kal-css'; s.textContent = CSS; document.head.appendChild(s); }

  function create(c){
    style();
    const st = c.state, T = c.T || {};
    const esc = s => String(s ?? '').replace(/[&<>"]/g, x => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]));
    const cap = s => String(s || '').charAt(0).toUpperCase() + String(s || '').slice(1);
    const D = x => new Date(x + 'T12:00:00Z'), iso = d => d.toISOString().slice(0, 10);
    const add = (x, n) => iso(new Date(D(x).getTime() + n * 864e5));
    const monday = x => add(x, -((D(x).getUTCDay() + 6) % 7));
    const addM = (m, n) => { const [y, mo] = m.split('-').map(Number); return iso(new Date(Date.UTC(y, mo - 1 + n, 1, 12))).slice(0, 7); };
    const WD = String(T.tWd || 'неділя,понеділок,вівторок,середа,четвер,п’ятниця,субота').split(',');   // с воскресенья
    const WDS = String(T.tWds || 'пн,вт,ср,чт,пт,сб,нд').split(',');                                          // с понедельника
    const pl = n => n % 10 === 1 && n % 100 !== 11 ? T.tOne : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? T.tFew : T.tMany;
    const fmtD = x => `${D(x).getUTCDate()} ${c.MON_G[D(x).getUTCMonth()]}`;
    const dayHead = x => cap(`${WD[D(x).getUTCDay()]}, ${fmtD(x)}`);
    const isWe = x => [0, 6].includes(D(x).getUTCDay());
    const today = () => c.today;
    function range(a, b, withYear){   // «12–18 октября», «26 октября – 1 ноября», «28 декабря 2026 – 3 января 2027»
      const A = D(a), B = D(b), y = withYear || A.getUTCFullYear() !== B.getUTCFullYear();
      if (!y && A.getUTCMonth() === B.getUTCMonth()) return `${A.getUTCDate()}–${B.getUTCDate()} ${c.MON_G[B.getUTCMonth()]}`;
      return `${fmtD(a)}${y ? ' ' + A.getUTCFullYear() : ''} – ${fmtD(b)}${y ? ' ' + B.getUTCFullYear() : ''}`;
    }
    function tags(x){
      const t = today(), out = [];
      if (x === t) out.push(`<i class="kal-tag">${esc(T.tToday)}</i>`);
      else if (x === add(t, 1)) out.push(`<i class="kal-tag">${esc(T.tTomorrow)}</i>`);
      if (isWe(x)) out.push(`<i class="kal-tag we">${esc(T.tWeekend)}</i>`);
      return out.join('');
    }
    /* день → [{ e, d }]: d — дата записи (для окна); многодневная запись — на каждом дне (span) или только на первом видимом */
    function byDay(list, from, to, span){
      const m = {}, put = (x, o) => (m[x] = m[x] || []).push(o);
      list.forEach(e => c.occ(e, from, to).forEach(d => {
        if (e.dateEnd && !e.repeat && e.dateEnd > d){
          const x0 = d < from ? from : d;
          if (span){ for (let x = x0; x <= e.dateEnd && x <= to; x = add(x, 1)) put(x, { e, d }); }
          else if (x0 <= to) put(x0, { e, d });
        } else if (d >= from && d <= to) put(d, { e, d });
      }));
      Object.values(m).forEach(a => a.sort((p, q) => (c.time(p.e) || '').localeCompare(c.time(q.e) || '') || String(c.title(p.e)).localeCompare(String(c.title(q.e)), 'ru')));
      return m;
    }
    function nearest(list, after){
      let best = null;
      list.forEach(e => { const d = c.occ(e, after, add(after, 400)).find(x => x >= after);
        if (d && (!best || d < best.d || (d === best.d && (c.time(e) || '') < (c.time(best.e) || '')))) best = { e, d }; });
      return best;
    }
    function nearHtml(list, after){
      const n = nearest(list, after);
      if (!n) return `<span>${esc(T.tLater)}</span>`;
      const y = D(n.d).getUTCFullYear(), when = `${WD[D(n.d).getUTCDay()]}, ${fmtD(n.d)}${y !== D(today()).getUTCFullYear() ? ' ' + y : ''}`;
      return `<button type="button" class="btn ghost kal-go" data-kgo="${n.d}">${esc(T.tNear)}: ${esc(when)} · «${esc(c.title(n.e))}» →</button>`;
    }
    const nav = (k, prevOff, nextOff, title, sub, back) =>
      `<div class="kal-nav"><button type="button" class="kal-arr" data-kal="-1" aria-label="${esc(k === 'w' ? T.tWprev : T.tMprev)}"${prevOff ? ' disabled' : ''}>←</button>`
      + `<div class="kal-ttl"><h2>${esc(title)}</h2>${sub ? `<small>${esc(sub)}</small>` : ''}${back ? `<button type="button" class="kal-back" data-kal="0">${esc(T.tBacknow)}</button>` : ''}</div>`
      + `<button type="button" class="kal-arr" data-kal="1" aria-label="${esc(k === 'w' ? T.tWnext : T.tMnext)}"${nextOff ? ' disabled' : ''}>→</button></div>`;
    const WMAX = 52, MMAX = 12;   // вперёд — на год

    function week(list){
      const t = today(), w0 = monday(t), wMax = add(w0, 7 * WMAX);
      if (!st.week || st.week < w0) st.week = w0;
      if (st.week > wMax) st.week = wMax;
      const end = add(st.week, 6), from = st.week < t ? t : st.week;   // прошедшие дни этой недели не показываем
      const m = byDay(list, from, end, false);
      const sub = st.week === w0 ? T.tThisweek : st.week === add(w0, 7) ? T.tNextweek : '';
      let body = '', n = 0, free = [];
      const flush = () => {
        if (!free.length) return;
        const a = free[0], b = free[free.length - 1];
        const lbl = a === b ? dayHead(a) : `${cap(WD[D(a).getUTCDay()])} – ${WD[D(b).getUTCDay()]}, ${range(a, b)}`;
        body += `<p class="kal-free"><b>${esc(lbl)}</b> · ${esc(T.tFree)}</p>`; free = [];
      };
      for (let x = from; x <= end; x = add(x, 1)){
        const a = m[x] || [];
        if (!a.length){ free.push(x); continue; }
        flush(); n += a.length;
        body += `<div class="kal-day${x === t ? ' today' : ''}"><h3 class="kal-dh">${esc(dayHead(x))}${tags(x)}</h3>${a.map(o => c.row(o.e, o.d)).join('')}</div>`;
      }
      flush();
      if (!n) body = `<div class="empty kal-empty"><b>${esc(T.tEmptyweek)}</b>${nearHtml(list, add(end, 1))}</div>`;
      return { html: nav('w', st.week <= w0, st.week >= wMax, range(st.week, end), sub, !sub) + `<div class="kal-week" data-kswipe>${body}</div>`, n };
    }

    function month(list){
      const t = today(), m0 = t.slice(0, 7), mMax = addM(m0, MMAX);
      if (!st.month || st.month < m0) st.month = m0;
      if (st.month > mMax) st.month = mMax;
      const [y, mo] = st.month.split('-').map(Number), first = st.month + '-01', last = iso(new Date(Date.UTC(y, mo, 0, 12)));
      const from = first < t ? t : first, m = byDay(list, from, last, true);
      const uniq = new Set(); Object.values(m).forEach(a => a.forEach(o => uniq.add(o.e.id + '|' + o.d)));
      const n = uniq.size, days = Object.keys(m).sort();
      if (!st.day || st.day.slice(0, 7) !== st.month || st.day < t) st.day = days[0] || '';
      let cells = '';
      for (let x = monday(first), e = add(monday(last), 6); x <= e; x = add(x, 1)){
        const num = `<span class="kal-n">${D(x).getUTCDate()}</span>`;
        if (x.slice(0, 7) !== st.month){ cells += `<div class="kal-c out" aria-hidden="true">${num}</div>`; continue; }
        const a = m[x] || [], past = x < t;
        const cls = ['kal-c', a.length && 'has', past && 'past', x === t && 'today', x === st.day && 'sel', isWe(x) && 'we'].filter(Boolean).join(' ');
        if (past){ cells += `<div class="${cls}">${num}</div>`; continue; }
        const chips = a.slice(0, 3).map(o => `<button type="button" class="kal-chip" data-ev="${esc(o.e.id)}" data-d="${o.d}" style="--lc:${esc(c.color(o.e))}" title="${esc((c.time(o.e) ? c.time(o.e) + ' ' : '') + c.title(o.e))}" tabindex="-1">${c.time(o.e) ? esc(c.time(o.e)) + ' ' : ''}${esc(c.title(o.e))}</button>`).join('')
          + (a.length > 3 ? `<span class="kal-more">+${a.length - 3}</span>` : '');
        const lbl = fmtD(x) + (a.length ? `, ${a.length} ${pl(a.length)}` : '');
        cells += `<div class="${cls}" data-kday="${x}" role="button" tabindex="0" aria-pressed="${x === st.day}" aria-label="${esc(lbl)}">${num}${chips}</div>`;
      }
      let below = '';
      if (!n) below = `<div class="empty kal-empty"><b>${esc(T.tEmptymonth)}</b>${nearHtml(list, add(last, 1))}</div>`;
      else if (st.day){
        const a = m[st.day] || [];
        below = `<div class="kal-dl" id="kal-dl"><h3 class="kal-dh">${esc(dayHead(st.day))}${tags(st.day)}</h3>`
          + (a.length ? a.map(o => c.row(o.e, o.d)).join('') : `<p class="kal-free">${esc(T.tEmptyday)}</p>${nearHtml(list, add(st.day, 1))}`)
          + `</div><p class="kal-hint">${esc(T.tHint)}</p>`;
      }
      const grid = `<div class="kal-grid" data-kswipe>${WDS.map((w, i) => `<span class="kal-wd${i > 4 ? ' we' : ''}" aria-hidden="true">${esc(w)}</span>`).join('')}${cells}</div>`;
      return { html: nav('m', st.month <= m0, st.month >= mMax, `${cap(c.MON[mo - 1])} ${y}`, '', st.month !== m0) + grid + below, n };
    }

    function go(k){
      if (k === 1 || k === -1){ const b = document.querySelector(`.kal-arr[data-kal="${k}"]`); if (b && b.disabled) return; }
      if (st.view === 'week') st.week = k === 0 ? monday(today()) : add(st.week, 7 * k);
      else { st.month = k === 0 ? today().slice(0, 7) : addM(st.month, k); st.day = ''; }
      c.render();
    }
    function reveal(){
      const el = document.getElementById('kal-dl'); if (!el) return;
      if (el.getBoundingClientRect().top > innerHeight - 150) el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    }
    function click(ev){
      const k = ev.target.closest('[data-kal]'); if (k){ go(+k.dataset.kal); return true; }
      const g = ev.target.closest('[data-kgo]');
      if (g){ const d = g.dataset.kgo; st.week = monday(d); st.month = d.slice(0, 7); st.day = d; c.render(); return true; }
      const day = ev.target.closest('[data-kday]');
      if (day){ st.day = day.dataset.kday; c.render(); const x = document.querySelector(`[data-kday="${st.day}"]`); if (x) x.focus({ preventScroll: true }); reveal(); return true; }
      return false;
    }
    function setView(v){
      const t = today();
      if (v === 'week' && st.view !== 'week') st.week = monday(st.view === 'month' && st.day ? st.day : st.view === 'month' && st.month > t.slice(0, 7) ? st.month + '-01' : t);
      if (v === 'month' && st.view === 'week' && st.week){ const d = st.week < t ? t : st.week; st.month = d.slice(0, 7); st.day = ''; }
      if (v === 'month') st.month = st.month || t.slice(0, 7);
      st.view = v;
    }
    function bind(root){
      root.addEventListener('keydown', ev => { const d = ev.target.closest && ev.target.closest('[data-kday]'); if (d && (ev.key === 'Enter' || ev.key === ' ')){ ev.preventDefault(); d.click(); } });
      let sx = 0, sy = 0, on = false;
      root.addEventListener('touchstart', ev => { on = !!ev.target.closest('[data-kswipe]') && ev.touches.length === 1; if (on){ sx = ev.touches[0].clientX; sy = ev.touches[0].clientY; } }, { passive: true });
      root.addEventListener('touchend', ev => { if (!on) return; on = false; const t = ev.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
        if (Math.abs(dx) > 60 && Math.abs(dy) < 45 && (st.view === 'week' || st.view === 'month')) go(dx < 0 ? 1 : -1); }, { passive: true });
    }
    return { week, month, click, setView, bind, monday };
  }
  window.SVL_CAL = { create };
})();
