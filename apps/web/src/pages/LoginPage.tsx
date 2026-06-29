import { AppText, Screen } from "@god-roll-vault/ui";
import type { CSSProperties } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";

const buttonStyle: CSSProperties = {
  backgroundColor: "#e8a317",
  border: "none",
  borderRadius: 4,
  color: "#0b0b14",
  cursor: "pointer",
  fontSize: 16,
  fontWeight: 600,
  marginTop: 16,
  padding: "12px 24px",
};

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <Screen testID="auth-loading">
        <AppText testID="auth-loading-text">Loading…</AppText>
      </Screen>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/inventory" />;
  }

  return (
    <Screen testID="login-page">
      <AppText testID="login-title">God Roll Vault</AppText>
      <AppText testID="login-subtitle">Sign in to view your inventory</AppText>
      <button
        data-testid="sign-in-bungie"
        onClick={() => void login()}
        style={buttonStyle}
        type="button"
      >
        Sign in with Bungie
      </button>
    </Screen>
  );
}
