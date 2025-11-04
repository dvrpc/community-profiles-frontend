import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: { params: { hd: "dvrpc.org" } },
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
    session: { strategy: "jwt" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };