// src/lib/seo.ts
//
// Single source of truth for encoding/decoding the 15 SEO fields described in
// the AOC SEO API reference. Every form goes through these helpers so the
// wire format can never drift between screens.

import * as Yup from "yup";
import { SeoFormValues, SeoResponse } from "@/types";

/** Documented max lengths. Enforced server-side, so we mirror them client-side. */
export const SEO_LIMITS = {
  meta_title: 70,
  meta_description: 160,
  canonical_url: 500,
  og_title: 95,
  og_description: 200,
  og_image: 500,
  twitter_title: 70,
  twitter_description: 200,
  twitter_image: 500,
  focus_keyword: 100,
} as const;

/** Blank SEO values. Robots default to true, matching the API defaults. */
export const emptySeoValues: SeoFormValues = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  canonical_url: "",
  og_title: "",
  og_description: "",
  og_image: "",
  twitter_title: "",
  twitter_description: "",
  twitter_image: "",
  robots_index: true,
  robots_follow: true,
  focus_keyword: "",
  sitemap_priority: "",
  schema_json: "",
};

/** Text fields that are always sent, so clearing one in the UI clears it server-side. */
const SEO_TEXT_FIELDS = [
  "meta_title",
  "meta_description",
  "meta_keywords",
  "canonical_url",
  "og_title",
  "og_description",
  "og_image",
  "twitter_title",
  "twitter_description",
  "twitter_image",
  "focus_keyword",
] as const;

/**
 * Append the SEO fields to an outgoing multipart body.
 *
 * `meta_keywords` goes out as a plain comma-separated string — the API parses it
 * into an array itself. It used to be JSON.stringify'd, which double-encoded the
 * value and forced every edit screen to unescape it on the way back in.
 */
export const appendSeoFields = (
  formData: FormData,
  values: Partial<SeoFormValues>
): void => {
  SEO_TEXT_FIELDS.forEach((field) => {
    formData.append(field, values[field] ?? "");
  });

  formData.append("robots_index", String(values.robots_index ?? true));
  formData.append("robots_follow", String(values.robots_follow ?? true));

  // Omit when blank so the server default (0.5) applies. Sending "" would trip
  // "sitemap_priority must be a number between 0.0 and 1.0".
  if (values.sitemap_priority) {
    formData.append("sitemap_priority", values.sitemap_priority);
  }

  if (values.schema_json) {
    formData.append("schema_json", values.schema_json);
  }
};

/**
 * Normalise `meta_keywords` into the comma-separated string the form binds to.
 *
 * Handles three shapes:
 *  - `["a", "b"]`                  — what the API returns now
 *  - `["[\"a\",\"b\"]"]`           — legacy rows written by the old JSON.stringify client
 *  - `"a, b"`                      — already a plain string
 */
