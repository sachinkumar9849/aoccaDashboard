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

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner({ className = "h-4 w-4" }: { className?: string }) {
    return (
        <svg
            className={`animate-spin text-white ${className}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
    );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
    const isActive = status === "active";
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${isActive
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                }`}
        >
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isActive ? "bg-green-500" : "bg-yellow-500"}`} />
            {isActive ? "Active" : "Promoted"}
        </span>
    );
}

// ─── Skeleton Row ─────────────────────────────────────────────────────────────

function SkeletonRow() {
    return (
        <tr className="animate-pulse">
            {Array.from({ length: 8 }).map((_, i) => (
                <td key={i} className="px-4 py-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                </td>
            ))}
        </tr>
    );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error";

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
    useEffect(() => {
        const t = setTimeout(onClose, 4000);
        return () => clearTimeout(t);
    }, [onClose]);

    return (
        <div
            className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all duration-300 ${type === "success"
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-red-50 border-red-200 text-red-800"
                }`}
        >
            {type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
            )}
            {message}
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition">✕</button>
        </div>
    );
}

// ─── Promote Modal ────────────────────────────────────────────────────────────

interface PromoteModalProps {
    selectedCount: number;
    selectedStudentIds: string[];
    onClose: () => void;
    onSuccess: () => void;
}

