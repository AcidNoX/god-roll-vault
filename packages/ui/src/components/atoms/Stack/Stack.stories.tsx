import type { Meta, StoryObj } from "@storybook/react";

import { Text } from "../Text/index.js";
import { Stack } from "./Stack.js";

const meta = {
  title: "Atoms/Stack",
  component: Stack,
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {
  render: () => (
    <Stack backgroundColor="surface" direction="vertical" gap="md" padding="lg">
      <Text>First item</Text>
      <Text>Second item</Text>
      <Text>Third item</Text>
    </Stack>
  ),
};

export const Row: Story = {
  render: () => (
    <Stack align="center" backgroundColor="surface" direction="horizontal" gap="lg" padding="lg">
      <Text>Power</Text>
      <Text>Element</Text>
      <Text>Perks</Text>
    </Stack>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Stack backgroundColor="surfaceHover" gap="xl" padding="lg">
      <Text variant="heading">Weapon group</Text>
      <Text color="textMuted">Three copies ranked by god roll match</Text>
    </Stack>
  ),
};
