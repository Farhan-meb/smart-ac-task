import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Task } from "@/types/task";
import { BookOpen, Calendar, Clock, Edit, FileText, Tag } from "lucide-react";
import React from "react";

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
}

const getPriorityColor = (priority: string) => {
    switch (priority) {
        case "HIGH":
            return "bg-red-100 text-red-700 border-red-200";
        case "MEDIUM":
            return "bg-purple-100 text-purple-700 border-purple-200";
        case "LOW":
            return "bg-blue-100 text-blue-700 border-blue-200";
        default:
            return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-200 bg-white border border-slate-200 hover:border-blue-300">
            <CardContent className="p-5">
                {/* Header with Edit button and Priority */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                        <h4
                            className="font-semibold text-sm text-slate-900 line-clamp-2 pr-8"
                            title={task.title}
                        >
                            {task.title}
                        </h4>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant="outline"
                            className={`text-xs px-1.5 py-0.5 rounded ${getPriorityColor(
                                task.priority
                            )}`}
                        >
                            {task.priority}
                        </Badge>
                        <Button
                            variant="secondary"
                            size="sm"
                            className="h-6 px-2 bg-gray-100 hover:bg-gray-200"
                            onClick={() => onEdit(task)}
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                    </div>
                </div>

                {/* Description */}
                {task.description && (
                    <div className="flex items-start gap-2 mb-2">
                        <FileText className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                        <p
                            className="text-xs text-slate-600 line-clamp-2 flex-1"
                            title={task.description}
                        >
                            {task.description}
                        </p>
                    </div>
                )}

                {/* Task Details with Icons */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
                        <span>Due: {formatDate(task.dueDate)}</span>
                    </div>

                    {task.estimatedHours && task.estimatedHours > 0 && (
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Clock className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span>Est. {task.estimatedHours}h</span>
                        </div>
                    )}

                    {task.category && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Tag className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span
                                className="px-2 py-1 rounded text-white"
                                style={{
                                    backgroundColor: task.category.color,
                                }}
                            >
                                {task.category.name}
                            </span>
                        </div>
                    )}

                    {task.course && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <BookOpen className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            <span className="bg-gray-700 px-2 py-1 rounded text-white">
                                {task.course.name}
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
