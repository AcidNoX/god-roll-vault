import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { Box } from "./Box.js";
import { Pressable } from "./Pressable.js";
import { Stack } from "./Stack.js";
import { Text } from "./Text.js";

type TestElementProps = {
  accessibilityRole?: string;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: unknown;
  style?: unknown;
  testID?: string;
};

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

function renderStyleCallback(
  style: unknown,
  state: { hovered?: boolean; pressed: boolean },
): Record<string, unknown> {
  if (typeof style !== "function") {
    throw new Error("Expected a style callback");
  }

  return flattenStyle(style(state));
}

describe("Box", () => {
  it("renders a themed View wrapper with spacing tokens and testID", () => {
    const box = Box({
      backgroundColor: "surface",
      borderColor: "border",
      children: "Vault",
      marginHorizontal: "sm",
      padding: "lg",
      testID: "vault-box",
    }) as ReactElement<TestElementProps>;

    expect(box.props.testID).toBe("vault-box");
    expect(textContent(box)).toBe("Vault");
    expect(flattenStyle(box.props.style)).toMatchObject({
      backgroundColor: "#151520",
      borderColor: "#2a2a3a",
      marginHorizontal: 8,
      padding: 16,
    });
  });
});

describe("Text", () => {
  it("renders themed typography variants with color tokens and testID", () => {
    const text = Text({
      children: "God Roll Vault",
      color: "textMuted",
      testID: "vault-heading",
      variant: "heading",
    }) as ReactElement<TestElementProps>;

    expect(text.props.testID).toBe("vault-heading");
    expect(textContent(text)).toBe("God Roll Vault");
    expect(flattenStyle(text.props.style)).toMatchObject({
      color: "#b9bbc9",
      fontSize: 24,
      fontWeight: "700",
      lineHeight: 32,
    });
  });
});

describe("Pressable", () => {
  it("renders an accessible button-like pressable with testID and press handler", () => {
    const onPress = vi.fn();
    const pressable = Pressable({
      children: "Save",
      onPress,
      testID: "save-roll",
    }) as ReactElement<TestElementProps>;

    expect(pressable.props.accessibilityRole).toBe("button");
    expect(pressable.props.onPress).toBe(onPress);
    expect(pressable.props.testID).toBe("save-roll");
    expect(textContent(pressable.props.children)).toBe("Save");
  });

  it("applies web hover and pressed state styles", () => {
    const pressable = Pressable({
      children: "Save",
      testID: "save-roll",
    }) as ReactElement<TestElementProps>;

    expect(
      renderStyleCallback(pressable.props.style, { hovered: false, pressed: false }),
    ).toMatchObject({
      backgroundColor: "#8b5cf6",
      minHeight: 44,
      paddingHorizontal: 16,
    });
    expect(
      renderStyleCallback(pressable.props.style, { hovered: true, pressed: false }),
    ).toMatchObject({
      backgroundColor: "#7c3aed",
    });
    expect(
      renderStyleCallback(pressable.props.style, { hovered: false, pressed: true }),
    ).toMatchObject({
      opacity: 0.82,
    });
  });
});

describe("Stack", () => {
  it("renders horizontal and vertical layout helpers with tokenized gaps and testID", () => {
    const stack = Stack({
      align: "center",
      children: "Inventory",
      direction: "horizontal",
      gap: "xl",
      justify: "space-between",
      testID: "inventory-row",
      wrap: true,
    }) as ReactElement<TestElementProps>;

    expect(stack.props.testID).toBe("inventory-row");
    expect(textContent(stack)).toBe("Inventory");
    expect(flattenStyle(stack.props.style)).toMatchObject({
      alignItems: "center",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 24,
      justifyContent: "space-between",
    });
  });
});
