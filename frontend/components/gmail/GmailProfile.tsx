"use client";

import { type GmailProfile } from "@/lib/gmail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GmailProfileProps {
  accessToken: string;
  profile: GmailProfile | null;
  loading: boolean;
  onFetchProfile: () => Promise<void>;
}

export function GmailProfile({
  accessToken,
  profile,
  loading,
  onFetchProfile,
}: GmailProfileProps) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-gray-100 bg-gray-50/50 p-4">
        <h2 className="text-lg font-semibold">Gmail Profile</h2>
      </div>
      <div className="space-y-4 p-4">
        {!profile ? (
          <div className="flex flex-col items-center justify-center space-y-3 py-8">
            <svg
              className="h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
            <p className="text-sm text-gray-500">No profile data loaded</p>
            <Button
              onClick={onFetchProfile}
              disabled={loading || !accessToken}
              className="mt-2"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading...
                </div>
              ) : (
                "Load Profile"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <svg
                  className="h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">
                  {profile.emailAddress}
                </h3>
                <p className="text-sm text-gray-500">Gmail Account</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-4">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Messages Total</dt>
                  <dd className="font-medium">{profile.messagesTotal}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Threads Total</dt>
                  <dd className="font-medium">{profile.threadsTotal}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">History ID</dt>
                  <dd className="font-mono text-xs">{profile.historyId}</dd>
                </div>
              </dl>
            </div>
            <Button
              onClick={onFetchProfile}
              disabled={loading}
              variant="outline"
              size="sm"
              className="w-full"
            >
              {loading ? "Refreshing..." : "Refresh Profile"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
