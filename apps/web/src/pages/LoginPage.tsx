import { AppText, Screen, useTheme } from "@god-roll-vault/ui";
import type { CSSProperties } from "react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import { getAuthConfigError } from "../auth/config.js";

export function LoginPage() {
  const { isAuthenticated, isLoading, login } = useAuth();
  const theme = useTheme();
  const [loginError, setLoginError] = useState<string | null>(null);
  const configError = getAuthConfigError();
  const buttonStyle: CSSProperties = {
    backgroundColor: theme.colors.accent.gold,
    border: "none",
    borderRadius: theme.borderRadius.sm,
    color: theme.colors.background,
    cursor: "pointer",
    fontSize: theme.typography.fontSize.body,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.lg,
    padding: `${theme.spacing.md}px ${theme.spacing.xl}px`,
  };
  const errorStyle: CSSProperties = {
    color: theme.colors.accent.red,
    fontSize: 14,
    marginTop: theme.spacing.lg,
    maxWidth: 420,
  };

  if (isLoading) {
    return (
      <Screen testID="auth-loading">
        <AppText testID="auth-loading-text">Loading…</AppText>
      </Screen>
    );
  }

  if (isAuthenticated) {
    return <Navigate replace to="/characters" />;
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
