import type { Meta, StoryObj } from "@storybook/react";

import { LoadingSpinner } from "./LoadingSpinner.js";

const meta = {
  title: "Atoms/LoadingSpinner",
  component: LoadingSpinner,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof LoadingSpinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const Small: Story = {
  args: {
    size: "small",
    testID: "loading-spinner-small",
  },
};
