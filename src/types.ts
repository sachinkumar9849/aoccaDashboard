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
  status: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  image_url?: File | null;
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
  };
  message: string;
}







export type ApiErrorResponse = Record<string, string>;