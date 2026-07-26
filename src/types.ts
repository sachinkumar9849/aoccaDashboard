export interface UserRegistrationValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: string;
}
export interface LoginValues{
  email: string;
  password: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_blacklisted: boolean;
  user_type: string;
  created_at: string;
  updated_at: string;
  token: string;
}

export interface ApiResponse {
  message: string;
}
export interface PageFormValues{
  title: string;
  description: string;
  subtitle:string;
  slug: string;
  type: string;
  video: string;
  status: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  image_url?: File | null;
  name:string;
  linkedin: string;
  rating: string;
  sort_order: string;

}
export interface PageResponse {
  data: {
    id: number;
    title: string;
    description: string;
    image_url: string;
    slug: string;
    status: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string[];
    created_at: string;
    sort_order: string;
  };
  message: string;
}







export type ApiErrorResponse = Record<string, string>;

/**
 * Flat, all-strings shape used to bind the 15 SEO fields to Formik.
 * Mirrors section 1 ("SEO Field Reference") of the AOC SEO API doc.
 */
export interface SeoFormValues {
  meta_title: string;
  meta_description: string;
  meta_keywords: string; // comma-separated in the form, comma-separated on the wire
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  twitter_image: string;
  robots_index: boolean;
  robots_follow: boolean;
  focus_keyword: string;
  sitemap_priority: string; // "0.0".."1.0"; empty means "use the server default"
  schema_json: string;
}

/**
 * SEO as it comes back from the API.
 * GET endpoints nest this under `seo`; POST/PATCH return the same fields flat.
 */
export interface SeoResponse {
  meta_title?: string;
  meta_description?: string;
  // The API returns string[]. Rows written by the old client stored a single
  // JSON-escaped element, so both forms are tolerated on read.
  meta_keywords?: string[] | string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  robots_index?: boolean;
  robots_follow?: boolean;
  focus_keyword?: string;
  sitemap_priority?: number;
  schema_json?: string;
}

/** A row of the SEO archive-pages resource (`/seo/archive`). All fields flat. */
export interface SeoArchivePage extends SeoResponse {
  id: number;
  slug: string;
  label: string;
  created_at: string;
  updated_at: string;
}