import path from "node:path";
import { fileURLToPath } from "node:url";

import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(storybookDir, "..");
const repoRoot = path.resolve(packageRoot, "../..");

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      base: process.env.STORYBOOK_BASE ?? "/",
      resolve: {
        alias: {
          "react-native": "react-native-web",
          "@god-roll-vault/ui": path.resolve(packageRoot, "src"),
          "@god-roll-vault/core": path.resolve(repoRoot, "packages/core/src"),
          "@god-roll-vault/destiny-data": path.resolve(repoRoot, "packages/destiny-data/src"),
        },
      },
    });
  },
};

export default config;
