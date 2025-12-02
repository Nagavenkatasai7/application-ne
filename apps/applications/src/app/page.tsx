import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">Applications Zone</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        Track and manage your job applications throughout the hiring process.
      </p>
      <div className="grid gap-4 max-w-lg w-full">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">GET /api/applications</h2>
          <p className="text-sm text-muted-foreground">
            List all applications for the current user
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/applications</h2>
          <p className="text-sm text-muted-foreground">
            Create a new job application
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">GET /api/applications/:id</h2>
          <p className="text-sm text-muted-foreground">
            Get a specific application by ID
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">PATCH /api/applications/:id</h2>
          <p className="text-sm text-muted-foreground">
            Update application status or details
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">DELETE /api/applications/:id</h2>
          <p className="text-sm text-muted-foreground">
            Delete an application
          </p>
        </div>
      </div>
      <div className="mt-8">
        <Link
          href="/applications"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
        >
          View Applications Dashboard
        </Link>
      </div>
    </main>
  );
}
