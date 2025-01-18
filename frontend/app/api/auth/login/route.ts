import { NextRequest, NextResponse } from "next/server";
import { AuthError } from "next-auth";

import { ApiResponse } from "@/types/api";
import { signIn } from "@/lib/auth";
import { getUserByEmail } from "@/lib/db/services/user";
import { LoginSchema } from "@/lib/validations/login";

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();

    const validatedFields = LoginSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { email: validatedEmail, password } = validatedFields.data;

    const email = validatedEmail.toLowerCase();

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result) {
      return NextResponse.json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Welcome!",
    });
  } catch (error) {
    console.error("Error during login:", error);

    if (error instanceof Error) {
      const { type } = error as AuthError;
      if (type === "CredentialsSignin") {
        return NextResponse.json({
          success: false,
          message: "Invalid email or password.",
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: "Something went wrong, please try again.",
    });
  }
}
