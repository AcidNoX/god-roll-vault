import { expect, type Page, test } from "@playwright/test";

const MOCK_DESTINY_MEMBERSHIP_ID = "4611686018467427903";
const MOCK_CHARACTER_ID = "2305789507540360956";
const AUTH_STORAGE_KEY = "god-roll-vault:auth-tokens";
const SELECTED_CHARACTER_STORAGE_KEY = "god-roll-vault:selected-character";
const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization, X-API-Key",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Origin": "*",
};

const FATEBRINGER_INSTANCE_ID = "1000000000000000001";
const FATEBRINGER_KEEPER_ID = "1000000000000000004";
const AUSTRINGER_INSTANCE_ID = "1000000000000000002";
const BELOVED_INSTANCE_ID = "1000000000000000003";

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

async function seedInventorySession(page: Page) {
  await page.addInitScript(
    ([authStorageKey, selectedCharacterStorageKey, membershipId, characterId]) => {
      localStorage.setItem(
        authStorageKey,
        JSON.stringify({
          accessToken: "e2e-access-token",
          refreshToken: "e2e-refresh-token",
          expiresAt: Date.now() + 3_600_000,
          refreshExpiresAt: Date.now() + 7_776_000_000,
          membershipId: "e2e-bungie-membership",
        }),
      );
      localStorage.setItem(
        selectedCharacterStorageKey,
        JSON.stringify({
          membershipType: 3,
          membershipId,
          characterId,
        }),
      );
    },
    [
      AUTH_STORAGE_KEY,
      SELECTED_CHARACTER_STORAGE_KEY,
      MOCK_DESTINY_MEMBERSHIP_ID,
      MOCK_CHARACTER_ID,
    ],
  );
}

function createInventoryProfile(
  fatebringerPower = 1980,
  options: { includeDuplicateFatebringer?: boolean } = {},
) {
  const characterItems = [
    {
      itemHash: 4219826183,
      itemInstanceId: FATEBRINGER_INSTANCE_ID,
      bucketHash: 149531261,
      quantity: 1,
    },
    {
      itemHash: 2429822977,
      itemInstanceId: AUSTRINGER_INSTANCE_ID,
      bucketHash: 149531261,
      quantity: 1,
    },
  ];

  if (options.includeDuplicateFatebringer) {
    characterItems.push({
      itemHash: 4219826183,
      itemInstanceId: FATEBRINGER_KEEPER_ID,
      bucketHash: 149531261,
      quantity: 1,
    });
  }

  return {
    characterInventories: {
      [MOCK_CHARACTER_ID]: {
        items: characterItems,
      },
    },
    characterEquipment: {
      [MOCK_CHARACTER_ID]: {
        items: [],
      },
    },
    profileInventory: {
      items: [
        {
          itemHash: 4190932264,
          itemInstanceId: BELOVED_INSTANCE_ID,
          bucketHash: 149531261,
          quantity: 1,
        },
      ],
      privacy: 1,
    },
    itemComponents: {
      instances: {
        data: {
          [FATEBRINGER_INSTANCE_ID]: {
            primaryStat: { value: fatebringerPower },
            damageTypeHash: 3373582085,
          },
          ...(options.includeDuplicateFatebringer
            ? {
                [FATEBRINGER_KEEPER_ID]: {
                  primaryStat: { value: 1985 },
                  damageTypeHash: 3373582085,
                },
              }
            : {}),
          [AUSTRINGER_INSTANCE_ID]: {
            primaryStat: { value: 1975 },
            damageTypeHash: 3373582085,
          },
          [BELOVED_INSTANCE_ID]: {
            primaryStat: { value: 1990 },
            damageTypeHash: 3373582085,
          },
        },
      },
      sockets: {
        data: {
          [FATEBRINGER_INSTANCE_ID]: {
            sockets: options.includeDuplicateFatebringer
              ? [
                  { plugHash: 4090651448 },
                  { plugHash: 3142289711 },
                  { plugHash: 1015611457 },
                  { plugHash: 3824105627 },
                ]
              : [
                  { plugHash: 3250034553 },
                  { plugHash: 2847525152 },
                  { plugHash: 3177301540 },
                  { plugHash: 1467527085 },
                ],
          },
          ...(options.includeDuplicateFatebringer
            ? {
                [FATEBRINGER_KEEPER_ID]: {
                  sockets: [
                    { plugHash: 1482024992 },
                    { plugHash: 3142289711 },
                    { plugHash: 1015611457 },
                    { plugHash: 3824105627 },
                  ],
                },
              }
            : {}),
          [AUSTRINGER_INSTANCE_ID]: {
            sockets: [
              { plugHash: 839105230 },
              { plugHash: 2847525152 },
              { plugHash: 1015611457 },
              { plugHash: 588594999 },
            ],
          },
          [BELOVED_INSTANCE_ID]: {
            sockets: [],
          },
        },
      },
    },
  };
}

