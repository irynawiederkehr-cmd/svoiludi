#!/usr/bin/env node
/* «Тайна» — проверка опубликованной копии (15.10.2026). Запуск из корня репозитория после zakryt.js:
     node _i18n/tajna/proverka.js [--out _site] [--klyuchi <файл ключей>]
   Открывает каждый data/*.js копии так, как это делает браузер (тот же otkryt.js), и сверяет с открытыми данными репозитория:
   1) посетитель без ключа видит ровно открытые записи, в том же порядке;
   2) по каждому ключу из файла ключей — открытые записи плюс все скрытые записи с этим ключом (карточка лида и её черновики), и ничего чужого;
   3) владелец (ключ после пароля) видит всё, как в репозитории;
   4) чужой ключ и испорченная заглушка ничего не открывают;
   5) SHA-256 и HMAC в otkryt.js совпадают с Node на случайных данных.
   Код выхода 0 — всё совпало. */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), util = require('util');
const Z = require('./zakryt.js');
const ROOT = Z.ROOT;
function arg(n, d) { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : d; }
const out = path.resolve(arg('--out', path.join(ROOT, '_site')));
const keys = Z.loadKeys(path.resolve(arg('--klyuchi', process.env.TAJNA_KLYUCHI || path.join(ROOT, '_i18n/tajna/klyuchi.json'))));
let fails = 0;
const fail = m => { fails++; console.error('НЕ СОВПАЛО: ' + m); };

