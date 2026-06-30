import type { darkTheme, designTokens, theme } from "./theme.js";

type WidenTokenValues<T> = {
  readonly [Key in keyof T]: T[Key] extends string
    ? string
    : T[Key] extends number
      ? number
      : WidenTokenValues<T[Key]>;
};

export type ColorToken = keyof typeof theme.colors;
export type DesignTokens = WidenTokenValues<typeof designTokens>;
export type SpacingToken = keyof typeof theme.spacing;
export type SpacingValue = SpacingToken | number;
export type Theme = WidenTokenValues<typeof darkTheme>;
export type TextVariant = keyof typeof theme.typography;
