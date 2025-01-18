import { getCurrentUserAccessToken } from "@/lib/db/services/user";
import { GmailClient } from "@/components/gmail/gmail-client";

export default async function GmailPage() {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <div>No access token found</div>;
  }

  return <GmailClient accessToken={accessToken} />;
}
