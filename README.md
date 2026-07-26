# Imperium Motors — UI Kit

Дизайн-токены (цвета и типографика), выгруженные из Figma-файла
[Imperium Motors](https://www.figma.com/design/bERRa0eUHmPImiBdiP62UR/Imperium-Motors).

Живая демонстрация — [`index.html`](index.html).

## Структура

```
index.html            — демо UI Kit (специмены всех стилей + палитра)
tokens/
  colors.json         — цвета в формате W3C Design Tokens
  typography.json     — семейства, начертания и все 73 текстовых стиля
styles/
  tokens.css          — CSS custom properties (--color-*, --font-*)
  tokens.scss         — SCSS-переменные ($color-*, $font-*)
  typography.css      — готовые классы всех текстовых стилей (.t-*)
```

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
