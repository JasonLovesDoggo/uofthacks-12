import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { google } from "googleapis";

import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export async function POST() {
  try {
    // Get the user's account record
    const [account] = await db
      .select()
      .from(accounts)
      .where(eq(accounts.provider, "google"))
      .limit(1);

    if (!account || !account.refresh_token) {
      return NextResponse.json(
        { error: "No refresh token found" },
        { status: 401 },
      );
    }

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
    );

    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: account.refresh_token,
    });

    // Get new access token
    const { credentials } = await oauth2Client.refreshAccessToken();

    // Update account with new tokens
    await db
      .update(accounts)
      .set({
        access_token: credentials.access_token,
        expires_at: credentials.expiry_date
          ? Math.floor(credentials.expiry_date / 1000)
          : null,
      })
      .where(
        eq(accounts.provider, account.provider) &&
          eq(accounts.providerAccountId, account.providerAccountId),
      );

    return NextResponse.json({
      accessToken: credentials.access_token,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
  }
}
