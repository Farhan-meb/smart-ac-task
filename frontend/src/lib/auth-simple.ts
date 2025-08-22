import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptionsSimple: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // For testing, accept any email/password
                return {
                    id: "1",
                    email: credentials.email,
                    name: "Test User",
                    firstName: "Test",
                    lastName: "User",
                    studentId: "12345",
                    programme: "Test Programme",
                    university: "Test University",
                    accessToken: "test-token",
                    refreshToken: "test-refresh-token",
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.refreshToken = user.refreshToken;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.studentId = user.studentId;
                token.programme = user.programme;
                token.university = user.university;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.sub!;
                session.user.accessToken = token.accessToken as string;
                session.user.refreshToken = token.refreshToken as string;
                session.user.firstName = token.firstName as string;
                session.user.lastName = token.lastName as string;
                session.user.studentId = token.studentId as string;
                session.user.programme = token.programme as string;
                session.user.university = token.university as string;
            }
            return session;
        },
    },
    pages: {
        signIn: "/auth/login",
        signUp: "/auth/register",
    },
    session: {
        strategy: "jwt",
    },
    secret: "test-secret-for-development",
    debug: true,
};
