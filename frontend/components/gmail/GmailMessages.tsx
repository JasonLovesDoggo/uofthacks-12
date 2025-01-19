"use client";

import { type GmailMessage } from "@/lib/gmail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GmailMessagesProps {
  accessToken: string;
  messages: GmailMessage[] | null;
  selectedMessage: GmailMessage | null;
  loading: boolean;
  onFetchMessages: () => Promise<void>;
  onSelectMessage: (messageId: string) => Promise<void>;
}

export function GmailMessages({
  accessToken,
  messages,
  selectedMessage,
  loading,
  onFetchMessages,
  onSelectMessage,
}: GmailMessagesProps) {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 p-4">
          <h2 className="text-lg font-semibold">Messages</h2>
        </div>
        <div className="p-4">
          {!messages ? (
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
                  d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                />
              </svg>
              <p className="text-sm text-gray-500">No messages loaded</p>
              <Button
                onClick={onFetchMessages}
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
                  "Load Messages"
                )}
              </Button>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-8">
              <p className="text-sm text-gray-500">No messages found</p>
              <Button
                onClick={onFetchMessages}
                disabled={loading}
                variant="outline"
                size="sm"
              >
                {loading ? "Refreshing..." : "Refresh Messages"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="divide-y divide-gray-100 rounded-lg border border-gray-100">
                {messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => onSelectMessage(message.id)}
                    className={`w-full px-4 py-3 text-left transition-colors hover:bg-gray-50 ${
                      selectedMessage?.id === message.id
                        ? "bg-blue-50/50"
                        : "bg-white"
                    }`}
                    disabled={loading}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-2 text-sm">{message.snippet}</p>
                      <time className="shrink-0 text-xs text-gray-500">
                        {new Date(
                          Number(message.internalDate),
                        ).toLocaleDateString()}
                      </time>
                    </div>
                  </button>
                ))}
              </div>
              <Button
                onClick={onFetchMessages}
                disabled={loading}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {loading ? "Refreshing..." : "Refresh Messages"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      {selectedMessage && (
        <Card className="overflow-hidden">
          <div className="border-b border-gray-100 bg-gray-50/50 p-4">
            <h2 className="text-lg font-semibold">Selected Message</h2>
          </div>
          <div className="space-y-4 p-4">
            <div className="rounded-lg bg-gray-50 p-4">
              <dl className="space-y-2 text-sm">
                <div>
                  <dt className="text-gray-500">Message ID</dt>
                  <dd className="font-mono text-xs">{selectedMessage.id}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Thread ID</dt>
                  <dd className="font-mono text-xs">
                    {selectedMessage.threadId}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Labels</dt>
                  <dd className="flex flex-wrap gap-1">
                    {selectedMessage.labelIds.map((label) => (
                      <span
                        key={label}
                        className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700"
                      >
                        {label}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Date</dt>
                  <dd className="font-medium">
                    {new Date(
                      Number(selectedMessage.internalDate),
                    ).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Snippet</dt>
                  <dd className="font-medium">{selectedMessage.snippet}</dd>
                </div>
              </dl>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
