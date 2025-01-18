"use client";

import { type GmailProfile } from "@/lib/gmail";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface GmailProfileProps {
  accessToken: string;
  profile: GmailProfile | null;
  loading: boolean;
  onFetchProfile: () => Promise<void>;
}

export function GmailProfile({
  accessToken,
  profile,
  loading,
  onFetchProfile,
}: GmailProfileProps) {
  return (
    <Card className="p-4">
      <h2 className="mb-2 font-bold">Profile</h2>
      <div className="space-y-2">
        <Button onClick={onFetchProfile} disabled={loading || !accessToken}>
          Get Profile
        </Button>
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    </Card>
  );
}
