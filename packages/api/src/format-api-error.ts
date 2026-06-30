import { ZodError } from "zod";

import { OAuthError } from "./auth/errors.js";
import { BungieApiError } from "./errors.js";

const BUNGIE_REAUTH_ERROR_CODES = new Set([99, 2108]);

export function formatApiError(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof BungieApiError) {
    if (BUNGIE_REAUTH_ERROR_CODES.has(error.errorCode)) {
      return "Your Bungie session expired. Sign out and sign in again.";
    }

    return error.message || error.errorStatus;
  }

  if (error instanceof OAuthError) {
    if (error.error === "invalid_grant") {
      return "Your Bungie session expired. Sign out and sign in again.";
    }

    return error.errorDescription ?? error.error;
  }

  if (error instanceof ZodError) {
    return "Received an unexpected response from Bungie.net. Try again in a moment.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}
