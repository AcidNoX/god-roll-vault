import { expect, type Page, test } from "@playwright/test";

const baseURL = "https://127.0.0.1:3000";
const MOCK_AUTH_CODE = "e2e-mock-auth-code";
const MOCK_MEMBERSHIP_ID = "4611686018467427902";
const MOCK_DESTINY_MEMBERSHIP_ID = "4611686018467427903";
const MOCK_CHARACTER_ID = "2305789507540360956";
const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization, X-API-Key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};
const EMPTY_WEAPON_PROFILE = {
  characterInventories: { [MOCK_CHARACTER_ID]: { items: [] } },
  characterEquipment: { [MOCK_CHARACTER_ID]: { items: [] } },
  profileInventory: { items: [], privacy: 1 },
};

function bungieEnvelope<T>(response: T) {
  return {
    Response: response,
    ErrorCode: 1,
    ThrottleSeconds: 0,
    ErrorStatus: "Success",
    Message: "Ok",
    MessageData: {},
  };
}

async function mockCharacterApi(page: Page) {
  await page.route("**/Platform/**", async (route) => {
    const url = new URL(route.request().url());

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });
      return;
    }

    if (url.pathname.endsWith("/Platform/User/GetMembershipsForCurrentUser/")) {
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: "application/json",
        body: JSON.stringify(
          bungieEnvelope({
            destinyMemberships: [
              {
                membershipType: 3,
                membershipId: MOCK_DESTINY_MEMBERSHIP_ID,
                displayName: "Guardian",
                bungieGlobalDisplayName: "Guardian",
                bungieGlobalDisplayNameCode: 1234,
              },
            ],
            primaryMembershipId: MOCK_DESTINY_MEMBERSHIP_ID,
          }),
        ),
      });
      return;
    }

    if (
      url.pathname === `/Platform/Destiny2/3/Profile/${MOCK_DESTINY_MEMBERSHIP_ID}/` &&
      url.searchParams.get("components") === "200"
    ) {
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: "application/json",
        body: JSON.stringify(
          bungieEnvelope({
            characters: {
              [MOCK_CHARACTER_ID]: {
                characterId: MOCK_CHARACTER_ID,
                classType: 0,
                light: 1985,
                dateLastPlayed: "2026-06-01T12:00:00.000Z",
              },
            },
          }),
        ),
      });
      return;
    }

    if (
      url.pathname === `/Platform/Destiny2/3/Profile/${MOCK_DESTINY_MEMBERSHIP_ID}/` &&
      url.searchParams.get("components") === "102,201,205,300,305,308"
    ) {
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: "application/json",
        body: JSON.stringify(bungieEnvelope(EMPTY_WEAPON_PROFILE)),
      });
      return;
    }

    await route.continue();
  });
}

test.describe("Bungie OAuth login", () => {
  test.beforeEach(async ({ page }) => {
    await mockCharacterApi(page);

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

  test("sign in stores tokens and redirects to character selection", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();

    await expect(page.getByTestId("character-selector")).toBeVisible();
    await expect(page.getByTestId(`character-card-${MOCK_CHARACTER_ID}`)).toBeVisible();

    const storedTokens = await page.evaluate(() =>
      localStorage.getItem("god-roll-vault:auth-tokens"),
    );
    expect(storedTokens).toContain("e2e-access-token");
    expect(storedTokens).toContain("e2e-refresh-token");
  });

  test("authenticated users visiting home redirect to character selection", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();
    await expect(page.getByTestId("character-selector")).toBeVisible();

    await page.goto("/");
    await expect(page.getByTestId("character-selector")).toBeVisible();
  });

  test("logout clears tokens and redirects to login", async ({ page }) => {
    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();
    await expect(page.getByTestId("character-selector")).toBeVisible();
    await page.getByTestId(`character-card-${MOCK_CHARACTER_ID}`).click();
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

  test("unauthenticated users cannot access weapon details", async ({ page }) => {
    await page.goto("/weapons/1000000000000000001");
    await expect(page.getByTestId("login-page")).toBeVisible();
  });
});
