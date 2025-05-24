// src/services/leadService.ts
// import axiosInstance from '@/lib/axios'; // Import your configured axios instance

import axiosInstance from "@/lib/axios";

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
  follow_up_date: string;
  tag: string;
  created_at?: string;
  updated_at?: string;
}

export const createLead = async (leadData: Omit<Lead, 'id' | 'created_at' | 'updated_at'>): Promise<Lead> => {
  try {
    const response = await axiosInstance.post('/leads', leadData); // Use axiosInstance instead of axios
    console.log("API Response:", response);
    return response.data;
  } catch (error) {
  
    console.error("Unexpected Error:", error);
    throw new Error('Failed to create lead');
  }
};