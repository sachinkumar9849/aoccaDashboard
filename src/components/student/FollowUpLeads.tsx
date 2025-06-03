"use client";
import React, { useState } from 'react';
import ViewDetail from './ViewDetail';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import NoteList from './NoteList';
import Action from './Action';
import { Button } from '../ui/button';
import Label from '../form/Label';
import DatePicker from '../crm/DatePickerDemo';


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

interface SearchFilters {
  from_date: string;
  to_date: string;
  email: string;
  phone: string;
  full_name: string;
  lead_source: string;
  tag: string;
  address: string;
}

const fetchLeads = async (page: number = 1, filters: Partial<SearchFilters> = {}): Promise<LeadsResponse> => {
  const token = localStorage.getItem('authToken') || '';

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("page_size", "10");
  params.append("status", "followUp");

  params.append("from_date", filters.from_date || '2020-01-30');
  params.append("to_date", filters.to_date || new Date().toISOString().split('T')[0]);

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '' && key !== 'from_date' && key !== 'to_date') {
      params.append(key, value.trim());
    }
  });

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_URL}/leads?${params.toString()}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};



const FollowUpLeads = () => {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>({
    from_date: '2020-01-30',
    to_date: new Date().toISOString().split('T')[0]
  });
  const [activeFilters, setActiveFilters] = useState<Partial<SearchFilters>>({
    from_date: '2020-01-30',
    to_date: new Date().toISOString().split('T')[0]
  });



  const { data, isLoading, isError, error } = useQuery<LeadsResponse, Error>({
    queryKey: ['followUpList', page, activeFilters],
    queryFn: () => fetchLeads(page, activeFilters),
  });







  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (data && page < data.meta.total_pages) setPage(page + 1);
  };



  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading leads...</span>
    </div>;
  }

  if (isError) {
    return <div className="text-red-600 p-4">Error: {error?.message}</div>;
  }


  const handleDateChange = (field: keyof SearchFilters, date: string | Date | null) => {
    let dateString = '';

    // Handle different date formats
    if (date) {
      if (typeof date === 'string') {
        dateString = date;
      } else if (date instanceof Date) {
        dateString = date.toISOString().split('T')[0];
      }
    }

    const newFilters = {
      ...searchFilters,
      [field]: dateString
    };

    setSearchFilters(newFilters);
    setActiveFilters(newFilters);
    setPage(1);
  };

  return (
    <>


      <div className='p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] '>

        <div className="grid grid-cols-2 items-center">
          <div className="col-span-1">
            <h3 className="text-base font-medium text-gray-800 dark:text-white/90">Leads</h3>
          </div>

          <div className="col-span-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1">
                <Label htmlFor="from_date">From Date</Label>
                <div className="relative">
                  <DatePicker
                    value={searchFilters.from_date || '2020-01-30'}
                    onChange={(date) => handleDateChange('from_date', date)}
                    className=""
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <Label htmlFor="to_date">To Date</Label>
                <div className="relative">
                  <DatePicker
                    value={searchFilters.to_date || new Date().toISOString().split('T')[0]}
                    onChange={(date) => handleDateChange('to_date', date)}
                    className=""
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>
            </div>
          </div>


        </div>

        <div className="relative overflow-x-auto mb-5 mt-4" >
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
                  <td className="px-6 py-4 capitalize">{lead.status}</td>



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
                        status: lead.status,
                        lead_source: lead.lead_source,
                        inquiry: lead.inquiry,
                        amount: lead.amount,
                        current_status: lead.status,
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
          {/* Pagination */}
          {data && data.meta.total_pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={page <= 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Page {page} of {data.meta.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={page >= data.meta.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      </div>
    </>
  )
}

export default FollowUpLeads



