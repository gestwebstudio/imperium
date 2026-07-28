"use client";

import { useEffect, useRef } from "react";

export const INFINITE_CAROUSEL_COPIES = [0, 1, 2, 3, 4] as const;
export const INFINITE_CAROUSEL_MIDDLE_COPY = 2;

export function useInfiniteCarousel(itemCount: number) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row || itemCount === 0) return;
    const rowElement: HTMLDivElement = row;
    let cycleWidth = 0;
    let middleStart = 0;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    let jumpFrame: number | undefined;

    function cycleStarts() {
      return rowElement.querySelectorAll<HTMLElement>(
        "[data-carousel-cycle-start]",
      );
    }

    function syncItemAccessibility() {
      const viewportStart = rowElement.scrollLeft;
      const viewportEnd = viewportStart + rowElement.clientWidth;

      Array.from(rowElement.children).forEach((child) => {
        const item = child as HTMLElement;
        const itemStart = item.offsetLeft;
        const itemEnd = itemStart + item.offsetWidth;
        const isVisible =
          itemEnd > viewportStart + 1 && itemStart < viewportEnd - 1;

        item.inert = !isVisible;
        if (isVisible) item.removeAttribute("aria-hidden");
        else item.setAttribute("aria-hidden", "true");
      });
    }

    function jumpTo(left: number) {
      const previousBehavior = rowElement.style.scrollBehavior;
      const previousSnapType = rowElement.style.scrollSnapType;
      rowElement.style.scrollBehavior = "auto";
      rowElement.style.scrollSnapType = "none";
      rowElement.scrollLeft = left;
      syncItemAccessibility();
      if (jumpFrame) cancelAnimationFrame(jumpFrame);
      jumpFrame = requestAnimationFrame(() => {
        rowElement.style.scrollBehavior = previousBehavior;
        rowElement.style.scrollSnapType = previousSnapType;
        jumpFrame = undefined;
      });
    }

    function measure() {
      const starts = cycleStarts();
      const middle = starts[INFINITE_CAROUSEL_MIDDLE_COPY];
      const next = starts[INFINITE_CAROUSEL_MIDDLE_COPY + 1];
      if (!middle || !next) return;

      const nextMiddleStart = middle.offsetLeft;
      const nextCycleWidth = next.offsetLeft - nextMiddleStart;
      if (nextCycleWidth <= 0) return;

      if (cycleWidth === 0) {
        cycleWidth = nextCycleWidth;
        middleStart = nextMiddleStart;
        jumpTo(middleStart);
        return;
      }

      const phase =
        (((rowElement.scrollLeft - middleStart) % cycleWidth) + cycleWidth) %
        cycleWidth;
      const progress = phase / cycleWidth;
      cycleWidth = nextCycleWidth;
      middleStart = nextMiddleStart;
      jumpTo(middleStart + progress * cycleWidth);
    }

    function normalizePosition() {
      if (cycleWidth <= 0) return;

      const phase =
        (((rowElement.scrollLeft - middleStart) % cycleWidth) + cycleWidth) %
        cycleWidth;
      const nextLeft = middleStart + phase;

      if (Math.abs(nextLeft - rowElement.scrollLeft) > 1) {
        jumpTo(nextLeft);
      }
    }

    function scheduleNormalization() {
      syncItemAccessibility();
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(normalizePosition, 120);
    }

    const animationFrame = requestAnimationFrame(measure);
    const initialNormalizationTimer = setTimeout(() => {
      measure();
      normalizePosition();
    }, 300);
    rowElement.addEventListener("scroll", scheduleNormalization, {
      passive: true,
    });
    rowElement.addEventListener("scrollend", normalizePosition);

    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(rowElement);
    Array.from(rowElement.children).forEach((item) =>
      resizeObserver.observe(item),
    );

    return () => {
      cancelAnimationFrame(animationFrame);
      if (jumpFrame) cancelAnimationFrame(jumpFrame);
      clearTimeout(initialNormalizationTimer);
      if (scrollTimer) clearTimeout(scrollTimer);
      rowElement.removeEventListener("scroll", scheduleNormalization);
      rowElement.removeEventListener("scrollend", normalizePosition);
      resizeObserver.disconnect();
    };
  }, [itemCount]);

  function scroll(direction: -1 | 1) {
    rowRef.current?.scrollBy({
      left: direction * rowRef.current.clientWidth,
      behavior: "smooth",
    });
  }

  return { rowRef, scroll };
}
