import { describe, expect, it } from "vitest";

import { Image } from "./Image.js";

describe("Image", () => {
  it("maps a source URI to the React Native image source shape", () => {
    const image = Image({
      accessibilityLabel: "Fatebringer icon",
      sourceUri: "https://www.bungie.net/common/example.png",
      testID: "weapon-icon",
    });

    expect(image.props.accessibilityLabel).toBe("Fatebringer icon");
    expect(image.props.source).toEqual({ uri: "https://www.bungie.net/common/example.png" });
    expect(image.props.testID).toBe("weapon-icon");
  });
});
