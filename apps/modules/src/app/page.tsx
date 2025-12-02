export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">AI Modules Zone</h1>
      <p className="text-lg text-muted-foreground mb-8 text-center max-w-2xl">
        AI-powered resume analysis and optimization endpoints.
        This zone provides APIs for impact analysis, company research,
        context matching, uniqueness detection, and soft skills assessment.
      </p>
      <div className="grid gap-4 max-w-lg w-full">
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/modules/impact</h2>
          <p className="text-sm text-muted-foreground">
            Analyze resume bullets for quantification opportunities
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/modules/context</h2>
          <p className="text-sm text-muted-foreground">
            Analyze resume-job fit and context matching
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/modules/company</h2>
          <p className="text-sm text-muted-foreground">
            Research company culture and tailor resume accordingly
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/modules/uniqueness</h2>
          <p className="text-sm text-muted-foreground">
            Identify unique differentiators in resume
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold">POST /api/modules/soft-skills</h2>
          <p className="text-sm text-muted-foreground">
            Interactive soft skills assessment
          </p>
        </div>
      </div>
    </main>
  );
}
