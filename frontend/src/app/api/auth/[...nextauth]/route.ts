import { authOptionsMinimal } from "@/lib/auth-minimal";
import NextAuth from "next-auth";

const handler = NextAuth(authOptionsMinimal);

export { handler as GET, handler as POST };
