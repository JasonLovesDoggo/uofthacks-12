import { Squares } from "@/components/ui/squares-background";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-svh">
      <div className="absolute inset-0">
        <Squares className="h-full w-full" />
      </div>
      <div className="flex min-h-svh items-center justify-center">
        <div className="mx-auto h-full w-full max-w-lg px-4 py-16 md:py-20 xl:py-24">
          {children}
        </div>
      </div>
    </div>
  );
}
