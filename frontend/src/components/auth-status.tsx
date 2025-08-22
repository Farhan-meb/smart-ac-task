"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export function AuthStatus() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return (
            <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-gray-600">Loading...</span>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="flex items-center space-x-2">
                <Badge variant="destructive">Not authenticated</Badge>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4">
            <div className="text-sm">
                <span className="text-gray-600">Welcome, </span>
                <span className="font-medium">
                    {session?.user?.firstName} {session?.user?.lastName}
                </span>
                <div className="text-xs text-gray-500">
                    {session?.user?.email}
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
                Sign out
            </Button>
        </div>
    );
}
