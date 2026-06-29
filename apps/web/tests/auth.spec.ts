import { expect, test } from "@playwright/test";

const baseURL = "https://127.0.0.1:3000";
const MOCK_AUTH_CODE = "e2e-mock-auth-code";
const MOCK_MEMBERSHIP_ID = "4611686018467427902";

test.describe("Bungie OAuth login", () => {
  test.beforeEach(async ({ page }) => {
    await page.route("**/en/oauth/authorize**", async (route) => {
      const url = new URL(route.request().url());
      const state = url.searchParams.get("state");

      await route.fulfill({
        status: 302,
        headers: {
          Location: `${baseURL}/auth/callback?code=${MOCK_AUTH_CODE}&state=${state ?? ""}`,
        },
      });
    });

    await page.route("**/Platform/App/OAuth/Token/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "e2e-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "e2e-refresh-token",
          refresh_expires_in: 7_776_000,
          membership_id: MOCK_MEMBERSHIP_ID,
        }),
      });
    });
  });

  test("sign in stores tokens and redirects to inventory", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();

    await expect(page.getByTestId("inventory-page")).toBeVisible();
    await expect(page.getByTestId("inventory-title")).toHaveText("Inventory");
    await expect(page.getByTestId("inventory-membership-id")).toHaveText(
      `Membership: ${MOCK_MEMBERSHIP_ID}`,
    );

    const storedTokens = await page.evaluate(() =>
      localStorage.getItem("god-roll-vault:auth-tokens"),
    );
    expect(storedTokens).toContain("e2e-access-token");
    expect(storedTokens).toContain("e2e-refresh-token");
  });

  test("authenticated users visiting home redirect to inventory", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();
    await expect(page.getByTestId("inventory-page")).toBeVisible();

    await page.goto("/");
    await expect(page.getByTestId("inventory-page")).toBeVisible();
  });

  test("logout clears tokens and redirects to login", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();
    await expect(page.getByTestId("inventory-page")).toBeVisible();

    await page.getByTestId("sign-out").click();

    await expect(page.getByTestId("login-page")).toBeVisible();

    const storedTokens = await page.evaluate(() =>
      localStorage.getItem("god-roll-vault:auth-tokens"),
    );
    expect(storedTokens).toBeNull();
  });

  test("unauthenticated users cannot access inventory", async ({ page }) => {
    await page.goto("/inventory");
    await expect(page.getByTestId("login-page")).toBeVisible();
  });
});
