import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { isKnownFluidTokenDiagnostic } from "../support/jsdom-errors";

const readProjectFile = (path: string) =>
  readFileSync(resolve(process.cwd(), path), "utf8");

describe("responsive contracts", () => {
  it("масштабирует Hero внутри tablet-композиции 960–1199", () => {
    const css = readProjectFile("app/home.css");
    expect(css).toContain("height: calc(1181px + 70px * var(--fluid-progress));");
    expect(css).toContain("top: calc(893px + 70px * var(--fluid-progress));");
    expect(css).toContain("top: -114px;");
    expect(css).toContain("container: hero-card-stage / inline-size");
    expect(css).toContain("@container hero-card-stage (max-width: 360px)");
    expect(css).not.toContain(".hero__inner { height: 1181px; }");
  });

  it("показывает 1/2/3/4 skeleton-карточки Favorites mobile-first", () => {
    const css = readProjectFile("app/favorites/favorites.css");

    expect(css).toContain(
      ".favorites-loading-grid > .car-card-skeleton:nth-child(n + 2)",
    );
    expect(css).toMatch(
      /@media \(min-width: 481px\)[\s\S]*nth-child\(2\) \{ display: flex; \}/,
    );
    expect(css).toMatch(
      /@media \(min-width: 768px\)[\s\S]*nth-child\(3\) \{ display: flex; \}/,
    );
    expect(css).toMatch(
      /@media \(min-width: 1200px\)[\s\S]*nth-child\(4\) \{ display: flex; \}/,
    );
  });

  it("не скрывает посторонние ошибки CSS-парсинга jsdom", () => {
    const known = Object.assign(new Error("Could not parse CSS stylesheet"), {
      type: "css-parsing",
      sheetText:
        ":root { --fluid-progress: calc((100vw - var(--fluid-from) * 1px) / (var(--fluid-to) - var(--fluid-from))); }",
    });
    const unrelated = Object.assign(
      new Error("Could not parse CSS stylesheet"),
      { type: "css-parsing", sheetText: ".broken { color: ???; }" },
    );

    expect(isKnownFluidTokenDiagnostic(known)).toBe(true);
    expect(isKnownFluidTokenDiagnostic(unrelated)).toBe(false);
    expect(isKnownFluidTokenDiagnostic(new Error("runtime failure"))).toBe(false);
  });
});
