import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            Jobs Zone
          </Link>
          <div className="flex gap-4">
            <Link href="/jobs" className="text-muted-foreground hover:text-foreground transition-colors">
              All Jobs
            </Link>
            <Link href="/jobs/new" className="text-muted-foreground hover:text-foreground transition-colors">
              Add Job
            </Link>
            <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
              LinkedIn Search
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
