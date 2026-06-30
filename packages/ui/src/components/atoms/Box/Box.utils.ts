import type { ViewStyle } from "react-native";

import { resolveSpacing, theme } from "../../../theme/index.js";
import type { BoxProps } from "./Box.types.js";

export function createBoxStyle({
  backgroundColor,
  borderColor,
  margin,
  marginBottom,
  marginHorizontal,
  marginLeft,
  marginRight,
  marginTop,
  marginVertical,
  padding,
  paddingBottom,
  paddingHorizontal,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingVertical,
}: Pick<
  BoxProps,
  | "backgroundColor"
  | "borderColor"
  | "margin"
  | "marginBottom"
  | "marginHorizontal"
  | "marginLeft"
  | "marginRight"
  | "marginTop"
  | "marginVertical"
  | "padding"
  | "paddingBottom"
  | "paddingHorizontal"
  | "paddingLeft"
  | "paddingRight"
  | "paddingTop"
  | "paddingVertical"
>): ViewStyle {
  return {
    backgroundColor: backgroundColor ? theme.colors[backgroundColor] : undefined,
    borderColor: borderColor ? theme.colors[borderColor] : undefined,
    margin: resolveSpacing(margin),
    marginBottom: resolveSpacing(marginBottom),
    marginHorizontal: resolveSpacing(marginHorizontal),
    marginLeft: resolveSpacing(marginLeft),
    marginRight: resolveSpacing(marginRight),
    marginTop: resolveSpacing(marginTop),
    marginVertical: resolveSpacing(marginVertical),
    padding: resolveSpacing(padding),
    paddingBottom: resolveSpacing(paddingBottom),
    paddingHorizontal: resolveSpacing(paddingHorizontal),
    paddingLeft: resolveSpacing(paddingLeft),
    paddingRight: resolveSpacing(paddingRight),
    paddingTop: resolveSpacing(paddingTop),
    paddingVertical: resolveSpacing(paddingVertical),
  };
}
