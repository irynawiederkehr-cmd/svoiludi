/* =====================================================================
   «Свои люди» — подтверждение записей одной кнопкой: события, курсы, объявления (10.10.2026, КОПИЯ — ещё не подключено).
   Решение Ирины: «процедура подтверждения будет такая же, как у карточки специалиста».

   Что делает: человек открывает ссылку предпросмотра (svoiludi.ch/events/#ok=<id>.<key>, kursy/#ok=…, vakansii/#ok=…),
   ставит галочку и нажимает «Подтверждаю». Сайт (assets/podtverdit.js) зовёт это веб-приложение:
     GET ?what=confirm&kind=event|kurs|vacancy (или eventfix|kursfix|vacancyfix)&id=…&key=…&lang=ru|uk[&checks=a,b][&text=…]
   Скрипт сверяет id и key с данными сайта (data/afisha.js, data/vacancies.js), пишет строку в таблицу
   «Свои люди — подтверждения записей» (со снимком записи — это доказательство согласия), шлёт письмо Ирине
   «🌿 Свои люди: Событие подтверждено — …» и копию на e-mail из карточки организатора или автора.
   Ответ: {"ok":true,"time":"10.10.2026, 21:05","copy":true} или {"ok":false,"error":"…"} — тогда сайт предлагает письмо.

   Отдельное веб-приложение, чтобы не трогать скрипт подтверждения карточек (22 Тесты\Code_Google_Sheets.gs).

   Как подключить (один раз, Ирина, с аккаунта voznesenskaya.iryna@gmail.com):
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

function zsLoad_(file, name) {
  const txt = UrlFetchApp.fetch(ZS_SITE + 'data/' + file + '?t=' + Date.now()).getContentText('UTF-8');
  const i = txt.lastIndexOf('window.' + name + ' =');
  // afisha.js — объект JavaScript (ключи без кавычек), остальные файлы — JSON
  return new Function('return ' + txt.slice(i + ('window.' + name + ' =').length).trim().replace(/;\s*$/, ''))();
}

function zsConfirm_(p) {
  if (p.what !== 'confirm') return { ok: false, error: 'what' };
  const kind = String(p.kind || ''), fix = /fix$/.test(kind), base = kind.replace(/fix$/, '');
  if (!ZS_WHAT[base]) return { ok: false, error: 'kind' };
  const lang = p.lang === 'uk' ? 'uk' : 'ru', W = ZS_WHAT[base][lang];
  const list = base === 'vacancy' ? zsLoad_('vacancies.js', 'VACANCIES') : zsLoad_('afisha.js', 'AFISHA');
  const x = list.filter(r => r.id === p.id)[0];
  if (!x || !x.key || x.key !== p.key) return { ok: false, error: 'key' };
  const text = String(p.text || '').slice(0, 1500);
  if (fix && !text) return { ok: false, error: 'text' };

  // кто: карточка организатора или автора (специалист — строка id, организация — { org: id })
  const sp = zsLoad_('specialists.js', 'SPECIALISTS'), og = zsLoad_('organizations.js', 'ORGANIZATIONS');
  const who = base === 'vacancy' ? x.author : (x.organizers || [])[0];
  const card = typeof who === 'string' ? sp.filter(s => s.id === who)[0] : (who && who.org ? og.filter(o => o.id === who.org)[0] : null);
  const name = card ? card.name : ((who && who.name) || '');
  const num = (card && card.num) || '', uid = (card && (card.uid || (/CHE/.test(card.zefix || '') ? card.zefix : ''))) || '';
  const email = (card && card.contacts && card.contacts.email) || (who && who.contacts && who.contacts.email) || '';

  // защита от двойного нажатия: одинаковый запрос в течение 2 минут не повторяем
  const cache = CacheService.getScriptCache(), ck = [kind, x.id, text].join('|').slice(0, 240);
  const time = Utilities.formatDate(new Date(), ZS_TZ, 'dd.MM.yyyy, HH:mm');
  if (cache.get(ck)) return { ok: true, time: cache.get(ck), copy: !!email && !fix };
  cache.put(ck, time, 120);

  const props = PropertiesService.getScriptProperties();
  const sh = SpreadsheetApp.openById(props.getProperty('SHEET_ID')).getSheets()[0];
  sh.appendRow([time, W[0] + (fix ? ' — исправления' : ' — подтверждено'), x.id, x.title, name, num, uid, email, String(p.checks || ''), text, JSON.stringify(x)]);

  const url = ZS_SITE + W[2] + '/#ok=' + x.id + '.' + x.key;
  const tag = name + (num ? ', ' + num : '');
  const su = fix ? `🌿 Свои люди: Исправления — ${x.title} (${tag})` : `🌿 Свои люди: ${W[0]} подтверждено — ${x.title} (${tag})`;
  const body = [
    fix ? `${name} просит исправить ${W[1]} «${x.title}»:` : `${name} подтвердил(а) ${W[1]} «${x.title}» кнопкой на сайте.`,
    '', fix ? text : '', fix ? '' : (p.checks ? 'Отмечены условия: ' + p.checks : ''),
    'Когда: ' + time, 'Карточка: ' + (num || '—') + (uid ? ', UID ' + uid : ''), 'E-mail из карточки: ' + (email || '—'),
    '', 'Ссылка: ' + url, '', fix ? 'Claude внесёт исправления и подготовит ссылку ещё раз.' : 'Claude поставит запись на сайт при ближайшей проверке писем.'
  ].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
  MailApp.sendEmail({ to: ZS_TO, replyTo: email || ZS_REPLY, name: ZS_NAME, subject: su, body: body });

  let copy = false;
  if (email && !fix) {
    const csu = lang === 'uk' ? `🌿 Ви підтвердили ${W[1]} «${x.title}»` : `🌿 Вы подтвердили ${W[1]} «${x.title}»`;
    const cbody = lang === 'uk'
      ? `Вітаємо${name ? ', ' + name : ''}!\n\n${time} ви підтвердили ${W[1]} «${x.title}» для сайту «Свої люди у Швейцарії». Ми опублікуємо його найближчим часом.\n\n${url}\n\nЯкщо щось зміниться, просто дайте відповідь на цей лист.\n\nПроєкт 🌿 «Свої люди» створено для того, щоб зробити ваше життя у Швейцарії максимально легким і без стресу.\n\nСвої люди у Швейцарії`
      : `Здравствуйте${name ? ', ' + name : ''}!\n\n${time} вы подтвердили ${W[1]} «${x.title}» для сайта «Свои люди в Швейцарии». Мы опубликуем его в ближайшее время.\n\n${url}\n\nЕсли что-то изменится, просто ответьте на это письмо.\n\nПроект 🌿 «Свои люди» создан для того, чтобы сделать вашу жизнь в Швейцарии максимально лёгкой и без стресса.\n\nСвои люди в Швейцарии`;
    MailApp.sendEmail({ to: email, replyTo: ZS_REPLY, name: ZS_NAME, subject: csu, body: cbody });
    copy = true;
  }
  return { ok: true, time: time, copy: copy };
}
