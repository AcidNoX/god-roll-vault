import { AppText, Screen } from "@god-roll-vault/ui";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import { getAuthConfigError } from "../auth/config.js";

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

const errorStyle: CSSProperties = {
  color: "#ff8a8a",
  fontSize: 14,
  marginTop: 16,
  maxWidth: 420,
};

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);
  const configError = getAuthConfigError();

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
      {configError ? (
        <p data-testid="login-config-error" style={errorStyle}>
          {configError}
        </p>
      ) : null}
      {loginError ? (
        <p data-testid="login-error" style={errorStyle}>
          {loginError}
        </p>
      ) : null}
      <button
        data-testid="sign-in-bungie"
        disabled={configError !== null}
        onClick={() => {
          setLoginError(null);
          void login().catch((error: unknown) => {
            setLoginError(error instanceof Error ? error.message : "Sign-in failed");
          });
        }}
        style={{
          ...buttonStyle,
          cursor: configError ? "not-allowed" : "pointer",
          opacity: configError ? 0.5 : 1,
        }}
        type="button"
      >
        Sign in with Bungie
      </button>
    </Screen>
  );
}
