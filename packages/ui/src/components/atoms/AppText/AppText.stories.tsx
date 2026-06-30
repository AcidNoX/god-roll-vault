import type { Meta, StoryObj } from "@storybook/react";

import { AppText } from "./AppText.js";

const meta = {
  title: "Atoms/AppText",
  component: AppText,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof AppText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "God Roll Vault",
  },
};

export const WithTestId: Story = {
  args: {
    children: "Inventory label",
    testID: "app-text-inventory",
  },
};
