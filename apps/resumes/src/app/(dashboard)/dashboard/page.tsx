"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Skeleton,
} from "@resume-maker/ui";
import { PageTransition } from "@/components/layout/page-transition";
import {
  FileText,
  Briefcase,
  Send,
  ArrowRight,
  Plus,
  Sparkles,
} from "lucide-react";

interface StatsData {
  resumes: number;
  jobs: number;
  applications: number;
}

async function fetchStats(): Promise<StatsData> {
  // Fetch stats from various endpoints
  const [resumesRes, jobsRes, applicationsRes] = await Promise.allSettled([
    fetch("/api/resumes").then((r) => r.json()),
    fetch("/api/jobs").then((r) => r.json()),
    fetch("/api/applications").then((r) => r.json()),
  ]);

  return {
    resumes:
      resumesRes.status === "fulfilled" ? resumesRes.value.data?.length || 0 : 0,
    jobs: jobsRes.status === "fulfilled" ? jobsRes.value.data?.length || 0 : 0,
    applications:
      applicationsRes.status === "fulfilled"
        ? applicationsRes.value.data?.length || 0
        : 0,
  };
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  href,
  loading,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
  href: string;
  loading?: boolean;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
        <Button variant="link" size="sm" asChild className="mt-2 p-0 h-auto">
          <Link href={href}>
            View all <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: fetchStats,
  });

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to Resume Tailor. Manage your resumes and applications.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard
            title="Resumes"
            value={stats?.resumes || 0}
            description="Uploaded resumes"
            icon={FileText}
            href="/resumes"
            loading={isLoading}
          />
          <StatCard
            title="Saved Jobs"
            value={stats?.jobs || 0}
            description="Jobs in your tracker"
            icon={Briefcase}
            href="/jobs"
            loading={isLoading}
          />
          <StatCard
            title="Applications"
            value={stats?.applications || 0}
            description="Job applications"
            icon={Send}
            href="/applications"
            loading={isLoading}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
              <Link href="/resumes/new" className="block">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Plus className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Upload Resume</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Upload a PDF resume to get started with AI-powered
                    optimization.
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
              <Link href="/search" className="block">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Search Jobs</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Find job opportunities on LinkedIn and save them for
                    tracking.
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="group hover:border-primary/50 transition-colors cursor-pointer">
              <Link href="/modules/uniqueness" className="block">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">
                      Analyze Uniqueness
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Discover your unique skills and differentiators with AI
                    analysis.
                  </CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
