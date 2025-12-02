import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/config.ts",
    "src/json-utils.ts",
    "src/retry/index.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ["@anthropic-ai/sdk", "zod"],
});
