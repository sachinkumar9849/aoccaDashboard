"use client";
import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import ComponentCard from "@/components/common/ComponentCard";
import SeoFields from "@/components/common/SeoFields";
import { apiClient } from "@/api/client";
import { SeoArchivePage, SeoFormValues } from "@/types";
import {
    appendSeoFields,
    emptySeoValues,
    findArchivePage,
    seoToFormValues,
    seoValidationSchema,
    SITE_URL,
} from "@/lib/seo";

type ArchiveFormValues = SeoFormValues & { label: string };

interface UpsertResponse {
    message: string;
    data?: SeoArchivePage;
}

const SeoArchiveEdit = () => {
    const params = useParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const page = slug ? findArchivePage(slug) : undefined;

    const validationSchema = Yup.object({
        ...seoValidationSchema,
        label: Yup.string().max(255, "Label must not exceed 255 characters"),
    });

    const formik = useFormik<ArchiveFormValues>({
        initialValues: {
            ...emptySeoValues,
            label: page?.label || "",
            canonical_url: page ? `${SITE_URL}${page.url}` : "",
        },
        validationSchema,
        onSubmit: (values) => {
            if (!slug) return;
            const formData = new FormData();
            formData.append("label", values.label || "");
            appendSeoFields(formData, values);
            upsertMutation.mutate(formData);
        },
    });

    // The API 404s for a slug that has never been saved. That is the normal
    // "not configured yet" state, not an error — fall back to an empty form.
    const { data, isLoading, isError, error } = useQuery<SeoArchivePage | null, Error>({
        queryKey: ["seo-archive", slug],
        queryFn: async () => {
            try {
                return (await apiClient.getArchiveSeoBySlug(slug!)) as SeoArchivePage;
            } catch (err) {
                const message = (err as Error).message || "";
                if (/not found/i.test(message)) return null;
                throw err;
            }
        },
        enabled: Boolean(slug && page),
        retry: false,
    });

    const upsertMutation = useMutation<UpsertResponse, Error, FormData>({
        mutationFn: async (formData: FormData) => {
            return (await apiClient.upsertArchiveSeo(slug!, formData)) as UpsertResponse;
        },
        onSuccess: (result) => {
            queryClient.invalidateQueries({ queryKey: ["seo-archive"] });
            toast.success(result.message || "SEO archive page saved successfully");
            router.push("/seo-archive");
        },
        onError: (err: Error) => {
            toast.error(err.message || "An error occurred while saving SEO settings");
        },
    });

    // Archive rows are flat, so the whole record doubles as the SEO payload.
    useEffect(() => {
        if (data) {
            formik.setValues({
                ...seoToFormValues(data),
                label: data.label || page?.label || "",
            });
        }
    }, [data]);

    if (!slug || !page) {
        return (
            <div className="text-red-500">
                Unknown archive page: {slug ?? "(none)"}. Valid slugs are defined in
                ARCHIVE_PAGES.
            </div>
        );
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-64">Loading...</div>;
    }

    if (isError) {
        return (
            <div className="text-red-500">
                Error loading SEO settings: {(error as Error).message}
            </div>
        );
    }

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-5">
                <ComponentCard
                    title={page.label}
                    desc={`Archive page SEO for ${SITE_URL}${page.url}${
                        data ? "" : " — not configured yet"
                    }`}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="label">Admin Label</Label>
                            <Input
                                id="label"
                                name="label"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.label}
                                error={Boolean(formik.touched.label && formik.errors.label)}
                            />
                            {formik.touched.label && formik.errors.label && (
                                <div className="text-red-500 text-sm mt-1">
                                    {formik.errors.label}
                                </div>
                            )}
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <Label htmlFor="slug">Slug</Label>
                            <Input id="slug" name="slug" type="text" value={slug} disabled />
                        </div>
                    </div>
                </ComponentCard>

                <SeoFields formik={formik} />

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={upsertMutation.isPending}
                        className="w-full flex items-center justify-center p-3 font-medium text-white rounded-lg bg-brand-500 text-theme-sm hover:bg-brand-600 disabled:opacity-70"
                    >
                        {upsertMutation.isPending ? "Saving..." : "Save SEO Settings"}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push("/seo-archive")}
                        className="w-full flex items-center justify-center p-3 font-medium text-gray-600 rounded-lg bg-gray-200 text-theme-sm hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SeoArchiveEdit;
