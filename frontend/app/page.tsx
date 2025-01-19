import Link from "next/link";

import { Button } from "@/components/ui/button";
import { LandingNavbar } from "@/components/LandingNavbar";

export default function Home() {
  return (
    <>
      <LandingNavbar />
      <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-16">
        <div className="flex w-full flex-col items-center gap-6 text-center">
          <div className="flex flex-col gap-2 font-montserrat">
            <h1 className="text-4xl font-bold text-[#14255F] sm:text-5xl">
              Customize and Automate
            </h1>
            <h1 className="text-4xl font-bold text-[#14255F] sm:text-5xl">
              your protection
            </h1>
          </div>

          <Button asChild className="px-8 py-6 text-lg font-semibold">
            <Link href="/sign-up">Get Started</Link>
          </Button>

          <div className="relative mt-8 w-full max-w-4xl rounded-lg border bg-white p-2 shadow-lg">
            {/* Browser Controls */}
            <div className="flex items-center gap-1.5 pb-2">
              <div className="h-3 w-3 rounded-full bg-[#FF605C]" />
              <div className="h-3 w-3 rounded-full bg-[#FFBD44]" />
              <div className="h-3 w-3 rounded-full bg-[#00CA4E]" />
              <div className="ml-4 flex items-center gap-2">
                <div className="flex h-7 w-full items-center rounded-md bg-gray-100 px-3">
                  <span className="text-xs text-gray-600">
                    www.flowshield.co
                  </span>
                </div>
              </div>
            </div>

            {/* Browser Content */}
            <div className="flex gap-4 rounded-lg bg-gray-50 p-4">
              {/* Left Sidebar */}
              <div className="flex w-64 flex-col gap-4 rounded-lg bg-white p-4 shadow-sm">
                <div className="text-sm font-medium text-gray-500">BLOCKS</div>

                {/* Email Block */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-100 transition-all duration-200 group-hover:bg-blue-200">
                    <div className="h-4 w-4 rounded bg-blue-500 transition-all duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-gray-900">Email</span>
                    <span className="text-xs text-gray-600">
                      When a new email arrives
                    </span>
                  </div>
                </div>

                {/* Condition Block */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50/50 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-100 transition-all duration-200 group-hover:bg-red-200">
                    <div className="h-4 w-4 rounded bg-red-500 transition-all duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-gray-900">Condition</span>
                    <span className="text-xs text-gray-600">
                      Checks for criteria
                    </span>
                  </div>
                </div>

                {/* Action Block */}
                <div className="group flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3.5 shadow-sm transition-all duration-200 hover:border-green-200 hover:bg-green-50/50 hover:shadow-md">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-100 transition-all duration-200 group-hover:bg-green-200">
                    <div className="h-4 w-4 rounded bg-green-500 transition-all duration-200 group-hover:scale-110" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-medium text-gray-900">Action</span>
                    <span className="text-xs text-gray-600">
                      Performs task(s)
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Content Area */}
              <div className="flex flex-1 flex-col gap-4">
                {/* Email Block */}
                <div className="rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 p-5 text-white shadow-lg shadow-blue-500/20 ring-1 ring-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Email</span>
                    <button className="rounded-md p-1 hover:bg-white/10">
                      <span className="text-xl leading-none">···</span>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-blue-50">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 6L12 13L2 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>Connected to test@test.com</span>
                  </div>
                </div>

                {/* Action Block */}
                <div className="rounded-lg bg-gradient-to-br from-green-500 to-green-600 p-5 text-white shadow-lg shadow-green-500/20 ring-1 ring-black/5">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium">Action</span>
                    <button className="rounded-md p-1 hover:bg-white/10">
                      <span className="text-xl leading-none">···</span>
                    </button>
                  </div>
                  <div className="mt-4">
                    <div className="overflow-hidden rounded-md bg-white/10 p-2 ring-1 ring-white/20">
                      <select className="w-full bg-transparent text-sm text-white outline-none hover:cursor-pointer">
                        <option className="bg-blue-600">
                          Select an action...
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
