import type { ReactElement, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Pressable } from "./Pressable.js";

type TestElementProps = {
  accessibilityRole?: string;
  children?: ReactNode;
  onPress?: unknown;
  style?: unknown;
  testID?: string;
};

function renderStyleCallback(
  style: unknown,
  state: { hovered?: boolean; pressed: boolean },
): Record<string, unknown> {
  if (typeof style !== "function") {
    throw new Error("Expected a style callback");
  }

  return flattenStyle(style(state));
}

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
