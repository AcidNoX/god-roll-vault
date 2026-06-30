import type { Meta, StoryObj } from "@storybook/react";

import { legendaryWeapon } from "../../../stories/fixtures/weapon-fixtures.js";
import { Image } from "./Image.js";

const meta = {
  title: "Atoms/Image",
  component: Image,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithSourceUri: Story = {
  args: {
    sourceUri: legendaryWeapon.iconUrl ?? "",
    accessibilityLabel: "Fatebringer icon",
    style: { width: 64, height: 64 },
  },
};

export const BrokenSource: Story = {
  args: {
    sourceUri: "https://example.invalid/missing-weapon-icon.png",
    accessibilityLabel: "Missing weapon icon",
    style: { width: 64, height: 64, backgroundColor: "#29213d" },
  },
};
