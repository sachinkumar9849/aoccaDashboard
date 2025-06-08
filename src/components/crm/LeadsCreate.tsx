
"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from 'next/navigation';
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import { SelectField } from "@/components/common/SelectFieldDemo";
import DatePicker from "@/components/crm/DatePickerDemo";
import { AxiosError } from "axios";
import { createLead } from "./leadService";
import toast from "react-hot-toast";
import { leadSchema } from "./leadSchema";

const LeadsCreate = () => {
  const [classRoutines, setClassRoutines] = React.useState<Array<{value: string, label: string}>>([]);
  const [isLoadingRoutines, setIsLoadingRoutines] = React.useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      router.push('/signin');
    }
  }, [router]);


  const mutation = useMutation({
    mutationFn: createLead,
    onSuccess: (data, variables) => {
      toast.success("Lead created successfully!");

      // Invalidate both leads and followUpList queries
      queryClient.invalidateQueries({
        queryKey: ['leads']
      });

      // If the created lead has status 'followUp', invalidate followUpList
      if (variables.status === 'followUp') {
        queryClient.invalidateQueries({
          queryKey: ['followUpList']
        });
      }

      formik.resetForm();
      router.push("/leads");
    },
    onError: (error: AxiosError<{ error?: string; message?: string }>) => {
      console.log('Error details:', {
        message: error.message,
        response: error.response,
        data: error.response?.data,
        status: error.response?.status
      });

      // Get the error message from various possible locations
      let errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to create lead";

      // Handle specific error cases
      if (errorMessage.includes('parsing time')) {
        errorMessage = "Please enter a valid follow-up date or leave it empty";
      }

      // Show the error in toast
      toast.error(errorMessage);

      // Special handling for phone number exists
      if (errorMessage.toLowerCase().includes('phone')) {
        const phoneInput = document.querySelector('input[name="phone"]');
        if (phoneInput) (phoneInput as HTMLElement).focus();
      }
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
      follow_up_date: "",
      tag: "",
      class_routine: "",
    },
    validationSchema: leadSchema,
    onSubmit: (values) => {
      mutation.mutate(values);
    },
  });

useEffect(() => {
  const fetchClassRoutines = async () => {
    if (formik.values.status === 'converted' && formik.values.inquiry) {
      try {
        setIsLoadingRoutines(true);
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Get the raw inquiry value without modification
        const inquiryType = formik.values.inquiry;
        
        const response = await fetch(
          `http://156.67.104.182:8081/api/v1/classes?status=true&type=${inquiryType}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Session expired. Please login again.');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !Array.isArray(data.data)) {
          throw new Error('Invalid data format received from API');
        }
        
        const routines = data.data.map((classItem: any) => ({
          value: classItem.id,
          label: classItem.session || `Class ${classItem.id}`
        }));
        
        setClassRoutines(routines);
      } catch (error) {
        console.error('Error fetching class routines:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to load class routines');
        setClassRoutines([]);
        
        if (error instanceof Error && error.message.includes('Session expired')) {
          router.push('/signin');
        }
      } finally {
        setIsLoadingRoutines(false);
      }
    } else {
      setClassRoutines([]);
    }
  };

  fetchClassRoutines();
}, [formik.values.inquiry, formik.values.status, router]);


  const previous_qualification = [
    { value: "ssc", label: "Secondary School Certificate" },
    { value: "hsc", label: "Higher Secondary Certificate (HSC)" },
    { value: "bachelor", label: "Bachelor Degree" },
  ];

  const current_status = [
    { value: "active", label: "Active" },
    { value: "pending", label: "Pending" },
    { value: "watingForResult", label: "Waiting for result" },
  ];



  const lead_source = [
    { value: "phone", label: "Phone" },
    { value: "physicalVisit", label: "Physical Visit" },
    { value: "website", label: "Website" },
    { value: "whatsapp", label: "Whatsapp" },
  ];

  const inquiryType = [
    { value: "CA-Foundation", label: "CA Foundation" },
    { value: "CA-Intermediate", label: "CA Intermediate" },
    { value: "CA-Final", label: "CA Final" },
    { value: "CA-mandatory", label: "Mandatory Training" },
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
    // Only set the date if it's not null, otherwise set to empty string
    formik.setFieldValue("follow_up_date", date ? date.toISOString() : "");
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <ComponentCard title="">
        <div className="flex justify-between mt-[-10px]">
          <p className="text-base font-medium text-gray-800 dark:text-white/90">
            Student Details
          </p>

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

                error={!!(formik.touched.full_name && formik.errors.full_name)}
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
                error={!!(formik.touched.phone && formik.errors.phone)}
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
                error={!!(formik.touched.email && formik.errors.email)}
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

                error={!!(formik.touched.address && formik.errors.address)}
              />
            </div>
          </div>
        </div>
      </ComponentCard>

      <ComponentCard className="mt-4 " title="Academic Background">
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

      <ComponentCard className="mt-4 mb-[100px]" title="Student Inquiry Management">
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

                error={!!(formik.touched.amount && formik.errors.amount)}
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

{formik.values.status === 'converted' && (
  <div className="col-span-1">
    <SelectField
      options={classRoutines}
      value={formik.values.class_routine}
      onChange={(value) => formik.setFieldValue("class_routine", value)}
      label="Class Routine"
      placeholder={
        isLoadingRoutines 
          ? "Loading..." 
          : formik.values.inquiry 
            ? classRoutines.length > 0 
              ? "Select class routine" 
              : "No routines available"
            : "Select inquiry type first"
      }
      isDisabled={isLoadingRoutines || !formik.values.inquiry || classRoutines.length === 0}
      isLoading={isLoadingRoutines}
    />
    {formik.touched.class_routine && formik.errors.class_routine && (
      <p className="mt-1 text-sm text-red-600">
        {formik.errors.class_routine}
      </p>
    )}
  </div>
)}


           
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
              {(formik.values.status === 'interested' || formik.values.status === 'followUp') && (
                <>
                  <Label>Follow Up Date</Label>
                  <DatePicker
                    value={formik.values.follow_up_date ? new Date(formik.values.follow_up_date) : null}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    className=""
                    dateFormat="yyyy-MM-dd"
                  />
                  {formik.touched.follow_up_date && formik.errors.follow_up_date && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.follow_up_date}
                    </p>
                  )}
                </>
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