import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    include: [
      "tests/**/*.test.ts",
      "tests/**/*.test.tsx",
      "lib/**/*.test.ts",
      "components/**/*.test.ts",
      "components/**/*.test.tsx",
    ],
    exclude: ["tests/e2e/**", "node_modules/**"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
