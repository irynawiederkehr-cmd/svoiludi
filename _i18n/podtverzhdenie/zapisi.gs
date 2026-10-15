/* =====================================================================
   «Свои люди» — подтверждение записей одной кнопкой: события, курсы, акции, объявления (10.10.2026; подключено 11.10.2026;
   проверка ключа по отпечатку keyHash — 11.10.2026, вечер).
   Решение Ирины: «процедура подтверждения будет такая же, как у карточки специалиста».

   Что делает: человек открывает ссылку предпросмотра (svoiludi.ch/events/#ok=<id>.<key>, kursy/#ok=…, vakansii/#ok=…),
   ставит галочку и нажимает «Подтверждаю». Сайт (assets/podtverdit.js) зовёт это веб-приложение:
     GET ?what=confirm&kind=event|kurs|vacancy (или eventfix|kursfix|vacancyfix)&id=…&key=…&lang=ru|uk[&checks=a,b][&text=…]
     «Снять с сайта» (решение Ирины 11.10.2026, 21:45): kind=eventoff|kursoff|vacancyoff — ссылка …/#off=<id>.<ключ> из письма о публикации;
     строка «… — снять с сайта» и письмо Ирине «🌿 Свои люди: Снять с сайта — …». Снять можно всегда, даже если карточка на паузе.
     Claude ставит в данных status 'снято' и off: { date, via } — запись уходит в архив, в заявке её можно повторить кнопкой «Повторить».
   Скрипт сверяет отпечаток ключа из ссылки (SHA-256) с keyHash в данных сайта (data/afisha.js, data/vacancies.js) — сам ключ
   в открытых данных не хранится (11.10.2026), поэтому подтвердить запись за другого человека нельзя. Образцы (sample) не принимает. Пишет строку в таблицу
   «Свои люди — подтверждения записей» (со снимком записи — это доказательство согласия), шлёт письмо Ирине
   «🌿 Свои люди: Событие подтверждено — …» и копию на e-mail из карточки организатора или автора.
   Ответ: {"ok":true,"time":"10.10.2026, 21:05","copy":true} или {"ok":false,"error":"…"} — тогда сайт предлагает письмо.

   Отдельное веб-приложение, чтобы не трогать скрипт подтверждения карточек (22 Тесты\Code_Google_Sheets.gs).

   Где работает (11.10.2026): проект Apps Script «Свои люди — подтверждение записей» в аккаунте iryna.wiederkehr@gmail.com
   (там же скрипт карточек «Тесты — заявки» и «Реестр документов»), выполняется от имени Ирины, доступ «Все».
   Если скрипт меняется: «Развертывание» → «Управление развертываниями» → карандаш → «Версия: новая» → «Развернуть» (адрес не меняется).

   Как подключить заново (если понадобится):
     1. script.google.com → «Создать проект», назвать «Свои люди — подтверждение записей».
     2. Стереть пример и вставить этот текст. Сохранить.
     3. Выбрать функцию setup и нажать «Выполнить» — дать разрешения (таблицы, почта, внешние запросы).
        Скрипт сам создаст таблицу «Свои люди — подтверждения записей» на Google Диске и запомнит её.
     4. «Начать развертывание» → «Новое развертывание» → тип «Веб-приложение»:
        «Выполнять от имени: Я», «У кого есть доступ: Все» → «Начать развертывание».
     5. Скопировать адрес веб-приложения (…/macros/s/…/exec) и прислать Claude: он впишет его в assets/podtverdit.js (ZAPIS_URL).
   ===================================================================== */
const ZS_SITE = 'https://svoiludi.ch/';
const ZS_TO = 'iryna.wiederkehr@gmail.com';          // письмо Ирине о каждом подтверждении
const ZS_REPLY = 'voznesenskaya.iryna@gmail.com';    // ответы на копию — на почту справочника
const ZS_NAME = 'Свои люди в Швейцарии';
const ZS_TZ = 'Europe/Zurich';
const ZS_WHAT = {
  event:   { ru: ['Событие', 'событие', 'events'], uk: ['Подія', 'подію', 'events'] },
  kurs:    { ru: ['Курс', 'курс', 'kursy'], uk: ['Курс', 'курс', 'kursy'] },
  vacancy: { ru: ['Объявление', 'объявление', 'vakansii'], uk: ['Оголошення', 'оголошення', 'vakansii'] }
};

