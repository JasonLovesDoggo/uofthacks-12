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
      console.log(data);

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

export interface GmailMessage {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  historyId: string;
  internalDate: string;
}

export interface GmailThread {
  id: string;
  historyId: string;
  messages: GmailMessage[];
  snippet: string;
}

export async function getMessages(
  accessToken: string,
  maxResults: number = 10,
): Promise<GmailMessage[] | null> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();

      // Fetch details for each message
      const messageDetailsPromises = data.messages.map(
        (message: { id: string }) => getMessageDetails(accessToken, message.id),
      );

      const messageDetails = await Promise.all(messageDetailsPromises);

      // Filter out any null results
      return messageDetails.filter(
        (message): message is GmailMessage => message !== null,
      );
    }
    return null;
  } catch (error) {
    console.error("Error fetching Gmail messages:", error);
    return null;
  }
}

export async function getMessageDetails(
  accessToken: string,
  messageId: string,
): Promise<GmailMessage | null> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching message details:", error);
    return null;
  }
}

export async function getThreads(
  accessToken: string,
  maxResults: number = 10,
): Promise<GmailThread[] | null> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads?maxResults=${maxResults}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      return data.threads;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Gmail threads:", error);
    return null;
  }
}

export async function getThreadDetails(
  accessToken: string,
  threadId: string,
): Promise<GmailThread | null> {
  try {
    const response = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/threads/${threadId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error("Error fetching thread details:", error);
    return null;
  }
}
