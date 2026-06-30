import { expect, test } from "@playwright/test";

test("renders shared UI components through react-native-web for unauthenticated users", async ({
  page,
}) => {
  await page.goto("/");

  const loginPage = page.getByTestId("login-page");
  await expect(loginPage).toBeVisible();
  await expect(loginPage).toHaveCSS("background-color", "rgb(15, 9, 32)");
  await expect(loginPage).toHaveCSS("padding-top", "16px");

  const loginTitle = page.getByTestId("login-title");
  await expect(loginTitle).toHaveText("God Roll Vault");
  await expect(loginTitle).toHaveCSS("color", "rgb(247, 242, 255)");
  await expect(page.getByTestId("sign-in-bungie")).toBeVisible();
});
