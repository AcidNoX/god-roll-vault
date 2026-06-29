import type { InventoryWeapon, MatchStatus, RollMatchResult } from "@god-roll-vault/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { WeaponCard } from "./WeaponCard.js";

type TestElementProps = {
  accessibilityLabel?: string;
  accessibilityRole?: string;
  children?: ReactNode;
  disabled?: boolean;
  onPress?: unknown;
  style?: unknown;
  testID?: string;
};

const weapon: InventoryWeapon = {
  itemHash: 1363886209,
  itemInstanceId: "6913529092654216196",
  name: "Fatebringer (Timelost)",
  tier: "Legendary",
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

function textContent(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(textContent).join("");
  }

  if (isValidElement<TestElementProps>(node)) {
    return textContent(node.props.children);
  }

  return "";
}

function flattenStyle(style: unknown): Record<string, unknown> {
  if (!style) {
    return {};
  }

  if (Array.isArray(style)) {
    return style.reduce<Record<string, unknown>>(
      (merged, stylePart) => ({ ...merged, ...flattenStyle(stylePart) }),
      {},
    );
  }

  if (typeof style === "object") {
    return style as Record<string, unknown>;
  }

  return {};
}

describe("WeaponCard", () => {
  it("renders compact weapon details with an element icon and default unknown badge", () => {
    const card = renderWeaponCard();
    const cardTestID = `weapon-card-${weapon.itemInstanceId}`;

    expect(card.props.testID).toBe(cardTestID);
    expect(textContent(findByTestID(card, `${cardTestID}-name`))).toBe("Fatebringer (Timelost)");
    expect(textContent(findByTestID(card, `${cardTestID}-power`))).toBe("Power 1985");

    const elementIcon = findByTestID(card, `${cardTestID}-element-icon`);
    expect(elementIcon.props.accessibilityLabel).toBe("Arc element");
    expect(textContent(elementIcon)).toBe("A");

    expect(textContent(findByTestID(card, `${cardTestID}-badge`))).toBe("Unknown");
  });

  it("wires optional press behavior as an accessible button", () => {
    const onPress = vi.fn();
    const card = renderWeaponCard({ onPress });

    expect(card.props.accessibilityRole).toBe("button");
    expect(card.props.disabled).toBe(false);
    expect(card.props.onPress).toBe(onPress);
  });

  it.each([
    ["perfect", "God Roll", "#123524", "#2ecc71"],
    ["partial", "Partial", "#3a2f12", "#f5c542"],
    ["missing", "Missing", "#3a1717", "#ff6b6b"],
    ["unknown", "Unknown", "#282836", "#5f6472"],
  ] satisfies [MatchStatus, string, string, string][])(
    "renders %s badge color and label",
    (status, label, backgroundColor, borderColor) => {
      const card = renderWeaponCard({ matchResult: makeMatchResult(status) });
      const badge = findByTestID(card, `weapon-card-${weapon.itemInstanceId}-badge`);

      expect(textContent(badge)).toBe(label);
      expect(flattenStyle(badge.props.style)).toMatchObject({
        backgroundColor,
        borderColor,
      });
    },
  );
});
