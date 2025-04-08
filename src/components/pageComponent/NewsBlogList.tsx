import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Edit, Trash, Eye } from 'lucide-react';
import { apiClient } from '@/api/client';

// Define TypeScript interfaces
type NewsType = 'news' | 'blogs';
type StatusType = 'published' | 'draft';

interface SEO {
  meta_title: string;
  meta_description: string;
  meta_keywords: string[];
}

interface NewsBlog {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string;
  status: StatusType;
  type: NewsType;
  created_at: string;
  updated_at: string;
  seo: SEO;
}

const NewsBlogList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | NewsType>('all');
  
  // Fetch news-blog data with React Query
  const { data, isLoading, isError, error } = useQuery<NewsBlog[]>({
    queryKey: ['news-blog'],
    queryFn: () => apiClient.request<NewsBlog[]>('/news-blog')
  });
  
  // Format date to a readable string
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: StatusType): string => {
    return status === 'published' 
      ? 'text-green-600 bg-green-100' 
      : 'text-orange-600 bg-orange-100';
  };
  
  // Filter items based on active tab
  const filteredItems = data?.filter(item => 
    activeTab === 'all' || item.type === activeTab
  );

  // Handle loading state
  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-center">
        <div className="py-8">Loading news and blog entries...</div>
      </div>
    );
  }

  // Handle error state
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
      {/* Tab navigation */}
      <div className="flex border-b mb-4">
        <button 
          className={`px-4 py-2 mr-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('all')}
        >
          All
        </button>
        <button 
          className={`px-4 py-2 mr-2 ${activeTab === 'news' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('news')}
        >
          News
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'blogs' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
          onClick={() => setActiveTab('blogs')}
        >
          Blogs
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Type</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Published Date</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {item.image_url ? (
                        <img 
                          src={item.image_url} 
                          alt={item.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                       <img className='blogListImg' src="https://lh5.googleusercontent.com/proxy/t08n2HuxPfw8OpbutGWjekHAgxfPFv-pZZ5_-uTfhEGK8B5Lp-VN4VjrdxKtr8acgJA93S14m9NdELzjafFfy13b68pQ7zzDiAmn4Xg8LvsTw1jogn_7wStYeOx7ojx5h63Gliw" alt="" />
                      )}
                      <div>
                        <p className="font-medium text-gray-800">{item.title}</p>
                      
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="capitalize text-gray-700">{item.type}</span>
                  </td>
                  <td className="py-4 px-6 text-gray-700">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
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
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-500">
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

export default NewsBlogList;