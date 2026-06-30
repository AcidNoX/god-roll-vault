import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "../Text/index.js";
import { Box } from "./Box.js";

const meta = {
  title: "Atoms/Box",
  component: Box,
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Box padding="lg">
      <Text>Default box with padding</Text>
    </Box>
  ),
};

export const WithBackground: Story = {
  render: () => (
    <Box backgroundColor="surfaceHover" padding="lg">
      <Text>Raised surface background</Text>
    </Box>
  ),
};

export const WithPadding: Story = {
  render: () => (
    <Box backgroundColor="surface" borderColor="border" padding="xl" style={{ borderWidth: 1 }}>
      <Text>Extra padding on a bordered surface</Text>
    </Box>
  ),
};
