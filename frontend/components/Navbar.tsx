import Link from "next/link";

import { Button } from "./ui/button";
import MobileMenu from "./ui/mobile-menu";
import NavLink from "./ui/nav-link";

type Props = {};

const Navbar = ({}: Props) => {
  return (
    <header className="fixed left-0 top-0 z-50 w-full bg-background shadow-md">
      <div className="container relative mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 md:h-20 md:px-6">
        {/* Logo placeholder */}
        <div className="text-xl font-bold">LOGO</div>

        {/* Mobile Menu */}
        <MobileMenu />

        {/* Navigation Menu */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8 xl:gap-12">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/workflows">Workflows</NavLink>
          <NavLink href="/logs">Logs</NavLink>
          <NavLink href="/settings">Settings</NavLink>
        </nav>

        {/* Right-aligned buttons */}
        <div className="hidden gap-2 md:flex">
          <Button asChild variant="outline">
            <Link href="/workflows/create">Create</Link>
          </Button>
          <Button variant="outline">Sign Out</Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
