import { Card } from "@/components/ui/card";

interface GmailErrorProps {
  error: string;
}

export function GmailError({ error }: GmailErrorProps) {
  if (!error) return null;

  return (
    <Card className="overflow-hidden border-red-100 bg-red-50">
      <div className="flex items-center space-x-4 p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-medium text-red-800">Gmail Error</h3>
          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      </div>
    </Card>
  );
}
