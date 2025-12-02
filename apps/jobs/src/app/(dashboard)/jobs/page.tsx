"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  companyName: string | null;
  location: string | null;
  platform: string;
  createdAt: string;
}

interface JobsResponse {
  success: boolean;
  data: Job[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}

async function fetchJobs(): Promise<JobsResponse> {
  const response = await fetch("/api/jobs");
  if (!response.ok) {
    throw new Error("Failed to fetch jobs");
  }
  return response.json();
}

export default function JobsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchJobs,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Jobs</h1>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load jobs. Please try again.
        </div>
      </div>
    );
  }

  const jobs = data?.data || [];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Jobs</h1>
        <Link
          href="/jobs/new"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Add Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground mb-4">No jobs found</p>
          <Link
            href="/jobs/new"
            className="text-primary hover:underline"
          >
            Add your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="block p-4 border rounded-lg hover:border-primary transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold text-lg">{job.title}</h2>
                  <p className="text-muted-foreground">
                    {job.companyName || "Unknown Company"}
                  </p>
                  {job.location && (
                    <p className="text-sm text-muted-foreground">{job.location}</p>
                  )}
                </div>
                <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
                  {job.platform}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
