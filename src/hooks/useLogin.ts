import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ApiErrorResponse, LoginValues, User } from "@/types";
import { loginUser } from "@/api/auth";


interface UseLoginOptions {
  onError?: (error: ApiErrorResponse) => void;
  onSuccess?: (data: User) => void;
}

export const useLogin = (options?: UseLoginOptions) => {
  const router = useRouter();

  return useMutation<User, { data?: ApiErrorResponse }, LoginValues>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.dismiss();
      toast.success('Login successful!');

      localStorage.setItem("authToken", data.token);
      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        user_type: data.user_type
      }));
      if (options?.onSuccess) {
        options.onSuccess(data);
      } else {
        router.push("/")
      }
    },
    onError: (error) => {
      toast.dismiss();

      if (error.data && Object.keys(error.data).length > 0) {
        const firstErrorKey = Object.keys(error.data)[0];
        const errorMessage = error.data[firstErrorKey];
        toast.error(errorMessage || 'Login failed');

        if (options?.onError) {
          options.onError(error.data);
        }
      } else {
        toast.error('Login failed. Please check your credentials and try again.');
      }
    }
  });
};