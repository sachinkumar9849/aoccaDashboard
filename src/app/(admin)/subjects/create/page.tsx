"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';

export default function CreateSubject() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [formData, setFormData] = useState({ code: '', name: '' });
    const [errors, setErrors] = useState({ code: '', name: '' });

    const mutation = useMutation({
        mutationFn: (newSubject: { code: string; name: string }) =>
            apiClient.request('/subjects', {
                method: 'POST',
                body: JSON.stringify(newSubject),
            }),
        onSuccess: () => {
            toast.success('Subject created successfully!');
            queryClient.invalidateQueries({ queryKey: ['subjects'] });
            router.push('/subjects');
        },
        onError: (error: Error) => {
            toast.error(error?.message || 'Failed to create subject');
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
            mutation.mutate(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium">Create Subject</h2>
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

                    <div className="pt-4 flex ">
                        <Button
                            type="submit"
                            disabled={mutation.isPending}
                            className="min-w-[120px]"
                        >
                            {mutation.isPending ? 'Creating...' : 'Create Subject'}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
