"use client";

import { useState } from "react";

import { GmailError } from "./GmailError";
import { GmailMessages } from "./GmailMessages";
import { GmailProfile } from "./GmailProfile";
import { GmailThreads } from "./GmailThreads";
import { useGmailClient } from "./useGmailClient";

interface GmailClientProps {
  accessToken: string;
}

export function GmailClient({
  accessToken: initialAccessToken,
}: GmailClientProps) {
  const [accessToken, setAccessToken] = useState(initialAccessToken);
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
        setAccessToken(data.accessToken);
        return data.accessToken;
      } catch (error) {
        console.error("Token refresh failed:", error);
        throw error;
      }
    },
  });

  const handleManualRefresh = async () => {
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
      setAccessToken(data.accessToken);
    } catch (error) {
      console.error("Manual token refresh failed:", error);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-end">
        <button
          onClick={handleManualRefresh}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-600 hover:shadow-md active:bg-blue-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 16h5v5" />
          </svg>
          Refresh Connection
        </button>
      </div>
      <GmailError error={error} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
