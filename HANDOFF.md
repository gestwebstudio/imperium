# Imperium Motors — контекст проекта (handoff)

Документ для передачи работы в другой чат / другому ассистенту. Здесь — что за проект,
как устроен, что сделано и что дальше. Работаем и общаемся **по-русски**.

---

## 1. Что это

Сайт автосалона премиальных автомобилей **Imperium Motors**. Делаем заново.
Источник истины — git-репозиторий: **https://github.com/gestwebstudio/imperium**
Рабочая копия: `C:\Users\User\imperium` (там свой `.git`; коммитим/пушим оттуда).

> ⚠️ На диске есть старые папки (`C:\Users\User\imperium-motors` и т.п.) от прошлой версии —
> они **не относятся** к текущей работе, не трогать. Домашняя папка `C:\Users\User` сама
> является git-репозиторием, поэтому git-команды запускать строго внутри `C:\Users\User\imperium`.

## 2. Стек и ключевые решения

- **Next.js 16 (App Router) + TypeScript + React 19**. Язык сайта — только русский.
- **Tailwind CSS v4 + HeroUI v3** (`@heroui/react`). HeroUI пока **не используется в разметке** —
  он подключён на будущее и нужен **только ради функционала** интерактивных компонентов
  (Select, Slider, Modal/Drawer, Accordion, Tabs, Pagination, Autocomplete, Checkbox…),
  которые будем стилизовать **под наш дизайн-кит**. HeroUI v3 не требует Provider-обёртки.
- **Дизайн — собственный UI-кит**, снятый с Figma. Все элементы (цвета, типографика, кнопки,
  карточки) берём из кита. Верстаем **строго по макетам Figma**.
- **Данные — моки** (без БД и хостинга; отложено осознанно). Слой данных сделан через
  абстракцию (`lib/cars.ts` → `getCars`/`getCarBySlug`), чтобы позже безболезненно
  заменить на реальный API. **Картинки машин в будущем придут внешними URL** со стороны
  клиента (в компонентах `image` — строка-URL). Машины позже будут приходить из системы
  учёта клиента.
- **Без анимаций пока** (по просьбе заказчика) — карусели статичные (горизонтальный скролл),
  слайдеры — статичные индикаторы.

### Figma
- Файл: `https://www.figma.com/design/bERRa0eUHmPImiBdiP62UR/Imperium-Motors`
- fileKey: `bERRa0eUHmPImiBdiP62UR`
- Страница «UI Kit» — узел `1:3360`. Страница макетов сайта — фрейм «Imperium motors» `141:1958`.
- Макет **главной**: `141:1958` (внутри: hero `141:17782`, шапка `141:17783`, футер `141:25776`,
  контакты `141:25747`, отзыв `141:25733`, услуги-с-фото `141:25705/706/707` и т.д.).
- Забор дизайна: Figma MCP (desktop), инструмент `get_design_context` (перед ним грузить
  скилл `figma-design-to-code`), для обзора структуры — `get_metadata`.

## 3. Как запустить

```bash
cd C:\Users\User\imperium
npm install
npm run dev        # http://localhost:3000
```
- Проверка типов: `npx tsc --noEmit` (держим 0 ошибок).
- UI-тесты **не пишем и не гоняем** (договорённость). Проверяем сборку + `tsc` + визуально.

## 4. Структура репозитория

```
app/
  layout.tsx            — корневой layout: шрифты (Google Fonts), globals.css, <Header/> и <Footer/>
  page.tsx              — ГЛАВНАЯ: композиция секций (Hero, BrandsRow, CarsSection ×2, BodyTypes, About, Contacts)
  home.css              — все стили секций главной
  globals.css           — @import "@heroui/react/styles" (тянет Tailwind) + импорт кита (styles/*.css) + база
  catalog/              — /catalog: демо-грид всех машин из моков (page.tsx + catalog.css)
  kit/                  — /kit: витрина всех компонентов кита на React (page.tsx + kit.css)
components/
  icons.tsx             — 9 SVG-иконок кита как React-компоненты (currentColor)
  index.ts              — баррель
  ui/                   — Button (client, ripple), Wishlist, Comparison (client-тоглы), primitives.tsx (Bubble/Badge/Tag/Indicator/Tooltip/Slider/PriceBlock)
  cards/cards.tsx       — BrandCard, BodyCard, CarCard (композиция кита)
  layout/               — Header.tsx (стеклянная шапка), Footer.tsx, layout.css
  home/                 — Hero, BrandsRow, CarsSection, BodyTypes, About, Contacts
lib/
  cn.ts                 — склейка классов
  cars.ts               — МОКИ машин + getCars/getCarBySlug/carTags/formatPrice
styles/                 — КИТ (глобально): tokens.css, typography.css, components.css, tokens.scss
tokens/                 — дизайн-токены JSON (colors, typography) — справочно
public/
  icons/                — SVG-иконки
  images/               — webp-ассеты: logo_head.svg, logo_footer.svg,
                          logo_brands/, logo_cards/, body_card/, typeofcar/, cars/,
                          firstcars/ (hero), services/ (atelie/podbor/veles), contacts/ (1-3),
                          reviews/ (review1-2), salon/ (нет — см. открытые вопросы)
package.json, tsconfig.json, next.config.ts, postcss.config.mjs, .gitignore
```

