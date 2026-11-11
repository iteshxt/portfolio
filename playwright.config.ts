import { defineConfig } from "@playwright/test";

/**
 * End-to-end tests (docs/spec.md §14) against the production build.
 * Uses the installed Google Chrome (no browser download); run `npm run build`
 * first. Arcee runs on its stand-in model so no API key is needed.
 */
const PORT = 3200;

export default defineConfig({
  testDir: "e2e",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: `http://localhost:${PORT}`,
    channel: process.env.PW_CHANNEL ?? "chrome",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
    env: { ARCEE_MOCK: "1" },
  },
});
