# Тесты Imperium Motors

Набор разделён на два уровня:

- `tests/unit` — модульные и компонентные тесты Vitest/Testing Library для данных,
  серверных действий, proxy, общих UI-компонентов, фильтров и каруселей;
- `tests/e2e` — сквозные тесты Playwright для маршрутов, каталога, карточки
  автомобиля, избранного, сравнения, меню, форм, копирования контактов и галерей.

## Команды

```bash
npx playwright install chromium
npm test
npm run test:coverage
npm run test:e2e
npm run test:all
```

`npm run test:coverage` формирует HTML-отчёт в `coverage/`. Порог покрытия
контролируемых функций: 90% для строк, выражений и функций, 85% для ветвлений.

Playwright использует локальный стенд `http://localhost:3001`. Если стенд уже
запущен, он переиспользуется; иначе тестовый раннер запускает `npm run dev`.
