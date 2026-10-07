/* ---------- события страницы ---------- */
document.getElementById('results').addEventListener('click', e => { const b = e.target.closest('[data-v]'); if (b) openV(b.dataset.v); });
['kind', 'cat', 'canton', 'lang', 'remote'].forEach(id => document.getElementById(id).addEventListener('change', e => { state[id] = e.target.value; render(); }));
document.getElementById('reset').addEventListener('click', () => { Object.keys(state).forEach(k => state[k] = ''); document.getElementById('remote').value = ''; render(); });
document.getElementById('trial').hidden = !ADMIN;
render();
const fromHash = () => { const id = decodeURIComponent(location.hash.slice(1));
  if (id.startsWith('ok=')){ const [vid, key] = id.slice(3).split('.'); const v = VACANCIES.find(x => x.id === vid); if (v && v.key && key === v.key) confirmView(v); return; }
  if (id && pool().some(v => v.id === id) || (ADMIN && VACANCIES.some(v => v.id === id))) openV(id); };
fromHash(); addEventListener('hashchange', fromHash);
