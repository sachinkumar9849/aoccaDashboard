import { LoginValues, User, UserRegistrationValues, ApiResponse } from "@/types";
import { apiClient } from "./client";

export const registerUser = async (userData: UserRegistrationValues): Promise<ApiResponse> => {
  return apiClient.request<ApiResponse>("/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (credentials: LoginValues): Promise<User> => {
  return apiClient.request<User>("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
};