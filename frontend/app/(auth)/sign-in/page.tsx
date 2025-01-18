"use client";

import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <button
        onClick={() => signIn("google")}
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </div>
  );
};
export default SignInPage;
