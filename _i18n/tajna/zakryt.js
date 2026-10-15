#!/usr/bin/env node
/* «Тайна» — публикация сайта со скрытыми записями под замком (15.10.2026). Подробно — _i18n/tajna/README.md.

   Запуск из корня репозитория:
     node _i18n/tajna/zakryt.js [--out _site] [--klyuchi <файл ключей>]
   Собирает в папку _site копию сайта для показа посетителям:
   - без служебных папок и файлов (_i18n, .git, .github, wrangler.jsonc, _site и всё, что начинается с точки);
   - в data/specialists, organizations, afisha, vacancies (RU и UK) каждая запись не «активен» (кроме образцов sample) заменена
     заглушкой { tajna: 1, g, w, a, e }: запись зашифрована случайным ключом, а он — ключом из ссылки письма (w) и ключом
     владельца (a). В начало файла вставлен _i18n/tajna/otkryt.js — он открывает записи на странице;
   - фото скрытых карточек (img/…, img/org/…) получают случайные имена, если их не использует ни одна открытая карточка;
   - в конце проверка: в _site не должно остаться ни одного имени, e-mail, телефона, id и отпечатка ключа скрытой записи.
   Файл ключей (по умолчанию _i18n/tajna/klyuchi.json, или переменная окружения TAJNA_KLYUCHI):
     { "admin": { "salt": "<hex>", "iter": 310000, "key": "<hex 32 байта>", "chk": "<hex 16>" }, "klyuchi": { "<id>": "<ключ из ссылки>", … } }
   Запись без ключа в файле открывается только у владельца (ссылка письма для неё не сработает) — скрипт об этом пишет.

     node _i18n/tajna/zakryt.js --novyj-parol "<пароль>" [--klyuchi <файл>]
   Новый пароль режима владельца: пересчитывает admin в файле ключей (после этого — снова собрать и выложить сайт). */
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), util = require('util');

const ROOT = path.resolve(__dirname, '..', '..');
const DATA = [['specialists', 'img/'], ['organizations', 'img/org/'], ['afisha', ''], ['vacancies', '']];
const SKIP = new Set(['.git', '.github', '_i18n', '_site', 'node_modules', 'wrangler.jsonc', 'wrangler.toml']);
/* открытые контакты самой Ирины и проекта: они есть на всех страницах, поэтому в проверке «следов» их не ищем (её карточка коуча — на паузе) */
const PUBLIC_OK = new Set(['Ирина Вознесенская', 'Ірина Вознесенська', 'voznesenskaya.iryna@gmail.com', 'iryna.wiederkehr@gmail.com', 'https://voznesenskaya.ch',
  'https://voznesenskaya.ch/', 'voznesenskaya.ch', 'IrynaNeuroCoach', '@IrynaNeuroCoach', 'https://t.me/IrynaNeuroCoach', 'iryna.voznesenskaya', '@iryna.voznesenskaya',
  'https://www.instagram.com/iryna.voznesenskaya/', '+41 79 195 35 18', '+41791953518']);

function arg(name, def) { const i = process.argv.indexOf(name); return i > 0 && process.argv[i + 1] !== undefined ? process.argv[i + 1] : def; }
const hmac = (k, m) => crypto.createHmac('sha256', k).update(m).digest();
const u8 = s => Buffer.from(String(s), 'utf8');

/* запечатать: nonce(16) | шифротекст | подпись(16) — так же, как unseal() в otkryt.js и tajnaUnseal_() в скриптах Google */
function seal(key, pt) {
  const ek = hmac(key, u8('svoiludi-tajna-enc1')), mk = hmac(key, u8('svoiludi-tajna-mac1'));
  const nonce = crypto.randomBytes(16), ct = Buffer.alloc(pt.length), blk = Buffer.alloc(20);
  nonce.copy(blk);
  for (let i = 0, n = 0; i < pt.length; i += 32, n++) {
    blk.writeUInt32BE(n, 16);
    const ks = hmac(ek, blk);
    for (let j = 0; j < 32 && i + j < pt.length; j++) ct[i + j] = pt[i + j] ^ ks[j];
  }
  const tag = hmac(mk, Buffer.concat([nonce, ct])).subarray(0, 16);
  return Buffer.concat([nonce, ct, tag]);
}
function unseal(key, box) {
  if (box.length < 32) return null;
  const ek = hmac(key, u8('svoiludi-tajna-enc1')), mk = hmac(key, u8('svoiludi-tajna-mac1'));
  const nonce = box.subarray(0, 16), ct = box.subarray(16, box.length - 16), tag = box.subarray(box.length - 16);
  if (!crypto.timingSafeEqual(hmac(mk, Buffer.concat([nonce, ct])).subarray(0, 16), tag)) return null;
  const out = Buffer.alloc(ct.length), blk = Buffer.alloc(20); nonce.copy(blk);
  for (let i = 0, n = 0; i < ct.length; i += 32, n++) { blk.writeUInt32BE(n, 16); const ks = hmac(ek, blk); for (let j = 0; j < 32 && i + j < ct.length; j++) out[i + j] = ct[i + j] ^ ks[j]; }
  return out;
}
const kek = k => hmac(u8(k), u8('svoiludi-tajna-k1'));
const gtag = k => hmac(u8(k), u8('svoiludi-tajna-g1')).toString('hex').slice(0, 16);
const sha = k => crypto.createHash('sha256').update(u8(k)).digest('hex');
const isHidden = r => !!r && typeof r === 'object' && !Array.isArray(r) && !r.sample && r.status !== 'активен';

