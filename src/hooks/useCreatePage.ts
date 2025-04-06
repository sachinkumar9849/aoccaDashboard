// src/hooks/useCreatePage.ts

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { PageFormValues, PageResponse, ApiErrorResponse } from '@/types';
import { createPage } from '@/api/pageAbout';
// import { createPage } from '@/api/pageService';

interface UseCreatePageOptions {
  onError?: (error: ApiErrorResponse) => void;
  onSuccess?: (data: PageResponse) => void;
}

export const useCreatePage = (options?: UseCreatePageOptions) => {
  return useMutation<PageResponse, { data?: ApiErrorResponse }, PageFormValues>({
    mutationFn: createPage,
    onSuccess: (data) => {
      toast.dismiss();
      toast.success(data.message || 'Page created successfully!');
      
      if (options?.onSuccess) {
        options.onSuccess(data);
      }
    },
    onError: (error) => {
      toast.dismiss();
      
      if (error.data && Object.keys(error.data).length > 0) {
        const firstErrorKey = Object.keys(error.data)[0];
        const errorMessage = error.data[firstErrorKey];
        toast.error(errorMessage || 'Failed to create page');
        
        if (options?.onError) {
          options.onError(error.data);
        }
      } else {
        toast.error('Failed to create page. Please try again.');
      }
    }
  });
};