'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Building2, Camera, ChevronDown, FileText, UploadCloud, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import PhoneInputField from '@/constants/PhoneInputField';

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

  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
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
          {profileImage ? <img src={profileImage} className="w-full h-full object-cover" /> : <User size={40} className="text-slate-300" />}
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-1 right-1 bg-sky-600 text-white rounded-full p-1.5"><Camera size={14} /></button>
        </div>
        <input type="file" ref={fileInputRef} hidden onChange={(e) => handleFileChange(e, true)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">First Name *</label>
          <input {...register('firstName')} className="w-full p-3 border rounded-lg focus:border-sky-400 outline-none" placeholder="First Name" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold">Last Name *</label>
          <input {...register('lastName')} className="w-full p-3 border rounded-lg focus:border-sky-400 outline-none" placeholder="Last Name" />
        </div>
      </div>

      <PhoneInputField name="phoneNumber" control={control} errors={errors} />

      <div className="space-y-1.5">
        <label className="text-sm font-semibold">User Role *</label>
        <select {...register('userRole')} className="w-full p-3 border rounded-lg focus:border-sky-400 outline-none">
          <option value="">Select your role</option>
          <option value="admin">Admin</option>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="director">Director</option>
        </select>
      </div>

      {accountType === 'agent' && (
        <div onClick={() => certInputRef.current?.click()} className="border-2 border-dashed rounded-xl p-4 flex items-center justify-between cursor-pointer bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-slate-200 rounded-lg text-slate-500"><FileText size={20} /></div>
            <div><p className="text-sm font-medium">{certificate ? certificate.name : 'Upload Certification'}</p></div>
          </div>
          <input type="file" ref={certInputRef} hidden onChange={(e) => handleFileChange(e, false)} />
        </div>
      )}

      <div className="flex justify-end mt-12 pt-6 border-t">
        <button type="submit" className="bg-[#0081C9] text-white px-10 py-2.5 rounded-lg font-bold shadow-md">Next →</button>
      </div>
    </form>
  );
}