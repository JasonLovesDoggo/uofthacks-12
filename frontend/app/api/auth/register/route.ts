import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { ApiResponse } from "@/types/api";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getUserByEmail } from "@/lib/db/services/user";
import { RegisterSchema } from "@/lib/validations/register";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();

    const validation = RegisterSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({
        success: false,
        message: validation.error.errors[0].message,
      });
    }

    const { email: validatedEmail, name, password } = validation.data;

    const email = validatedEmail.toLowerCase();

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return NextResponse.json({
        success: false,
        message:
          "Failed to create account. Account may already exist, or the provided email is invalid.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
      emailVerified: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: "Account created successfully!",
    });
  } catch (error) {
    console.error("Error during registration:", error);

    return NextResponse.json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}
