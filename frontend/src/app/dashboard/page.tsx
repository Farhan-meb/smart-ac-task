"use client";

import {
    Activity,
    Award,
    BarChart3,
    BookOpen,
    Calendar,
    CheckCircle,
    Clock,
    Plus,
    Target,
    TrendingUp,
    Users,
} from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/app-layout";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useSession } from "next-auth/react";

import {
    useCategories,
    useCourses,
    useDashboardAnalytics,
    useProductivityAnalytics,
    useTaskProgress,
    useTasks,
} from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";
import { Category, Course, Task } from "@/types/task";

// Custom badge styling functions to match task cards
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "HIGH":
            return "bg-red-600 text-white";
        case "MEDIUM":
            return "bg-purple-600 text-white";
        case "LOW":
            return "bg-blue-600 text-white";
        default:
            return "bg-gray-600 text-white";
    }
};

const getStatusColor = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-100 text-green-700 border-green-200";
        case "IN_PROGRESS":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "PENDING":
            return "bg-orange-100 text-orange-700 border-orange-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

const getStatusDotColor = (status: string) => {
    switch (status) {
        case "COMPLETED":
            return "bg-green-500";
        case "IN_PROGRESS":
            return "bg-blue-500";
        case "PENDING":
            return "bg-orange-500";
        default:
            return "bg-gray-500";
    }
};

