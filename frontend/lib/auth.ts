import bcrypt from "bcryptjs";
import type { DefaultSession, NextAuthConfig, Session, User } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUserByEmail } from "./db/services/user";
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
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/gmail.readonly",
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
      console.log("Google credentials in session callback", {
        email: token.email,
        name: token.name,
        picture: token.picture,
        sub: token.sub,
      });

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
        console.log("Google profile", profile);

        const googleProfile = profile as {
          email: string;
          name?: string;
          picture?: string;
          sub: string;
        };

        console.log("Google credentials in jwt callback", {
          email: googleProfile.email,
          name: googleProfile.name,
          picture: googleProfile.picture,
          sub: googleProfile.sub,
        });

        token.email = googleProfile.email;
        token.name = googleProfile.name || null;
        token.picture = googleProfile.picture || null;
        token.sub = googleProfile.sub;

        // Add Gmail-specific data
        if (account.access_token) {
          try {
            const gmailResponse = await fetch(
              "https://gmail.googleapis.com/gmail/v1/users/me/profile",
              {
                headers: {
                  Authorization: `Bearer ${account.access_token}`,
                },
              },
            );

            if (gmailResponse.ok) {
              const gmailData = await gmailResponse.json();
              console.log("Gmail profile data:", gmailData);
              token.gmail = {
                emailAddress: gmailData.emailAddress,
                messagesTotal: gmailData.messagesTotal,
                threadsTotal: gmailData.threadsTotal,
                historyId: gmailData.historyId,
              };
            }
          } catch (error) {
            console.error("Error fetching Gmail profile:", error);
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
