import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => {
  cleanup();
  localStorage.clear();
  document.body.className = "";
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

vi.stubGlobal(
  "requestAnimationFrame",
  (callback: FrameRequestCallback) => window.setTimeout(() => callback(0), 0),
);
vi.stubGlobal("cancelAnimationFrame", (id: number) => window.clearTimeout(id));

if (!(HTMLElement.prototype as HTMLElement & { scrollTo?: unknown }).scrollTo) {
  HTMLElement.prototype.scrollTo = vi.fn();
}

Object.defineProperty(HTMLElement.prototype, "inert", {
  configurable: true,
  get() {
    return this.hasAttribute("inert");
  },
  set(value: boolean) {
    if (value) this.setAttribute("inert", "");
    else this.removeAttribute("inert");
  },
});
