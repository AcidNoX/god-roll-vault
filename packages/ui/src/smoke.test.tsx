import { render, screen } from "@testing-library/react-native";
import { Text } from "react-native";
import { describe, expect, it } from "vitest";

describe("React Native Testing Library smoke test", () => {
  it("renders React Native text", async () => {
    await render(<Text>Hello</Text>);

    expect(screen.getByText("Hello")).toBeTruthy();
  });
});
