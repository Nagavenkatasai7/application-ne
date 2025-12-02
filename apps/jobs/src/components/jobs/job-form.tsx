"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card, CardContent, CardHeader, CardTitle } from "@resume-maker/ui";
import { createJobSchema, type CreateJobInput } from "@resume-maker/types";
import { Loader2 } from "lucide-react";

// Form values interface (matches schema input)
interface JobFormValues {
  title: string;
  companyName: string;
  location: string;
  description: string;
  requirements: string[];
  skills: string[];
  salary: string;
  platform: "manual" | "linkedin" | "indeed" | "glassdoor" | "greenhouse" | "lever" | "workday" | "icims" | "smartrecruiters";
  url: string;
  externalId?: string;
}

interface JobFormProps {
  onSubmit: (data: CreateJobInput) => Promise<void>;
  isLoading?: boolean;
  defaultValues?: Partial<JobFormValues>;
}

export function JobForm({ onSubmit, isLoading, defaultValues }: JobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: zodResolver(createJobSchema),
    defaultValues: {
      title: "",
      companyName: "",
      location: "",
      description: "",
      requirements: [],
      skills: [],
      salary: "",
      platform: "manual",
      url: "",
      ...defaultValues,
    },
  });

  const handleFormSubmit = handleSubmit(async (data) => {
    // zodResolver transforms the data, so we can safely cast to CreateJobInput
    await onSubmit(data as unknown as CreateJobInput);
  });

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* URL Import Section */}
      <Card className="border-dashed">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Import from URL (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Input
              {...register("url")}
              type="url"
              placeholder="https://linkedin.com/jobs/view/..."
              className="font-mono text-sm"
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Paste a job URL to auto-fill details (coming soon)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Manual Entry Section */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Job Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Job Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Job Title <span className="text-destructive">*</span>
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="e.g., Senior Software Engineer"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Company Name */}
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium">
              Company Name <span className="text-destructive">*</span>
            </label>
            <Input
              id="companyName"
              {...register("companyName")}
              placeholder="e.g., Acme Corporation"
            />
            {errors.companyName && (
              <p className="text-sm text-destructive">
                {errors.companyName.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              {...register("location")}
              placeholder="e.g., San Francisco, CA (Remote)"
            />
            {errors.location && (
              <p className="text-sm text-destructive">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Salary */}
          <div className="space-y-2">
            <label htmlFor="salary" className="text-sm font-medium">
              Salary Range
            </label>
            <Input
              id="salary"
              {...register("salary")}
              placeholder="e.g., $150,000 - $200,000"
            />
            {errors.salary && (
              <p className="text-sm text-destructive">
                {errors.salary.message}
              </p>
            )}
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Job Description <span className="text-destructive">*</span>
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Paste the full job description here..."
              className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Job"
          )}
        </Button>
      </div>
    </form>
  );
}
