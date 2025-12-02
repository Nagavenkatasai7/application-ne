import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/responses.ts",
    "src/validation.ts",
    "src/rate-limit.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ["next", "next/server", "zod", "@upstash/ratelimit", "@upstash/redis"],
});
