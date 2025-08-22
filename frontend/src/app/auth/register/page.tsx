"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as Yup from "yup";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRegister } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const registerSchema = Yup.object().shape({
    firstName: Yup.string()
        .min(2, "First name must be at least 2 characters")
        .required("First name is required"),
    lastName: Yup.string()
        .min(2, "Last name must be at least 2 characters")
        .required("Last name is required"),
    email: Yup.string()
        .email("Please enter a valid email address")
        .required("Email is required"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Please confirm your password"),
    studentId: Yup.string()
        .min(1, "Student ID is required")
        .max(20, "Student ID must be 20 characters or less")
        .required("Student ID is required"),
    programme: Yup.string()
        .min(2, "Programme must be at least 2 characters")
        .required("Programme is required"),
    university: Yup.string().optional(),
});

type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    studentId: string;
    programme: string;
    university?: string;
};

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const registerMutation = useRegister();
    const { toast } = useToast();

    const initialValues: RegisterFormData = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        studentId: "",
        programme: "",
        university: "",
    };

    const handleSubmit = async (
        values: RegisterFormData,
        { setSubmitting, setFieldError }: any
    ) => {
        try {
            await registerMutation.mutateAsync(values);
            toast({
                title: "Success",
                description: "Account created successfully! Please log in.",
            });
            router.push("/auth/login");
        } catch (error: any) {
            // Handle validation errors
            if (error?.response?.data?.errors) {
                error.response.data.errors.forEach((err: any) => {
                    setFieldError(err.field, err.message);
                });
            } else {
                toast({
                    title: "Error",
                    description:
                        error?.response?.data?.message ||
                        "Registration failed. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        Create an account
                    </CardTitle>
                    <CardDescription className="text-center">
                        Enter your information to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={registerSchema}
                        onSubmit={handleSubmit}
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
                                            errors.email && touched.email
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
                                        htmlFor="programme"
                                        className="text-sm font-medium"
                                    >
                                        Programme *
                                    </label>
                                    <Field
                                        as={Input}
                                        id="programme"
                                        name="programme"
                                        placeholder="MSc Information Technology"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={
                                            errors.programme &&
                                            touched.programme
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <ErrorMessage
                                        name="programme"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="university"
                                        className="text-sm font-medium"
                                    >
                                        University (Optional)
                                    </label>
                                    <Field
                                        as={Input}
                                        id="university"
                                        name="university"
                                        placeholder="University Name"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        className={
                                            errors.university &&
                                            touched.university
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    <ErrorMessage
                                        name="university"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium"
                                    >
                                        Password
                                    </label>
                                    <div className="relative">
                                        <Field
                                            as={Input}
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Create a password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className={
                                                errors.password &&
                                                touched.password
                                                    ? "border-red-500 pr-10"
                                                    : "pr-10"
                                            }
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <ErrorMessage
                                        name="password"
                                        component="p"
                                        className="text-sm text-red-500"
                                    />
                                    <div className="text-xs text-gray-500 mt-1">
                                        Password must be at least 6 characters
                                        long
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="text-sm font-medium"
                                    >
                                        Confirm Password
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
                                            placeholder="Confirm your password"
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
                                    className="w-full"
                                    disabled={
                                        isSubmitting ||
                                        registerMutation.isPending
                                    }
                                >
                                    {isSubmitting ||
                                    registerMutation.isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create account"
                                    )}
                                </Button>
                            </Form>
                        )}
                    </Formik>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                href="/auth/login"
                                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
