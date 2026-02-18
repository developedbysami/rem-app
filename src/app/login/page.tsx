"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

export default function LoginForm() {

 const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    console.log("Form Data:", data);
    // call API here
  };


  return (
    <div className="max-w-md w-full space-y-8">
      
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="logo"
            className="h-16 w-auto object-contain"
          />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">
          Welcome back
        </h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
              >
                <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                <rect x="2" y="4" width="20" height="16" rx="2" />
              </svg>

              <input
                id="email"
               {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className={`input w-full pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors.password ? "border-red-500" : "border-gray-300"
      }`}
 />
      {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
        
             
            </div>
          </div>

        
          {/* Password */}
<div>
  <label
    htmlFor="password"
    className="block text-sm font-semibold text-gray-700 mb-2"
  >
    Password <span className="text-red-500">*</span>
  </label>

  <div className="relative">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>

    <input
      id="password"
      type="password"
      autoComplete="current-password"
      placeholder="Enter your password"
      className={`input w-full pl-10 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        errors.password ? "border-red-500" : "border-gray-300"
      }`}
      {...register("password")}
    />
  </div>

  {/* Show password error */}
  {errors.password && (
    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
  )}
</div>


          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember Me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="/forget"
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sign in
            </button>
          </div>

        </form>


{/* button after form */}
        <div className="mt-6">
  <div className="relative">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t border-gray-300"></div>
    </div>

    <div className="relative flex justify-center text-sm">
      <span className="px-3 bg-white text-gray-500 font-medium">
        Or continue with
      </span>
    </div>
  </div>

  <div className="mt-6">
    <Link
      href="/login/method"
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-2">
        
        {/* Mail Icon */}
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-blue-600"
          >
            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
            <rect x="2" y="4" width="20" height="16" rx="2" />
          </svg>
        </div>

        {/* Phone Icon */}
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4 text-emerald-600"
          >
            <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
          </svg>
        </div>
      </div>

      <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700">
        Email or Phone (OTP)
      </span>

      {/* Arrow Icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </Link>
  </div>
</div>


<div className="mt-8 text-center">
  <p className="text-sm text-gray-600">
    New to REM?{" "}
    <Link
      href="/register"
      className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
    >
      Create your account
    </Link>
  </p>
</div>
        
      </div>
    </div>
  );
}
