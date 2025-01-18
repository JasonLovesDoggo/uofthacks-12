import { cache } from "react";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { db } from "./db";
import { getUserByEmail } from "./db/services/user";
import { getGmailProfile } from "./gmail";
import { LoginSchema } from "./validations/login";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      emailVerified: Date | null;
      name: string | null;
    } & DefaultSession["user"];
  }
}

export const authConfig = {
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
  },
  cookies: {
    sessionToken: {
      name: "authjs.session-token",
    },
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
    Credentials({
      async authorize(credentials) {
        const validatedCredentials = LoginSchema.safeParse(credentials);

        if (!validatedCredentials.success) {
          return null;
        }

        const { email, password } = validatedCredentials.data;
        const user = await getUserByEmail(email);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return user;
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: any }) {
      if (token.user) {
        session.user = token.user;
      }

      return session;
    },
    async jwt({
      token,
      user,
      account,
      profile,
    }: {
      token: any;
      user: User & { emailVerified?: Date | null };
      account: any;
      profile?: any;
    }) {
      if (account?.provider === "google" && profile) {
        const googleProfile = profile as {
          email: string;
          name?: string;
          picture?: string;
          sub: string;
        };

        token.email = googleProfile.email;
        token.name = googleProfile.name || null;
        token.picture = googleProfile.picture || null;
        token.sub = googleProfile.sub;

        // Add Gmail-specific data
        if (account.access_token) {
          const gmailProfile = await getGmailProfile(account.access_token);
          if (gmailProfile) {
            console.log("Gmail profile data:", gmailProfile);
            token.gmail = gmailProfile;
          }
        }
      }

      if (user) {
        token.user = {
          id: user.id,
          email: user.email,
          emailVerified: user.emailVerified || null,
          name: user.name || null,
        };
      }

      return token;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);

export const getCurrentUser = cache(async () => {
  try {
    const session = await auth();
    if (!session?.user) {
      return null;
    }
    return session.user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
});
