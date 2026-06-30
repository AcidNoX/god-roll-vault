import { theme } from "./theme.js";
import type { SpacingValue } from "./theme.types.js";

export function resolveSpacing(value: SpacingValue | undefined) {
  if (value === undefined) {
    return undefined;
  }

  return typeof value === "number" ? value : theme.spacing[value];
}
