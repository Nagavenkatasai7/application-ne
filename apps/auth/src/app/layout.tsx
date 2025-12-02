import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sign In - Resume Tailor",
  description: "Sign in to your Resume Tailor account",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="border-b border-border">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <a href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">
                      RT
                    </span>
                  </div>
                  <span className="font-semibold text-lg">Resume Tailor</span>
                </a>
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 flex items-center justify-center p-4">
              {children}
            </main>

            {/* Footer */}
            <footer className="border-t border-border py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-sm text-muted-foreground">
                  &copy; {new Date().getFullYear()} Resume Tailor. All rights
                  reserved.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
