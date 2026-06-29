import { describe, expect, it } from "vitest";
import { defineNodeTestConfig } from "./node";

describe("defineNodeTestConfig", () => {
  it("returns a vitest config with node environment", () => {
    const config = defineNodeTestConfig();
    expect(config.test?.environment).toBe("node");
  });
});
