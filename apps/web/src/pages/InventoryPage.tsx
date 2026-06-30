import { AppText, Screen, useTheme } from "@god-roll-vault/ui";
import type { CSSProperties } from "react";

import { useAuth } from "../auth/AuthProvider.js";

export function InventoryPage() {
  const { logout, tokens } = useAuth();
  const theme = useTheme();
  const buttonStyle: CSSProperties = {
    backgroundColor: theme.colors.surfaceMuted,
    border: `1px solid ${theme.colors.borderStrong}`,
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.text,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.body,
    marginTop: theme.spacing.lg,
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
  };

  return (
    <Screen testID="inventory-page">
      <AppText testID="inventory-title">Inventory</AppText>
      <AppText testID="inventory-subtitle">Your weapons will appear here.</AppText>
      {tokens?.membershipId ? (
        <AppText testID="inventory-membership-id">Membership: {tokens.membershipId}</AppText>
      ) : null}
      <button
        data-testid="sign-out"
        onClick={() => void logout()}
        style={buttonStyle}
        type="button"
      >
        Sign out
      </button>
    </Screen>
  );
}
