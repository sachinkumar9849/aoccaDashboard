"use client";
import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { apiClient } from "@/api/client";
import { SeoArchivePage } from "@/types";
import { ARCHIVE_PAGES } from "@/lib/seo";

interface ArchiveRow {
    slug: string;
    label: string;
    url: string;
    configured: boolean;
    record?: SeoArchivePage;
}

const SeoArchiveList: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery<SeoArchivePage[]>({
        queryKey: ["seo-archive"],
        queryFn: () => apiClient.getArchiveSeoList() as Promise<SeoArchivePage[]>,
    });

    // `GET /seo/archive` only returns rows that have already been saved, so join
    // onto the known catalogue — otherwise unconfigured pages would be invisible
    // and there would be no way to reach their edit form.
    const rows: ArchiveRow[] = ARCHIVE_PAGES.map((page) => {
        const record = data?.find((item) => item.slug === page.slug);
        return {
            slug: page.slug,
            label: record?.label || page.label,
            url: page.url,
            configured: Boolean(record),
            record,
        };
    });

    const robotsSummary = (record?: SeoArchivePage): string => {
        if (!record) return "—";
        const index = record.robots_index === false ? "noindex" : "index";
        const follow = record.robots_follow === false ? "nofollow" : "follow";
        return `${index}, ${follow}`;
    };

    if (isLoading) {
        return (
            <div className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-center dark:bg-white/[0.03]">
                <div className="py-8">Loading archive SEO settings...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="w-full p-4 bg-white rounded-lg shadow-sm dark:bg-white/[0.03]">
                <div className="text-red-500">
                    Error loading data: {(error as Error).message}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm dark:bg-white/[0.03]">
            <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                SEO for listing and landing pages that have no content record of their
                own. Each row maps to a public URL on aoc.edu.np.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[840px] text-left">
                    <thead>
                        <tr className="border-b border-gray-200 text-sm text-gray-500 dark:border-gray-800">
                            <th className="py-3 px-6 font-medium">Page</th>
                            <th className="py-3 px-6 font-medium">URL</th>
                            <th className="py-3 px-6 font-medium">Meta Title</th>
                            <th className="py-3 px-6 font-medium">Robots</th>
                            <th className="py-3 px-6 font-medium">Priority</th>
                            <th className="py-3 px-6 font-medium">Status</th>
                            <th className="py-3 px-6 font-medium">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.slug}
                                className="border-b border-gray-100 dark:border-gray-800"
                            >
                                <td className="py-3 px-6">
                                    <p className="font-medium text-gray-800 dark:text-white/90">
                                        {row.label}
                                    </p>
                                    <p className="text-[13px] text-gray-500">{row.slug}</p>
                                </td>
                                <td className="py-3 px-6 text-[13px] text-gray-700 dark:text-gray-400">
                                    {row.url}
                                </td>
                                <td className="py-3 px-6 max-w-[280px]">
                                    <p className="truncate text-[13px] text-gray-700 dark:text-gray-400">
                                        {row.record?.meta_title || "—"}
                                    </p>
                                </td>
                                <td className="py-3 px-6 text-[13px] text-gray-700 dark:text-gray-400">
                                    {robotsSummary(row.record)}
                                </td>
                                <td className="py-3 px-6 text-[13px] text-gray-700 dark:text-gray-400">
                                    {row.record?.sitemap_priority ?? "—"}
                                </td>
                                <td className="py-3 px-6">
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                                            row.configured
                                                ? "text-green-600 bg-green-100"
                                                : "text-orange-600 bg-orange-100"
                                        }`}
                                    >
                                        {row.configured ? "Configured" : "Not configured"}
                                    </span>
                                </td>
                                <td className="py-3 px-6">
                                    <Link
                                        href={`/seo-archive/${row.slug}`}
                                        className="p-1 text-blue-500 hover:text-blue-700 inline-flex"
                                        title="Edit"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SeoArchiveList;
