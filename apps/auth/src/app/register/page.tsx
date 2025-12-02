"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Loader2, Check, X } from "lucide-react";
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
  Checkbox,
} from "@resume-maker/ui";
import {
  registerWithPasswordSchema,
  checkPasswordStrength,
  PASSWORD_STRENGTH_LABELS,
} from "@resume-maker/types";

export default function RegisterPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordStrength = checkPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeToTerms) {
      setFormError("You must agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setFormError(null);

    // Validate input
    const parsed = registerWithPasswordSchema.safeParse({
      email,
      password,
      confirmPassword,
      name: name || undefined,
    });

    if (!parsed.success) {
      setFormError(parsed.error.errors[0].message);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name: name || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.error?.message || "Registration failed");
      } else {
        setSuccess(true);
      }
    } catch {
      setFormError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-success" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to <strong>{email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center">
            Please verify your email address to complete registration. The link
            expires in 24 hours.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push("/login")}
          >
            Back to sign in
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Get started with Resume Tailor for free
        </CardDescription>
      </CardHeader>
      <CardContent>
        {formError && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{formError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name (optional)</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                className="pl-10"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {password && (
              <div className="space-y-2">
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < passwordStrength.score
                          ? passwordStrength.score <= 1
                            ? "bg-destructive"
                            : passwordStrength.score === 2
                              ? "bg-warning"
                              : "bg-success"
                          : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Password strength:{" "}
                  {PASSWORD_STRENGTH_LABELS[passwordStrength.score]}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              {confirmPassword && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {password === confirmPassword ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <X className="w-4 h-4 text-destructive" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
            />
            <Label htmlFor="terms" className="text-sm font-normal">
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
                Creating account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Already have an account?
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
