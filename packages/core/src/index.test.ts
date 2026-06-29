import { describe, expect, it } from "vitest";
import { add } from "./index";

describe("core smoke test", () => {
  it("adds numbers", () => {
    expect(add(1, 1)).toBe(2);
  });
});
