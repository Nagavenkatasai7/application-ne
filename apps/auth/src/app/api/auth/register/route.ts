import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { db, users, eq } from "@resume-maker/db";
import { registerWithPasswordSchema } from "@resume-maker/types";
import { hashPassword } from "@resume-maker/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = registerWithPasswordSchema.safeParse(body);
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

    const { email, password, name } = parsed.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, normalizedEmail),
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "USER_EXISTS",
            message: "An account with this email already exists",
          },
        },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        id: randomUUID(),
        email: normalizedEmail,
        password: hashedPassword,
        name: name || null,
        emailVerified: null, // Will be verified via email
      })
      .returning({ id: users.id, email: users.email });

    // TODO: Send verification email
    // For now, we'll skip email verification in development

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser.id,
          email: newUser.email,
          message: "Account created. Please check your email to verify your account.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
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
