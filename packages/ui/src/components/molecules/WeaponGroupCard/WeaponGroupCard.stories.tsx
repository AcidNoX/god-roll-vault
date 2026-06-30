import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { duplicateGroup, singleCopyGroup } from "../../../stories/fixtures/weapon-fixtures.js";
import { WeaponGroupCard } from "./WeaponGroupCard.js";

const meta = {
  title: "Molecules/WeaponGroupCard",
  component: WeaponGroupCard,
} satisfies Meta<typeof WeaponGroupCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleCopy: Story = {
  args: {
    group: singleCopyGroup,
    onSelectInstance: fn(),
  },
};

export const DuplicateGroup: Story = {
  args: {
    group: duplicateGroup,
    onSelectInstance: fn(),
  },
};
