import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { ErrorState } from "./ErrorState.js";

type TestElementProps = {
  align?: string;
  children?: ReactNode;
  gap?: string;
  onPress?: unknown;
  padding?: string;
  style?: unknown;
  testID?: string;
};

function renderErrorState(props: Parameters<typeof ErrorState>[0]) {
  return ErrorState(props) as ReactElement<TestElementProps>;
}

function childElements(node: ReactElement<TestElementProps>) {
  return Children.toArray(node.props.children).filter(
    (child): child is ReactElement<TestElementProps> => isValidElement<TestElementProps>(child),
  );
}

describe("ErrorState", () => {
  it("renders an error message and retry button with stable testIDs", () => {
    const onRetry = vi.fn();
    const errorState = renderErrorState({
      message: "Unable to load weapons",
      onRetry,
      testID: "inventory-error",
    });
    const [message, retryButton] = childElements(errorState);

    expect(errorState.props.testID).toBe("inventory-error");
    expect(errorState.props.align).toBe("center");
    expect(errorState.props.gap).toBe("md");
    expect(errorState.props.padding).toBe("xl");
    expect(flattenStyle(errorState.props.style)).toMatchObject({ width: "100%" });
    expect(message?.props.testID).toBe("inventory-error-message");
    expect(textContent(message)).toBe("Unable to load weapons");
    expect(retryButton?.props.testID).toBe("inventory-error-retry-button");
    expect(retryButton?.props.onPress).toBe(onRetry);
    expect(textContent(retryButton)).toBe("Try again");
  });

  it("allows callers to customize the retry button label", () => {
    const errorState = renderErrorState({
      message: "Bungie is unavailable",
      onRetry: vi.fn(),
      retryLabel: "Reconnect",
      testID: "bungie-error",
    });

    expect(textContent(errorState)).toBe("Bungie is unavailableReconnect");
  });
});
