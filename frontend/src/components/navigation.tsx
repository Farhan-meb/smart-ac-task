"use client";

import {
    BookOpen,
    Calendar,
    ChevronDown,
    Home,
    LogOut,
    Menu,
    Settings,
    Tag,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Tasks", href: "/tasks", icon: Calendar },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Categories", href: "/categories", icon: Tag },
    { name: "Settings", href: "/settings", icon: Settings },
];

export function Navigation() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const pathname = usePathname();
    const { data: session } = useSession();

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/auth/login" });
    };

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSidebarOpen(true)}
                    className="fixed top-4 left-4 z-50 bg-white shadow-lg border-slate-200 hover:bg-slate-50"
                >
                    <Menu className="h-4 w-4" />
                </Button>
            </div>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-xl flex flex-col",
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex-shrink-0 flex h-16 items-center px-6 border-b border-slate-200 bg-white">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg">
                            <span className="text-sm font-bold text-white">
                                AP
                            </span>
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-slate-900">
                                Academic Planner
                            </h1>
                            <p className="text-xs text-slate-500 font-medium">
                                Task Management System
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto lg:hidden hover:bg-slate-100"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Navigation - Scrollable */}
                <div className="flex-1 overflow-y-auto py-6">
                    <nav className="px-4">
                        <div className="space-y-1">
                            {navigation.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setSidebarOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 group",
                                            isActive
                                                ? "bg-primary text-white shadow-md"
                                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                        )}
                                    >
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                isActive
                                                    ? "text-white"
                                                    : "text-slate-500 group-hover:text-slate-700"
                                            )}
                                        />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>
                </div>

                {/* Sticky Footer - User Profile & Dropdown */}
                <div className="flex-shrink-0 border-t border-slate-200 bg-slate-50 p-4">
                    {session?.user && (
                        <DropdownMenu
                            open={userDropdownOpen}
                            onOpenChange={setUserDropdownOpen}
                        >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between px-3 py-3 rounded-xl bg-white shadow-sm border border-slate-200 hover:bg-slate-50"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary shadow-md">
                                            <User className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-bold text-slate-900 truncate">
                                                {session.user.firstName}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate">
                                                {session.user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronDown
                                        className={cn(
                                            "h-4 w-4 text-slate-500 transition-transform duration-200",
                                            userDropdownOpen && "rotate-180"
                                        )}
                                    />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="text-red-600 focus:text-red-600 cursor-pointer"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </>
    );
}
