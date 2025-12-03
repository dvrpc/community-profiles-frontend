import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // authorization: { params: { hd: "dvrpc.org" } },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = ["ckirby@dvrpc.org"];
      return allowedEmails.includes(user.email!);
    },
    async jwt({ token, account }) {
      if (account) {
        token.id_token = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose it in the session object
      session.id_token = token.id_token as string;
      return session;
    },
  },
  cookies: {
    state: {
      name: "__Secure-next-auth.state",
      options: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        path: "/community-profiles",
      },
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 3600, // 1 hour
  },
};

export const diff = <T extends object>(initial: T, current: T): Partial<T> => {
  const changed: Partial<T> = {};

  (Object.keys(current) as (keyof T)[]).forEach((key) => {
    const a = initial[key];
    const b = current[key];

    let isEqual = false;

    if (typeof a === "string" && typeof b === "string") {
      isEqual = (a || "") === (b || "");
    } else if (Array.isArray(a) && Array.isArray(b)) {
      type Elem = T[typeof key] extends (infer U)[] ? U : never;

      isEqual =
        a.length === b.length && a.every((v, i) => v === (b as Elem[])[i]);
    } else {
      isEqual = a === b;
    }

    if (!isEqual) {
      changed[key] = b;
    }
  });

  return changed;
};
