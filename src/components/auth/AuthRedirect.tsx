
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthRedirectProps {
  children: React.ReactNode;
}

export default function AuthRedirect({ children }: AuthRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    // Check if authToken exists in localStorage
    const authToken = localStorage.getItem("authToken");
    
    // If token exists, redirect to dashboard
    if (authToken) {
      router.push("/");
    }
  }, [router]);

  // Render children (sign-in or sign-up form) only if no auth token
  return <>{children}</>;
}