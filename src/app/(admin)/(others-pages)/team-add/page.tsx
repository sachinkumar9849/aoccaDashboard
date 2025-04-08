"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
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

const NewsBlog = () => {
    const [image, setImage] = useState<File | null>(null);

    // Create page mutation
    const createPageMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await apiClient.createTeam(formData) as PageResponse;
        },
        onSuccess: (data) => {
            toast.success(data.message || "Page created successfully!");
            formik.resetForm();
            setImage(null);
        },
        onError: (error: Error) => {
            toast.error(error.message || "An error occurred while creating the page");
        },
    });

    // Validation schema
    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        name: Yup.string().required("Name is required"),
        status: Yup.string().required("Status is required"),
    });

    // Handle image upload
    const handleImageChange = (file: File | null) => {
        setImage(file);
    };

    // Initialize formik
    const formik = useFormik<PageFormValues>({
        initialValues: {
            title: "",
            name: "",
            type: "team",
            slug: "",
            description: "",
            linkedin: "",
            status: "",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            subtitle: ""
        },

        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("type", values.type);
            formData.append("name", values.name);
            formData.append("linkedin", values.linkedin);
            formData.append("status", values.status);
            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            // Convert comma-separated keywords to array


            createPageMutation.mutate(formData);
        },
    });


    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="News & Blogs">
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

                                }}
                                value={formik.values.title}
                            />
                            {formik.touched.title && formik.errors.title && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.title}</div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                    formik.handleBlur(e);

                                }}
                                value={formik.values.name}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.name}</div>
                            )}
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="linkedin">linkedin</Label>
                            <Input
                                id="linkedin"
                                name="linkedin"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                    formik.handleBlur(e);

                                }}
                                value={formik.values.linkedin}
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
                                </div>
                            </div>
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="image">Featured Image</Label>
                            <ImageUploader
                                onImageChange={handleImageChange}
                                currentImage={image ? URL.createObjectURL(image) : null}
                            />
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

export default NewsBlog;