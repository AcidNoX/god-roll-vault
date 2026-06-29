import { expect, test } from "@playwright/test";

test("unauthenticated users are redirected to login", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("login-page")).toBeVisible();
  await expect(page.getByTestId("login-title")).toHaveText("God Roll Vault");
  await expect(page.getByTestId("sign-in-bungie")).toBeVisible();
});
