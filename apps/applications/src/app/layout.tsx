import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Applications | Resume Maker",
  description: "Track and manage your job applications",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          {children}
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
