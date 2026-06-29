import { expect, test } from "@playwright/test";

test("app loads and renders root screen", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("app-root")).toBeVisible();
  await expect(page.getByTestId("app-title")).toHaveText("God Roll Vault");
});
