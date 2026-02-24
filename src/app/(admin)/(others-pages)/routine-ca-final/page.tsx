"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Eye } from 'lucide-react';
import { apiClient } from '@/api/client';
import Link from 'next/link';
import Button from '@/components/ui/button/Button';


interface NewsBlog {
  id: string; // Changed from number to string to match API response
  session: string; // Added session field from API
  total_student: number; // Added total_student field from API
  title?: string; // Made optional since API doesn't return this
  slug?: string; // Made optional since API doesn't return this
  description?: string; // Made optional since API doesn't return this
  image_url?: string; // Made optional since API doesn't return this
  status: boolean; // Changed to boolean to match API response
  type: string; // Changed to string to match API response
  created_at: string;
  updated_at: string;
  deleted_at: string | null; // Added deleted_at from API

  sort_order?: number; // Made optional since API doesn't return this
}

// API Response interface
interface ApiResponse {
  data: NewsBlog[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

const CaFoundationList: React.FC = () => {


  const { data, isLoading, isError, error } = useQuery<NewsBlog[]>({
    queryKey: ['routine-ca-final-list'],
    queryFn: async () => {
      const response = await apiClient.request<ApiResponse>('/classes?type=CA-Final');
      console.log("sachin", response)
      return response.data;
    }
  });


  const getStatusBadge = (status: boolean): string => { // Changed to boolean
    return status
      ? 'text-green-600 bg-green-100'
      : 'text-orange-600 bg-orange-100';
  };


  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-center">
        <div className="py-8">Loading CA Foundation entries...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm">
        <div className="text-red-500">
          Error loading data: {(error as Error).message}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-normal mb-4">CA Final routine list</h2>
        <Link href="/ca-final-routine">
          <Button>Add</Button>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Session</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Total Student</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.length > 0 ? (
              data.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 w-[300px]">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-800">{item.session}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 w-[300px]">
                    <p className='capitalize text-gray-700 text-[13px]'>
                      {item.total_student}
                    </p>
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(item.status)}`}>
                      {item.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      <Link href={`/routine-ca-final/${item.id}`} className="p-1 text-blue-500 hover:text-blue-700" title="Edit">
                        <Edit size={18} />
                      </Link>

                      <button className="p-1 text-green-500 hover:text-green-700" title="View">
                        <Eye size={18} />
                      </button>
                      <Link
                        style={{ lineHeight: "13px" }}
                        href={`/student-class?session=${item.session}&type=${item.type}&classId=${item.id}`}
                        className="bg-[#0d57a0] text-white rounded-md px-3 h-[21px] leading-[21px]  p-1 text-black hover:text-black text-[13px] btnClass"
                        title="View"
                      >
                        Go To Class
                      </Link>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


    </div>
  );
};

export default CaFoundationList;