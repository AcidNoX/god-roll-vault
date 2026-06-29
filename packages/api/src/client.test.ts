import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it } from "vitest";
import characterFixture from "./fixtures/character.json";
import { wrapBungieResponse } from "./fixtures/envelope.js";
import itemFixture from "./fixtures/item.json";
import membershipsFixture from "./fixtures/memberships.json";
import profileFixture from "./fixtures/profile.json";
import { type BungieApiError, BungieClient } from "./index.js";
import { bungieEnvelopeSchema } from "./schemas/envelope.js";
import { userMembershipDataSchema } from "./schemas/memberships.js";

const TEST_BASE_URL = "https://bungie.test/Platform";
const API_KEY = "test-api-key";
const ACCESS_TOKEN = "test-access-token";

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function createClient(overrides: Partial<ConstructorParameters<typeof BungieClient>[0]> = {}) {
  return new BungieClient({
    apiKey: API_KEY,
    baseUrl: TEST_BASE_URL,
    ...overrides,
  });
}

describe("bungieEnvelopeSchema", () => {
  it("parses a success envelope", () => {
    const envelope = bungieEnvelopeSchema(userMembershipDataSchema).parse(
      wrapBungieResponse(membershipsFixture),
    );

    expect(envelope.ErrorCode).toBe(1);
    expect(envelope.Response.destinyMemberships).toHaveLength(1);
    expect(envelope.Response.destinyMemberships[0]?.membershipId).toBe("4611686018467427903");
  });
});

describe("BungieClient", () => {
  it("sends the API key header", async () => {
    let capturedApiKey: string | null = null;

    server.use(
      http.get(`${TEST_BASE_URL}/User/GetMembershipsForCurrentUser/`, ({ request }) => {
        capturedApiKey = request.headers.get("X-API-Key");
        return HttpResponse.json(wrapBungieResponse(membershipsFixture));
      }),
    );

    await createClient().getMembershipsForCurrentUser();

    expect(capturedApiKey).toBe(API_KEY);
  });

  it("sends the bearer token when configured", async () => {
    let capturedAuthorization: string | null = null;

    server.use(
      http.get(`${TEST_BASE_URL}/User/GetMembershipsForCurrentUser/`, ({ request }) => {
        capturedAuthorization = request.headers.get("Authorization");
        return HttpResponse.json(wrapBungieResponse(membershipsFixture));
      }),
    );

    await createClient({ accessToken: ACCESS_TOKEN }).getMembershipsForCurrentUser();

    expect(capturedAuthorization).toBe(`Bearer ${ACCESS_TOKEN}`);
  });

  it("getMembershipsForCurrentUser returns typed membership data", async () => {
    server.use(
      http.get(`${TEST_BASE_URL}/User/GetMembershipsForCurrentUser/`, () =>
        HttpResponse.json(wrapBungieResponse(membershipsFixture)),
      ),
    );

    const memberships = await createClient().getMembershipsForCurrentUser();

    expect(memberships.primaryMembershipId).toBe("4611686018467427903");
    expect(memberships.destinyMemberships[0]?.membershipType).toBe(3);
  });

  it("getProfile requests the expected components", async () => {
    const captured = { url: "" };

    server.use(
      http.get(
        `${TEST_BASE_URL}/Destiny2/:membershipType/Profile/:destinyMembershipId/`,
        ({ request }) => {
          captured.url = request.url;
          return HttpResponse.json(wrapBungieResponse(profileFixture));
        },
      ),
    );

    const profile = await createClient().getProfile(
      3,
      "4611686018467427903",
      [102, 200, 201, 205, 300, 305],
    );

    expect(new URL(captured.url).searchParams.get("components")).toBe("102,200,201,205,300,305");
    expect(profile.characters?.["2305789507540360956"]?.light).toBe(1985);
    expect(profile.itemComponents?.instances?.data["6913529092654216196"]?.primaryStat?.value).toBe(
      1985,
    );
  });

  it("getCharacter returns character inventory data", async () => {
    server.use(
      http.get(
        `${TEST_BASE_URL}/Destiny2/:membershipType/Profile/:destinyMembershipId/Character/:characterId/`,
        () => HttpResponse.json(wrapBungieResponse(characterFixture)),
      ),
    );

    const character = await createClient().getCharacter(
      3,
      "4611686018467427903",
      "2305789507540360956",
    );

    expect(character.character.classType).toBe(0);
    expect(character.characterInventory?.items[0]?.itemHash).toBe(1363886209);
  });

  it("getItem returns item instance and socket data", async () => {
    server.use(
      http.get(
        `${TEST_BASE_URL}/Destiny2/:membershipType/Profile/:destinyMembershipId/Item/:itemInstanceId/`,
        () => HttpResponse.json(wrapBungieResponse(itemFixture)),
      ),
    );

    const item = await createClient().getItem(3, "4611686018467427903", "6913529092654216196");

    expect(item.item.itemHash).toBe(1363886209);
    expect(item.itemComponents?.sockets?.data["6913529092654216196"]?.sockets?.[0]?.plugHash).toBe(
      1467527085,
    );
  });

  it("throws BungieApiError when ErrorCode is not success", async () => {
    server.use(
      http.get(`${TEST_BASE_URL}/User/GetMembershipsForCurrentUser/`, () =>
        HttpResponse.json(
          wrapBungieResponse(membershipsFixture, {
            ErrorCode: 5,
            ErrorStatus: "SystemDisabled",
            Message: "Bungie.net is temporarily offline.",
            ThrottleSeconds: 30,
          }),
        ),
      ),
    );

    await expect(createClient().getMembershipsForCurrentUser()).rejects.toMatchObject({
      name: "BungieApiError",
      errorCode: 5,
      errorStatus: "SystemDisabled",
      message: "Bungie.net is temporarily offline.",
      throttleSeconds: 30,
    } satisfies Partial<BungieApiError>);
  });
});
