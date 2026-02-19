'use client';

import React, { useState, useRef } from 'react';
import { User, Building2, Camera, FileText, Ticket, Upload } from 'lucide-react'; // Added Ticket icon
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInputField from '@/constants/PhoneInputField';

// Schema remains the same (referralCode is already optional here)
const personalSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  phoneNumber: z.string().min(10, 'Valid phone number required'),
  referralCode: z.string().optional(),
  userRole: z.enum(['admin', 'agent', 'manager', 'director'], {
    errorMap: () => ({ message: 'Please select a valid user role' }),
  }),
});

export default function PersonalStep({ onNext, data }) {
  const [accountType, setAccountType] = useState(data.accountType || 'company');
  const [profileImage, setProfileImage] = useState(data.profileImage);
  const [certificate, setCertificate] = useState(data.certificate);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(personalSchema),
    mode: 'onChange',
    defaultValues: {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      referralCode: data.referralCode,
      userRole: data.userRole,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isProfile) setProfileImage(reader.result as string);
        else setCertificate({ name: file.name, data: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (formData: any) => {
    onNext({ ...formData, accountType, profileImage, certificate });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>
      </div>

      {/* Account Type Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div onClick={() => setAccountType('agent')} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${accountType === 'agent' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100'}`}>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-sky-500 border border-slate-100"><User size={20} /></div>
          <div><p className="font-bold text-slate-800 text-sm">Individual Agent</p></div>
        </div>

        <div onClick={() => setAccountType('company')} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${accountType === 'company' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100'}`}>
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-sky-500 border border-slate-100"><Building2 size={20} /></div>
          <div><p className="font-bold text-slate-800 text-sm">Real Estate Company</p></div>
        </div>
      </div>

      {/* Profile Pic */}
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24 rounded-full border-2 border-dashed bg-gray-50 flex items-center justify-center overflow-hidden">
          {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-300" />}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-sky-600 text-white rounded-full p-1.5"><Camera size={14} /></button>
        </div>
        <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileChange(e, true)} />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">First Name 
            <span className='inline-block ml-1 text-red-500'>*</span>
          </label>
          <input {...register('firstName')} className="input w-full p-3 border rounded-lg focus:border-sky-400 outline-none transition-all" placeholder="First Name" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message?.toString()}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Last Name 
            <span className='inline-block ml-1 text-red-500'>*</span>
          </label>
          <input {...register('lastName')} className="input w-full p-3 border rounded-lg focus:border-sky-400 outline-none transition-all" placeholder="Last Name" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message?.toString()}</p>}
        </div>
      </div>

      {/* Phone Input */}
      <PhoneInputField name="phoneNumber" control={control} errors={errors} />

      {/* --- NEW: Referral Code Input --- */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold flex items-center gap-2">
          Referral Code <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
        <div className="relative">
         
          <input 
            {...register('referralCode')} 
            className="input w-full p-3 border rounded-lg focus:border-sky-400 outline-none transition-all" 
            placeholder="Referral code (optional)" 
          />
        </div>
      </div>

      {/* User Role */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">User Role 
          <span className='inline-block ml-1 text-red-500'>*</span>
        </label>
        <select {...register('userRole')} className="input w-full p-3 border rounded-lg focus:border-sky-400 outline-none bg-white">
          <option value="">Select your role</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="director">Director</option>
        </select>
        {errors.userRole && <p className="text-red-500 text-xs mt-1">{errors.userRole.message?.toString()}</p>}
      </div>

      {/* Certificate Upload for Agents */}
     {accountType === 'agent' && (  <label className="text-sm font-semibold flex items-center gap-2">
          Pera Certificate <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
     )
     }
     {accountType === 'agent' && (
  <div className="space-y-2">
    <label className="text-sm font-semibold">RERA Certificate (Optional)</label>
    <div 
      onClick={() => certInputRef.current?.click()} 
      className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 hover:border-[#0081C9] transition-all group"
    >
      {/* Upload Icon */}
      <div className="mb-4 text-gray-400 group-hover:text-[#0081C9] transition-colors">
        <Upload size={40} strokeWidth={1.5} />
      </div>

      {/* Main Text */}
      <div className="text-sm md:text-base text-center">
        <span className="text-[#0081C9] font-semibold hover:underline">
          {certificate ? "Change certificate" : "Click to upload"}
        </span>
        <span className="text-gray-600"> or drag and drop</span>
      </div>

      {/* File Info / Constraints */}
      <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide text-center">
        {certificate ? (
          <span className="text-green-600 font-medium normal-case">
            Selected: {certificate.name}
          </span>
        ) : (
          "PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)"
        )}
      </div>

      {/* Hidden Input - Logic kept from your original */}
      <input 
        type="file" 
        ref={certInputRef} 
        className="hidden" 
        onChange={(e) => handleFileChange(e, false)} 
        accept=".pdf,.doc,.docx,.jpg,.png"
      />
    </div>
  </div>
)}

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button type="submit" className="bg-[#0081C9] hover:bg-[#006da8] text-white px-10 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95">
          Next →
        </button>
      </div>
    </form>
  );
}