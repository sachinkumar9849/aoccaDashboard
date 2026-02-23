"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';

export default function EditSubject() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ code: '', name: '', status: true });
    const [errors, setErrors] = useState({ code: '', name: '' });

    const { data: subject, isLoading, isError } = useQuery({
        queryKey: ['subject', id],
        queryFn: () => apiClient.request<any>(`/subjects/${id}`),
    });

    useEffect(() => {
        if (subject) {
            setFormData({
                code: subject.code || '',
                name: subject.name || '',
                status: subject.status ?? true,
            });
        }
    }, [subject]);

    const mutation = useMutation({
        mutationFn: (updatedSubject: { code: string; name: string; status: boolean }) =>
            apiClient.request(`/subjects/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(updatedSubject),
            }),
        onSuccess: () => {
            toast.success('Subject updated successfully!');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            queryClient.invalidateQueries({ queryKey: ['subject', id] });
            router.push('/subjects');
        },
        onError: (error: any) => {
            toast.error(error?.message || 'Failed to update subject');
        },
    });

    const validate = () => {
        let isValid = true;
        const newErrors = { code: '', name: '' };

        if (!formData.code.trim()) {
            newErrors.code = 'Code is required';
            isValid = false;
        }
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            // Include status boolean along with code and name
            mutation.mutate(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // Parse status value string ("true" / "false") correctly to boolean
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'status' ? value === 'true' : value
        }));

        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    if (isLoading) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-sm flex justify-center">
                <div className="py-8">Loading...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-sm">
                <div className="text-red-500">Error loading subject details.</div>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Edit Subject</h2>
                <Link href="/subjects">
                    <Button variant="outline">Back to List</Button>
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g. LAW"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.code ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors.code && <p className="mt-1 text-sm text-red-500">{errors.code}</p>}
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Law"
                            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                }`}
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status.toString()}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300 bg-white"
                        >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>

                    <div className="pt-4 flex items-end">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="min-w-[120px]"
                        >
                            {mutation.isPending ? 'Updating...' : 'Update Subject'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