export const keywordsToString = (
  keywords: string[] | string | undefined | null
): string => {
  if (!keywords) return "";

  if (typeof keywords === "string") return keywords;

  if (!Array.isArray(keywords) || keywords.length === 0) return "";

  // Legacy single-element escaped-JSON payload.
  if (keywords.length === 1 && typeof keywords[0] === "string") {
    const first = keywords[0];
    if (first.includes("[") || first.includes('"')) {
      try {
        const parsed = JSON.parse(first.replace(/\\/g, ""));
        if (Array.isArray(parsed)) return parsed.join(", ");
      } catch {
        return first.replace(/[[\]"\\]/g, "");
      }
    }
  }

  return keywords.join(", ");
};

/**
 * Map an API SEO payload onto flat form values.
 *
 * Accepts both shapes the API uses: the nested `seo` object on GET endpoints and
 * the flat row returned by the archive endpoints.
 */
export const seoToFormValues = (seo?: SeoResponse | null): SeoFormValues => {
  if (!seo) return { ...emptySeoValues };

  return {
    meta_title: seo.meta_title || "",
    meta_description: seo.meta_description || "",
    meta_keywords: keywordsToString(seo.meta_keywords),
    canonical_url: seo.canonical_url || "",
    og_title: seo.og_title || "",
    og_description: seo.og_description || "",
    og_image: seo.og_image || "",
    twitter_title: seo.twitter_title || "",
    twitter_description: seo.twitter_description || "",
    twitter_image: seo.twitter_image || "",
    robots_index: seo.robots_index ?? true,
    robots_follow: seo.robots_follow ?? true,
    focus_keyword: seo.focus_keyword || "",
    sitemap_priority:
      seo.sitemap_priority === undefined || seo.sitemap_priority === null
        ? ""
        : String(seo.sitemap_priority),
    schema_json: seo.schema_json || "",
  };
};

/**
 * Yup rules for the SEO fields, matching the documented limits.
 * Spread into a form's existing schema: `Yup.object({ ...seoValidationSchema, title: ... })`
 */
export const seoValidationSchema = {
  meta_title: Yup.string().max(
    SEO_LIMITS.meta_title,
    `Meta title must not exceed ${SEO_LIMITS.meta_title} characters`
  ),
  meta_description: Yup.string().max(
    SEO_LIMITS.meta_description,
    `Meta description must not exceed ${SEO_LIMITS.meta_description} characters`
  ),
  canonical_url: Yup.string()
    .max(SEO_LIMITS.canonical_url, "Canonical URL is too long")
    .url("Canonical URL must be a valid URL"),
  og_title: Yup.string().max(
    SEO_LIMITS.og_title,
    `OG title must not exceed ${SEO_LIMITS.og_title} characters`
  ),
  og_description: Yup.string().max(
    SEO_LIMITS.og_description,
    `OG description must not exceed ${SEO_LIMITS.og_description} characters`
  ),
  og_image: Yup.string()
    .max(SEO_LIMITS.og_image, "OG image URL is too long")
    .url("OG image must be a valid URL"),
  twitter_title: Yup.string().max(
    SEO_LIMITS.twitter_title,
    `Twitter title must not exceed ${SEO_LIMITS.twitter_title} characters`
  ),
  twitter_description: Yup.string().max(
    SEO_LIMITS.twitter_description,
    `Twitter description must not exceed ${SEO_LIMITS.twitter_description} characters`
  ),
  twitter_image: Yup.string()
    .max(SEO_LIMITS.twitter_image, "Twitter image URL is too long")
    .url("Twitter image must be a valid URL"),
  focus_keyword: Yup.string().max(
    SEO_LIMITS.focus_keyword,
    `Focus keyword must not exceed ${SEO_LIMITS.focus_keyword} characters`
  ),
  sitemap_priority: Yup.string().test(
    "priority-range",
    "Sitemap priority must be a number between 0.0 and 1.0",
    (value) => {
      if (!value) return true;
      const num = Number(value);
      return !Number.isNaN(num) && num >= 0 && num <= 1;
    }
  ),
  schema_json: Yup.string().test(
    "valid-json",
    "Schema JSON must be valid JSON-LD",
    (value) => {
      if (!value) return true;
      try {
        JSON.parse(value);
        return true;
      } catch {
        return false;
      }
    }
  ),
};

/** Selectable sitemap priorities, 0.0 to 1.0. */
export const SITEMAP_PRIORITIES = [
  "0.0",
  "0.1",
  "0.2",
  "0.3",
  "0.4",
  "0.5",
  "0.6",
  "0.7",
  "0.8",
  "0.9",
  "1.0",
] as const;

/** Public site root, used to prefill canonical URLs. */
export const SITE_URL = "https://aoc.edu.np";

/**
 * The listing/landing pages that have SEO but no content row of their own.
 * `GET /seo/archive` only returns rows that have already been configured, so the
 * admin list left-joins onto this catalogue to show every page from day one.
 */
export const ARCHIVE_PAGES = [
  { slug: "homepage", label: "Homepage", url: "/" },
  { slug: "management-team", label: "Management Team", url: "/management-team" },
  { slug: "faculties", label: "Our Faculties", url: "/faculties" },
  { slug: "news-list", label: "News Listing Page", url: "/news-list" },
  { slug: "blog-list", label: "Blog Listing Page", url: "/blog-list" },
  { slug: "routine", label: "Class Routine", url: "/routine" },
  { slug: "gallery", label: "Gallery", url: "/gallery" },
] as const;

export type ArchivePageSlug = (typeof ARCHIVE_PAGES)[number]["slug"];

export const findArchivePage = (slug: string) =>
  ARCHIVE_PAGES.find((page) => page.slug === slug);