function browser(file, opt) {
  const store = Object.assign({}, opt.ls || {});
  const win = { addEventListener() {}, TextEncoder, TextDecoder, atob: s => Buffer.from(s, 'base64').toString('binary') };
  win.window = win;
  win.location = { hash: opt.hash || '', search: opt.search || '', pathname: '/', reload() {} };
  win.localStorage = { getItem: k => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
  win.history = { state: null, replaceState(s, t, u) { const q = u.indexOf('?'); win.location.search = q >= 0 ? u.slice(q).replace(/#.*/, '') : ''; } };
  win.document = { readyState: 'complete', documentElement: { classList: { remove() {}, add() {} } }, addEventListener() {}, getElementById: () => null };
  win.setTimeout = () => {};
  win.history.replaceState = win.history.replaceState.bind(win.history);
  const ctx = vm.createContext(win);
  for (const f of [].concat(file)) vm.runInContext(fs.readFileSync(f, 'utf8'), ctx, { filename: f });
  return { win, store };
}
const strip = r => { const c = JSON.parse(JSON.stringify(r)); delete c.photo; return c; };
const eq = (a, b) => util.isDeepStrictEqual(JSON.parse(JSON.stringify(a || null)).map(strip), JSON.parse(JSON.stringify(b)).map(strip));

/* 5. SHA-256 и HMAC браузерной части — через заглушку с известным ключом */
(function () {
  for (let n = 0; n < 200; n++) {
    const len = [0, 1, 31, 32, 55, 56, 63, 64, 65, 119, 120, 1000][n % 12] + (n > 11 ? crypto.randomInt(0, 300) : 0);
    const pt = crypto.randomBytes(len), k = crypto.randomBytes(1 + crypto.randomInt(0, 90)).toString('base64').replace(/[^A-Za-z0-9]/g, 'x').slice(0, 24);
    if (k.length < 6) continue;
    const rec = { id: 'proba-' + n, status: 'на подтверждении', blob: pt.toString('base64') }, s = Z.seal(crypto.randomBytes(32), Buffer.alloc(0));
    void s;
    const stub = (function () { const dk = crypto.randomBytes(32); return { tajna: 1, g: Z.gtag(k), w: Z.seal(Z.kek(k), dk).toString('base64'), a: Z.seal(crypto.randomBytes(32), dk).toString('base64'), e: Z.seal(dk, Buffer.from(JSON.stringify(rec))).toString('base64') }; })();
    const tmp = path.join(require('os').tmpdir(), 'tajna-proba.js');
    fs.writeFileSync(tmp, fs.readFileSync(path.join(__dirname, 'otkryt.js'), 'utf8') + '\nwindow.X = window.__tajna.open(' + JSON.stringify([stub]) + ', {"chk":"0"});');
    const { win } = browser(tmp, { hash: '#preview=proba-' + n + '.' + k });
    if (!win.X || win.X.length !== 1 || win.X[0].blob !== rec.blob) { fail('шифр браузера на длине ' + len); break; }
  }
})();

/* 1–4 по каждому файлу данных */
const DATA = ['specialists', 'organizations', 'afisha', 'vacancies'];
const A = keys.admin.key;
for (const base of DATA) for (const L of ['', '.uk']) {
  const rel = 'data/' + base + L + '.js', src = path.join(ROOT, rel), pub = path.join(out, rel);
  if (!fs.existsSync(src)) continue;
  if (!fs.existsSync(pub)) { fail('нет ' + rel + ' в копии'); continue; }
  const S = Z.readData(src);
  const t = fs.readFileSync(pub, 'utf8');
  for (const [name, arr] of Object.entries(S)) {
    if (!Array.isArray(arr)) continue;
    const open = arr.filter(r => !Z.isHidden(r));
    const got0 = browser(pub, {}).win[name];
    if (!eq(got0, open)) fail(rel + ': посетитель без ключа видит не то (' + got0.length + ' вместо ' + open.length + ')');
    const gotA = browser(pub, { ls: { 'svoiludi-tajna': A, 'svoiludi-admin': '1' } }).win[name];
    if (!eq(gotA, arr)) fail(rel + ': владелец видит не всё (' + gotA.length + ' из ' + arr.length + ')');
    const byKey = {};
    arr.filter(Z.isHidden).forEach(r => { const k = keys.klyuchi[r.id]; if (k && (!r.keyHash || Z.sha(k) === r.keyHash)) (byKey[k] = byKey[k] || []).push(r.id); });
    for (const [k, ids] of Object.entries(byKey)) {
      const want = arr.filter(r => !Z.isHidden(r) || ids.includes(r.id));
      const got = browser(pub, { hash: '#preview=' + ids[0] + '.' + k }).win[name];
      if (!eq(got, want)) fail(rel + ': ключ ' + ids[0] + ' открывает не то (' + got.length + ' вместо ' + want.length + ')');
      const gotOk = browser(pub, { hash: '#ok=' + encodeURIComponent(ids[0] + '.' + k).replace('.', '%2E') }).win[name];
      if (!eq(gotOk, want)) fail(rel + ': ссылка #ok= с кодированием для ' + ids[0]);
    }
    const bad = browser(pub, { hash: '#preview=x.' + 'a'.repeat(24), ls: { 'svoiludi-tajna': '0'.repeat(64) } }).win[name];
    if (!eq(bad, open)) fail(rel + ': чужой ключ что-то открыл');
    for (const r of arr.filter(Z.isHidden)) if (r.photo && !/^https?:/.test(r.photo)) {
      const g = gotA.find(x => x.id === r.id), dir = base === 'organizations' ? 'img/org/' : 'img/';
      if (g && !fs.existsSync(path.join(out, dir, g.photo))) fail(rel + ': нет фото ' + dir + g.photo + ' у ' + r.id);
    }
  }
  for (const [name, v] of Object.entries(browser(pub, {}).win)) if (Array.isArray(v) && /^[A-Z]+$/.test(name)) v.filter(Z.isHidden).forEach(r => fail(rel + ': в копии открыта скрытая запись ' + r.id));
  if (!/window\.__tajna\.open\(/.test(t)) fail(rel + ': в копии нет открывашки otkryt.js');
}
/* испорченная заглушка не ломает страницу */
(function () {
  const f = path.join(out, 'data/specialists.js'); if (!fs.existsSync(f)) return;
  const t = fs.readFileSync(f, 'utf8').replace(/"e":"([A-Za-z0-9+/]{10})/, (m, x) => '"e":"' + x.split('').reverse().join(''));
  const tmp = path.join(require('os').tmpdir(), 'tajna-isporch.js'); fs.writeFileSync(tmp, t);
  try { browser(tmp, { ls: { 'svoiludi-tajna': A } }); } catch (e) { fail('испорченная заглушка ломает страницу: ' + e.message); }
})();
/* режим владельца: без пароля ?ira=1 снимается, флаг выключается */
(function () {
  const f = path.join(out, 'data/specialists.js'); if (!fs.existsSync(f)) return;
  const { win, store } = browser(f, { search: '?ira=1', ls: { 'svoiludi-admin': '1' } });
  if (store['svoiludi-admin']) fail('режим владельца без пароля остался включён');
  if (/ira=1/.test(win.location.search)) fail('?ira=1 не убран из адреса');
})();

if (fails) { console.error('Ошибок: ' + fails); process.exit(1); }
console.log('Проверка «Тайны» пройдена: посетитель, каждый ключ из письма и владелец видят ровно то, что должны.');
