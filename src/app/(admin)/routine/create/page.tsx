"use client";
import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import ComponentCard from "@/components/common/ComponentCard";
import Label from "@/components/form/Label";
import { SelectField } from "@/components/common/SelectFieldDemo";
import DatePicker from "@/components/crm/DatePickerDemo";

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

interface SubjectItem {
    id: string;
    code: string;
    name: string;
    status: boolean;
}

interface SubjectResponse {
    data: SubjectItem[];
    meta: {
        page: number;
        page_size: number;
        total: number;
        total_pages: number;
    };
}

interface TeacherItem {
    id: number;
    name: string;
    title: string;
}

interface SlotEntry {
    period_index: number;
    subject_id: string;
    teacher_id: number | "";
}

const CLASS_TYPES = ["CA-Foundation", "CA-Intermediate", "CA-Final", "CA-Mandatory"];
const CLASS_TYPE_OPTIONS = [
    { value: "CA-Foundation", label: "CA Foundation" },
    { value: "CA-Intermediate", label: "CA Intermediate" },
    { value: "CA-Final", label: "CA Final" },
    { value: "CA-Mandatory", label: "Mandatory Training" },
];

const CreateRoutinePage: React.FC = () => {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedSession, setSelectedSession] = useState<string>("");
    const [classManagementId, setClassManagementId] = useState<string>("");
    const [routineDate, setRoutineDate] = useState<string>("");
    const [slots, setSlots] = useState<SlotEntry[]>([
        { period_index: 1, subject_id: "", teacher_id: "" },
    ]);

    // Fetch all classes
    const { data: allClasses, isLoading: classesLoading } = useQuery<ClassItem[]>({
        queryKey: ["all-classes-for-routine"],
        queryFn: async () => {
            const results = await Promise.all(
                CLASS_TYPES.map((type) =>
                    apiClient.request<ClassListResponse>(`/classes?type=${type}&status=true`)
                )
            );
            return results.flatMap((r) => r.data);
        },
    });

    // Derived data for filters
    const uniqueSessions = React.useMemo(() => {
        if (!allClasses) return [];
        const filteredByType = selectedType 
            ? allClasses.filter(cls => cls.type === selectedType)
            : allClasses;
        const sessions = Array.from(new Set(filteredByType.map((cls) => cls.session)));
        return sessions.sort().map((s) => ({ value: s, label: s }));
    }, [allClasses, selectedType]);

    const filteredClasses = React.useMemo(() => {
        if (!allClasses) return [];
        return allClasses
            .filter((cls) => !selectedType || cls.type === selectedType)
            .filter((cls) => !selectedSession || cls.session === selectedSession)
            .map((cls) => ({
                value: cls.id,
                label: `${cls.type} — ${cls.session} (${cls.total_student} students)`,
            }));
    }, [allClasses, selectedType, selectedSession]);

    // Reset class when type or session changes, or auto-set if only one exists
    React.useEffect(() => {
        if (filteredClasses.length === 1) {
            setClassManagementId(filteredClasses[0].value);
        } else {
            setClassManagementId("");
        }
    }, [filteredClasses]);

    // Fetch subjects
    const { data: subjectsData, isLoading: subjectsLoading } = useQuery<SubjectResponse>({
        queryKey: ["subjects-for-routine"],
        queryFn: () => apiClient.request<SubjectResponse>("/subjects?page=1&limit=100"),
    });

    // Fetch teachers
    const { data: teachers, isLoading: teachersLoading } = useQuery<TeacherItem[]>({
        queryKey: ["teachers-for-routine"],
        queryFn: () =>
            apiClient.request<TeacherItem[]>(
                "/toper-testimonial-team?type=teamTwo&status=published"
            ),
    });

    // Create routine mutation
    const createRoutineMutation = useMutation({
        mutationFn: async (payload: {
            class_management_id: string;
            routine_date: string;
            slots: { period_index: number; subject_id: string; teacher_id: number }[];
        }) => {
            return apiClient.request("/routine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        },
        onSuccess: () => {
            toast.success("Routine saved successfully!");
            router.push(`/routine?class_management_id=${classManagementId}&routine_date=${routineDate}`);
        },
        onError: (error: Error) => {
            toast.error(error.message || "Failed to save routine");
        },
    });

    const addSlot = () => {
        setSlots((prev) => [
            ...prev,
            { period_index: prev.length + 1, subject_id: "", teacher_id: "" },
        ]);
    };

    const removeSlot = (index: number) => {
        setSlots((prev) => {
            const updated = prev.filter((_, i) => i !== index);
            // Re-index periods
            return updated.map((s, i) => ({ ...s, period_index: i + 1 }));
        });
    };

    const updateSlot = (index: number, field: keyof SlotEntry, value: string | number) => {
        setSlots((prev) =>
            prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!classManagementId) {
            toast.error("No valid class found for selected Type and Session");
            return;
        }
        if (!routineDate) {
            toast.error("Please select a date");
            return;
        }
        if (slots.some((s) => !s.subject_id || !s.teacher_id)) {
            toast.error("Please fill all period slots (subject and teacher)");
            return;
        }

        createRoutineMutation.mutate({
            class_management_id: classManagementId,
            routine_date: routineDate,
            slots: slots.map((s) => ({
                period_index: s.period_index,
                subject_id: s.subject_id,
                teacher_id: Number(s.teacher_id),
            })),
        });
    };

    const subjects = subjectsData?.data || [];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold text-gray-800">Create Routine</h1>
            </div>

            <ComponentCard title="Routine Details">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Class Type Selector */}
                    <div>
                        <SelectField
                            label="Class Type"
                            placeholder="Select class type"
                            options={CLASS_TYPE_OPTIONS}
                            value={selectedType}
                            onChange={setSelectedType}
                        />
                    </div>

                    {/* Session Selector */}
                    <div>
                        <SelectField
                            label="Session"
                            placeholder="Select session"
                            options={uniqueSessions}
                            value={selectedSession}
                            onChange={setSelectedSession}
                            isDisabled={classesLoading || !selectedType}
                            isLoading={classesLoading}
                        />
                    </div>

                    {/* Date Picker */}
                    <div className="flex flex-col">
                        <Label htmlFor="routine_date" className="mb-1">Routine Date</Label>
                        <DatePicker
                            value={routineDate || null}
                            onChange={(date) => {
                                if (date) {
                                    const year = date.getFullYear();
                                    const month = (date.getMonth() + 1).toString().padStart(2, "0");
                                    const day = date.getDate().toString().padStart(2, "0");
                                    setRoutineDate(`${year}-${month}-${day}`);
                                } else {
                                    setRoutineDate("");
                                }
                            }}
                            placeholder="Select routine date"
                            format="YYYY-MM-DD"
                        />
                    </div>
                </div>
            </ComponentCard>

            {/* Period Slots */}
            <ComponentCard title="Period Slots">
                <div className="space-y-4">
                    {slots.map((slot, index) => (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                            {/* Period index */}
                            <div className="md:col-span-2">
                                <Label htmlFor={`period-${index}`}>Period</Label>
                                <input
                                    id={`period-${index}`}
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm bg-gray-100 mt-1"
                                    value={slot.period_index}
                                    readOnly
                                />
                            </div>

                            {/* Subject dropdown */}
                            <div className="md:col-span-4">
                                <SelectField
                                    label="Subject"
                                    placeholder="Select Subject"
                                    options={subjects.map(sub => ({
                                        value: sub.id,
                                        label: `${sub.name} (${sub.code})`
                                    }))}
                                    value={slot.subject_id}
                                    onChange={(value) => updateSlot(index, "subject_id", value)}
                                    isLoading={subjectsLoading}
                                />
                            </div>

                            {/* Teacher dropdown */}
                            <div className="md:col-span-4">
                                <SelectField
                                    label="Teacher"
                                    placeholder="Select Teacher"
                                    options={teachers?.map(t => ({
                                        value: t.id.toString(),
                                        label: `${t.name} — ${t.title}`
                                    })) || []}
                                    value={slot.teacher_id.toString()}
                                    onChange={(value) => updateSlot(index, "teacher_id", Number(value))}
                                    isLoading={teachersLoading}
                                />
                            </div>

                            {/* Remove button */}
                            <div className="md:col-span-2 flex justify-end">
                                {slots.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSlot(index)}
                                        className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove period"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add slot button */}
                    <button
                        type="button"
                        onClick={addSlot}
                        className="flex items-center gap-2 text-sm font-medium text-brand-600 hover:text-brand-700 py-2 px-4 border border-dashed border-brand-300 rounded-lg hover:bg-brand-50 transition-colors"
                    >
                        <Plus size={16} />
                        Add Period
                    </button>
                </div>
            </ComponentCard>

            {/* Submit */}
            <div>
                <button
                    type="submit"
                    disabled={createRoutineMutation.isPending}
                    className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                >
                    {createRoutineMutation.isPending ? "Saving..." : "Save Routine"}
                </button>
            </div>
        </form>
    );
};

export default CreateRoutinePage;
