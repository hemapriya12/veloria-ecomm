import CredentialsProvider from "next-auth/providers/credentials";
import type { DefaultSession, NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { SignJWT } from "jose";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: string;
      token: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          }
        );

        if (!res.ok) return null;

        const user = await res.json();
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as {
          id: string;
          email?: string | null;
          name?: string | null;
          role?: string;
        };
        return {
          ...token,
          id: authUser.id,
          email: authUser.email,
          name: authUser.name,
          role: authUser.role ?? "",
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        // Generate a fresh API token on every session access so it never goes stale
        const secret = new TextEncoder().encode(
          process.env.NEXTAUTH_SECRET ?? "secret"
        );
        const apiToken = await new SignJWT({
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
        })
          .setProtectedHeader({ alg: "HS256" })
          .setIssuedAt()
          .setExpirationTime("1h")
          .sign(secret);

        session.user = {
          ...session.user,
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          role: token.role as string,
          token: apiToken,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
