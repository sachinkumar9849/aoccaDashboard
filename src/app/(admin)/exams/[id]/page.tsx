"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';

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
        total_student: number;
        status: boolean;
        type: string;
    };
    exam_subjects: {
        id: string;
        exam_id: string;
        subject_id: string;
        full_marks: number;
        sort_order: number;
        subject: {
            id: string;
            code: string;
            name: string;
            status: boolean;
        };
    }[];
    created_at: string;
    updated_at: string;
}

export default function ExamDetailView() {
    const params = useParams();
    const id = params.id as string;

    const { data: exam, isLoading, isError } = useQuery<ExamDetail>({
        queryKey: ['exam', id],
        queryFn: () => apiClient.request<ExamDetail>(`/exams/${id}`),
    });

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-sm flex justify-center">
                <div className="py-8">Loading Exam Details...</div>
            </div>
        );
    }

    if (isError || !exam) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-sm">
                <div className="text-red-500 mb-4">Error loading exam details.</div>
                <Link href="/exams">
                    <Button variant="outline">Back to Exams</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm space-y-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Exam Details</h2>
                <div className="flex gap-3">
                    <Link href={`/exams/${id}/results`}>
                        <div className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white transition-colors" style={{ backgroundColor: "#165dfc" }}>
                            Manage Results
                        </div>
                    </Link>
                    <Link href="/exams">
                        <Button variant="outline">Back to List</Button>
                    </Link>
                </div>
            </div>

            {/* Top Details Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">{exam.title}</h3>
                    <div className="space-y-3">
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Exam Type:</span>
                            <span className="text-sm font-medium capitalize">{exam.exam_type.replace('_', ' ')}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Conducted At:</span>
                            <span className="text-sm font-medium text-gray-800">{formatDate(exam.conducted_at)}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Notes:</span>
                            <span className="text-sm font-medium text-gray-800 whitespace-pre-wrap">{exam.notes || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Class Session Details</h3>
                    <div className="space-y-3">
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Class Type:</span>
                            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                                {exam.class_management?.type || 'N/A'}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Session:</span>
                            <span className="text-sm font-medium text-gray-800">{exam.class_management?.session || 'N/A'}</span>
                        </div>
                        <div className="flex">
                            <span className="w-32 text-sm text-gray-500">Total Students:</span>
                            <span className="text-sm font-medium text-gray-800">{exam.class_management?.total_student || 0}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Table */}
            <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Exam Subjects</h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Subject Code</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Subject Name</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Full Marks</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Sort Order</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {exam.exam_subjects && exam.exam_subjects.length > 0 ? (
                                exam.exam_subjects.map((es) => (
                                    <tr key={es.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {es.subject?.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {es.subject?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {es.full_marks || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {es.sort_order}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${es.subject?.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {es.subject?.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 text-sm">
                                        No subjects assigned for this exam.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
