'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';

const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const CredentialsStep = ({ onNext, onPrev, data }) => {
  const [showPass, setShowPass] = useState(false);
  const { register, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: zodResolver(credentialsSchema),
    mode: 'onChange',
    defaultValues: { email: data.email, password: data.password, confirmPassword: data.password }
  });

  return (
    <form onSubmit={handleSubmit((values) => onNext(values))}>
      <div className="text-center mb-8"><h2 className="text-xl font-bold text-gray-800">Set Up Your Credentials</h2></div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address *</label>
          <input {...register('email')} type="email" className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-blue-500" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Password *</label>
          <div className="relative">
            <input {...register('password')} type={showPass ? "text" : "password"} className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-blue-500" />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3 text-gray-400">
              {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm Password *</label>
          <input {...register('confirmPassword')} type="password" className="w-full p-3 border rounded-lg bg-gray-50 focus:outline-blue-500" />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={onPrev} className="text-gray-500 font-medium">← Previous</button>
        <button type="submit" disabled={!isValid} className={`px-8 py-2 rounded-lg font-semibold ${isValid ? 'bg-[#0081C9] text-white' : 'bg-gray-200 text-gray-400'}`}>Next →</button>
      </div>
    </form>
  );
};