import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { Text } from "../../atoms/index.js";
import { EmptyState } from "./EmptyState.js";

type TestElementProps = {
  align?: string;
  children?: ReactNode;
  gap?: string;
  padding?: string;
  style?: unknown;
  testID?: string;
};

function renderEmptyState(props: Parameters<typeof EmptyState>[0]) {
  return EmptyState(props) as ReactElement<TestElementProps>;
}

function childElements(node: ReactElement<TestElementProps>) {
  return Children.toArray(node.props.children).filter(
    (child): child is ReactElement<TestElementProps> => isValidElement<TestElementProps>(child),
  );
}

describe("EmptyState", () => {
  it("renders an icon and message with stable testIDs", () => {
    const emptyState = renderEmptyState({
      icon: "!",
      message: "No weapons found",
      testID: "inventory-empty",
    });
    const [icon, message] = childElements(emptyState);

    expect(emptyState.props.testID).toBe("inventory-empty");
    expect(emptyState.props.align).toBe("center");
    expect(emptyState.props.gap).toBe("sm");
    expect(emptyState.props.padding).toBe("xl");
    expect(flattenStyle(emptyState.props.style)).toMatchObject({ width: "100%" });
    expect(icon?.props.testID).toBe("inventory-empty-icon");
    expect(textContent(icon)).toBe("!");
    expect(message?.props.testID).toBe("inventory-empty-message");
    expect(textContent(message)).toBe("No weapons found");
  });

  it("allows callers to supply a composed icon node", () => {
    const emptyState = renderEmptyState({
      icon: <Text testID="custom-empty-icon">Vault</Text>,
      message: "No rolls match your filters",
      testID: "filtered-empty",
    });

    expect(textContent(emptyState)).toBe("VaultNo rolls match your filters");
  });
});
