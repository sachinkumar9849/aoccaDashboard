import axios, { AxiosError } from 'axios';
import { PageFormValues, PageResponse, ApiErrorResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://156.67.104.182:8081/api/v1';

export const createPage = async (pageData: PageFormValues): Promise<PageResponse> => {
  try {
    // Format the data to match what the API expects
    const formattedData = {
      data: pageData
    };

    const response = await axios.post<PageResponse>(
      `${API_URL}/create-page`, 
      formattedData, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }
    );
    console.log("sachin response",response)
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