"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";

interface Job {
  id: string;
  title: string;
  companyName: string | null;
  location: string | null;
  description: string | null;
  platform: string;
  salary: string | null;
  requirements: string[];
  skills: string[];
  createdAt: string;
}

interface JobResponse {
  success: boolean;
  data: Job;
}

async function fetchJob(id: string): Promise<JobResponse> {
  const response = await fetch(`/api/jobs/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch job");
  }
  return response.json();
}

async function deleteJob(id: string): Promise<void> {
  const response = await fetch(`/api/jobs/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const result = await response.json();
    throw new Error(result.error?.message || "Failed to delete job");
  }
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const id = params.id as string;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["job", id],
    queryFn: () => fetchJob(id),
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      router.push("/jobs");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to Jobs
          </Link>
        </div>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error || !data?.data) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
            &larr; Back to Jobs
          </Link>
        </div>
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg">
          Failed to load job. It may have been deleted.
        </div>
      </div>
    );
  }

  const job = data.data;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Jobs
        </Link>
      </div>

      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">{job.title}</h1>
          <p className="text-lg text-muted-foreground">
            {job.companyName || "Unknown Company"}
          </p>
          {job.location && (
            <p className="text-muted-foreground">{job.location}</p>
          )}
        </div>
        <span className="text-xs px-2 py-1 bg-muted rounded capitalize">
          {job.platform}
        </span>
      </div>

      {job.salary && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Salary</h2>
          <p>{job.salary}</p>
        </div>
      )}

      {job.description && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <div className="prose max-w-none whitespace-pre-wrap">
            {job.description}
          </div>
        </div>
      )}

      {job.requirements && job.requirements.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Requirements</h2>
          <ul className="list-disc list-inside space-y-1">
            {job.requirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.skills && job.skills.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span key={i} className="px-2 py-1 bg-muted text-sm rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {job.platform === "manual" && (
        <div className="border-t pt-6 mt-6">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 text-destructive border border-destructive rounded-lg hover:bg-destructive/10 transition-colors"
            >
              Delete Job
            </button>
          ) : (
            <div className="bg-destructive/10 p-4 rounded-lg">
              <p className="text-destructive mb-4">
                Are you sure you want to delete this job? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50"
                >
                  {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
              {deleteMutation.error && (
                <p className="text-destructive mt-2">
                  {deleteMutation.error.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
