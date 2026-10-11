import {
  LoginValues,
  User,
  UserRegistrationValues,
  ApiResponse,
  CreateUserPayload,
  UpdateUserPayload,
  ResetPasswordPayload,
} from "@/types";
import { apiClient } from "./client";

const BASE_URL = apiClient.baseUrl;

export const registerUser = async (userData: UserRegistrationValues): Promise<ApiResponse> => {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: null }));
    throw { data: error };
  }

  return response.json();
};

export const loginUser = async (credentials: LoginValues): Promise<User> => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: null }));
    throw { data: error };
  }

  return response.json();
};

/**
 * Admin CRUD operations for Users
 */

export interface GetUsersParams {
  is_active?: boolean;
  user_type?: string;
  search?: string;
}

export const getUsers = async (params?: GetUsersParams): Promise<User[]> => {
  const searchParams = new URLSearchParams();
  if (params?.is_active !== undefined) {
    searchParams.append("is_active", String(params.is_active));
  }
  if (params?.user_type) {
    searchParams.append("user_type", params.user_type);
  }
  if (params?.search) {
    searchParams.append("search", params.search);
  }

  const queryString = searchParams.toString();
  const endpoint = `/users${queryString ? `?${queryString}` : ""}`;
  return apiClient.request<User[]>(endpoint);
};

export const getUserById = async (id: string): Promise<User> => {
  return apiClient.request<User>(`/users/${id}`);
};

export const createUser = async (payload: CreateUserPayload): Promise<User> => {
  return apiClient.request<User>("/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const updateUser = async (
  id: string,
  payload: UpdateUserPayload
): Promise<User> => {
  return apiClient.request<User>(`/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const deleteUser = async (id: string): Promise<{ message: string }> => {
  return apiClient.request<{ message: string }>(`/users/${id}`, {
    method: "DELETE",
  });
};

export const resetUserPassword = async (
  id: string,
  payload: ResetPasswordPayload
): Promise<{ message: string }> => {
  return apiClient.request<{ message: string }>(`/users/${id}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};
