"use client";
import React from 'react'
import ViewDetail from './ViewDetail';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NoteList from './NoteList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Action from './Action';


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
  const queryClient = useQueryClient();
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

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    const token = localStorage.getItem('authToken') || '';
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_URL}/leads/${leadId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      queryClient.invalidateQueries({ queryKey: ['leads', page] });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  return (
    <div className='p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] '>
        <div className="hidden lg:block mb-4 ">
          <div className="flex justify-between">
              <p className='text-base font-medium text-gray-800 dark:text-white/90'>Leads</p>
            <form>
              <div className="relative">
                <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                      fill=""
                    />
                  </svg>
                </span>
                <input
                
                  type="text"
                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
                />

                {/* <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span> ⌘ </span>
                  <span> K </span>
                </button> */}
              </div>
            </form>
          
          </div>
          </div>
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
                  <Select
                    value={lead.status}
                    onValueChange={(value) => updateLeadStatus(lead.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={lead.status || "Select status"} />
                    </SelectTrigger>
                    <SelectContent className='bg-white'>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="watingForResult">Waiting for result</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="flex items-center px-6 py-4 space-x-3">
                 <Action lead={lead} />
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



// leads?from_date=2025-05-29&to_date=2025-05-29&email=kapil.tandukar@gmail.com&phone=9851053405&tag=warm&full_name=kapil&address=putalisadak&lead_source=phone&page=1&page_size=5