"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ children, className, href, ...props }: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex items-center px-4 py-2 text-center text-sm font-medium transition-all hover:bg-gray-100 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2",
        isActive && "bg-gray-100 font-bold tracking-wide text-primary",
        className,
      )}
      {...props}
    >
      {children}
      <span
        className={cn(
          "absolute -bottom-1 left-0 h-0.5 w-full origin-center scale-x-0 bg-current transition-all duration-300 group-hover:scale-x-100",
          isActive && "h-[3px] scale-x-100",
        )}
      />
    </Link>
  );
};

export default NavLink;
