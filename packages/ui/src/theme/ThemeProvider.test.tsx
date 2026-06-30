import { Children, type ReactElement, type ReactNode } from "react";
import { Text } from "react-native";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../test-utils/componentTree.js";
import { ThemeProvider } from "./ThemeProvider.js";
import { darkTheme } from "./theme.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

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
      minHeight: "100vh",
    });
    expect(textContent(root)).toBe("Vault ready");
  });
});
