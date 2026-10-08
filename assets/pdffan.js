/* Превью готового файла веером — как «Каким будет твой разбор» в тестах voznesenskaya.ch.
   Подключение: <div data-fan="moj-god"></div> и <script src="/assets/pdffan.js" defer></script>.
   Используется на вкладке «Полезные инструменты» и в начале страницы каждого инструмента.
   Новый инструмент: добавить его в FANS ниже и положить картинки страниц его PDF (пример с данными) в /instrumenty/preview/<инструмент>/. */
(function(){
  /* что показываем у каждого инструмента: страницы лежат в /instrumenty/preview/<инструмент>/N.jpg (украинские — в …/uk/N.jpg) */
  var FANS = {
    'moj-god': {pages: '1', unit: 'лист A4', items: [
      {t: 'Весь год на одном листе', d: 'Все твои дела и сроки на 12 месяцев. Видно, где густо, а где есть место для отдыха. Розовым отмечены праздники твоего кантона.', land: true}
    ]},
    'moj-den': {pages: '1', unit: 'лист A4', items: [
      {t: 'Твой день на одном листе', d: 'План по часам, три главных дела, «важно и срочно», стоп-лист и вечерний итог. Можно распечатать и повесить на холодильник.'}
    ]},
    'moi-emocii': {pages: '1', unit: 'лист A4', items: [
      {t: 'Один день в дневнике', d: 'Все эмоции дня по времени и их сила. Что произошло, где это было в теле, какая мысль пришла и что помогло.'}
    ]},
    'moj-budget': {pages: '5', unit: 'страниц', items: [
      {t: 'Итог и сферы', d: 'Сколько уходит в месяц и в год и на что. Месяцы больших счетов отмечены.'},
      {t: 'Мои деньги в картинках', d: 'Куда уходят каждые 100 франков дохода, правило 50, 30, 20 и подушка безопасности.'},
      {t: 'Доходы и расходы каждого месяца', d: 'В каких месяцах ты в плюсе, а где лучше отложить заранее.'},
      {t: 'Все статьи списком', d: 'Каждая сумма, как часто и в каком месяце она приходит.'},
      {t: 'Проверь, нужно ли это тебе', d: 'Расходы, о которых новые жители часто забывают.'}
    ]},
    'uchet-vremeni': {pages: '1', unit: 'лист A4', items: [
      {t: 'Работа с планом часов', d: 'Каждый день с началом, концом и перерывом. Плюс или минус за месяц, перенос, отпуск и места для подписей.'},
      {t: 'Учёт без плана', d: 'Например, курс немецкого. Просто сколько часов ушло за месяц и в какие дни.'}
    ]},
    'chasy-po-klientam': {pages: '3', unit: 'отчёта', items: [
      {t: 'Отчёт о работе для клиента', d: 'Stundenrapport за месяц. Даты, время, что сделано, сумма и места для подписей.'},
      {t: 'Мой отчёт за месяц', d: 'Часы и доход по каждому клиенту, дорога, расходы и кто ещё не заплатил.'},
      {t: 'Мой отчёт за год', d: 'Часы и доход по месяцам и главные клиенты года. Пригодится для налоговой.'}
    ]},
    'rezyume': {pages: '1', unit: 'страница резюме', items: [
      {t: 'С колонкой · Lebenslauf', d: 'Фото, контакты и языки в цветной колонке слева. Резюме на немецком, как его ждут в Цюрихе или Берне.'},
      {t: 'Классика · CV en français', d: 'Всё во всю ширину, фото справа. Тот же опыт на французском для Женевы или Лозанны.'},
      {t: 'Строгий · CV in English', d: 'Чёрно-белый, для банков, консалтинга и международных компаний.'},
      {t: 'Приложения в том же PDF', d: 'Список приложений, а за ним каждый документ ровно на своём листе: Arbeitszeugnis, дипломы, сертификаты.'}
    ]},
    'ekstrennye-nomera': {pages: '1', unit: 'лист A4', items: [
      {t: '4 карточки на одном листе', d: 'На русском и на языке кантона: экстренные номера, дежурный врач кантона и твои контакты. Вырежи и положи в кошелёк, на холодильник, няне и в машину.'},
      {t: 'Плакат на холодильник', d: 'Один крупный лист на немецком, чтобы его поняла и швейцарская няня.'},
      {t: 'Карточка для Женевы', d: 'Только на французском, с номерами SOS Médecins и детской неотложки HUG.'}
    ]},
    'put-obrazovaniya': {pages: '5', unit: 'листов A4', items: [
      {t: 'Схема от яслей до докторантуры', d: 'Весь путь на одном листе: кто куда идёт, в каком возрасте и как переходят дальше. На русском и языке кантона.', land: true},
      {t: 'Переходы: где само, а где готовиться', d: 'Какие шаги происходят сами, где решает школа, а где нужен экзамен, заявка или подготовка: гимназия, Lehre, вуз, докторантура.', land: true},
      {t: 'Как это соотносится с нашим', d: 'Детский сад, школа, ПТУ и техникум, бакалавр, специалист, кандидат наук — чему это соответствует в Швейцарии.', land: true},
      {t: 'Словарь на пяти языках', d: 'Школьные слова на русском, немецком, французском, итальянском и английском.', land: true},
      {t: 'Путь твоего ребёнка', d: 'По учебным годам: когда детский сад, какой класс сейчас, когда конец обязательной школы и что дальше.'},
      {t: 'Схема на французском', d: 'Для Женевы, Во и других франкоязычных кантонов. Есть и итальянский, и английский.', land: true}
    ]},
    'yazyk-trebovaniya': {pages: '4', unit: 'листа A4', items: [
      {t: 'Языковая лестница', d: 'Уровни A1–C2: что ты умеешь на каждом и для чего он нужен — семья, пермит C, паспорт, Lehre, вуз.', land: true},
      {t: 'Требования всех 26 кантонов', d: 'Какой язык в кантоне и какой уровень нужен для паспорта устно и письменно. Кантоны, где требуют больше, выделены.', land: true},
      {t: 'Мой языковой план', d: 'Твои цели, сколько уровней не хватает, сколько примерно учиться и что сделать.'},
      {t: 'Как подтвердить и где учить', d: 'Тест fide, другие сертификаты, кому сдавать не нужно, где курсы дешевле.'}
    ]},
    'strahovki-obyazatelnye': {pages: '3', unit: 'листа A4', items: [
      {t: 'Чего нельзя избежать', d: 'Медстраховка, AHV, сбор за радио и ТВ — всем; безработица, несчастный случай, пенсионная касса — работающим; машина, дом, собака, помощница — если есть.', land: true},
      {t: 'Кто за что платит', d: 'По найму, на себя, не работаю, на пенсии: кто платит каждый взнос и сколько.', land: true},
      {t: 'Мой список', d: 'Только то, что обязательно для тебя, с пояснением и местом для номера полиса.'}
    ]},
    'nalogi-shema': {pages: '4', unit: 'листа A4', items: [
      {t: 'Как устроены налоги', d: 'Федеральный, кантона и общины, почему соседние общины платят по-разному, налог у источника или декларация.', land: true},
      {t: 'Налоговый год', d: 'Что и когда: бланки, срок декларации, предварительные счета, решение, возражение, окончательный счёт.', land: true},
      {t: 'Вычеты и другие налоги', d: 'Что можно вычесть и какие ещё налоги и сборы бывают: НДС, Serafe, собака, машина.'},
      {t: 'Мой налоговый календарь', d: 'Даты и что собрать в папку — для налога у источника, декларации или своего дела.'}
    ]},
    'grazhdanstvo-shema': {pages: '3', unit: 'листа A4', items: [
      {t: "Путь к гражданству", d: "9 шагов от приезда до паспорта, облегчённая натурализация, сроки, сборы и что делать, пока идёт процедура.", land: true},
      {t: "Что даёт и как потерять", d: "Права, обязанности и все случаи, когда гражданство можно потерять, — и когда оно не теряется.", land: true},
      {t: "Мой путь", d: "Твои годы клетками, с какого года можно подать, документы для заявления и место для своих дат."}
    ]},
    'diplomy-shema': {pages: '4', unit: 'листа A4', items: [
      {t: "Путь признания", d: "Регламентируемая профессия или нет, кто признаёт и как идёт процедура, что делать без диплома, но с опытом.", land: true},
      {t: "Сколько ждать и сколько стоит", d: "SBFI, Красный Крест, MEBEKO, EDK, PsyKo, Swiss ENIC: цены, сроки в месяцах и язык.", land: true},
      {t: "Документы и сертификаты", d: "Что собрать, как отправлять, что делать при отказе. Языковые сертификаты, права, аттестат, курсы.", land: true},
      {t: "Мой план", d: "Твоё ведомство, цена, язык и план по месяцам: документы, язык, заявка, решение."}
    ]},
    'franshiza-shema': {pages: '4', unit: 'листа A4', items: [
      {t: "Кто сколько платит", d: "Франшиза, доля 10% до 700 франков, касса 100% — на полосе расходов, с примерами для франшиз 300 и 2500.", land: true},
      {t: "Какая франшиза выгоднее", d: "График: сколько всего за год при каждой франшизе в зависимости от расходов, и граница выгоды.", land: true},
      {t: "Правила и сроки", d: "Какие франшизы бывают, до какого числа менять, когда франшизу не платишь, как платить меньше.", land: true},
      {t: "Моя франшиза", d: "Твои расходы и премии: что выгоднее, сколько отложить и место для своих цифр."}
    ]},
    'kuda-obratitsya': {pages: '9', unit: 'листов A4', items: [
      {t: "Где помогут в твоём кантоне", d: "Союз арендаторов со взносом и телефоном, справочная адвокатов с часами и ценой, бесплатные справки по работе и аренде.", land: true},
      {t: "Таблица: организации, взносы, сроки, контакты", d: "40 организаций по темам: для кого и чем поможет, сколько стоит, через сколько помогут, телефон и сайт.", land: true},
      {t: "Что это за организации", d: "Профсоюз, союз арендаторов, омбудсмен, защита покупателей — простыми словами для тех, кто здесь впервые.", land: true},
      {t: "Мои организации", d: "Твои организации со взносом и телефоном и место для номера членства и даты вступления."}
    ]},
    'moi-dannye': {pages: '3', unit: 'листа A4', items: [
      {t: "Лист на каждого", d: "Адрес, документы, номер AHV, медстраховка, страховки, врачи, работа, банк, жильё, близкие — с подписями на языке кантона."},
      {t: "Лист ребёнка", d: "Свой лист на каждого в семье: школа, педиатр, касса, аллергии, кому звонить."},
      {t: "Карточки в кошелёк", d: "Карточки 85×54 мм: дата рождения, AHV, касса, аллергии, врач, близкие — себе, няне, в машину."}
    ]},
    'schet-qr': {pages: '1', unit: 'лист A4', items: [
      {t: "Счёт с QR-кодом на немецком", d: "Твои данные, клиент, услуги, срок оплаты и внизу швейцарская квитанция с QR-кодом, которую клиент сканирует в банке."},
      {t: "На французском с НДС", d: "Тот же счёт на языке клиента: французский, итальянский или английский. Если ты плательщик НДС, ставка и номер считаются сами."}
    ]},
    'dohody-rashody': {pages: '2–6', unit: 'листов A4', items: [
      {t: "Итоги года для налоговой", d: "Доходы, расходы и прибыль, суммы по категориям и месяцам, наличные в кассе — на языке кантона."},
      {t: "Журнал всех записей", d: "Каждый доход и расход с датой, номером чека, категорией и способом оплаты."},
      {t: "Кассовая книга", d: "Всё, что прошло наличными, и сколько должно лежать в кассе на каждый день."},
      {t: "Квитанция клиенту", d: "Если клиент заплатил наличными: оригинал для него и копия для тебя на одном листе."}
    ]},
    'dogovor-nyani': {pages: '2–3', unit: 'листа A4', items: [
      {t: "Договор на немецком с русским переводом", d: "Стороны, начало, испытательный срок, обязанности, часы и зарплата — под каждым пунктом перевод на русский."},
      {t: "Отпуск, болезнь, страховки, расторжение", d: "Отпуск и отпускные, Krankentaggeld или OR 324a, UVG и NBU, AHV, сроки расторжения и подписи."},
      {t: "Договор на французском", d: "Тот же договор на языке кантона: французский для Во, Женевы, Невшателя, итальянский для Тичино."}
    ]},
    'anketa-klienta': {pages: '1–2', unit: 'листа A4', items: [
      {t: "Анкета на немецком с русским переводом", d: "Данные клиента, вопросы о здоровье под твои процедуры, согласие на процедуру, на хранение данных и на фото."},
      {t: "На французском — для массажа и маникюра", d: "Та же анкета на языке кантона: вопросы о венах, сердце, ногтях подбираются сами."},
      {t: "Протокол процедур", d: "Таблица на каждого клиента: дата, процедура, средства, заметки, подпись."}
    ]},
    'etiketka-eda': {pages: '1', unit: 'лист наклеек A4', items: [
      {t: "8 больших этикеток на немецком", d: "Название, состав с выделенными аллергенами, «может содержать следы», вес, «употребить до», хранение, производитель."},
      {t: "21 этикетка на французском с пищевой ценностью", d: "Маленькие этикетки 70×42 мм: замороженные пельмени, «лучше употребить до» и таблица на 100 г."}
    ]},
    'pisma-arenda': {pages: '1–2', unit: 'листа A4', items: [
      {t: "Требование снизить аренду", d: "Референтная ставка снизилась — письмо по ст. 270a OR к ближайшей дате расторжения, с ответом в течение 30 дней."},
      {t: "Русский перевод для себя", d: "Второй лист — то же письмо по-русски, чтобы понимать, что подписываешь. Его не отправляют."},
      {t: "Дефект в квартире — по-французски", d: "Что сломалось, срок устранить, снижение аренды на время дефекта и, по желанию, предупреждение о депонировании."},
      {t: "Расторжение с новым жильцом — по-итальянски", d: "Раньше срока, если предлагаешь платёжеспособного нового жильца (ст. 264 OR), или в обычный срок."},
      {t: "Вернуть залог", d: "После сдачи квартиры: подписать разрешение банку на выплату залога с процентами до твоего срока."}
    ]},
    'dosye-arendatora': {pages: '2–3', unit: 'листа A4', items: [
      {t: "Письмо управляющей", d: "Кто вы, где работаете, когда хотите въехать и что прикладываете — коротко, на языке кантона."},
      {t: "Анкета жильцов", d: "Таблица для управляющей: пермит со сроком, работа, доход диапазоном, рекомендация, быт, выписка о долгах. Только то, что можно спрашивать."},
      {t: "Лист для себя", d: "Перевод письма на русский и список документов с галочками. Его не отправляют."},
      {t: "Письмо по-французски", d: "То же досье на французском для Во, Женевы, Невшателя — или на итальянском и английском."}
    ]},
    'ipoteka-raschet': {pages: '1', unit: 'лист A4', items: [
      {t: "Квартира проходит проверку банка", d: "Свои деньги, 10 % не из пенсионной кассы и треть дохода — три проверки, максимальная цена и расход в месяц."},
      {t: "Слишком дорого — видно почему", d: "Тот же расчёт по-французски: что не проходит и какую цену ты потянешь."}
    ]},
    'proezdnoj-vybor': {pages: '1', unit: 'лист A4', items: [
      {t: "Ездишь на работу каждый день", d: "Сравнение за год: без абонемента, Halbtax и GA, и с какой суммы окупается каждый."},
      {t: "Ездишь редко", d: "Тот же расчёт по-французски: когда абонемент не нужен и лучше Sparbillette."}
    ]},
    'bolezn-zarplata': {pages: '1', unit: 'лист A4', items: [
      {t: "4-й год работы в Берне", d: "Сколько недель полной зарплаты осталось, примерно до какого числа и сколько дней нельзя увольнять."},
      {t: "Со страховкой Krankentaggeld", d: "Тот же расчёт по-французски: 80 % до 720 дней после дней ожидания."}
    ]},
    'pereezd-spisok': {pages: '1–2', unit: 'листа A4', items: [
      {t: "Переезд в другой кантон с пермитом B", d: "Расторжение за 3 месяца, разрешение на смену кантона, почта, община — каждое дело с датой."},
      {t: "После переезда", d: "Регистрация за 14 дней, машина, страховки, залог и налоги — с названиями на языке кантона."},
      {t: "Список по-французски", d: "Тот же список для переезда внутри кантона Во или Женевы."}
    ]},
    'zhurnal-shuma': {pages: '1', unit: 'лист A4', items: [
      {t: "Журнал с записями", d: "Дата, время, вид шума, откуда, свидетели и подробности — таблица на немецком с подписью.", land: true},
      {t: "Пустой журнал", d: "Распечатай по-французски или по-итальянски и заполняй от руки.", land: true}
    ]},
    'plan-pohoda': {pages: '1', unit: 'лист A4', items: [
      {t: "План для близких", d: "Кто идёт, маршрут, сложность, время возвращения, тревога и номера Rega — на одном листе."},
      {t: "Без цвета, по-итальянски", d: "Тот же план для Тичино — можно распечатать дёшево."}
    ]},
    'pensiya-shema': {pages: '4', unit: 'листа A4', items: [
      {t: 'Три колонны', d: 'AHV, пенсионная касса и 3a: цель, кто платит, сколько, и фундамент — дополнительные пособия.', land: true},
      {t: 'Пенсия по возрасту', d: 'Что происходит с 18 до 70 лет: взносы, пробелы, ранний выход, 65 лет, отсрочка.', land: true},
      {t: 'Мой ориентир', d: 'Возраст пенсии, годы взносов клетками и примерная доля полной пенсии AHV.'},
      {t: 'Где лежат деньги', d: 'Как проверить счёт AHV, пенсионную кассу и 3a и что будет, если уедешь.'}
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
    host.innerHTML = '<div class="pf-ey">' + esc(F.eyebrow || 'Так выглядит готовый файл') + '</div>'
      + '<div class="pf-stage stacked" role="group" aria-label="Страницы примера файла">'
      + F.items.map(function(it, i){ return '<button type="button" class="pf-page' + (it.land ? ' land' : '') + '" data-i="' + i + '" aria-label="Страница примера: ' + esc(it.t) + '"><img src="' + it.img + '" alt="Пример: ' + esc(it.t) + '" loading="lazy" draggable="false"></button>'; }).join('')
      + '<span class="pf-badge">' + esc(F.pages) + '<small>' + esc(F.unit) + '</small></span></div>'
      + '<div class="pf-cap" aria-live="polite"></div>'
      + '<div class="pf-nav"><button type="button" class="pf-arrow" data-d="-1" aria-label="Предыдущая страница">‹</button><div class="pf-dots">'
      + F.items.map(function(_, i){ return '<span data-i="' + i + '"></span>'; }).join('')
      + '</div><button type="button" class="pf-arrow" data-d="1" aria-label="Следующая страница">›</button></div>';
    var stage = host.querySelector('.pf-stage'), pages = [].slice.call(host.querySelectorAll('.pf-page')),
        dots = [].slice.call(host.querySelectorAll('.pf-dots span')), cap = host.querySelector('.pf-cap');
    var cur = 0, timer = null, stopped = false;
    if (N < 2) host.querySelector('.pf-nav').style.display = 'none';
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
      box.innerHTML = '<figure><img class="' + (it.land ? 'land' : '') + '" src="' + it.img + '" alt="Пример: ' + esc(it.t) + '"><figcaption>' + esc(it.t) + ' · пример</figcaption></figure><button type="button" class="pf-x" aria-label="Закрыть">×</button>';
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
 