function stub(rec, linkKey, adminKey) {
  const dk = crypto.randomBytes(32), s = { tajna: 1 };
  if (linkKey) { s.g = gtag(linkKey); s.w = seal(kek(linkKey), dk).toString('base64'); }
  s.a = seal(adminKey, dk).toString('base64');
  s.e = seal(dk, u8(JSON.stringify(rec))).toString('base64');
  return s;
}

/* data/*.js — это `window.X = [...]` (afisha.js — объект JavaScript, остальные — JSON); читаем как браузер и проверяем, что JSON ничего не теряет */
function readData(file) {
  const ctx = { window: {} }; vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  const out = {};
  for (const [k, v] of Object.entries(ctx.window)) {
    const j = JSON.stringify(v);
    if (j === undefined) throw new Error(file + ': ' + k + ' не переводится в JSON');
    if (!util.isDeepStrictEqual(JSON.parse(j), JSON.parse(JSON.stringify(JSON.parse(j))))) throw new Error(file + ': ' + k + ' меняется при переводе в JSON');
    out[k] = JSON.parse(j);
  }
  return out;
}

function loadKeys(file) {
  if (!fs.existsSync(file)) throw new Error('нет файла ключей ' + file + ' — см. _i18n/tajna/README.md');
  const k = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!k.admin || !/^[0-9a-f]{64}$/.test(k.admin.key || '') || !/^[0-9a-f]{32}$/.test(k.admin.salt || '')) throw new Error('в файле ключей нет admin.key или admin.salt');
  const chk = hmac(Buffer.from(k.admin.key, 'hex'), u8('svoiludi-tajna-chk1')).toString('hex').slice(0, 16);
  if (k.admin.chk && k.admin.chk !== chk) throw new Error('admin.chk не совпадает с admin.key');
  k.admin.chk = chk; k.admin.iter = k.admin.iter || 310000; k.klyuchi = k.klyuchi || {};
  return k;
}

function copyTree(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    if (SKIP.has(e.name) || (e.name.startsWith('.') && e.name !== '.well-known')) continue;
    const s = path.join(src, e.name), d = path.join(dst, e.name);
    if (e.isDirectory()) copyTree(s, d);
    else if (e.isFile()) fs.copyFileSync(s, d);
  }
}

function newPassword(pass, file) {
  if (!pass || pass.length < 12) throw new Error('пароль короче 12 знаков');
  const k = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : { klyuchi: {} };
  const salt = crypto.randomBytes(16), iter = 310000;
  const key = crypto.pbkdf2Sync(u8(pass), salt, iter, 32, 'sha256');
  k.admin = { salt: salt.toString('hex'), iter, key: key.toString('hex'), chk: hmac(key, u8('svoiludi-tajna-chk1')).toString('hex').slice(0, 16) };
  k.klyuchi = k.klyuchi || {};
  fs.writeFileSync(file, JSON.stringify(k, null, 1) + '\n');
  console.log('Пароль владельца записан в ' + file + '. Соберите и выложите сайт заново.');
}

