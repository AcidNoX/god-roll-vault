import { defineConfig, mergeConfig, type UserConfig } from "vitest/config";

const baseNodeConfig = defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/dist/**"],
    },
  },
});

export function defineNodeTestConfig(overrides: UserConfig = {}) {
  return mergeConfig(baseNodeConfig, defineConfig(overrides));
}
