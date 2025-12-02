import { defineConfig } from "tsup";
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

export default defineConfig({
  entry: ["src/index.ts", "src/password.ts", "src/middleware.ts"],
  format: ["esm"],
  // DTS disabled due to Next-Auth v5 type inference issues
  // Using manual .d.ts files instead
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  external: [
    "next-auth",
    "next-auth/jwt",
    "next-auth/providers/resend",
    "next-auth/providers/credentials",
    "@auth/drizzle-adapter",
    "@auth/core",
    "@resume-maker/db",
    "@resume-maker/types",
    "bcryptjs",
    "drizzle-orm",
    "next",
    "next/server",
  ],
  onSuccess: async () => {
    // Copy manual declaration files to dist
    const distDir = join(process.cwd(), "dist");
    const srcDir = join(process.cwd(), "src");

    if (!existsSync(distDir)) {
      mkdirSync(distDir, { recursive: true });
    }

    const dtsFiles = ["index.d.ts", "password.d.ts", "middleware.d.ts"];
    for (const file of dtsFiles) {
      const src = join(srcDir, file);
      const dest = join(distDir, file);
      if (existsSync(src)) {
        copyFileSync(src, dest);
        console.log(`Copied ${file} to dist/`);
      }
    }
  },
});
