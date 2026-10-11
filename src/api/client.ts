// src/api/client.ts

/**
 * API client utility for making authenticated requests
 */
export const apiClient = {
  /**
   * Base URL for API requests
   */
  baseUrl: (process.env.NEXT_PUBLIC_URL || "https://api.aoc.edu.np/api/v1").replace(/"/g, "").trim(),

  /**
   * Get the authentication token from localStorage
   */
  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken");
    }
    return null;
  },

  /**
   * Handle token expiration by clearing local storage and redirecting
   */
  handleTokenExpiration: () => {
    if (typeof window !== "undefined") {
      // Clear authentication data
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");

      // Use window.location.replace instead of href for better redirect
      // This prevents the page from being added to browser history
      window.location.replace("/signin");
    }
  },

  /**
   * Make an authenticated API request
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();

    if (!token) {
      this.handleTokenExpiration();
      throw new Error("Authentication token is required. Please log in.");
    }

    const headers = {
      ...options.headers,
      "Authorization": `Bearer ${token}`
    };

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      // Check for 401 Unauthorized (token expired or invalid)
      if (response.status === 401) {
        this.handleTokenExpiration();
        throw new Error("Your session has expired. Please log in again.");
      }

      if (!response.ok) {
        if (response.status === 413) {
          const errorData = await response.json().catch(() => ({}));
          const errorMsg =
            errorData?.error ||
            errorData?.message ||
            "The uploaded file or request is too large (413). Please upload an image under 1MB or compress it before submitting.";
          throw new Error(errorMsg);
        }
        const errorData = await response.json().catch(() => ({}));
        // Backend could return {"error":"..."} or {"message":"..."} or a generic string
        const errorMsg = errorData?.error || errorData?.message || `API request failed with status ${response.status}`;
        throw new Error(errorMsg);
      }

      return response.json();
    } catch (error) {
      throw error;
    }
  },

  /**
   * Create a new page
   */
  createPage: async (formData: FormData) => {
    return apiClient.request("/create-page", {
      method: "POST",
      body: formData,
    });
  },

  updatePage: async (id: string | string[], formData: FormData) => {
    return apiClient.request(`/update-page/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },

  getPages: async (status?: string) => {
    const query = status ? `?status=${status}` : "";
    return apiClient.request(`/pages${query}`, {
      method: "GET",
    });
  },

  getPageById: async (id: string | string[]) => {
    return apiClient.request(`/page-by-id/${id}`, {
      method: "GET",
    });
  },

  getPageBySlug: async (slug: string) => {
    return apiClient.request(`/page/${slug}`, {
      method: "GET",
    });
  },

  deletePage: async (id: string | number) => {
    return apiClient.request(`/delete-page/${id}`, {
      method: "DELETE",
    });
  },

  createNewsBlog: async (formData: FormData) => {
    return apiClient.request("/create-news-blog", {
      method: "POST",
      body: formData,
    });
  },

  getNewsBlogById: async (newsId: string | string[]) => {
    return apiClient.request(`/news-blog-id/${newsId}`, {
      method: "GET",
    });
  },

  getNewsBlogBySlug: async (slug: string) => {
    return apiClient.request(`/news-blog/${slug}`, {
      method: "GET",
    });
  },

  updateNewsBlog: async (id: string | string[], formData: FormData) => {
    return apiClient.request(`/update-news-blog/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },

  createTeam: async (formData: FormData) => {
    return apiClient.request("/create-toper-testimonial-team", {
      method: "POST",
      body: formData,
    });
  },

  /** Fetch by numeric id. Note the `-by-id` suffix: `/toper-testimonial-team/:slug` is the slug route. */
  getToperTestimonialTeamById: async (newsId: string | string[]) => {
    return apiClient.request(`/toper-testimonial-team-by-id/${newsId}`, {
      method: "GET",
    });
  },

  getToperTestimonialTeamBySlug: async (slug: string) => {
    return apiClient.request(`/toper-testimonial-team/${slug}`, {
      method: "GET",
    });
  },

  updateToperTestimonialTeamById: async (id: string | string[], formData: FormData) => {
    return apiClient.request(`/update-toper-testimonial-team/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },

  /* ---------------------------------------------------------------- */
  /* SEO archive pages — listing pages with no content row of their own */
  /* ---------------------------------------------------------------- */

  /** All configured archive rows. Slugs never saved yet are simply absent. */
  getArchiveSeoList: async () => {
    return apiClient.request("/seo/archive", {
      method: "GET",
    });
  },

  /**
   * A single archive row. The API 404s for slugs that have never been saved,
   * which `request()` surfaces as a thrown Error — callers should treat that as
   * "not configured yet" rather than a failure.
   */
  getArchiveSeoBySlug: async (slug: string) => {
    return apiClient.request(`/seo/archive/${slug}`, {
      method: "GET",
    });
  },

  /** Upsert: creates the row if missing, otherwise patches the submitted fields. */
  upsertArchiveSeo: async (slug: string, formData: FormData) => {
    return apiClient.request(`/seo/archive/${slug}`, {
      method: "PATCH",
      body: formData,
    });
  },
};