'use client';

import React, { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react'; // Added professional eye icons

// Define the Zod Schema for final validation
const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CredentialsFormData = z.infer<typeof credentialsSchema>;

export const CredentialsStep = ({ onNext, onPrev }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<CredentialsFormData>({
    resolver: zodResolver(credentialsSchema),
    mode: 'onChange',
  });

  const email = watch('email', '');
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  const validations = useMemo(() => ({
    length: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
    match: password === confirmPassword && password !== '',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }), [password, confirmPassword, email]);

  const requirements = [
    { label: 'At least 6 characters long', met: validations.length },
    { label: 'One uppercase letter (A-Z)', met: validations.uppercase },
    { label: 'One lowercase letter (a-z)', met: validations.lowercase },
    { label: 'One number (0-9)', met: validations.number },
    { label: 'Special characters recommended (!@#$%^&*)', met: validations.special }
  ];

  const onSubmit = (data: CredentialsFormData) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Set Up Your Credentials</h2>
        <p className="text-sm text-gray-500">Create secure login credentials for your REM CRM account</p>
      </div>

      <div className="space-y-6">
        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
          <input 
            {...register('email')}
            type="email" 
            placeholder="e.g., john.smith@acmerealestate.com" 
            className={`w-full p-3 border rounded-lg bg-gray-50 outline-none transition-all ${
              errors.email ? 'border-red-300' : 'focus:border-[#0081C9]'
            }`}
          />
          {errors.email && <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.email.message}</p>}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
          <div className="relative">
            <input 
              {...register('password')}
              type={showPass ? "text" : "password"} 
              placeholder="e.g., MySecure123Pass!" 
              className={`w-full p-3 border rounded-lg bg-gray-50 outline-none pr-10 transition-all ${
                errors.password ? 'border-red-300' : 'focus:border-[#0081C9]'
              }`} 
            />
            <button 
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0081C9] transition-colors"
            >
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-500">Password Requirements:</p>
            {requirements.map((req, i) => (
              <div key={i} className={`flex items-center text-xs transition-colors ${req.met ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-4 h-4 border rounded-full mr-2 flex items-center justify-center transition-all ${
                  req.met ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'
                }`}>
                  {req.met && (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  )}
                </div> 
                {req.label}
              </div>
            ))}
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
          <div className="relative">
            <input 
              {...register('confirmPassword')}
              type={showConfirmPass ? "text" : "password"} 
              placeholder="Re-enter your password" 
              className={`w-full p-3 border rounded-lg bg-gray-50 outline-none transition-all ${
                errors.confirmPassword ? 'border-red-300' : 'focus:border-[#0081C9]'
              }`} 
            />
            <button 
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0081C9] transition-colors"
            >
              {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[10px] text-red-500 mt-1 pl-1">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button 
          type="button"
          onClick={onPrev} 
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors"
        >
          ← Previous
        </button>
        <button 
          type="submit"
          disabled={!isValid}
          className={`px-8 py-2 rounded-lg font-semibold transition-all shadow-md ${
            isValid 
            ? 'bg-[#0081C9] text-white hover:bg-[#006da8] cursor-pointer' 
            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          Next →
        </button>
      </div>
    </form>
  );
};