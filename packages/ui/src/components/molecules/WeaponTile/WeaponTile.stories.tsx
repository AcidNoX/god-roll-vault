import type { Meta, StoryObj } from "@storybook/react";

import {
  exoticWeapon,
  legendaryWeapon,
  shinyWeapon,
  weaponWithSeasonArt,
} from "../../../stories/fixtures/weapon-fixtures.js";
import { WeaponTile } from "./WeaponTile.js";

const meta = {
  title: "Molecules/WeaponTile",
  component: WeaponTile,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof WeaponTile>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Legendary: Story = {
  args: {
    weapon: legendaryWeapon,
  },
};

export const Exotic: Story = {
  args: {
    weapon: exoticWeapon,
  },
};

export const Shiny: Story = {
  args: {
    weapon: shinyWeapon,
  },
};

export const WithSeasonArt: Story = {
  args: {
    weapon: weaponWithSeasonArt,
  },
};