function build(out, keys) {
  const admin = Buffer.from(keys.admin.key, 'hex');
  const meta = { salt: keys.admin.salt, iter: keys.admin.iter, chk: keys.admin.chk };
  const opener = fs.readFileSync(path.join(__dirname, 'otkryt.js'), 'utf8');

  fs.rmSync(out, { recursive: true, force: true });
  copyTree(ROOT, out);

  /* 1. читаем все файлы данных */
  const files = [];
  for (const [base, img] of DATA) for (const L of ['', '.uk']) {
    const rel = 'data/' + base + L + '.js';
    if (fs.existsSync(path.join(ROOT, rel))) files.push({ rel, img, vars: readData(path.join(ROOT, rel)) });
  }
  const pub = [], hidden = [];
  for (const f of files) for (const v of Object.values(f.vars)) if (Array.isArray(v)) v.forEach(r => (isHidden(r) ? hidden : pub).push({ r, img: f.img }));

  /* 2. фото скрытых карточек — под случайное имя, если открытые карточки этот файл не используют */
  const renamed = {}, moved = new Set();
  for (const h of hidden) {
    const r = h.r;
    if (!h.img || !r.photo || /^(https?:|data:|\/)/.test(r.photo) || r.photo.includes('..')) continue;
    if (pub.some(p => p.img === h.img && p.r.photo === r.photo)) continue;
    const from = path.join(out, h.img, r.photo);
    if (!fs.existsSync(from)) continue;
    const k = h.img + r.photo;
    if (!renamed[k]) {
      renamed[k] = crypto.randomBytes(9).toString('hex') + path.extname(r.photo).toLowerCase();
      fs.copyFileSync(from, path.join(out, h.img, renamed[k]));
    }
    moved.add(from);
    r.photo = renamed[k];
  }
  for (const f of moved) fs.rmSync(f, { force: true });

  /* 3. шифруем и пишем */
  const noKey = new Set(), wrongKey = new Set();
  for (const f of files) {
    let js = '/* Данные справочника svoiludi.ch. Записи, которых ещё нет на сайте, зашифрованы. */\n' + opener + '\n';
    for (const [name, val] of Object.entries(f.vars)) {
      if (!Array.isArray(val)) { js += 'window.' + name + ' = ' + JSON.stringify(val) + ';\n'; continue; }
      const arr = val.map(r => {
        if (!isHidden(r)) return r;
        let k = keys.klyuchi[r.id] || '';
        if (k && r.keyHash && sha(k) !== r.keyHash) { wrongKey.add(r.id); k = ''; }
        if (!k) noKey.add(r.id);
        return stub(r, k, admin);
      });
      js += 'window.' + name + ' = window.__tajna.open(' + JSON.stringify(arr) + ', ' + JSON.stringify(meta) + ');\n';
    }
    fs.writeFileSync(path.join(out, f.rel), js);
  }

  /* 4. проверка: в копии нет следов скрытых записей */
  const pubText = JSON.stringify(pub.map(p => p.r));
  const needles = new Set();
  const add = (v, min) => { v = String(v || '').trim(); if (v.length >= min && !pubText.includes(v) && !PUBLIC_OK.has(v)) needles.add(v); };
  for (const { r } of hidden) {
    add(r.id, 6); add(r.keyHash, 20);
    if (r.name && /\s/.test(r.name.trim())) add(r.name, 6);
    add(r.title, 12); add(r.about && r.about.slice(0, 40), 30);
    const c = r.contacts || {};
    ['email', 'phone', 'whatsapp', 'instagram', 'telegram', 'site', 'facebook'].forEach(x => add(c[x], 7));
    add(r.email, 7); add(r.phone, 7);
  }
  const leaks = [];
  (function scan(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) { scan(p); continue; }
      if (!/\.(html?|js|json|css|txt|xml|webmanifest|md|svg|ics|csv)$/i.test(e.name)) continue;
      const t = fs.readFileSync(p, 'utf8');
      for (const n of needles) if (t.includes(n)) leaks.push(path.relative(out, p) + ': «' + n.slice(0, 60) + '»');
    }
  })(out);
  for (const f of moved) if (fs.existsSync(f)) leaks.push('фото осталось: ' + path.relative(out, f));
  return { hidden, pub, renamed, noKey, wrongKey, leaks };
}

function main() {
  const kf = path.resolve(arg('--klyuchi', process.env.TAJNA_KLYUCHI || path.join(ROOT, '_i18n/tajna/klyuchi.json')));
  if (process.argv.includes('--novyj-parol')) return newPassword(arg('--novyj-parol'), kf);
  const out = path.resolve(arg('--out', path.join(ROOT, '_site')));
  const rel = path.relative(ROOT, out), up = path.relative(out, ROOT);
  if (!rel || (up && !up.startsWith('..'))) throw new Error('папка --out не может быть корнем репозитория или папкой выше');
  if (!rel.startsWith('..') && !SKIP.has(rel.split(path.sep)[0])) throw new Error('внутри репозитория папка --out должна называться _site');
  const res = build(out, loadKeys(kf));
  const ids = new Set(res.hidden.map(h => h.r.id));
  console.log('Опубликованная копия: ' + out);
  console.log('Под замком: ' + res.hidden.length + ' записей (' + ids.size + ' разных id), открыто: ' + res.pub.length + ', фото с новым именем: ' + Object.keys(res.renamed).length);
  if (res.noKey.size) console.log('Без ключа ссылки — откроются только в режиме владельца: ' + [...res.noKey].sort().join(', '));
  if (res.wrongKey.size) console.log('ВНИМАНИЕ: ключ в файле не совпадает с keyHash, ссылка письма не откроет: ' + [...res.wrongKey].sort().join(', '));
  if (res.leaks.length) { console.error('ОШИБКА: в копии остались данные скрытых записей:\n  ' + res.leaks.slice(0, 40).join('\n  ')); process.exit(2); }
  console.log('Проверка пройдена: следов скрытых записей в копии нет.');
}

module.exports = { seal, unseal, kek, gtag, sha, hmac, build, loadKeys, readData, isHidden, ROOT };
if (require.main === module) {
  try { main(); } catch (e) { console.error('ОШИБКА: ' + e.message); process.exit(1); }
}
