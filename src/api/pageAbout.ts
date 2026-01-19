import axios, { AxiosError } from 'axios';
import { PageFormValues, PageResponse, ApiErrorResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.aoc.edu.np/api/v1';

export const createPage = async (pageData: PageFormValues): Promise<PageResponse> => {
  try {
    // Format the data to match what the API expects
    const formattedData = {
      data: pageData
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await axios.post<PageResponse>(
      `${API_URL}/create-page`,
      formattedData,
      {
        headers
      }
    );
    console.log("sachin response", response)
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