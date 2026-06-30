import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "../../atoms/Text/index.js";
import { Screen } from "./Screen.js";

const meta = {
  title: "Templates/Screen",
  component: Screen,
} satisfies Meta<typeof Screen>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: () => (
    <Screen testID="storybook-screen">
      <Text variant="heading">Inventory</Text>
      <Text color="textMuted">Screen template with default background and padding.</Text>
    </Screen>
  ),
};
