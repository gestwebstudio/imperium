import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  INFINITE_CAROUSEL_COPIES,
  INFINITE_CAROUSEL_MIDDLE_COPY,
  useInfiniteCarousel,
} from "@/components/ui/useInfiniteCarousel";

function Carousel({ itemCount = 2 }: { itemCount?: number }) {
  const { rowRef, scroll } = useInfiniteCarousel(itemCount);
  return (
    <div>
      <div ref={rowRef} data-testid="row">
        {INFINITE_CAROUSEL_COPIES.flatMap((copy) =>
          Array.from({ length: itemCount }, (_, index) => (
            <a
              href={`/item-${index}`}
              key={`${copy}-${index}`}
              data-carousel-cycle-start={index === 0 ? "" : undefined}
            >
              {copy}:{index}
            </a>
          )),
        )}
      </div>
      <button onClick={() => scroll(-1)}>Назад</button>
      <button onClick={() => scroll(1)}>Вперёд</button>
    </div>
  );
}

function setLayout(row: HTMLElement, step = 100, width = 200) {
  Object.defineProperty(row, "clientWidth", { configurable: true, value: width });
  Array.from(row.children).forEach((child, index) => {
    Object.defineProperty(child, "offsetLeft", {
      configurable: true,
      value: index * step,
    });
    Object.defineProperty(child, "offsetWidth", {
      configurable: true,
      value: step,
    });
  });
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useInfiniteCarousel", () => {
  it("стартует со средней копии и синхронизирует доступность элементов", () => {
    render(<Carousel />);
    const row = screen.getByTestId("row");
    setLayout(row);

    act(() => vi.runAllTimers());

    expect(INFINITE_CAROUSEL_MIDDLE_COPY).toBe(2);
    expect(row.scrollLeft).toBe(400);
    expect(row.children[4]).not.toHaveAttribute("aria-hidden");
    expect(row.children[5]).not.toHaveAttribute("aria-hidden");
    expect(row.children[0]).toHaveAttribute("aria-hidden", "true");
    expect((row.children[0] as HTMLElement).inert).toBe(true);
  });

  it("листает на целую видимую страницу", () => {
    render(<Carousel />);
    const row = screen.getByTestId("row");
    setLayout(row);
    const scrollTo = vi.fn();
    row.scrollTo = scrollTo;
    act(() => vi.runAllTimers());

    fireEvent.click(screen.getByRole("button", { name: "Вперёд" }));
    expect(scrollTo).toHaveBeenCalledWith({ left: 600, behavior: "smooth" });

    Object.defineProperty(row, "clientWidth", { configurable: true, value: 100 });
    fireEvent.click(screen.getByRole("button", { name: "Назад" }));
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 300, behavior: "smooth" });
  });

  it("нормализует позицию после прокрутки в средний цикл", () => {
    render(<Carousel />);
    const row = screen.getByTestId("row");
    setLayout(row);
    act(() => vi.runAllTimers());

    row.scrollLeft = 50;
    fireEvent.scroll(row);
    act(() => vi.advanceTimersByTime(120));

    expect(row.scrollLeft).toBe(400);
  });

  it("безопасно работает с пустым или недостаточным набором", () => {
    const { rerender } = render(<Carousel itemCount={0} />);
    fireEvent.click(screen.getByRole("button", { name: "Вперёд" }));

    rerender(<Carousel itemCount={1} />);
    const row = screen.getByTestId("row");
    setLayout(row, 0);
    act(() => vi.runAllTimers());
    fireEvent.click(screen.getByRole("button", { name: "Вперёд" }));
    expect(row.scrollLeft).toBe(0);
  });
});
