import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";

import { Text } from "../Text/index.js";
import { Pressable } from "./Pressable.js";
import { pressableStyles } from "./Pressable.styles.js";

const meta = {
  title: "Atoms/Pressable",
  component: Pressable,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Pressable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Pressable onPress={() => undefined}>
      <Text color="primaryText" variant="caption">
        Retry sync
      </Text>
    </Pressable>
  ),
};

export const Pressed: Story = {
  render: () => (
    <View style={[pressableStyles.base, pressableStyles.pressed]}>
      <Text color="primaryText" variant="caption">
        Pressed appearance
      </Text>
    </View>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Pressable disabled onPress={() => undefined}>
      <Text color="primaryText" variant="caption">
        Disabled action
      </Text>
    </Pressable>
  ),
};
