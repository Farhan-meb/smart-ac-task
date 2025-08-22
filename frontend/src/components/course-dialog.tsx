"use client";

import { Field, Form, Formik } from "formik";
import { Loader2 } from "lucide-react";
import { useRef } from "react";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCourse, useUpdateCourse } from "@/hooks/use-api";

const courseSchema = Yup.object().shape({
    // No validation for now - just to get API working
});

type CourseFormData = {
    code: string;
    name: string;
    description?: string;
    credits?: number;
    semester?: string;
    year?: number;
};

interface CourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course?: any; // For editing existing course
}

export function CourseDialog({
    open,
    onOpenChange,
    course,
}: CourseDialogProps) {
    const formikRef = useRef<any>(null);
    const isEditing = !!course;

    // Mutations
    const createCourseMutation = useCreateCourse();
    const updateCourseMutation = useUpdateCourse();

    const initialValues: CourseFormData = {
        code: course?.code || "",
        name: course?.name || "",
        description: course?.description || "",
        credits: course?.credits || undefined,
        semester: course?.semester || "",
        year: course?.year || undefined,
    };

    const handleSubmit = async (
        values: CourseFormData,
        { setSubmitting }: any
    ) => {
        try {
            if (isEditing) {
                await updateCourseMutation.mutateAsync({
                    id: course.id,
                    data: values,
                });
            } else {
                await createCourseMutation.mutateAsync(values);
                if (formikRef.current) {
                    formikRef.current.resetForm();
                }
            }
            onOpenChange(false);
        } catch (error) {
            // Error is handled by the mutation hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? "Edit Course" : "Create New Course"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the course information below."
                            : "Fill in the course information below to create a new course."}
                    </DialogDescription>
                </DialogHeader>

                <Formik
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    innerRef={formikRef}
                    enableReinitialize={true}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        isSubmitting,
                        isValid,
                        dirty,
                    }) => {
                        return (
                            <Form>
                                <div className="space-y-4">
                                    {/* Course Code */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Course Code *
                                        </label>
                                        <Field
                                            as={Input}
                                            id="code"
                                            name="code"
                                            placeholder="e.g., CS101"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    {/* Course Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Course Name *
                                        </label>
                                        <Field
                                            as={Input}
                                            id="name"
                                            name="name"
                                            placeholder="e.g., Introduction to Computer Science"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    {/* Credits and Semester */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Credits
                                            </label>
                                            <Field
                                                as={Input}
                                                id="credits"
                                                name="credits"
                                                type="number"
                                                min="1"
                                                max="30"
                                                placeholder="e.g., 3"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">
                                                Semester
                                            </label>
                                            <Field
                                                as={Input}
                                                id="semester"
                                                name="semester"
                                                placeholder="e.g., Fall 2024"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        </div>
                                    </div>

                                    {/* Year */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Year
                                        </label>
                                        <Field
                                            as={Input}
                                            id="year"
                                            name="year"
                                            type="number"
                                            min="2020"
                                            max="2030"
                                            placeholder="e.g., 2024"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Description
                                        </label>
                                        <Field
                                            as={Textarea}
                                            id="description"
                                            name="description"
                                            placeholder="Enter course description..."
                                            rows={3}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => onOpenChange(false)}
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    {isEditing
                                                        ? "Updating..."
                                                        : "Creating..."}
                                                </>
                                            ) : isEditing ? (
                                                "Update Course"
                                            ) : (
                                                "Create Course"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </div>
                            </Form>
                        );
                    }}
                </Formik>
            </DialogContent>
        </Dialog>
    );
}
