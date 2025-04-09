"use client";
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Edit, Trash, Eye } from 'lucide-react';
import TableListLoading from '../loading/TableListLoading';

interface SliderItem {
    description: string;
    id: number;
    title: string;
    image_url: string;
    status: string;
    team_type: string;
    created_at: string;
    updated_at: string;
}

const fetchSliders = async (): Promise<SliderItem[]> => {
    try {
        return await apiClient.request<SliderItem[]>('/toper-testimonial-team?type=topper&status=published');
    } catch (error) {
        if ((error as Error).message.includes('Authentication token is required')) {
            throw new Error('Authorization token required. Please log in to view slider data.');
        }
        throw error;
    }
};

const TopperStudentList: React.FC = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['sliders'],
        queryFn: fetchSliders,
        retry: 1,
    });


    if (isLoading) {
        return <TableListLoading />;
    }


    if (isError) {
        const errorMessage = (error as Error).message;
        const isAuthError = errorMessage.includes('Authorization token required') ||
            errorMessage.includes('Authentication token is required');

        return (
            <div className={`p-4 border rounded ${isAuthError ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
                <p className="font-medium">{isAuthError ? 'Authentication Required' : 'Error'}</p>
                <p>{errorMessage}</p>
                {isAuthError && (
                    <button
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => {
                            console.log('Login action triggered');
                        }}
                    >
                        Log In
                    </button>
                )}
            </div>
        );
    }


    if (!data || data.length === 0) {
        return <div className="p-4 text-gray-500">No slider items found.</div>;
    }

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow-sm">
            <h2 className="text-lg font-normal mb-4">Slider Items</h2>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Sn</th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Title</th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Image</th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Description</th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
                            <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Created At</th>
                            <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                <td className="py-4 px-6 text-gray-700  w-[50px]">{index + 1}</td>
                                <td className="py-4 px-6">
                                    <div className="font-medium text-gray-800">{item.title}</div>
                                </td>
                                <td className="py-4 px-6">
                                    <img
                                        src={item.image_url}
                                        alt="img"
                                        className="w-16 h-16 rounded object-cover"
                                    />
                                </td>
                                <td className="py-4 px-6">
                                    <p className='capitalize text-gray-700 text-[13px] w-[200px]'>
                                        {
                                            (() => {
                                                const tempDiv = document.createElement('div');
                                                tempDiv.innerHTML = item.description;
                                                const plainText = tempDiv.textContent || tempDiv.innerText || '';
                                                const shortText = plainText.slice(0, 100);
                                                return shortText;
                                            })()
                                        }
                                    </p>
                                </td>
                                <td className="py-4 px-6">
                                    <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                                        {item.status}
                                    </span>
                                </td>
                                <td className="py-4 px-6 text-gray-700">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </td>
                                <td className="py-3 px-6">
                                    <div className="flex gap-2">
                                        <button className="p-1 text-blue-500 hover:text-blue-700" title="Edit">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-1 text-red-500 hover:text-red-700" title="Delete">
                                            <Trash size={18} />
                                        </button>
                                        <button className="p-1 text-green-500 hover:text-green-700" title="View">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TopperStudentList;