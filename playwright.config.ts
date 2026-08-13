import { defineConfig, devices } from "@playwright/test";

const port = 3001;
const useProductionServer = process.env.PLAYWRIGHT_PRODUCTION === "1";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    ...(process.env.CI
      ? [
          {
            name: "webkit-smoke",
            testMatch: ["smoke.spec.ts", "navigation-and-forms.spec.ts"],
            use: {
              ...devices["Desktop Safari"],
              viewport: { width: 1440, height: 1000 },
            },
          },
        ]
      : []),
  ],
  webServer: {
    command: useProductionServer
      ? `npm run start -- --hostname localhost --port ${port}`
      : `npm run dev -- --hostname localhost --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
