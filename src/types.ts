export interface UserRegistrationValues {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  user_type: string;
}

export interface ApiResponse {
  message: string;
}

export type ApiErrorResponse = Record<string, string>;