import { defineConfig, devices } from "@playwright/test";

const port = 3000;
const baseURL = `https://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL,
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "pnpm dev",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    ignoreHTTPSErrors: true,
    env: {
      VITE_BUNGIE_CLIENT_ID: "e2e-test-client-id",
      VITE_BUNGIE_CLIENT_SECRET: "e2e-test-client-secret",
      VITE_OAUTH_REDIRECT_URI: `${baseURL}/auth/callback`,
    },
  },
});
