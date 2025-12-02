import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils.ts", "src/hooks/index.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "react",
    "react-dom",
    "next-themes",
  ],
  esbuildOptions(options) {
    options.jsx = "automatic";
  },
});
