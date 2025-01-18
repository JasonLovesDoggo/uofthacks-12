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
    <>
      <Card className="p-4">
        <h2 className="mb-2 font-bold">Messages</h2>
        <div className="space-y-2">
          <Button onClick={onFetchMessages} disabled={loading || !accessToken}>
            Get Messages
          </Button>
          {messages?.map((message) => (
            <div
              key={message.id}
              className="cursor-pointer rounded border p-2 hover:bg-gray-50"
              onClick={() => onSelectMessage(message.id)}
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
    </>
  );
}
