import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Smart Academic Task Planner",
    description:
        "A comprehensive web-based application designed specifically for Masters students to manage academic tasks, deadlines, and research projects effectively.",
    keywords: [
        "academic",
        "task-planner",
        "masters-students",
        "productivity",
        "education",
    ],
    authors: [{ name: "Md Abdul Hafiz" }],
    creator: "Md Abdul Hafiz",
    publisher: "Smart Academic Task Planner",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL("http://localhost:3000"),
    openGraph: {
        title: "Smart Academic Task Planner",
        description:
            "A comprehensive web-based application designed specifically for Masters students to manage academic tasks, deadlines, and research projects effectively.",
        url: "http://localhost:3000",
        siteName: "Smart Academic Task Planner",
        images: [
            {
                url: "/og-image.png",
                width: 1200,
                height: 630,
                alt: "Smart Academic Task Planner",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Smart Academic Task Planner",
        description:
            "A comprehensive web-based application designed specifically for Masters students to manage academic tasks, deadlines, and research projects effectively.",
        images: ["/og-image.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "your-google-verification-code",
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <Providers>
                    {children}
                    <Toaster
                        position="bottom-center"
                        toastOptions={{
                            duration: 4000,
                            style: {
                                background: "#363636",
                                color: "#fff",
                            },
                            success: {
                                duration: 3000,
                                style: {
                                    background: "#10B981",
                                },
                            },
                            error: {
                                duration: 5000,
                                style: {
                                    background: "#EF4444",
                                },
                            },
                        }}
                    />
                </Providers>
            </body>
        </html>
    );
}
