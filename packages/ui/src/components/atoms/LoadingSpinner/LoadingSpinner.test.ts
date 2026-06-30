import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle } from "../../../test-utils/componentTree.js";
import { theme } from "../../../theme/index.js";
import { LoadingSpinner } from "./LoadingSpinner.js";

type TestElementProps = {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  children?: ReactNode;
  color?: string;
  size?: string | number;
  style?: unknown;
  testID?: string;
};

function renderLoadingSpinner(props: Parameters<typeof LoadingSpinner>[0]) {
  return LoadingSpinner(props) as ReactElement<TestElementProps>;
}

function onlyChild(node: ReactElement<TestElementProps>) {
  const [child] = Children.toArray(node.props.children);

  if (!isValidElement<TestElementProps>(child)) {
    throw new Error("Expected LoadingSpinner to render an activity indicator");
  }

  return child;
}

describe("LoadingSpinner", () => {
  it("renders a centered progress indicator with a stable testID", () => {
    const spinner = renderLoadingSpinner({ testID: "inventory-loading" });
    const indicator = onlyChild(spinner);

    expect(spinner.props.testID).toBe("inventory-loading");
    expect(spinner.props.accessibilityLabel).toBe("Loading");
    expect(spinner.props.accessibilityRole).toBe("progressbar");
    expect(flattenStyle(spinner.props.style)).toMatchObject({
      alignItems: "center",
      justifyContent: "center",
    });
    expect(indicator.props.color).toBe(theme.colors.primary);
    expect(indicator.props.size).toBe("large");
  });

  it("allows callers to customize the indicator presentation", () => {
    const spinner = renderLoadingSpinner({
      accessibilityLabel: "Refreshing vault",
      color: "#ffffff",
      size: "small",
      testID: "vault-refreshing",
    });
    const indicator = onlyChild(spinner);

    expect(spinner.props.accessibilityLabel).toBe("Refreshing vault");
    expect(indicator.props.color).toBe("#ffffff");
    expect(indicator.props.size).toBe("small");
  });
});
