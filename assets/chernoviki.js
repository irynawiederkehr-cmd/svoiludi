/* Черновики на вкладках «События», «Акции», «Курсы» и «Вакансии и партнёрство» — режим Ирины (?ira=1).
   Правило Ирины 12.10.2026, 14:34: «лиды поразмещали встречи и курсы и акции, а я черновиков на сайте не вижу. сделай тоже черновики,
   чтобы они могли их открыть и посмотреть по своей ссылке ещё до размещения… всё, что мы прописываем в лидах, должно быть в черновиках
   размещено на сайте, и потом в письме на всё это будут прописаны ссылки как на образцы».

   Что делает файл (только у Ирины, у посетителей ничего не показывает и ничего не сохраняет):
   — вверху вкладки блок «Черновики — видишь только ты»: все записи «на подтверждении» и «черновик» этой вкладки, ближайшие сверху,
     прошедшие примеры — ниже с пометкой «прошло»; у каждой «Открыть» и «Ссылка для автора» (…/#ok=<id>.<ключ>);
   — галочка «Показывать черновики в списке»: черновики стоят в общем списке с пометкой «Черновик» (только у Ирины);
   — ключи: ссылка предпросмотра карточки лида, которую Ирина один раз открыла на этом устройстве, запоминает ключ карточки
     (localStorage «svoiludi-admin-keys», так же делает главная). У черновика лида тот же ключ, что у карточки
     (python3 -I _i18n/pochta/klyuch.py --lead <id карточки>), поэтому ссылки появляются здесь сами. Ключ проверяется по отпечатку keyHash.
   Страница вызывает SVL_DRAFTS.init({ … }) в конце своего скрипта. Документ проекта «lidy-svoiludi.md», раздел 8. */
