import type { Meta, StoryObj } from "@storybook/react";

import {
  matchedPerkListResult,
  partialPerkListResult,
  partialPerks,
  samplePerks,
} from "../../../stories/fixtures/weapon-fixtures.js";
import { PerkList } from "./PerkList.js";

const meta = {
  title: "Molecules/PerkList",
  component: PerkList,
} satisfies Meta<typeof PerkList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MatchedPerks: Story = {
  args: {
    perks: samplePerks,
    matchResult: matchedPerkListResult,
  },
};

export const UnmatchedPerks: Story = {
  args: {
    perks: partialPerks,
    matchResult: partialPerkListResult,
  },
};
