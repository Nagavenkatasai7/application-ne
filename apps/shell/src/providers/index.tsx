"use client";

import { ThemeProvider } from "./theme-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { Toaster } from "@resume-maker/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}

export { ThemeProvider } from "./theme-provider";
export { QueryProvider } from "./query-provider";
export { SessionProvider } from "./session-provider";
