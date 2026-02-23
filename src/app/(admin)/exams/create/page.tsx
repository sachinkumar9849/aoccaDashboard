"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';

interface ClassManagement {
    id: string;
    session: string;
    type: string;
}

interface Subject {
    id: string;
    code: string;
    name: string;
}

const inquiryTypes = [
    { value: "CA-Foundation", label: "CA Foundation" },
    { value: "CA-Intermediate", label: "CA Intermediate" },
    { value: "CA-Final", label: "CA Final" },
    { value: "CA-mandatory", label: "Mandatory Training" },
];

export default function CreateExam() {
    const router = useRouter();
    const queryClient = useQueryClient();

    // Selectors for cascading dropdowns
    const [selectedType, setSelectedType] = useState(inquiryTypes[0].value);
    const [sessions, setSessions] = useState<ClassManagement[]>([]);

    const [formData, setFormData] = useState({
        class_management_id: '',
        exam_type: 'weekly',
        title: '',
        conducted_at: '',
        notes: '',
        subject_ids: [] as string[]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch subjects globally (or paginated, backend should ideally allow all for forms, we'll try to fetch a chunk)
    // The prompt says GET /subjects?page=1&limit=10, assuming we might need more or it's just an example
    const { data: subjectsData } = useQuery({
        queryKey: ['subjects', 'all'],
        queryFn: () => apiClient.request<{ data: Subject[] }>('/subjects?page=1&limit=100')
    });
    const allSubjects = subjectsData?.data || [];

    useEffect(() => {
        if (!selectedType) {
            setSessions([]);
            setFormData(prev => ({ ...prev, class_management_id: '' }));
            return;
        }
        const fetchSessions = async () => {
            try {
                const res = await apiClient.request<{ data: ClassManagement[] }>(
                    `/classes?status=true&type=${selectedType}`
                );
                setSessions(res.data || []);
                if (res.data && res.data.length > 0) {
                    setFormData(prev => ({ ...prev, class_management_id: res.data[0].id }));
                } else {
                    setFormData(prev => ({ ...prev, class_management_id: '' }));
                }
            } catch (error) {
                console.error("Failed to load sessions", error);
                setSessions([]);
                setFormData(prev => ({ ...prev, class_management_id: '' }));
            }
        };
        fetchSessions();
    }, [selectedType]);

    const mutation = useMutation({
        mutationFn: (newExam: typeof formData) =>
            apiClient.request('/exams', {
                method: 'POST',
                body: JSON.stringify(newExam),
            }),
        onSuccess: () => {
            toast.success('Exam created successfully!');
            queryClient.invalidateQueries({ queryKey: ['exams'] });
            router.push('/exams');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to create exam');
        },
    });

    const validate = () => {
        let isValid = true;
        const newErrors: Record<string, string> = {};

        if (!formData.class_management_id) {
            newErrors.class_management_id = 'Session is required';
            isValid = false;
        }
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
                ? prev.subject_ids.filter(id => id !== subjectId)
                : [...prev.subject_ids, subjectId];

            if (errors.subject_ids && subject_ids.length > 0) {
                setErrors((e) => ({ ...e, subject_ids: '' }));
            }
            return { ...prev, subject_ids };
        });
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Create Exam</h2>
                <Link href="/exams">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Class Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Class Type <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300 bg-white"
                        >
                            {inquiryTypes.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Session */}
                    <div>
                        <label htmlFor="class_management_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Session <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="class_management_id"
                            name="class_management_id"
                            value={formData.class_management_id}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white ${errors.class_management_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                            disabled={!selectedType || sessions.length === 0}
                        >
                            {sessions.length === 0 && <option value="">No sessions available</option>}
                            {sessions.map((s) => (
                                <option key={s.id} value={s.id}>{s.session}</option>
                            ))}
                        </select>
                        {errors.class_management_id && <p className="mt-1 text-sm text-red-500">{errors.class_management_id}</p>}
                    </div>

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
                        <label htmlFor="conducted_at" className="block text-sm font-medium text-gray-700 mb-1">
                            Conducted Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            id="conducted_at"
                            name="conducted_at"
                            value={formData.conducted_at}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.conducted_at ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
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
                    <div className="md:col-span-2 pt-4 flex justify-end">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="min-w-[150px]"
                        >
                            {mutation.isPending ? 'Creating...' : 'Create Exam'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
