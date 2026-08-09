import type { ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

vi.mock("@heroui/react", () => {
  function Slider({
    children,
    onChange,
    minValue,
    maxValue,
    step,
    ...props
  }: {
    children: ReactNode;
    onChange: (value: number[]) => void;
    minValue: number;
    maxValue: number;
    step: number;
    [key: string]: unknown;
  }) {
    return (
      <div {...props}>
        {children}
        <button
          type="button"
          data-testid="slider-change"
          onClick={() => onChange([minValue + step, maxValue - step])}
        >
          Изменить слайдер
        </button>
      </div>
    );
  }
  Slider.Track = ({ children }: { children: ReactNode }) => <div>{children}</div>;
  Slider.Marks = ({ children, ...props }: { children: ReactNode }) => (
    <div {...props}>{children}</div>
  );
  Slider.Fill = () => <span />;
  Slider.Thumb = (props: Record<string, unknown>) => <span {...props} />;

  return { Slider };
});

import { RangeFilter, type RangeValue } from "@/components/catalog/RangeFilter";

function RangeHarness({ initial = [100, 900] as RangeValue }) {
  const onChange = vi.fn();
  return {
    onChange,
    element: (
      <RangeFilter
        label="Мощность, л.с."
        min={100}
        max={900}
        step={50}
        value={initial}
        onChange={onChange}
      />
    ),
  };
}

describe("RangeFilter", () => {
  it("показывает границы как placeholders и 14 отметок", () => {
    const { element } = RangeHarness({ initial: [100, 900] });
    const { container } = render(element);

    expect(screen.getByLabelText("Мощность, л.с.: от")).toHaveAttribute(
      "placeholder",
      "от 100",
    );
    expect(screen.getByLabelText("Мощность, л.с.: до")).toHaveAttribute(
      "placeholder",
      "до 900",
    );
    expect(container.querySelectorAll(".cat-slider__mark")).toHaveLength(14);
  });

  it("форматирует ввод без пересчёта и ограничивает нижнюю границу при blur", async () => {
    const user = userEvent.setup();
    const { element, onChange } = RangeHarness({ initial: [100, 700] });
    render(element);
    const from = screen.getByLabelText("Мощность, л.с.: от");

    await user.click(from);
    await user.type(from, "1a000");

    expect(from).toHaveValue("1 000");
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith([700, 700]);
  });

  it("ограничивает верхнюю границу и сбрасывает очищенные поля только при подтверждении", async () => {
    const user = userEvent.setup();
    const { element, onChange } = RangeHarness({ initial: [300, 700] });
    render(element);
    const to = screen.getByLabelText("Мощность, л.с.: до");

    await user.click(to);
    await user.clear(to);
    await user.type(to, "50");
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith([300, 300]);

    await user.click(to);
    await user.clear(to);
    expect(onChange).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith([300, 900]);
  });

  it("сбрасывает нижнее поле и завершает редактирование при blur", () => {
    const { element, onChange } = RangeHarness({ initial: [300, 700] });
    render(element);
    const from = screen.getByLabelText("Мощность, л.с.: от");

    fireEvent.focus(from);
    fireEvent.change(from, { target: { value: "" } });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.blur(from);
    expect(onChange).toHaveBeenLastCalledWith([100, 700]);
    expect(from).toHaveValue("300");
  });

  it("применяет ручной ввод по Enter", async () => {
    const user = userEvent.setup();
    const { element, onChange } = RangeHarness({ initial: [100, 700] });
    render(element);
    const from = screen.getByLabelText("Мощность, л.с.: от");

    await user.click(from);
    await user.type(from, "450");
    expect(onChange).not.toHaveBeenCalled();
    await user.keyboard("{Enter}");
    expect(onChange).toHaveBeenLastCalledWith([450, 700]);
  });

  it("передаёт изменение HeroUI-слайдера наружу", async () => {
    const user = userEvent.setup();
    const { element, onChange } = RangeHarness({ initial: [100, 900] });
    render(element);

    await user.click(screen.getByTestId("slider-change"));
    expect(onChange).toHaveBeenCalledWith([150, 850]);
  });
});
