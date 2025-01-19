"use client";

import { useEffect, useState } from "react";

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

  // Keep track of the latest token
  const [currentToken, setCurrentToken] = useState(accessToken);

  // Update currentToken when accessToken prop changes
  useEffect(() => {
    setCurrentToken(accessToken);
  }, [accessToken]);

  const handleFetch = async (fetchFn: () => Promise<any>) => {
    setLoading(true);
    setError("");
    try {
      await fetchFn();
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        console.error("Token expired, refreshing...");
        try {
          const newToken = await onTokenExpired();
          setCurrentToken(newToken);
          // Retry the original operation with new token
          if (fetchFn === fetchProfile) {
            const profile = await getGmailProfile(newToken);
            setProfile(profile);
          } else if (fetchFn === fetchMessages) {
            const messages = await getMessages(newToken);
            setMessages(messages);
          } else if (fetchFn === fetchThreads) {
            const threads = await getThreads(newToken);
            setThreads(threads);
          } else {
            // For functions with parameters (messageDetails, threadDetails)
            // We'll retry with the captured parameters in their closures
            await fetchFn();
          }
        } catch (refreshError) {
          setError("Your session has expired. Please sign in again.");
        }
      } else {
        setError("An error occurred. Please try again.");
      }
      console.error("Something bad happened:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    const profile = await getGmailProfile(currentToken);
    setProfile(profile);
  };

  const fetchMessages = async () => {
    const messages = await getMessages(currentToken);
    setMessages(messages);
  };

  const fetchMessageDetails = async (messageId: string) => {
    const details = await getMessageDetails(currentToken, messageId);
    setSelectedMessage(details);
  };

  const fetchThreads = async () => {
    const threads = await getThreads(currentToken);
    setThreads(threads);
  };

  const fetchThreadDetails = async (threadId: string) => {
    const details = await getThreadDetails(currentToken, threadId);
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
