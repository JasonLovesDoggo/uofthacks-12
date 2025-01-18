"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

import { Button } from "./button";
import NavLink from "./nav-link";

const lineVariants = {
  closed: { rotate: 0, y: 0 },
  open: (index: number) => ({
    rotate: index === 0 ? 405 : -405,
    y: index === 0 ? 6 : -6,
  }),
};

const AnimatedMenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <div className="relative size-6">
      {[0, 1].map((index) => (
        <motion.div
          key={index}
          className="absolute h-0.5 w-6 rounded-full bg-foreground"
          style={{
            originX: 0.5,
            originY: 0.5,
            top: index === 0 ? "25%" : "75%",
          }}
          variants={lineVariants}
          custom={index}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
          }}
        />
      ))}
    </div>
  );
};

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;

    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  return (
    <>
      <button
        className="rounded-lg p-2 text-foreground/60 transition-all hover:bg-gray-100 hover:text-foreground focus:outline-none md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AnimatedMenuIcon isOpen={isOpen} />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 mt-16 bg-black/50 transition-opacity md:mt-20 md:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      >
        {/* Menu Panel */}
        <div
          className={`fixed inset-y-0 right-0 z-50 mt-16 flex w-72 flex-col overflow-y-auto bg-background shadow-lg shadow-black/25 transition-transform duration-300 max-sm:w-full md:mt-20 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex-1 overflow-y-auto border-t px-6 py-4">
            <nav className="flex flex-col space-y-2">
              <NavLink
                href="/"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2"
              >
                Home
              </NavLink>
              <NavLink
                href="/workflows"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2"
              >
                Workflows
              </NavLink>
              <NavLink
                href="/logs"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2"
              >
                Logs
              </NavLink>
              <NavLink
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-2"
              >
                Settings
              </NavLink>
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex flex-col space-y-2">
              <Button asChild variant="outline" className="w-full">
                <Link href="/workflows/create" onClick={() => setIsOpen(false)}>
                  Create Workflow
                </Link>
              </Button>
              <Button variant="outline" className="w-full">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
