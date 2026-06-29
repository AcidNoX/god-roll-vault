import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), basicSsl()],
  resolve: {
    alias: {
      "react-native": "react-native-web",
      "@god-roll-vault/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@god-roll-vault/core": path.resolve(__dirname, "../../packages/core/src"),
      "@god-roll-vault/api": path.resolve(__dirname, "../../packages/api/src"),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
});
