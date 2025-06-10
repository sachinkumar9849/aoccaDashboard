import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export interface Lead {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  previous_qualification: string;
  current_status: string;
  lead_source: string;
  inquiry: string;
  amount: number;
  status: string;
  follow_up_date?: string;
  tag: string;
  created_at?: string;
  updated_at?: string;
}

export const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
  try {
    // Clone the data to avoid mutating the original
    const payload = { ...leadData };
    
    // Remove empty follow_up_date
    if (payload.follow_up_date === "") {
      delete payload.follow_up_date;
    }

    const response = await axiosInstance.post('/leads', payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
   
    throw axiosError;
  }
};