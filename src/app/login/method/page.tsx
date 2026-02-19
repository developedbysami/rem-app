import { ArrowRight, Mail, Phone, Key } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Page = () => {
  return (
    <div className="w-full mt-10 flex flex-col items-center min-h-screen">
      
      {/* Container for Header and Cards */}
      <div className="max-w-lg w-full space-y-6 px-4">
        
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
            Welcome Back
          </h2>
          <p className="mt-4 text-xs text-gray-500 italic">
            Choose how you'd like to sign in
          </p>
        </div>

        {/* --- Card 1: Email OTP --- */}
        <Link 
          href="/login/otp?method=email" 
          className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-between hover:border-blue-200 transition-all cursor-pointer group hover:shadow-md block"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:scale-105 transition-transform">
              <Mail size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 leading-snug">Email</h3>
              <p className="text-sm text-slate-500 font-medium">
                Sign in with email and verification code
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </Link>

        {/* --- Card 2: Phone OTP --- */}
        <Link 
          href="/login/otp?method=phone" 
          className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-between hover:border-green-200 transition-all cursor-pointer group hover:shadow-lg block"
        >
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform">
              <Phone size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 leading-snug">Phone Number</h3>
              <p className="text-sm text-slate-500 font-medium">
                Sign in with Phone number and verification code
              </p>
            </div>
          </div>
          <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors">
            <ArrowRight size={20} strokeWidth={2.5} />
          </div>
        </Link>

        {/* --- Separator "or" --- */}
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-3 text-sm text-gray-500 font-medium">or</span>
          </div>
        </div>

        {/* --- Card 3: Password Sign In --- */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border-2 border-gray-100 flex items-center justify-between group">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center text-slate-600">
              <Key size={24} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900 leading-snug">Sign in with password</h3>
              <p className="text-sm text-slate-500 font-medium">
                Use your email and password
              </p>
            </div>
          </div>
          <Link 
            href="/login" 
            className="text-[#0081C9] font-bold text-lg hover:underline transition-all"
          >
            Sign in
          </Link>
        </div>

        {/* Footer: Create Account */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#0081C9] font-bold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page