import { LoginValues, User, UserRegistrationValues, ApiResponse } from "@/types";
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