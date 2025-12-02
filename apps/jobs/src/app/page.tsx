import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Jobs Zone</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Job management and LinkedIn search
      </p>
      <div className="flex gap-4">
        <Link
          href="/jobs"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Jobs
        </Link>
        <Link
          href="/jobs/new"
          className="px-6 py-3 border border-border rounded-lg hover:bg-muted transition-colors"
        >
          Add Job
        </Link>
      </div>
    </main>
  );
}
