"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import { PageFormValues, PageResponse } from "@/types";
import { apiClient } from "@/api/client";
import dynamic from 'next/dynamic';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const FroalaEditorWrapper = dynamic(
  () => import('./FroalaEditorWrapper'),
  { ssr: false }
);

const CaFinal = () => {
    const [image, setImage] = useState<File | null>(null);

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

    const validationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        slug: Yup.string().required("Slug is required"),
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        type: Yup.string().required("Type is required"),
        sort_order: Yup.string().required("Sort order is required"),
    });

    const formik = useFormik<PageFormValues>({
        initialValues: {
            title: "",
            type: "ca-final",
            slug: "",
            description: "",
            status: "",
            meta_title: "",
            meta_description: "",
            meta_keywords: "",
            subtitle: "",
            name: "",
            linkedin: "",
            rating: "",
            sort_order: ""
        },

        validationSchema,
        onSubmit: (values) => {
            console.log("form values before FormData:", values);

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("description", values.description);
            formData.append("slug", values.slug);
            formData.append("status", values.status);
            formData.append("type", values.type);
            formData.append("meta_title", values.meta_title);
            formData.append("meta_description", values.meta_description);

            if (image) {
                formData.append("image", image);
            }

            const keywordsArray = values.meta_keywords
                .split(",")
                .map((keyword) => keyword.trim());
            formData.append("meta_keywords", JSON.stringify(keywordsArray));

            createPageMutation.mutate(formData);
        },
    });

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
                <ComponentCard title="CAP II">
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
                            <Label htmlFor="sort_order">Sort Order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={(e) => {
                                    formik.handleBlur(e);
                                    if (formik.values.sort_order && !formik.values.slug) {
                                        generateSlug();
                                    }
                                }}
                                value={formik.values.sort_order}
                            />
                            {formik.touched.sort_order && formik.errors.sort_order && (
                                <div className="text-red-500 text-sm mt-1">{formik.errors.sort_order}</div>
                            )}
                        </div>
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
                        <div className="col-span-2 mt-4">
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

export default CaFinal;