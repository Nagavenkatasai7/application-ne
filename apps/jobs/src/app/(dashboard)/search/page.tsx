"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import type { LinkedInJobResult, LinkedInSearchResponse } from "@/lib/linkedin/types";

interface SearchFormData {
  keywords: string;
  location: string;
  timeFrame: string;
  experienceLevel: string;
  workplaceType: string;
  jobType: string;
}

async function searchJobs(data: SearchFormData): Promise<LinkedInSearchResponse> {
  const response = await fetch("/api/linkedin/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      keywords: data.keywords,
      location: data.location || undefined,
      timeFrame: data.timeFrame || undefined,
      experienceLevel: data.experienceLevel || undefined,
      workplaceType: data.workplaceType || undefined,
      jobType: data.jobType || undefined,
    }),
  });
  return response.json();
}

export default function LinkedInSearchPage() {
  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");
  const [timeFrame, setTimeFrame] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [workplaceType, setWorkplaceType] = useState("");
  const [jobType, setJobType] = useState("");

  const searchMutation = useMutation({
    mutationFn: searchJobs,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    searchMutation.mutate({
      keywords,
      location,
      timeFrame,
      experienceLevel,
      workplaceType,
      jobType,
    });
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">LinkedIn Job Search</h1>

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-2">
              Job Title / Keywords *
            </label>
            <input
              type="text"
              id="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Software Engineer"
            />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., San Francisco, CA"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="timeFrame" className="block text-sm font-medium mb-2">
              Posted
            </label>
            <select
              id="timeFrame"
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any time</option>
              <option value="24h">Past 24 hours</option>
              <option value="1w">Past week</option>
              <option value="1m">Past month</option>
            </select>
          </div>

          <div>
            <label htmlFor="experienceLevel" className="block text-sm font-medium mb-2">
              Experience
            </label>
            <select
              id="experienceLevel"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any level</option>
              <option value="internship">Internship</option>
              <option value="entry_level">Entry Level</option>
              <option value="associate">Associate</option>
              <option value="mid_senior">Mid-Senior</option>
              <option value="director">Director</option>
              <option value="executive">Executive</option>
            </select>
          </div>

          <div>
            <label htmlFor="workplaceType" className="block text-sm font-medium mb-2">
              Workplace
            </label>
            <select
              id="workplaceType"
              value={workplaceType}
              onChange={(e) => setWorkplaceType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any</option>
              <option value="on_site">On-Site</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label htmlFor="jobType" className="block text-sm font-medium mb-2">
              Job Type
            </label>
            <select
              id="jobType"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Any</option>
              <option value="full_time">Full-time</option>
              <option value="part_time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!keywords || searchMutation.isPending}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {searchMutation.isPending ? "Searching..." : "Search LinkedIn"}
        </button>
      </form>

      {searchMutation.isPending && (
        <div className="text-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">
            Searching LinkedIn... This may take up to 2 minutes.
          </p>
        </div>
      )}

      {searchMutation.error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          Search failed. Please try again.
        </div>
      )}

      {searchMutation.data && !searchMutation.data.success && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-6">
          {searchMutation.data.error?.message || "Search failed. Please try again."}
        </div>
      )}

      {searchMutation.data?.success && searchMutation.data.data && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Found {searchMutation.data.data.totalCount} jobs
            </h2>
          </div>

          {searchMutation.data.data.jobs.length === 0 ? (
            <div className="text-center py-12 bg-muted/50 rounded-lg">
              <p className="text-muted-foreground">
                No jobs found. Try different search terms.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {searchMutation.data.data.jobs.map((job: LinkedInJobResult) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg hover:border-primary transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-muted-foreground">{job.companyName}</p>
                      {job.location && (
                        <p className="text-sm text-muted-foreground">{job.location}</p>
                      )}
                      {job.salary && (
                        <p className="text-sm text-green-600 mt-1">{job.salary}</p>
                      )}
                      {job.postedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted: {job.postedAt}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {job.url && (
                        <a
                          href={job.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm border rounded hover:bg-muted transition-colors"
                        >
                          View on LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                  {job.description && (
                    <p className="text-sm text-muted-foreground mt-3 line-clamp-3">
                      {job.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
