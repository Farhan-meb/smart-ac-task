"use client";

import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/app-layout";
import { CategoryDialog } from "@/components/category-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useCategories, useDeleteCategory } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";
import { Category } from "@/types/task";

export default function CategoriesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<any>(null);
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    // Fetch data
    const { data: categoriesData, isLoading } = useCategories();
    const deleteCategoryMutation = useDeleteCategory();

    const categories: Category[] =
        categoriesData?.data?.data?.categories ||
        categoriesData?.data?.categories ||
        [];

    // Filter and sort categories (newest first)
    const filteredCategories = categories
        .filter(
            (category: Category) =>
                category.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                category.description
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        )
        .sort(
            (a: Category, b: Category) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

    const handleDelete = async (category: Category) => {
        setCategoryToDelete(category);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (categoryToDelete) {
            try {
                await deleteCategoryMutation.mutateAsync(categoryToDelete.id);
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
            } catch (error) {
                // Error is handled by the mutation hook
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <AppLayout>
            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Categories
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Organize your tasks with categories
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search categories..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 h-9 pl-10"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedCategory(null);
                                setCategoryDialogOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Category
                        </Button>
                    </div>
                </div>

                {/* Categories Table */}
                <div className="rounded-md border bg-white">
                    {filteredCategories.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                No categories found
                            </h3>
                            <p className="text-gray-500 text-center">
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "Create your first category to get started"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Total Tasks</TableHead>
                                    <TableHead>Completed</TableHead>
                                    <TableHead>Pending</TableHead>
                                    <TableHead>Progress</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCategories.map(
                                    (category: Category) => (
                                        <TableRow key={category.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded-full"
                                                        style={{
                                                            backgroundColor:
                                                                category.color,
                                                        }}
                                                    ></div>
                                                    <span className="font-medium">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-xs">
                                                {category.description ? (
                                                    <p className="text-sm text-gray-600 line-clamp-2">
                                                        {category.description}
                                                    </p>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">
                                                        No description
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {category.tasks?.length ||
                                                        0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-green-50 text-green-700 border-green-200"
                                                >
                                                    {category.tasks?.filter(
                                                        (task: any) =>
                                                            task.status ===
                                                            "COMPLETED"
                                                    ).length || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-yellow-50 text-yellow-700 border-yellow-200"
                                                >
                                                    {category.tasks?.filter(
                                                        (task: any) =>
                                                            task.status ===
                                                            "PENDING"
                                                    ).length || 0}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {(category.tasks?.length || 0) >
                                                0 ? (
                                                    <Badge
                                                        variant="outline"
                                                        className="bg-blue-50 text-blue-700 border-blue-200"
                                                    >
                                                        {Math.round(
                                                            ((category.tasks?.filter(
                                                                (task: any) =>
                                                                    task.status ===
                                                                    "COMPLETED"
                                                            ).length || 0) /
                                                                (category.tasks
                                                                    ?.length ||
                                                                    0)) *
                                                                100
                                                        )}
                                                        %
                                                    </Badge>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">
                                                        No tasks
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {formatDate(category.createdAt)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedCategory(
                                                                category
                                                            );
                                                            setCategoryDialogOpen(
                                                                true
                                                            );
                                                        }}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            handleDelete(
                                                                category
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Delete Confirmation Dialog */}
                {deleteDialogOpen && categoryToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md mx-4">
                            <CardHeader>
                                <CardTitle>Delete Category</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete "
                                    {categoryToDelete.name}"? This action cannot
                                    be undone.
                                    {categoryToDelete.tasks?.length > 0 && (
                                        <span className="block mt-2 text-red-600">
                                            Warning: This category has{" "}
                                            {categoryToDelete.tasks.length}{" "}
                                            associated tasks.
                                        </span>
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDeleteDialogOpen(false);
                                            setCategoryToDelete(null);
                                        }}
                                        disabled={
                                            deleteCategoryMutation.isPending
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={confirmDelete}
                                        disabled={
                                            deleteCategoryMutation.isPending
                                        }
                                    >
                                        {deleteCategoryMutation.isPending ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Deleting...
                                            </>
                                        ) : (
                                            "Delete"
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Category Dialog */}
                <CategoryDialog
                    open={categoryDialogOpen}
                    onOpenChange={setCategoryDialogOpen}
                    category={selectedCategory}
                />
            </div>
        </AppLayout>
    );
}
