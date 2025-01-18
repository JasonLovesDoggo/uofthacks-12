import Link from "next/link";

import { auth, signOut } from "@/lib/auth";

export default async function HomePage() {
  const session = await auth();

  return (
    <div className="min-h-svh bg-gray-50">
      <nav className="bg-white shadow">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold">Home</h1>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span>Welcome, {session.user.name || session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-600"
                >
                  Sign Out
                </button>
              </form>
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
          {session?.user
            ? "You are signed in and can access protected content."
            : "Please sign in to access all features."}
        </p>
      </main>
    </div>
  );
}
