"use client";
import React, { useState } from 'react'
import ViewDetail from './ViewDetail';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { CalendarIcon, SearchIcon, RefreshCwIcon } from "lucide-react"
import NoteList from './NoteList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Action from './Action';
import { Button } from '../ui/button';
// import { Label } from '@radix-ui/react-select';
import Input from '../form/input/InputField';
import Label from '../form/Label';


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



  // Get your auth token (modify this based on how you store your token)
  const token = localStorage.getItem('authToken') || '';

  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("page_size", "10");

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value.trim() !== '') {
      params.append(key, value.trim());
    }
  });

  if (!filters.from_date && !filters.to_date) {
    params.append('from_date', '2024-01-01');
    params.append('to_date', '2029-03-20');
  }

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

const StudentTable = () => {
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilters>>({});
  const [activeFilters, setActiveFilters] = useState<Partial<SearchFilters>>({});
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<LeadsResponse, Error>({
    queryKey: ['leads', page, activeFilters],
    queryFn: () => fetchLeads(page, activeFilters),
  });

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    setActiveFilters(searchFilters);
    setPage(1); // Reset to first page when searching
  };

  const handleReset = () => {
    setSearchFilters({});
    setActiveFilters({});
    setPage(1);
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (data && page < data.meta.total_pages) setPage(page + 1);
  };

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
      queryClient.invalidateQueries({ queryKey: ['leads', page, activeFilters] });
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
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

  const leadSources = ['phone', 'pyysicalVisit', 'website', 'whatsapp'];
  const tags = ['hot', 'warm', 'cold'];


  return (
    <>
      <div className='p-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] mb-6'>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Advanced Search</h3>
          <Button
          className='bg-[#0e54a1] text-white p-5'
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            {showAdvancedSearch ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {showAdvancedSearch && (
          <div className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from_date">From Date</Label>
                <div className="relative">
                  <Input
                    id="from_date"
                    type="date"
                    value={searchFilters.from_date || ''}
                    onChange={(e) => handleFilterChange('from_date', e.target.value)}
                    className="pl-10"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="to_date">To Date</Label>
                <div className="relative">
                  <Input
                    id="to_date"
                    type="date"
                    value={searchFilters.to_date || ''}
                    onChange={(e) => handleFilterChange('to_date', e.target.value)}
                    className="pl-10"
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-1">
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  type="text"
                  placeholder="Enter full name"
                  value={searchFilters.full_name || ''}
                  onChange={(e) => handleFilterChange('full_name', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={searchFilters.email || ''}
                  onChange={(e) => handleFilterChange('email', e.target.value)}
                />
              </div>
              <div className="col-span-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="Enter phone number"
                  value={searchFilters.phone || ''}
                  onChange={(e) => handleFilterChange('phone', e.target.value)}
                />
              </div>
                <div className="col-span-1">
                <Label htmlFor="lead_source">Lead Source</Label>
                <Select
                
                  value={searchFilters.lead_source || undefined}
                  onValueChange={(value) => handleFilterChange('lead_source', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lead source" />
                  </SelectTrigger>
                  <SelectContent>
                 
                    {leadSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source.charAt(0).toUpperCase() + source.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="tag">Lead Priority</Label>
                <Select
                  value={searchFilters.tag || undefined}
                  onValueChange={(value) => handleFilterChange('tag', value === 'all' ? '' : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag" />
                  </SelectTrigger>
                  <SelectContent>
                   
                    {tags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag.charAt(0).toUpperCase() + tag.slice(1).replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-1">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={searchFilters.address || ''}
                  onChange={(e) => handleFilterChange('address', e.target.value)}
                />
              </div>
            </div>

          
            <div className="flex gap-3 pt-2 justify-end">
              <Button onClick={handleSearch} className="flex items-center gap-2 bg-[#0c559f] text-white">
                <SearchIcon className="h-4 w-6" />
                Search
              </Button>
              <Button variant="outline" onClick={handleReset} className="flex items-center gap-2">
                <RefreshCwIcon className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>
        )}
        {Object.keys(activeFilters).length > 0 && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium">Active Filters:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(activeFilters).map(([key, value]) => {
                if (!value) return null;
                return (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-md"
                  >
                    <span className="font-medium">{key.replace('_', ' ')}:</span>
                    <span>{value}</span>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {/* search end  */}

      <div className='p-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] '>

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

export default StudentTable



