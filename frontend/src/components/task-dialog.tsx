"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
    useCategories,
    useCourses,
    useCreateTask,
    useUpdateTask,
} from "@/hooks/use-api";

const taskSchema = Yup.object().shape({
    title: Yup.string()
        .min(1, "Title is required")
        .max(100, "Title too long")
        .required("Title is required"),
    description: Yup.string().optional(),
    dueDate: Yup.date()
        .required("Due date is required")
        .min(new Date(), "Due date cannot be in the past"),
    priority: Yup.string()
        .oneOf(["LOW", "MEDIUM", "HIGH"], "Invalid priority")
        .required("Priority is required"),
    status: Yup.string()
        .oneOf(["PENDING", "IN_PROGRESS", "COMPLETED"], "Invalid status")
        .required("Status is required"),
    categoryId: Yup.string().optional(),
    courseId: Yup.string().optional(),
    estimatedHours: Yup.number()
        .min(0, "Estimated hours must be 0 or greater")
        .optional(),
});

type TaskFormData = {
    title: string;
    description?: string;
    dueDate: Date;
    priority: "LOW" | "MEDIUM" | "HIGH";
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    categoryId?: string;
    courseId?: string;
    estimatedHours?: number;
};

interface TaskDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: any; // For editing existing task
    preSelectedStatus?: string | null; // For pre-selecting status when creating new task
}

export function TaskDialog({
    open,
    onOpenChange,
    task,
    preSelectedStatus,
}: TaskDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isEditing = !!task;

    // Fetch data for dropdowns
    const { data: categoriesData } = useCategories();
    const { data: coursesData } = useCourses();

    const categories =
        categoriesData?.data?.data?.categories ||
        categoriesData?.data?.categories ||
        [];
    const courses =
        coursesData?.data?.data?.courses || coursesData?.data?.courses || [];

    // Debug: Check if data is loading
    console.log("Categories data:", categoriesData);
    console.log("Courses data:", coursesData);
    console.log("Categories:", categories);
    console.log("Courses:", courses);

    // Mutations
    const createTaskMutation = useCreateTask();
    const updateTaskMutation = useUpdateTask();

    const initialValues: TaskFormData = {
        title: task?.title || "",
        description: task?.description || "",
        dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
        priority: task?.priority || "MEDIUM",
        status: task?.status || preSelectedStatus || "PENDING",
        categoryId: task?.categoryId || "none",
        courseId: task?.courseId || "none",
        estimatedHours: task?.estimatedHours || 0,
    };

    const handleSubmit = async (
        values: TaskFormData,
        { setSubmitting, resetForm }: any
    ) => {
        setIsSubmitting(true);
        try {
            // Convert "none" values to undefined for the API
            const submitData = {
                ...values,
                categoryId:
                    values.categoryId === "none"
                        ? undefined
                        : values.categoryId,
                courseId:
                    values.courseId === "none" ? undefined : values.courseId,
            };

            if (isEditing) {
                await updateTaskMutation.mutateAsync({
                    id: task.id,
                    data: submitData,
                });
            } else {
                await createTaskMutation.mutateAsync(submitData);
            }
            onOpenChange(false);
            resetForm();
        } catch (error) {
            // Error is handled by the mutation hook
        } finally {
            setIsSubmitting(false);
            setSubmitting(false);
        }
    };

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            // Reset form when closing
        }
        onOpenChange(newOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Task" : "Create New Task"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the task details below."
                            : "Fill in the details to create a new academic task."}
                    </DialogDescription>
                </DialogHeader>

                <Formik
                    initialValues={initialValues}
                    validationSchema={taskSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                    enableReinitialize
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        setFieldValue,
                        isSubmitting,
                    }) => (
                        <Form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Title */}
                                <div className="md:col-span-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="title"
                                            className="text-sm font-medium"
                                        >
                                            Title *
                                        </label>
                                        <Field
                                            as={Input}
                                            id="title"
                                            name="title"
                                            placeholder="Enter task title"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.title && touched.title
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        <ErrorMessage
                                            name="title"
                                            component="p"
                                            className="text-sm text-red-500"
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="description"
                                            className="text-sm font-medium"
                                        >
                                            Description
                                        </label>
                                        <Field
                                            as={Textarea}
                                            id="description"
                                            name="description"
                                            placeholder="Enter task description"
                                            className={`min-h-[100px] ${
                                                errors.description &&
                                                touched.description
                                                    ? "border-red-500"
                                                    : ""
                                            }`}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="p"
                                            className="text-sm text-red-500"
                                        />
                                    </div>
                                </div>

                                {/* Due Date */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Due Date *
                                    </label>
                                    <DatePicker
                                        date={values.dueDate}
                                        onDateChange={(date) =>
                                            setFieldValue("dueDate", date)
                                        }
                                        fullWidth={true}
                                        className={
                                            errors.dueDate && touched.dueDate
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <ErrorMessage
                                        name="dueDate"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                {/* Priority */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Priority *
                                    </label>
                                    <Select
                                        value={values.priority}
                                        onValueChange={(value) =>
                                            setFieldValue("priority", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.priority &&
                                                touched.priority
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="LOW">
                                                Low
                                            </SelectItem>
                                            <SelectItem value="MEDIUM">
                                                Medium
                                            </SelectItem>
                                            <SelectItem value="HIGH">
                                                High
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                        name="priority"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Status *
                                    </label>
                                    <Select
                                        value={values.status}
                                        onValueChange={(value) =>
                                            setFieldValue("status", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.status && touched.status
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="PENDING">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="IN_PROGRESS">
                                                In Progress
                                            </SelectItem>
                                            <SelectItem value="COMPLETED">
                                                Completed
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                        name="status"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                {/* Estimated Hours */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="estimatedHours"
                                        className="text-sm font-medium"
                                    >
                                        Estimated Hours
                                    </label>
                                    <Field
                                        as={Input}
                                        id="estimatedHours"
                                        name="estimatedHours"
                                        type="number"
                                        placeholder="0"
                                        onChange={(e: any) =>
                                            setFieldValue(
                                                "estimatedHours",
                                                e.target.value
                                                    ? parseFloat(e.target.value)
                                                    : 0
                                            )
                                        }
                                        onBlur={handleBlur}
                                        className={
                                            errors.estimatedHours &&
                                            touched.estimatedHours
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <p className="text-sm text-gray-500">
                                        Estimated time to complete this task
                                    </p>
                                    <ErrorMessage
                                        name="estimatedHours"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                {/* Category */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Category
                                    </label>
                                    <Select
                                        value={values.categoryId}
                                        onValueChange={(value) =>
                                            setFieldValue("categoryId", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.categoryId &&
                                                touched.categoryId
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No Category
                                            </SelectItem>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                        name="categoryId"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                {/* Course */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">
                                        Course
                                    </label>
                                    <Select
                                        value={values.courseId}
                                        onValueChange={(value) =>
                                            setFieldValue("courseId", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.courseId &&
                                                touched.courseId
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Select course" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                No Course
                                            </SelectItem>
                                            {courses.map((course) => (
                                                <SelectItem
                                                    key={course.id}
                                                    value={course.id}
                                                >
                                                    {course.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <ErrorMessage
                                        name="courseId"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => handleOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {isEditing ? "Update Task" : "Create Task"}
                                </Button>
                            </DialogFooter>
                        </Form>
                    )}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}
