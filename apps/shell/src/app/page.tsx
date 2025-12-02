"use client";

/**
 * Landing Page - Shell Zone
 *
 * Public marketing page with scroll animations.
 */

import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Button, Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@resume-maker/ui";
import {
  Sparkles,
  Target,
  FileSearch,
  MessageSquare,
  Building2,
  CheckCircle,
  FileUp,
  Briefcase,
  Download,
  ArrowRight,
  Check,
  FileText,
} from "lucide-react";
import { FadeInView, StaggerContainer, StaggerItem, ScaleInView } from "@/components/animations";

// Features data
const features = [
  {
    icon: Sparkles,
    title: "AI Resume Tailoring",
    description:
      "Instantly optimize your resume for any job description. Our AI analyzes requirements and restructures your content for maximum impact.",
  },
  {
    icon: Target,
    title: "Impact Quantification",
    description:
      "Transform vague accomplishments into measurable metrics that demonstrate your value with concrete numbers.",
  },
  {
    icon: FileSearch,
    title: "Context Alignment",
    description:
      "Semantic analysis ensures your resume speaks the same language as the job posting for better ATS matching.",
  },
  {
    icon: MessageSquare,
    title: "Soft Skills Assessment",
    description:
      "Interactive assessment helps identify and document leadership, communication, and collaboration abilities.",
  },
  {
    icon: Building2,
    title: "Company Research",
    description:
      "Get insider insights on company culture, values, and what they look for in candidates.",
  },
  {
    icon: CheckCircle,
    title: "ATS Optimization",
    description:
      "Ensure your resume passes Applicant Tracking Systems with proper formatting and keywords.",
  },
];

// How it works steps
const steps = [
  {
    icon: FileUp,
    title: "Upload Your Resume",
    description: "Upload your existing resume as PDF. Our AI parses and structures your experience.",
  },
  {
    icon: Briefcase,
    title: "Add Target Jobs",
    description: "Paste job URLs or descriptions. Search LinkedIn for opportunities directly.",
  },
  {
    icon: Sparkles,
    title: "AI Tailoring",
    description: "One click generates a perfectly tailored resume. Review AI suggestions and changes.",
  },
  {
    icon: Download,
    title: "Download & Apply",
    description: "Export your optimized resume as PDF. Track applications and iterate.",
  },
];

// Pricing tiers
const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["1 resume upload", "3 tailored resumes/month", "Basic AI modules", "10 job tracking"],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious job seekers",
    features: [
      "Unlimited resume uploads",
      "Unlimited tailoring",
      "All AI modules",
      "Unlimited job tracking",
      "Company research (10/month)",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and organizations",
    features: [
      "Everything in Pro",
      "Custom branding",
      "Team features",
      "Unlimited company research",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

const easeOut: [number, number, number, number] = [0.22, 1, 0.36, 1];

const heroContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
};

export default function LandingPage() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255,255,255,0)", "rgba(255,255,255,0.95)"]
  );
  const headerShadow = useTransform(
    scrollY,
    [0, 100],
    ["0 0 0 0 rgba(0,0,0,0)", "0 1px 3px 0 rgba(0,0,0,0.1)"]
  );

  return (
    <div className="flex flex-col scroll-smooth min-h-screen">
      {/* Navigation Header */}
      <motion.header
        className="fixed top-0 z-50 w-full border-b border-border/40 backdrop-blur-md supports-[backdrop-filter]:bg-background/60"
        style={prefersReducedMotion ? {} : { backgroundColor: headerBackground, boxShadow: headerShadow }}
      >
        <div className="container mx-auto px-4 flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-lg">Resume Tailor</span>
          </Link>

          <nav className="flex items-center gap-4">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/register">Get Started</Link>
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <motion.div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <div className="container mx-auto px-4 text-center">
          <motion.div variants={heroContainer} initial="hidden" animate="visible">
            <motion.div variants={heroItem}>
              <Badge variant="secondary" className="mb-4">AI-Powered Resume Optimization</Badge>
            </motion.div>

            <motion.h1 variants={heroItem} className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Land Your Dream Job with
            </motion.h1>

            <motion.span
              variants={heroItem}
              className="text-primary block mt-2 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            >
              AI-Powered Resumes
            </motion.span>

            <motion.p
              variants={heroItem}
              className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
            >
              Transform your resume into a perfectly tailored, ATS-optimized document that gets you interviews. Powered by Claude AI.
            </motion.p>

            <motion.div variants={heroItem} className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <Link href="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.p variants={heroItem} className="mt-4 text-sm text-muted-foreground">
              No credit card required. Free tier available.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeInView className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to land more interviews
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered tools help you create perfectly tailored resumes for every job application.
            </p>
          </FadeInView>

          <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <Card className="border-0 shadow-sm h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <ScaleInView delay={0.1}>
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </ScaleInView>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <FadeInView className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a tailored resume in minutes, not hours.
            </p>
          </FadeInView>

          <StaggerContainer className="grid gap-8 md:grid-cols-2 lg:grid-cols-4" staggerDelay={0.15}>
            {steps.map((step, index) => (
              <StaggerItem key={step.title}>
                <div className="relative text-center">
                  <div className="flex flex-col items-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold mb-4">
                      {index + 1}
                    </div>
                    <step.icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeInView className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that&apos;s right for your job search.
            </p>
          </FadeInView>

          <StaggerContainer className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto" staggerDelay={0.15}>
            {pricingTiers.map((tier) => (
              <StaggerItem key={tier.name}>
                <Card className={tier.highlighted ? "border-primary shadow-lg relative" : "border-0 shadow-sm"}>
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge>Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      {tier.period && <span className="text-muted-foreground">{tier.period}</span>}
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={tier.highlighted ? "default" : "outline"} asChild>
                      <Link href="/register">{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <FadeInView>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to land your dream job?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg opacity-90">
              Join thousands of job seekers who&apos;ve transformed their job search with AI-powered resumes.
            </p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/register">
                  Get Started Free - No Credit Card Required
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </FadeInView>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <FileText className="h-4 w-4" />
                </div>
                <span>Resume Tailor</span>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                AI-powered resume optimization for modern job seekers.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#features" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-foreground transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
                <li><Link href="/refunds" className="hover:text-foreground transition-colors">Refunds</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Resume Tailor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
