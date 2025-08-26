export interface Task {
    id: string;
    title: string;
    description?: string;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
    estimatedHours?: number;
    category?: Category;
    course?: Course;
    createdAt: string;
    updatedAt: string;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    description?: string;
    tasks?: Task[];
    createdAt: string;
    updatedAt: string;
}

export interface Course {
    id: string;
    name: string;
    code?: string;
    credits: number;
    semester: string;
    year: number;
    description?: string;
    createdAt: string;
    updatedAt: string;
}
