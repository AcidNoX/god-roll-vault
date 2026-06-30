import type { RollMatchPerkDetail, RollMatchResult, WeaponPerks } from "@god-roll-vault/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { designTokens } from "../../../theme/index.js";
import { PerkList } from "./PerkList.js";

type TestElementProps = {
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

const perks: WeaponPerks = {
  barrel: { plugHash: 1, name: "Arrowhead Brake" },
  magazine: { plugHash: 2, name: "Ricochet Rounds" },
  perk1: { plugHash: 3, name: "Kill Clip" },
  perk2: { plugHash: 4, name: "Rampage" },
  originTrait: { plugHash: 5, name: "Nadir Focus" },
};

const matchedDetails: RollMatchPerkDetail[] = [
  {
    slot: "barrel",
    target: "Arrowhead Brake",
    matched: true,
    matchedPerkName: "Arrowhead Brake",
  },
  {
    slot: "magazine",
    target: "Ricochet Rounds",
    matched: true,
    matchedPerkName: "Ricochet Rounds",
  },
  {
    slot: "perk1",
    target: "Kill Clip",
    matched: true,
    matchedPerkName: "Kill Clip",
  },
  {
    slot: "perk2",
    target: "Rampage",
    matched: true,
    matchedPerkName: "Rampage",
  },
];

function makeMatchResult(details: RollMatchPerkDetail[]): RollMatchResult {
  return {
    status: details.every((detail) => detail.matched) ? "perfect" : "partial",
    mode: "pvp",
    weaponHash: 3184068932,
    itemInstanceId: "instance-1",
    score: Math.round((details.filter((detail) => detail.matched).length / details.length) * 100),
    matchedPerks: details.filter((detail) => detail.matched),
    missingPerks: details.filter((detail) => !detail.matched),
    details,
  };
}

function renderPerkList(props: Partial<Parameters<typeof PerkList>[0]> = {}) {
  return PerkList({
    perks,
    matchResult: makeMatchResult(matchedDetails),
    ...props,
  }) as ReactElement<TestElementProps>;
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

describe("PerkList", () => {
  it("renders all perk slots and highlights matched perks green", () => {
    const list = renderPerkList();
    const barrel = findByTestID(list, "perk-list-barrel");
    const originTrait = findByTestID(list, "perk-list-originTrait");

    expect(textContent(barrel)).toBe("BarrelMatchedArrowhead Brake");
    expect(barrel.props.accessibilityLabel).toBe("Barrel: Arrowhead Brake, matched");
    expect(flattenStyle(barrel.props.style)).toMatchObject({
      backgroundColor: designTokens.colors.element.strand.background,
      borderColor: designTokens.colors.element.strand.border,
    });

    expect(textContent(findByTestID(list, "perk-list-magazine"))).toBe("MagMatchedRicochet Rounds");
    expect(textContent(findByTestID(list, "perk-list-perk1"))).toBe("Perk 1MatchedKill Clip");
    expect(textContent(findByTestID(list, "perk-list-perk2"))).toBe("Perk 2MatchedRampage");
    expect(textContent(originTrait)).toBe("Origin TraitEquippedNadir Focus");
    expect(flattenStyle(originTrait.props.style)).toMatchObject({
      backgroundColor: designTokens.colors.surfaceMuted,
      borderColor: designTokens.colors.border,
    });
  });

  it("highlights unmatched perks red and shows the missing target", () => {
    const partialDetails = matchedDetails.map((detail) =>
      detail.slot === "perk2"
        ? {
            slot: "perk2",
            target: "Rampage",
            matched: false,
          }
        : detail,
    );
    const list = renderPerkList({
      perks: {
        ...perks,
        perk2: { plugHash: 99, name: "Explosive Payload" },
      },
      matchResult: makeMatchResult(partialDetails),
    });

    const perk2 = findByTestID(list, "perk-list-perk2");

    expect(textContent(perk2)).toBe("Perk 2MissingExplosive PayloadTarget: Rampage");
    expect(perk2.props.accessibilityLabel).toBe(
      "Perk 2: Explosive Payload, missing, target: rampage",
    );
    expect(flattenStyle(perk2.props.style)).toMatchObject({
      backgroundColor: designTokens.colors.badge.missing.background,
      borderColor: designTokens.colors.badge.missing.border,
    });
  });
});
