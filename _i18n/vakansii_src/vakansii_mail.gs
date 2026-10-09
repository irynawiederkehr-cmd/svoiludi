/* =====================================================================
   «Свои люди» — письма авторам объявлений (вакансии и партнёрство). 07.10.2026, КОПИЯ — ещё не подключено.

   Что делает: раз в день читает объявления с сайта и пишет автору
     • за 7 дней до окончания: «через неделю объявление снимется, продлить — ответьте на это письмо»;
     • в день окончания срока: «объявление снято с сайта».
   Само снятие делает сайт: после даты until объявление не показывается.

   Как подключить (один раз, Ирина, с аккаунта voznesenskaya.iryna@gmail.com):
     1. Открыть таблицу «Тесты — заявки» → Расширения → Apps Script.
     2. Создать файл vakansii_mail.gs и вставить этот текст.
     3. Выбрать функцию vacancyMails и нажать «Выполнить» — дать разрешения (почта, внешние запросы).
     4. Слева «Триггеры» (будильник) → «Добавить триггер»: функция vacancyMails, источник «По времени»,
        «Ежедневно», 7–8 утра.
   Уже отправленные письма отмечаются в свойствах скрипта, повторно не уходят.
   ===================================================================== */
const VAC_SITE = 'https://svoiludi.ch/';
const VAC_FROM_NAME = 'Свои люди в Швейцарии';
const VAC_REPLY = 'voznesenskaya.iryna@gmail.com';
const VAC_COPY = 'voznesenskaya.iryna@gmail.com';   // копия каждого письма Ирине

function vacLoad_(file, name) {
  const txt = UrlFetchApp.fetch(VAC_SITE + 'data/' + file + '?t=' + Date.now()).getContentText('UTF-8');
  const i = txt.lastIndexOf('window.' + name + ' =');
  return JSON.parse(txt.slice(i + ('window.' + name + ' =').length).trim().replace(/;\s*$/, ''));
}
function vacDate_(iso) { const p = iso.split('-'); return `${+p[2]}.${p[1]}.${p[0]}`; }

function vacancyMails() {
  const vac = vacLoad_('vacancies.js', 'VACANCIES'), sp = vacLoad_('specialists.js', 'SPECIALISTS');
  const props = PropertiesService.getScriptProperties();
  const tz = 'Europe/Zurich', today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  const inDays = n => Utilities.formatDate(new Date(Date.now() + n * 864e5), tz, 'yyyy-MM-dd');
  vac.forEach(v => {
    if (v.sample || v.status !== 'активен' || !v.confirm || !v.until) return;
    const a = (v.author && typeof v.author === 'object') ? v.author : sp.find(s => s.id === v.author) || {};
    const to = (a.contacts && a.contacts.email) || ''; if (!to) return;
    const name = a.name || '', url = VAC_SITE + 'vakansii/#' + v.id;
    let kind = '', su = '', body = '';
    if (v.until === inDays(7)) {
      kind = 'week';
      su = `Через неделю ваше объявление снимется — «${v.title}»`;
      body = `Здравствуйте${name ? ', ' + name : ''}!\n\nВаше объявление «${v.title}» в разделе «Вакансии и партнёрство» на сайте «Свои люди в Швейцарии» показывается до ${vacDate_(v.until)}. В этот день оно само исчезнет с сайта.\n\nЕсли нужно продлить, ответьте на это письмо до ${vacDate_(v.until)}. Продление — отдельная договорённость: я пришлю вам объявление на новое подтверждение, потому что условия могли измениться.\n\nЕсли сотрудник или партнёр уже найден, ответьте «закрыть» — я сниму объявление раньше.\n\n${url}\n\nРазмещение бесплатное, для поддержки сообщества «Свои люди». Не коммерческая услуга.\n\nИрина Вознесенская\nСвои люди в Швейцарии`;
    } else if (v.until === today) {
      kind = 'end';
      su = `Ваше объявление снято с сайта — «${v.title}»`;
      body = `Здравствуйте${name ? ', ' + name : ''}!\n\nСрок показа вашего объявления «${v.title}» закончился ${vacDate_(v.until)}, и оно снято с сайта «Свои люди в Швейцарии».\n\nЕсли вы всё ещё ищете сотрудника или партнёра, напишите мне — разместим объявление снова после нового подтверждения условий.\n\nСпасибо, что вы с нами.\n\nИрина Вознесенская\nСвои люди в Швейцарии`;
    } else return;
    const key = 'vac:' + v.id + ':' + v.until + ':' + kind;
    if (props.getProperty(key)) return;
    MailApp.sendEmail({ to: to, cc: VAC_COPY, replyTo: VAC_REPLY, name: VAC_FROM_NAME, subject: '🌿 ' + su, body: body });
    props.setProperty(key, today);
  });
}
