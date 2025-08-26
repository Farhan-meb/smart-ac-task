import axios from "axios";
import { getSession } from "next-auth/react";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token from session
api.interceptors.request.use(
    async (config) => {
        const session = await getSession();
        console.log("Session in API interceptor:", session);

        if (session?.user?.accessToken) {
            config.headers.Authorization = `Bearer ${session.user.accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors (unauthorized)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Try to refresh token
            const session = await getSession();
            if (session?.user?.refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        {
                            refreshToken: session.user.refreshToken,
                        }
                    );

                    const { token } = response.data;
                    // Note: In a real implementation, you'd update the session
                    // For now, redirect to login to get a fresh session
                    window.location.href = "/auth/login";
                    return Promise.reject(error);
                } catch (refreshError) {
                    // Refresh failed, redirect to login
                    window.location.href = "/auth/login";
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// API endpoints
export const authAPI = {
    register: (data: any) => api.post("/auth/register", data),
    profile: () => api.get("/auth/me"),
    updateProfile: (data: any) => api.put("/auth/profile", data),
    changePassword: (data: any) => api.put("/auth/change-password", data),
    forgotPassword: (email: string) =>
        api.post("/auth/forgot-password", { email }),
    resetPassword: (data: any) => api.post("/auth/reset-password", data),
};

export const tasksAPI = {
    getAll: (params?: any) => api.get("/tasks", { params }),
    getById: (id: string) => api.get(`/tasks/${id}`),
    create: (data: any) => api.post("/tasks", data),
    update: (id: string, data: any) => api.put(`/tasks/${id}`, data),
    delete: (id: string) => api.delete(`/tasks/${id}`),
    complete: (id: string) => api.patch(`/tasks/${id}/complete`),
    analytics: (params?: any) => api.get("/tasks/analytics", { params }),
    timeline: (params?: any) => api.get("/tasks/timeline", { params }),
    subtasks: {
        create: (taskId: string, data: any) =>
            api.post(`/tasks/${taskId}/subtasks`, data),
        update: (taskId: string, subtaskId: string, data: any) =>
            api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data),
        delete: (taskId: string, subtaskId: string) =>
            api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`),
    },
    timeLogs: {
        create: (taskId: string, data: any) =>
            api.post(`/tasks/${taskId}/time-logs`, data),
        update: (taskId: string, timeLogId: string, data: any) =>
            api.put(`/tasks/${taskId}/time-logs/${timeLogId}`, data),
        delete: (taskId: string, timeLogId: string) =>
            api.delete(`/tasks/${taskId}/time-logs/${timeLogId}`),
    },
};

export const coursesAPI = {
    getAll: (params?: any) => api.get("/courses", { params }),
    getById: (id: string) => api.get(`/courses/${id}`),
    create: (data: any) => api.post("/courses", data),
    update: (id: string, data: any) => api.put(`/courses/${id}`, data),
    delete: (id: string) => api.delete(`/courses/${id}`),
};

export const categoriesAPI = {
    getAll: (params?: any) => api.get("/categories", { params }),
    getById: (id: string) => api.get(`/categories/${id}`),
    create: (data: any) => api.post("/categories", data),
    update: (id: string, data: any) => api.put(`/categories/${id}`, data),
    delete: (id: string) => api.delete(`/categories/${id}`),
};

export const remindersAPI = {
    getAll: (params?: any) => api.get("/reminders", { params }),
    getById: (id: string) => api.get(`/reminders/${id}`),
    create: (data: any) => api.post("/reminders", data),
    update: (id: string, data: any) => api.put(`/reminders/${id}`, data),
    delete: (id: string) => api.delete(`/reminders/${id}`),
    markSent: (id: string) => api.patch(`/reminders/${id}/sent`),
};

export const resourcesAPI = {
    getAll: (params?: any) => api.get("/resources", { params }),
    getById: (id: string) => api.get(`/resources/${id}`),
    create: (data: any) => api.post("/resources", data),
    update: (id: string, data: any) => api.put(`/resources/${id}`, data),
    delete: (id: string) => api.delete(`/resources/${id}`),
    upload: (file: File) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post("/resources/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
};

export const analyticsAPI = {
    dashboard: (params?: any) => api.get("/analytics/dashboard", { params }),
    taskProgress: (params?: any) =>
        api.get("/analytics/task-progress", { params }),
    productivity: (params?: any) =>
        api.get("/analytics/productivity", { params }),
    timeAnalysis: (params?: any) =>
        api.get("/analytics/time-analysis", { params }),
    categoryBreakdown: (params?: any) =>
        api.get("/analytics/category-breakdown", { params }),
    coursePerformance: (params?: any) =>
        api.get("/analytics/course-performance", { params }),
    weeklyReport: (params?: any) =>
        api.get("/analytics/weekly-report", { params }),
    monthlyReport: (params?: any) =>
        api.get("/analytics/monthly-report", { params }),
};

export default api;
