import { act, fireEvent, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Hero } from "@/components/home/Hero";

function getStage(container: HTMLElement) {
  return container.querySelector<HTMLElement>(".hero__card-stage")!;
}

function getActiveCard(container: HTMLElement) {
  return container.querySelector<HTMLElement>(
    '.hero__card:not([aria-hidden="true"])',
  )!;
}

function swipe(
  stage: HTMLElement,
  from: { x: number; y: number },
  to: { x: number; y: number },
) {
  fireEvent.touchStart(stage, {
    touches: [{ clientX: from.x, clientY: from.y }],
  });
  fireEvent.touchMove(stage, {
    touches: [{ clientX: to.x, clientY: to.y }],
  });
  fireEvent.touchEnd(stage, {
    changedTouches: [{ clientX: to.x, clientY: to.y }],
  });
}

describe("Hero touch navigation", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("циклически переключает общий activeIndex свайпом в обе стороны", () => {
    const { container } = render(<Hero />);
    const stage = getStage(container);

    expect(getActiveCard(container)).toHaveTextContent("Porsche 911 turbo S");

    swipe(stage, { x: 280, y: 180 }, { x: 210, y: 184 });
    expect(getActiveCard(container)).toHaveTextContent(
      "Porsche 911 Carrera 4 GTS",
    );

    swipe(stage, { x: 210, y: 180 }, { x: 280, y: 184 });
    expect(getActiveCard(container)).toHaveTextContent("Porsche 911 turbo S");

    swipe(stage, { x: 210, y: 180 }, { x: 280, y: 184 });
    expect(getActiveCard(container)).toHaveTextContent(
      "Porsche 911 Carrera 4 GTS",
    );
  });

  it("не принимает вертикальный жест за swipe и запускает новый полный autoplay", () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    const stage = getStage(container);

    act(() => vi.advanceTimersByTime(3900));
    fireEvent.touchStart(stage, {
      touches: [{ clientX: 180, clientY: 220 }],
    });

    act(() => vi.advanceTimersByTime(500));
    fireEvent.touchMove(stage, {
      touches: [{ clientX: 184, clientY: 300 }],
    });
    fireEvent.touchEnd(stage, {
      changedTouches: [{ clientX: 184, clientY: 300 }],
    });

    expect(getActiveCard(container)).toHaveTextContent("Porsche 911 turbo S");

    act(() => vi.advanceTimersByTime(3999));
    expect(getActiveCard(container)).toHaveTextContent("Porsche 911 turbo S");

    act(() => vi.advanceTimersByTime(1));
    expect(getActiveCard(container)).toHaveTextContent(
      "Porsche 911 Carrera 4 GTS",
    );
  });

  it("после ручного swipe даёт новому автомобилю полный autoplay interval", () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    const stage = getStage(container);

    act(() => vi.advanceTimersByTime(3900));
    swipe(stage, { x: 280, y: 180 }, { x: 210, y: 184 });
    expect(getActiveCard(container)).toHaveTextContent(
      "Porsche 911 Carrera 4 GTS",
    );

    act(() => vi.advanceTimersByTime(3999));
    expect(getActiveCard(container)).toHaveTextContent(
      "Porsche 911 Carrera 4 GTS",
    );

    act(() => vi.advanceTimersByTime(1));
    expect(getActiveCard(container)).toHaveTextContent("Porsche 911 turbo S");
  });

  it("сохраняет tap вложенной кнопки и подавляет click только после swipe", () => {
    vi.useFakeTimers();
    const { container } = render(<Hero />);
    const stage = getStage(container);
    let activeCard = getActiveCard(container);
    let wishlist = within(activeCard).getByRole("button", {
      name: "В избранное",
    });

    swipe(stage, { x: 160, y: 180 }, { x: 166, y: 183 });
    fireEvent.click(wishlist);
    expect(wishlist).toHaveAttribute("aria-pressed", "true");

    swipe(stage, { x: 280, y: 180 }, { x: 210, y: 184 });
    activeCard = getActiveCard(container);
    wishlist = within(activeCard).getByRole("button", { name: "В избранное" });

    fireEvent.click(wishlist);
    expect(wishlist).toHaveAttribute("aria-pressed", "false");

    act(() => vi.advanceTimersByTime(450));
    fireEvent.click(wishlist);
    expect(wishlist).toHaveAttribute("aria-pressed", "true");
  });
});
