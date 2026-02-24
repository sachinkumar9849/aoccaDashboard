"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/api/client";
import { Calendar, Clock, ChevronDown, ChevronUp } from "lucide-react";
import DatePicker from "@/components/crm/DatePickerDemo";
import ComponentCard from "@/components/common/ComponentCard";

interface RoutineSlot {
    id: string;
    period_index: number;
    subject_id: string;
    subject_code: string;
    subject_name: string;
    teacher_id: number;
    teacher_name: string;
    teacher_title: string;
}

interface RoutineDateInfo {
    routine_date: string;
    slots: RoutineSlot[];
}

interface ClassRoutineGroup {
    class_management_id: string;
    session: string;
    type: string;
    routines_by_date: RoutineDateInfo[];
}

type AdminRoutineData = Record<string, ClassRoutineGroup[]>;

interface AdminRoutineResponse {
    data: AdminRoutineData;
    filter_from: string;
    filter_to: string;
}

const DashboardRoutineWidget: React.FC = () => {
    // Default to current month
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatToYYYYMMDD = (d: Date) => {
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, "0");
        const day = d.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [fromDate, setFromDate] = useState<string>(formatToYYYYMMDD(firstDay));
    const [toDate, setToDate] = useState<string>(formatToYYYYMMDD(lastDay));
    const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

    const toggleClass = (classId: string) => {
        setExpandedClasses((prev) => ({
            ...prev,
            [classId]: !prev[classId],
        }));
    };

    const { data: routineRes, isLoading, isError } = useQuery<AdminRoutineResponse>({
        queryKey: ["dashboard-routine", fromDate, toDate],
        queryFn: () =>
            apiClient.request<AdminRoutineResponse>(
                `/routine/admin?from=${fromDate}&to=${toDate}`
            ),
        enabled: !!fromDate && !!toDate,
    });

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const hasData = routineRes?.data && Object.keys(routineRes.data).length > 0;

    return (
        <ComponentCard title="Routine Overview">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        From Date
                    </label>
                    <DatePicker
                        value={fromDate || null}
                        onChange={(date) => {
                            if (date) setFromDate(formatToYYYYMMDD(date));
                            else setFromDate("");
                        }}
                        placeholder="Select from date"
                        format="YYYY-MM-DD"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        To Date
                    </label>
                    <DatePicker
                        value={toDate || null}
                        onChange={(date) => {
                            if (date) setToDate(formatToYYYYMMDD(date));
                            else setToDate("");
                        }}
                        placeholder="Select to date"
                        format="YYYY-MM-DD"
                    />
                </div>
            </div>

            {/* Loading / Error / Empty States */}
            {isLoading && (
                <div className="py-12 text-center text-gray-500">
                    <Calendar className="mx-auto mb-3 animate-pulse text-gray-400" size={32} />
                    <p>Loading routines...</p>
                </div>
            )}

            {isError && (
                <div className="py-12 text-center text-red-500">
                    <p>Failed to load routine data.</p>
                </div>
            )}

            {!isLoading && !isError && !hasData && (
                <div className="py-12 text-center text-gray-500">
                    <Calendar className="mx-auto mb-3 text-gray-300" size={40} />
                    <p>No routines found for the selected dates.</p>
                </div>
            )}

            {/* Routine Data Display */}
            {!isLoading && hasData && (
                <div className="space-y-6">
                    {Object.entries(routineRes.data).map(([type, classes]) => (
                        <div key={type} className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                                <h3 className="font-semibold text-gray-800 text-sm tracking-wide uppercase">
                                    {type}
                                </h3>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {classes.map((cls) => {
                                    const isExpanded = expandedClasses[cls.class_management_id];

                                    // Total routines count
                                    const totalDates = cls.routines_by_date?.length || 0;

                                    return (
                                        <div key={cls.class_management_id}>
                                            <button
                                                type="button"
                                                onClick={() => toggleClass(cls.class_management_id)}
                                                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="text-left">
                                                    <p className="font-medium text-brand-700 text-sm">{cls.session}</p>
                                                    <p className="text-xs text-gray-500 mt-0.5">{totalDates} routine date{totalDates !== 1 ? "s" : ""}</p>
                                                </div>
                                                <div className="text-gray-400">
                                                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </div>
                                            </button>

                                            {isExpanded && (
                                                <div className="px-4 pb-4 pt-1">
                                                    {totalDates === 0 ? (
                                                        <p className="text-sm text-gray-400 italic py-2">No routines scheduled.</p>
                                                    ) : (
                                                        <div className="space-y-4 mt-2">
                                                            {cls.routines_by_date.map((routineDate) => (
                                                                <div key={routineDate.routine_date} className="bg-white border rounded-lg overflow-hidden">
                                                                    <div className="bg-blue-50/50 px-3 py-2 border-b flex items-center gap-2">
                                                                        <Calendar className="text-brand-500" size={14} />
                                                                        <span className="text-sm font-medium text-gray-800">
                                                                            {formatDate(routineDate.routine_date)}
                                                                        </span>
                                                                    </div>
                                                                    <div className="divide-y divide-gray-50">
                                                                        {routineDate.slots?.map((slot) => (
                                                                            <div key={slot.id} className="px-3 py-2.5 flex items-start sm:items-center flex-col sm:flex-row gap-2 sm:gap-4 text-sm hover:bg-gray-50">
                                                                                <div className="flex items-center gap-1.5 text-gray-500 w-24 flex-shrink-0">
                                                                                    <Clock size={14} />
                                                                                    <span className="font-medium">Period {slot.period_index}</span>
                                                                                </div>
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="font-medium text-gray-900 truncate">
                                                                                        {slot.subject_name || slot.subject_code || "Unknown Subject"}
                                                                                    </p>
                                                                                </div>
                                                                                <div className="flex-1 min-w-0 sm:text-right text-left">
                                                                                    <p className="text-gray-600 truncate">
                                                                                        {slot.teacher_name || `Teacher #${slot.teacher_id}`}
                                                                                    </p>
                                                                                    {slot.teacher_title && (
                                                                                        <p className="text-xs text-gray-400 truncate hidden sm:block">
                                                                                            {slot.teacher_title}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </ComponentCard>
    );
};

export default DashboardRoutineWidget;
