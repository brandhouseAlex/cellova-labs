import path from "path";
import { defineConfig } from "vitest/config";

const projectRoot = path.resolve(import.meta.dirname);

export default defineConfig({
  resolve: {
    alias: {
      "@": projectRoot,
    },
  },
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts", "tests/**/*.test.ts"],
  },
});
