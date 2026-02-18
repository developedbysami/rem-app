"use client";
import Link from 'next/link';
import React from 'react';

const ForgotPass = () => {
  return (
    // Main wrapper: Centers everything and provides a light background
    <div className="flex flex-col items-center justify-center min-h-screen">
      
      {/* Container for both Header and Card */}
      <div className="max-w-md w-full space-y-6">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/logo.png"
              alt="logo"
              className="h-12 w-auto object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Check your Email
          </h2>
        
        </div>

        {/* The Card Component */}
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <div className="text-center">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-8 h-8 text-green-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900">
              Reset instructions sent
            </h2>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              If an account with email <span className="font-semibold text-gray-900">s@gmail.com</span> exists, we have sent password reset instructions.
            </p>

            <p className="mt-4 text-xs text-gray-500 italic">
              Check your email (including spam folder) and follow the link to reset your password. The link will expire in 1 hour.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <Link
              href="/login"
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Back to login
            </Link>
            <button
              type="button"
              className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Try different email
            </button>
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default ForgotPass;