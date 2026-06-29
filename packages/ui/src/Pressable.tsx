import type { ReactNode } from "react";
import type { PressableProps as RNPressableProps, StyleProp, ViewStyle } from "react-native";
import { Pressable as RNPressable } from "react-native";

import { theme } from "./theme.js";

type PressableState = {
  focused?: boolean;
  hovered?: boolean;
  pressed: boolean;
};

export type PressableProps = Omit<RNPressableProps, "style"> & {
  children?: ReactNode | ((state: PressableState) => ReactNode);
  style?: StyleProp<ViewStyle> | ((state: PressableState) => StyleProp<ViewStyle>);
};

const styles = {
  base: {
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  } satisfies ViewStyle,
  disabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.6,
  } satisfies ViewStyle,
  hovered: {
    backgroundColor: theme.colors.primaryHover,
  } satisfies ViewStyle,
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  } satisfies ViewStyle,
};

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
          styles.base,
          pressableState.hovered && !disabled ? styles.hovered : undefined,
          pressableState.pressed && !disabled ? styles.pressed : undefined,
          disabled ? styles.disabled : undefined,
          typeof style === "function" ? style(pressableState) : style,
        ];
      }}
    >
      {children}
    </RNPressable>
  );
}
