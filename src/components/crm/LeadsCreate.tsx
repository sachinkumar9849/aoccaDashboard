
"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
 import { useRouter } from 'next/navigation';

import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import { SelectField } from "@/components/common/SelectFieldDemo";
import { NotesMenu } from "@/components/crm/NotesMenu";
import DatePicker from "@/components/crm/DatePickerDemo";

import { AxiosError } from "axios";
import { createLead } from "./leadService";
import toast from "react-hot-toast";
import { leadSchema } from "./leadSchema";

const LeadsCreate = () => {
    const router = useRouter();
     useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/signin');
    }
  }, [router]);
  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: () => {
      toast.success("Lead created successfully!");
      formik.resetForm();
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create lead");
    },
  });

  const formik = useFormik({
    initialValues: {
      full_name: "",
      phone: "",
      email: "",
      address: "",
      previous_qualification: "",
      current_status: "",
      lead_source: "",
      inquiry: "",
      amount: 0,
      status: "new",
      follow_up_date: null,
      tag: "warm",
    },
    validationSchema: leadSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

  const previous_qualification = [
    { value: "ssc", label: "Secondary School Certificate" },
    { value: "hsc", label: "Higher Secondary Certificate (HSC)" },
    { value: "bachelor", label: "Bachelor Degree" },
  ];

  const current_status = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "waitingForesult", label: "Waiting for result" },
  ];

  const lead_source = [
    { value: "phone", label: "Phone" },
    { value: "physicalVisit", label: "Physical Visit" },
    { value: "website", label: "Website" },
    { value: "whatsapp", label: "Whatsapp" },
  ];

  const inquiryType = [
    { value: "caFoundation", label: "CA Foundation" },
    { value: "caIntermediate", label: "CA Intermediate" },
    { value: "caFinal", label: "CA Final" },
    { value: "mandatoryTraining", label: "Mandatory Training" },
  ];

  const status = [
    { value: "new", label: "New" },
    { value: "followUp", label: "Follow Up" },
    { value: "interested", label: "Interested" },
    { value: "converted", label: "Converted" },
    { value: "notInterested", label: "Not Interested" },
    { value: "canceled", label: "Canceled" },
  ];

  const tag = [
    { value: "hot", label: "Hot" },
    { value: "warm", label: "Warm" },
    { value: "cold", label: "Cold" },
  ];
   const handleDateChange = (date: Date | null) => {
        formik.setFieldValue("follow_up_date", date);
    };

  return (
    <form onSubmit={formik.handleSubmit}>
      <ComponentCard title="">
        <div className="flex justify-between mt-[-1px]">
          <p className="text-base font-medium text-gray-800 dark:text-white/90">
            Student Details
          </p>
          <NotesMenu />
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1">
              <Label>Full Name</Label>
              <Input
                type="text"
                name="full_name"
                value={formik.values.full_name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.full_name && formik.errors.full_name
                    ? formik.errors.full_name
                    : undefined
                }
              />
            </div>
            <div className="col-span-1">
              <Label>Phone</Label>
              <Input
                type="text"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.phone && formik.errors.phone
                    ? formik.errors.phone
                    : undefined
                }
              />
            </div>
            <div className="col-span-1">
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.email && formik.errors.email
                    ? formik.errors.email
                    : undefined
                }
              />
            </div>
            <div className="col-span-1">
              <Label>Address</Label>
              <Input
                type="text"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.address && formik.errors.address
                    ? formik.errors.address
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard className="mt-4" title="Academic Background">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
              <SelectField
                options={previous_qualification}
                value={formik.values.previous_qualification}
                onChange={(value) =>
                  formik.setFieldValue("previous_qualification", value)
                }
                label="Previous Qualification"
                placeholder="Choose a Qualification"
              />
              {formik.touched.previous_qualification &&
                formik.errors.previous_qualification && (
                  <p className="mt-1 text-sm text-red-600">
                    {formik.errors.previous_qualification}
                  </p>
                )}
            </div>
            <div className="col-span-1">
              <SelectField
                options={current_status}
                value={formik.values.current_status}
                onChange={(value) =>
                  formik.setFieldValue("current_status", value)
                }
                label="Current Status"
                placeholder="Choose status"
              />
              {formik.touched.current_status && formik.errors.current_status && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.current_status}
                </p>
              )}
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard className="mt-4" title="Student Inquiry Management">
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <SelectField
                options={lead_source}
                value={formik.values.lead_source}
                onChange={(value) => formik.setFieldValue("lead_source", value)}
                label="Lead Source"
                placeholder="Choose source"
              />
              {formik.touched.lead_source && formik.errors.lead_source && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.lead_source}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <SelectField
                options={inquiryType}
                value={formik.values.inquiry}
                onChange={(value) => formik.setFieldValue("inquiry", value)}
                label="Inquiry Type"
                placeholder="Choose inquiry type"
              />
              {formik.touched.inquiry && formik.errors.inquiry && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.inquiry}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <Label>Amount</Label>
              <Input
                type="number"
                name="amount"
                value={formik.values.amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.amount && formik.errors.amount
                    ? formik.errors.amount
                    : undefined
                }
              />
            </div>
            <div className="col-span-1">
              <SelectField
                options={status}
                value={formik.values.status}
                onChange={(value) => formik.setFieldValue("status", value)}
                label="Status"
                placeholder="Choose a status"
              />
              {formik.touched.status && formik.errors.status && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.status}
                </p>
              )}
            </div>
            <div className="col-span-1">
              <SelectField
                options={tag}
                value={formik.values.tag}
                onChange={(value) => formik.setFieldValue("tag", value)}
                label="Lead Priority"
                placeholder="Select Lead Priority"
              />
              {formik.touched.tag && formik.errors.tag && (
                <p className="mt-1 text-sm text-red-600">
                  {formik.errors.tag}
                </p>
              )}
            </div>
          <div className="col-span-1">
                            <Label>Follow Up Date</Label>
                            <DatePicker
                                selected={formik.values.follow_up_date}
                                onChange={handleDateChange}
                                minDate={new Date()}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Select follow up date"
                            />
                            {formik.touched.follow_up_date && formik.errors.follow_up_date && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formik.errors.follow_up_date}
                                </p>
                            )}
                        </div>
            <div className="col-span-3">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {mutation.isPending ? "Creating..." : "CREATE LEAD"}
              </button>
            </div>
          </div>
        </div>
      </ComponentCard>
    </form>
  );
};

export default LeadsCreate;