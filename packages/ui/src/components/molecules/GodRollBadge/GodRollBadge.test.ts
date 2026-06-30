import type { GameMode, MatchStatus } from "@god-roll-vault/core";
import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";

import { flattenStyle, textContent } from "../../../test-utils/componentTree.js";
import { designTokens } from "../../../theme/index.js";
import { GodRollBadge } from "./GodRollBadge.js";

type TestElementProps = {
  accessibilityLabel?: string;
  children?: ReactNode;
  style?: unknown;
  testID?: string;
};

type BadgeCase = {
  accessibilityLabel: string;
  backgroundColor: string;
  borderColor: string;
  borderStyle?: string;
  mode: GameMode;
  score?: number;
  status: MatchStatus;
  textColor: string;
  textValue: string;
};

function renderGodRollBadge(props: Parameters<typeof GodRollBadge>[0]) {
  return GodRollBadge(props) as ReactElement<TestElementProps>;
}

function textChildren(node: ReactElement<TestElementProps>): ReactElement<TestElementProps>[] {
  return Children.toArray(node.props.children).filter(
    (child): child is ReactElement<TestElementProps> => isValidElement<TestElementProps>(child),
  );
}

describe("GodRollBadge", () => {
  it.each([
    {
      accessibilityLabel: "PVE perfect god roll match, score 100 percent",
      backgroundColor: designTokens.colors.badge.perfect.background,
      borderColor: designTokens.colors.badge.perfect.border,
      mode: "pve",
      score: 100,
      status: "perfect",
      textColor: designTokens.colors.badge.perfect.text,
      textValue: "PVEGod Roll100%",
    },
    {
      accessibilityLabel: "PVP partial god roll match, score 67 percent",
      backgroundColor: designTokens.colors.badge.partial.background,
      borderColor: designTokens.colors.badge.partial.border,
      mode: "pvp",
      score: 66.7,
      status: "partial",
      textColor: designTokens.colors.badge.partial.text,
      textValue: "PVPPartial67%",
    },
    {
      accessibilityLabel: "PVE missing god roll match",
      backgroundColor: designTokens.colors.surfaceMuted,
      borderColor: designTokens.colors.borderStrong,
      mode: "pve",
      status: "missing",
      textColor: designTokens.colors.textMuted,
      textValue: "PVEMissing",
    },
    {
      accessibilityLabel: "PVP unknown god roll match",
      backgroundColor: designTokens.colors.badge.unknown.background,
      borderColor: designTokens.colors.badge.unknown.border,
      borderStyle: "dotted",
      mode: "pvp",
      status: "unknown",
      textColor: designTokens.colors.badge.unknown.text,
      textValue: "PVPUnknown",
    },
  ] satisfies BadgeCase[])("renders $status status with its visual variant and accessible label", ({
    accessibilityLabel,
    backgroundColor,
    borderColor,
    borderStyle,
    mode,
    score,
    status,
    textColor,
    textValue,
  }) => {
    const badge = renderGodRollBadge({ mode, score, status });

    expect(badge.props.testID).toBe(`god-roll-badge-${mode}-${status}`);
    expect(badge.props.accessibilityLabel).toBe(accessibilityLabel);
    expect(textContent(badge)).toBe(textValue);
    expect(flattenStyle(badge.props.style)).toMatchObject({
      backgroundColor,
      borderColor,
      ...(borderStyle ? { borderStyle } : {}),
    });

    for (const textChild of textChildren(badge)) {
      expect(flattenStyle(textChild.props.style)).toMatchObject({ color: textColor });
    }
  });

  it("allows callers to supply a stable testID", () => {
    const badge = renderGodRollBadge({
      mode: "pve",
      status: "perfect",
      testID: "fatebringer-pve-badge",
    });

    expect(badge.props.testID).toBe("fatebringer-pve-badge");
  });
});
