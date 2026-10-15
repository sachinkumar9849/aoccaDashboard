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
import { apiClient } from "@/api/client";
import { PopupItem } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import TableListLoading from "../loading/TableListLoading";

interface PopupFormValues {
  title: string;
  link_url: string;
  status: string;
  display_order: number | string;
}

const PopupEdit: React.FC = () => {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const popupId = params?.id as string;

  const [newImage, setNewImage] = useState<File | null>(null);

  const { data: popup, isLoading, isError, error } = useQuery<PopupItem>({
    queryKey: ["popup-detail", popupId],
    queryFn: () => apiClient.getPopupById(popupId),
    enabled: !!popupId,
  });

  const updatePopupMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return await apiClient.updatePopup(popupId, formData);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["popups-list"] });
      queryClient.invalidateQueries({ queryKey: ["popup-detail", popupId] });
      toast.success(data?.message || "Popup updated successfully!");
      router.push("/popup-list");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to update popup image");
    },
  });

  const validationSchema = Yup.object({
    title: Yup.string().max(255, "Title cannot exceed 255 characters"),
    link_url: Yup.string().max(500, "Link URL cannot exceed 500 characters"),
    status: Yup.string().required("Status is required"),
    display_order: Yup.number().typeError("Display order must be a number").min(0, "Must be >= 0"),
  });

  const formik = useFormik<PopupFormValues>({
    initialValues: {
      title: "",
      link_url: "",
      status: "active",
      display_order: 0,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("link_url", values.link_url);
      formData.append("status", values.status);
      formData.append("display_order", String(values.display_order ?? 0));

      if (newImage) {
        formData.append("image", newImage);
      }

      updatePopupMutation.mutate(formData);
    },
  });

  useEffect(() => {
    if (popup) {
      formik.setValues({
        title: popup.title || "",
        link_url: popup.link_url || "",
        status: popup.status || "active",
        display_order: popup.display_order ?? 0,
      });
    }
  }, [popup]);

  if (isLoading) {
    return <TableListLoading />;
  }

  if (isError || !popup) {
    return (
      <div className="p-4 border rounded bg-red-100 border-red-400 text-red-700">
        <p className="font-medium">Error loading popup details</p>
        <p>{(error as Error)?.message || "Popup not found"}</p>
        <Link href="/popup-list" className="inline-block mt-3 text-sm underline">
          Back to Popup List
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
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
        <ComponentCard title="Edit Header Popup Image">
          <div className="space-y-5">
            {/* Image Preview and Replacement */}
            <div>
              <Label htmlFor="image">Popup Image</Label>
              <p className="text-xs text-gray-500 mb-2">
                Current image is displayed below. Upload a new image to replace it, or leave as is.
              </p>
              <ImageUploader
                onImageChange={(file) => setNewImage(file)}
                currentImage={
                  newImage ? URL.createObjectURL(newImage) : popup.image_url || null
                }
              />
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
            disabled={updatePopupMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 shadow-sm"
          >
            <Save size={16} />
            {updatePopupMutation.isPending ? "Saving Changes..." : "Update Popup Image"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupEdit;
