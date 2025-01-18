"use client";

import { useState } from "react";

import {
  getGmailProfile,
  getMessageDetails,
  getMessages,
  getThreadDetails,
  getThreads,
  type GmailMessage,
  type GmailProfile,
  type GmailThread,
} from "@/lib/gmail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GmailClientProps {
  accessToken: string;
}

export function GmailClient({ accessToken }: GmailClientProps) {
  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessage[] | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<GmailMessage | null>(
    null,
  );
  const [threads, setThreads] = useState<GmailThread[] | null>(null);
  const [selectedThread, setSelectedThread] = useState<GmailThread | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFetch = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError("");
    try {
      await fetchFn();
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto space-y-4 p-4">
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() =>
              handleFetch(async () => {
                const profile = await getGmailProfile(accessToken);
                setProfile(profile);
              })
            }
            disabled={loading || !accessToken}
          >
            Get Profile
          </Button>
          <Button
            onClick={() =>
              handleFetch(async () => {
                const messages = await getMessages(accessToken);
                setMessages(messages);
              })
            }
            disabled={loading || !accessToken}
          >
            Get Messages
          </Button>
          <Button
            onClick={() =>
              handleFetch(async () => {
                const threads = await getThreads(accessToken);
                setThreads(threads);
              })
            }
            disabled={loading || !accessToken}
          >
            Get Threads
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-2 font-bold">Profile</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 font-bold">Messages</h2>
          <div className="space-y-2">
            {messages?.map((message) => (
              <div
                key={message.id}
                className="cursor-pointer rounded border p-2 hover:bg-gray-50"
                onClick={() =>
                  handleFetch(async () => {
                    const details = await getMessageDetails(
                      accessToken,
                      message.id,
                    );
                    setSelectedMessage(details);
                  })
                }
              >
                {message.snippet}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 font-bold">Selected Message</h2>
          <pre>{JSON.stringify(selectedMessage, null, 2)}</pre>
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 font-bold">Threads</h2>
          <div className="space-y-2">
            {threads?.map((thread) => (
              <div
                key={thread.id}
                className="cursor-pointer rounded border p-2 hover:bg-gray-50"
                onClick={() =>
                  handleFetch(async () => {
                    const details = await getThreadDetails(
                      accessToken,
                      thread.id,
                    );
                    setSelectedThread(details);
                  })
                }
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
      </div>
    </div>
  );
}
