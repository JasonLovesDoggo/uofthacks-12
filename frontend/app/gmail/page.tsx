import { getCurrentUserAccessToken } from "@/lib/db/services/user";
import { GmailClient } from "@/components/gmail/gmail-client";

export default async function GmailPage() {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <div>No access token found</div>;
  }

  return (
    <div>
      <p>{accessToken}</p>
      <GmailClient accessToken={accessToken} />
    </div>
  );
}
