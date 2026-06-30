# @god-roll-vault/ui

Cross-platform React Native component library for God Roll Vault. Components in this
package use React Native primitives so they can be shared by the Vite web app through
`react-native-web` and by the Expo mobile app through Metro.

## Package contract

- Keep this package limited to shared visual components and component-level behavior.
- Do not add app routing, auth storage, platform API wiring, or other app-specific logic here.
- Export public components from `src/index.ts`.

## Component organization

Components follow atomic design under `src/components`:

- `atoms/` exports primitive building blocks such as `Box`, `Text`, `Pressable`,
  `Stack`, and `AppText`.
- `molecules/` exports composed UI blocks such as `WeaponCard`.
- `templates/` exports layout wrappers such as `Screen`.

Design tokens and theme helpers live under `src/theme` and are re-exported through
the package barrel.

See [docs/design-system.md](../../docs/design-system.md) and `design/tokens/` for
DIM-inspired token specs (LEE-70). Code theme migration is tracked in LEE-72.

## Vite consumption

The web app must resolve React Native imports to `react-native-web`. Keep the package
source alias pointed at `packages/ui/src` during local development so Vite compiles the
shared TypeScript directly:

```ts
// apps/web/vite.config.ts
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@god-roll-vault/ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
});
```

## Expo / Metro consumption

Expo native builds should use `react-native` normally. When Metro is building the Expo app
for web, alias `react-native` to `react-native-web` so shared UI imports resolve to the web
implementation:

```js
// apps/mobile/metro.config.js
import path from "node:path";
import { getDefaultConfig } from "expo/metro-config";

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);
const defaultResolveRequest = config.resolver.resolveRequest;

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(monorepoRoot, "node_modules"),
];
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName === "react-native") {
    return context.resolveRequest(context, "react-native-web", platform);
  }

  if (defaultResolveRequest) {
    return defaultResolveRequest(context, moduleName, platform);
  }

  return context.resolveRequest(context, moduleName, platform);
};

export default config;
```
