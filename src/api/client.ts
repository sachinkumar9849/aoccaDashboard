// src/api/client.ts

/**
 * API client utility for making authenticated requests
 */
export const apiClient = {
    /**
     * Base URL for API requests
     */
    baseUrl: "http://156.67.104.182:8081/api/v1",
  
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
     * Make an authenticated API request
     */
    async request<T>(
      endpoint: string, 
      options: RequestInit = {}
    ): Promise<T> {
      const token = this.getToken();
      
      if (!token) {
        throw new Error("Authentication token is required. Please log in.");
      }
  
      const headers = {
        ...options.headers,
        "Authorization": `Bearer ${token}`
      };
  
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API request failed with status ${response.status}`);
      }
  
      return response.json();
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
  
    // Add more API methods as needed...
  };