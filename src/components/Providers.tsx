// src/app/providers.tsx

"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthProvider';
import { ReactNode, useState } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // ✅ Always refetch when invalidated
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ProtectedRoute>
          {children}
        </ProtectedRoute>
      </AuthProvider>
      <Toaster position="top-right" />

    </QueryClientProvider>
  );
}