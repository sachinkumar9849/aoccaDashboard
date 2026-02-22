"use client";

import React, { useState, useEffect, useCallback } from "react";
import axiosInstance from "@/lib/axios";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassManagement {
    id: string;
    session: string;
    total_student: number;
    status: boolean;
    type: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
}

interface Student {
    id: string;
    lead_id: string;
    full_name: string;
    phone: string;
    email: string;
    conversion_year: number;
    conversion_date: string;
    class_type: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ClassStudent {
    id: string;
    student_id: string;
    class_management_id: string;
    enrolled_at: string;
    status: "active" | "promoted";
    promoted_at?: string;
    promoted_to_class_management_id?: string;
    student: Student;
    class_management: ClassManagement;
    promoted_to_class?: ClassManagement;
    created_at: string;
    updated_at: string;
}

interface Meta {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
}

interface StudentsResponse {
    data: ClassStudent[];
    meta: Meta;
}

interface ClassesResponse {
    data: ClassManagement[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const inquiryTypes = [
    { value: "CA-Foundation", label: "CA Foundation" },
    { value: "CA-Intermediate", label: "CA Intermediate" },
    { value: "CA-Final", label: "CA Final" },
    { value: "CA-mandatory", label: "Mandatory Training" },
];

const BASE_URL = "https://api.aoc.edu.np/api/v1";

// ─── Utility Components ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const isActive = status === "active";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
        >
            <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-green-500" : "bg-yellow-500"
                    }`}
            />
            {isActive ? "Active" : "Promoted"}
        </span>
    );
}

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
                <td key={i} className="px-6 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentClassPage() {
    // Filter state
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedClassId, setSelectedClassId] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Data state
    const [sessions, setSessions] = useState<ClassManagement[]>([]);
    const [students, setStudents] = useState<ClassStudent[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);

    // UI state
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState<string>("");
    const [studentsError, setStudentsError] = useState<string>("");
    const [hasFiltered, setHasFiltered] = useState(false);

    // Fetch sessions whenever inquiry type changes
    useEffect(() => {
        if (!selectedType) {
            setSessions([]);
            setSelectedClassId("");
            return;
        }

        const fetchSessions = async () => {
            setSessionsLoading(true);
            setSessionsError("");
            setSessions([]);
            setSelectedClassId("");
            try {
                const res = await axiosInstance.get<ClassesResponse>(
                    `${BASE_URL}/classes?status=true&type=${selectedType}`
                );
                setSessions(res.data.data ?? []);
            } catch {
                setSessionsError("Failed to load sessions. Please try again.");
            } finally {
                setSessionsLoading(false);
            }
        };

        fetchSessions();
    }, [selectedType]);

    // Fetch students
    const fetchStudents = useCallback(async () => {
        if (!selectedClassId) return;

        setStudentsLoading(true);
        setStudentsError("");
        setHasFiltered(true);

        try {
            const res = await axiosInstance.get<StudentsResponse>(
                `${BASE_URL}/classes/${selectedClassId}/students?page=1&limit=10`
            );
            setStudents(res.data.data ?? []);
            setMeta(res.data.meta ?? null);
        } catch {
            setStudentsError("Failed to load students. Please try again.");
            setStudents([]);
        } finally {
            setStudentsLoading(false);
        }
    }, [selectedClassId]);

    const handleFilter = () => {
        fetchStudents();
    };

    // Filtered students by search
    const filteredStudents = students.filter((cs) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            cs.student.full_name.toLowerCase().includes(q) ||
            cs.student.email.toLowerCase().includes(q)
        );
    });

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Student Class Management</h1>
                <p className="text-sm text-gray-500 mt-1">
                    Filter students by class type and session
                </p>
            </div>

            {/* ── Filter Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                    Filters
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Inquiry Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">
                            Inquiry Type
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="">Select type</option>
                            {inquiryTypes.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Session */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">Session</label>
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                            disabled={!selectedType || sessionsLoading}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {sessionsLoading
                                    ? "Loading sessions..."
                                    : sessions.length === 0 && selectedType
                                        ? "No sessions available"
                                        : "Select session"}
                            </option>
                            {sessions.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.session}
                                </option>
                            ))}
                        </select>
                        {sessionsError && (
                            <p className="text-xs text-red-500">{sessionsError}</p>
                        )}
                    </div>

                    {/* Search */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">Search</label>
                        <input
                            type="text"
                            placeholder="Name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        />
                    </div>

                    {/* Filter Button */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-transparent select-none">
                            &nbsp;
                        </label>
                        <button
                            onClick={handleFilter}
                            disabled={!selectedClassId || studentsLoading}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {studentsLoading ? (
                                <>
                                    <svg
                                        className="animate-spin h-4 w-4 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8v8H4z"
                                        />
                                    </svg>
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-8.586L3.293 6.707A1 1 0 013 6V3z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Filter
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Student Table Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Table Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Students</h2>
                        {meta && !studentsLoading && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Showing{" "}
                                <span className="font-medium text-gray-600">
                                    {filteredStudents.length}
                                </span>{" "}
                                of{" "}
                                <span className="font-medium text-gray-600">{meta.total}</span>{" "}
                                students
                            </p>
                        )}
                    </div>
                    {students.length > 0 && (
                        <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full border border-blue-100">
                            {sessions.find((s) => s.id === selectedClassId)?.session ?? ""}
                        </span>
                    )}
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    #
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Full Name
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Class Type
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Promoted To
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {studentsLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <SkeletonRow key={i} />
                                ))
                            ) : studentsError ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10 text-red-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M12 9v2m0 4h.01M10.293 5.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 12 10.293 7.707a1 1 0 010-1.414z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-red-500">
                                                {studentsError}
                                            </p>
                                            <button
                                                onClick={fetchStudents}
                                                className="text-xs text-blue-600 hover:underline mt-1"
                                            >
                                                Try again
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : !hasFiltered ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">
                                                Select a type and session, then click Filter
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-10 w-10"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={1.5}
                                                    d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">
                                                No students found
                                            </p>
                                            {searchQuery && (
                                                <p className="text-xs text-gray-400">
                                                    Try clearing the search query
                                                </p>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((cs, idx) => (
                                    <tr
                                        key={cs.id}
                                        className="hover:bg-blue-50/40 transition-colors duration-100"
                                    >
                                        <td className="px-6 py-4 text-gray-400 text-xs">{idx + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">
                                                {cs.student.full_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{cs.student.email}</td>
                                        <td className="px-6 py-4 text-gray-600">{cs.student.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
                                                {cs.student.class_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={cs.status} />
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-xs">
                                            {cs.promoted_to_class ? (
                                                <span className="inline-block bg-purple-50 text-purple-700 font-medium px-2.5 py-0.5 rounded-full border border-purple-100">
                                                    {cs.promoted_to_class.session}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