function PromoteModal({ selectedCount, selectedStudentIds, onClose, onSuccess }: PromoteModalProps) {
    const [modalType, setModalType] = useState("");
    const [modalSessions, setModalSessions] = useState<ClassManagement[]>([]);
    const [modalSessionsLoading, setModalSessionsLoading] = useState(false);
    const [modalClassId, setModalClassId] = useState("");
    const [notes, setNotes] = useState("");
    const [promoting, setPromoting] = useState(false);
    const [promoteError, setPromoteError] = useState("");

    // Fetch sessions when modal inquiry type changes
    useEffect(() => {
        if (!modalType) {
            setModalSessions([]);
            setModalClassId("");
            return;
        }
        const fetch = async () => {
            setModalSessionsLoading(true);
            setModalSessions([]);
            setModalClassId("");
            try {
                const res = await axiosInstance.get<ClassesResponse>(
                    `${BASE_URL}/classes?status=true&type=${modalType}`
                );
                setModalSessions(res.data.data ?? []);
            } catch {
                // silently fail — user can retry by reselecting type
            } finally {
                setModalSessionsLoading(false);
            }
        };
        fetch();
    }, [modalType]);

    const handlePromote = async () => {
        if (!modalClassId) return;
        setPromoting(true);
        setPromoteError("");
        try {
            await axiosInstance.post(`${BASE_URL}/students/promote`, {
                student_ids: selectedStudentIds,
                to_class_management_id: modalClassId,
                notes,
            });
            onSuccess();
        } catch (err: unknown) {
            const msg =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
                "Failed to promote students. Please try again.";
            setPromoteError(msg);
        } finally {
            setPromoting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Promote Students</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {selectedCount} student{selectedCount !== 1 ? "s" : ""} selected
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition rounded-lg p-1 hover:bg-gray-100"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>

                {/* Inquiry Type */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Inquiry Type <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={modalType}
                        onChange={(e) => setModalType(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    >
                        <option value="">Select inquiry type</option>
                        {inquiryTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                {/* Session / Class */}
                <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Promote To Class <span className="text-red-400">*</span>
                    </label>
                    <select
                        value={modalClassId}
                        onChange={(e) => setModalClassId(e.target.value)}
                        disabled={!modalType || modalSessionsLoading}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <option value="">
                            {modalSessionsLoading
                                ? "Loading sessions..."
                                : !modalType
                                    ? "Select inquiry type first"
                                    : modalSessions.length === 0
                                        ? "No sessions available"
                                        : "Select session"}
                        </option>
                        {modalSessions.map((s) => (
                            <option key={s.id} value={s.id}>{s.session}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div className="mb-5">
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                        Notes <span className="text-gray-400">(optional)</span>
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Add any notes about this promotion..."
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    />
                </div>

                {/* Error */}
                {promoteError && (
                    <div className="mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                        {promoteError}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        disabled={promoting}
                        className="flex-1 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm px-4 py-2.5 hover:bg-gray-50 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handlePromote}
                        disabled={!modalClassId || promoting}
                        className="flex-1 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {promoting ? (
                            <>
                                <Spinner />
                                Promoting...
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                                Promote
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StudentClassPage() {
    // Filter state
    const [selectedType, setSelectedType] = useState("");
    const [selectedClassId, setSelectedClassId] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Data state
    const [sessions, setSessions] = useState<ClassManagement[]>([]);
    const [students, setStudents] = useState<ClassStudent[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);

    // UI state
    const [sessionsLoading, setSessionsLoading] = useState(false);
    const [studentsLoading, setStudentsLoading] = useState(false);
    const [sessionsError, setSessionsError] = useState("");
    const [studentsError, setStudentsError] = useState("");
    const [hasFiltered, setHasFiltered] = useState(false);

    // Multi-select state
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);

    // Toast state
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    // ── Fetch sessions (filter section) ──────────────────────────────────────────
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

    // ── Fetch students ────────────────────────────────────────────────────────────
    const fetchStudents = useCallback(async () => {
        if (!selectedClassId) return;
        setStudentsLoading(true);
        setStudentsError("");
        setHasFiltered(true);
        setSelectedStudentIds([]); // clear selection on refetch
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

    // ── Selection helpers ─────────────────────────────────────────────────────────
    const filteredStudents = students.filter((cs) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            cs.student.full_name.toLowerCase().includes(q) ||
            cs.student.email.toLowerCase().includes(q)
        );
    });

    const selectableIds = filteredStudents.map((cs) => cs.student_id);
    const allSelected =
        selectableIds.length > 0 &&
        selectableIds.every((id) => selectedStudentIds.includes(id));
    const someSelected =
        !allSelected && selectableIds.some((id) => selectedStudentIds.includes(id));

    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedStudentIds((prev) => prev.filter((id) => !selectableIds.includes(id)));
        } else {
            setSelectedStudentIds((prev) => [...new Set([...prev, ...selectableIds])]);
        }
    };

    const toggleRow = (studentId: string) => {
        setSelectedStudentIds((prev) =>
            prev.includes(studentId)
                ? prev.filter((id) => id !== studentId)
                : [...prev, studentId]
        );
    };

    // ── Promotion success handler ─────────────────────────────────────────────────
    const handlePromoteSuccess = () => {
        setModalOpen(false);
        setSelectedStudentIds([]);
        setToast({ message: "Students promoted successfully!", type: "success" });
        fetchStudents();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Promote Modal */}
            {modalOpen && (
                <PromoteModal
                    selectedCount={selectedStudentIds.length}
                    selectedStudentIds={selectedStudentIds}
                    onClose={() => setModalOpen(false)}
                    onSuccess={handlePromoteSuccess}
                />
            )}

            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Student Class Management</h1>
                <p className="text-sm text-gray-500 mt-1">Filter and manage students by class type and session</p>
            </div>

            {/* ── Filter Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">Filters</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Inquiry Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-gray-600">Inquiry Type</label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        >
                            <option value="">Select type</option>
                            {inquiryTypes.map((t) => (
                                <option key={t.value} value={t.value}>{t.label}</option>
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
                                <option key={s.id} value={s.id}>{s.session}</option>
                            ))}
                        </select>
                        {sessionsError && <p className="text-xs text-red-500">{sessionsError}</p>}
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
                        <label className="text-xs font-medium text-transparent select-none">&nbsp;</label>
                        <button
                            onClick={fetchStudents}
                            disabled={!selectedClassId || studentsLoading}
                            className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm px-4 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {studentsLoading ? (
                                <>
                                    <Spinner />
                                    Fetching...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L13 10.414V17a1 1 0 01-.553.894l-4 2A1 1 0 017 19v-8.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
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
                {/* Table Toolbar */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-base font-semibold text-gray-900">Students</h2>
                        {meta && !studentsLoading && (
                            <p className="text-xs text-gray-400 mt-0.5">
                                Showing <span className="font-medium text-gray-600">{filteredStudents.length}</span>{" "}
                                of <span className="font-medium text-gray-600">{meta.total}</span> students
                                {selectedStudentIds.length > 0 && (
                                    <span className="ml-2 text-blue-600 font-semibold">
                                        · {selectedStudentIds.length} selected
                                    </span>
                                )}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {students.length > 0 && (
                            <span className="text-xs bg-blue-50 text-blue-600 font-medium px-3 py-1 rounded-full border border-blue-100">
                                {sessions.find((s) => s.id === selectedClassId)?.session ?? ""}
                            </span>
                        )}

                        {/* Promote Button */}
                        <button
                            onClick={() => setModalOpen(true)}
                            disabled={selectedStudentIds.length === 0}
                            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white font-semibold text-sm px-4 py-2 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                            Promote Students
                            {selectedStudentIds.length > 0 && (
                                <span className="bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-md">
                                    {selectedStudentIds.length}
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 sticky top-0 z-10">
                                {/* Select All Checkbox */}
                                <th className="pl-5 pr-2 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        checked={allSelected}
                                        ref={(el) => { if (el) el.indeterminate = someSelected; }}
                                        onChange={toggleSelectAll}
                                        disabled={filteredStudents.length === 0}
                                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-40"
                                    />
                                </th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Class Type</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Promoted To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {studentsLoading ? (
                                Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                            ) : studentsError ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-sm font-medium text-red-500">{studentsError}</p>
                                            <button onClick={fetchStudents} className="text-xs text-blue-600 hover:underline mt-1">
                                                Try again
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ) : !hasFiltered ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">Select a type and session, then click Filter</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2h5M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                            </svg>
                                            <p className="text-sm font-medium text-gray-500">No students found</p>
                                            {searchQuery && <p className="text-xs text-gray-400">Try clearing the search query</p>}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((cs, idx) => {
                                    const isChecked = selectedStudentIds.includes(cs.student_id);
                                    return (
                                        <tr
                                            key={cs.id}
                                            onClick={() => toggleRow(cs.student_id)}
                                            className={`cursor-pointer transition-colors duration-100 ${isChecked ? "bg-blue-50/60" : "hover:bg-gray-50/80"
                                                }`}
                                        >
                                            {/* Checkbox */}
                                            <td className="pl-5 pr-2 py-4" onClick={(e) => e.stopPropagation()}>
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleRow(cs.student_id)}
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                                />
                                            </td>
                                            <td className="px-4 py-4 text-gray-400 text-xs">{idx + 1}</td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{cs.student.full_name}</div>
                                            </td>
                                            <td className="px-4 py-4 text-gray-600">{cs.student.email}</td>
                                            <td className="px-4 py-4 text-gray-600">{cs.student.phone}</td>
                                            <td className="px-4 py-4">
                                                <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-0.5 rounded-full border border-blue-100">
                                                    {cs.student.class_type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <StatusBadge status={cs.status} />
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 text-xs">
                                                {cs.promoted_to_class ? (
                                                    <span className="inline-block bg-purple-50 text-purple-700 font-medium px-2.5 py-0.5 rounded-full border border-purple-100">
                                                        {cs.promoted_to_class.session}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-300">—</span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
