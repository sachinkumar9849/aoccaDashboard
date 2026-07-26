"use client";
import React from "react";
import { FormikProps } from "formik";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Checkbox from "@/components/form/input/Checkbox";
import ComponentCard from "@/components/common/ComponentCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { SeoFormValues } from "@/types";
import { SEO_LIMITS, SITEMAP_PRIORITIES } from "@/lib/seo";

type SeoFieldName = keyof SeoFormValues;

// Forms in this codebase type Formik over their own value shape, so the panel only
// requires that the SEO keys are present.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyFormik = FormikProps<any>;

const valueOf = (formik: AnyFormik, name: SeoFieldName): string =>
    (formik.values?.[name] as string) ?? "";

const errorOf = (formik: AnyFormik, name: SeoFieldName): string | undefined => {
    const touched = formik.touched?.[name];
    const error = formik.errors?.[name];
    return touched && typeof error === "string" ? error : undefined;
};

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
    message ? <div className="text-red-500 text-sm mt-1">{message}</div> : null;

/** Shows "12 / 70", red once the documented server limit is exceeded. */
const CharCount: React.FC<{ length: number; max: number }> = ({ length, max }) => (
    <span className={`text-xs ${length > max ? "text-red-500" : "text-gray-400"}`}>
        {length} / {max}
    </span>
);

// NOTE: these are declared at module scope on purpose. Defining them inside
// SeoFields would give React a new component type on every render, remounting the
// inputs and dropping focus after each keystroke.
const TextField: React.FC<{
    formik: AnyFormik;
    name: SeoFieldName;
    label: string;
    max?: number;
    placeholder?: string;
    colSpan?: 1 | 2;
}> = ({ formik, name, label, max, placeholder, colSpan = 1 }) => {
    const error = errorOf(formik, name);
    const current = valueOf(formik, name);
    return (
        <div className={colSpan === 2 ? "col-span-2" : "col-span-2 md:col-span-1"}>
            <div className="flex items-center justify-between">
                <Label htmlFor={name}>{label}</Label>
                {max && <CharCount length={current.length} max={max} />}
            </div>
            <Input
                id={name}
                name={name}
                type="text"
                placeholder={placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={current}
                error={Boolean(error)}
            />
            <FieldError message={error} />
        </div>
    );
};

const AreaField: React.FC<{
    formik: AnyFormik;
    name: SeoFieldName;
    label: string;
    max?: number;
    rows?: number;
    placeholder?: string;
    mono?: boolean;
}> = ({ formik, name, label, max, rows = 3, placeholder, mono = false }) => {
    const error = errorOf(formik, name);
    const current = valueOf(formik, name);
    return (
        <div className="col-span-2">
            <div className="flex items-center justify-between">
                <Label htmlFor={name}>{label}</Label>
                {max && <CharCount length={current.length} max={max} />}
            </div>
            <textarea
                id={name}
                name={name}
                rows={rows}
                placeholder={placeholder}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={current}
                className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-500 text-sm dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 ${
                    mono ? "font-mono" : ""
                } ${error ? "border-red-500" : "border-gray-300"}`}
            />
            <FieldError message={error} />
        </div>
    );
};

const GroupHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="col-span-2 pt-2">
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {children}
        </h4>
    </div>
);

interface SeoFieldsProps {
    formik: AnyFormik;
    /** "basic" hides the social + advanced groups, for records not indexed on their own URL. */
    variant?: "full" | "basic";
    title?: string;
}

/**
 * The 15 SEO fields from the AOC SEO API, as one reusable panel.
 * Pair with `appendSeoFields` on submit and `seoToFormValues` on hydrate.
 */
const SeoFields: React.FC<SeoFieldsProps> = ({
    formik,
    variant = "full",
    title = "SEO",
}) => (
    <ComponentCard title={title}>
        <div className="grid grid-cols-2 gap-4">
            <TextField
                formik={formik}
                name="meta_title"
                label="Meta Title"
                max={SEO_LIMITS.meta_title}
                placeholder="Page title for the browser tab and search results"
            />
            <TextField
                formik={formik}
                name="focus_keyword"
                label="Focus Keyword"
                max={SEO_LIMITS.focus_keyword}
                placeholder="Primary keyword you want to rank for"
            />
            <TextField
                formik={formik}
                name="meta_keywords"
                label="Meta Keywords"
                colSpan={2}
                placeholder="keyword1, keyword2, keyword3"
            />
            <AreaField
                formik={formik}
                name="meta_description"
                label="Meta Description"
                max={SEO_LIMITS.meta_description}
                rows={3}
                placeholder="Short summary shown under the title in search results"
            />
            <TextField
                formik={formik}
                name="canonical_url"
                label="Canonical URL"
                colSpan={2}
                placeholder="https://aoc.edu.np/your-page"
            />

            {variant === "full" && (
                <>
                    <GroupHeading>Social Sharing</GroupHeading>

                    <TextField
                        formik={formik}
                        name="og_title"
                        label="OG Title"
                        max={SEO_LIMITS.og_title}
                        placeholder="Title shown when shared on Facebook / LinkedIn"
                    />
                    <TextField
                        formik={formik}
                        name="og_image"
                        label="OG Image URL"
                        placeholder="https://aoc.edu.np/uploads/og-image.jpg"
                    />
                    <AreaField
                        formik={formik}
                        name="og_description"
                        label="OG Description"
                        max={SEO_LIMITS.og_description}
                        rows={2}
                    />
                    <TextField
                        formik={formik}
                        name="twitter_title"
                        label="Twitter Title"
                        max={SEO_LIMITS.twitter_title}
                    />
                    <TextField
                        formik={formik}
                        name="twitter_image"
                        label="Twitter Image URL"
                        placeholder="https://aoc.edu.np/uploads/twitter-image.jpg"
                    />
                    <AreaField
                        formik={formik}
                        name="twitter_description"
                        label="Twitter Description"
                        max={SEO_LIMITS.twitter_description}
                        rows={2}
                    />

                    <GroupHeading>Advanced</GroupHeading>

                    <div className="col-span-2 md:col-span-1">
                        <Label htmlFor="sitemap_priority">Sitemap Priority</Label>
                        <Select
                            name="sitemap_priority"
                            value={valueOf(formik, "sitemap_priority")}
                            onValueChange={(next) =>
                                formik.setFieldValue("sitemap_priority", next)
                            }
                        >
                            <SelectTrigger className="w-full" style={{ height: "44px" }}>
                                <SelectValue placeholder="Default (0.5)" />
                            </SelectTrigger>
                            <SelectContent className="bg-white">
                                {SITEMAP_PRIORITIES.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                        {priority}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <FieldError message={errorOf(formik, "sitemap_priority")} />
                    </div>

                    <div className="col-span-2 md:col-span-1 flex items-end gap-6 pb-1">
                        <Checkbox
                            id="robots_index"
                            label="Allow indexing"
                            checked={Boolean(formik.values?.robots_index)}
                            onChange={(checked) =>
                                formik.setFieldValue("robots_index", checked)
                            }
                        />
                        <Checkbox
                            id="robots_follow"
                            label="Follow links"
                            checked={Boolean(formik.values?.robots_follow)}
                            onChange={(checked) =>
                                formik.setFieldValue("robots_follow", checked)
                            }
                        />
                    </div>

                    <AreaField
                        formik={formik}
                        name="schema_json"
                        label="Schema JSON-LD"
                        rows={5}
                        mono
                        placeholder='{"@context":"https://schema.org","@type":"WebPage","name":"..."}'
                    />
                </>
            )}
        </div>
    </ComponentCard>
);

export default SeoFields;
