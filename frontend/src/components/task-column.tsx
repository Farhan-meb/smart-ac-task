import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { Plus } from "lucide-react";
import React from "react";
import { TaskCard } from "./task-card";

interface TaskColumnProps {
    title: string;
    status: string;
    tasks: Task[];
    onEditTask: (task: Task) => void;
    onAddTask: (status: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
    title,
    status,
    tasks,
    onEditTask,
    onAddTask,
}) => {
    const getStatusBadgeStyle = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-100 text-orange-700 border-orange-200 hover:!bg-orange-100";
            case "IN_PROGRESS":
                return "bg-blue-100 text-blue-700 border-blue-200 hover:!bg-blue-100";
            case "COMPLETED":
                return "bg-green-100 text-green-700 border-green-200 hover:!bg-green-100";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200 hover:!bg-gray-100";
        }
    };

    const getStatusDotColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-orange-500";
            case "IN_PROGRESS":
                return "bg-blue-500";
            case "COMPLETED":
                return "bg-green-500";
            default:
                return "bg-gray-500";
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Column Header */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm mb-4">
                <div className="flex items-center gap-2">
                    <Badge
                        className={`${getStatusBadgeStyle(status)} rounded-sm`}
                    >
                        <div
                            className={`w-2 h-2 rounded-full ${getStatusDotColor(
                                status
                            )} mr-2`}
                        ></div>
                        {title}
                    </Badge>
                    <span className="text-sm font-medium text-slate-600">
                        {tasks.length}
                    </span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddTask(status)}
                    className="text-xs"
                >
                    <Plus className="h-3 w-3 mr-1" />
                    Add {title}
                </Button>
            </div>

            {/* Tasks */}
            <div className="flex-1 space-y-3 overflow-y-auto">
                {tasks.length === 0 ? (
                    <div className="text-center py-8 text-slate-500">
                        <p className="text-sm">
                            No {title.toLowerCase()} tasks
                        </p>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                        />
                    ))
                )}
            </div>
        </div>
    );
};
