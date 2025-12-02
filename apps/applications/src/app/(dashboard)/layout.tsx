import Link from "next/link";
import { ClipboardList } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Link href="/" className="flex items-center space-x-2">
            <ClipboardList className="h-5 w-5 text-primary" />
            <span className="font-semibold">Applications</span>
          </Link>
          <nav className="ml-auto flex items-center space-x-4 text-sm">
            <Link
              href="/applications"
              className="transition-colors hover:text-foreground text-muted-foreground"
            >
              All Applications
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 container px-4 py-6">{children}</main>
    </div>
  );
}
