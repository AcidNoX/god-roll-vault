import { expect, type Page, test } from "@playwright/test";

const baseURL = "https://127.0.0.1:3000";
const MOCK_AUTH_CODE = "e2e-mock-auth-code";
const MOCK_BUNGIE_MEMBERSHIP_ID = "4611686018467427902";
const MOCK_DESTINY_MEMBERSHIP_ID = "4611686018467427903";
const MOCK_CHARACTER_ID = "2305789507540360956";
const FATEBRINGER_INSTANCE_ID = "1000000000000000001";
const AUSTRINGER_INSTANCE_ID = "1000000000000000002";
const BELOVED_INSTANCE_ID = "1000000000000000003";
const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization, Content-Type, X-API-Key",
  "Access-Control-Allow-Methods": "GET, OPTIONS, POST",
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

function createInventoryProfile() {
  return {
    characterInventories: {
      [MOCK_CHARACTER_ID]: {
        items: [
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
        ],
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
            primaryStat: { value: 1980 },
            damageTypeHash: 3373582085,
          },
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
            sockets: [
              { plugHash: 3250034553 },
              { plugHash: 2847525152 },
              { plugHash: 3177301540 },
              { plugHash: 1467527085 },
            ],
          },
          [AUSTRINGER_INSTANCE_ID]: {
            sockets: [
              { plugHash: 839105230 },
              { plugHash: 2847525152 },
              { plugHash: 1015611457 },
              { plugHash: 588594999 },
            ],
          },
          [BELOVED_INSTANCE_ID]: {
            sockets: [
              { plugHash: 4090651448 },
              { plugHash: 2847525152 },
              { plugHash: 957782887 },
              { plugHash: 588594999 },
            ],
          },
        },
      },
    },
  };
}

async function mockBungieFlow(page: Page) {
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

  await page.route("**/Platform/**", async (route) => {
    const url = new URL(route.request().url());

    if (route.request().method() === "OPTIONS") {
      await route.fulfill({
        status: 204,
        headers: CORS_HEADERS,
      });
      return;
    }

    if (url.pathname.endsWith("/Platform/App/OAuth/Token/")) {
      await route.fulfill({
        status: 200,
        headers: CORS_HEADERS,
        contentType: "application/json",
        body: JSON.stringify({
          access_token: "e2e-access-token",
          token_type: "Bearer",
          expires_in: 3600,
          refresh_token: "e2e-refresh-token",
          refresh_expires_in: 7_776_000,
          membership_id: MOCK_BUNGIE_MEMBERSHIP_ID,
        }),
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
        body: JSON.stringify(bungieEnvelope(createInventoryProfile())),
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

test.describe("Login to inventory flow", () => {
  test("logs in with mocked OAuth, selects a character, evaluates inventory, and opens weapon detail", async ({
    page,
  }) => {
    await mockBungieFlow(page);

    await page.goto("/login");
    await page.getByTestId("sign-in-bungie").click();

    await expect(page.getByTestId("character-selector")).toBeVisible();
    await page.getByTestId(`character-card-${MOCK_CHARACTER_ID}`).click();

    await expect(page.getByTestId("inventory-page")).toBeVisible();
    await expect(page).toHaveURL(
      new RegExp(
        `/inventory\\?membershipType=3&membershipId=${MOCK_DESTINY_MEMBERSHIP_ID}&characterId=${MOCK_CHARACTER_ID}`,
      ),
    );
    await expect(page.getByTestId("weapon-inventory-list")).toBeVisible();
    await expect(page.getByTestId("inventory-summary")).toHaveText("3 weapons, 1 god roll in PVE");
    await expect(page.getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-badge`)).toHaveText(
      "God Roll",
    );

    await page.getByTestId("inventory-mode-pvp").click();

    await expect(page.getByTestId("inventory-summary")).toHaveText("3 weapons, 1 god roll in PVP");
    await expect(page.getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}-badge`)).toHaveText(
      "Partial",
    );
    await expect(page.getByTestId(`weapon-card-${AUSTRINGER_INSTANCE_ID}-badge`)).toHaveText(
      "God Roll",
    );

    await page.getByTestId("inventory-mode-pve").click();
    await page.getByTestId(`weapon-card-${FATEBRINGER_INSTANCE_ID}`).click();

    await expect(page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}`)).toBeVisible();
    await expect(page.getByTestId("weapon-detail-title")).toHaveText("Fatebringer (Timelost)");
    await expect(page.getByTestId("weapon-detail-status")).toHaveText(
      "God Roll in PVE (100% match)",
    );
    await expect(
      page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}-perk-list-barrel`),
    ).toContainText("Hammer-Forged Rifling");
    await expect(
      page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}-perk-list-magazine`),
    ).toContainText("Accurized Rounds");
    await expect(
      page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}-perk-list-perk1`),
    ).toContainText("Explosive Payload");
    await expect(
      page.getByTestId(`weapon-detail-${FATEBRINGER_INSTANCE_ID}-perk-list-perk2`),
    ).toContainText("Firefly");
  });
});
