/* «Реестр документов» svoiludi.ch и voznesenskaya.ch (решение Ирины 10.10.2026, документ проекта «skachivanie-i-nomer.md»).
   Зачем: если кто-то придёт с упрёком или претензией из-за файла с сайта, по номеру на файле здесь видно, что перед скачиванием
   человек подтвердил: это образец, в нём могут быть ошибки, он перепроверит данные, решение и ответственность — его.
   Одна Google Таблица на оба сайта. Сайт присылает сюда запись о каждом скачанном файле: номер, дату, сайт, страницу,
   инструмент, язык, формат и версию текста галочки. Имени, e-mail, IP-адреса и того, что человек вписал, здесь нет и не будет.
   Сайт сюда только пишет: прочитать таблицу через этот адрес нельзя. Номера сверяет Ирина сама (поиск по листу года).

   КАК ПОСТАВИТЬ (один раз, 5 минут):
   1. В Google Диске: «Создать» → «Google Таблицы» → «Пустая таблица». Назвать «Реестр документов — svoiludi.ch и voznesenskaya.ch».
   2. В таблице: «Расширения» → «Apps Script». Стереть всё, что там написано, и вставить весь этот файл. Сохранить (значок дискеты).
   3. Сверху выбрать функцию «ustanovka» и нажать «Выполнить». Google спросит разрешение — «Просмотреть разрешения» → свой аккаунт →
      «Дополнительно» → «Перейти на страницу…» → «Разрешить». Появятся листы «Тексты» и лист текущего года.
   4. «Начать развертывание» → «Новое развертывание» → значок шестерёнки → «Веб-приложение».
      «Выполнять от имени»: Я. «У кого есть доступ»: Все. → «Начать развертывание» → скопировать «URL веб-приложения» (…/exec).
   5. Прислать этот адрес Claude: он впишет его в assets/skachivanie.js на обоих сайтах (константа ENDPOINT).
   Если скрипт меняется: «Начать развертывание» → «Управление развертываниями» → карандаш → «Версия: новая» → «Развернуть» (адрес не меняется). */

var TZ = 'Europe/Zurich';
var HEAD = ['Номер', 'Дата и время (Цюрих)', 'Время на устройстве (UTC)', 'Сайт', 'Страница', 'Инструмент или документ', 'Язык документа', 'Язык страницы', 'Формат', 'Версия текста галочки', 'Подтверждено'];
var RX = /^(SL|VZ)-(\d{4})(\d{2})(\d{2})-[2-9A-HJKMNP-Z]{6}$/;
var SITES = {'svoiludi.ch': 1, 'voznesenskaya.ch': 1};
var VERS = {'G1': 1, 'T1': 1};
var KEEP_YEARS = 10;

/* тексты галочки по версиям: что именно человек видел на экране. Старые версии не менять — только добавлять новые. */
var TEXTS = [
  ['G1', '10.10.2026', 'svoiludi.ch', 'ru', 'Я понимаю: это образец для личного использования, а не официальный документ и не юридическая, налоговая или финансовая консультация. В нём могут быть ошибки. Я перепроверю все данные и суммы в официальном источнике или у специалиста. Решение и ответственность за то, как я им воспользуюсь, остаются за мной.'],
  ['G1', '10.10.2026', 'svoiludi.ch', 'uk', 'Я розумію: це зразок для особистого використання, а не офіційний документ і не юридична, податкова чи фінансова консультація. У ньому можуть бути помилки. Я перевірю всі дані та суми в офіційному джерелі або у фахівця. Рішення й відповідальність за те, як я ним скористаюся, залишаються за мною.'],
  ['T1', '10.10.2026', 'voznesenskaya.ch', 'ru', 'Я понимаю: это инструмент для размышления, а не диагноз и не психологическая консультация. Решение и ответственность за то, как я воспользуюсь результатом, остаются за мной.'],
  ['T1', '10.10.2026', 'voznesenskaya.ch', 'uk', 'Я розумію: це інструмент для роздумів, а не діагноз і не психологічна консультація. Рішення й відповідальність за те, як я скористаюся результатом, залишаються за мною.'],
  ['T1', '10.10.2026', 'voznesenskaya.ch', 'de', 'Ich verstehe: Das ist ein Werkzeug zum Nachdenken, keine Diagnose und keine psychologische Beratung. Die Entscheidung und die Verantwortung dafür, wie ich das Ergebnis nutze, liegen bei mir.'],
  ['T1', '10.10.2026', 'voznesenskaya.ch', 'en', 'I understand: this is a tool for reflection, not a diagnosis and not psychological counselling. The decision and the responsibility for how I use the result are mine.']
];

