import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@god-roll-vault/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@god-roll-vault/core": path.resolve(__dirname, "../../packages/core/src"),
    },
  },
  server: {
    port: 3000,
  },
});
