import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { ErrorState } from "./ErrorState.js";

const meta = {
  title: "Molecules/ErrorState",
  component: ErrorState,
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    message: "We couldn't load your inventory. Check your connection and try again.",
    onRetry: fn(),
    testID: "inventory-error",
  },
};

export const WithRetryAction: Story = {
  args: {
    message: "Bungie.net is temporarily unavailable.",
    onRetry: fn(),
    retryLabel: "Reload inventory",
    testID: "bungie-error",
  },
};