function setup() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty('SHEET_ID')) {
    const ss = SpreadsheetApp.create('Свои люди — подтверждения записей');
    const sh = ss.getSheets()[0]; sh.setName('Подтверждения');
    sh.appendRow(['Когда', 'Что', 'ID записи', 'Название', 'Кто', 'Номер карточки', 'UID', 'E-mail из карточки', 'Условия', 'Исправления', 'Снимок записи']);
    sh.setFrozenRows(1);
    props.setProperty('SHEET_ID', ss.getId());
  }
  zsLoad_('afisha.js', 'AFISHA');   // проверка доступа к сайту
  return 'Готово: таблица ' + props.getProperty('SHEET_ID');
}

function doGet(e) {
  let out;
  try { out = zsConfirm_((e && e.parameter) || {}); }
  catch (x) { out = { ok: false, error: String((x && x.message) || x) }; }
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}

function zsLoad_(file, name, key) {
  const txt = UrlFetchApp.fetch(ZS_SITE + 'data/' + file + '?t=' + Date.now()).getContentText('UTF-8');
  // открытый вид (afisha.js — объект JavaScript, остальные — JSON) и зашифрованный после переезда («Тайна», 15.10.2026): заглушки открываются ключом из ссылки
  return tajnaList_(txt, name, key);
}

// SHA-256 ключа из ссылки — так же, как страница считает keyHash (_i18n/pochta/klyuch.py, 11.10.2026)
function zsHash_(k) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(k || ''), Utilities.Charset.UTF_8)
    .map(function (b) { return ('0' + ((b + 256) % 256).toString(16)).slice(-2); }).join('');
}

