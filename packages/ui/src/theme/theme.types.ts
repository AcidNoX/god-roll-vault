import type { theme } from "./theme.js";

export type ColorToken = keyof typeof theme.colors;
export type SpacingToken = keyof typeof theme.spacing;
export type SpacingValue = SpacingToken | number;
export type TextVariant = keyof typeof theme.typography;
