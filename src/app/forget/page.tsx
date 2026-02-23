"use client"

import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { apiRequest } from '@/apis/apis';

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    setServerError("");
    try {
      // ── API Call to Backend ──
     const response = await apiRequest('POST', '/password/forgot', {
      email: data.email,
    });


      if (response.success) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="logo"
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {isSuccess ? "Check your email" : "Forgot your password?"}
          </h2>
          <p className="text-gray-600 mt-2">
            {isSuccess 
              ? "If an account exists for that email, we've sent password reset instructions." 
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {!isSuccess ? (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
              {serverError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200">
                  {serverError}
                </div>
              )}

              {/* Email Input Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address"
                      }
                    })}
                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                      errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 shadow-md"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : "Send reset instructions"}
              </button>
            </form>
          ) : (
            /* Success State Button */
            <button 
              onClick={() => setIsSuccess(false)}
              className="w-full py-2.5 px-4 bg-gray-100 text-gray-700 rounded-md font-semibold hover:bg-gray-200 transition-colors"
            >
              Didn't receive it? Try again
            </button>
          )}

          <div className='text-center mt-6 pt-4 border-t border-gray-100'>
            <Link href={'/login'} className='text-blue-600 font-semibold hover:text-blue-700'>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;