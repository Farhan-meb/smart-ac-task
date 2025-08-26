import { useToast } from "@/hooks/use-toast";
import {
    analyticsAPI,
    authAPI,
    categoriesAPI,
    coursesAPI,
    remindersAPI,
    resourcesAPI,
    tasksAPI,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Auth hooks
export const useRegister = () => {
    return useMutation({
        mutationFn: authAPI.register,
    });
};

export const useProfile = () => {
    return useQuery({
        queryKey: ["user", "profile"],
        queryFn: authAPI.profile,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useUpdateProfile = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: authAPI.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user"] });
            toast({
                title: "Success",
                description: "Profile updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Profile update failed",
                variant: "destructive",
            });
        },
    });
};

export const useChangePassword = () => {
    const { toast } = useToast();

    return useMutation({
        mutationFn: authAPI.changePassword,
        onSuccess: () => {
            toast({
                title: "Success",
                description: "Password changed successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Password change failed",
                variant: "destructive",
            });
        },
    });
};

// Task hooks
export const useTasks = (params?: any) => {
    return useQuery({
        queryKey: ["tasks", params],
        queryFn: () => tasksAPI.getAll(params),
        staleTime: 2 * 60 * 1000, // 2 minutes
    });
};

export const useTask = (id: string) => {
    return useQuery({
        queryKey: ["tasks", id],
        queryFn: () => tasksAPI.getById(id),
        enabled: !!id,
    });
};

export const useCreateTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: tasksAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({
                title: "Success",
                description: "Task created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to create task",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            tasksAPI.update(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["tasks", id] });
            toast({
                title: "Success",
                description: "Task updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to update task",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: tasksAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({
                title: "Success",
                description: "Task deleted successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to delete task",
                variant: "destructive",
            });
        },
    });
};

export const useCompleteTask = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: tasksAPI.complete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            toast({
                title: "Success",
                description: "Task marked as complete",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to complete task",
                variant: "destructive",
            });
        },
    });
};

// Course hooks
export const useCourses = (params?: any) => {
    return useQuery({
        queryKey: ["courses", params],
        queryFn: () => coursesAPI.getAll(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: coursesAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            toast({
                title: "Success",
                description: "Course created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to create course",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            coursesAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            toast({
                title: "Success",
                description: "Course updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to update course",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteCourse = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: coursesAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["courses"] });
            toast({
                title: "Success",
                description: "Course deleted successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message || "Failed to delete course",
                variant: "destructive",
            });
        },
    });
};

// Category hooks
export const useCategories = (params?: any) => {
    return useQuery({
        queryKey: ["categories", params],
        queryFn: () => categoriesAPI.getAll(params),
        staleTime: 10 * 60 * 1000, // 10 minutes
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: categoriesAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to create category",
                variant: "destructive",
            });
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) =>
            categoriesAPI.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category updated successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to update category",
                variant: "destructive",
            });
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: categoriesAPI.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            toast({
                title: "Success",
                description: "Category deleted successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to delete category",
                variant: "destructive",
            });
        },
    });
};

// Reminder hooks
export const useReminders = (params?: any) => {
    return useQuery({
        queryKey: ["reminders", params],
        queryFn: () => remindersAPI.getAll(params),
        staleTime: 1 * 60 * 1000, // 1 minute
    });
};

export const useCreateReminder = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: remindersAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
            toast({
                title: "Success",
                description: "Reminder created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to create reminder",
                variant: "destructive",
            });
        },
    });
};

// Resource hooks
export const useResources = (params?: any) => {
    return useQuery({
        queryKey: ["resources", params],
        queryFn: () => resourcesAPI.getAll(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useCreateResource = () => {
    const queryClient = useQueryClient();
    const { toast } = useToast();

    return useMutation({
        mutationFn: resourcesAPI.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({
                title: "Success",
                description: "Resource created successfully",
            });
        },
        onError: (error: any) => {
            toast({
                title: "Error",
                description:
                    error.response?.data?.message ||
                    "Failed to create resource",
                variant: "destructive",
            });
        },
    });
};

// Analytics hooks
export const useDashboardAnalytics = (params?: any) => {
    return useQuery({
        queryKey: ["analytics", "dashboard", params],
        queryFn: () => analyticsAPI.dashboard(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useTaskProgress = (params?: any) => {
    return useQuery({
        queryKey: ["analytics", "task-progress", params],
        queryFn: () => analyticsAPI.taskProgress(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};

export const useProductivityAnalytics = (params?: any) => {
    return useQuery({
        queryKey: ["analytics", "productivity", params],
        queryFn: () => analyticsAPI.productivity(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
};
