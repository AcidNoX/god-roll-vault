import type { InventoryWeapon, MatchStatus, RollMatchResult } from "@god-roll-vault/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { designTokens } from "../../../theme/index.js";
import { WeaponCard } from "./WeaponCard.js";

type TestElementProps = {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: unknown;
  sourceUri?: string;
  style?: unknown;
  testID?: string;
  weapon?: InventoryWeapon;
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
};

function makeMatchResult(status: MatchStatus): RollMatchResult {
  return {
    status,
    mode: "pve",
    weaponHash: weapon.itemHash,
    itemInstanceId: weapon.itemInstanceId,
    score: status === "perfect" ? 100 : 0,
    matchedPerks: [],
    missingPerks: [],
    details: [],
  };
}

function renderWeaponCard(props: Partial<Parameters<typeof WeaponCard>[0]> = {}) {
  return WeaponCard({ weapon, ...props }) as ReactElement<TestElementProps>;
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

function getWeaponTileElement(card: ReactElement<TestElementProps>, cardTestID: string) {
  const tileContainer = findByTestID(card, `${cardTestID}-tile`);
  const weaponTile = Children.toArray(tileContainer.props.children).find(
    (child): child is ReactElement<TestElementProps> =>
      isValidElement<TestElementProps>(child) && child.props.testID === `${cardTestID}-weapon-tile`,
  );

  if (!weaponTile) {
    throw new Error(`Unable to find WeaponTile in ${cardTestID}`);
  }

  return weaponTile;
}

describe("WeaponCard", () => {
  it("renders compact weapon details with a DIM-style tile and no badge without roll data", () => {
    const card = renderWeaponCard();
    const cardTestID = `weapon-card-${weapon.itemInstanceId}`;
    const weaponTile = getWeaponTileElement(card, cardTestID);

    expect(card.props.testID).toBe(cardTestID);
    expect(textContent(findByTestID(card, `${cardTestID}-name`))).toBe("Fatebringer (Timelost)");
    expect(weaponTile.props.weapon?.power).toBe(1985);

    expect(() => findByTestID(card, `${cardTestID}-badge`)).toThrow(
      `Unable to find testID ${cardTestID}-badge`,
    );
  });

  it("renders a weapon icon image inside the tile when an asset URL is available", () => {
    const iconUrl = "https://www.bungie.net/common/destiny2_content/icons/fatebringer.jpg";
    const card = renderWeaponCard({ weapon: { ...weapon, iconUrl } });
    const cardTestID = `weapon-card-${weapon.itemInstanceId}`;
    const weaponTile = getWeaponTileElement(card, cardTestID);

    expect(weaponTile.props.weapon?.iconUrl).toBe(iconUrl);
  });

  it("wires optional press behavior as an accessible button", () => {
    const onPress = vi.fn();
    const card = renderWeaponCard({ onPress });

    expect(card.props.accessibilityRole).toBe("button");
    expect(card.props.disabled).toBe(false);
    expect(card.props.onPress).toBe(onPress);
  });

  it.each([
    [
      "perfect",
      "God Roll",
      designTokens.colors.badge.perfect.background,
      designTokens.colors.badge.perfect.border,
    ],
    [
      "partial",
      "Partial",
      designTokens.colors.badge.partial.background,
      designTokens.colors.badge.partial.border,
    ],
    [
      "missing",
      "Missing",
      designTokens.colors.badge.missing.background,
      designTokens.colors.badge.missing.border,
    ],
  ] satisfies [
    MatchStatus,
    string,
    string,
    string,
  ][])("renders %s badge color and label", (status, label, backgroundColor, borderColor) => {
    const card = renderWeaponCard({ matchResult: makeMatchResult(status) });
    const badge = findByTestID(card, `weapon-card-${weapon.itemInstanceId}-badge`);

    expect(textContent(badge)).toBe(label);
    expect(flattenStyle(badge.props.style)).toMatchObject({
      backgroundColor,
      borderColor,
    });
  });
});
