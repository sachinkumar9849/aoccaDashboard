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
import { apiClient } from "@/api/client";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const NewsBlog = () => {
    const editorRef = useRef(null);
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
        description: Yup.string().required("Description is required"),
        status: Yup.string().required("Status is required"),
        type: Yup.string().required("Type is required"),

    });

    // Handle image upload
    const handleImageChange = (file: File | null) => {
        setImage(file);
    };

    // Initialize formik
    const formik = useFormik<PageFormValues>({
        initialValues: {
            title: "",
            type: "testimonial",
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
          

            const formData = new FormData();
            formData.append("title", values.title);
            formData.append("name", values.name);
            formData.append("rating", values.rating);
            formData.append("description", values.description);
            formData.append("status", values.status);
            formData.append("type", values.type);


            // Add image to formData if available
            if (image) {
                formData.append("image", image);
            }

            // Convert comma-separated keywords to array
           

            createPageMutation.mutate(formData);
        },
    });
    // Handle editor change
    const handleEditorChange = (content: string) => {
        formik.setFieldValue("description", content);
    };

    // Generate slug from title


    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard title="Testimonial add">
                    <div className="grid grid-cols-2 gap-4">


                        <div className="col-span-1">
                            <div className="grid grid-cols-1 gap-4">


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
                                    <Label htmlFor="rating">Rating</Label>
                                    <Input
                                        id="rating"
                                        name="rating"
                                        type="text"
                                        onChange={formik.handleChange}
                                        onBlur={(e) => {
                                            formik.handleBlur(e);

                                        }}
                                        value={formik.values.rating}
                                    />
                                    {formik.touched.rating && formik.errors.rating && (
                                        <div className="text-red-500 text-sm mt-1">{formik.errors.rating}</div>
                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="col-span-1">
                            <div className="grid grid-cols-1">
                                <div className="col-span-1">
                                    <Label htmlFor="image">Featured Image</Label>
                                    <ImageUploader
                                        onImageChange={handleImageChange}
                                        currentImage={image ? URL.createObjectURL(image) : null}
                                    />
                                </div>
                                <div className="col-span-1">
                                    <div className="col-span-1 mt-3 dd">
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