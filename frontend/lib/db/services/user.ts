import { eq } from "drizzle-orm";

import { db } from "..";
import { users } from "../schema";

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