function book(){ return SpreadsheetApp.getActiveSpreadsheet(); }
function yearSheet(ss, y){
  var sh = ss.getSheetByName(String(y));
  if (!sh) { sh = ss.insertSheet(String(y)); sh.appendRow(HEAD); sh.setFrozenRows(1); sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold'); sh.setColumnWidth(1, 190); sh.setColumnWidth(6, 260); }
  return sh;
}
function ustanovka(){
  var ss = book();
  var t = ss.getSheetByName('Тексты') || ss.insertSheet('Тексты', 0);
  t.clear(); t.appendRow(['Версия', 'С какого числа', 'Сайт', 'Язык', 'Текст галочки, который человек отметил перед скачиванием']);
  t.getRange(2, 1, TEXTS.length, 5).setValues(TEXTS); t.setFrozenRows(1); t.getRange(1, 1, 1, 5).setFontWeight('bold'); t.setColumnWidth(5, 700);
  yearSheet(ss, new Date().getFullYear());
  var s1 = ss.getSheetByName('Лист1') || ss.getSheetByName('Sheet1') || ss.getSheetByName('Tabelle1'); if (s1 && s1.getLastRow() === 0 && ss.getSheets().length > 1) ss.deleteSheet(s1);
  /* раз в год 2 января — убрать листы старше 10 лет */
  ScriptApp.getProjectTriggers().forEach(function(tr){ if (tr.getHandlerFunction() === 'chistka') ScriptApp.deleteTrigger(tr); });
  ScriptApp.newTrigger('chistka').timeBased().onMonthDay(2).atHour(3).create();
}
function chistka(){
  var now = new Date(); if (now.getMonth() !== 0) return;
  var ss = book(), lim = now.getFullYear() - KEEP_YEARS;
  ss.getSheets().forEach(function(sh){ var n = +sh.getName(); if (n && n < lim) ss.deleteSheet(sh); });
}
function clean(v, n){ return String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').replace(/^[=+\-@]/, "'$&").slice(0, n); }

function doPost(e){
  var out = {ok: true, n: 0};
  try {
    var body = JSON.parse(e && e.postData && e.postData.contents || '{}');
    if (body.kind !== 'doc') return json({ok: false});
    var items = Array.isArray(body.items) ? body.items.slice(0, 50) : [body];
    var cache = CacheService.getScriptCache(), rows = {}, seen = {};
    items.forEach(function(r){
      var m = RX.exec(String(r.no || '')); if (!m || !SITES[r.site] || !VERS[r.ver] || seen[r.no] || cache.get(r.no)) return;
      if ((m[1] === 'VZ') !== (r.site === 'voznesenskaya.ch')) return;
      seen[r.no] = 1; var y = m[2];
      (rows[y] = rows[y] || []).push([r.no, Utilities.formatDate(new Date(), TZ, 'dd.MM.yyyy HH:mm:ss'), clean(r.t, 30), r.site, clean(r.page, 120), clean(r.tool, 120),
        clean(r.lang, 5), clean(r.pl, 5), clean(r.fmt, 30), r.ver, 'да']);
    });
    var years = Object.keys(rows); if (!years.length) return json(out);
    var lock = LockService.getScriptLock(); lock.waitLock(20000);
    try {
      var ss = book();
      years.forEach(function(y){ var sh = yearSheet(ss, y), list = rows[y]; sh.getRange(sh.getLastRow() + 1, 1, list.length, HEAD.length).setValues(list); out.n += list.length; });
    } finally { lock.releaseLock(); }
    Object.keys(seen).forEach(function(no){ cache.put(no, '1', 21600); });
  } catch (err) { out = {ok: false}; }
  return json(out);
}
function doGet(){ return json({ok: true, what: 'Реестр документов svoiludi.ch и voznesenskaya.ch. Только запись.'}); }
function json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
