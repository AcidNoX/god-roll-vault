import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Text } from "./Text.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

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
