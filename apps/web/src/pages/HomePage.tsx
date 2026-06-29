import { AppText, Screen } from "@god-roll-vault/ui";
import { Navigate } from "react-router-dom";

import { useAuth } from "../auth/AuthProvider.js";

export function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Screen testID="auth-loading">
        <AppText testID="auth-loading-text">Loading…</AppText>
      </Screen>
    );
  }

  return <Navigate replace to={isAuthenticated ? "/inventory" : "/login"} />;
}