export default function DashboardPage() {
    const { data: session } = useSession();
    const [timeRange, setTimeRange] = useState("30");

    // Fetch data
    const { data: tasksData, isLoading: tasksLoading } = useTasks();
    const { data: analyticsData, isLoading: analyticsLoading } =
        useDashboardAnalytics();
    const { data: categoriesData } = useCategories();
    const { data: coursesData } = useCourses();

    // Fetch detailed analytics data
    const { data: dashboardData, isLoading: dashboardLoading } =
        useDashboardAnalytics({
            days: parseInt(timeRange),
        });
    const { data: productivityData, isLoading: productivityLoading } =
        useProductivityAnalytics({
            days: parseInt(timeRange),
        });
    const { data: taskProgressData, isLoading: taskProgressLoading } =
        useTaskProgress({
            days: parseInt(timeRange),
        });

    const tasks: Task[] = tasksData?.data?.data?.tasks || [];
    const analytics = analyticsData?.data || {};
    const categories: Category[] = categoriesData?.data?.data?.categories || [];
    const courses: Course[] = coursesData?.data?.data?.courses || [];

    // Detailed analytics data
    const dashboard = dashboardData?.data || {};
    const productivity = productivityData?.data || {};
    const taskProgress = taskProgressData?.data || {};

    // Calculate quick stats
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(
        (task: Task) => task.status === "COMPLETED"
    ).length;
    const pendingTasks = tasks.filter(
        (task: Task) => task.status === "PENDING"
    ).length;
    const overdueTasks = tasks.filter(
        (task: Task) =>
            task.status === "PENDING" && new Date(task.dueDate) < new Date()
    ).length;

    const completionRate =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Get recent tasks
    const recentTasks = tasks
        .sort(
            (a: Task, b: Task) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

    // Get upcoming deadlines
    const upcomingDeadlines = tasks
        .filter(
            (task: Task) =>
                task.status === "PENDING" && new Date(task.dueDate) > new Date()
        )
        .sort(
            (a: Task, b: Task) =>
                new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        )
        .slice(0, 5);

    // Show loading while session is loading
    if (!session) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (
        tasksLoading ||
        analyticsLoading ||
        dashboardLoading ||
        productivityLoading ||
        taskProgressLoading
    ) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                <div className="p-6 space-y-8">
                    {/* Hero Header */}
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-purple-600 to-indigo-600 p-8 text-white shadow-2xl">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-bold tracking-tight">
                                        Welcome back, {session?.user?.firstName}
                                        !
                                    </h1>
                                    <p className="text-xl text-blue-100">
                                        Here's your academic performance
                                        overview
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2 bg-white/10 rounded-lg px-4 py-2 backdrop-blur-sm">
                                    <span className="text-sm font-medium">
                                        Time Range:
                                    </span>
                                    <Select
                                        value={timeRange}
                                        onValueChange={setTimeRange}
                                    >
                                        <SelectTrigger className="w-32 bg-transparent border-white/20 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7">
                                                Last 7 days
                                            </SelectItem>
                                            <SelectItem value="30">
                                                Last 30 days
                                            </SelectItem>
                                            <SelectItem value="90">
                                                Last 90 days
                                            </SelectItem>
                                            <SelectItem value="365">
                                                Last year
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-sm font-semibold text-slate-600">
                                    Total Tasks
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
                                    <Target className="h-5 w-5 text-blue-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {totalTasks}
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Across all categories
                                </p>
                                <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (totalTasks / 50) * 100,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-sm font-semibold text-slate-600">
                                    Completion Rate
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-green-100 group-hover:bg-green-200 transition-colors">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {dashboard.completionRate || completionRate}
                                    %
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Tasks completed successfully
                                </p>
                                <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                dashboard.completionRate ||
                                                completionRate
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-sm font-semibold text-slate-600">
                                    Average Time
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 transition-colors">
                                    <Clock className="h-5 w-5 text-purple-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {productivity.averageTimePerTask || 0}h
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Per task completion
                                </p>
                                <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${Math.min(
                                                (productivity.averageTimePerTask ||
                                                    0) * 10,
                                                100
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                                <CardTitle className="text-sm font-semibold text-slate-600">
                                    Productivity Score
                                </CardTitle>
                                <div className="p-2 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
                                    <TrendingUp className="h-5 w-5 text-orange-600" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-slate-900">
                                    {productivity.productivityScore || 0}/100
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    Based on efficiency metrics
                                </p>
                                <div className="mt-4 w-full bg-slate-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${
                                                productivity.productivityScore ||
                                                0
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Tasks - Full Width */}
                    <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold text-slate-900">
                                        Recent Tasks
                                    </CardTitle>
                                    <CardDescription className="text-slate-600">
                                        Your latest created tasks
                                    </CardDescription>
                                </div>
                                <div className="p-2 rounded-lg bg-indigo-100">
                                    <Activity className="h-5 w-5 text-indigo-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTasks.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Activity className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                            No Tasks Yet
                                        </h3>
                                        <p className="text-slate-500 mb-4">
                                            Create your first task to get
                                            started!
                                        </p>
                                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                                            <Plus className="mr-2 h-4 w-4" />
                                            Create First Task
                                        </Button>
                                    </div>
                                ) : (
                                    recentTasks.map((task: Task) => (
                                        <div
                                            key={task.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-slate-50 to-red-50 border border-slate-200 hover:shadow-sm transition-all duration-200"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-base text-slate-900 mb-1">
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-xs text-slate-600 line-clamp-1">
                                                        {task.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs px-1.5 py-0.5 rounded-sm border-0 ${getStatusColor(
                                                        task.status
                                                    )}`}
                                                >
                                                    <div
                                                        className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                                            task.status
                                                        )} mr-1.5`}
                                                    ></div>
                                                    {task.status}
                                                </Badge>
                                                <Badge
                                                    className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(
                                                        task.priority
                                                    )}`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                                {task.category && (
                                                    <span
                                                        className="px-2 py-1 rounded text-white text-xs font-semibold"
                                                        style={{
                                                            backgroundColor:
                                                                task.category
                                                                    .color,
                                                        }}
                                                    >
                                                        {task.category.name}
                                                    </span>
                                                )}
                                                <span className="text-xs text-slate-500 ml-2">
                                                    Due:{" "}
                                                    {formatDate(task.dueDate)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats and Upcoming Deadlines - 2 cards per row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg font-bold text-slate-900">
                                        Quick Stats
                                    </CardTitle>
                                    <div className="p-2 rounded-lg bg-purple-100">
                                        <Users className="h-4 w-4 text-purple-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-blue-100">
                                                <BookOpen className="h-4 w-4 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                Categories
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {categories.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-green-100">
                                                <BookOpen className="h-4 w-4 text-green-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                Courses
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {courses.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-red-100">
                                                <Target className="h-4 w-4 text-red-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                High Priority
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {
                                                tasks.filter(
                                                    (task: Task) =>
                                                        task.priority === "HIGH"
                                                ).length
                                            }
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-orange-100">
                                                <Calendar className="h-4 w-4 text-orange-600" />
                                            </div>
                                            <span className="text-sm font-semibold text-slate-700">
                                                This Week
                                            </span>
                                        </div>
                                        <span className="font-bold text-slate-900">
                                            {
                                                tasks.filter((task: Task) => {
                                                    const dueDate = new Date(
                                                        task.dueDate
                                                    );
                                                    const now = new Date();
                                                    const weekFromNow =
                                                        new Date(
                                                            now.getTime() +
                                                                7 *
                                                                    24 *
                                                                    60 *
                                                                    60 *
                                                                    1000
                                                        );
                                                    return (
                                                        dueDate >= now &&
                                                        dueDate <= weekFromNow
                                                    );
                                                }).length
                                            }
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-lg font-bold text-slate-900">
                                            Upcoming Deadlines
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Tasks due soon
                                        </CardDescription>
                                    </div>
                                    <div className="p-2 rounded-lg bg-red-100">
                                        <Calendar className="h-4 w-4 text-red-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {upcomingDeadlines.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-100 flex items-center justify-center">
                                                <Calendar className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm text-slate-500">
                                                No upcoming deadlines
                                            </p>
                                        </div>
                                    ) : (
                                        upcomingDeadlines.map((task: Task) => (
                                            <div
                                                key={task.id}
                                                className="flex items-center justify-between p-2.5 rounded-lg bg-gradient-to-r from-slate-50 to-red-50 border border-slate-200 hover:shadow-sm transition-all duration-200"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-base text-slate-900 mb-1">
                                                        {task.title}
                                                    </h4>
                                                    <p className="text-xs text-slate-600">
                                                        Due:{" "}
                                                        {formatDate(
                                                            task.dueDate
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 ml-4">
                                                    <Badge
                                                        className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(
                                                            task.priority
                                                        )}`}
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Task Progress Over Time and Category Performance - 2 cards per row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900">
                                            Task Progress Over Time
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Daily task completion trends
                                        </CardDescription>
                                    </div>
                                    <div className="p-2 rounded-lg bg-blue-100">
                                        <BarChart3 className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {taskProgress.dailyProgress &&
                                taskProgress.dailyProgress.length > 0 ? (
                                    <div className="space-y-4">
                                        {taskProgress.dailyProgress.map(
                                            (day: any, index: number) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 rounded-lg bg-blue-100">
                                                            <Calendar className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700">
                                                            {formatDate(
                                                                day.date
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-32 bg-slate-200 rounded-full h-3">
                                                            <div
                                                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                                                                style={{
                                                                    width: `${day.completionRate}%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-sm font-bold text-slate-700 w-12">
                                                            {day.completionRate}
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                            <BarChart3 className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                            No Progress Data
                                        </h3>
                                        <p className="text-slate-500">
                                            No progress data available for this
                                            period
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl font-bold text-slate-900">
                                            Category Performance
                                        </CardTitle>
                                        <CardDescription className="text-slate-600">
                                            Task completion by category
                                        </CardDescription>
                                    </div>
                                    <div className="p-2 rounded-lg bg-green-100">
                                        <Award className="h-5 w-5 text-green-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {dashboard.categoryBreakdown &&
                                dashboard.categoryBreakdown.length > 0 ? (
                                    <div className="space-y-4">
                                        {dashboard.categoryBreakdown.map(
                                            (category: any) => (
                                                <div
                                                    key={category.id}
                                                    className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="w-4 h-4 rounded-full"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color,
                                                            }}
                                                        ></div>
                                                        <span className="text-sm font-semibold text-slate-700">
                                                            {category.name}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <Badge
                                                            variant="outline"
                                                            className="font-semibold"
                                                        >
                                                            {
                                                                category.completedTasks
                                                            }
                                                            /
                                                            {
                                                                category.totalTasks
                                                            }
                                                        </Badge>
                                                        <span className="text-sm font-bold text-slate-700">
                                                            {
                                                                category.completionRate
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                            <Award className="h-8 w-8 text-slate-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                            No Category Data
                                        </h3>
                                        <p className="text-slate-500">
                                            No category data available
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recommendations */}
                    {dashboard.recommendations &&
                        dashboard.recommendations.length > 0 && (
                            <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl font-bold text-slate-900">
                                                Smart Recommendations
                                            </CardTitle>
                                            <CardDescription className="text-slate-600">
                                                AI-powered suggestions to
                                                improve your academic
                                                performance
                                            </CardDescription>
                                        </div>
                                        <div className="p-2 rounded-lg bg-blue-100">
                                            <Award className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {dashboard.recommendations.map(
                                            (
                                                recommendation: any,
                                                index: number
                                            ) => (
                                                <div
                                                    key={index}
                                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/80 backdrop-blur-sm border border-blue-200 hover:shadow-md transition-all duration-300"
                                                >
                                                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900 mb-1">
                                                            {
                                                                recommendation.title
                                                            }
                                                        </p>
                                                        <p className="text-sm text-slate-600">
                                                            {
                                                                recommendation.description
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                </div>
            </div>
        </AppLayout>
    );
}
