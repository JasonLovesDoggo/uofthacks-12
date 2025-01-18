import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

const NavLink = ({ children, className, ...props }: NavLinkProps) => {
  return (
    <Link
      className={cn(
        "group relative flex items-center px-4 py-2 text-center text-sm font-semibold transition-colors hover:bg-gray-100 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-center scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100" />
    </Link>
  );
};

export default NavLink;
