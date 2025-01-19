import { Suspense } from "react";

import { getCurrentUserAccessToken } from "@/lib/db/services/user";
import { GmailClient } from "@/components/gmail/gmail-client";

export const revalidate = 0;

export default async function GmailPage() {
  const accessToken = await getCurrentUserAccessToken();

  if (!accessToken) {
    return <div>No access token found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <GmailClient accessToken={accessToken} />
      </Suspense>
    </div>
  );
}
