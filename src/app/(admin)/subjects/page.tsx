"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';
import { Edit } from 'lucide-react';

interface Subject {
    id: string;
    code: string;
    name: string;
    status: boolean;
    created_at: string;
    updated_at: string;
}

interface SubjectResponse {
    data: Subject[];
    meta: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

const SubjectList: React.FC = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, error } = useQuery<SubjectResponse>({
        queryKey: ['subjects', page, limit],
        queryFn: () => apiClient.request<SubjectResponse>(`/subjects?page=${page}&limit=${limit}`)
    });

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusBadge = (status: boolean): string => {
        return status
            ? 'text-green-600 bg-green-100'
            : 'text-orange-600 bg-orange-100';
    };

    if (isLoading) {
        return (
            <div className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-center">
                <div className="py-8">Loading subjects...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full p-4 bg-white rounded-lg shadow-sm">
                <div className="text-red-500">
                    Error loading data: {(error as Error).message}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-normal">Subjects</h2>
                <Link href="/subjects/create">
                    <Button>Create Subject</Button>
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Code</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Name</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Created At</th>
                            <th className="py-3 px-6 text-right text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data && data.data.length > 0 ? (
                            data.data.map((item) => (
                                <tr key={item.id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">
                                        <div className="font-medium text-gray-800">{item.code}</div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <div className="font-medium text-gray-800">{item.name}</div>
                                    </td>
                                    <td className="py-3 px-6">
                                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusBadge(item.status)}`}>
                                            {item.status ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6 text-gray-700">
                                        {formatDate(item.created_at)}
                                    </td>
                                    <td className="py-3 px-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link href={`/subjects/${item.id}`} className="p-1 text-blue-500 hover:text-blue-700" title="Edit">
                                                <Edit size={18} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="py-8 text-center text-gray-500">
                                    No subjects found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {data?.meta && data.meta.total_pages > 1 && (
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {data.meta.total_pages}
                    </span>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, data.meta.total_pages))}
                        disabled={page === data.meta.total_pages}
                        className="px-4 py-2 border rounded-md disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default SubjectList;
