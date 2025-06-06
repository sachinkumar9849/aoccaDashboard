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

type TeamAddFormValues = PageFormValues & {
    designation: string;
};

interface NewsData {
    title: string;
    designation:string;
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

const TeamEdit = () => {
    const params = useParams();
    const router = useRouter();
    const newsId = params.id;

    const [image, setImage] = useState<File | null>(null);
    const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
    const queryClient = useQueryClient();


    // Validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        status: Yup.string().required("Status is required"),
        type: Yup.string().required("Type is required"),

    });

    // Initialize formik with default values
    const formik = useFormik<TeamAddFormValues>({
        initialValues: {
            title: "",
            type: "management",
            designation:"",
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
            console.log("Form values on submit", values)
            const formData = new FormData();

            formData.append("title", values.title);
            formData.append("designation", values.designation);
            formData.append("description", values.description);
            formData.append("name", values.name);
            formData.append("status", values.status || "published");
            formData.append("type", values.type);

            formData.append("linkedin", values.linkedin);
            // Add optional fields if they exist



            if (values.rating) formData.append("rating", values.rating);
            if (values.sort_order) formData.append("sort_order", values.sort_order);

            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            // Convert comma-separated keywords to array


            updateNewsMutation.mutate(formData);
            console.log("Form values on submit two=>", values)
        },
    });


    // Fetch news data
    const { data, isLoading, error } = useQuery<NewsData, Error>({
        queryKey: ['management-team-list', newsId],
        queryFn: async () => {
            console.log("Fetching news with ID:", newsId);
            try {
                // Use the apiClient utility which adds the authorization token
                const response = await apiClient.request<NewsData>(`/toper-testimonial-team-by-id/${newsId}`, {
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
            console.log("first", formData)
            // Make sure newsId is defined before calling updateNewsBlog
            if (!newsId) {
                throw new Error("News ID is required");
            }
            return await apiClient.request<UpdateNewsResponse>(`/update-toper-testimonial-team/${newsId}`, {
                method: "PATCH",
                body: formData,
            });
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['management-team-list'] });
            toast.success(data.message || "News updated successfully!");
            router.push("/management-team-list");
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while updating the news");
        },
    });

    const handleImageChange = (file: File | null) => {
        setImage(file);
    };

    // Generate slug from title

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

            // Set form values based on the API response structure designation
            formik.setValues({
                title: data.title || "",
                designation: data.designation || "",
                name: data.name || "",
                type: data.type || "team",
                slug: data.slug || "",
                description: data.description || "",
                status: data.status || "published",
                meta_title: data.seo?.meta_title || "",
                meta_description: data.seo?.meta_description || "",
                meta_keywords: metaKeywords,
                subtitle: data.subtitle || "",
                
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

    if (error) {
        return <div className="text-red-500">Error loading news: {(error as Error).message}</div>;
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="Management Team Edit">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                onChange={formik.handleChange}

                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="title">Qualification</Label>
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                onChange={formik.handleChange}

                                value={formik.values.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
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

                        {/* <div className="col-span-1">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                name="designation"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                    formik.handleBlur(e);

                                }}
                                value={formik.values.designation}
                            />

                        </div> */}
                        <div className="col-span-1">
                            <Label htmlFor="designation">Designation</Label>
                            <Input
                                id="designation"
                                name="designation"
                                type="text"
                                onChange={formik.handleChange}

                                value={formik.values.designation}
                            />
                            {formik.touched.designation && formik.errors.designation && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.designation}</div>
                            )}
                        </div>
                        
                        <div className="col-span-1">
                            <Label htmlFor="linkedin">Linkedin</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                type="text"
                                onChange={formik.handleChange}

                                value={formik.values.linkedin}
                            />
                            {formik.touched.linkedin && formik.errors.linkedin && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.linkedin}</div>
                            )}
                        </div>

                        <div className="col-span-1">
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="text"
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    console.log("New sort_order value:", e.target.value);
                                }}
                                value={formik.values.sort_order}
                            />
                        </div>

                        <div className="col-span-1">
                            <div className="grid grid-cols-1">
                                <div className="col-span-1">
                                    <div className="col-span-1 dd">
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
                       
                    </div>
                </ComponentCard>
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
                        onClick={() => router.push("/management-team-list")}
                        className="w-full flex items-center justify-center p-3 font-medium text-gray-600 rounded-lg bg-gray-200 text-theme-sm hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TeamEdit;