"use client";

import { AppLayout } from "@/components/app-layout";
import { TaskColumn } from "@/components/task-column";
import { TaskDialog } from "@/components/task-dialog";
import { TaskFilters } from "@/components/task-filters";
import { TaskHeader } from "@/components/task-header";
import { useCategories, useCourses, useTasks } from "@/hooks/use-api";
import { useState } from "react";

export default function TasksPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [dueDateFilter, setDueDateFilter] = useState<Date | undefined>(
        undefined
    );
    const [sortBy, setSortBy] = useState("createdAt");
    const [taskDialogOpen, setTaskDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState<any>(null);
    const [preSelectedStatus, setPreSelectedStatus] = useState<string | null>(
        null
    );

    // Fetch data
    const { data: tasksData, isLoading } = useTasks();
    const { data: categoriesData } = useCategories();
    const { data: coursesData } = useCourses();

    const tasks = tasksData?.data?.data?.tasks || tasksData?.data?.tasks || [];
    const categories =
        categoriesData?.data?.data?.categories ||
        categoriesData?.data?.categories ||
        [];
    const courses =
        coursesData?.data?.data?.courses || coursesData?.data?.courses || [];

    // Filter tasks
    const filteredTasks = tasks.filter((task: any) => {
        const matchesSearch =
            !searchTerm ||
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesPriority =
            priorityFilter === "all" || task.priority === priorityFilter;

        const matchesCategory =
            categoryFilter === "all" || task.categoryId === categoryFilter;

        const matchesCourse =
            courseFilter === "all" || task.courseId === courseFilter;

        const matchesStatus =
            statusFilter === "all" || task.status === statusFilter;

        const matchesDueDate =
            !dueDateFilter ||
            new Date(task.dueDate).toDateString() ===
                dueDateFilter.toDateString();

        return (
            matchesSearch &&
            matchesPriority &&
            matchesCategory &&
            matchesCourse &&
            matchesStatus &&
            matchesDueDate
        );
    });

    // Sort tasks
    const sortedTasks = [...filteredTasks].sort((a: any, b: any) => {
        switch (sortBy) {
            case "dueDate":
                return (
                    new Date(a.dueDate).getTime() -
                    new Date(b.dueDate).getTime()
                );
            case "priority":
                const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
                return (
                    priorityOrder[b.priority as keyof typeof priorityOrder] -
                    priorityOrder[a.priority as keyof typeof priorityOrder]
                );
            case "title":
                return a.title.localeCompare(b.title);
            case "status":
                const statusOrder = {
                    PENDING: 1,
                    IN_PROGRESS: 2,
                    COMPLETED: 3,
                };
                return (
                    statusOrder[a.status as keyof typeof statusOrder] -
                    statusOrder[b.status as keyof typeof statusOrder]
                );
            case "createdAt":
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            default:
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
        }
    });

    const handleEditTask = (task: any) => {
        setSelectedTask(task);
        setTaskDialogOpen(true);
    };

    const handleCreateTask = (status?: string) => {
        setSelectedTask(null);
        setPreSelectedStatus(status || null);
        setTaskDialogOpen(true);
    };

    const handleAddTask = (status: string) => {
        setSelectedTask(null);
        setPreSelectedStatus(status);
        setTaskDialogOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <TaskHeader onNewTask={() => handleCreateTask()} />

                {/* Filters */}
                <TaskFilters
                    statusFilter={statusFilter}
                    priorityFilter={priorityFilter}
                    categoryFilter={categoryFilter}
                    courseFilter={courseFilter}
                    dueDateFilter={dueDateFilter}
                    searchQuery={searchTerm}
                    categories={categories}
                    courses={courses}
                    onStatusFilterChange={setStatusFilter}
                    onPriorityFilterChange={setPriorityFilter}
                    onCategoryFilterChange={setCategoryFilter}
                    onCourseFilterChange={setCourseFilter}
                    onDueDateFilterChange={setDueDateFilter}
                    onSearchQueryChange={setSearchTerm}
                />

                {/* Tasks Kanban Board */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <TaskColumn
                        title="Pending"
                        status="PENDING"
                        tasks={sortedTasks.filter(
                            (task) => task.status === "PENDING"
                        )}
                        onEditTask={handleEditTask}
                        onAddTask={handleAddTask}
                    />
                    <TaskColumn
                        title="In Progress"
                        status="IN_PROGRESS"
                        tasks={sortedTasks.filter(
                            (task) => task.status === "IN_PROGRESS"
                        )}
                        onEditTask={handleEditTask}
                        onAddTask={handleAddTask}
                    />
                    <TaskColumn
                        title="Completed"
                        status="COMPLETED"
                        tasks={sortedTasks.filter(
                            (task) => task.status === "COMPLETED"
                        )}
                        onEditTask={handleEditTask}
                        onAddTask={handleAddTask}
                    />
                </div>

                {/* No Tasks Message */}
                {sortedTasks.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg
                                className="h-12 w-12 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium mb-2">
                            No tasks found
                        </h3>
                        <p className="text-gray-500">
                            {searchTerm || priorityFilter !== "all"
                                ? "Try adjusting your filters or search terms"
                                : "Create your first task to get started"}
                        </p>
                    </div>
                )}

                {/* Task Dialog */}
                <TaskDialog
                    open={taskDialogOpen}
                    onOpenChange={setTaskDialogOpen}
                    task={selectedTask}
                    preSelectedStatus={preSelectedStatus}
                />
            </div>
        </AppLayout>
    );
}
