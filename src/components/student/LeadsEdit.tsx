import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import { SelectField } from '../common/SelectFieldDemo';
import DatePicker from '../crm/DatePickerDemo';
import { useRouter } from 'next/navigation';

// Define types locally to avoid import issues
interface ApiResponse<T> {
    data: T[];
    message?: string;
    success?: boolean;
}

interface ClassRoutine {
    id: string;
    session?: string;
    type?: string;
    status?: boolean;
}

interface Lead {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    address?: string;
    previous_qualification?: string;
    status: string;
    tag?: string;
    follow_up_date?: string;
    current_status?: string;
    lead_source?: string;
    inquiry?: string;
    class_routine?: string;
    amount: number;
}

interface LeadsEditProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    lead: Lead;
}

const LeadsEdit: React.FC<LeadsEditProps> = ({ isOpen, onOpenChange, lead }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [classRoutines, setClassRoutines] = React.useState<{ value: string, label: string }[]>([]);
    const [isLoadingRoutines, setIsLoadingRoutines] = React.useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();

    const previous_qualification = [
        { value: "ssc", label: "Secondary School Certificate" },
        { value: "hsc", label: "Higher Secondary Certificate (HSC)" },
        { value: "bachelor", label: "Bachelor Degree" },
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

    const handleDateChange = (date: Date | null) => {
        formik.setFieldValue("follow_up_date", date ? date.toISOString() : "");
    };

    const updateLeadMutation = useMutation({
        mutationFn: (updatedLead: Partial<Lead>) => {
            const token = localStorage.getItem('authToken') || '';
            return axios.patch(
                `${process.env.NEXT_PUBLIC_URL}/leads/${lead.id}`,
                updatedLead,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['leads'] });
            toast.success('Lead updated successfully');
            setIsSubmitting(false);
            onOpenChange(false);
        },
        onError: (error) => {
            console.log(error)
        }
    });

    const formik = useFormik({
        initialValues: {
            full_name: lead.full_name,
            phone: lead.phone,
            email: lead.email,
            address: lead.address,
            status: lead.status,
            amount: lead.amount,
            tag: lead.tag || '',
            inquiry: lead.inquiry || '',
            lead_source: lead.lead_source || '',
            class_routine: lead.class_routine || '',
            previous_qualification: lead.previous_qualification || "",
            follow_up_date: lead.follow_up_date ? lead.follow_up_date.split('T')[0] : '',
        },
        onSubmit: (values) => {
            updateLeadMutation.mutate({
                ...values,
                follow_up_date: values.follow_up_date ? `${values.follow_up_date}T00:00:00Z` : undefined
            });
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

                    const inquiryType = formik.values.inquiry;

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_URL}/classes?status=true&type=${inquiryType}`,
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

                    const data: ApiResponse<ClassRoutine> = await response.json();

                    if (!data || !Array.isArray(data.data)) {
                        throw new Error('Invalid data format received from API');
                    }

                    const routines = data.data.map((classItem: ClassRoutine) => ({
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

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!isSubmitting) {
                    onOpenChange(open);
                }
            }}
        >
            <DialogContent
                className="max-h-[80vh] overflow-y-auto"
                onInteractOutside={(e) => {
                    if (isSubmitting) {
                        e.preventDefault();
                    }
                }}
                onEscapeKeyDown={(e) => {
                    if (isSubmitting) {
                        e.preventDefault();
                    }
                }}
            >
                <DialogHeader>
                    <DialogTitle>Edit Lead</DialogTitle>
                </DialogHeader>
                <form onSubmit={formik.handleSubmit} className=" ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] ">
                        <div className="col-span-1">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.full_name}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="tel"
                                onChange={formik.handleChange}
                                value={formik.values.phone}
                            />
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="phone">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="tel"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                            />
                        </div>
                        <div className="col-span-1">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="text"
                                type="address"
                                onChange={formik.handleChange}
                                value={formik.values.address}
                            />
                        </div>
                    </div>
                    <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

                        <div className="col-span-1">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                onChange={formik.handleChange}
                                value={formik.values.status}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="waitingForResult">Waiting for result</option>
                            </select>
                        </div>

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
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">

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
                            <Label htmlFor="amount">Amount</Label>
                            <Input
                                id="amount"
                                name="amount"
                                type="text"
                                onChange={formik.handleChange}
                                value={formik.values.amount}
                            />
                        </div>
                        <div className="col-span-1">
                            <SelectField
                                options={inquiryType}
                                value={formik.values.inquiry}
                                onChange={(value) => formik.setFieldValue("inquiry", value)}
                                label="Inquiry Type"
                                placeholder="Choose inquiry type"
                                direction="up"
                            />
                            {formik.touched.inquiry && formik.errors.inquiry && (
                                <p className="mt-1 text-sm text-red-600">
                                    {formik.errors.inquiry}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Tag</Label>
                            <select
                                id="tag"
                                name="tag"
                                onChange={formik.handleChange}
                                value={formik.values.tag}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="hot">Hot</option>
                                <option value="warm">Warm</option>
                                <option value="cold">Cold</option>
                            </select>
                        </div>

                        <div className="col-span-1">
                            <SelectField
                                options={status}
                                value={formik.values.status}
                                onChange={(value) => formik.setFieldValue("status", value)}
                                label="Status"
                                placeholder="Choose a status"
                                direction="up"
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
                                    direction="up"
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
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={updateLeadMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className='bg-[#0c55a2] text-white'
                            type="submit"
                            disabled={updateLeadMutation.isPending}
                        >
                            {updateLeadMutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default LeadsEdit;