### Дизайн-кит (важно)
- Стили кита в `styles/*.css` подключены в `app/globals.css` **без `@layer`** → в каскаде
  перебивают слои HeroUI, поэтому наш дизайн выигрывает без `!important`.
- Компоненты кита используют готовые классы: `.btn`/`.btn--*`, `.badge`, `.tag`, `.bubble`,
  `.indicator`, `.tooltip`, `.slider`, `.price-block`, `.car-card`, `.brand-card`, `.body-card`.
- Токены: `--color-*` (carbon-black, heritage-green (осн. акцент #294434), warm-taupe,
  stone-beige, blue/red/yellow/green 100/500), `--font-display` (Wix Madefor Display),
  `--font-text` (Onest), веса `--font-weight-*`. Текстовые стили — классы `.t-*`.

### Раскладка макета
- **Контейнер контента — 1800px, обёртка — 1920px** (поля 60px снаружи). На главной это
  делают `.home-wrap { max-width:1920px; padding:0 clamp(24px,4vw,60px) }` и `.hero__inner`.
  **Любую новую секцию главной оборачивать в `.home-wrap`.**
- Шапка — плашка `max-width:1880px` (поля 20px), `position: fixed`, «стекло» на CSS
  (`background: rgba(228,223,219,.3)` + `backdrop-filter: blur(12px)`), перекрывает hero.
  Из-за fixed-шапки у не-hero страниц (catalog, kit) есть верхний паддинг ~128px.

## 5. Мок-данные (`lib/cars.ts`)
- 4 базовые машины (X5 M60i Sport Pro / BMW, Range Rover SV / Land Rover,
  V-Класс Exclusive / Mercedes, CLE 53 AMG / Mercedes) размножены ×12 = **48 машин**
  со стабильными псевдослучайными мощностью (л.с.) и ценой (детерминированный PRNG,
  чтобы не было рассинхрона SSR/CSR).
- Теги карточки: `[год, "<мощность> л.с.", "Полный привод"]` (по ТЗ — вместо «Бензин» рандомная мощность).
- У всех статус «В наличии», кнопка «Подробнее». Фото машин: `/images/cars/*.webp`
  (380×179), логотипы: `/images/logo_cards/*.webp`.
- **Замена на API в будущем:** переписать реализацию `getCars`/`getCarBySlug`, тип `Car`
  оставить; картинки станут внешними URL (добавить домены в `next.config.ts → images.remotePatterns`).

## 6. Конвертация картинок
- Все растровые ассеты — **WebP** (Pillow: `im.save(dst,'WEBP',quality=88,method=6)`),
  исходные PNG удаляются. Имена файлов — URL-безопасные (без пробелов/кириллицы/«+»).

## 7. Прогресс по фазам

- **Фаза 0 ✅** — каркас Next 16 + Tailwind v4 + HeroUI v3, кит как глобальные стили, ассеты в `public/`.
- **Фаза 1 ✅** — кит → React-компоненты + витрина `/kit` (заменила статичный index.html; ripple перенесён в `<Button>`).
- **Фаза 2 ✅** — слой данных (моки) + демо `/catalog`.
- **Фаза 3 ✅** — стеклянная шапка (Header) + подвал (Footer), подключены в root layout.
- **Фаза 4 ✅ (в основном)** — **главная страница** собрана по макету:
  Hero, ряд брендов, «Автомобили в наличии» (карусель), «Найдите свой формат» (бенто типов кузова),
  «Ближайшие поступления» (карусель), блок «О салоне» (услуги-текст Трейд-ин/Лизинг + заявление +
  3 карточки услуг с фото Ателье/Подбор/Велес + отзыв), «Контакты» (галерея + инфо + **реальная
  карта Яндекса** через iframe-виджет).
- **Фаза 5 ✅** — **Каталог** `/catalog` (по макету `578:1927`) и **страница авто**
  `/catalog/[slug]` (по макету `625:6038`). Обе — в ветке **`catalog`** (запушена в
  `origin/catalog`, **в `main` НЕ влита**). Подробности — раздел 10.

### Открытые вопросы / мелочи по главной
- Папки `salon` нет — в блоке «о салоне» вместо фото-коллажа стоит большая надпись IMPERIUM MOTORS.
  Если нужен коллаж — нужны исходники.
- `reviews/review2.webp` пока не задействован (показан один отзыв Михаила).
- Навигация в шапке/футере — ссылки-заглушки (`#`), кроме CTA «Каталог» → `/catalog`.

## 8. Что дальше (Фаза 4+ / 5)

Порядок страниц (по договорённости): **Главная (✅) → Каталог (с фильтрами на HeroUI) →
Страница автомобиля → Услуги (статика с блоками) → Новости**. Далее — простая самописная
**админка** (одна учётка, без ролей) для новостей и отзывов — реально заработает после БД.

Ближайшее:
1. **Каталог ✅** и **страница авто ✅** — сделаны (ветка `catalog`, см. раздел 10).
2. **Связать каталог со страницами авто**: сейчас на карточках каталога/каруселей кнопка
   «Подробнее» — не ссылка. Нужно обернуть `CarCard`/кнопку в `<Link href={`/catalog/${slug}`}>`
   (по всему сайту: каталог, «Просмотренные», «Рекомендованные», карусели главной). Компонент
   `CarCard` пока не принимает href — добавить проп и прокинуть slug.
3. **Влить `catalog` в `main`** (по решению заказчика; PR/merge).
4. **Услуги**, **Новости** — по макетам Figma (следующие страницы).

> Незакрытая мелочь: комплектация и часть характеристик авто — статические моки (одинаковы для
> всех машин); при появлении реальных данных заменить.

## 9. Рабочие договорённости (важно соблюдать)
- Отвечать и общаться **по-русски**.
- **Коммитить самому после каждой задачи** (осмысленные сообщения). Пуш — по запросу.
  Автор коммитов: **gest / gest.webstudio@gmail.com** (закреплено в локальном `git config`).
- **UI-тесты не пишем и не гоняем.**
- Верстаем по макету, элементы — из кита; в макеты Figma лезем через MCP `get_design_context`.
- Новый проект — работать только с гит-репо в `C:\Users\User\imperium`, по старым папкам не лазить.

## 10. Каталог и страница авто (Фаза 5) — детали

**Ветка `catalog`** (запушена в `origin/catalog`, в `main` не влита). Общение по-русски,
коммит после каждой задачи, UI-тесты не гоняем — проверка через `npx tsc --noEmit` (0 ошибок)
+ визуально в браузере.

### Данные (`lib/cars.ts`)
- К `Car` добавлены поля: `bodyType`, `color`, `transmission`, `fuelType`; `drive` теперь
  короткое значение («Полный»/«Задний»/«Передний»), в тегах карточки рендерится `${drive} привод`.
- **COPIES = 6 → всего 24 машины** (заказчик просил меньше).
- Новое: `getFacetOptions()` (фасеты фильтров), `getCarSpecs(car)` (9 основных + 10 доп.
  характеристик, часть выведена из мощности), `getCarBySlug`, константы диапазонов
  `PRICE_MIN/MAX = 4.5–50 млн`, `POWER_MIN/MAX = 100–900`, массив `FACETS`.

### Каталог `/catalog` (`app/catalog/`)
- `page.tsx` (server, метаданные) → `components/catalog/CatalogClient.tsx` (client, всё состояние).
- Блоки: хлебные крошки (HeroUI Breadcrumbs), заголовок + бейдж-счётчик, **сортировка**
  (HeroUI Dropdown: по возр./убыв. цены, популярные), **сайдбар фильтров** (sticky `top:34px`,
  внутр. скролл), грид 3 колонки, затем статичные секции: Трейд-ин/Лизинг (`TradeLeasing`),
  подбор (`Podbor`, фото `services/podbor.webp`), «Просмотренные автомобили» (`CarsSection` без
  кнопки, 4 шт.), контакты (`Contacts` с главной).
- Сайдбар: «Выбранные категории» (теги кита, крестик убирает фасет, «Очистить» — всё; дефолт
  «Нет выбранных фильтров»), Цена/Мощность (`RangeFilter`: HeroUI Slider + поля-плейсхолдеры
  с маской, двусторонняя связь), аккордеоны фасетов (HeroUI Accordion + Checkbox).
- Файлы: `components/catalog/{CatalogClient,FilterSidebar,RangeFilter,SortDropdown,TradeLeasing,Podbor}.tsx`,
  стили `app/catalog/catalog.css`.

### Страница авто `/catalog/[slug]` (`app/catalog/[slug]/`)
- `page.tsx` (server): `getCarBySlug`, `generateStaticParams`, метаданные, `notFound`,
  импорт `car.css` + `../../home.css` (для переиспользуемых блоков).
- `components/car/CarView.tsx` (client) собирает: крошки → **галерея** (`Gallery.tsx`,
  бесконечная карусель: центр крупно/непрозрачно, боковые меньше+50%, при переходе едет в центр;
  фото `gallery/1–2.webp`) → заголовок+бейдж+wishlist/comparison / **карточка цены** (справа) /
  **характеристики** (`Specs.tsx`, «Развернуть» 9↔19) / **комплектация** (`Complectation.tsx`,
  табы-категории меняют опции, моки) → **страховка/помощь** (`Assurance.tsx`, фото `help.webp`) →
  **ателье/велес** (`Atelier.tsx`, карточки с главной) → **рекомендованные** (`CarsSection`, без
  кнопки) → **контакты**. Название = `${brand} ${name}`, цена/данные — из каталога (динамически,
  НЕ из макета — по решению заказчика).

### Важные грабли (HeroUI v3 / окружение)
- **HeroUI Slider**: корень имеет `display:grid` с тонкой (~4px) дорожкой — сбрасывать в
  `display:block`. Ползунки центрируются инлайн-`translate(-50%)` (свисают за край на минимум/
  максимум) — прижаты внутрь через модификаторы `--start/--end` + `!important`. Синий артефакт —
  дефолтный `border-left` фокус-акцента на `[data-fill-start]`; убран `border:none` у трека +
  `appearance:none` у нативного range-input. Всё это в `catalog.css` (секция слайдера).
- HeroUI-компоненты (Accordion/Dropdown/Slider/Checkbox/Breadcrumbs) стилизуются нашим CSS т.к.
  кит подключён без `@layer` (перебивает слои HeroUI). Таргетить по своим классам + `[data-slot]`.
- Скриншоты встроенного браузера работают, только когда его панель **видима** в UI; иначе
  «Browser pane is not displayed». DOM/вычисленные стили читаются всегда.

## 11. История коммитов (свежие сверху)
```
c59ed57 Car page: блок «Комплектация» с табами
c57c842 Car page: ателье/велес, рекомендованные авто, контакты
9544351 Car page: блок страховка / гарантия / помощь на дорогах
58adaa7 Car page /catalog/[slug] — blocks up to «Комплектация»
bf518f0 Catalog: fix slider — сброс grid-раскладки корня HeroUI
264fcd7 Catalog: 24 машины, поля-подсказки с маской, полиш слайдера
e9490c7 / e2da6d2 Catalog: «Просмотренные» — без кнопки, 2 карточки
f0802f9 Catalog: trade-in/leasing, подбор, «Вы смотрели», контакты
0572648 Catalog: filters, sorting, breadcrumbs (up to trade-in)
--- ниже — main (до ветки catalog) ---
86fed96 Home fixes: header 1880, hero flush to top, car as background, contacts button size
0008f62 Home fixes: contacts full-height card, testimonial distribution, hero stats beside card
286298c Home fixes: 1800 content, 4 cars per row, hero 3-line heading, About services-with-photo
5bf6a6c Phase 4 part 2: About + Contacts (Yandex map) + assets
b69047f Phase 4 part 1: Hero, brands, carousels, body-type bento; header -> fixed
4c53bde Footer wrap fix
39086a6 Phase 3: Header (glass) + Footer
fbd0992 Phase 2: mock cars + /catalog
5c9ba58 Kit: Bubble matrix (incl. White)
0f2f67b Car Card photos + width 432
7e71a1a Phase 1: kit -> React + /kit
e37f23c Phase 0: scaffold Next 16 + Tailwind v4 + HeroUI v3
```
