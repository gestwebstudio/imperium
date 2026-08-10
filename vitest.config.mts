import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": projectRoot,
      "server-only": fileURLToPath(
        new URL("./tests/mocks/server-only.ts", import.meta.url),
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    include: ["tests/unit/**/*.test.{ts,tsx}"],
    clearMocks: true,
    restoreMocks: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "./coverage",
      include: [
        "lib/{cars,cn,slug,typography,news,reviews,admin-auth,admin-rate-limit,admin-validation,admin-dal,security-headers}.ts",
        "proxy.ts",
        "components/ui/{Button,Comparison,Wishlist,VehicleActionsContext,primitives,TypographyGuard,useInfiniteCarousel}.tsx",
        "components/ui/useInfiniteCarousel.ts",
        "components/car/Specs.tsx",
        "components/catalog/RangeFilter.tsx",
      ],
      thresholds: {
        statements: 90,
        branches: 85,
        functions: 90,
        lines: 90,
      },
    },
  },
});
