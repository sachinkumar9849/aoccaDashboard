"use client";
// import React from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { apiClient } from '@/api/client';
// import { Edit, Trash, Eye } from 'lucide-react';
// import TableListLoading from '../loading/TableListLoading';

// interface SliderItem {
//     description: string;
//     id: number;
//     title: string;
//     image_url: string;
//     status: string;
//     team_type: string;
//     created_at: string;
//     updated_at: string;
//     name: string;
// }

// const fetchSliders = async (): Promise<SliderItem[]> => {
//     try {
//         return await apiClient.request<SliderItem[]>('/news-blog?type=blogs&status=published');
//     } catch (error) {
//         if ((error as Error).message.includes('Authentication token is required')) {
//             throw new Error('Authorization token required. Please log in to view slider data.');
//         }
//         throw error;
//     }
// };

// const BlogList: React.FC = () => {
//     const { data, isLoading, isError, error } = useQuery({
//         queryKey: ['sliders'],
//         queryFn: fetchSliders,
//         retry: 1,
//     });


//     if (isLoading) {
//         return <TableListLoading />;
//     }


//     if (isError) {
//         const errorMessage = (error as Error).message;
//         const isAuthError = errorMessage.includes('Authorization token required') ||
//             errorMessage.includes('Authentication token is required');

//         return (
//             <div className={`p-4 border rounded ${isAuthError ? 'bg-yellow-100 border-yellow-400 text-yellow-700' : 'bg-red-100 border-red-400 text-red-700'}`}>
//                 <p className="font-medium">{isAuthError ? 'Authentication Required' : 'Error'}</p>
//                 <p>{errorMessage}</p>
//                 {isAuthError && (
//                     <button
//                         className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
//                         onClick={() => {
//                             console.log('Login action triggered');
//                         }}
//                     >
//                         Log In
//                     </button>
//                 )}
//             </div>
//         );
//     }


//     if (!data || data.length === 0) {
//         return <div className="p-4 text-gray-500">No topper studne items found.</div>;
//     }

//     return (
//         <div className="w-full p-4 bg-white rounded-lg shadow-sm">
//             <h2 className="text-lg font-normal mb-4">Testimonial</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full">
//                     <thead>
//                         <tr className="border-b">
//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Sn</th>
//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Title</th>

//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Image</th>
//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Description</th>
//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
//                             <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Created At</th>
//                             <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {data.map((item, index) => (
//                             <tr key={item.id} className="border-b hover:bg-gray-50">
//                                 <td className="py-4 px-6 text-gray-700  w-[50px]">{index + 1}</td>
//                                 <td className="py-4 px-6">
//                                     <div className="font-medium text-gray-800">{item.title}</div>
//                                 </td>

//                                 <td className="py-4 px-6">
//                                     <img
//                                         src={item.image_url}
//                                         alt="img"
//                                         className="w-16 h-16 rounded object-cover"
//                                     />
//                                 </td>
//                                 <td className="py-4 px-6">
//                                     <p className='capitalize text-gray-700 text-[13px] w-[200px]'>
//                                         {
//                                             (() => {
//                                                 const tempDiv = document.createElement('div');
//                                                 tempDiv.innerHTML = item.description;
//                                                 const plainText = tempDiv.textContent || tempDiv.innerText || '';
//                                                 const shortText = plainText.slice(0, 100);
//                                                 return shortText;
//                                             })()
//                                         }
//                                     </p>
//                                 </td>
//                                 <td className="py-4 px-6">
//                                     <span className="inline-block px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
//                                         {item.status}
//                                     </span>
//                                 </td>
//                                 <td className="py-4 px-6 text-gray-700">
//                                     {new Date(item.created_at).toLocaleDateString()}
//                                 </td>
//                                 <td className="py-3 px-6">
//                                     <div className="flex gap-2">
//                                         <button className="p-1 text-blue-500 hover:text-blue-700" title="Edit">
//                                             <Edit size={18} />
//                                         </button>
//                                         <button className="p-1 text-red-500 hover:text-red-700" title="Delete">
//                                             <Trash size={18} />
//                                         </button>
//                                         <button className="p-1 text-green-500 hover:text-green-700" title="View">
//                                             <Eye size={18} />
//                                         </button>
//                                     </div>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default BlogList;


import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash, Eye } from 'lucide-react';
import { apiClient } from '@/api/client';
import Link from 'next/link';
import DeleteConfirmationDialog from '../common/DeleteConfirmationDialog';

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
  const [activeTab] = useState<'all' | NewsType>('all');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();


  const { data, isLoading, isError, error } = useQuery<NewsBlog[]>({
    queryKey: ['blog-list'],
    queryFn: () => apiClient.request<NewsBlog[]>('/news-blog?type=blogs')
  });

  // delete function 


  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiClient.request(`/news-blog/${id}`, {
        method: 'DELETE'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-list'] });

    }
  });

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      deleteMutation.mutate(itemToDelete);
    }
    setIsDeleteDialogOpen(false);
  };
  const handleCloseDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: StatusType): string => {
    return status === 'published'
      ? 'text-green-600 bg-green-100'
      : 'text-orange-600 bg-orange-100';
  };

  const filteredItems = data?.filter(item =>
    activeTab === 'all' || item.type === activeTab
  );

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-white rounded-lg shadow-sm flex justify-center">
        <div className="py-8">Loading news and blog entries...</div>
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
      <h2 className="text-lg font-normal mb-4">Blog List</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Title</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Description</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Published Date</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-3 px-6 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems && filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-6 w-[300px]">
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
                  <td className="py-3 px-6 w-[200px]">
                    <p className='capitalize text-gray-700 text-[13px]'>
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
                  <td className="py-3 px-6 text-gray-700">
                    {formatDate(item.created_at)}
                  </td>
                  <td className="py-3 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-6">
                    <div className="flex gap-2">
                      <Link href={`/blog-list/${item.id}`} className="p-1 text-blue-500 hover:text-blue-700" title="Edit">
                        <Edit size={18} />
                      </Link>
                      <button
                        className="p-1 text-red-500 hover:text-red-700"
                        title="Delete"
                        onClick={() => handleDeleteClick(item.id)}
                      >
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
      <DeleteConfirmationDialog isOpen={isDeleteDialogOpen} onClose={handleCloseDeleteDialog} onConfirm={handleConfirmDelete} />
    </div>
  );
};

export default NewsBlogList;