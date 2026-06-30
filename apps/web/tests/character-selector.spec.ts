import { expect, type Page, test } from "@playwright/test";

const MOCK_DESTINY_MEMBERSHIP_ID = "4611686018467427903";
const MOCK_CHARACTER_ID = "2305789507540360956";
const MOCK_SECOND_CHARACTER_ID = "2305789507540360957";
const AUTH_STORAGE_KEY = "god-roll-vault:auth-tokens";
const SELECTED_CHARACTER_STORAGE_KEY = "god-roll-vault:selected-character";
const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization, X-API-Key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

function bungieEnvelope<T>(response: T, overrides = {}) {
  return {
    Response: response,
    ErrorCode: 1,
    ThrottleSeconds: 0,
    ErrorStatus: "Success",
    Message: "Ok",
    MessageData: {},
    ...overrides,
  };
}

async function seedAuth(page: Page) {
  await page.addInitScript(
    ([storageKey]) => {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          expiresAt: Date.now() + 3_600_000,
          refreshExpiresAt: Date.now() + 7_776_000_000,
        }),
      );
    },
    [AUTH_STORAGE_KEY],
  );
}

async function mockSuccessfulCharacterApi(page: Page, delayMs = 0) {
  await page.route("**/Platform/**", async (route) => {
    const url = new URL(route.request().url());

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });
      return;
    }

    if (delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
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
              [MOCK_SECOND_CHARACTER_ID]: {
                characterId: MOCK_SECOND_CHARACTER_ID,
                classType: 1,
                light: 1980,
                dateLastPlayed: "2026-05-28T08:30:00.000Z",
              },
            },
          }),
        ),
      });
      return;
    }

    await route.continue();
  });
}

async function mockErroredCharacterApi(page: Page) {
  await page.route("**/Platform/User/GetMembershipsForCurrentUser/", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: CORS_HEADERS,
      contentType: "application/json",
      body: JSON.stringify(
        bungieEnvelope(
          { destinyMemberships: [] },
          {
            ErrorCode: 5,
            ErrorStatus: "SystemDisabled",
            Message: "The Bungie service is unavailable.",
          },
        ),
      ),
    });
  });
}

test.describe("Character selector", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuth(page);
  });

  test("fetches and renders characters, then persists the selected character", async ({ page }) => {
    await mockSuccessfulCharacterApi(page, 100);

    await page.goto("/characters");

    await expect(page.getByTestId("character-selector")).toBeVisible();
    await expect(page.getByTestId("character-selector-loading")).toBeVisible();

    const firstCard = page.getByTestId(`character-card-${MOCK_CHARACTER_ID}`);
    await expect(firstCard).toBeVisible();
    await expect(page.getByTestId(`${firstCardId()}-class-icon`)).toHaveText("T");
    await expect(page.getByTestId(`${firstCardId()}-class`)).toHaveText("Titan");
    await expect(page.getByTestId(`${firstCardId()}-light`)).toHaveText("1985");
    await expect(page.getByTestId(`${firstCardId()}-last-played`)).toHaveText(
      "Last played Jun 1, 2026",
    );

    await firstCard.click();

    await expect(page.getByTestId("inventory-page")).toBeVisible();
    await expect(page.getByTestId("inventory-selected-character")).toHaveText(
      `Character: ${MOCK_CHARACTER_ID}`,
    );

    const selectedCharacter = await page.evaluate((storageKey) => {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : null;
    }, SELECTED_CHARACTER_STORAGE_KEY);

    expect(selectedCharacter).toEqual({
      membershipType: 3,
      membershipId: MOCK_DESTINY_MEMBERSHIP_ID,
      characterId: MOCK_CHARACTER_ID,
    });
  });

  test("highlights the last selected character from localStorage", async ({ page }) => {
    await page.addInitScript(
      ([storageKey, membershipId, characterId]) => {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            membershipType: 3,
            membershipId,
            characterId,
          }),
        );
      },
      [SELECTED_CHARACTER_STORAGE_KEY, MOCK_DESTINY_MEMBERSHIP_ID, MOCK_SECOND_CHARACTER_ID],
    );
    await mockSuccessfulCharacterApi(page);

    await page.goto("/characters");

    await expect(
      page.getByTestId(`character-card-${MOCK_SECOND_CHARACTER_ID}-selected`),
    ).toHaveText("Selected");
  });

  test("shows an error state when Bungie character loading fails", async ({ page }) => {
    await mockErroredCharacterApi(page);

    await page.goto("/characters");

    await expect(page.getByTestId("character-selector-error")).toBeVisible();
    await expect(page.getByTestId("character-selector-error-message")).toContainText(
      "The Bungie service is unavailable.",
    );
    await expect(page.getByTestId("character-selector-error-retry-button")).toBeVisible();
  });
});

function firstCardId() {
  return `character-card-${MOCK_CHARACTER_ID}`;
}
