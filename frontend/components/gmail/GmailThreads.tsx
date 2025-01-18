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
    <>
      <Card className="p-4">
        <h2 className="mb-2 font-bold">Threads</h2>
        <div className="space-y-2">
          <Button onClick={onFetchThreads} disabled={loading || !accessToken}>
            Get Threads
          </Button>
          {threads?.map((thread) => (
            <div
              key={thread.id}
              className="cursor-pointer rounded border p-2 hover:bg-gray-50"
              onClick={() => onSelectThread(thread.id)}
            >
              {thread.snippet}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="mb-2 font-bold">Selected Thread</h2>
        <pre>{JSON.stringify(selectedThread, null, 2)}</pre>
      </Card>
    </>
  );
}
