"use client";

import { Navigation } from "@/components/navigation";

interface AppLayoutProps {
    children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="flex h-screen">
                <Navigation />
                <main className="flex-1 overflow-auto">
                    <div className="min-h-full">{children}</div>
                </main>
            </div>
        </div>
    );
}
