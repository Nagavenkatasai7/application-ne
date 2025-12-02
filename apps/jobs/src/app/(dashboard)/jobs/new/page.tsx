"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get("title") as string,
      companyName: formData.get("companyName") as string,
      location: formData.get("location") as string,
      description: formData.get("description") as string,
      platform: "manual",
    };

    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error?.message || "Failed to create job");
      }

      router.push("/jobs");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/jobs" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Back to Jobs
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Add New Job</h1>

      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-2">
            Job Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Senior Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="companyName" className="block text-sm font-medium mb-2">
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., San Francisco, CA (Remote)"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Job Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={10}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Paste the full job description here..."
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : "Save Job"}
          </button>
          <Link
            href="/jobs"
            className="px-6 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
