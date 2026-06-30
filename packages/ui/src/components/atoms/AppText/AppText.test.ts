import type { ReactElement, ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { textContent } from "../../../test-utils/componentTree.js";
import { AppText } from "./AppText.js";

type TestElementProps = {
  children?: ReactNode;
  testID?: string;
};

describe("AppText", () => {
  it("renders app text through the Text atom with testID", () => {
    const appText = AppText({
      children: "God Roll Vault",
      testID: "app-title",
    }) as ReactElement<TestElementProps>;

    expect(appText.props.testID).toBe("app-title");
    expect(textContent(appText)).toBe("God Roll Vault");
  });
});
