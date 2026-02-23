'use client';

import { CheckCircle2, FileImage, Upload, X } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { companySchema } from "@/schemas/authSchema";
import { CompanyStepProps } from "@/types";



export const CompanyStep = ({ onNext, onPrev, data }: CompanyStepProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: data // This ensures text fields stay populated
  });

  // Initialize license states with existing data if available
  const [licenseBase64, setLicenseBase64] = useState(data.companyLicense || null);
  const [fileName, setFileName] = useState(data.companyLicense ? "company_license.png" : "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setLicenseBase64(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setFileName("");
    setLicenseBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onSubmit = (formData: any) => {
    // If you want the license to be optional, remove this alert check
    if (!licenseBase64) return alert("Please upload your company license.");
    onNext({ ...formData, companyLicense: licenseBase64 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 animate-in fade-in duration-500">
      <div className="text-center mb-8"><h2 className="text-xl font-bold">Company Information</h2></div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="text-sm font-semibold">Company Name <span className='text-red-500'>*</span></label>
          <input {...register("companyName")} placeholder="E.g., Acme Real Estate LLC" className="w-full input p-3 border rounded-lg bg-gray-50 focus:border-blue-400 outline-none" />
          {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message?.toString()}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
  
  {/* Company Size */}
  <div className="space-y-1.5">
    <label className="text-sm font-semibold">
      Company Size <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <select
        {...register("companySize")}
        className="w-full appearance-none p-3 pr-10 border rounded-lg bg-gray-50 focus:border-sky-400 outline-none"
      >
        <option value="">Select Size</option>
        <option value="1-10">1-10 employees</option>
        <option value="11-50">11-50 employees</option>
        <option value="51-200">51-200 employees</option>
        <option value="201-500">201-500 employees</option>
        <option value="500+">500+ employees</option>
      </select>

      {/* Chevron */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {errors.companySize && (
      <p className="text-red-500 text-sm mt-1">
        {errors.companySize.message?.toString()}
      </p>
    )}
  </div>


  {/* Industry */}
  <div className="space-y-1.5">
    <label className="text-sm font-semibold">
      Industry <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <select
        {...register("industry")}
        className="w-full appearance-none p-3 pr-10 border rounded-lg bg-gray-50 focus:border-sky-400 outline-none"
      >
        <option value="" >Select industry</option>
        <option value="real_estate">Real Estate</option>
        <option value="property_management">Property Management</option>
        <option value="construction">Construction</option>
        <option value="investment">Investment</option>
        <option value="technology">Technology</option>
        <option value="finance">Finance</option>
        <option value="other">Other</option>
      </select>

      {/* Chevron */}
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {errors.industry && (
      <p className="text-red-500 text-sm mt-1">
        {errors.industry.message?.toString()}
      </p>
    )}
  </div>

</div>

        {/* Website & Address */}
        <label className="text-sm font-semibold">Company Website <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
        <input {...register("website")} placeholder="https://..." className="w-full input p-3 border rounded-lg bg-gray-50" />
        
        <label className="text-sm font-semibold">Company Address <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
        <input {...register("address")} placeholder="Street Address" className="w-full input p-3 border rounded-lg bg-gray-50" />

        {/* City & State (FIXED: Added register) */}
        <div className="grid grid-cols-2 gap-3">
          <input {...register("city")} type="text" placeholder="City (e.g., New York)" className="input p-3 border rounded-lg bg-gray-50" />
          <input {...register("state")} type="text" placeholder="State (e.g., NY)" className="input p-3 border rounded-lg bg-gray-50" />
        </div>

        
     <div className="grid grid-cols-2 gap-3">
  
  {/* Zip Code */}
  <input
    {...register("zip")}
    type="text"
    placeholder="Zip Code"
    className="w-full p-3 border rounded-lg bg-gray-50 focus:border-sky-400 outline-none"
  />

  {/* Country Select */}
  <div className="relative">
    <select
      {...register("country")}
      className="w-full appearance-none p-3 pr-10 border rounded-lg bg-gray-50 focus:border-sky-400 outline-none"
    >
      <option value="US">United States</option>
      <option value="CA">Canada</option>
      <option value="GB">United Kingdom</option>
      <option value="AU">Australia</option>
      <option value="AE">UAE</option>
      <option value="Other">Other</option>
    </select>

    {/* Custom Chevron */}
    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </div>

</div>

       
        <label className="text-sm font-semibold">Company License <span className="text-red-500">*</span></label>
        <div className="space-y-4">
          {!fileName ? (
            <div 
              onClick={() => fileInputRef.current?.click()} 
              className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 hover:border-[#0081C9] transition-all group text-center"
            >
              <Upload size={40} className="mb-4 text-gray-400 group-hover:text-[#0081C9] transition-colors" />
              <div className="text-sm md:text-base">
                <span className="text-[#0081C9] font-semibold hover:underline">Click to upload</span> or drag and drop
              </div>
              <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide">PDF, JPG, PNG (MAX. 10MB)</div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                  <FileImage size={24} />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-900 truncate max-w-[200px]">{fileName}</span>
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <span className="text-xs text-emerald-600 font-medium">Ready for registration</span>
                </div>
              </div>
              <button type="button" onClick={clearFile} className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600">
                <X size={20} />
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} accept=".pdf,.doc,.docx,.jpg,.png" />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={onPrev} className="text-gray-500 font-medium hover:text-gray-700 transition-colors">← Previous</button>
        <button type="submit" className="bg-[#0081C9] hover:bg-[#006da8] text-white px-8 py-2 rounded-lg font-bold shadow-md active:scale-95 transition-all">Next →</button>
      </div>
    </form>
  );
};