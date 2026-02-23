"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams, useRouter } from "next/navigation";
import { apiClient } from "@/api/client";

interface ClassData {
  id: string;
  session: string;
  total_student: number;
  status: boolean;
  type: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface ApiResponse {
  data: ClassData;
  message: string;
}

const validationSchema = Yup.object({
  session: Yup.string().required("Session is required"),
  total_student: Yup.number()
    .required("Total student is required")
    .min(1, "Must be at least 1"),
  status: Yup.boolean().required("Status is required"),
});

const UpdateClassPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const queryClient = useQueryClient();

  // Fetch class data
  const { data: classData, isLoading } = useQuery<ApiResponse>({
    queryKey: ["class", id],
    queryFn: () => apiClient.request(`/class-detail/${id}`),
    enabled: !!id,
  });

  // Update mutation with immediate refetch
  const updateMutation = useMutation({
    mutationFn: (values: {
      session: string;
      total_student: number;
      status: boolean;
      type: string;
    }) =>
      apiClient.request(`/update-class/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }),
    onMutate: async () => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ['routine-ca-intermediate'] });

      // Snapshot the previous value
      const previousClasses = queryClient.getQueryData(['routine-ca-intermediate']);

      // Optimistically update to the new value

      return { previousClasses };
    },
    onSuccess: async () => {
      toast.success("Class updated successfully!");

      // Invalidate and refetch both queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["class", id] }),
        queryClient.invalidateQueries({ queryKey: ["routine-ca-intermediate"] })
      ]);

      router.push("/routine-ca-intermediate");
    },
    onError: (error: Error, variables, context) => {
      // Rollback the optimistic update
      if (context?.previousClasses) {
        queryClient.setQueryData(['routine-ca-intermediate'], context.previousClasses);
      }
      toast.error(error.message || "Failed to update class");
    },
  });

  const formik = useFormik({
    initialValues: {
      session: classData?.data?.session || "",
      total_student: classData?.data?.total_student || 0,
      status: classData?.data?.status === true || String(classData?.data?.status) === "true",
      type: "CA-Intermediate",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      updateMutation.mutate(values);
    },
  });

  // Manual sync to ensure the form accurately reflects API data
  useEffect(() => {
    if (classData?.data) {
      formik.setValues({
        session: classData.data.session || "",
        total_student: classData.data.total_student || 0,
        status: Boolean(classData.data.status),
        type: "CA-Intermediate",
      });
    }
  }, [classData?.data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form key={classData?.data?.id || "loading"} onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-5">
        <ComponentCard title="CA Intermediate routine update">
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-1">
              <Label htmlFor="session">Session</Label>
              <Input
                id="session"
                name="session"
                type="text"
                value={formik.values.session}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

              />
            </div>
            <div className="col-span-1">
              <Label htmlFor="total_student">Total Student</Label>
              <Input
                id="total_student"
                name="total_student"
                type="number"
                value={formik.values.total_student}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}

              />
            </div>
            <div className="col-span-1">
              <div className="grid grid-cols-1">
                <div className="col-span-1">
                  <div className="col-span-1 mt-3 dd">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      key={String(formik.values.status)}
                      name="status"
                      value={formik.values.status ? "true" : "false"}
                      onValueChange={(value) =>
                        formik.setFieldValue("status", value === "true")
                      }
                    >
                      <SelectTrigger className="w-full" style={{ height: "44px" }}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="true">True</SelectItem>
                        <SelectItem value="false">False</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.status && formik.errors.status && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.status}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-2 flex mt-3 gap-2">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
              >
                {updateMutation.isPending ? "Updating..." : "Update"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/routine-ca-intermediate")}
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

export default UpdateClassPage;