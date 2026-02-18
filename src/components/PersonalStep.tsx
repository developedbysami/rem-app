'use client';

import React, { useState, useRef } from 'react';
import { User, Building2, Camera, ChevronDown } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input'
import CountrySelector from './PhoneInputs';
import PhoneInputField from '@/constants/PhoneInputField';

// 1. Define the Validation Schema
const personalSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  referralCode: z.string().optional(),
  userRole: z.enum(['Admin', 'Agent', 'manager', 'director'], {
    errorMap: () => ({ message: 'Please select a valid user role' }),
  }),
});

type PersonalFormData = z.infer<typeof personalSchema>;

export default function PersonalStep({ onNext }) {
  const [accountType, setAccountType] = useState('company');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 2. Initialize Hook Form
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<PersonalFormData>({
    resolver: zodResolver(personalSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      referralCode: '',
      userRole: undefined,
    },
  });

  const onSubmit = (data: PersonalFormData) => {
    // Combine form data with accountType and profileImage for your global state if needed
    console.log('Valid Personal Data:', { ...data, accountType, profileImage });
    onNext();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-5xl mx-auto animate-in fade-in duration-500">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>
        <p className="text-sm text-slate-500 mt-2">
          We need some basic personal information to create your professional CRM profile
        </p>
      </div>

      <div className="space-y-8">
        {/* Account Type Selection */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-4">
            I am signing up as: <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              onClick={() => setAccountType('agent')}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                accountType === 'agent' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center mr-4 text-sky-500">
                <User size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Individual Agent</p>
                <p className="text-xs text-slate-500">I'm a solo real estate agent</p>
              </div>
            </div>

            <div
              onClick={() => setAccountType('company')}
              className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                accountType === 'company' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100 hover:border-slate-200'
              }`}
            >
              <div className="w-10 h-10 bg-white border border-slate-100 rounded-lg flex items-center justify-center mr-4 text-sky-500">
                <Building2 size={20} />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Real Estate Company</p>
                <p className="text-xs text-slate-500">I represent a company or team</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-gray-50 flex items-center justify-center overflow-hidden transition-colors hover:bg-gray-100">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-300" />
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 bg-sky-600 text-white rounded-full p-1.5 border-2 border-white hover:bg-sky-700 transition-all shadow-md active:scale-90"
            >
              <Camera size={14} />
            </button>
            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
          </div>
          <p className="text-sm text-gray-600 mt-2 font-medium">Profile Photo (Optional)</p>
          <p className="text-[10px] text-gray-400 uppercase tracking-wide">PNG, JPG up to 10MB</p>
        </div>

        {/* Name Fields Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">First Name *</label>
            <input
              {...register('firstName')}
              placeholder="e.g., John"
              className={`input p-3 border rounded-lg bg-white outline-none transition-all text-sm ${
                errors.firstName ? 'border-red-500 ring-1 ring-red-50' : 'focus:border-sky-400 border-slate-200'
              }`}
            />
            {errors.firstName && <p className="text-[10px] text-red-500 font-medium pl-1">{errors.firstName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Last Name *</label>
            <input
              {...register('lastName')}
              placeholder="e.g., Smith"
              className={`input p-3 border rounded-lg bg-white outline-none transition-all text-sm ${
                errors.lastName ? 'border-red-500 ring-1 ring-red-50' : 'focus:border-sky-400 border-slate-200'
              }`}
            />
            {errors.lastName && <p className="text-[10px] text-red-500 font-medium pl-1">{errors.lastName.message}</p>}
          </div>
        </div>

{/* <CountrySelector/> */}


        {/* Phone Number Field */}
        {/* <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Phone Number *</label>
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <PhoneInput
                {...field}
                international
                defaultCountry="AE"
                placeholder="Enter phone number"
                className={`flex border rounded-lg bg-white overflow-hidden transition-all ${
                  errors.phoneNumber ? 'border-red-500 ring-1 ring-red-50' : 'focus-within:border-sky-400 border-slate-200'
                }`}
              />
            )}
          />
          {errors.phoneNumber && <p className="text-[10px] text-red-500 font-medium pl-1">{errors.phoneNumber.message}</p>}
        </div> */}

        <PhoneInputField 
  name="phoneNumber" 
  control={control} 
  errors={errors} 
/>





        {/* Referral Code */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Referral Code (Optional)</label>
          <input 
            {...register('referralCode')}
            type="text" 
            placeholder="e.g., REF12345" 
            className="input p-3 border border-slate-200 rounded-lg bg-white outline-none focus:border-sky-400 text-sm transition-all" 
          />
        </div>

        {/* User Role */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">User Role *</label>
          <div className="relative">
            <select
              {...register('userRole')}
              className={`input p-3 border rounded-lg bg-white text-sm outline-none appearance-none transition-all ${
                errors.userRole ? 'border-red-500' : 'border-slate-200 focus:border-sky-400'
              } ${!watch('userRole') ? 'text-slate-400' : 'text-slate-800 font-medium'}`}
            >
              <option value="">Select your role</option>
              <option value="Admin">Admin</option>
              <option value="Agent">Agent</option>
              <option value="manager">Manager</option>
              <option value="director">Director</option>
            </select>
            <ChevronDown size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
          {errors.userRole && <p className="text-[10px] text-red-500 font-medium pl-1">{errors.userRole.message}</p>}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-end mt-12 pt-6 border-t border-slate-100">
        <button
          type="submit"
          className="bg-[#0081C9] hover:bg-[#006da8] text-white px-10 py-2.5 rounded-lg font-bold text-sm flex items-center transition-all active:scale-95 shadow-md shadow-sky-100"
        >
          Next <span className="ml-2 font-black">→</span>
        </button>
      </div>
    </form>
  );
}