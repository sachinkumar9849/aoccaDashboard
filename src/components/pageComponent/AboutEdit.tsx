"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import ImageUploader from "@/components/ImageUploader";
import SeoFields from "@/components/common/SeoFields";
import { PageFormValues, SeoFormValues, SeoResponse } from "@/types";
import { apiClient } from "@/api/client";
import {
    appendSeoFields,
    emptySeoValues,
    seoToFormValues,
    seoValidationSchema,
} from "@/lib/seo";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import FroalaEditorWrapper from "@/components/CaCourse/FroalaEditorWrapper";
import { useRouter } from "next/navigation";

interface PageData {
    id: number;
    title: string;
    subtitle: string;
    description: string;
    image_url: string;
    slug: string;
    status: string;
    created_at: string;
    updated_at: string;
    seo?: SeoResponse;
}

// Define the API response type for update mutation
interface UpdatePageResponse {
    message: string;
    data?: PageData;
}

const AboutEdit = () => {
    const router = useRouter();
    // Hardcoded page ID for the About page
    const pageId = "1";

    const [image, setImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();
    
    // Validation schema
    const validationSchema = Yup.object({
        ...seoValidationSchema,
        title: Yup.string().required("Title is required"),

        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
    });

    // Initialize formik with default values
    const formik = useFormik<PageFormValues & SeoFormValues>({
        initialValues: {
            ...emptySeoValues,
            title: "",
            subtitle: "",
            slug: "",
            description: "",
            status: "published",
            type: "",
            name: "",
            linkedin: "",
            rating: "",
            sort_order: "",
            video: ""
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("slug", values.slug);
            formData.append("description", values.description);
            formData.append("status", values.status);

            // Add optional fields if they exist
            if (values.subtitle) formData.append("subtitle", values.subtitle);

            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            appendSeoFields(formData, values);

            updatePageMutation.mutate(formData);
        },
    });

    // Fetch page data
    const { data, isLoading, error } = useQuery<PageData, Error>({
        queryKey: ['about-page-details'],
        queryFn: async () => {
            console.log("Fetching page with ID:", pageId);
            try {
                // Use the apiClient utility which adds the authorization token
                const response = await apiClient.request<PageData>(`/page-by-id/${pageId}`, {
                    method: "GET"
                });
                console.log("API Response:", response);
                return response;
            } catch (error) {
                console.error("Error fetching page:", error);
                toast.error("Failed to fetch page data");
                throw error;
            }
        },
        // Enable immediately since we're using a hardcoded pageId
        enabled: true,
    });

    // Update mutation with proper type
    const updatePageMutation = useMutation<UpdatePageResponse, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            return await apiClient.request<UpdatePageResponse>(`/update-page/${pageId}`, {
                method: "PATCH",
                body: formData,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['about-page-details'] });
            toast.success(data.message || "About page updated successfully!");
            // Optionally navigate to a different page after successful update
            // router.push("/dashboard");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while updating the page");
        },
    });

    const handleImageChange = (file: File | null) => {
        setImage(file);
    };

    // Generate slug from title
    const generateSlug = () => {
        const slug = formik.values.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-");
        formik.setFieldValue("slug", slug);
    };

    // Use useEffect to check for auth token
    useEffect(() => {
        // Check if token exists, if not redirect to login
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Authentication required");
            router.push("/login");
            return;
        }
    }, [router]);

    // Set form values when data is loaded
    useEffect(() => {
        if (data) {
            // Set form values based on the API response structure
            formik.setValues({
                ...seoToFormValues(data.seo),
                title: data.title || "",
                subtitle: data.subtitle || "",
                slug: data.slug || "",
                description: data.description || "",
                status: data.status || "published",
                type: "",
                name: "",
                linkedin: "",
                rating: "",
                sort_order: "",
                video: ""
            });

            // Set current image URL if available
            if (data.image_url) {
                setCurrentImageUrl(data.image_url);
            }
        }
    }, [data]);

    if (error) {
        return <div className="text-red-500">Error loading page: {(error as Error).message}</div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="About Page Edit">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                    formik.handleBlur(e);
                                    if (formik.values.title && !formik.values.slug) {
                                        generateSlug();
                                    }
                                }}
                                value={formik.values.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                            )}
                        </div>
                        {/* <div className="col-span-1">
                            <Label htmlFor="slug">Slug</Label>
                            <div className="flex">
                                <Input
                                    id="slug"
                                    name="slug"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.slug}
                                />
                                <button
                                    type="button"
                                    className="ml-2 px-3 py-2 bg-gray-200 rounded-md text-sm"
                                    onClick={generateSlug}
                                >
                                    Generate
                                </button>
                            </div>
                            {formik.touched.slug && formik.errors.slug && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.slug}</div>
                            )}
                        </div> */}
                        <div className="col-span-1">
                            <Label htmlFor="subtitle">Subtitle</Label>
                            <Input
                                id="subtitle"
                                name="subtitle"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.subtitle}
                            />
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="description">Description</Label>
                            {/* Client-side only rendering with proper null/undefined checks */}
                            {formik.values.description !== undefined && (
                                <FroalaEditorWrapper
                                    value={formik.values.description || ""}
                                    onChange={(model: string) => formik.setFieldValue('description', model)}
                                />
                            )}
                            {formik.touched.description && formik.errors.description && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                            )}
                        </div>
                   
                       
                        <div className="col-span-1">
                            <Label htmlFor="image">Featured Image</Label>
                            <ImageUploader
                                onImageChange={handleImageChange}
                                currentImage={image ? URL.createObjectURL(image) : currentImageUrl}
                            />
                            {currentImageUrl && !image && (
                                <p className="text-sm text-gray-500 mt-1">Current image will be kept unless a new one is selected</p>
                            )}
                        </div>
                        <div className="col-span-1">
                            <div className="col-span-1 mt-0">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    name="status"
                                    value={formik.values.status}
                                    onValueChange={(value) => formik.setFieldValue("status", value)}
                                >
                                    <SelectTrigger className="w-full" style={{ height: "44px" }}>
                                        <SelectValue placeholder="published" />
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
                        </div>
                    </div>
                </ComponentCard>
                <SeoFields formik={formik} />

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={updatePageMutation.isPending}
                        className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                    >
                        {updatePageMutation.isPending ? "Updating..." : "Update About Page"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/dashboard")}
                        className="w-full flex items-center justify-center p-3 font-medium text-gray-600 rounded-lg bg-gray-200 text-theme-sm hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AboutEdit;