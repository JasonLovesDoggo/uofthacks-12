"use client";

import { type GmailThread } from "@/lib/gmail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GmailThreadsProps {
  accessToken: string;
  threads: GmailThread[] | null;
  selectedThread: GmailThread | null;
  loading: boolean;
  onFetchThreads: () => Promise<void>;
  onSelectThread: (threadId: string) => Promise<void>;
}

export function GmailThreads({
  accessToken,
  threads,
  selectedThread,
  loading,
  onFetchThreads,
  onSelectThread,
}: GmailThreadsProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <h2 className="text-lg font-semibold">Email Threads</h2>
        </div>
        <div className="p-4">
          {!threads ? (
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
                  d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
              <p className="text-sm text-gray-500">No threads loaded</p>
              <Button
                onClick={onFetchThreads}
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
                  "Load Threads"
                )}
              </Button>
            </div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <p className="text-sm text-gray-500">No threads found</p>
              <Button
                onClick={onFetchThreads}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? "Refreshing..." : "Refresh Threads"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                {threads.map((thread) => (
                  <button
                    key={thread.id}
                    onClick={() => onSelectThread(thread.id)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      selectedThread?.id === thread.id
                        ? "bg-blue-50/50"
                        : "bg-white"
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="line-clamp-2 text-sm">{thread.snippet}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          {thread.messages?.length || 0} messages in thread
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={onFetchThreads}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {loading ? "Refreshing..." : "Refresh Threads"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {selectedThread && (
        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 p-4">
            <h2 className="text-lg font-semibold">Thread Messages</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {selectedThread.messages?.map((message) => (
              <div key={message.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <svg
                          className="h-4 w-4"
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
                      <div className="flex flex-wrap gap-1">
                        {message.labelIds.map((label) => (
                          <span
                            key={label}
                            className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <time className="text-xs text-gray-500">
                      {new Date(Number(message.internalDate)).toLocaleString()}
                    </time>
                  </div>
                  <p className="text-sm">{message.snippet}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
