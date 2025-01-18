import { getCurrentUser } from "@/lib/auth";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-svh bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h2 className="mb-4 text-2xl font-bold">Welcome to the App</h2>
        <p className="text-gray-600">
          {user
            ? "You are signed in and can access protected content."
            : "Please sign in to access all features."}
        </p>
      </div>
    </div>
  );
}
