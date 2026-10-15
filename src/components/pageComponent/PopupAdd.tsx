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
import { apiClient } from "@/api/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";

interface PopupFormValues {
  title: string;
  link_url: string;
  status: string;
  display_order: number | string;
}

const PopupAdd: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const createPopupMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiClient.createPopup(formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["popups-list"] });
      toast.success(data?.message || "Popup image created successfully!");
      router.push("/popup-list");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create popup image");
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().max(255, "Title cannot exceed 255 characters"),
    link_url: Yup.string().max(500, "Link URL cannot exceed 500 characters"),
    status: Yup.string().required("Status is required"),
    display_order: Yup.number().typeError("Display order must be a number").min(0, "Must be >= 0"),
  });

  const handleImageChange = (file: File | null) => {
    setImage(file);
    if (file) {
      setImageError(null);
    }
  };

  const formik = useFormik<PopupFormValues>({
    initialValues: {
      title: "",
      link_url: "",
      status: "active",
      display_order: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      if (!image) {
        setImageError("A popup image is required");
        toast.error("Please upload a popup image");
        return;
      }

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("link_url", values.link_url);
      formData.append("status", values.status);
      formData.append("display_order", String(values.display_order ?? 0));
      formData.append("image", image);

      createPopupMutation.mutate(formData);
    },
  });

  return (
    <div className="w-full space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/popup-list"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Popup List
        </Link>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <ComponentCard title="Add Header Popup Image">
          <div className="space-y-5">
            {/* Image Uploader */}
            <div>
              <Label htmlFor="image">
                Popup Image <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Upload promotional banner or notice image (JPG, PNG, WebP). Recommended size: 600x600px up to 1000x800px.
              </p>
              <ImageUploader
                onImageChange={handleImageChange}
                currentImage={image ? URL.createObjectURL(image) : null}
              />
              {imageError && (
                <p className="text-red-500 text-xs mt-1.5 font-medium">{imageError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div>
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="e.g., Admissions Open for CA Foundation"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.title}
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.title}</p>
                )}
              </div>

              {/* Target Link */}
              <div>
                <Label htmlFor="link_url">Target Link URL (Optional)</Label>
                <Input
                  id="link_url"
                  name="link_url"
                  type="text"
                  placeholder="e.g., /ca-foundation or https://..."
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.link_url}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Clicking the popup image will navigate to this link.
                </p>
                {formik.touched.link_url && formik.errors.link_url && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.link_url}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  name="status"
                  value={formik.values.status}
                  onValueChange={(value) => formik.setFieldValue("status", value)}
                >
                  <SelectTrigger className="w-full bg-white" style={{ height: "44px" }}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="active">Active (Visible on Website)</SelectItem>
                    <SelectItem value="inactive">Inactive (Hidden)</SelectItem>
                  </SelectContent>
                </Select>
                {formik.touched.status && formik.errors.status && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.status}</p>
                )}
              </div>

              {/* Display Order */}
              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  name="display_order"
                  type="number"
                  placeholder="0"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.display_order}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Lower numbers display first (e.g., 0, 1, 2).
                </p>
                {formik.touched.display_order && formik.errors.display_order && (
                  <p className="text-red-500 text-xs mt-1">{formik.errors.display_order}</p>
                )}
              </div>
            </div>
          </div>
        </ComponentCard>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <Link
            href="/popup-list"
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createPopupMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 shadow-sm"
          >
            <Upload size={16} />
            {createPopupMutation.isPending ? "Saving..." : "Publish Popup Image"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupAdd;
