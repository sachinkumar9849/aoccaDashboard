// src/api/client.ts

/**
 * API client utility for making authenticated requests
 */
export const apiClient = {
  /**
   * Base URL for API requests
   */
  baseUrl: "https://api.aoc.edu.np/api/v1",

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

  getToperTestimonialTeamById: async (newsId: string | string[]) => {
    return apiClient.request(`/toper-testimonial-team/${newsId}`, {
      method: "GET",
    });
  },

  updateToperTestimonialTeamById: async (id: string | string[], formData: FormData) => {
    return apiClient.request(`/update-toper-testimonial-team/${id}`, {
      method: "PATCH",
      body: formData,
    });
  },
};