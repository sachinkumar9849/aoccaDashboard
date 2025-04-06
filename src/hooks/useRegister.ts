import { useMutation } from '@tanstack/react-query';
// import { ApiErrorResponse, registerUser } from '../api/auth';
// import { UserRegistrationValues, ApiErrorResponse } from '../types';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { ApiErrorResponse, ApiResponse, UserRegistrationValues } from '@/types';
import { registerUser } from '@/api/auth';

interface UseRegisterOptions {
  onError?: (error: ApiErrorResponse) => void;
}

export const useRegister = (options?: UseRegisterOptions) => {
  const router = useRouter();
  
  return useMutation<ApiResponse, { data?: ApiErrorResponse }, UserRegistrationValues>({
    mutationFn: registerUser,
    onSuccess: (data) => {
      toast.dismiss(); 
      toast.success(data.message || 'Registration successful!');
      router.push('/signin');
    },
    onError: (error) => {
      toast.dismiss(); 
      
      if (error.data && Object.keys(error.data).length > 0) {
        const firstErrorKey = Object.keys(error.data)[0];
        const errorMessage = error.data[firstErrorKey];
        toast.error(errorMessage || 'Registration failed');
        
        if (options?.onError) {
          options.onError(error.data);
        }
      } else {
        toast.error('Registration failed. Please try again.');
      }
    }
  });
};