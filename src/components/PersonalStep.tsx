'use client';

import React, { useState, useRef } from 'react';
import { User, Building2, Camera, Upload, X, CheckCircle2, FileImage } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInputField from '@/constants/PhoneInputField';

const personalSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  // use .catch("") or .default("") if you want to be extra safe
  phoneNumber: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Phone number must be a string",
  }).min(10, 'Valid phone number required'),
  referralCode: z.string().optional(),
  userRole: z.enum(['admin', 'agent', 'manager', 'director'], {
    errorMap: () => ({ message: 'Please select a valid user role' }),
  }),
});

export default function PersonalStep({ onNext, data, onAccountTypeChange }) {
  const [profileImage, setProfileImage] = useState(data.profileImage);
  const [certificate, setCertificate] = useState(data.certificate);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const certInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control, formState: { errors } } = useForm({
  resolver: zodResolver(personalSchema),
  mode: 'onChange',
  defaultValues: {
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    phoneNumber: data.phoneNumber || "", // Ensure this is never undefined
    referalCode: data.referralCode || "",
    userRole: data.userRole || "",
  },
});



  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isProfile) setProfileImage(reader.result as string);
        else setCertificate({ name: file.name, size: file.size, data: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (formData: any) => {
    onNext({ ...formData, profileImage, certificate });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-slate-800">Tell us about yourself</h2>
      </div>

      {/* Account Type Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => onAccountTypeChange('agent')} 
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${data.accountType === 'agent' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100'}`}
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-sky-500 border border-slate-100"><User size={20} /></div>
          <div>
            <h1 className="font-bold text-slate-800 text-md">Individual Agent</h1>
            <p className='text-sm text-gray-500'>I'm a solo real estate agent</p>
          </div>
        </div>

        <div 
          onClick={() => onAccountTypeChange('company')} 
          className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${data.accountType === 'company' ? 'border-sky-400 bg-sky-50 shadow-sm' : 'border-slate-100'}`}
        >
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mr-4 text-sky-500 border border-slate-100"><Building2 size={20} /></div>
          <div>
            <h1 className="font-bold text-slate-800 text-base">Real Estate Company</h1>
            <p className='text-sm text-gray-500'>I represent a company or team</p>
          </div>
        </div>
      </div>

      {/* Profile Pic */}
     <div className="flex flex-col items-center">
       <div className='relative group'>
         <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-gray-300 group-hover:border-gray-400 bg-gray-100 flex items-center justify-center overflow-hidden">
          {profileImage ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" /> : <User size={40} className="text-slate-300" />}
        </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-sky-600 text-white rounded-full p-1.5"><Camera size={14} /></button>
       </div>
        <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileChange(e, true)} />
        <p className='text-sm text-gray-600'>Profile Photo (Optional)</p>
        <span className='text-xs text-gray-500'>PNG, JPG only up to 10MB. Professional headshot recommended.</span>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">First Name <span className='text-red-500'>*</span></label>
          <input {...register('firstName')} className="input p-3 border rounded-lg focus:border-sky-400 outline-none" placeholder="First Name" />
          {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message?.toString()}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Last Name <span className='text-red-500'>*</span></label>
          <input {...register('lastName')} className="input p-3 border rounded-lg focus:border-sky-400 outline-none" placeholder="Last Name" />
          {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message?.toString()}</p>}
        </div>
      </div>

      {/* Phone Input */}
      <PhoneInputField name="phoneNumber" control={control} errors={errors} />
      

      {/* Referral Code */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">Referral Code <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
        <input {...register('referralCode')} className="input p-3 border rounded-lg focus:border-sky-400 outline-none" placeholder="Referral code" />
      </div>

      {/* User Role */}
      <div className="space-y-1.5">
        <label className="text-sm font-semibold">User Role <span className='text-red-500'>*</span></label>
        <select {...register('userRole')} className="input p-3 border rounded-lg focus:border-sky-400 outline-none bg-white">
          <option value="">Select your role</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="director">Director</option>
        </select>
        {errors.userRole && <p className="text-red-500 text-sm mt-1">{errors.userRole.message?.toString()}</p>}
      </div>

      {/* Certificate Upload for Agents */}
      {data.accountType === 'agent' && (
        <div className="space-y-4">
          <label className="text-sm font-semibold text-gray-700">RERA Certificate (Optional)</label>
          {!certificate ? (
            <div 
              onClick={() => certInputRef.current?.click()} 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 hover:border-[#0081C9] transition-all group text-center"
            >
              <Upload size={40} className="mb-4 text-gray-400 group-hover:text-[#0081C9]" />
              <div className="text-sm md:text-base"><span className="text-[#0081C9] font-semibold hover:underline">Click to upload</span> or drag and drop</div>
              <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide">PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)</div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm"><FileImage size={24} /></div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-900 truncate max-w-[200px]">{certificate.name}</span>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">{(certificate.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              <button type="button" onClick={() => setCertificate(null)} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600"><X size={20} /></button>
            </div>
          )}
          <input type="file" ref={certInputRef} hidden onChange={(e) => handleFileChange(e, false)} accept=".pdf,.doc,.docx,.jpg,.png" />
        </div>
      )}

      <div className="flex justify-end mt-12 pt-6 border-t border-gray-300">
        <button type="submit" className="bg-[#0081C9] hover:bg-[#006da8] text-white px-10 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95">Next →</button>
      </div>
    </form>
  );
}