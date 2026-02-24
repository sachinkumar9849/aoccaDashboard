"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import toast from 'react-hot-toast';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';

// Models
interface Subject {
    id: string;
    code: string;
    name: string;
}

interface ExamSubject {
    id: string;
    exam_id: string;
    subject_id: string;
    full_marks: number;
    subject: Subject;
}

interface ExamDetail {
    id: string;
    title: string;
    exam_type: string;
    exam_subjects: ExamSubject[];
}

interface Mark {
    subject_id: string;
    marks_obtained: number;
}

interface ExamResult {
    id: string;
    student_id: string;
    total_marks: number;
    percentage: number;
    rank: number;
    rank_label: string;
    student: {
        id: string;
        full_name: string;
        email: string;
    };
    marks: Mark[];
}

interface EditableMark {
    subject_id: string;
    marks_obtained: number | '';
}

interface EditingResult {
    student_id: string;
    marks: EditableMark[];
}

export default function ExamResultsPage() {
    const params = useParams();
    const id = params.id as string;
    const queryClient = useQueryClient();

    const [editingState, setEditingState] = useState<Record<string, EditingResult>>({});
    const [isSaving, setIsSaving] = useState(false);

    // Fetch Exam Detail to get columns (Subjects)
    const { data: exam, isLoading: isLoadingExam } = useQuery<ExamDetail>({
        queryKey: ['exam', id],
        queryFn: () => apiClient.request<ExamDetail>(`/exams/${id}`),
    });

    // Fetch Results
    const { data: resultsResponse, isLoading: isLoadingResults } = useQuery<{ data: ExamResult[] }>({
        queryKey: ['examResults', id],
        queryFn: () => apiClient.request<{ data: ExamResult[] }>(`/exams/${id}/results`),
    });

    const results = resultsResponse?.data || [];
    const subjects = exam?.exam_subjects || [];

    // Initialize editing state when results load
    useEffect(() => {
        if (results.length > 0 && subjects.length > 0) {
            const newState: Record<string, EditingResult> = {};
            results.forEach(res => {
                const editableMarks: EditableMark[] = subjects.map(sub => {
                    const existingMark = res.marks.find(m => m.subject_id === sub.subject_id);
                    return {
                        subject_id: sub.subject_id,
                        marks_obtained: existingMark ? existingMark.marks_obtained : ''
                    };
                });
                newState[res.student_id] = {
                    student_id: res.student_id,
                    marks: editableMarks
                };
            });
            setEditingState(newState);
        }
    }, [results, subjects]);

    const handleMarkChange = (studentId: string, subjectId: string, value: string) => {
        const numericValue = value === '' ? '' : Number(value);
        setEditingState(prev => {
            const studentEntry = prev[studentId];
            if (!studentEntry) return prev;
            return {
                ...prev,
                [studentId]: {
                    ...studentEntry,
                    marks: studentEntry.marks.map(m =>
                        m.subject_id === subjectId ? { ...m, marks_obtained: numericValue } : m
                    )
                }
            };
        });
    };

    const handleBulkSave = async () => {
        // Prepare payload correctly formatting missing marks as optional or zero as needed by API
        // Assuming the API expects valid numbers. Here we send numbers or filter out blanks.
        const payloadResults = Object.values(editingState).map(studentRes => ({
            student_id: studentRes.student_id,
            notes: "",
            marks: studentRes.marks.filter(m => m.marks_obtained !== '').map(m => ({
                subject_id: m.subject_id,
                marks_obtained: Number(m.marks_obtained)
            }))
        })).filter(res => res.marks.length > 0); // Only send students with at least 1 mark entered

        if (payloadResults.length === 0) {
            toast('Please enter some marks first.', { icon: 'ℹ️' });
            return;
        }

        setIsSaving(true);
        try {
            await apiClient.request(`/exams/${id}/results/bulk`, {
                method: 'POST',
                body: JSON.stringify({ results: payloadResults })
            });
            toast.success('Bulk save completed successfully!');
            queryClient.invalidateQueries({ queryKey: ['examResults', id] });
        } catch (error: any) {
            toast.error(error?.message || 'Failed to save results bulk');
        } finally {
            setIsSaving(false);
        }
    };

    const downloadTemplate = async () => {
        try {
            const token = apiClient.getToken();
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiClient.baseUrl}/exams/${id}/results/export-template`, { headers });
            if (!res.ok) throw new Error('Failed to download template');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Exam_Template_${id}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            toast.error("Template download failed.");
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        const toastId = toast.loading('Uploading results...');
        try {
            const token = apiClient.getToken();
            const headers: Record<string, string> = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${apiClient.baseUrl}/exams/${id}/results/import`, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.message || 'Import failed');
            }

            toast.success('Results imported successfully!', { id: toastId });
            queryClient.invalidateQueries({ queryKey: ['examResults', id] });
        } catch (error: any) {
            toast.error(error.message || 'Import failed', { id: toastId });
        } finally {
            e.target.value = ''; // Reset input
        }
    };

    if (isLoadingExam || isLoadingResults) {
        return <div className="p-6">Loading results dashboard...</div>;
    }

    if (!exam) {
        return <div className="p-6 text-red-500">Could not load exam data.</div>;
    }

    return (
        <div className="w-full p-6 bg-white rounded-lg shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-800">Exam Results</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Exam: <span className="font-medium text-gray-700">{exam.title}</span>
                        <span className="ml-2 capitalize badge tracking-wide font-medium bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full border border-blue-100 text-xs">
                            {exam.exam_type.replace('_', ' ')}
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button variant="outline" onClick={downloadTemplate}>
                        Get Excel Template
                    </Button>
                    <label className="cursor-pointer">
                        <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} />
                        <span className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors cursor-pointer">
                            Import Excel
                        </span>
                    </label>
                    <Button
                        onClick={handleBulkSave}
                        disabled={isSaving || results.length === 0}
                        className="bg-violet-600 hover:bg-violet-700 text-white"
                    >
                        {isSaving ? 'Saving...' : 'Save Bulk Results'}
                    </Button>
                    <Link href={`/exams/${id}`}>
                        <Button variant="outline">Back to Details</Button>
                    </Link>
                </div>
            </div>

            {results.length === 0 ? (
                <div className="text-center py-16 border rounded-lg bg-gray-50 border-gray-100">
                    <div className="text-gray-400 mb-2">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <p className="text-gray-600 font-medium">No students or results found for this session.</p>
                    <p className="text-gray-500 text-sm mt-1">Make sure there are active students enrolled in this exam&apos;s session class.</p>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100 border-b">
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider sticky left-0 bg-gray-100 z-10 w-64 min-w-[250px]">
                                    Student
                                </th>
                                {subjects.map(sub => (
                                    <th key={sub.subject_id} className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider min-w-[120px]">
                                        <div className="flex flex-col">
                                            <span>{sub.subject.code}</span>
                                            <span className="text-xs text-gray-400 font-normal">({sub.full_marks || 100} m)</span>
                                        </div>
                                    </th>
                                ))}
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider text-right">Total</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider text-right">%</th>
                                <th className="px-4 py-3 text-sm font-medium text-gray-600 uppercase tracking-wider text-center">Rank</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {results.map((res) => {
                                const editingRow = editingState[res.student_id];
                                return (
                                    <tr key={res.id} className="hover:bg-gray-50 group">
                                        <td className="px-4 py-3 whitespace-nowrap sticky left-0 group-hover:bg-gray-50 bg-white z-0 w-64">
                                            <div className="font-medium text-gray-900">{res.student.full_name}</div>
                                            <div className="text-xs text-gray-500">{res.student.email}</div>
                                        </td>

                                        {subjects.map(sub => {
                                            const markVal = editingRow ? editingRow.marks.find(m => m.subject_id === sub.subject_id)?.marks_obtained : '';
                                            return (
                                                <td key={sub.subject_id} className="px-4 py-3 whitespace-nowrap">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={sub.full_marks || 100}
                                                        value={markVal !== undefined ? markVal : ''}
                                                        onChange={(e) => handleMarkChange(res.student_id, sub.subject_id, e.target.value)}
                                                        className="w-20 px-2 py-1.5 text-sm border border-gray-300 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-shadow"
                                                        placeholder="-"
                                                    />
                                                </td>
                                            );
                                        })}

                                        <td className="px-4 py-3 whitespace-nowrap text-right font-semibold text-gray-800">
                                            {res.total_marks || 0}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right text-gray-700">
                                            {res.percentage ? res.percentage.toFixed(1) + '%' : '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-center">
                                            {res.rank_label ? (
                                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-brand-800 bg-brand-100 rounded-full">
                                                    {res.rank_label}
                                                </span>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
