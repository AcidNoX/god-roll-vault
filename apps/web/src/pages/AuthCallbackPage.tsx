import { AppText, Screen } from "@god-roll-vault/ui";
import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";
import { runOAuthCallbackOnce } from "../auth/oauth-callback-guard.js";

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const { completeLogin } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      setError(searchParams.get("error_description") ?? oauthError);
      return;
    }

    if (!code || !state) {
      setError("Missing authorization code or state");
      return;
    }

    const authCode = code;
    const authState = state;

    let cancelled = false;

    void runOAuthCallbackOnce(authState, authCode, () => completeLogin(authCode, authState))
      .then(() => {
        if (!cancelled) {
          setCompleted(true);
        }
      })
      .catch((exchangeError: unknown) => {
        if (!cancelled) {
          setError(exchangeError instanceof Error ? exchangeError.message : "Sign in failed");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [searchParams, completeLogin]);

  if (completed) {
    return <Navigate replace to="/inventory" />;
  }

  if (error) {
    return (
      <Screen testID="auth-callback-error">
        <AppText testID="auth-callback-error-text">{error}</AppText>
      </Screen>
    );
  }

  return (
    <Screen testID="auth-callback-loading">
      <AppText testID="auth-callback-loading-text">Signing in…</AppText>
    </Screen>
  );
}
