"use client";

import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";

import { AppLayout } from "@/components/app-layout";
import { CourseDialog } from "@/components/course-dialog";
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
import { useCourses, useDeleteCourse } from "@/hooks/use-api";
import { formatDate } from "@/lib/utils";

export default function CoursesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState<any>(null);
    const [courseDialogOpen, setCourseDialogOpen] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState<any>(null);

    // Fetch data
    const { data: coursesData, isLoading } = useCourses();
    const deleteCourseMutation = useDeleteCourse();

    const courses = coursesData?.data?.data?.courses || [];

    // Filter and sort courses (newest first)
    const filteredCourses = courses
        .filter(
            (course) =>
                course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (course.description &&
                    course.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()))
        )
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );

    const handleDelete = async (course: any) => {
        setCourseToDelete(course);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (courseToDelete) {
            try {
                await deleteCourseMutation.mutateAsync(courseToDelete.id);
                setDeleteDialogOpen(false);
                setCourseToDelete(null);
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
                            Courses
                        </h1>
                        <p className="text-slate-600 mt-1">
                            Manage your academic courses and subjects
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search courses..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 h-9 pl-10"
                            />
                        </div>
                        <Button
                            onClick={() => {
                                setSelectedCourse(null);
                                setCourseDialogOpen(true);
                            }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            New Course
                        </Button>
                    </div>
                </div>

                {/* Courses Table */}
                <div className="rounded-md border bg-white">
                    {filteredCourses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="text-gray-400 mb-4">
                                <Search className="h-12 w-12" />
                            </div>
                            <h3 className="text-lg font-medium mb-2">
                                No courses found
                            </h3>
                            <p className="text-gray-500 text-center">
                                {searchTerm
                                    ? "Try adjusting your search terms"
                                    : "Create your first course to get started"}
                            </p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Course Code</TableHead>
                                    <TableHead>Course Name</TableHead>
                                    <TableHead>Credits</TableHead>
                                    <TableHead>Semester</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Created</TableHead>
                                    <TableHead className="text-right">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCourses.map((course) => (
                                    <TableRow key={course.id}>
                                        <TableCell className="font-medium">
                                            {course.code}
                                        </TableCell>
                                        <TableCell>{course.name}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 text-blue-700 border-blue-200"
                                            >
                                                {course.credits}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-green-50 text-green-700 border-green-200"
                                            >
                                                {course.semester}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className="bg-purple-50 text-purple-700 border-purple-200"
                                            >
                                                {course.year}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            {course.description ? (
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            ) : (
                                                <span className="text-gray-400 text-sm">
                                                    No description
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {formatDate(course.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedCourse(
                                                            course
                                                        );
                                                        setCourseDialogOpen(
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
                                                        handleDelete(course)
                                                    }
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </div>

                {/* Results Summary */}
                {filteredCourses.length > 0 && (
                    <div className="text-center text-sm text-gray-500">
                        Showing {filteredCourses.length} of {courses.length}{" "}
                        courses
                    </div>
                )}

                {/* Delete Confirmation Dialog */}
                {deleteDialogOpen && courseToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Card className="w-full max-w-md mx-4">
                            <CardHeader>
                                <CardTitle>Delete Course</CardTitle>
                                <CardDescription>
                                    Are you sure you want to delete "
                                    {courseToDelete.name}"? This action cannot
                                    be undone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setDeleteDialogOpen(false);
                                            setCourseToDelete(null);
                                        }}
                                        disabled={
                                            deleteCourseMutation.isPending
                                        }
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={confirmDelete}
                                        disabled={
                                            deleteCourseMutation.isPending
                                        }
                                    >
                                        {deleteCourseMutation.isPending ? (
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

                {/* Course Dialog */}
                <CourseDialog
                    open={courseDialogOpen}
                    onOpenChange={setCourseDialogOpen}
                    course={selectedCourse}
                />
            </div>
        </AppLayout>
    );
}
