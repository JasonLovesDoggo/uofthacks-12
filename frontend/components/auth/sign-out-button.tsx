"use client";

import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  onClick?: () => void;
};

const SignOutButton = ({ className, onClick }: Props) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center rounded-md border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => {
        onClick?.();
        signOut();
      }}
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
