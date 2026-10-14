// Какие элементы svoiludi.ch grab.js снимает с сайта для библиотеки стиля (имя папки = имя элемента).
// mark — функция в странице: ставит data-dsg на нужные блоки и возвращает их число; before — что нажать до этого; trim — что убрать из копии.
const pick = (sel, re) => new Function(`const a=[...document.querySelectorAll(${JSON.stringify(sel)})].filter(e=>${re ? `/${re}/.test(e.innerText)` : 'true'});if(a[0])a[0].setAttribute('data-dsg','');return a.length?1:0;`);
const openSample = (re) => async (p) => {
  const i = await p.evaluate((re) => [...document.querySelectorAll('article.sp')].findIndex(a => new RegExp(re).test(a.innerText)), re);
  if (i < 0) throw new Error('нет карточки ' + re);
  await p.locator('article.sp').nth(i).getByText('Подробнее').first().click();
  await p.waitForTimeout(800);
};
module.exports = [
  { name: 'FreeBanner', group: 'Подсказки', height: 170, subtitle: 'Плашка над шапкой «Бесплатно до конца 2027 года»',
    page: '/', width: 1100, mark: pick('header.top .sl-free') },
  { name: 'SectionSwitch', group: 'Навигация', height: 150, subtitle: 'Переключатель внутри раздела «Специалисты | Организации»',
    page: '/', mark: pick('.evk') },
  { name: 'DirectoryCard', group: 'Карточки', height: 760, subtitle: 'Карточка специалиста в справочнике (образец)',
    page: '/', mark: pick('article.sp', 'ОБРАЗЕЦ[\\s\\S]*Анна Келлер') },
  { name: 'OrgCard', group: 'Карточки', height: 700, subtitle: 'Карточка организации без логотипа — медальон направления (образец)',
    page: '/organizacii/', mark: pick('article.sp', 'Центр помощи «Пример»') },
  { name: 'CardWindow', group: 'Карточки', height: 1500, subtitle: 'Окно карточки: сердечко, «В мой список», цены, «Где найти в справочнике»',
    page: '/', before: openSample('ОБРАЗЕЦ[\\s\\S]*Анна Келлер'),
    extraCss: '& .qm-card{max-height:none;overflow:visible;box-shadow:none}',
    mark: () => { const d = document.querySelector('dialog[open]'); if (!d) return 0; const c = d.firstElementChild; c.setAttribute('data-dsg', ''); return 1; } },
  { name: 'AfishaCalendar', group: 'Календари', height: 900, subtitle: 'Календарь афиши: «Неделя» и «Месяц»', cap: 'Месяц (так же листается «Неделя»)',
    page: '/events/', before: async (p) => { await p.click('.viewsw [data-view=month]'); await p.waitForTimeout(800); },
    mark: () => { const v = document.querySelector('.viewsw'); const r = document.getElementById('results'); if (!v || !r) return 0; (v.closest('.vbar,.viewbar,.ctl') || v.parentElement).setAttribute('data-dsg', ''); r.setAttribute('data-dsg', ''); return 2; } },
  { name: 'ApplicationForm', group: 'Блоки', height: 1100, subtitle: 'Форма заявки на сайте и галочка согласия',
    page: '/events/', mark: pick('.zform'),
    trim: () => { const f = document.querySelector('[data-dsg]'); const g = f.querySelectorAll(':scope > .zfg'); g.forEach((x, i) => { if (i) x.remove(); }); const first = g[0]; if (first) [...first.children].forEach((x, i) => { if (i > 5) x.remove(); }); const ok = f.querySelectorAll(':scope > .zok'); ok.forEach((x, i) => { if (i < ok.length - 1) x.remove(); }); f.querySelectorAll(':scope > .zmsg, :scope > .zdraft').forEach((x, i) => { if (i) x.remove(); }); f.querySelector('.zlook') && f.querySelector('.zlook').remove(); } },
  { name: 'Reviews', group: 'Карточки', height: 640, subtitle: 'Отзывы о проекте «Что говорят о «Своих людях»»',
    page: '/', mark: pick('.otzyvy') },
];
