import type { Meta, StoryObj } from "@storybook/react";

import { EmptyState } from "./EmptyState.js";

const meta = {
  title: "Molecules/EmptyState",
  component: EmptyState,
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: "!",
    message: "No weapons found in this character's inventory.",
    testID: "inventory-empty",
  },
};

export const FilteredResults: Story = {
  args: {
    icon: "◎",
    message: "No rolls match your filters. Try clearing search or changing the game mode.",
    testID: "filtered-empty",
  },
};
