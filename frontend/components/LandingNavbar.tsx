import Link from "next/link";

import { Button } from "@/components/ui/button";

export const LandingNavbar = () => {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 sm:px-8">
      <Link href="/" className="text-lg font-bold text-primary">
        FlowShield
      </Link>
      <Button variant="outline" asChild className="px-8 font-medium">
        <Link href="/login">Log In</Link>
      </Button>
    </nav>
  );
};
