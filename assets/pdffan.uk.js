/* Превью готового файла веером — как «Каким будет твой разбор» в тестах voznesenskaya.ch.
   Подключение: <div data-fan="moj-god"></div> и <script src="/assets/pdffan.js" defer></script>.
   Используется на вкладке «Полезные инструменты» и в начале страницы каждого инструмента.
   Новый инструмент: добавить его в FANS ниже и положить картинки страниц его PDF (пример с данными) в /instrumenty/preview/<инструмент>/. */
(function(){
  /* что показываем у каждого инструмента: страницы лежат в /instrumenty/preview/<инструмент>/N.jpg (украинские — в …/uk/N.jpg) */
  var FANS = {
    'moj-god': {pages: '1', unit: 'аркуш A4', items: [
      {t: 'Увесь рік на одному аркуші', d: 'Усі твої справи й терміни на 12 місяців. Видно, де густо, а де є місце для відпочинку.', land: true},
      {t: 'Крупно. Початок року', d: 'У кожної справи своя кольорова смужка. Рожевим позначені свята твого кантону.'},
      {t: 'Крупно. Літо й осінь', d: 'Відпустка, курси за рівнями й терміни на кшталт податкової декларації.'}
    ]},
    'moj-den': {pages: '1', unit: 'аркуш A4', items: [
      {t: 'Твій день на одному аркуші', d: 'План по годинах, головні справи й вечірній підсумок. Можна роздрукувати й повісити на холодильник.'},
      {t: 'Крупно. День по годинах', d: 'Кожна справа кольоровим блоком. Одразу видно, скільки часу йде на роботу, дітей і на себе.'},
      {t: 'Крупно. Головне і стоп-лист', d: 'Три головні справи, чотири поля «важливо і терміново» і те, чого ти сьогодні не робиш.'}
    ]},
    'moi-emocii': {pages: '1', unit: 'аркуш A4', items: [
      {t: 'Один день у щоденнику', d: 'Усі емоції дня за часом, їхня сила й вечірні нотатки.'},
      {t: 'Крупно. Що відбувалося', d: 'Що сталося, де це було в тілі, яка думка прийшла і що допомогло.'},
      {t: 'Крупно. Сила емоції', d: 'У кожного запису шкала від 1 до 10. Видно, коли було найважче.'}
    ]},
    'moj-budget': {pages: '5', unit: 'сторінок', items: [
      {t: 'Підсумок і сфери', d: 'Скільки йде на місяць і на рік і на що. Місяці великих рахунків позначені.'},
      {t: 'Мої гроші в картинках', d: 'Куди йдуть кожні 100 франків доходу, правило 50, 30, 20 і подушка безпеки.'},
      {t: 'Доходи й витрати кожного місяця', d: 'У які місяці ти в плюсі, а де краще відкласти заздалегідь.'},
      {t: 'Усі статті списком', d: 'Кожна сума, як часто і в якому місяці вона приходить.'},
      {t: 'Перевір, чи потрібно це тобі', d: 'Витрати, про які нові мешканці часто забувають.'}
    ]},
    'uchet-vremeni': {pages: '1', unit: 'аркуш A4', items: [
      {t: 'Місяць на одному аркуші', d: 'Кожен день з початком, кінцем і перервою, підсумок місяця й місця для підписів.'},
      {t: 'Крупно. Підсумок місяця', d: 'Скільки годин за планом, скільки записано і де ти в плюсі чи в мінусі.'},
      {t: 'Крупно. Перенесення залишку', d: 'Плюс або мінус переходить на наступний місяць. Підсумок із перенесенням видно одразу.'},
      {t: 'Крупно. Відпустка й підписи', d: 'Дні відпустки й хвороби позначені. Унизу місце для твого підпису й підпису роботодавця.'}
    ]},
    'chasy-po-klientam': {pages: '3', unit: 'звіти', items: [
      {t: 'Звіт про роботу для клієнта', d: 'Stundenrapport за місяць. Дати, час, що зроблено, сума й місця для підписів.'},
      {t: 'Мій звіт за місяць', d: 'Години й дохід по кожному клієнту, дорога, витрати і хто ще не заплатив.'},
      {t: 'Мій звіт за рік', d: 'Години й дохід по місяцях і головні клієнти року. Знадобиться для податкової.'}
    ]},
    'zarplata': {pages: '4', unit: 'прикладу', items: [
      {t: 'Погодинна оплата', d: 'Години, ставка, надбавки за відпустку й неділю, усі внески, податок у джерела з кодом тарифу й сума до виплати.'},
      {t: 'Фіксований оклад', d: 'Оклад, понаднормові, 13-та зарплата, пенсійна каса, дитячі допомоги й аванс, який утримується частинами.'},
      {t: 'Розрахунковий лист німецькою', d: 'Lohnabrechnung для кантонів, де говорять німецькою. Унизу місця для двох підписів.'},
      {t: 'Розрахунковий лист французькою', d: 'Décompte de salaire для Женеви, Во, Невшателя, Юри, Фрибура й Вале. Є й італійська для Тічино.'}
    ]}
  };
  var css = '.pf{display:flex;flex-direction:column;gap:4px;background:var(--bg);border-radius:18px;padding:12px 10px 10px;margin:2px 0 4px;overflow:hidden}'
  + '.pf-ey{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);text-align:center}'
  + '.pf-stage{position:relative;height:282px;margin:4px 0 4px}'
  + '.pf-page{position:absolute;left:50%;bottom:40px;width:150px;aspect-ratio:210/297;padding:0;border:0;border-radius:5px;background:#fff;overflow:hidden;cursor:pointer;transform-origin:50% 170%;'
  + 'box-shadow:0 1px 2px rgba(40,30,20,.12),0 8px 22px rgba(40,30,20,.16);transition:transform .6s cubic-bezier(.2,.8,.2,1),box-shadow .3s,filter .3s}'
  + '.pf-page.land{width:228px;aspect-ratio:297/210;bottom:62px;transform-origin:50% 230%}'
  + '.pf-page img{display:block;width:100%;height:100%;object-fit:cover;object-position:top;user-select:none;-webkit-user-drag:none}'
  + '.pf-page:not(.on){filter:saturate(.85) brightness(.96)}'
  + '.pf-page.on{box-shadow:0 2px 4px rgba(40,30,20,.14),0 16px 34px rgba(40,30,20,.26);cursor:zoom-in}'
  + '.pf-page:focus-visible{outline:3px solid var(--mustard);outline-offset:3px}'
  + '.pf-stage.stacked .pf-page{transform:translateX(-50%) rotate(0) !important}'
  + '.pf-badge{position:absolute;right:2px;top:0;width:62px;height:62px;border-radius:50%;background:var(--brown);color:var(--paper);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--display);font-size:1.4rem;line-height:1;z-index:20;transform:rotate(8deg);box-shadow:0 5px 14px rgba(40,30,20,.2);text-align:center}'
  + '.pf-badge small{font-family:var(--body);font-size:.46rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;margin-top:3px;max-width:52px;line-height:1.15}'
  + '.pf-cap{position:relative;z-index:25;text-align:center;min-height:4.4em;display:flex;flex-direction:column;gap:1px;align-items:center}'
  + '.pf-cap b{font-family:var(--display);font-weight:400;font-size:1.18rem;color:var(--brown);line-height:1.2}'
  + '.pf-cap span{font-size:.86rem;color:var(--muted);max-width:40ch;line-height:1.45}'
  + '.pf-nav{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:2px}'
  + '.pf-arrow{width:32px;height:32px;border-radius:50%;border:1px solid var(--line);background:var(--paper);color:var(--ink);font-size:1.25rem;line-height:1;cursor:pointer;padding:0}'
  + '.pf-arrow:hover{background:var(--soft)}'
  + '.pf-dots{display:flex;gap:6px}'
  + '.pf-dots span{width:7px;height:7px;border-radius:50%;background:var(--line);cursor:pointer;transition:background .3s,width .3s}'
  + '.pf-dots span.on{background:var(--brown);width:20px;border-radius:4px}'
  + '.pf-zoom{position:fixed;inset:0;z-index:100;background:rgba(30,24,20,.78);display:flex;align-items:center;justify-content:center;padding:16px;cursor:zoom-out;animation:pfIn .25s ease}'
  + '.pf-zoom figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:8px;max-height:100%}'
  + '.pf-zoom img{max-width:min(640px,100%);max-height:calc(100vh - 80px);border-radius:6px;box-shadow:0 20px 60px rgba(0,0,0,.4);background:#fff}'
  + '.pf-zoom img.land{max-width:min(980px,100%)}'
  + '.pf-zoom figcaption{color:#fff;font-size:.85rem;opacity:.9;text-align:center}'
  + '.pf-x{position:absolute;top:12px;right:14px;width:42px;height:42px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#2F2924;font-size:1.5rem;cursor:pointer}'
  + '@keyframes pfIn{from{opacity:0}to{opacity:1}}'
  + 'header .pf{margin-top:20px;max-width:560px;background:var(--paper);border:1px solid var(--line);padding:14px 12px 12px}'
  + '@media (max-width:420px){.pf-stage{height:262px}.pf-page{width:134px}.pf-page.land{width:204px}}'
  + '@media (prefers-reduced-motion: reduce){.pf-page{transition:none}}'
  + '@media print{.pf{display:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

  function build(host, F, idx){
    var N = F.items.length;
    host.className = 'pf';
    host.innerHTML = '<div class="pf-ey">' + esc(F.eyebrow || 'Так виглядає готовий файл') + '</div>'
      + '<div class="pf-stage stacked" role="group" aria-label="Сторінки прикладу файлу">'
      + F.items.map(function(it, i){ return '<button type="button" class="pf-page' + (it.land ? ' land' : '') + '" data-i="' + i + '" aria-label="Сторінка прикладу: ' + esc(it.t) + '"><img src="' + it.img + '" alt="Приклад: ' + esc(it.t) + '" loading="lazy" draggable="false"></button>'; }).join('')
      + '<span class="pf-badge">' + esc(F.pages) + '<small>' + esc(F.unit) + '</small></span></div>'
      + '<div class="pf-cap" aria-live="polite"></div>'
      + '<div class="pf-nav"><button type="button" class="pf-arrow" data-d="-1" aria-label="Попередня сторінка">‹</button><div class="pf-dots">'
      + F.items.map(function(_, i){ return '<span data-i="' + i + '"></span>'; }).join('')
      + '</div><button type="button" class="pf-arrow" data-d="1" aria-label="Наступна сторінка">›</button></div>';
    var stage = host.querySelector('.pf-stage'), pages = [].slice.call(host.querySelectorAll('.pf-page')),
        dots = [].slice.call(host.querySelectorAll('.pf-dots span')), cap = host.querySelector('.pf-cap');
    var cur = 0, timer = null, stopped = false;
    function lay(){
      var deg = stage.clientWidth < 330 ? 8 : 10;
      pages.forEach(function(p, i){
        var o = i - cur; if (o > N / 2) o -= N; if (o < -N / 2) o += N;
        var a = Math.abs(o);
        p.style.transform = 'translateX(-50%) rotate(' + (o * deg) + 'deg) translateY(' + (o ? a * 4 : -12) + 'px) scale(' + (o ? 1 - a * .05 : 1.03) + ')';
        p.style.zIndex = 10 - a; p.classList.toggle('on', !o); p.tabIndex = o ? -1 : 0;
      });
      dots.forEach(function(d, i){ d.classList.toggle('on', i === cur); });
      cap.innerHTML = '<b>' + esc(F.items[cur].t) + '</b><span>' + esc(F.items[cur].d) + '</span>';
    }
    function stop(){ stopped = true; if (timer) clearInterval(timer); timer = null; }
    function go(i, user){ cur = (i + N) % N; lay(); if (user) stop(); }
    function zoom(i){
      var it = F.items[i], box = document.createElement('div');
      box.className = 'pf-zoom'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-label', it.t);
      box.innerHTML = '<figure><img class="' + (it.land ? 'land' : '') + '" src="' + it.img + '" alt="Приклад: ' + esc(it.t) + '"><figcaption>' + esc(it.t) + ' · приклад</figcaption></figure><button type="button" class="pf-x" aria-label="Закрити">×</button>';
      var close = function(){ box.remove(); document.removeEventListener('keydown', key); };
      var key = function(e){ if (e.key === 'Escape') close(); };
      box.addEventListener('click', close); document.addEventListener('keydown', key);
      document.body.appendChild(box); box.querySelector('.pf-x').focus();
    }
    pages.forEach(function(p, i){ p.addEventListener('click', function(){ if (i === cur) { stop(); zoom(i); } else go(i, true); }); });
    dots.forEach(function(d, i){ d.addEventListener('click', function(){ go(i, true); }); });
    [].forEach.call(host.querySelectorAll('.pf-arrow'), function(b){ b.addEventListener('click', function(){ go(cur + +b.dataset.d, true); }); });
    var sx = null;
    stage.addEventListener('touchstart', function(e){ sx = e.touches[0].clientX; }, {passive: true});
    stage.addEventListener('touchend', function(e){ if (sx == null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(cur + (dx < 0 ? 1 : -1), true); sx = null; });
    host.addEventListener('pointerenter', function(e){ if (e.pointerType === 'mouse') stop(); });
    lay(); window.addEventListener('resize', lay);
    // веер раскрывается, когда карточка видна; листается сам, пока человек его не тронул
    function play(on){
      if (!on || stopped || calm || N < 2){ if (timer) clearInterval(timer); timer = null; return; }
      if (!timer) setTimeout(function(){ if (!timer && !stopped) timer = setInterval(function(){ go(cur + 1); }, 4200); }, idx * 700);
    }
    if ('IntersectionObserver' in window){
      var opened = false;
      new IntersectionObserver(function(es){
        var vis = es.some(function(e){ return e.isIntersecting; });
        if (vis && !opened){ opened = true; setTimeout(function(){ stage.classList.remove('stacked'); }, 200); }
        play(vis);
      }, {threshold: .45}).observe(stage);
    } else { stage.classList.remove('stacked'); play(true); }
  }

  function init(){
    var uk = (document.documentElement.lang || '').slice(0, 2) === 'uk';
    [].forEach.call(document.querySelectorAll('[data-fan]'), function(h, i){
      var id = h.getAttribute('data-fan'), F = FANS[id]; if (!F) return;
      F.items.forEach(function(it, k){ it.img = '/instrumenty/preview/' + id + '/' + (uk ? 'uk/' : '') + (k + 1) + '.jpg'; });
      build(h, F, i);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
