import { Pressable as RNPressable } from "react-native";

import { pressableStyles } from "./Pressable.styles.js";
import type { PressableProps, PressableState } from "./Pressable.types.js";

export function Pressable({
  accessibilityRole = "button",
  children,
  disabled,
  style,
  ...pressableProps
}: PressableProps) {
  return (
    <RNPressable
      {...pressableProps}
      accessibilityRole={accessibilityRole}
      disabled={disabled}
      style={(state) => {
        const pressableState = state as PressableState;

        return [
          pressableStyles.base,
          pressableState.hovered && !disabled ? pressableStyles.hovered : undefined,
          pressableState.pressed && !disabled ? pressableStyles.pressed : undefined,
          disabled ? pressableStyles.disabled : undefined,
          typeof style === "function" ? style(pressableState) : style,
        ];
      }}
    >
      {children}
    </RNPressable>
  );
}
