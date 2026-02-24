"use client";
import React, { useState, useEffect, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Button from "@/components/ui/button/Button";
import { Calendar, ChevronDown, ChevronUp, Clock, Edit2, Trash2 } from "lucide-react";
import DatePicker from "@/components/crm/DatePickerDemo";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { Modal } from "@/components/ui/modal";

interface ClassItem {
    id: string;
    session: string;
    total_student: number;
    type: string;
    status: boolean;
}

interface ClassListResponse {
    data: ClassItem[];
    meta: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

interface RoutineDateItem {
    routine_date: string;
    slot_count: number;
}

interface RoutineDatesResponse {
    class_management_id: string;
    data: RoutineDateItem[];
}

interface RoutineSlot {
    id: string;
    period_index: number;
    subject_id: string;
    subject_name: string;
    teacher_id: number;
    teacher_name: string;
}

interface RoutineDetailResponse {
    data: RoutineSlot[];
    total: number;
}

interface Subject {
    id: string;
    code: string;
    name: string;
}

interface Teacher {
    id: number;
    name: string;
    title: string;
}

interface SubjectsResponse {
    data: Subject[];
}

const CLASS_TYPES = ["CA-Foundation", "CA-Intermediate", "CA-Final", "CA-Mandatory"];

const RoutineListPageContent: React.FC = () => {
    const searchParams = useSearchParams();
    const qClassId = searchParams.get("class_management_id") || "";
    const qRoutineDate = searchParams.get("routine_date") || null;
    const queryClient = useQueryClient();

    const [selectedClassId, setSelectedClassId] = useState<string>(qClassId);
    const [fromDate, setFromDate] = useState<string>("2025-01-01");
    const [toDate, setToDate] = useState<string>("2027-12-31");
    const [expandedDate, setExpandedDate] = useState<string | null>(qRoutineDate);

    // Edit Slot State
    const [editingSlot, setEditingSlot] = useState<RoutineSlot | null>(null);
    const [editSubjectId, setEditSubjectId] = useState<string>("");
    const [editTeacherId, setEditTeacherId] = useState<number | "">("");

    // Delete Slot State
    const [deletingSlotId, setDeletingSlotId] = useState<string | null>(null);

    // Sync from URL params when they change (e.g. after redirect from create page)
    useEffect(() => {
        if (qClassId) {
            setSelectedClassId(qClassId);
        }
        if (qRoutineDate) {
            setExpandedDate(qRoutineDate);
        }
    }, [qClassId, qRoutineDate]);

    // Fetch all classes across all types
    const { data: allClasses, isLoading: classesLoading } = useQuery<ClassItem[]>({
        queryKey: ["all-classes-for-routine"],
        queryFn: async () => {
            const results = await Promise.all(
                CLASS_TYPES.map((type) =>
                    apiClient.request<ClassListResponse>(`/classes?type=${type}`)
                )
            );
            return results.flatMap((r) => r.data);
        },
    });

    // Fetch routine dates for selected class
    const { data: routineDates, isLoading: datesLoading } = useQuery<RoutineDatesResponse>({
        queryKey: ["routine-dates", selectedClassId, fromDate, toDate],
        queryFn: () =>
            apiClient.request<RoutineDatesResponse>(
                `/classes/${selectedClassId}/routine-dates?from=${fromDate}&to=${toDate}`
            ),
        enabled: !!selectedClassId,
    });

    // Fetch routine detail for expanded date
    const { data: routineDetail, isLoading: detailLoading } = useQuery<RoutineDetailResponse>({
        queryKey: ["routine-detail", selectedClassId, expandedDate],
        queryFn: () =>
            apiClient.request<RoutineDetailResponse>(
                `/routine?class_management_id=${selectedClassId}&routine_date=${expandedDate}`
            ),
        enabled: !!selectedClassId && !!expandedDate,
    });

    const selectedClass = allClasses?.find((c) => c.id === selectedClassId);

    // Fetch subjects (for mapping names and Edit Modal)
    const { data: subjectsData, isLoading: subjectsLoading } = useQuery<SubjectsResponse>({
        queryKey: ["subjects-for-routine-edit"],
        queryFn: () => apiClient.request<SubjectsResponse>("/subjects?page=1&limit=100"),
    });

    // Fetch teachers (for mapping names and Edit Modal)
    const { data: teachers, isLoading: teachersLoading } = useQuery<Teacher[]>({
        queryKey: ["teachers-for-routine-edit"],
        queryFn: () =>
            apiClient.request<Teacher[]>("/toper-testimonial-team?type=teamTwo&status=published"),
    });

    // Mutations
    const deleteSlotMutation = useMutation({
        mutationFn: async (slotId: string) => {
            return apiClient.request(`/routine/slots/${slotId}`, {
                method: "DELETE",
            });
        },
        onSuccess: () => {
            toast.success("Routine slot deleted successfully");
            setDeletingSlotId(null);
            queryClient.invalidateQueries({ queryKey: ["routine-detail", selectedClassId, expandedDate] });
            queryClient.invalidateQueries({ queryKey: ["routine-dates", selectedClassId] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to delete slot");
            setDeletingSlotId(null);
        },
    });

    const editSlotMutation = useMutation({
        mutationFn: async (payload: { slotId: string; subject_id: string; teacher_id: number }) => {
            return apiClient.request(`/routine/slots/${payload.slotId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject_id: payload.subject_id,
                    teacher_id: payload.teacher_id,
                }),
            });
        },
        onSuccess: () => {
            toast.success("Routine slot updated successfully");
            setEditingSlot(null);
            queryClient.invalidateQueries({ queryKey: ["routine-detail", selectedClassId, expandedDate] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to update slot");
        },
    });

    const handleEditClick = (slot: RoutineSlot) => {
        setEditingSlot(slot);
        setEditSubjectId(slot.subject_id);
        setEditTeacherId(slot.teacher_id);
    };

    const handleSaveEdit = () => {
        if (!editingSlot || !editSubjectId || !editTeacherId) {
            toast.error("Please select both a subject and a teacher.");
            return;
        }
        editSlotMutation.mutate({
            slotId: editingSlot.id,
            subject_id: editSubjectId,
            teacher_id: Number(editTeacherId),
        });
    };

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const toggleDate = (dateStr: string) => {
        const normalizedDate = dateStr.includes("T") ? dateStr.split("T")[0] : dateStr;
        setExpandedDate((prev) => (prev === normalizedDate ? null : normalizedDate));
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Routine Management</h1>
                <Link href="/routine/create">
                    <Button>Create Routine</Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-sm font-medium text-gray-600 mb-4">Filter Routines</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Class selector */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Class
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                            value={selectedClassId}
                            onChange={(e) => {
                                setSelectedClassId(e.target.value);
                                setExpandedDate(null);
                            }}
                        >
                            <option value="">-- Select a class --</option>
                            {classesLoading && <option disabled>Loading classes...</option>}
                            {allClasses?.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.type} — {cls.session} ({cls.total_student} students)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* From Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            From Date
                        </label>
                        <DatePicker
                            value={fromDate || null}
                            onChange={(date) => {
                                if (date) {
                                    const year = date.getFullYear();
                                    const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                    const day = date.getDate().toString().padStart(2, "0");
                                    setFromDate(`${year}-${month}-${day}`);
                                } else {
                                    setFromDate("");
                                }
                            }}
                            placeholder="Select from date"
                            format="YYYY-MM-DD"
                        />
                    </div>

                    {/* To Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            To Date
                        </label>
                        <DatePicker
                            value={toDate || null}
                            onChange={(date) => {
                                if (date) {
                                    const year = date.getFullYear();
                                    const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                    const day = date.getDate().toString().padStart(2, "0");
                                    setToDate(`${year}-${month}-${day}`);
                                } else {
                                    setToDate("");
                                }
                            }}
                            placeholder="Select to date"
                            format="YYYY-MM-DD"
                        />
                    </div>
                </div>
            </div>

            {/* Selected class info */}
            {selectedClass && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
                    <Calendar className="text-blue-600" size={20} />
                    <div>
                        <p className="text-sm font-medium text-blue-800">
                            {selectedClass.type} — Session: {selectedClass.session}
                        </p>
                        <p className="text-xs text-blue-600">
                            {selectedClass.total_student} students •{" "}
                            {selectedClass.status ? "Active" : "Inactive"}
                        </p>
                    </div>
                </div>
            )}

            {/* Routine dates list */}
            <div className="bg-white rounded-lg shadow-sm">
                {!selectedClassId ? (
                    <div className="p-12 text-center text-gray-400">
                        <Calendar className="mx-auto mb-3" size={40} />
                        <p>Select a class to view its routine dates</p>
                    </div>
                ) : datesLoading ? (
                    <div className="p-12 text-center text-gray-400">Loading routine dates...</div>
                ) : !routineDates?.data || routineDates.data.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <Calendar className="mx-auto mb-3" size={40} />
                        <p>No routines found for this class in the selected date range</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        <div className="px-6 py-3 bg-gray-50 rounded-t-lg">
                            <h3 className="text-sm font-medium text-gray-600">
                                Routine Dates ({routineDates.data.length})
                            </h3>
                        </div>
                        {routineDates.data.map((item) => {
                            const normalizedDate = item.routine_date.includes("T")
                                ? item.routine_date.split("T")[0]
                                : item.routine_date;
                            const isExpanded = expandedDate === normalizedDate;

                            return (
                                <div key={item.routine_date}>
                                    <button
                                        onClick={() => toggleDate(item.routine_date)}
                                        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Calendar className="text-brand-500" size={18} />
                                            <span className="font-medium text-gray-800">
                                                {formatDate(item.routine_date)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs bg-brand-100 text-brand-700 px-2.5 py-1 rounded-full font-medium">
                                                {item.slot_count} period{item.slot_count !== 1 ? "s" : ""}
                                            </span>
                                            {isExpanded ? (
                                                <ChevronUp size={18} className="text-gray-400" />
                                            ) : (
                                                <ChevronDown size={18} className="text-gray-400" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Expanded slot detail */}
                                    {isExpanded && (
                                        <div className="px-6 pb-4">
                                            {detailLoading ? (
                                                <div className="text-center py-4 text-gray-400 text-sm">
                                                    Loading slots...
                                                </div>
                                            ) : !routineDetail?.data || routineDetail.data.length === 0 ? (
                                                <div className="text-center py-4 text-gray-400 text-sm">
                                                    No slot data available
                                                </div>
                                            ) : (
                                                <div className="bg-gray-50 rounded-lg overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead>
                                                            <tr className="border-b bg-gray-100">
                                                                <th className="py-2 px-4 text-left font-medium text-gray-600">
                                                                    Period
                                                                </th>
                                                                <th className="py-2 px-4 text-left font-medium text-gray-600">
                                                                    Subject
                                                                </th>
                                                                <th className="py-2 px-4 text-left font-medium text-gray-600">
                                                                    Teacher
                                                                </th>
                                                                <th className="py-2 px-4 text-right font-medium text-gray-600">
                                                                    Actions
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {routineDetail.data.map((slot, idx) => (
                                                                <tr
                                                                    key={slot.id || idx}
                                                                    className="border-b last:border-b-0"
                                                                >
                                                                    <td className="py-2.5 px-4">
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock
                                                                                size={14}
                                                                                className="text-gray-400"
                                                                            />
                                                                            <span className="font-medium">
                                                                                Period {slot.period_index}
                                                                            </span>
                                                                        </div>
                                                                    </td>
                                                                    <td className="py-2.5 px-4 text-gray-700">
                                                                        {slot.subject_name ||
                                                                            subjectsData?.data?.find((s: Subject) => s.id === slot.subject_id)?.name ||
                                                                            slot.subject_id}
                                                                    </td>
                                                                    <td className="py-2.5 px-4 text-gray-700">
                                                                        {slot.teacher_name || `Teacher #${slot.teacher_id}`}
                                                                    </td>
                                                                    <td className="py-2.5 px-4 text-right">
                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <button
                                                                                onClick={() => handleEditClick(slot)}
                                                                                className="p-1.5 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                                                                                title="Edit slot"
                                                                            >
                                                                                <Edit2 size={16} />
                                                                            </button>
                                                                            <button
                                                                                onClick={() => setDeletingSlotId(slot.id)}
                                                                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                                                                                title="Delete slot"
                                                                            >
                                                                                <Trash2 size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={!!deletingSlotId}
                onClose={() => setDeletingSlotId(null)}
                onConfirm={() => deletingSlotId && deleteSlotMutation.mutate(deletingSlotId)}
                title="Delete Routine Slot"
                description="Are you sure you want to delete this period schedule? This action cannot be undone."
            />

            {/* Edit Slot Modal */}
            <Modal isOpen={!!editingSlot} onClose={() => setEditingSlot(null)} className="w-full max-w-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Routine Slot</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Period
                        </label>
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-100"
                            value={`Period ${editingSlot?.period_index || ""}`}
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={editSubjectId}
                            onChange={(e) => setEditSubjectId(e.target.value)}
                        >
                            <option value="">Select a subject</option>
                            {subjectsLoading && <option disabled>Loading...</option>}
                            {subjectsData?.data?.map((sub: Subject) => (
                                <option key={sub.id} value={sub.id}>
                                    {sub.name} ({sub.code})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teacher
                        </label>
                        <select
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            value={editTeacherId}
                            onChange={(e) => setEditTeacherId(Number(e.target.value))}
                        >
                            <option value="">Select a teacher</option>
                            {teachersLoading && <option disabled>Loading...</option>}
                            {teachers?.map((t: Teacher) => (
                                <option key={t.id} value={t.id}>
                                    {t.name} — {t.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 pt-4 mt-2 border-t">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setEditingSlot(null)}
                            disabled={editSlotMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleSaveEdit}
                            disabled={editSlotMutation.isPending}
                        >
                            {editSlotMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const RoutineListPage: React.FC = () => {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading routine data...</div>}>
            <RoutineListPageContent />
        </Suspense>
    );
};

export default RoutineListPage;
