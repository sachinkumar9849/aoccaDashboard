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

export type ApiErrorResponse = Record<string, string>;