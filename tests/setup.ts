import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";
import {
  isKnownFluidTokenDiagnostic,
  type JSDOMError,
} from "./support/jsdom-errors";

type JSDOMVirtualConsole = {
  removeAllListeners(event: string): void;
  on(event: string, listener: (error: JSDOMError) => void): void;
};

/* jsdom's parser does not understand the modern CSS math used by the fluid
   token layer. Its geometry is covered in real Chromium by Playwright, so
   suppress only that known parser diagnostic and keep all other errors. */
const virtualConsole = (
  window as typeof window & { _virtualConsole?: JSDOMVirtualConsole }
)._virtualConsole;
if (virtualConsole) {
  virtualConsole.removeAllListeners("jsdomError");
  virtualConsole.on("jsdomError", (error) => {
    if (!isKnownFluidTokenDiagnostic(error)) console.error(error);
  });
}

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
