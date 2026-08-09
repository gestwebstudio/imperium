import { describe, expect, it } from "vitest";
import {
  buildComparisonRows,
  getComparisonColumnCount,
  getCyclicComparisonCandidate,
} from "@/components/comparison/ComparisonClient";
import { getCars, type Spec } from "@/lib/cars";

function spec(
  key: string,
  label: string,
  rawValue: Spec["rawValue"],
  displayValue: string,
): Spec {
  return { key, label, rawValue, displayValue };
}

describe("модель характеристик сравнения", () => {
  it("сопоставляет значения по key и подставляет прочерк для отсутствующих", () => {
    const rows = buildComparisonRows(
      [
        {
          primary: [
            spec("year", "Год выпуска", 2026, "2026"),
            spec("power", "Мощность", 528, "528 л.с."),
          ],
          extra: [],
        },
        {
          primary: [
            spec("bodyType", "Кузов", "Купе", "Купе"),
            spec("year", "Год выпуска", 2026, "2 026"),
          ],
          extra: [],
        },
      ],
      "primary",
    );

    expect(rows.map((row) => row.key)).toEqual(["year", "power", "bodyType"]);
    expect(rows[0]).toMatchObject({
      key: "year",
      isDifferent: false,
      values: [
        { rawValue: 2026, displayValue: "2026" },
        { rawValue: 2026, displayValue: "2 026" },
      ],
    });
    expect(rows[1].values[1]).toEqual({
      rawValue: undefined,
      displayValue: "—",
    });
    expect(rows[1].isDifferent).toBe(true);
  });

  it("нормализует текст для сравнения, не меняя display value", () => {
    const rows = buildComparisonRows(
      [
        {
          primary: [spec("drive", "Привод", " Полный ", "Полный")],
          extra: [],
        },
        {
          primary: [spec("drive", "Привод", "полный", "ПОЛНЫЙ")],
          extra: [],
        },
      ],
      "primary",
    );

    expect(rows[0].isDifferent).toBe(false);
    expect(rows[0].values.map((value) => value.displayValue)).toEqual([
      "Полный",
      "ПОЛНЫЙ",
    ]);
  });
});

describe("адаптивная навигация сравнения", () => {
  it.each([
    [320, 1],
    [340, 1],
    [350, 1],
    [360, 2],
    [375, 2],
    [390, 2],
    [414, 2],
    [430, 2],
    [480, 2],
    [799, 2],
    [800, 3],
    [999, 3],
    [1000, 4],
  ])("выбирает %i колонок при viewport %ipx", (width, columns) => {
    expect(getComparisonColumnCount(width)).toBe(columns);
  });

  it("циклически обходит края и пропускает занятый автомобиль", () => {
    const cars = getCars().slice(0, 4);

    expect(
      getCyclicComparisonCandidate(cars, cars[3].id, new Set(), 1)?.id,
    ).toBe(cars[0].id);
    expect(
      getCyclicComparisonCandidate(cars, cars[0].id, new Set(), -1)?.id,
    ).toBe(cars[3].id);
    expect(
      getCyclicComparisonCandidate(
        cars,
        cars[3].id,
        new Set([cars[0].id]),
        1,
      )?.id,
    ).toBe(cars[1].id);
  });
});
