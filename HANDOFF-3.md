# Imperium Motors — handoff (сессия 3)

Продолжение работы. Базовый контекст (стек, кит, Figma, договорённости) — в **`HANDOFF.md`**,
воркфлоу и адаптив/подборки/trade-in — в **`HANDOFF-2.md`**. Здесь — что сделано в сессии 3
и как продолжать. Общаемся и комментируем **по-русски**.

---

## 0. Где мы

- Репозиторий: `C:\Users\User\imperium` (git-команды строго тут, не в `C:\Users\User`).
- Рабочая ветка — **`catalog`** (НЕ main). HEAD на момент передачи: `da055ca`, в синхроне с `origin/catalog`.
- Стек: Next.js 16 (App Router) + TS + React 19, Tailwind v4 + HeroUI v3, свой UI-кит (`styles/*.css`,
  компоненты в `components/`). Данные — моки (`lib/cars.ts`). Язык сайта — только русский.
- Запуск: `npm run dev` (http://localhost:3000). Проверка: `npx tsc --noEmit` (держим 0). **UI-тесты не пишем.**
- Зависимости за сессию: добавлены `gsap` (меню/анимации второго агента) и `primereact` (галерея авто) — их
  ставит второй агент; после его merge всегда `npm install`.

## 1. Рабочие договорённости (важно!)

- **Коммитить после каждой задачи** (осмысленно, по-русски). **Пуш — ТОЛЬКО по явной команде** («пуш»).
- Перед пушем ВСЕГДА: `git fetch origin` → показать новые коммиты второго агента → `git merge origin/catalog`
  (обычно чисто) → пушить. Ветка общая со вторым агентом (он делает анимации, галерею, новости, hero, адаптив).
- **Анимации/liquid-glass/галерея/hero — зона второго агента**, точечно трогаем только по прямой просьбе.
- **URL каждой новой страницы уточнять у заказчика** (SEO). Паттерн подборок — короткий top-level слаг.
- **Вёрстка по Figma без «на глаз»**: по каждому блоку точные значения из Figma + скриншот узла, затем
  **числовая сверка DOM↔`getBoundingClientRect`**. Playwright — только на финальной приёмке (см. [[imperium-figma-verify-workflow]]).
  Заказчик просит **не проверять скринами браузера** — только через DOM.

## 2. Figma

- Коннектор **`mcp__Figma__*`** (десктопное приложение, БЕЗ OAuth). Нужно, чтобы файл был **открыт в десктоп-Figma**
  и включён **Dev Mode MCP Server** (Preferences). Если отвалилось — перезапустить приложение Claude (сессия коннектора).
- Второй сервер (`plugin:figma:figma`) требует OAuth и НЕ нужен.
- Крупные фреймы тянуть по секциям (node-id дочерних из `get_metadata`); огромная метадата сохраняется в файл — парсить.

## 3. Что сделано в сессии 3

### 3.1 Данные (`lib/cars.ts`)
- **Переменное число машин на бренд**: `brandCarCount()` — BYD=1, Ferrari=2, остальные детерминированный
  рандом 4..18 (по хэшу имени). `buildCatalog()` генерит машины по брендам (слаги-копии `slug-2` и т.д.). Всего ~162.
- `getCarsForBrand(brand)` теперь возвращает **только машины бренда** (без добора до 8).
- `brandSlug()` + `BRANDS_LOGOS` (name/src/**href**) — единый список 15 брендов из `logo_cards`, для карусели и подборок.

### 3.2 Брендовые подборки
- **12 новых страниц** (короткий слаг): `/porsche /ferrari /lamborghini /rolls-royce /land-rover /chevrolet
  /honda /hyundai /toyota /volvo /byd /gmc` (+ ранее `/bmw /mercedes /lexus`). Все — через `CollectionPage`.
- **Правило фильтра** (`CatalogClient` проп `showFilters`, задаётся в `CollectionPage` для брендовых): машин **≤12 → фильтра нет**,
  грид на колонку шире (`.catalog-grid--wide`, 4→3→2→1); **≥13 → фильтр есть**, обычный грид 3.
- Блок брендов на подборках — **слайдер с главной** (`BrandsRow exclude={brand}`), а не статичная сетка (`BrandsNav` больше не используется).
  Верхний отступ блока — 160px (`.catalog > .brands` в `catalog.css`).

### 3.3 Логотипы
- `byd/chevrolet/gmc` сконвертированы PNG→WebP (в `logo_cards/`). Карточки авто уже ссылались на эти webp.
- Блок брендов на главной (`BrandsRow`) и подборках — 15 лого из `logo_cards`, каждый **ссылка** на свою подборку. Старые `logo_brands` из блока убраны.

### 3.4 Страница «Авто под заказ» — `/car-selection` (макет `821:212`)
- `app/car-selection/*` + `components/carselection/CarSelectionPage.tsx`. Копия trade-in (переиспользует `trade-in.css`).
- Оба image-блока **одинаковые** (фото слева, текст слева — НЕ зеркальные, в отличие от trade-in). Списки **с буллетами**
  (`list-disc`, 27px, без зазора). Note-подписи шириной по макету (2 строки).

### 3.5 Страница «Помощь на дорогах» — `/help-on-roads` (макет `841:6808`)
- `app/help-on-roads/*` + `components/helproads/{HelpRoadsPage,HelpRoadsPricing}.tsx`. Root `<main className="trade-in help-roads">`,
  переиспользует `trade-in.css` + `comparison.css` (для таблицы).
- Hero: кнопка **другая** — зелёная с телефоном (`ButtonLink primary-surface` + `endIcon PhoneIcon`, tel-ссылка).
- **Блок #2 (свой)** — два белых блока (radius 40) с заголовком H4 + текст/список + зелёный callout с кавычкой.
- **Таблица тарифов** (`HelpRoadsPricing`, стили `comparison-spec-table` со страницы сравнения): секции «Техническая помощь»
  (сноска ¹ + подпись под таблицей) и «Эвакуация» (3 подраздела) + строка «ложный вызов». Стоит **после белых блоков**.
- Баннер «Позвоните нам» и контакты — переиспользованы.

### 3.6 Крошки
- Общий `components/ui/Crumbs.tsx` (каталожные классы `.cat-crumbs*`, стрелка вправо `rotate(180)`).
  Подключён на всех услугах (trade-in, leasing, car-selection, help-on-roads).
- Стр. авто (`CarView`): крошки — **третий уровень** с названием машины.

### 3.7 Ссылки и мелочи
- Футер: «Новости» → `/news`, «Лизинг» → `/leasing`, «Помощь на дороге» → `/help-on-roads`, «Трейд-ин» → `/trade-in`.
- Соцкнопки футера → `public/icons/{tg,wa,max}.svg` (свои белые круги; Instagram убран).
- Кнопка «Построить маршрут» в контактах → ссылка на Яндекс.Карты (новая вкладка).
- Главная, «Найдите свой формат» — карточки кузовов ведут на подборки (`/coupe /cabriolet /off-road /minivan /crossover /sedan`).
- Главная, «Ближайшие поступления» — кнопка карточек «Забронировать».
- `ServiceCards` (главная «О салоне» + каталог) — карточки Трейд-ин/Лизинг ведут на `/trade-in`, `/leasing`.
- Стр. авто, блок «Помощь на дорогах» (`Assurance`) — кнопка → `/help-on-roads`.
- Стр. авто, «Комплектация»: вкладки-разделы переносятся на **всех** ширинах (`flex-wrap: wrap`, убран мобильный nowrap-скролл ≤640).
- Шапка — **возвращена к исходному headroom** (эксперименты со скроллом откачены по просьбе).

### 3.8 От второго агента (влито через merge)
- Страницы **Новости** (`/news`, `/news/[slug]`, `lib/news.ts`), переработанный **Hero** главной,
  **галерея авто** на PrimeReact (`components/car/{Gallery,GalleryModal,PrimeGallery}`), адаптив-полиш.

## 4. Полезные пути
- Кит: `styles/{tokens,typography,components}.css`; `components/ui/*`, `components/cards/cards.tsx`.
- Данные: `lib/cars.ts` (`getCars`, `getCarsForBrand`, `getCarsForBody`, `getCarBySlug`, `BRANDS_LOGOS`, `brandSlug`, `brandCarCount`).
- Каталог/подборки: `app/catalog/`, `components/catalog/*`, `components/collection/{CollectionPage,BodyTypesNav}.tsx`.
- Услуги: `app/{trade-in,leasing,car-selection,help-on-roads}/`, `components/{tradein,leasing,carselection,helproads}/*`.
- Крошки: `components/ui/Crumbs.tsx` (+ стили `.cat-crumbs*` в `catalog.css` и `trade-in.css`).
- Главная: `app/page.tsx`, `app/home.css`, `components/home/*`; общий блок услуг — `components/ServiceCards.tsx`.

## 5. Открытые вопросы / на потом
- Финальная приёмка страниц через Playwright (числовую сверку делаем всегда, Playwright — по договорённости на финал).
- Таблица тарифов `/help-on-roads` — заказчик просил «посмотрю и поправлю»: возможны правки вида/ширин колонок.
- `BrandsNav.tsx` больше не используется (можно удалить при чистке).
- URL новых страниц — всегда уточнять у заказчика.
