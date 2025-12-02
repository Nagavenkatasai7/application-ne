import { NextResponse } from "next/server";
import { db, users, verificationTokens, eq } from "@resume-maker/db";
import { forgotPasswordSchema } from "@resume-maker/types";
import { randomBytes } from "crypto";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: parsed.error.errors[0].message,
          },
        },
        { status: 400 }
      );
    }

    const { email } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user exists (but don't reveal this to the client)
    const user = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        data: {
          message: "If an account exists, a reset link has been sent.",
        },
      });
    }

    // Generate reset token
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Store token in verification_tokens table
    await db.insert(verificationTokens).values({
      identifier: normalizedEmail,
      token,
      expires,
    });

    // TODO: Send password reset email
    // For development, log the reset link
    const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3001"}/reset-password?token=${token}`;
    console.log("Password reset link:", resetUrl);

    return NextResponse.json({
      success: true,
      data: {
        message: "If an account exists, a reset link has been sent.",
      },
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
