import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";

import { legendaryWeapon, makeMatchResult } from "../../../stories/fixtures/weapon-fixtures.js";
import { WeaponCard } from "./WeaponCard.js";

const meta = {
  title: "Molecules/WeaponCard",
  component: WeaponCard,
} satisfies Meta<typeof WeaponCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    weapon: legendaryWeapon,
    onPress: fn(),
  },
};

export const GodRollBadge: Story = {
  args: {
    weapon: legendaryWeapon,
    matchResult: makeMatchResult("perfect", legendaryWeapon),
    onPress: fn(),
  },
};

export const DuplicateDisposition: Story = {
  args: {
    weapon: legendaryWeapon,
    matchResult: makeMatchResult("partial", legendaryWeapon),
    disposition: "dismantle",
    onPress: fn(),
  },
};
