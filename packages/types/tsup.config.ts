import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/auth.ts",
    "src/resume.ts",
    "src/job.ts",
    "src/application.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: ["zod"],
});
