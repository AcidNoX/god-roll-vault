import { describe, expect, it } from "vitest";
import { ZodError } from "zod";

import { OAuthError } from "./auth/errors.js";
import { BungieApiError } from "./errors.js";
import { formatApiError } from "./format-api-error.js";

describe("formatApiError", () => {
  it("maps Bungie auth errors to a re-login message", () => {
    const message = formatApiError(
      new BungieApiError(
        2108,
        "WebAuthRequired",
        "Authentication is required to call this function.",
        0,
        {},
      ),
    );

    expect(message).toBe("Your Bungie session expired. Sign out and sign in again.");
  });

  it("uses the Bungie message for other API errors", () => {
    const message = formatApiError(
      new BungieApiError(5, "SystemDisabled", "Bungie.net is temporarily offline.", 30, {}),
    );

    expect(message).toBe("Bungie.net is temporarily offline.");
  });

  it("maps OAuth invalid_grant to a re-login message", () => {
    const message = formatApiError(
      new OAuthError(
        401,
        "invalid_grant",
        "Access token expired and no refresh token is available",
      ),
    );

    expect(message).toBe("Your Bungie session expired. Sign out and sign in again.");
  });

  it("hides Zod validation details", () => {
    const message = formatApiError(new ZodError([]));

    expect(message).toBe("Received an unexpected response from Bungie.net. Try again in a moment.");
  });
});