(function () {
  const KEYS = 'svoiludi-admin-keys', PREF = 'svoiludi-admin-drafts';
  const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const keys = () => { try { return JSON.parse(localStorage.getItem(KEYS) || '{}') || {}; } catch (e) { return {}; } };
  const keep = (id, k) => { try { const o = keys(); if (k) o[id] = k; else delete o[id]; localStorage.setItem(KEYS, JSON.stringify(o)); } catch (e) {} };
  const isDraft = r => !!r && (r.status === 'на подтверждении' || r.status === 'черновик');
  const showInList = () => { try { return localStorage.getItem(PREF) !== '0'; } catch (e) { return true; } };
  const MON = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  const CSS = `.drafts{border:1.5px dashed var(--mustard,#B98324);background:color-mix(in srgb,var(--mustard-soft,#F3E3C2) 45%,var(--paper,#FFFCF8));border-radius:16px;padding:14px 16px;margin:0 0 18px;font-size:.92rem;line-height:1.45}
.drafts .dr-h{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:8px 16px;margin:0 0 6px}
.drafts .dr-h b{font-weight:800;font-size:1rem}
.drafts .dr-h label{display:flex;align-items:center;gap:8px;font-size:.86rem;cursor:pointer}
.drafts .dr-note{margin:0 0 10px;color:var(--muted,#7A6E62);font-size:.85rem}
.drafts ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.drafts li{display:grid;grid-template-columns:56px minmax(0,1fr);gap:4px 12px;align-items:start;background:var(--paper,#FFFCF8);border:1px solid var(--line,#E5D9C9);border-radius:12px;padding:10px 12px}
.drafts li.past{opacity:.86}
.drafts .dr-d{display:flex;flex-direction:column;align-items:center;justify-content:center;border-radius:10px;background:var(--mustard-soft,#F3E3C2);padding:6px 4px;line-height:1.1;text-align:center}
.drafts .dr-d b{font-size:1.15rem;font-weight:800}.drafts .dr-d small{font-size:.7rem;color:var(--muted,#7A6E62)}
.drafts li.past .dr-d{background:color-mix(in srgb,var(--line,#E5D9C9) 70%,transparent)}
.drafts .dr-t{min-width:0}.drafts .dr-t b{display:block;font-weight:700;overflow-wrap:anywhere}
.drafts .dr-t small{display:block;color:var(--muted,#7A6E62);font-size:.8rem;overflow-wrap:anywhere}
.drafts .dr-a{grid-column:2;display:flex;flex-wrap:wrap;gap:6px}
.drafts .dr-a button{font:inherit;font-size:.8rem;font-weight:700;border-radius:12px;padding:6px 12px;cursor:pointer;border:1.5px solid var(--brown,#6E4F3C);background:var(--brown,#6E4F3C);color:var(--paper,#FFFCF8)}
.drafts .dr-a button.gh{background:transparent;color:var(--brown,#6E4F3C)}
.drafts .dr-a .nokey{font-size:.78rem;color:var(--muted,#7A6E62);align-self:center}
.drafts .dr-more{font:inherit;font-size:.85rem;font-weight:700;margin-top:10px;border-radius:12px;padding:7px 14px;cursor:pointer;border:1.5px solid var(--brown,#6E4F3C);background:transparent;color:var(--brown,#6E4F3C)}
.drafts .dr-empty{color:var(--muted,#7A6E62)}
.sample.draft,.dr-badge{background:var(--mustard,#B98324)!important;color:#FFFCF8!important}
@media (max-width:420px){.drafts{padding:12px}.drafts li{grid-template-columns:48px minmax(0,1fr);padding:9px 10px}}`;

  function init(cfg) {
    // cfg: { page, items, okKey, keyOk(r,k), open(id, withKey), when(r) → { d, past, lbl }, who(r), kind(r), url(r, k), toast(t), onToggle(on), anchor }
    if (!cfg || !document.getElementById) return;
    const st = document.createElement('style'); st.textContent = CSS; document.head.appendChild(st);
    const box = document.createElement('section'); box.className = 'drafts'; box.id = 'drafts'; box.setAttribute('aria-label', 'Черновики');
    const anchor = document.getElementById(cfg.anchor || 'trial');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box, anchor.nextSibling); else return;
    const items = (cfg.items || []).filter(isDraft);
    const K = keys(); let open = false;
    const orgIds = r => [].concat(r.organizers || [], r.author ? [r.author] : []).map(o => typeof o === 'string' ? o : (o && (o.org || o.spec)) || '').filter(Boolean);
    const rows = () => items.map(r => { const w = cfg.when(r) || {}; return { r, d: w.d || r.date || r.posted || '', past: !!w.past, lbl: w.lbl || '' }; })
      .sort((a, b) => (a.past - b.past) || (a.past ? String(b.d).localeCompare(String(a.d)) : String(a.d).localeCompare(String(b.d))));
    const li = ({ r, d, past, lbl }) => { const k = cfg.okKey[r.id], dd = String(d || '');
      return `<li class="${past ? 'past' : ''}"><span class="dr-d">${past ? '<small>прошло</small>' : lbl ? `<small>${esc(lbl)}</small>` : ''}${dd ? `<b>${+dd.slice(8, 10)}</b><small>${MON[+dd.slice(5, 7) - 1] || ''} ${dd.slice(0, 4)}</small>` : '<b>—</b>'}</span>
        <span class="dr-t"><b>${esc(r.title)}</b><small>${esc([cfg.kind(r), cfg.who(r), r.status].filter(Boolean).join(' · '))}</small></span>
        <span class="dr-a"><button type="button" data-dr-open="${esc(r.id)}">${k ? 'Открыть, как увидит автор' : 'Открыть'}</button>${k ? `<button type="button" class="gh" data-dr-copy="${esc(r.id)}">Скопировать ссылку для автора</button>` : '<span class="nokey">Ссылки для автора на этом устройстве нет</span>'}</span></li>`; };
    const draw = () => { const L = rows(), N = 6, more = L.length - N > 2 ? L.length - N : 0;
      box.innerHTML = `<div class="dr-h"><b>Черновики — видишь только ты · ${L.length}</b><label><input type="checkbox" data-dr-show${showInList() ? ' checked' : ''}> Показывать черновики в списке</label></div>
        <p class="dr-note">Пробные записи лидов и заявки, которые ждут «Подтверждаю». Для всех они появятся только после подтверждения автора, прошедшие — никогда (они только пример). Кнопка «Скопировать ссылку для автора» даёт ссылку из письма: по ней автор видит запись так, как её увидят все, и подтверждает её. Ссылок нет — открой один раз на этом устройстве ссылку предпросмотра карточки лида (она в папке приглашения): ключ запомнится, и ссылки появятся здесь.</p>
        ${L.length ? `<ul>${(more && !open ? L.slice(0, N) : L).map(li).join('')}</ul>${more ? `<button type="button" class="dr-more" data-dr-more>${open ? 'Свернуть' : 'Показать ещё ' + more}</button>` : ''}` : '<p class="dr-empty">Черновиков на этой вкладке нет.</p>'}`; };
    box.addEventListener('click', async ev => {
      const m = ev.target.closest('[data-dr-more]'); if (m) { open = !open; draw(); return; }
      const o = ev.target.closest('[data-dr-open]'); if (o) { const id = o.dataset.drOpen; cfg.open(id, !!cfg.okKey[id]); return; }
      const c = ev.target.closest('[data-dr-copy]'); if (c) { const r = items.find(x => x.id === c.dataset.drCopy); const u = r && cfg.url(r, cfg.okKey[r.id]); if (!u) return;
        let ok = false; try { await navigator.clipboard.writeText(u); ok = true; } catch (e) {}
        if (ok) { c.textContent = 'Скопировано ✓'; if (cfg.toast) cfg.toast('Ссылка для автора скопирована: ' + r.title); } else prompt('Скопируйте ссылку для автора', u); }
    });
    box.addEventListener('change', ev => { const t = ev.target.closest('[data-dr-show]'); if (!t) return;
      try { localStorage.setItem(PREF, t.checked ? '1' : '0'); } catch (e) {} if (cfg.onToggle) cfg.onToggle(t.checked); });
    draw();
    // ключи: свой ключ записи или ключ карточки организатора (у черновиков лида он общий), проверяем по отпечатку
    (async () => { let got = false;
      for (const r of items) { if (cfg.okKey[r.id]) continue;
        for (const k of [K[r.id]].concat(orgIds(r).map(i => K[i])).filter(Boolean)) { if (await cfg.keyOk(r, k)) { cfg.okKey[r.id] = k; got = true; break; } } }
      if (got) draw(); })();
  }
  window.SVL_DRAFTS = { init, keep, isDraft, showInList };
})();
