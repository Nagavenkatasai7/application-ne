"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@resume-maker/ui";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorDetails = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Error",
          description: "There is a problem with the server configuration.",
          message: "Please try again later or contact support if the problem persists.",
        };
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to access this resource.",
          message: "If you believe this is an error, please contact support.",
        };
      case "Verification":
        return {
          title: "Link Expired",
          description: "The sign in link has expired or has already been used.",
          message: "Please request a new sign in link.",
        };
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
      case "OAuthAccountNotLinked":
        return {
          title: "Authentication Error",
          description: "There was a problem with the authentication provider.",
          message: "Please try signing in with a different method.",
        };
      case "EmailCreateAccount":
        return {
          title: "Account Creation Failed",
          description: "Could not create an account with this email.",
          message: "This email may already be in use. Try signing in instead.",
        };
      case "Callback":
        return {
          title: "Callback Error",
          description: "There was a problem during the authentication callback.",
          message: "Please try signing in again.",
        };
      case "EmailSignin":
        return {
          title: "Email Error",
          description: "The email could not be sent.",
          message: "Please verify your email address and try again.",
        };
      case "CredentialsSignin":
        return {
          title: "Sign In Failed",
          description: "The credentials you provided are invalid.",
          message: "Please check your email and password and try again.",
        };
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "You must be signed in to access this page.",
          message: "Please sign in to continue.",
        };
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication.",
          message: "Please try again. If the problem persists, contact support.",
        };
    }
  };

  const errorDetails = getErrorDetails(error);

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-6 h-6 text-destructive" />
        </div>
        <CardTitle className="text-destructive">{errorDetails.title}</CardTitle>
        <CardDescription>{errorDetails.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          {errorDetails.message}
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full" asChild>
          <Link href="/login">Try Again</Link>
        </Button>
        <Button variant="outline" className="w-full" asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function AuthErrorPage() {
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
      <AuthErrorContent />
    </Suspense>
  );
}
