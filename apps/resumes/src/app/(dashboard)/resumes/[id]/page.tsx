"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
  Badge,
} from "@resume-maker/ui";
import { PageTransition } from "@/components/layout/page-transition";
import {
  ArrowLeft,
  Edit,
  Wand2,
  FileText,
  Download,
  Star,
} from "lucide-react";
import type { ResumeResponse, ResumeContent } from "@resume-maker/types";

interface ResumeApiResponse {
  success: boolean;
  data: ResumeResponse;
}

async function fetchResume(id: string): Promise<ResumeApiResponse> {
  const response = await fetch(`/api/resumes/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch resume");
  }
  return response.json();
}

export default function ResumeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const resumeId = params.id as string;

  const { data, isLoading, error } = useQuery({
    queryKey: ["resumes", resumeId],
    queryFn: () => fetchResume(resumeId),
  });

  const resume = data?.data;
  const content = resume?.content as ResumeContent | undefined;

  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-48" />
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (error || !resume) {
    return (
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <Card className="border-destructive">
            <CardContent className="p-6 text-center">
              <p className="text-destructive">
                Failed to load resume. It may have been deleted.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => router.push("/resumes")}
              >
                Back to Resumes
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/resumes">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to resumes</span>
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {resume.name}
                </h1>
                {resume.isMaster && (
                  <Badge variant="secondary">
                    <Star className="w-3 h-3 mr-1" />
                    Master
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground mt-1">
                {resume.originalFileName || "Uploaded resume"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href={`/resumes/${resumeId}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/resumes/${resumeId}/tailor`}>
                <Wand2 className="mr-2 h-4 w-4" />
                Tailor
              </Link>
            </Button>
          </div>
        </div>

        {/* Resume Content */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Section */}
            {content?.contact && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-sm text-muted-foreground">Name</dt>
                      <dd className="font-medium">
                        {content.contact.name || "—"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-muted-foreground">Email</dt>
                      <dd className="font-medium">
                        {content.contact.email || "—"}
                      </dd>
                    </div>
                    {content.contact.phone && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Phone</dt>
                        <dd className="font-medium">{content.contact.phone}</dd>
                      </div>
                    )}
                    {content.contact.location && (
                      <div>
                        <dt className="text-sm text-muted-foreground">
                          Location
                        </dt>
                        <dd className="font-medium">
                          {content.contact.location}
                        </dd>
                      </div>
                    )}
                  </dl>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            {content?.summary && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {content.summary}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Experience */}
            {content?.experiences && content.experiences.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {content.experiences.map((exp) => (
                    <div key={exp.id} className="border-l-2 border-muted pl-4">
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                        {exp.location && ` • ${exp.location}`}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {exp.startDate} — {exp.endDate || "Present"}
                      </p>
                      {exp.bullets && exp.bullets.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {exp.bullets.map((bullet) => (
                            <li
                              key={bullet.id}
                              className="text-sm text-muted-foreground"
                            >
                              • {bullet.text}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Education */}
            {content?.education && content.education.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Education</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.education.map((edu) => (
                    <div key={edu.id}>
                      <h4 className="font-medium">{edu.institution}</h4>
                      <p className="text-sm text-muted-foreground">
                        {edu.degree} in {edu.field}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {edu.graduationDate}
                        {edu.gpa && ` • GPA: ${edu.gpa}`}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills */}
            {content?.skills && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Skills</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.skills.technical.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Technical</h5>
                      <div className="flex flex-wrap gap-1">
                        {content.skills.technical.map((skill, i) => (
                          <Badge key={i} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {content.skills.soft.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium mb-2">Soft Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {content.skills.soft.map((skill, i) => (
                          <Badge key={i} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/api/resumes/${resumeId}/pdf`} target="_blank">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <Link href={`/resumes/${resumeId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Resume
                  </Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href={`/resumes/${resumeId}/tailor`}>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Tailor for Job
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* File Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">File Info</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {resume.originalFileName || "No file"}
                    </span>
                  </div>
                  {resume.fileSize && (
                    <div className="text-muted-foreground">
                      Size:{" "}
                      {(resume.fileSize / 1024).toFixed(1)} KB
                    </div>
                  )}
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
