import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Box } from "./Box.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

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
