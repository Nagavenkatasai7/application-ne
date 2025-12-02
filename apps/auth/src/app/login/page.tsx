"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Checkbox,
} from "@resume-maker/ui";
import { loginWithPasswordSchema } from "@resume-maker/types";

function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const error = searchParams.get("error");

  const [activeTab, setActiveTab] = useState<"magic-link" | "password">(
    "magic-link"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      const result = await signIn("resend", {
        email,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        setFormError("Failed to send magic link. Please try again.");
      } else {
        setMagicLinkSent(true);
      }
    } catch {
      setFormError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeToTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    // Validate input
    const parsed = loginWithPasswordSchema.safeParse({ email, password });
    if (!parsed.success) {
      setFormError(parsed.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        if (result.error === "EMAIL_NOT_VERIFIED") {
          setFormError(
            "Please verify your email before signing in. Check your inbox."
          );
        } else {
          setFormError("Invalid email or password");
        }
      } else if (result?.ok) {
        // Redirect on success
        window.location.href = callbackUrl;
      }
    } catch {
      setFormError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (magicLinkSent) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a magic link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Click the link in your email to sign in. The link expires in 24
            hours.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setMagicLinkSent(false)}
          >
            Use a different email
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your account to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        {(error || formError) && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">
              {formError || getErrorMessage(error)}
            </p>
          </div>
        )}

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "magic-link" | "password")}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="magic-link">Magic Link</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="magic-link">
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="magic-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="magic-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms-magic"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked === true)
                  }
                />
                <Label htmlFor="terms-magic" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms-password"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) =>
                    setAgreeToTerms(checked === true)
                  }
                />
                <Label htmlFor="terms-password" className="text-sm font-normal">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              New to Resume Tailor?
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/register">Create an account</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function getErrorMessage(error: string | null): string {
  switch (error) {
    case "CredentialsSignin":
      return "Invalid email or password";
    case "OAuthAccountNotLinked":
      return "This email is already associated with another account";
    case "EmailSignin":
      return "Failed to send magic link email";
    case "Verification":
      return "The magic link has expired or is invalid";
    default:
      return "An error occurred during sign in";
  }
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </CardContent>
        </Card>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
