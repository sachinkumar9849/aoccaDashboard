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
    // Skip authentication check for public routes
    const publicRoutes = ['/signin', '/signup', '/reset-password'];
    if (publicRoutes.includes(pathname)) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/signin');
    }
  }, [isAuthenticated, router, pathname]);

  // For public routes or authenticated users, render children
  return <>{children}</>;
}