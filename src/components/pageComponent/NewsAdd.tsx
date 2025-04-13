"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import ImageUploader from "@/components/ImageUploader";
import { PageFormValues, PageResponse } from "@/types";
import { apiClient } from "@/api/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import FroalaEditorWrapper from "@/components/CaCourse/FroalaEditorWrapper";
import { useRouter } from "next/navigation";

const NewsAdd = () => {

    const [image, setImage] = useState<File | null>(null);
    const router = useRouter();
    const queryClient = useQueryClient();

    // Create page mutation
    const createPageMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await apiClient.createNewsBlog(formData) as PageResponse;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['news-blog'] });
            toast.success(data.message || "Page created successfully!");
            formik.resetForm();
            setImage(null);
            router.push("/news-list")
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while creating the page");
        },
    });

    // Validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        slug: Yup.string().required("Slug is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        type: Yup.string().required("Type is required"),
    });


    const handleImageChange = (file: File | null) => {
        setImage(file);
    };


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
            console.log("form values before FormData:", values); // Log all values

            const formData = new FormData();
            formData.append("title", values.title);

            formData.append("slug", values.slug);
            formData.append("description", values.description);
            formData.append("status", values.status);
            formData.append("type", values.type);
            formData.append("meta_title", values.meta_title);
            formData.append("meta_description", values.meta_description);

            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            // Convert comma-separated keywords to array
            const keywordsArray = values.meta_keywords
                .split(",")
                .map((keyword) => keyword.trim());
            formData.append("meta_keywords", JSON.stringify(keywordsArray));

            createPageMutation.mutate(formData);
        },
    });
    // Handle editor change


    // Generate slug from title
    const generateSlug = () => {
        const slug = formik.values.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "_");
        formik.setFieldValue("slug", slug);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="News">
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
                        </div>


                        <div className="col-span-2">
                            <Label htmlFor="description">Description</Label>
                            {typeof window !== 'undefined' && (
                                <FroalaEditorWrapper
                                    value={formik.values.description}
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
                                currentImage={image ? URL.createObjectURL(image) : null}
                            />
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
                        <div className="col-span-2">
                            <button
                                type="submit"
                                disabled={createPageMutation.isPending}
                                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                            >
                                {createPageMutation.isPending ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </ComponentCard>
            </div>
        </form>
    );
};

export default NewsAdd;