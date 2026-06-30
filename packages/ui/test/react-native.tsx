import { type ComponentProps, createElement, type ReactNode } from "react";

type HostProps = Record<string, unknown> & {
  children?: ReactNode;
};

function createHostComponent(name: string) {
  return function HostComponent({ children, ...props }: HostProps) {
    return createElement(name, props, children);
  };
}

export type GestureResponderEvent = unknown;
export type TextStyle = Record<string, unknown>;
export type ViewStyle = Record<string, unknown>;

export const Text = createHostComponent("Text");
export const View = createHostComponent("View");
export const Platform = {
  OS: "web",
  select<T>(specifics: Partial<Record<string, T>> & { default?: T }) {
    return specifics.web ?? specifics.default;
  },
};
export const Pressable = ({
  children,
  disabled,
  onPress,
  style,
  ...props
}: HostProps & {
  disabled?: boolean;
  onPress?: (event: GestureResponderEvent) => void;
  style?: unknown;
}) => {
  const resolvedStyle =
    typeof style === "function" ? style({ pressed: false, hovered: false, focused: false }) : style;

  return createElement(
    "Pressable",
    {
      ...props,
      disabled,
      onPress,
      style: resolvedStyle,
    },
    children,
  );
};

export const StyleSheet = {
  flatten(style: unknown): Record<string, unknown> {
    if (!style) {
      return {};
    }

    if (Array.isArray(style)) {
      return Object.assign({}, ...style.map((stylePart) => StyleSheet.flatten(stylePart)));
    }

    if (typeof style === "object") {
      return style as Record<string, unknown>;
    }

    return {};
  },
};

export type TextProps = ComponentProps<typeof Text>;
export type ViewProps = ComponentProps<typeof View>;
