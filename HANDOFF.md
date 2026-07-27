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
1. **Каталог** `/catalog` — сейчас просто грид; сделать по макету: фильтры (марка, кузов,
   цена — HeroUI Select/Slider/Checkbox, стилизованные под кит), сортировка, пагинация, теги-фильтры.
2. **Страница автомобиля** `/catalog/[slug]` (данные из `getCarBySlug`).
3. **Услуги**, **Новости** — по макетам Figma.

## 9. Рабочие договорённости (важно соблюдать)
- Отвечать и общаться **по-русски**.
- **Коммитить самому после каждой задачи** (осмысленные сообщения). Пуш — по запросу.
  Автор коммитов: **gest / gest.webstudio@gmail.com** (закреплено в локальном `git config`).
- **UI-тесты не пишем и не гоняем.**
- Верстаем по макету, элементы — из кита; в макеты Figma лезем через MCP `get_design_context`.
- Новый проект — работать только с гит-репо в `C:\Users\User\imperium`, по старым папкам не лазить.

## 10. История коммитов (свежие сверху)
```
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