async function mockInventoryApi(
  page: Page,
  options: { delayMs?: number; includeDuplicateFatebringer?: boolean } = {},
) {
  let inventoryRequestCount = 0;

  await page.route("**/Platform/**", async (route) => {
    const url = new URL(route.request().url());

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });
      return;
    }

    if (options.delayMs) {
      await new Promise((resolve) => setTimeout(resolve, options.delayMs));
    }

    if (
      url.pathname === `/Platform/Destiny2/3/Profile/${MOCK_DESTINY_MEMBERSHIP_ID}/` &&
      url.searchParams.get("components") === "102,201,205,300,305,308"
    ) {
      inventoryRequestCount += 1;
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: "application/json",
        body: JSON.stringify(
          bungieEnvelope(
            createInventoryProfile(inventoryRequestCount > 2 ? 1988 : 1980, {
              includeDuplicateFatebringer: options.includeDuplicateFatebringer,
            }),
          ),
        ),
      });
      return;
    }

    await route.fulfill({
      status: 404,
      headers: CORS_HEADERS,
      contentType: "application/json",
      body: JSON.stringify(
        bungieEnvelope(
          {},
          {
            ErrorCode: 1601,
            ErrorStatus: "UnhandledMockRoute",
            Message: `Unhandled mock route: ${url.pathname}`,
          },
        ),
      ),
    });
  });
}

async function mockEmptyInventoryApi(page: Page) {
  await page.route("**/Platform/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS_HEADERS });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: CORS_HEADERS,
      contentType: "application/json",
      body: JSON.stringify(
        bungieEnvelope({
          characterInventories: { [MOCK_CHARACTER_ID]: { items: [] } },
          characterEquipment: { [MOCK_CHARACTER_ID]: { items: [] } },
          profileInventory: { items: [], privacy: 1 },
        }),
      ),
    });
  });
}