function zsConfirm_(p) {
  if (p.what !== 'confirm') return { ok: false, error: 'what' };
  const kind = String(p.kind || ''), fix = /fix$/.test(kind), off = /off$/.test(kind), base = kind.replace(/(fix|off)$/, '');
  if (!ZS_WHAT[base]) return { ok: false, error: 'kind' };
  const lang = p.lang === 'uk' ? 'uk' : 'ru', W = ZS_WHAT[base][lang];
  const list = base === 'vacancy' ? zsLoad_('vacancies.js', 'VACANCIES', p.key) : zsLoad_('afisha.js', 'AFISHA', p.key);
  const x = list.filter(r => r.id === p.id)[0];
  if (!x || !x.keyHash || !p.key || zsHash_(p.key) !== x.keyHash) return { ok: false, error: 'key' };
  if (x.sample) return { ok: false, error: 'sample' };   // образцы на сайте вымышленные, подтверждать нечего
  const text = String(p.text || '').slice(0, 1500);
  if (fix && !text) return { ok: false, error: 'text' };

  // кто: карточка организатора или автора (специалист — строка id, организация — { org: id })
  const sp = zsLoad_('specialists.js', 'SPECIALISTS', p.key), og = zsLoad_('organizations.js', 'ORGANIZATIONS', p.key);
  const who = base === 'vacancy' ? x.author : (x.organizers || [])[0];
  const card = typeof who === 'string' ? sp.filter(s => s.id === who)[0] : (who && who.org ? og.filter(o => o.id === who.org)[0] : null);
  const name = card ? card.name : ((who && who.name) || '');
  const num = (card && card.num) || '', uid = (card && (card.uid || (/CHE/.test(card.zefix || '') ? card.zefix : ''))) || '';
  const email = (card && card.contacts && card.contacts.email) || (who && who.contacts && who.contacts.email) || (!card && x.contacts && x.contacts.email) || '';
  // только активная карточка (решение Ирины 10.10.2026, 22:12): на паузе, на подтверждении или с прошедшим сроком — не подтверждаем
  const today = Utilities.formatDate(new Date(), ZS_TZ, 'yyyy-MM-dd');
  if (card && !off && (card.status !== 'активен' || (card.paidUntil && card.paidUntil < today) || (who && who.org && !card.confirm))) return { ok: false, error: 'card' };

  // защита от двойного нажатия: одинаковый запрос в течение 2 минут не повторяем
  const cache = CacheService.getScriptCache(), ck = [kind, x.id, text].join('|').slice(0, 240);
  const time = Utilities.formatDate(new Date(), ZS_TZ, 'dd.MM.yyyy, HH:mm');
  if (cache.get(ck)) return { ok: true, time: cache.get(ck), copy: !!email && !fix && !off };
  cache.put(ck, time, 120);

  const props = PropertiesService.getScriptProperties();
  const sh = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheets()[0];
  sh.appendRow([time, W[0] + (fix ? ' — исправления' : off ? ' — снять с сайта' : ' — подтверждено'), x.id, x.title, name, num, uid, email, String(p.checks || ''), text, JSON.stringify(x)]);

  const url = ZS_SITE + W[2] + (off ? '/#off=' : '/#ok=') + x.id + '.' + p.key;   // ключ — из ссылки, он уже проверен по отпечатку
  const tag = name + (num ? ', ' + num : '');
  const su = fix ? `🌿 Свои люди: Исправления — ${x.title} (${tag})` : off ? `🌿 Свои люди: Снять с сайта — ${x.title} (${tag})` : `🌿 Свои люди: ${W[0]} подтверждено — ${x.title} (${tag})`;
  const body = [
    fix ? `${name} просит исправить ${W[1]} «${x.title}»:` : off ? `${name} просит снять ${W[1]} «${x.title}» с сайта и перенести в архив (кнопка на сайте).` : `${name} подтвердил(а) ${W[1]} «${x.title}» кнопкой на сайте.`,
    '', fix ? text : '', fix || off ? '' : (p.checks ? 'Отмечены условия: ' + p.checks : ''),
    'Когда: ' + time, 'Карточка: ' + (num || '—') + (uid ? ', UID ' + uid : ''), 'E-mail из карточки: ' + (email || '—'),
    '', 'Ссылка: ' + url, '', fix ? 'Claude внесёт исправления и подготовит ссылку ещё раз.' : off ? 'Claude снимет запись с сайта (status «снято», в архив) при ближайшей проверке писем.' : 'Claude поставит запись на сайт при ближайшей проверке писем.'
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  MailApp.sendEmail({ to: ZS_TO, replyTo: email || ZS_REPLY, name: ZS_NAME, subject: su, body: body });

  let copy = false;
  if (email && !fix && !off) {
    const csu = lang === 'uk' ? `🌿 Ви підтвердили ${W[1]} «${x.title}»` : `🌿 Вы подтвердили ${W[1]} «${x.title}»`;
    const cbody = lang === 'uk'
      ? `Вітаємо${name ? ', ' + name : ''}!\n\n${time} ви підтвердили ${W[1]} «${x.title}» для сайту «Свої люди у Швейцарії». Ми опублікуємо його найближчим часом.\n\n${url}\n\nПідтвердивши, ви прийняли умови розміщення. Перечитати їх можна будь-коли: ${ZS_SITE}uk/usloviya/\nКоли запис знімають і за що виключають із проєкту: ${ZS_SITE}uk/usloviya/#isklyuchenie\n\nЯкщо щось зміниться, просто дайте відповідь на цей лист.\n\nПроєкт 🌿 «Свої люди» створено для того, щоб зробити ваше життя у Швейцарії максимально легким і без стресу.\n\nСвої люди у Швейцарії`
      : `Здравствуйте${name ? ', ' + name : ''}!\n\n${time} вы подтвердили ${W[1]} «${x.title}» для сайта «Свои люди в Швейцарии». Мы опубликуем его в ближайшее время.\n\n${url}\n\nПодтвердив, вы приняли условия размещения. Перечитать их можно в любой момент: ${ZS_SITE}usloviya/\nКогда запись снимают и за что исключают из проекта: ${ZS_SITE}usloviya/#isklyuchenie\n\nЕсли что-то изменится, просто ответьте на это письмо.\n\nПроект 🌿 «Свои люди» создан для того, чтобы сделать вашу жизнь в Швейцарии максимально лёгкой и без стресса.\n\nСвои люди в Швейцарии`;
    MailApp.sendEmail({ to: email, replyTo: ZS_REPLY, name: ZS_NAME, subject: csu, body: cbody });
    copy = true;
  }
  return { ok: true, time: time, copy: copy };
}

/* «Тайна» для скриптов Google (15.10.2026) — вставить в конец скрипта, который читает data/*.js сайта
   (подтверждение карточек «Тесты — заявки», «Свои люди — подтверждение записей» _i18n/podtverzhdenie/zapisi.gs).
   После переезда сайта записи «на подтверждении» в опубликованных data/*.js зашифрованы: вместо записи — заглушка
   { tajna: 1, g, w, a, e } (_i18n/tajna/README.md). Скрипт открывает её тем же ключом из ссылки, который присылает страница.
   Работает и со старым, открытым видом файлов — поэтому новую версию можно выложить заранее.

   tajnaList_(text, name, key) → массив window.<name> из текста файла сайта; заглушки с этим ключом открыты, остальные убраны. */
function tajnaList_(text, name, key) {
  var m = new RegExp('(^|\\n)[ \\t]*window\\.' + name + '\\s*=').exec(text);   // присваивание в начале строки, не упоминание в комментарии
  if (!m) throw new Error('в файле нет window.' + name);
  var i = m.index + m[0].length;
  var src = tajnaArrayText_(text, text.indexOf('[', i)), list;
  try { list = JSON.parse(src); } catch (e) { list = new Function('return ' + src)(); }   // afisha.js в открытом виде — объект JavaScript
  return tajnaOpen_(list, key);
}

/* текст массива от '[' до парной ']' — с учётом строк и комментариев */
function tajnaArrayText_(t, j) {
  if (j < 0) throw new Error('нет массива');
  var depth = 0, q = '';
  for (var p = j; p < t.length; p++) {
    var c = t.charAt(p);
    if (q) { if (c === '\\') p++; else if (c === q) q = ''; continue; }
    if (c === '"' || c === "'" || c === '`') { q = c; continue; }
    if (c === '/' && t.charAt(p + 1) === '/') { p = t.indexOf('\n', p); if (p < 0) break; continue; }
    if (c === '/' && t.charAt(p + 1) === '*') { p = t.indexOf('*/', p + 2) + 1; if (p <= 0) break; continue; }
    if (c === '[' || c === '{') depth++;
    else if (c === ']' || c === '}') { depth--; if (depth === 0) return t.slice(j, p + 1); }
  }
  throw new Error('массив не закрыт');
}

function tajnaOpen_(list, key) {
  var out = [], g = null, kek = null;
  for (var i = 0; i < list.length; i++) {
    var s = list[i];
    if (!s || !s.tajna) { out.push(s); continue; }
    if (!key || !s.g || !s.w) continue;
    if (g === null) {
      g = tajnaHex_(tajnaHmac_(tajnaBytes_(key), tajnaBytes_('svoiludi-tajna-g1'))).slice(0, 16);
      kek = tajnaHmac_(tajnaBytes_(key), tajnaBytes_('svoiludi-tajna-k1'));
    }
    if (s.g !== g) continue;
    var dk = tajnaUnseal_(kek, Utilities.base64Decode(s.w)); if (!dk) continue;
    var pt = tajnaUnseal_(dk, Utilities.base64Decode(s.e)); if (!pt) continue;
    out.push(JSON.parse(Utilities.newBlob(pt).getDataAsString('UTF-8')));
  }
  return out;
}

/* запечатанный блок: nonce(16) | шифротекст | подпись(16); HMAC-SHA-256 в режиме счётчика — как в _i18n/tajna/zakryt.js и otkryt.js */
function tajnaUnseal_(key, box) {
  if (!box || box.length < 32) return null;
  var ek = tajnaHmac_(key, tajnaBytes_('svoiludi-tajna-enc1')), mk = tajnaHmac_(key, tajnaBytes_('svoiludi-tajna-mac1'));
  var nonce = box.slice(0, 16), ct = box.slice(16, box.length - 16), tag = box.slice(box.length - 16);
  var mac = tajnaHmac_(mk, nonce.concat(ct)), d = 0;
  for (var i = 0; i < 16; i++) d |= (mac[i] ^ tag[i]) & 255;
  if (d) return null;
  var out = [];
  for (var p = 0, n = 0; p < ct.length; p += 32, n++) {
    var ks = tajnaHmac_(ek, nonce.concat([tajnaSb_(n >>> 24), tajnaSb_(n >>> 16), tajnaSb_(n >>> 8), tajnaSb_(n)]));
    for (var j = 0; j < 32 && p + j < ct.length; j++) out.push(tajnaSb_(ct[p + j] ^ ks[j]));
  }
  return out;
}
function tajnaSb_(x) { x = x & 255; return x > 127 ? x - 256 : x; }
function tajnaHmac_(k, m) { return Utilities.computeHmacSignature(Utilities.MacAlgorithm.HMAC_SHA_256, m, k); }
function tajnaBytes_(s) { return Utilities.newBlob(String(s)).getBytes(); }
function tajnaHex_(b) { return b.map(function (x) { return ('0' + ((x + 256) % 256).toString(16)).slice(-2); }).join(''); }
