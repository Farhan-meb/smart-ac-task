import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface TaskHeaderProps {
    onNewTask: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({ onNewTask }) => {
    return (
        <div className="flex items-center justify-between mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Tasks</h1>
                <p className="text-slate-600 mt-1">
                    Manage and organize your academic tasks efficiently
                </p>
            </div>
            <Button onClick={onNewTask} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Task
            </Button>
        </div>
    );
};
