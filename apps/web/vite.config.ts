import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const repoRoot = path.resolve(__dirname, "../..");
const defaultRedirectUri = "https://127.0.0.1:3000/auth/callback";

/** Root `.env` uses BUNGIE_*; Vite client code expects VITE_* — bridge both here. */
function resolveWebAuthEnv(mode: string) {
  const rootEnv = loadEnv(mode, repoRoot, "");
  const appEnv = loadEnv(mode, __dirname, "");

  return {
    apiKey:
      appEnv.VITE_BUNGIE_API_KEY || rootEnv.VITE_BUNGIE_API_KEY || rootEnv.BUNGIE_API_KEY || "",
    clientId:
      appEnv.VITE_BUNGIE_CLIENT_ID ||
      rootEnv.VITE_BUNGIE_CLIENT_ID ||
      rootEnv.BUNGIE_CLIENT_ID ||
      "",
    clientSecret:
      appEnv.VITE_BUNGIE_CLIENT_SECRET ||
      rootEnv.VITE_BUNGIE_CLIENT_SECRET ||
      rootEnv.BUNGIE_CLIENT_SECRET ||
      "",
    redirectUri:
      appEnv.VITE_OAUTH_REDIRECT_URI ||
      rootEnv.VITE_OAUTH_REDIRECT_URI ||
      rootEnv.OAUTH_REDIRECT_URI_WEB ||
      defaultRedirectUri,
  };
}

export default defineConfig(({ mode }) => {
  const authEnv = resolveWebAuthEnv(mode);

  return {
    envDir: repoRoot,
    define: {
      "import.meta.env.VITE_BUNGIE_API_KEY": JSON.stringify(authEnv.apiKey),
      "import.meta.env.VITE_BUNGIE_CLIENT_ID": JSON.stringify(authEnv.clientId),
      "import.meta.env.VITE_BUNGIE_CLIENT_SECRET": JSON.stringify(authEnv.clientSecret),
      "import.meta.env.VITE_OAUTH_REDIRECT_URI": JSON.stringify(authEnv.redirectUri),
    },
    plugins: [react(), basicSsl()],
    resolve: {
      alias: {
        "react-native": "react-native-web",
        "@god-roll-vault/ui": path.resolve(__dirname, "../../packages/ui/src"),
        "@god-roll-vault/core": path.resolve(__dirname, "../../packages/core/src"),
        "@god-roll-vault/api": path.resolve(__dirname, "../../packages/api/src"),
        "@god-roll-vault/destiny-data": path.resolve(__dirname, "../../packages/destiny-data/src"),
      },
    },
    server: {
      host: "127.0.0.1",
      port: 3000,
    },
  };
});
