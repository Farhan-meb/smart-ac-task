import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Category, Course } from "@/types/task";
import React from "react";

interface TaskFiltersProps {
    statusFilter: string;
    priorityFilter: string;
    categoryFilter: string;
    courseFilter: string;
    dueDateFilter: Date | undefined;
    searchQuery: string;
    categories: Category[];
    courses: Course[];
    onStatusFilterChange: (value: string) => void;
    onPriorityFilterChange: (value: string) => void;
    onCategoryFilterChange: (value: string) => void;
    onCourseFilterChange: (value: string) => void;
    onDueDateFilterChange: (date: Date | undefined) => void;
    onSearchQueryChange: (value: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
    statusFilter,
    priorityFilter,
    categoryFilter,
    courseFilter,
    dueDateFilter,
    searchQuery,
    categories,
    courses,
    onStatusFilterChange,
    onPriorityFilterChange,
    onCategoryFilterChange,
    onCourseFilterChange,
    onDueDateFilterChange,
    onSearchQueryChange,
}) => {
    return (
        <div className="flex items-center justify-between gap-4 mb-6">
            {/* Filter Dropdowns */}
            <div className="flex items-center gap-3">
                <Select
                    value={statusFilter}
                    onValueChange={onStatusFilterChange}
                >
                    <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={priorityFilter}
                    onValueChange={onPriorityFilterChange}
                >
                    <SelectTrigger className="w-36 h-9">
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Priority</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="LOW">Low</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={categoryFilter}
                    onValueChange={onCategoryFilterChange}
                >
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={courseFilter}
                    onValueChange={onCourseFilterChange}
                >
                    <SelectTrigger className="w-40 h-9">
                        <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Courses</SelectItem>
                        {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                                {course.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* Due Date Filter */}
                <DatePicker
                    date={dueDateFilter}
                    onDateChange={onDueDateFilterChange}
                    onClear={() => onDueDateFilterChange(undefined)}
                    placeholder="Due Date"
                />
            </div>

            {/* Search Input */}
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => onSearchQueryChange(e.target.value)}
                    className="w-64 h-9"
                />
            </div>
        </div>
    );
};
