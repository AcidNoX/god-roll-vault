import react from "@vitejs/plugin-react";
import { defineConfig, mergeConfig, type UserConfig } from "vitest/config";

const baseReactConfig = defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    passWithNoTests: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary"],
      reportsDirectory: "./coverage",
      exclude: ["**/*.test.ts", "**/*.test.tsx", "**/dist/**"],
    },
  },
});

export function defineReactTestConfig(overrides: UserConfig = {}) {
  return mergeConfig(baseReactConfig, defineConfig(overrides));
}
