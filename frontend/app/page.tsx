import Link from "next/link";

import { getCurrentUser } from "@/lib/auth";
import SignOutButton from "@/components/auth/sign-out-button";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-svh bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Home</h1>
          {user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {user.name || user.email}</span>
              <SignOutButton />
            </div>
          ) : (
            <div className="flex gap-4">
              <Link
                href="/sign-in"
                className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">Welcome to the App</h2>
        <p className="text-gray-600">
          {user
            ? "You are signed in and can access protected content."
            : "Please sign in to access all features."}
        </p>
      </main>
    </div>
  );
}
