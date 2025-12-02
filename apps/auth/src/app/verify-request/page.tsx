"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@resume-maker/ui";

export default function VerifyRequestPage() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>A sign in link has been sent to your email</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground text-center">
          Click the link in your email to sign in. The link expires in 24 hours.
          If you don&apos;t see the email, check your spam folder.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/login">Back to sign in</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
