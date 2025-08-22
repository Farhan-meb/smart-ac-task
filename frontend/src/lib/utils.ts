import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function getStatusColor(status: string) {
    switch (status) {
        case "COMPLETED":
            return "default";
        case "IN_PROGRESS":
            return "secondary";
        case "PENDING":
            return "outline";
        default:
            return "outline";
    }
}

export function getPriorityColor(priority: string) {
    switch (priority) {
        case "HIGH":
            return "destructive";
        case "MEDIUM":
            return "secondary";
        case "LOW":
            return "default";
        default:
            return "outline";
    }
}
