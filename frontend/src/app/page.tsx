import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    BarChart3,
    Bell,
    BookOpen,
    Calendar,
    Clock,
    FileText,
    Target,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <BookOpen className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold">
                            Smart Academic Planner
                        </span>
                    </div>
                    <nav className="flex items-center space-x-4">
                        <Link href="/auth/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link href="/auth/register">
                            <Button>Get Started</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container px-4 py-24 text-center">
                <div className="mx-auto max-w-4xl">
                    <Badge variant="secondary" className="mb-4">
                        Designed for Masters Students
                    </Badge>
                    <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                        Master Your Academic
                        <span className="text-primary"> Success</span>
                    </h1>
                    <p className="mb-8 text-xl text-muted-foreground">
                        A comprehensive web-based application designed
                        specifically for Masters students to manage academic
                        tasks, deadlines, and research projects effectively.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                        <Link href="/auth/register">
                            <Button size="lg" className="w-full sm:w-auto">
                                Start Planning Today
                            </Button>
                        </Link>
                        <Link href="#features">
                            <Button
                                variant="outline"
                                size="lg"
                                className="w-full sm:w-auto"
                            >
                                Learn More
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container px-4 py-24">
                <div className="mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Everything You Need for Academic Success
                        </h2>
                        <p className="text-xl text-muted-foreground">
                            Powerful features designed specifically for Masters
                            students
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <Card>
                            <CardHeader>
                                <Target className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Smart Task Management</CardTitle>
                                <CardDescription>
                                    Create, organize, and prioritize academic
                                    tasks with intelligent suggestions
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Calendar className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Academic Calendar</CardTitle>
                                <CardDescription>
                                    Integrated calendar with course schedules
                                    and research milestones
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Bell className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Smart Reminders</CardTitle>
                                <CardDescription>
                                    Never miss deadlines with intelligent
                                    notification system
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <BarChart3 className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Progress Analytics</CardTitle>
                                <CardDescription>
                                    Track your productivity with detailed
                                    analytics and insights
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <Clock className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Time Tracking</CardTitle>
                                <CardDescription>
                                    Monitor time spent on tasks and optimize
                                    your study schedule
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <FileText className="h-8 w-8 text-primary mb-2" />
                                <CardTitle>Resource Management</CardTitle>
                                <CardDescription>
                                    Organize academic resources, references, and
                                    study materials
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="container px-4 py-24 bg-primary/5">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-12">
                        Trusted by Masters Students Worldwide
                    </h2>
                    <div className="grid gap-8 md:grid-cols-3">
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">
                                1000+
                            </div>
                            <div className="text-muted-foreground">
                                Active Students
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">
                                50,000+
                            </div>
                            <div className="text-muted-foreground">
                                Tasks Completed
                            </div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary mb-2">
                                95%
                            </div>
                            <div className="text-muted-foreground">
                                Satisfaction Rate
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container px-4 py-24">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Ready to Transform Your Academic Journey?
                    </h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join thousands of Masters students who have already
                        improved their productivity and achieved academic
                        success.
                    </p>
                    <Link href="/auth/register">
                        <Button size="lg" className="text-lg px-8 py-6">
                            Get Started Free
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-background">
                <div className="container px-4 py-12">
                    <div className="grid gap-8 md:grid-cols-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <BookOpen className="h-6 w-6 text-primary" />
                                <span className="font-bold">
                                    Smart Academic Planner
                                </span>
                            </div>
                            <p className="text-muted-foreground">
                                Empowering Masters students to achieve academic
                                excellence through intelligent task management
                                and productivity tools.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Product</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link
                                        href="#features"
                                        className="hover:text-foreground"
                                    >
                                        Features
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        API
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Support</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Documentation
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Help Center
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Contact
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-4">Company</h3>
                            <ul className="space-y-2 text-muted-foreground">
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        About
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Blog
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="#"
                                        className="hover:text-foreground"
                                    >
                                        Privacy
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
                        <p>
                            &copy; 2024 Smart Academic Task Planner. All rights
                            reserved.
                        </p>
                        <p className="mt-2">
                            Developed by Md Abdul Hafiz - MSc Information
                            Technology
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
