import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "./Text.js";

const meta = {
  title: "Atoms/Text",
  component: Text,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Heading: Story = {
  args: {
    children: "Inventory",
    variant: "heading",
  },
};

export const Body: Story = {
  args: {
    children: "Compare your rolls against curated PVE and PVP god rolls.",
    variant: "body",
  },
};

export const Caption: Story = {
  args: {
    children: "Last synced 2 minutes ago",
    color: "textMuted",
    variant: "caption",
  },
};
