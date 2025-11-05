import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session extends DefaultSession {
        id_token?: string;
        user: DefaultUser & {
            id?: string;
            email?: string;
            name?: string;
            image?: string;
        };
    }

    interface User extends DefaultUser {
        id?: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        id_token?: string;
    }
}