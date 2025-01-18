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

interface UseGmailClientProps {
  accessToken: string;
  onTokenExpired: () => Promise<string>;
}

export function useGmailClient({
  accessToken,
  onTokenExpired,
}: UseGmailClientProps) {
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
      if (err instanceof Error && err.message.includes("401")) {
        try {
          const newToken = await onTokenExpired();
          await fetchFn();
        } catch (refreshError) {
          setError("Your session has expired. Please sign in again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const profile = await getGmailProfile(accessToken);
    setProfile(profile);
  };

  const fetchMessages = async () => {
    const messages = await getMessages(accessToken);
    setMessages(messages);
  };

  const fetchMessageDetails = async (messageId: string) => {
    const details = await getMessageDetails(accessToken, messageId);
    setSelectedMessage(details);
  };

  const fetchThreads = async () => {
    const threads = await getThreads(accessToken);
    setThreads(threads);
  };

  const fetchThreadDetails = async (threadId: string) => {
    const details = await getThreadDetails(accessToken, threadId);
    setSelectedThread(details);
  };

  return {
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
  };
}
