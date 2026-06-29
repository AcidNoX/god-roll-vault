import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { Text } from "react-native";
import { describe, expect, it } from "vitest";

import { darkTheme, ThemeProvider } from "./theme.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) {
    return {};
  }

  if (Array.isArray(style)) {
    const merged: Record<string, unknown> = {};

    for (const stylePart of style) {
      Object.assign(merged, flattenStyle(stylePart));
    }

    return merged;
  }

  if (typeof style === "object") {
    return style as Record<string, unknown>;
  }

  return {};
}

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join("");
  }

  if (isValidElement<TestElementProps>(node)) {
    return textContent(node.props.children);
  }

  return "";
}

describe("ThemeProvider", () => {
  it("renders children with the dark theme background color", () => {
    const provider = ThemeProvider({
      children: <Text>Vault ready</Text>,
    }) as ReactElement<TestElementProps>;
    const root = Children.only(provider.props.children) as ReactElement<TestElementProps>;

    expect(root.props.testID).toBe("theme-provider");
    expect(flattenStyle(root.props.style)).toMatchObject({
      backgroundColor: darkTheme.colors.background,
      flex: 1,
      minHeight: "100%",
    });
    expect(textContent(root)).toBe("Vault ready");
  });
});
