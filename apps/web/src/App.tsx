import { PROJECT_NAME } from "@god-roll-vault/core";
import { AppText, Screen } from "@god-roll-vault/ui";

export function App() {
  return (
    <Screen testID="app-root">
      <AppText testID="app-title">God Roll Vault</AppText>
      <AppText testID="app-subtitle">{PROJECT_NAME} web app</AppText>
    </Screen>
  );
}
