#!/usr/bin/env node
/* «Тайна» — собрать ключи ссылок в файл ключей (15.10.2026).
     node _i18n/tajna/sobrat.js --klyuchi <файл ключей> <файл или папка> [<файл или папка> …]
     … | node _i18n/tajna/sobrat.js --klyuchi <файл ключей> -
   Ищет в текстах ссылки вида #preview=<id>.<ключ>, #ok=, #off=, #price=, #afisha= (и %23preview%3D… из писем Gmail),
   сверяет каждый ключ с keyHash записи в data/*.js и добавляет совпавшие в файл ключей. Черновикам лида, у которых тот же keyHash,
   что у карточки, ставит тот же ключ. Ключ, который не совпал ни с одной записью (старая ссылка), не берёт.
   Где искать до переезда: на компьютере Ирины — «Coaching - my business» (папки приглашений, «Письма с чистыми ссылками.html»),
   и «Отправленные» Gmail (письма лидам). В конце печатает скрытые записи, ключа которых так и нет. */
'use strict';
const fs = require('fs'), path = require('path');
const Z = require('./zakryt.js');
function arg(n) { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : ''; }
const kf = path.resolve(arg('--klyuchi') || path.join(Z.ROOT, '_i18n/tajna/klyuchi.json'));
const K = JSON.parse(fs.readFileSync(kf, 'utf8')); K.klyuchi = K.klyuchi || {};
const srcs = process.argv.slice(2).filter((a, i, all) => a !== '--klyuchi' && all[i - 1] !== '--klyuchi');

const texts = [];
function walk(p) {
  if (p === '-') { texts.push(fs.readFileSync(0, 'utf8')); return; }
  const st = fs.statSync(p);
  if (st.isDirectory()) { for (const e of fs.readdirSync(p)) walk(path.join(p, e)); return; }
  if (/\.(md|txt|html?|json|eml|csv|js)$/i.test(p) && st.size < 20e6) texts.push(fs.readFileSync(p, 'utf8'));
}
const re = /(?:preview|ok|off|price|afisha)(?:=|%3D)([a-z0-9-]+)(?:\.|%2E)([A-Za-z0-9_-]{6,64})/g;
srcs.forEach(s => walk(s));

const recs = [];
for (const f of ['specialists', 'organizations', 'afisha', 'vacancies']) {
  const p = path.join(Z.ROOT, 'data', f + '.js');
  if (fs.existsSync(p)) for (const v of Object.values(Z.readData(p))) if (Array.isArray(v)) recs.push(...v);
}
const byId = {}; recs.forEach(r => { if (r && r.id) byId[r.id] = r; });
let added = 0;
const add = (id, k) => { if (K.klyuchi[id] !== k) { K.klyuchi[id] = k; added++; } };
const keys = new Set();
for (const t of texts) { let m; while ((m = re.exec(t))) { const r = byId[m[1]]; keys.add(m[2]); if (r && r.keyHash && Z.sha(m[2]) === r.keyHash) add(r.id, m[2]); } }
/* тот же отпечаток — тот же ключ (черновики лида) */
const byHash = {}; Object.values(K.klyuchi).concat([...keys]).forEach(k => { byHash[Z.sha(k)] = k; });
recs.forEach(r => { if (r && r.keyHash && !K.klyuchi[r.id] && byHash[r.keyHash]) add(r.id, byHash[r.keyHash]); });
fs.writeFileSync(kf, JSON.stringify(K, null, 1) + '\n');
const miss = recs.filter(r => Z.isHidden(r) && r.keyHash && !K.klyuchi[r.id]).map(r => r.id);
console.log('Ключей добавлено или обновлено: ' + added + ', всего в файле: ' + Object.keys(K.klyuchi).length);
console.log(miss.length ? 'Скрытые записи без ключа (откроются только у владельца): ' + miss.join(', ') : 'У всех скрытых записей с отпечатком есть ключ.');
