/* ---------- события страницы ---------- */
document.getElementById('results').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) openV(b.dataset.v); });
['kind', 'cat', 'canton', 'lang', 'remote'].forEach(id => document.getElementById(id).addEventListener('change', e => { state[id] = e.target.value; render(); }));
document.getElementById('reset').addEventListener('click', () => { Object.keys(state).forEach(k => state[k] = ''); document.getElementById('remote').value = ''; render(); });
document.getElementById('trial').hidden = !ADMIN;
render();
const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1));
  if (id.startsWith('ok=')){ const [vid, key] = id.slice(3).split('.'); const v = VACANCIES.find(x => x.id === vid); keyOk(v, key).then(ok => { if (ok){ OKKEY[vid] = key; if (ADMIN && window.SVL_DRAFTS) SVL_DRAFTS.keep(vid, key); confirmView(v); } }); return; }
  if (id.startsWith('off=')){ const [vid, key] = id.slice(4).split('.'); const v = VACANCIES.find(x => x.id === vid); keyOk(v, key).then(ok => { if (ok){ OKKEY[vid] = key; offView(v); } }); return; }
  if (id && pool().some(v => v.id === id) || (ADMIN && VACANCIES.some(v => v.id === id))) openV(id); };
fromHash(); addEventListener('hashchange', fromHash);
/* черновики — только в режиме Ирины (assets/chernoviki.js) */
if (ADMIN && window.SVL_DRAFTS) SVL_DRAFTS.init({ page: 'vakansii', okKey: OKKEY, keyOk, items: VACANCIES.filter(v => !v.sample),
  when: v => ({ d: v.until || v.posted || '', past: !!(v.until && v.until <= today), lbl: v.until && v.until > today ? 'до' : '' }),
  kind: v => (KINDS[v.kind] || KINDS.staff).t, who: v => { const a = authorOf(v); return a ? a.name : ''; },
  url: (v, k) => k ? `https://svoiludi.ch/vakansii/#ok=${encodeURIComponent(v.id)}.${encodeURIComponent(k)}` : '',
  open: (id, withKey) => { const v = VACANCIES.find(x => x.id === id); if (!v) return; if (withKey) confirmView(v); else openV(id); },
  toast, onToggle: on => { DRAFTS_ON = on; render(); } });