async function mockErroredInventoryApi(page: Page) {
  await page.route("**/Platform/**", async (route) => {
    if (route.request().method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: CORS_HEADERS });
      return;
    }

    await route.fulfill({
      status: 200,
      headers: CORS_HEADERS,
      contentType: "application/json",
      body: JSON.stringify(
        bungieEnvelope(
          {},
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

test.describe("Weapon inventory", () => {
  test.beforeEach(async ({ page }) => {
    await seedInventorySession(page);
  });

  test("renders evaluated weapons sorted by god roll status, then filters and refreshes", async ({
    page,
  }) => {
    await mockInventoryApi(page, { delayMs: 100 });

    await page.goto("/inventory");

    await expect(page.getByTestId("inventory-loading")).toBeVisible();
    await expect(page.getByTestId("weapon-inventory-list")).toBeVisible();
    await expect(page.getByTestId("inventory-summary")).toHaveText("3 weapons, 1 god roll in PVE");

    const cards = page.getByTestId("weapon-inventory-list").getByTestId(/^weapon-card-\d+$/);
    await expect(cards).toHaveCount(3);
    await expect(
      cards.nth(0).getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-name`),
    ).toHaveText("Fatebringer (Timelost)");
    await expect(
      cards.nth(0).getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-badge`),
    ).toHaveText("God Roll");
    await expect(
      cards
        .nth(0)
        .getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-weapon-icon-image`)
        .locator("img"),
    ).toHaveAttribute(
      "src",
      "https://www.bungie.net/common/destiny2_content/icons/0e281ebb76f5e5ba169bd44c036fcf39.jpg",
    );
    await expect(cards.nth(1).getByTestId(`weapon-card-${AUSTRINGER_INSTANCE_ID}-name`)).toHaveText(
      "Austringer",
    );
    await expect(cards.nth(2).getByTestId(`weapon-card-${BELOVED_INSTANCE_ID}-name`)).toHaveText(
      "Beloved",
    );
    await expect(page.getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-power`)).toHaveText(
      "Power 1980",
    );

    await page.getByTestId("inventory-refresh-button").click();
    await expect(page.getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-power`)).toHaveText(
      "Power 1988",
    );

    await page.getByTestId("inventory-mode-pvp").click();
    await expect(page.getByTestId("inventory-summary")).toHaveText("3 weapons, 1 god roll in PVP");
    await expect(cards.nth(0).getByTestId(`weapon-card-${AUSTRINGER_INSTANCE_ID}-name`)).toHaveText(
      "Austringer",
    );
    await expect(page.getByTestId(`weapon-card-${AUSTRINGER_INSTANCE_ID}-badge`)).toHaveText(
      "God Roll",
    );

    await page.getByTestId("inventory-search-input").fill("beloved");
    await expect(cards).toHaveCount(1);
    await expect(page.getByTestId(`weapon-card-${BELOVED_INSTANCE_ID}-name`)).toHaveText("Beloved");

    await page.getByTestId("inventory-search-input").fill("not a weapon");
    await expect(page.getByTestId("inventory-empty-search")).toBeVisible();
  });

  test("renders a routed weapon detail breakdown with target perks and back navigation", async ({
    page,
  }) => {
    await mockInventoryApi(page);

    await page.goto(
      `/weapons/${FATEBRINGER_INSTANCE_ID}?membershipType=3&membershipId=${MOCK_DESTINY_MEMBERSHIP_ID}&characterId=${MOCK_CHARACTER_ID}&mode=pve`,
    );

    await expect(page.getByTestId("weapon-detail-page")).toBeVisible();
    await expect(page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}`)).toBeVisible();
    await expect(page.getByTestId("weapon-detail-title")).toHaveText("Fatebringer (Timelost)");
    await expect(page.getByTestId("weapon-detail-icon-image").locator("img")).toHaveAttribute(
      "src",
      "https://www.bungie.net/common/destiny2_content/icons/0e281ebb76f5e5ba169bd44c036fcf39.jpg",
    );
    await expect(page.getByTestId("weapon-detail-power")).toHaveText("Power 1980");
    await expect(page.getByTestId("weapon-detail-element")).toHaveText("Kinetic element");
    await expect(page.getByTestId("weapon-detail-tier")).toHaveText("Legendary");
    await expect(page.getByTestId("weapon-detail-god-roll-badge")).toHaveText("PVEGod Roll100%");
    await expect(
      page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}-perk-list-perk2`),
    ).toContainText("Firefly");
    await expect(page.getByTestId("weapon-detail-target-barrel")).toContainText(
      "Hammer-Forged Rifling",
    );
    await expect(page.getByTestId("weapon-detail-target-magazine")).toContainText(
      "Accurized Rounds",
    );
    await expect(page.getByTestId("weapon-detail-target-perk1")).toContainText("Explosive Payload");
    await expect(page.getByTestId("weapon-detail-target-perk2")).toContainText("Firefly");

    await page.getByTestId("weapon-detail-mode-pvp").click();

    await expect(page.getByTestId("weapon-detail-god-roll-badge")).toHaveText("PVPPartial50%");
    await expect(page.getByTestId("weapon-detail-target-barrel")).toContainText("Smallbore");
    await expect(page.getByTestId("weapon-detail-target-perk1")).toContainText("Kill Clip");

    await page.getByTestId("weapon-detail-back-button").click();

    await expect(page).toHaveURL(
      new RegExp(
        `/inventory\\?membershipType=3&membershipId=${MOCK_DESTINY_MEMBERSHIP_ID}&characterId=${MOCK_CHARACTER_ID}&mode=pvp`,
      ),
    );
    await expect(page.getByTestId("inventory-page")).toBeVisible();
    await expect(page.getByTestId("inventory-summary")).toHaveText("3 weapons, 1 god roll in PVP");
  });

  test("shows ranked duplicate copies on weapon detail", async ({ page }) => {
    await mockInventoryApi(page, { includeDuplicateFatebringer: true });

    await page.goto(
      `/weapons/${FATEBRINGER_INSTANCE_ID}?membershipType=3&membershipId=${MOCK_DESTINY_MEMBERSHIP_ID}&characterId=${MOCK_CHARACTER_ID}&mode=pvp`,
    );

    await expect(page.getByTestId("weapon-detail-copies")).toBeVisible();
    await expect(page.getByTestId(`weapon-detail-copy-${FATEBRINGER_KEEPER_ID}`)).toContainText(
      "Recommended keeper",
    );
    await expect(page.getByTestId(`weapon-detail-copy-${FATEBRINGER_INSTANCE_ID}`)).toContainText(
      "Dismantle",
    );

    await page.getByTestId(`weapon-detail-copy-${FATEBRINGER_KEEPER_ID}`).click();

    await expect(page.getByTestId(`weapon-detail-${FATEBRINGER_KEEPER_ID}`)).toBeVisible();
    await expect(page.getByTestId("weapon-detail-god-roll-badge")).toHaveText("PVPGod Roll100%");
  });

  test("shows an empty state when no weapons are returned", async ({ page }) => {
    await mockEmptyInventoryApi(page);

    await page.goto("/inventory");

    await expect(page.getByTestId("inventory-empty")).toBeVisible();
    await expect(page.getByTestId("inventory-empty-message")).toContainText(
      "No character or vault weapons",
    );
  });

  test("shows an error state when inventory loading fails", async ({ page }) => {
    await mockErroredInventoryApi(page);

    await page.goto("/inventory");

    await expect(page.getByTestId("inventory-error")).toBeVisible();
    await expect(page.getByTestId("inventory-error-message")).toContainText(
      "The Bungie service is unavailable.",
    );
    await expect(page.getByTestId("inventory-error-retry-button")).toBeVisible();
  });
});
