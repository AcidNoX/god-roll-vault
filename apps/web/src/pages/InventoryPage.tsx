import { AppText, Screen } from "@god-roll-vault/ui";
import type { CSSProperties } from "react";

import { useAuth } from "../auth/AuthProvider.js";

const buttonStyle: CSSProperties = {
  backgroundColor: "#3a3a4a",
  border: "none",
  borderRadius: 4,
  color: "#f5f5f5",
  cursor: "pointer",
  fontSize: 16,
  marginTop: 16,
  padding: "12px 24px",
};

export function InventoryPage() {
  const { logout, tokens } = useAuth();

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
