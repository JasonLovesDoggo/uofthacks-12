import type { NextAuthConfig } from "next-auth";

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

export async function getGmailProfile(
  accessToken: string,
): Promise<GmailProfile | null> {
  try {
    const response = await fetch(
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return {
        emailAddress: data.emailAddress,
        messagesTotal: data.messagesTotal,
        threadsTotal: data.threadsTotal,
        historyId: data.historyId,
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching Gmail profile:", error);
    return null;
  }
}
