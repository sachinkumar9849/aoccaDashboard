"use client";
import { useFormik } from 'formik';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from 'react';
import { useRegister } from '@/hooks/useRegister';
import { registerSchema } from '@/validation/authSchema';
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { ApiErrorResponse, UserRegistrationValues } from '@/types';

export default function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<ApiErrorResponse>({});

  const { mutate: register, isPending } = useRegister({
    onError: (errors: ApiErrorResponse) => {
      setFieldErrors(errors);
      Object.keys(errors).forEach(key => {
        formik.setFieldError(key, errors[key]);
      });
    }
  });

  const formik = useFormik<UserRegistrationValues>({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      user_type: 'student'
    },
    validationSchema: registerSchema,
    onSubmit: (values) => {
      setFieldErrors({});
      toast.loading("Creating your account...");
      register(values);
    },
  });

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign Up
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign up!
            </p>
          </div>
          <div>
            <form onSubmit={formik.handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <Label>
                      First Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="first_name"
                      name="first_name"
                      placeholder="Enter your first name"
                      value={formik.values.first_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.first_name && formik.errors.first_name && (
                      <p className="mt-1 text-sm text-error-500">{formik.errors.first_name}</p>
                    )}
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      Last Name<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="text"
                      id="last_name"
                      name="last_name"
                      placeholder="Enter your last name"
                      value={formik.values.last_name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.last_name && formik.errors.last_name && (
                      <p className="mt-1 text-sm text-error-500">{formik.errors.last_name}</p>
                    )}
                  </div>
                  <div className="sm:col-span-1">
                    <Label>
                      Email<span className="text-error-500">*</span>
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={fieldErrors.email ? "border-error-500" : ""}
                    />
                    {(formik.touched.email && formik.errors.email) || fieldErrors.email ? (
                      <p className="mt-1 text-sm text-error-500">
                        {fieldErrors.email || formik.errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="sm:col-span-1">
                    <Label>
                      User Type<span className="text-error-500">*</span>
                    </Label>
                    <Select
                      name="user_type"
                      value={formik.values.user_type}
                      onValueChange={(value) => formik.setFieldValue('user_type', value)}
                    >
                      <SelectTrigger className="w-full" style={{ height: "42px" }}>
                        <SelectValue placeholder="Select user type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white z-10 w-full">
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    {formik.touched.user_type && formik.errors.user_type && (
                      <p className="mt-1 text-sm text-error-500">{formik.errors.user_type}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label>
                    Password<span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-error-500">{formik.errors.password}</p>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white transition rounded-lg bg-brand-500 shadow-theme-xs hover:bg-brand-600"
                    disabled={isPending || !formik.isValid}
                  >
                    {isPending ? "Please wait..." : "Sign Up"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Already have an account?
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}