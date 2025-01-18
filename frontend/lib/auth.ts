import bcrypt from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import { getUserByEmail } from "./db/services/user";
import { LoginSchema } from "./validations/login";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
  // callbacks: {
  //   async session({ session, token }) {
  //     // Send properties to the client readable on the session object
  //     console.log("JWT token in session callback", { token });
  //     if (token.user) {
  //       session.user = token.user;
  //     }

  //     return session;
  //   },
  //   async jwt({ token }) {
  //     return token;
  //   },
  // },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
