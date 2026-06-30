import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineNodeTestConfig } from "@god-roll-vault/vitest/node";

const packageDir = fileURLToPath(new URL(".", import.meta.url));

export default defineNodeTestConfig({
  resolve: {
    alias: {
      "@god-roll-vault/core": resolve(packageDir, "../core/src/index.ts"),
    },
  },
});
