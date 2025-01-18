import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";
import MobileMenu from "./ui/mobile-menu";
import NavLink from "./ui/nav-link";
import { UserButton } from "./ui/user-button";

type Props = {};

const Navbar = ({}: Props) => {
  return (
    <header className="hover:border-gradient-to-r fixed left-0 top-0 z-40 w-full border-b border-transparent bg-background/95 shadow-md backdrop-blur transition-all duration-300 hover:border-b hover:from-primary/10 hover:via-primary/20 hover:to-primary/10 supports-[backdrop-filter]:bg-background/60">
      <div className="container relative mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-20 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/shield.svg"
            alt="Logo"
            width={1}
            height={1}
            className="size-8 text-primary"
          />
          <span className="text-xl font-bold tracking-tighter text-primary">
            LOGO
          </span>
        </Link>

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Navigation Menu */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          <NavLink
            href="/"
            className="transition-colors duration-200 hover:text-primary/80"
          >
            Dashboard
          </NavLink>
          <NavLink
            href="/workflows"
            className="transition-colors duration-200 hover:text-primary/80"
          >
            Workflows
          </NavLink>
          <NavLink
            href="/logs"
            className="transition-colors duration-200 hover:text-primary/80"
          >
            Logs
          </NavLink>
          <NavLink
            href="/settings"
            className="transition-colors duration-200 hover:text-primary/80"
          >
            Settings
          </NavLink>
        </nav>

        {/* Right-aligned buttons */}
        <div className="hidden items-center gap-4 md:flex">
          <Button
            asChild
            variant="outline"
            className="h-9 rounded-lg border-primary/20 bg-primary/5 px-4 font-medium text-primary/90 transition-all hover:bg-primary/10 hover:text-primary"
          >
            <Link href="/workflows/create">Create Workflow</Link>
          </Button>
          <UserButton />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
