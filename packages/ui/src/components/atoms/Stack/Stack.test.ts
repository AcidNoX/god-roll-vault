import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Stack } from "./Stack.js";

type TestElementProps = {
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

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
