# Imperium Motors — Design Tokens

Токены дизайн-системы (цвета и типографика), выгруженные из Figma-файла
[Imperium Motors](https://www.figma.com/design/bERRa0eUHmPImiBdiP62UR/Imperium-Motors).

## Структура

```
tokens/
  colors.json        — цвета в формате W3C Design Tokens
  typography.json    — семейства шрифтов, начертания и текстовые стили
styles/
  tokens.css         — CSS custom properties (--color-*, --font-*)
  tokens.scss        — SCSS-переменные ($color-*, $font-*)
```

## Цвета

Основная палитра сочетает глубокий зелёный (Heritage Green), графит (Carbon Black)
и тёплые каменные оттенки (Warm Taupe, Stone Beige).

| Группа          | Оттенки            |
| --------------- | ------------------ |
| Carbon Black    | 100–500            |
| Heritage Green  | 100–600            |
| Warm Taupe      | 100–500            |
| Stone Beige     | 100–500            |
| White           | #FFFFFF            |
| Additional      | Blue, Red, Yellow, Green (100 / 500) |

Heritage Green (`#294434`) — основной акцент: кнопки, логотип, активные теги.

## Типографика

- **Заголовки** — `Wix Madefor Display` (Regular 400, ExtraBold 800)
- **Основной текст** — `Onest` (Regular 400)

Текстовые стили: `price`, `heading`, `stat`, `button`, `tag`, `caption`
(см. `tokens/typography.json` и `styles/tokens.css`).

## Использование

CSS:

```css
@import "styles/tokens.css";

.button {
  background: var(--color-heritage-green-500);
  color: var(--color-white);
  font-family: var(--font-text);
  font-size: var(--font-size-button);
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
