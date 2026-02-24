"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import DatePicker from '@/components/crm/DatePickerDemo';

interface Subject {
    id: string;
    code: string;
    name: string;
}

interface ExamSubject {
    id: string;
    subject_id: string;
    full_marks: number;
    sort_order: number;
}

interface ExamDetail {
    id: string;
    class_management_id: string;
    exam_type: string;
    title: string;
    conducted_at: string;
    notes: string;
    class_management: {
        id: string;
        session: string;
        type: string;
    };
    exam_subjects: ExamSubject[];
}

export default function EditExam() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({
        exam_type: '',
        title: '',
        conducted_at: '',
        notes: '',
        subject_ids: [] as string[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch existing exam
    const { data: exam, isLoading: isExamLoading } = useQuery<ExamDetail>({
        queryKey: ['exam', id],
        queryFn: () => apiClient.request<ExamDetail>(`/exams/${id}`),
    });

    // Fetch all subjects
    const { data: subjectsData } = useQuery({
        queryKey: ['subjects', 'all'],
        queryFn: () => apiClient.request<{ data: Subject[] }>('/subjects?page=1&limit=100')
    });
    const allSubjects = subjectsData?.data || [];

    useEffect(() => {
        if (exam) {
            // Populate form
            setFormData({
                exam_type: exam.exam_type || 'weekly',
                title: exam.title || '',
                // slice to YYYY-MM-DD for date input
                conducted_at: exam.conducted_at ? exam.conducted_at.slice(0, 10) : '',
                notes: exam.notes || '',
                subject_ids: exam.exam_subjects ? exam.exam_subjects.map(es => es.subject_id) : []
            });
        }
    }, [exam]);

    const mutation = useMutation({
        mutationFn: (updatedExam: typeof formData) =>
            apiClient.request(`/exams/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedExam),
            }),
        onSuccess: () => {
            toast.success('Exam updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            queryClient.invalidateQueries({ queryKey: ['exam', id] });
            router.push('/exams');
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Failed to update exam');
        },
    });

    const validate = () => {
        let isValid = true;
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
            isValid = false;
        }
        if (!formData.conducted_at) {
            newErrors.conducted_at = 'Conducted date is required';
            isValid = false;
        }
        if (formData.subject_ids.length === 0) {
            newErrors.subject_ids = 'At least one subject is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            mutation.mutate(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubjectCheckbox = (subjectId: string) => {
        setFormData((prev) => {
            const subject_ids = prev.subject_ids.includes(subjectId)
                ? prev.subject_ids.filter(sid => sid !== subjectId)
                : [...prev.subject_ids, subjectId];

            if (errors.subject_ids && subject_ids.length > 0) {
                setErrors((e) => ({ ...e, subject_ids: '' }));
            }
            return { ...prev, subject_ids };
        });
    };

    if (isExamLoading) {
        return <div className="p-6">Loading exam details...</div>;
    }

    if (!exam) {
        return <div className="p-6 text-red-500">Failed to load exam details.</div>;
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-medium text-gray-800">Edit Exam</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Editing for Session: <span className="font-medium text-gray-700">{exam.class_management?.session}</span> ({exam.class_management?.type})
                    </p>
                </div>
                <Link href="/exams">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Exam Type */}
                    <div>
                        <label htmlFor="exam_type" className="block text-sm font-medium text-gray-700 mb-1">
                            Exam Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="exam_type"
                            name="exam_type"
                            value={formData.exam_type}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300 bg-white"
                        >
                            <option value="weekly">Weekly</option>
                            <option value="monthly">Monthly</option>
                            <option value="mock_test">Mock Test</option>
                        </select>
                    </div>

                    {/* Conducted At */}
                    <div>
                        <DatePicker
                            label="Conducted Date *"
                            value={formData.conducted_at || null}
                            onChange={(date) => {
                                if (date) {
                                    const yyyy = date.getFullYear();
                                    const mm = String(date.getMonth() + 1).padStart(2, '0');
                                    const dd = String(date.getDate()).padStart(2, '0');
                                    setFormData(prev => ({ ...prev, conducted_at: `${yyyy}-${mm}-${dd}` }));
                                } else {
                                    setFormData(prev => ({ ...prev, conducted_at: '' }));
                                }
                                if (errors.conducted_at) {
                                    setErrors(prev => ({ ...prev, conducted_at: '' }));
                                }
                            }}
                            format="YYYY-MM-DD"
                            placeholder="Select conducted date"
                        />
                        {errors.conducted_at && <p className="mt-1 text-sm text-red-500">{errors.conducted_at}</p>}
                    </div>

                    {/* Title */}
                    <div className="md:col-span-2">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Weekly Test Jan 2026"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2">
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                        </label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Optional notes..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500"
                            rows={3}
                        />
                    </div>

                    {/* Subjects Grid */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Subjects <span className="text-red-500">*</span>
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 border rounded-md bg-gray-50 border-gray-200">
                            {allSubjects.length === 0 && <span className="text-sm text-gray-500">No subjects available</span>}
                            {allSubjects.map((sub) => (
                                <label key={sub.id} className="flex items-center space-x-3 cursor-pointer p-2 hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 cursor-pointer"
                                        checked={formData.subject_ids.includes(sub.id)}
                                        onChange={() => handleSubjectCheckbox(sub.id)}
                                    />
                                    <span className="text-sm font-medium text-gray-800">
                                        {sub.name} <span className="text-gray-500 font-normal">({sub.code})</span>
                                    </span>
                                </label>
                            ))}
                        </div>
                        {errors.subject_ids && <p className="mt-1 text-sm text-red-500">{errors.subject_ids}</p>}
                    </div>

                    {/* Submit Button */}
                    <div className="md:col-span-2 pt-4 flex justify-end gap-3">
                        <Link href="/exams">
                            <Button variant="outline" type="button">Cancel</Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="min-w-[150px]"
                        >
                            {mutation.isPending ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
