"use client";
import React, { useEffect, useState } from "react";
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
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";

const TopperStudent = () => {
  const [image, setImage] = useState<File | null>(null);
const queryClient = useQueryClient();
const router = useRouter();
  // Create page mutation
  const createPageMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiClient.createTeam(formData) as PageResponse;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['topper-student-list'] });
      toast.success(data.message || "Page created successfully!");
      formik.resetForm();
      setImage(null);
      router.push("/topper-list")
    },
    onError: (error: Error) => {
      toast.error(error.message || "An error occurred while creating the page");
    },
  });

  // Validation schema
  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    description: Yup.string().required("Description is required"),
    slug: Yup.string().required("Slug is required"),
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
      type: "topper",
      slug: "",
      description: "",
      status: "published",
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
      // The Name input was previously discarded — the title was sent as the name.
      formData.append("name", values.name || values.title);
      formData.append("description", values.description);
      formData.append("slug", values.slug);
      formData.append("status", values.status);
      formData.append("type", values.type);
      formData.append("sort_order", values.sort_order);

      // Add image to formData if available
      if (image) {
        formData.append("image", image);
      }


      createPageMutation.mutate(formData);
    },
  });

  // Generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s]/gi, "")
            .replace(/\s+/g, "-");
    };
    // Auto-generate slug when title changes
    useEffect(() => {
        if (formik.values.title) {
            const slug = generateSlug(formik.values.title);
            formik.setFieldValue("slug", slug);
        }
    }, [formik.values.title]);

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        <ComponentCard title="Topper student add">
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
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                name="sort_order"
                                type="number"
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    console.log("New sort_order value:", e.target.value);
                                }}
                                value={formik.values.sort_order}
                            />
                        </div>
            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
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


            <div className="col-span-2">
              <Label htmlFor="image">Featured Image</Label>
              <ImageUploader
                onImageChange={handleImageChange}
                currentImage={image ? URL.createObjectURL(image) : null}
              />
            </div>

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
        </ComponentCard>

        <button
          type="submit"
          disabled={createPageMutation.isPending}
          className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
        >
          {createPageMutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default TopperStudent;