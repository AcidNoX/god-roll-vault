import { defineReactTestConfig } from "@god-roll-vault/vitest/react";

export default defineReactTestConfig({
  resolve: {
    alias: {
      "react-native": "react-native-web",
    },
  },
});
