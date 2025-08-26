"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, Loader2, Save, User } from "lucide-react";
import { useState } from "react";
import * as Yup from "yup";

import { AppLayout } from "@/components/app-layout";
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
    useChangePassword,
    useProfile,
    useUpdateProfile,
} from "@/hooks/use-api";

const profileSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .required("Last name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    studentId: Yup.string()
        .min(1, "Student ID is required")
        .required("Student ID is required"),
    phone: Yup.string().optional(),
});

type ProfileFormData = {
    firstName: string;
    lastName: string;
    email: string;
    studentId: string;
    phone?: string;
};

const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
        .min(1, "Current password is required")
        .required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
        )
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords must match")
        .required("Please confirm your password"),
});

type PasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

export default function SettingsPage() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Fetch user profile
    const { data: profileData, isLoading } = useProfile();
    const updateProfileMutation = useUpdateProfile();
    const changePasswordMutation = useChangePassword();

    const profile = profileData?.data?.data?.user || profileData?.data?.user;

    const profileInitialValues: ProfileFormData = {
        firstName: profile?.firstName || "",
        lastName: profile?.lastName || "",
        email: profile?.email || "",
        studentId: profile?.studentId || "",
        phone: profile?.phone || "",
    };

    const passwordInitialValues: PasswordFormData = {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    };

    const handleProfileSubmit = async (
        values: ProfileFormData,
        { setSubmitting }: any
    ) => {
        try {
            await updateProfileMutation.mutateAsync(values);
        } catch (error) {
            // Error is handled by the mutation hook
        } finally {
            setSubmitting(false);
        }
    };

    const handlePasswordSubmit = async (
        values: PasswordFormData,
        { setSubmitting, resetForm }: any
    ) => {
        try {
            await changePasswordMutation.mutateAsync({
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            resetForm();
        } catch (error) {
            // Error is handled by the mutation hook
        } finally {
            setSubmitting(false);
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
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Profile Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Profile Information
                            </CardTitle>
                            <CardDescription>
                                Update your personal information and contact
                                details
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Formik
                                initialValues={profileInitialValues}
                                validationSchema={profileSchema}
                                onSubmit={handleProfileSubmit}
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
                                    isSubmitting,
                                }) => (
                                    <Form className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="firstName"
                                                    className="text-sm font-medium"
                                                >
                                                    First Name
                                                </label>
                                                <Field
                                                    as={Input}
                                                    id="firstName"
                                                    name="firstName"
                                                    placeholder="John"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.firstName &&
                                                        touched.firstName
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                <ErrorMessage
                                                    name="firstName"
                                                    component="p"
                                                    className="text-sm text-red-500"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="lastName"
                                                    className="text-sm font-medium"
                                                >
                                                    Last Name
                                                </label>
                                                <Field
                                                    as={Input}
                                                    id="lastName"
                                                    name="lastName"
                                                    placeholder="Doe"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.lastName &&
                                                        touched.lastName
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                />
                                                <ErrorMessage
                                                    name="lastName"
                                                    component="p"
                                                    className="text-sm text-red-500"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="email"
                                                className="text-sm font-medium"
                                            >
                                                Email
                                            </label>
                                            <Field
                                                as={Input}
                                                id="email"
                                                name="email"
                                                type="email"
                                                placeholder="john.doe@university.edu"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.email &&
                                                    touched.email
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <ErrorMessage
                                                name="email"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="studentId"
                                                className="text-sm font-medium"
                                            >
                                                Student ID
                                            </label>
                                            <Field
                                                as={Input}
                                                id="studentId"
                                                name="studentId"
                                                placeholder="24055140"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.studentId &&
                                                    touched.studentId
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <ErrorMessage
                                                name="studentId"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="phone"
                                                className="text-sm font-medium"
                                            >
                                                Phone Number (Optional)
                                            </label>
                                            <Field
                                                as={Input}
                                                id="phone"
                                                name="phone"
                                                placeholder="+1 (555) 123-4567"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                className={
                                                    errors.phone &&
                                                    touched.phone
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            <ErrorMessage
                                                name="phone"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={
                                                isSubmitting ||
                                                updateProfileMutation.isPending
                                            }
                                        >
                                            {isSubmitting ||
                                            updateProfileMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Save Changes
                                                </>
                                            )}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                    </Card>

                    {/* Password Settings */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Change Password</CardTitle>
                            <CardDescription>
                                Update your password to keep your account secure
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Formik
                                initialValues={passwordInitialValues}
                                validationSchema={passwordSchema}
                                onSubmit={handlePasswordSubmit}
                                validateOnChange={false}
                                validateOnBlur={true}
                            >
                                {({
                                    values,
                                    errors,
                                    touched,
                                    handleChange,
                                    handleBlur,
                                    isSubmitting,
                                }) => (
                                    <Form className="space-y-4">
                                        <div className="space-y-2">
                                            <label
                                                htmlFor="currentPassword"
                                                className="text-sm font-medium"
                                            >
                                                Current Password
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="currentPassword"
                                                    name="currentPassword"
                                                    type={
                                                        showCurrentPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter current password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.currentPassword &&
                                                        touched.currentPassword
                                                            ? "border-red-500 pr-10"
                                                            : "pr-10"
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowCurrentPassword(
                                                            !showCurrentPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showCurrentPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <ErrorMessage
                                                name="currentPassword"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="newPassword"
                                                className="text-sm font-medium"
                                            >
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="newPassword"
                                                    name="newPassword"
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Enter new password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.newPassword &&
                                                        touched.newPassword
                                                            ? "border-red-500 pr-10"
                                                            : "pr-10"
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showNewPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                Password must be at least 8
                                                characters long and contain
                                                uppercase, lowercase, number,
                                                and special character
                                            </p>
                                            <ErrorMessage
                                                name="newPassword"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label
                                                htmlFor="confirmPassword"
                                                className="text-sm font-medium"
                                            >
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <Field
                                                    as={Input}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    placeholder="Confirm new password"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className={
                                                        errors.confirmPassword &&
                                                        touched.confirmPassword
                                                            ? "border-red-500 pr-10"
                                                            : "pr-10"
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="p"
                                                className="text-sm text-red-500"
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            variant="outline"
                                            disabled={
                                                isSubmitting ||
                                                changePasswordMutation.isPending
                                            }
                                        >
                                            {isSubmitting ||
                                            changePasswordMutation.isPending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Changing Password...
                                                </>
                                            ) : (
                                                "Change Password"
                                            )}
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
