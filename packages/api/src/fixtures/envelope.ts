import type { BungieEnvelope } from "../schemas/envelope.js";

export function wrapBungieResponse<T>(
  response: T,
  overrides: Partial<Omit<BungieEnvelope<T>, "Response">> = {},
): BungieEnvelope<T> {
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
