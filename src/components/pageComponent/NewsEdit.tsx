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
import { PageFormValues } from "@/types";
import { apiClient } from "@/api/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useParams, useRouter } from "next/navigation";
import Editor from "../common/Editor";

interface NewsData {
    title: string;
    type: string;
    slug: string;
    description: string;
    status: string;
    subtitle?: string;
    name?: string;
    linkedin?: string;
    rating?: string;
    sort_order?: string;
    image_url?: string;
    video?: string;
    seo?: {
        meta_title: string;
        meta_description: string;
        meta_keywords: string[];
    };
}

// Define the API response type for update mutation
interface UpdateNewsResponse {
    message: string;
    data?: [];
}

const NewsEdit = () => {
    const params = useParams();
    const router = useRouter();
    const newsId = params.id;

    const [image, setImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const queryClient = useQueryClient();


    // Validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        slug: Yup.string().required("Slug is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        type: Yup.string().required("Type is required"),

    });
    // Generate slug from title - fixed function
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-");
    };

    // Initialize formik with default values
    const formik = useFormik<PageFormValues>({
        initialValues: {
            title: "",
            type: "news",
            slug: "",
            description: "",
            status: "published",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            subtitle: "",
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
            formData.append("type", values.type);
            formData.append("meta_title", values.meta_title);
            formData.append("meta_description", values.meta_description);
            formData.append("status", values.status || "published");
            // Add optional fields if they exist
            if (values.subtitle) formData.append("subtitle", values.subtitle);
            if (values.name) formData.append("name", values.name);
            if (values.linkedin) formData.append("linkedin", values.linkedin);
            if (values.rating) formData.append("rating", values.rating);
            if (values.sort_order) formData.append("sort_order", values.sort_order);

            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            // Convert comma-separated keywords to array
            const keywordsArray = values.meta_keywords
                .split(",")
                .map((keyword) => keyword.trim());
            formData.append("meta_keywords", JSON.stringify(keywordsArray));

            updateNewsMutation.mutate(formData);
        },
    });

    // Fetch news data
    const { data, isLoading, error } = useQuery<NewsData, Error>({
        queryKey: ['news-details', newsId],
        queryFn: async () => {
            console.log("Fetching news with ID:", newsId);
            try {
                // Use the apiClient utility which adds the authorization token
                const response = await apiClient.request<NewsData>(`/news-blog-id/${newsId}`, {
                    method: "GET"
                });
                console.log("API Response:", response);
                return response;
            } catch (error) {
                console.error("Error fetching news:", error);
                toast.error("Failed to fetch news data");
                throw error;
            }
        },
        enabled: !!newsId,
    });

    // Update mutation with proper type
    const updateNewsMutation = useMutation<UpdateNewsResponse, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            // Make sure newsId is defined before calling updateNewsBlog
            if (!newsId) {
                throw new Error("News ID is required");
            }
            return await apiClient.request<UpdateNewsResponse>(`/update-news-blog/${newsId}`, {
                method: "PATCH",
                body: formData,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['news-blog'] });
            toast.success(data.message || "News updated successfully!");
            router.push("/news-list");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while updating the news");
        },
    });

    const handleImageChange = (file: File | null) => {
        setImage(file);
    };



    // Use useEffect to populate form data after fetching
    useEffect(() => {
        console.log("Component mounted with newsId:", newsId);

        // Check if token exists, if not redirect to login
        const token = localStorage.getItem("authToken");
        if (!token) {
            toast.error("Authentication required");
            router.push("/login");
            return;
        }
    }, [newsId, router]);

    // Set form values when data is loaded
    useEffect(() => {
        if (data) {
            console.log("Setting form values from data:", data);

            // Convert meta_keywords from array format to string
            let metaKeywords = "";
            if (data.seo?.meta_keywords && Array.isArray(data.seo.meta_keywords) && data.seo.meta_keywords.length > 0) {
                try {
                    const keywordStr = data.seo.meta_keywords[0];
                    // Try to parse if it looks like JSON
                    if (keywordStr.includes('[') || keywordStr.includes('"')) {
                        const parsedKeywords = JSON.parse(keywordStr.replace(/\\/g, ''));
                        metaKeywords = Array.isArray(parsedKeywords) ? parsedKeywords.join(", ") : keywordStr;
                    } else {
                        metaKeywords = keywordStr;
                    }
                } catch (e) {
                    console.error("Error parsing keywords:", e);
                    // Fallback if parsing fails
                    metaKeywords = data.seo.meta_keywords[0].replace(/[\[\]"\\]/g, '');
                }
            }

            // Set form values based on the API response structure
            formik.setValues({
                title: data.title || "",
                type: data.type || "news",
                slug: data.slug || "",
                description: data.description || "",
                status: data.status || "published",
                meta_title: data.seo?.meta_title || "",
                meta_description: data.seo?.meta_description || "",
                meta_keywords: metaKeywords,
                subtitle: data.subtitle || "",
                name: data.name || "",
                linkedin: data.linkedin || "",
                rating: data.rating || "",
                sort_order: data.sort_order || "",
                video: data.video || "",
            });

            // Set current image URL if available
            if (data.image_url) {
                setCurrentImageUrl(data.image_url);
            }

            console.log("Form values after setting:", formik.values);
        }
    }, [data]);
    useEffect(() => {
        // Skip the first render when data is initially loaded
        if (isInitialLoad) {
            setIsInitialLoad(false);
            return;
        }

        // Only update slug if title exists and we're past initial data loading
        if (formik.values.title) {
            const newSlug = generateSlug(formik.values.title);
            formik.setFieldValue("slug", newSlug);
        }
    }, [formik.values.title, isInitialLoad]);

    if (error) {
        return <div className="text-red-500">Error loading news: {(error as Error).message}</div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="Edit News">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                            )}
                        </div>
                        <div className="col-span-1">
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

                            </div>
                            {formik.touched.slug && formik.errors.slug && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.slug}</div>
                            )}
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="description">Description</Label>
                            {/* Client-side only rendering with proper null/undefined checks */}
                            {formik.values.description !== undefined && (

                                <Editor
                                    value={formik.values.description}
                                    onChange={(content: string) => {
                                        formik.setFieldValue('description', content);
                                        formik.setFieldTouched('description', true, false);
                                    }}
                                    height="300px"
                                    placeholder="Enter blog content here..."
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
                            <div className="grid grid-cols-1">
                                <div className="col-span-1">
                                    <div className="col-span-1 mt-3 dd">
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
                        </div>
                    </div>
                </ComponentCard>
                <ComponentCard title="Seo">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="meta_title">Meta Title</Label>
                            <Input
                                id="meta_title"
                                name="meta_title"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.meta_title}
                            />
                            {formik.touched.meta_title && formik.errors.meta_title && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.meta_title}</div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="meta_keywords">Meta Keywords</Label>
                            <Input
                                id="meta_keywords"
                                name="meta_keywords"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.meta_keywords}
                                placeholder="keyword1, keyword2, keyword3"
                            />
                            {formik.touched.meta_keywords && formik.errors.meta_keywords && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.meta_keywords}</div>
                            )}
                        </div>
                        <div className="col-span-2">
                            <Label htmlFor="meta_description">Meta Description</Label>
                            <textarea
                                id="meta_description"
                                name="meta_description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.meta_description}
                                className="w-full h-[200px] px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm"
                            />
                            {formik.touched.meta_description && formik.errors.meta_description && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.meta_description}</div>
                            )}
                        </div>
                        <div className="col-span-2 flex gap-4">
                            <button
                                type="submit"
                                disabled={updateNewsMutation.isPending}
                                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                            >
                                {updateNewsMutation.isPending ? "Updating..." : "Update"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.push("/news-list")}
                                className="w-full flex items-center justify-center p-3 font-medium text-gray-600 rounded-lg bg-gray-200 text-theme-sm hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </form>
    );
};

export default NewsEdit;