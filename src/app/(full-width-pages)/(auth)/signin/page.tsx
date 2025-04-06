
"use client";
import SignInForm from '@/components/auth/SignInForm'; // Your existing sign-in form
import AuthRedirect from '@/components/auth/AuthRedirect';

export default function SignInPage() {
  return (
    <AuthRedirect>
      <SignInForm />
    </AuthRedirect>
  );
}