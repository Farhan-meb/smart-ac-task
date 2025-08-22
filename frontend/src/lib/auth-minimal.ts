import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptionsMinimal: NextAuthOptions = {
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

                try {
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                    if (!apiUrl) {
                        console.error("NEXT_PUBLIC_API_URL is not defined");
                        return null;
                    }

                    console.log(
                        "Attempting to authenticate with:",
                        credentials.email
                    );
                    console.log("API URL:", `${apiUrl}/auth/login`);

                    const response = await fetch(`${apiUrl}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    console.log("Response status:", response.status);
                    const data = await response.json();
                    console.log("Response data:", data);

                    if (response.ok && data.data) {
                        return {
                            id: data.data.user.id,
                            email: data.data.user.email,
                            name: `${data.data.user.firstName} ${data.data.user.lastName}`,
                            firstName: data.data.user.firstName,
                            lastName: data.data.user.lastName,
                            studentId: data.data.user.studentId,
                            programme: data.data.user.programme,
                            university: data.data.user.university,
                            accessToken: data.data.token,
                            refreshToken: data.data.refreshToken,
                        };
                    }

                    // Handle error response from backend
                    if (data.error && data.error.message) {
                        throw new Error(data.error.message);
                    }

                    console.log("Authentication failed:", data);
                    return null;
                } catch (error) {
                    console.error("Auth error:", error);
                    if (error instanceof Error) {
                        throw error;
                    }
                    throw new Error("Authentication failed");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
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
                session.user.id = token.id as string;
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
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET || "test-secret",
    debug: process.env.NODE_ENV === "development",
};
