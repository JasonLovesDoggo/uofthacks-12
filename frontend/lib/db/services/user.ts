import { eq } from "drizzle-orm";

import { getCurrentUser } from "@/lib/auth";

import { db } from "..";
import { accounts, users } from "../schema";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
    return user[0];
  } catch (error) {
    console.error("Error fetching user in getUserByEmail function: ", error);
    return null;
  }
};

export const getCurrentUserAccessToken = async (): Promise<string | null> => {
  try {
    const user = await getCurrentUser();
    if (user) {
      const accessToken = await db
        .select()
        .from(accounts)
        .where(eq(accounts.userId, user.id))
        .limit(1);
      return accessToken[0]?.access_token;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user access token: ", error);
    return null;
  }
};
