"use client";
import React from 'react'
import Note from './Note'
import ViewDetail from './ViewDetail';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import NoteList from './NoteList';

// types/lead.ts
export interface Lead {
  id: string;
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
  created_at: string;
  updated_at: string;
}

export interface LeadsResponse {
  data: Lead[];
  meta: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
}

const fetchLeads = async (page: number = 1): Promise<LeadsResponse> => {
  const fromDate = '2024-01-01';
  const toDate = '2029-03-20';

  // Get your auth token (modify this based on how you store your token)
  const token = localStorage.getItem('authToken') || '';

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/leads?from_date=${fromDate}&to_date=${toDate}&page=${page}&page_size=10`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

const StudentTable = () => {
  const [page, setPage] = React.useState(1);

  const { data, isLoading, isError, error } = useQuery<LeadsResponse, Error>({
    queryKey: ['leads', page],
    queryFn: () => fetchLeads(page),

  });

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (data && page < data.meta.total_pages) setPage(page + 1);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div>
      <div className="relative overflow-x-auto mb-5" >
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                S.N
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Full Name
              </th>
              <th scope="col" className="px-6 py-3">
                Phone number
              </th>
              <th scope="col" className="px-6 py-3">
                Current Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((lead, index) => (
              <tr
                key={lead.id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4">{(page - 1) * 10 + index + 1}</td>
                <td className="px-6 py-4">
                  {new Date(lead.created_at).toLocaleDateString()}
                </td>
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {lead.full_name}
                </th>
                <td className="px-6 py-4">{lead.phone}</td>
                <td className="px-6 py-4">
                  <select
                    id={`status-${lead.id}`}
                    defaultValue={lead.current_status}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                  </select>
                </td>
                <td className="flex items-center px-6 py-4 space-x-3">
                  <Note />
                  <ViewDetail
                    leadId={lead.id}
                    leadData={{
                      id: lead.id,
                      full_name: lead.full_name,
                      phone: lead.phone,
                      email: lead.email,
                      address: lead.address,
                      previous_qualification: lead.previous_qualification,
                      current_status: lead.current_status,
                      lead_source: lead.lead_source,
                      inquiry: lead.inquiry,
                      amount: lead.amount,
                      status: lead.status,
                      follow_up_date: lead.follow_up_date,
                      tag: lead.tag,
                      created_at: lead.created_at,
                      updated_at: lead.updated_at
                    }}
                  />
                  <NoteList leadId={lead.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <>
        <nav
          aria-label="Page navigation example mt-5 mx-auto d-flex justify-center"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <button
                onClick={handlePrevious}
                disabled={page === 1}
                className={`flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Previous
              </button>
            </li>

            <li>
              <div className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                Page {page} of {data?.meta.total_pages || 1}
              </div>
            </li>
            <li>
              <button
                onClick={handleNext}
                disabled={page === data?.meta.total_pages}
                className={`flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${page === data?.meta.total_pages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </>
    </div>
  )
}

export default StudentTable