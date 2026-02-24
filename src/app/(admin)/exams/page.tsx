"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';

import { FileText } from "lucide-react";

interface ClassManagement {
    id: string;
    session: string;
    type: string;
}

interface Exam {
    id: string;
    class_management_id: string;
    exam_type: string;
    title: string;
    conducted_at: string;
    notes: string;
    class_management: ClassManagement;
    created_at: string;
}

interface ExamResponse {
    data: Exam[];
    meta: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

const inquiryTypes = [
    { value: "CA-Foundation", label: "CA Foundation" },
    { value: "CA-Intermediate", label: "CA Intermediate" },
    { value: "CA-Final", label: "CA Final" },
    { value: "CA-mandatory", label: "Mandatory Training" },
];

const ExamList: React.FC = () => {
    const searchParams = useSearchParams();
    const urlType = searchParams.get('type');
    const urlClassId = searchParams.get('classId');

    const [page, setPage] = useState(1);
    const limit = 10;

    // Filters — initialize from URL params if present
    const [selectedType, setSelectedType] = useState(
        urlType && inquiryTypes.some(t => t.value === urlType) ? urlType : inquiryTypes[0].value
    );
    const [selectedClassId, setSelectedClassId] = useState(urlClassId || "");
    const [selectedExamType, setSelectedExamType] = useState("");
    const [sessions, setSessions] = useState<ClassManagement[]>([]);
    const initialClassIdApplied = useRef(false);

    // Sync URL params to state on client-side navigation
    useEffect(() => {
        if (urlType && inquiryTypes.some(t => t.value === urlType)) {
            setSelectedType(urlType);
        }
        if (urlClassId) {
            setSelectedClassId(urlClassId);
            initialClassIdApplied.current = false; // reset so fetch effect uses the new classId
        }
    }, [urlType, urlClassId]);

    useEffect(() => {
        if (!selectedType) {
            setSessions([]);
            setSelectedClassId("");
            return;
        }
        const fetchSessions = async () => {
            try {
                const res = await apiClient.request<{ data: ClassManagement[] }>(
                    `/classes?status=true&type=${selectedType}`
                );
                setSessions(res.data || []);

                // If we have a classId from URL and haven't applied it yet, use it
                if (urlClassId && !initialClassIdApplied.current) {
                    const match = res.data?.find(s => s.id === urlClassId);
                    setSelectedClassId(match ? urlClassId : res.data?.[0]?.id || "");
                    initialClassIdApplied.current = true;
                } else if (res.data && res.data.length > 0) {
                    setSelectedClassId(res.data[0].id);
                } else {
                    setSelectedClassId("");
                }
            } catch (error) {
                console.error("Failed to load sessions", error);
                setSessions([]);
                setSelectedClassId("");
            }
        };
        fetchSessions();
    }, [selectedType]);

    // Build query params
    const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
    });
    if (selectedClassId) queryParams.append('class_management_id', selectedClassId);
    if (selectedExamType) queryParams.append('exam_type', selectedExamType);

    const { data, isLoading, isError, error } = useQuery<ExamResponse>({
        queryKey: ['exams', page, limit, selectedClassId, selectedExamType],
        queryFn: () => apiClient.request<ExamResponse>(`/exams?${queryParams.toString()}`),
        // Only fetch when classId is present, or if you want to support no-classId depending on backend API
        enabled: true
    });

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-normal">Exams</h2>
                <Link href="/exams/create">
                    <Button>Create Exam</Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Class Type</label>
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300"
                    >
                        {inquiryTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
                    <select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300 disabled:opacity-50"
                        disabled={!selectedType || sessions.length === 0}
                    >
                        <option value="">{sessions.length === 0 ? "No sessions found" : "All Sessions"}</option>
                        {sessions.map((s) => (
                            <option key={s.id} value={s.id}>{s.session}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type</label>
                    <select
                        value={selectedExamType}
                        onChange={(e) => setSelectedExamType(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500 border-gray-300"
                    >
                        <option value="">All Types</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="mock_test">Mock Test</option>
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="py-8 text-center text-gray-500">Loading exams...</div>
            )}

            {isError && (
                <div className="py-8 text-center text-red-500">
                    Error loading data: {(error as Error).message}
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Title</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Exam Type</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Session</th>
                                    <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Conducted At</th>
                                    <th className="py-3 px-6 text-right text-sm font-medium text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.data && data.data.length > 0 ? (
                                    data.data.map((item) => (
                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-6">
                                                <div className="font-medium text-gray-800">{item.title}</div>
                                                {item.notes && <div className="text-xs text-gray-500">{item.notes}</div>}
                                            </td>
                                            <td className="py-3 px-6">
                                                <span className="capitalize">{item.exam_type.replace('_', ' ')}</span>
                                            </td>
                                            <td className="py-3 px-6">
                                                <div className="text-gray-800">{item.class_management?.session}</div>
                                                <div className="text-xs text-blue-500">{item.class_management?.type}</div>
                                            </td>
                                            <td className="py-3 px-6 text-gray-700">
                                                {formatDate(item.conducted_at)}
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <div className="flex justify-end pr-2 gap-2">

                                                    <Link
                                                        href={`/exams/${item.id}/edit`}
                                                        className="inline-flex items-center justify-center w-12 h-8 text-orange-600 bg-orange-50 hover:bg-orange-100 hover:text-orange-800 rounded-md transition-colors text-xs font-medium"
                                                        title="Edit Exam"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/exams/${item.id}/results`}
                                                        className="inline-flex items-center justify-center p-2 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-800 rounded-md transition-colors"
                                                        title="Manage Results"
                                                    >
                                                        <FileText size={18} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-gray-500">
                                            No exams found matching your criteria
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
                </>
            )}
        </div>
    );
};

export default ExamList;
