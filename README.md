# Imperium Motors

Сайт автосалона на **Next.js (App Router) + TypeScript**, дизайн — собственный
UI-кит из Figma-файла
[Imperium Motors](https://www.figma.com/design/bERRa0eUHmPImiBdiP62UR/Imperium-Motors).
Интерактивные функции — на **HeroUI** (React Aria), стилизованные под кит.

## Запуск

```bash
npm install
npm run dev     # http://localhost:3000  ·  витрина кита: /kit
```

## Структура

```
app/
  layout.tsx          — корневой layout (шрифты, globals.css)
  page.tsx            — главная (заглушка)
  globals.css         — HeroUI + Tailwind v4 + импорт кита
  kit/                — витрина компонентов кита (маршрут /kit)
components/
  icons.tsx           — SVG-иконки (12×12, currentColor)
  ui/                 — Button, Wishlist, Comparison, примитивы
  cards/              — BrandCard, BodyCard, CarCard
lib/cn.ts             — склейка классов
styles/               — CSS-кит (tokens.css, typography.css, components.css)
tokens/               — дизайн-токены в JSON (цвета, типографика)
public/
  icons/              — SVG-иконки
  images/             — WebP-картинки (логотипы марок, кузова, авто)
```

Стили кита (`styles/*.css`) подключаются глобально в `app/globals.css` без
`@layer`, поэтому перебивают дефолтные стили HeroUI — наш дизайн выигрывает.

## Компоненты

Все компоненты — в [`styles/components.css`](styles/components.css), на токенах кита.

| Компонент  | Класс          | Назначение                                            |
| ---------- | -------------- | ----------------------------------------------------- |
| Bubble     | `.bubble`      | счётчик / бейдж с числом (S/M/L, 4 цвета)             |
| Badge      | `.badge`       | статусная метка (Info/Success/Warning/Error, Surface/Outlined) |
| Tag        | `.tag`         | пилюля-метка: `--card` (на карточке) / `--filter` (удаляемая) |
| Indicator  | `.indicator`   | статусная точка + подпись (4 статуса)                 |
| Tooltip    | `.tooltip`     | всплывающая подсказка (S/L)                           |
| Wishlist   | `.wishlist`    | кнопка «в избранное» (сердечко-тоггл + тултип)         |
| Comparison | `.compare`     | кнопка «в сравнение» (тоггл + тултип)                  |
| Slider     | `.slider`      | трек прогресса / заполнения                           |
| Price Block| `.price-block` | подпись + цена (стиль Price/Value)                    |
| Button     | `.btn`         | кнопки (S/M/L; Surface/Flat/Outlined/CTA; inverse)    |

## Карточки

| Карточка         | Класс         | Картинки                  |
| ---------------- | ------------- | ------------------------- |
| Brand Logo Card  | `.brand-card` | `images/logo_brands/*`    |
| Body Logo Card   | `.body-card`  | `images/body_card/*`      |
| Car Card         | `.car-card`   | `images/cars/*`, `images/logo_cards/*` |

**Car Card** собран из компонентов кита (Wishlist, Comparison, Indicator, Tag,
Price Block, Button) — минимум собственных стилей.

## Иконки

9 SVG в [`Icons/`](Icons): Arrow, Arrow-Diagonal, Close, Copy, Heart-stroke,
Heart-fill, List-Add, List-Check, Phone. Сетка 12×12, перекрашиваются через
`currentColor` (инлайн `<svg fill="currentColor">`).

## Цвета

Основная палитра сочетает глубокий зелёный (Heritage Green), графит (Carbon Black)
и тёплые каменные оттенки (Warm Taupe, Stone Beige).

| Группа          | Оттенки                              |
| --------------- | ------------------------------------ |
| Carbon Black    | 100–500                              |
| Heritage Green  | 100–600                              |
| Warm Taupe      | 100–500                              |
| Stone Beige     | 100–500                              |
| White           | #FFFFFF                              |
| Additional      | Blue, Red, Yellow, Green (100 / 500) |

Heritage Green (`#294434`) — основной акцент: кнопки, логотип, активные теги.

## Типографика

Два семейства, **73 текстовых стиля** (выгружены напрямую из Figma text styles):

- **Заголовки** — `Wix Madefor Display`: `Heading/H1…H6` (Regular→ExtraBold), `Title card`, `Numeric/Value`, `Price/Value`
- **Основной текст** — `Onest`: `Text/10…36` (Regular / Medium / SemiBold / Bold, + 32/Black)

Полный список с точными размерами, интерлиньяжем и весами — в
[`tokens/typography.json`](tokens/typography.json). Готовые CSS-классы (`.t-*`) —
в [`styles/typography.css`](styles/typography.css).

## Использование

CSS — переменные + готовые классы стилей:

```css
@import "styles/tokens.css";
@import "styles/typography.css";
```

```html
<h1 class="t-heading-h1-h1-extrabold">Империум</h1>
<span class="t-price-value">17 290 000 ₽</span>
<p class="t-text-16-16-regular">Каждая деталь имеет значение</p>
```

```css
.button {
  background: var(--color-heritage-green-500);
  color: var(--color-white);
  font-family: var(--font-text);
}
```

SCSS:

```scss
@use "styles/tokens" as *;

.title {
  font-family: $font-display;
  font-weight: $font-weight-extrabold;
  color: $color-carbon-black-500;
}
```
