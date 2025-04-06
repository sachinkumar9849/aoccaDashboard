"use client";
import React, { useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import ImageUploader from "@/components/ImageUploader";
import { Editor } from '@tinymce/tinymce-react';
import { PageFormValues, PageResponse } from "@/types";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


const AboutPage = () => {
    const editorRef = useRef(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [authToken, setAuthToken] = useState<string>("");

    // Create page mutation
    const createPageMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            // Get the token from wherever you store it (localStorage, cookies, context)
            const token = localStorage.getItem('authToken') || authToken;

            if (!token) {
                throw new Error("Authentication token is required. Please log in.");
            }

            const response = await fetch("http://156.67.104.182:8081/api/v1/create-page", {
                method: "POST",
                headers: {
                    // Include authorization header with token
                    "Authorization": `Bearer ${token}`
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create page");
            }

            return response.json() as Promise<PageResponse>;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Page created successfully!");
            formik.resetForm();
            setImagePreview(null);
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
        meta_title: Yup.string().required("Meta title is required"),
        meta_description: Yup.string()
            .required("Meta description is required"),
        meta_keywords: Yup.string().required("Meta keywords are required"),
        // image: Yup.mixed().required("Image is required"),
    });

    // Initialize formik
    const formik = useFormik<PageFormValues>({
        initialValues: {
            title: "",
            slug: "",
            description: "",
            status: "published",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            image_url: null,
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("slug", values.slug);
            formData.append("description", values.description);
            formData.append("status", values.status);
            formData.append("meta_title", values.meta_title);
            formData.append("meta_description", values.meta_description);

            // Convert comma-separated keywords to array
            const keywordsArray = values.meta_keywords
                .split(",")
                .map((keyword) => keyword.trim());
            formData.append("meta_keywords", JSON.stringify(keywordsArray));

            // Append image if available
            if (values.image_url) {
                formData.append("image", values.image_url);
            }

            createPageMutation.mutate(formData);
        },
    });

    // Handle editor change
    const handleEditorChange = (content: string) => {
        formik.setFieldValue("description", content);
    };

    // Handle image upload
    const handleImageUpload = (file: File) => {
        formik.setFieldValue("image_url", file);

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };


    // Generate slug from title
    const generateSlug = () => {
        const slug = formik.values.title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "_");
        formik.setFieldValue("slug", slug);
    };

    // Check for saved token on component mount
    React.useEffect(() => {
        const savedToken = localStorage.getItem('authToken');
        if (savedToken) {
            setAuthToken(savedToken);
        }
    }, []);

    return (
        <ComponentCard title="About Page">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                        <Label htmlFor="status">Status</Label>
                        <Select
                            name="status"
                            value={formik.values.status}
                            onValueChange={(value) => formik.setFieldValue("status", value)}
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
                        <Label htmlFor="meta_description">Meta Description</Label>
                        <Input
                            id="meta_description"
                            name="meta_description"
                            type="text"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.meta_description}
                        />
                        {formik.touched.meta_description && formik.errors.meta_description && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.meta_description}</div>
                        )}

                    </div>

                    <div className="col-span-2">
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
                        <Label htmlFor="description">Description</Label>
                        <div className="rounded-md">
                            <Editor
                                apiKey="zw0tzn1q9dadm2o14w6yqre555kee2qm29jlw65qqi021swt"
                                onInit={(evt, editor) => (editorRef.current = editor)}
                                value={formik.values.description}
                                onEditorChange={handleEditorChange}
                                init={{
                                    height: 300,
                                    menubar: false,
                                    border: false,
                                    plugins: [
                                        "advlist", "autolink", "lists", "link", "image", "charmap", "preview",
                                        "anchor", "searchreplace", "visualblocks", "code", "fullscreen",
                                        "insertdatetime", "media", "table", "code", "help", "wordcount"
                                    ],
                                    toolbar:
                                        "undo redo | blocks | " +
                                        "bold italic forecolor | alignleft aligncenter " +
                                        "alignright alignjustify | bullist numlist outdent indent | " +
                                        "removeformat | help",
                                    content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
                                }}
                            />
                        </div>
                        {formik.touched.description && formik.errors.description && (
                            <div className="text-red-500 text-sm mt-1">{formik.errors.description}</div>
                        )}
                    </div>

                    <div className="col-span-2">
                        <Label htmlFor="image">Image</Label>
                        <div className="mt-1">
                            <ImageUploader onImageUpload={handleImageUpload} preview={imagePreview} />
                            {formik.touched.image_url && formik.errors.image_url && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.image_url as string}</div>
                            )}
                        </div>
                    </div>

                    <div className="col-span-4">
                        <button
                            type="submit"
                            disabled={createPageMutation.isPending || !authToken}
                            className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                        >
                            {createPageMutation.isPending ? "Submitting..." : "Submit"}
                        </button>
                        {!authToken && (
                            <p className="text-red-500 text-sm mt-1">
                                Please enter an authentication token to submit the form
                            </p>
                        )}
                    </div>
                </div>
            </form>
        </ComponentCard>
    );
};

export default AboutPage;