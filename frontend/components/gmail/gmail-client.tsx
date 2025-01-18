"use client";

import { GmailError } from "./GmailError";
import { GmailMessages } from "./GmailMessages";
import { GmailProfile } from "./GmailProfile";
import { GmailThreads } from "./GmailThreads";
import { useGmailClient } from "./useGmailClient";

interface GmailClientProps {
  accessToken: string;
}

export function GmailClient({ accessToken }: GmailClientProps) {
  const {
    profile,
    messages,
    selectedMessage,
    threads,
    selectedThread,
    loading,
    error,
    fetchProfile,
    fetchMessages,
    fetchMessageDetails,
    fetchThreads,
    fetchThreadDetails,
    handleFetch,
  } = useGmailClient({
    accessToken,
    onTokenExpired: async () => {
      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to refresh token");
        }

        const data = await response.json();
        return data.accessToken;
      } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
      }
    },
  });

  return (
    <div className="container mx-auto space-y-4 p-4">
      <p>{accessToken}</p>
      <GmailError error={error} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <GmailProfile
          accessToken={accessToken}
          profile={profile}
          loading={loading}
          onFetchProfile={() => handleFetch(fetchProfile)}
        />

        <GmailMessages
          accessToken={accessToken}
          messages={messages}
          selectedMessage={selectedMessage}
          loading={loading}
          onFetchMessages={() => handleFetch(fetchMessages)}
          onSelectMessage={(messageId) =>
            handleFetch(() => fetchMessageDetails(messageId))
          }
        />

        <GmailThreads
          accessToken={accessToken}
          threads={threads}
          selectedThread={selectedThread}
          loading={loading}
          onFetchThreads={() => handleFetch(fetchThreads)}
          onSelectThread={(threadId) =>
            handleFetch(() => fetchThreadDetails(threadId))
          }
        />
      </div>
    </div>
  );
}
