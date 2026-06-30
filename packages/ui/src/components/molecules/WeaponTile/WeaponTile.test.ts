import type { InventoryWeapon } from "@god-roll-vault/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { WeaponTile } from "./WeaponTile.js";

type TestElementProps = {
  accessibilityLabel?: string;
  children?: ReactNode;
  sourceUri?: string;
  style?: unknown;
  testID?: string;
};

const weapon: InventoryWeapon = {
  itemHash: 1363886209,
  itemInstanceId: "6913529092654216196",
  name: "Fatebringer (Timelost)",
  tier: "Legendary",
  tierType: "legendary",
  power: 1985,
  element: "arc",
  perks: [],
  location: "character",
  bucketHash: 149531261,
  isEquipped: false,
  iconUrl: "https://www.bungie.net/common/destiny2_content/icons/fatebringer.jpg",
  seasonIconUrl: "https://www.bungie.net/common/destiny2_content/icons/season.jpg",
  watermarkIconUrl: "https://www.bungie.net/common/destiny2_content/icons/watermark.jpg",
};

function renderWeaponTile(props: Partial<Parameters<typeof WeaponTile>[0]> = {}) {
  return WeaponTile({ weapon, ...props }) as ReactElement<TestElementProps>;
}

function findByTestID(node: ReactNode, testID: string): ReactElement<TestElementProps> {
  if (isValidElement<TestElementProps>(node)) {
    if (node.props.testID === testID) {
      return node;
    }

    for (const child of Children.toArray(node.props.children)) {
      try {
        return findByTestID(child, testID);
      } catch (error) {
        if (!(error instanceof Error) || !error.message.includes(testID)) {
          throw error;
        }
      }
    }
  }

  throw new Error(`Unable to find testID ${testID}`);
}

function countByTestID(node: ReactNode, testID: string): number {
  if (!isValidElement<TestElementProps>(node)) {
    return 0;
  }

  let count = node.props.testID === testID ? 1 : 0;
  for (const child of Children.toArray(node.props.children)) {
    count += countByTestID(child, testID);
  }

  return count;
}

describe("WeaponTile", () => {
  it("renders DIM-style tile layers with tier diamonds and power bar", () => {
    const tile = renderWeaponTile();
    const tileTestID = `weapon-tile-${weapon.itemInstanceId}`;

    expect(tile.props.testID).toBe(tileTestID);
    expect(flattenStyle(tile.props.style)).toMatchObject({
      backgroundColor: "#522f65",
    });
    expect(findByTestID(tile, `${tileTestID}-weapon-icon`).props.sourceUri).toBe(weapon.iconUrl);
    expect(findByTestID(tile, `${tileTestID}-season-icon`).props.sourceUri).toBe(
      weapon.seasonIconUrl,
    );
    expect(findByTestID(tile, `${tileTestID}-watermark`).props.sourceUri).toBe(
      weapon.watermarkIconUrl,
    );
    expect(textContent(findByTestID(tile, `${tileTestID}-power`))).toBe("1985");
    expect(countByTestID(tile, `${tileTestID}-tier-diamonds`)).toBe(1);
  });

  it("renders shiny overlay when the weapon is shiny", () => {
    const tile = renderWeaponTile({ weapon: { ...weapon, isShiny: true } });
    const tileTestID = `weapon-tile-${weapon.itemInstanceId}`;

    expect(() => findByTestID(tile, `${tileTestID}-shiny-overlay`)).not.toThrow();
  });

  it("uses exotic border styling for exotic weapons", () => {
    const tile = renderWeaponTile({
      weapon: { ...weapon, tier: "Exotic", tierType: "exotic" },
    });

    expect(flattenStyle(tile.props.style)).toMatchObject({
      backgroundColor: "#ceae33",
      borderColor: "#e8c252",
    });
  });
});
