"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface ClassFormValues {
    session: string;
    total_student: number;
    type: string;
    status: boolean;
}

const CreateClassForm = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    // Function to get auth token (adjust based on your auth implementation)
    const getAuthToken = () => {
        // Option 1: From localStorage
        return localStorage.getItem('authToken') || localStorage.getItem('token');
        
        // Option 2: From cookies (if you're using cookies)
        // return document.cookie.split(';').find(c => c.trim().startsWith('token='))?.split('=')[1];
        
        // Option 3: From context/state management
        // return authContext.token;
    };

    // Validation schema
    const validationSchema = Yup.object({
        session: Yup.string().required("Session is required"),
        total_student: Yup.number()
            .required("Total students is required")
            .min(1, "Must be at least 1 student"),
       
        status: Yup.boolean().required("Status is required"),
    });

    // Create class mutation
    const createClassMutation = useMutation({
        mutationFn: async (values: ClassFormValues) => {
            const token = getAuthToken();
            
            if (!token) {
                throw new Error("No authentication token found. Please login again.");
            }
            

            const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/create-class`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Common authorization header formats:
                    "Authorization": `Bearer ${token}`, // Most common
                    // Alternative formats you might need:
                    // "Authorization": `Token ${token}`,
                    // "X-Auth-Token": token,
                    // "x-access-token": token,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Authentication failed. Please login again.");
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to create class");
            }
            
            return response.json();
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['routine-ca-final-list'] });
            toast.success(data.message || "Class created successfully!");
            formik.resetForm();
            router.push("/routine-ca-final");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while creating the class");
            
            // If it's an auth error, you might want to redirect to login
            if (error.message.includes("Authentication") || error.message.includes("login")) {
                setTimeout(() => {
                    router.push("/login"); // Adjust path as needed
                }, 2000);
            }
        },
    });

    // Initialize formik
    const formik = useFormik<ClassFormValues>({
        initialValues: {
            session: "",
            total_student: 0,
            type: "CA-Final",
            status: true, // true for published, false for draft
        },
        validationSchema,
        onSubmit: (values) => {
            createClassMutation.mutate(values);
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="CA Foundation Routine Add">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="session">Session</Label>
                            <Input
                                id="session"
                                name="session"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.session}
                            />
                            {formik.touched.session && formik.errors.session && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.session}</div>
                            )}
                        </div>

                        <div className="col-span-1">
                            <Label htmlFor="total_student">Total Student</Label>
                            <Input
                                id="total_student"
                                name="total_student"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.total_student}
                            />
                            {formik.touched.total_student && formik.errors.total_student && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.total_student}</div>
                            )}
                        </div>

                    

                        <div className="col-span-1">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                name="status"
                                value={formik.values.status ? "published" : "draft"}
                                onValueChange={(value) => formik.setFieldValue("status", value === "published")}
                            >
                                <SelectTrigger className="w-full" style={{ height: "44px" }}>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    <SelectItem value="published">Published</SelectItem>
                                    <SelectItem value="draft">Draft</SelectItem>
                                </SelectContent>
                            </Select>
                            {formik.touched.status && formik.errors.status && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.status}</div>
                            )}
                        </div>

                        <div className="col-span-2">
                            <button
                                type="submit"
                                disabled={createClassMutation.isPending}
                                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                            >
                                {createClassMutation.isPending ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </form>
    );
};

export default CreateClassForm;