import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Screen } from "./Screen.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

describe("Screen", () => {
  it("renders a full-height themed screen wrapper with testID", () => {
    const screen = Screen({
      children: "Inventory",
      testID: "inventory-page",
    }) as ReactElement<TestElementProps>;

    expect(screen.props.testID).toBe("inventory-page");
    expect(textContent(screen)).toBe("Inventory");
    expect(flattenStyle(screen.props.style)).toMatchObject({
      backgroundColor: "#0b0b14",
      flex: 1,
      minHeight: "100%",
      padding: 16,
    });
  });
});
