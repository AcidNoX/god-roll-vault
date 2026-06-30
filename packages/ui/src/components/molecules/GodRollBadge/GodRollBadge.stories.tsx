import type { Meta, StoryObj } from "@storybook/react";

import { GodRollBadge } from "./GodRollBadge.js";

const meta = {
  title: "Molecules/GodRollBadge",
  component: GodRollBadge,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof GodRollBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Perfect: Story = {
  args: {
    mode: "pve",
    status: "perfect",
    score: 100,
  },
};

export const Partial: Story = {
  args: {
    mode: "pvp",
    status: "partial",
    score: 67,
  },
};

export const Missing: Story = {
  args: {
    mode: "pve",
    status: "missing",
  },
};
