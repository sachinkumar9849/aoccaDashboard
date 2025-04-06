import { ApiErrorResponse, ApiResponse, LoginValues, User, UserRegistrationValues } from '@/types';
import axios, { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_URL;

export const registerUser = async (userData: UserRegistrationValues): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(`${API_URL}/register`, userData);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
   
      throw { 
        status: error.response.status,
        data: error.response.data 
      };
    }
    throw err; 
  }
};
export const loginUser = async (credentials: LoginValues): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (err) {
    const error = err as AxiosError<ApiErrorResponse>;
    if (error.response && error.response.data) {
      throw { 
        status: error.response.status,
        data: error.response.data 
      };
    }
    throw err;
  }
};