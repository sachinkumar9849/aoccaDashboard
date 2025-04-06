// src/components/auth/ProtectedRoute.tsx

"use client";
import { useAuth } from '@/context/AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ['/signin', '/signup', '/reset-password'];
    
    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && publicRoutes.includes(pathname)) {
      router.push('/');
      return;
    }
    
    // If user is not authenticated and trying to access protected routes, redirect to signin
    if (!isAuthenticated && !publicRoutes.includes(pathname)) {
      router.push('/signin');
    }
  }, [isAuthenticated, router, pathname]);

  return <>{children}</>;
}