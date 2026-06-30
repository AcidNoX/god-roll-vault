import path from "node:path";
import { defineReactTestConfig } from "@god-roll-vault/vitest/react";

export default defineReactTestConfig({
  resolve: {
    alias: {
      "react-native": path.resolve(__dirname, "test/react-native.tsx"),
    },
  },
  test: {
    globals: true,
    setupFiles: ["./test/setup.ts"],
    server: {
      deps: {
        inline: [/@testing-library\/react-native/],
      },
    },
  },
});
