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
import { useCreateCategory, useUpdateCategory } from "@/hooks/use-api";

const categorySchema = Yup.object().shape({
    // No validation for now - just to get API working
});

type CategoryFormData = {
    name: string;
    description?: string;
    color: string;
};

interface CategoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    category?: any; // For editing existing category
}

export function CategoryDialog({
    open,
    onOpenChange,
    category,
}: CategoryDialogProps) {
    const formikRef = useRef<any>(null);
    const isEditing = !!category;

    // Mutations
    const createCategoryMutation = useCreateCategory();
    const updateCategoryMutation = useUpdateCategory();

    const initialValues: CategoryFormData = {
        name: category?.name || "",
        description: category?.description || "",
        color: category?.color || "#3B82F6",
    };

    const handleSubmit = async (
        values: CategoryFormData,
        { setSubmitting }: any
    ) => {
        try {
            if (isEditing) {
                await updateCategoryMutation.mutateAsync({
                    id: category.id,
                    data: values,
                });
            } else {
                await createCategoryMutation.mutateAsync(values);
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
                        {isEditing ? "Edit Category" : "Create New Category"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? "Update the category information below."
                            : "Fill in the category information below to create a new category."}
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
                    }) => {
                        return (
                            <Form>
                                <div className="space-y-4">
                                    {/* Category Name */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Category Name *
                                        </label>
                                        <Field
                                            as={Input}
                                            id="name"
                                            name="name"
                                            placeholder="e.g., Assignments"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>

                                    {/* Color */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">
                                            Color
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <Field
                                                as={Input}
                                                id="color"
                                                name="color"
                                                type="color"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className="w-16 h-10 p-1 border rounded"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {values.color}
                                            </span>
                                        </div>
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
                                            placeholder="Enter category description..."
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
                                                "Update Category"
                                            ) : (
                                                "Create Category"
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
