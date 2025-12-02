import { NextResponse } from "next/server";
import { db, users, verificationTokens, eq, and, gt } from "@resume-maker/db";
import { resetPasswordWithTokenSchema } from "@resume-maker/types";
import { hashPassword } from "@resume-maker/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = resetPasswordWithTokenSchema.safeParse(body);
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

    const { token, newPassword } = parsed.data;

    // Find the token and check if it's still valid
    const tokenRecord = await db.query.verificationTokens.findFirst({
      where: and(
        eq(verificationTokens.token, token),
        gt(verificationTokens.expires, new Date())
      ),
    });

    if (!tokenRecord) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_TOKEN",
            message: "This reset link is invalid or has expired",
          },
        },
        { status: 400 }
      );
    }

    // Find the user by email (identifier)
    const user = await db.query.users.findFirst({
      where: eq(users.email, tokenRecord.identifier),
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_NOT_FOUND",
            message: "User not found",
          },
        },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    // Update the user's password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        emailVerified: new Date(), // Also verify email since they clicked the link
      })
      .where(eq(users.id, user.id));

    // Delete the used token
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.token, token));

    return NextResponse.json({
      success: true,
      data: {
        message: "Password has been reset successfully",
      },
    });
  } catch (error) {
    console.error("Reset password error:", error);
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
