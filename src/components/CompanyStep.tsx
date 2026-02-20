'use client';

import { CheckCircle2, FileImage, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companySize: z.string().min(1, "Please select a company size"),
  industry: z.string().min(1, "Please select an industry"),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

export const CompanyStep = ({ onNext, onPrev, data }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: data
  });

  const [licenseBase64, setLicenseBase64] = useState(data.companyLicense);
  const [fileName, setFileName] = useState("");
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

  const onSubmit = (formData: any) => {
    if (!licenseBase64) return alert("Please upload your company license.");
    onNext({ ...formData, companyLicense: licenseBase64 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-8"><h2 className="text-xl font-bold">Company Information</h2></div>

      <div className="space-y-4">
        <label className="text-sm font-semibold">Company Name 
            <span className='inline-block ml-1 text-red-500'>*</span>
          </label>
        <div>
          <input {...register("companyName")} placeholder="E.g., Acme Real Estate LLC" className="w-full input p-3 border rounded-lg bg-gray-50" />
         {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message?.toString()}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
           
          <div>
            <label className="text-sm font-semibold">Company Size 
            <span className='inline-block ml-1 text-red-500'>*</span>
          </label>
            <select {...register("companySize")} className="w-full input p-3 border rounded-lg bg-gray-50">
            <option value="">Select Company Size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>
           {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize.message?.toString()}</p>}
          </div>

    <div>
      <label className="text-sm font-semibold">Industry 
            <span className='inline-block ml-1 text-red-500'>*</span>
          </label>
      
          <select {...register("industry")} className="w-full align-bottom input p-3 border rounded-lg bg-gray-50">
            <option value="">Select industry </option>
            <option value="real_estate">Real Estate</option>
            <option value="property_management">Property Management</option>
            <option value="construction">Construction</option>
            <option value="investment">Investment</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
           {errors.industry && <p className="text-red-500 text-sm mt-1">{errors.industry.message?.toString()}</p>}

    </div>
        </div>
<label className="text-sm font-semibold flex items-center gap-2">
          Company Website <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
        <input {...register("website")} placeholder="Company Website" className="w-full input p-3 border rounded-lg bg-gray-50" />
        <label className="text-sm font-semibold flex items-center gap-2">
          Company Address <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
        <input {...register("address")} placeholder="Address" className="w-full input p-3 border rounded-lg bg-gray-50" />



        <div className="grid grid-cols-2 gap-3 mb-3">
             <input type="text" placeholder="e.g., New York" className="input p-3 border rounded-lg bg-gray-50" />
             <input type="text" placeholder="e.g., NY" className="input p-3 border rounded-lg bg-gray-50" />
          </div>


 <div className="grid grid-cols-2 gap-3">
             <input type="text" placeholder="e.g., 10001" className="input p-3 border rounded-lg bg-gray-50" />
             <select className="input p-3 border rounded-lg bg-gray-50">
               <option value="US">United States</option>
  <option value="CA">Canada</option>
  <option value="GB">United Kingdom</option>
  <option value="AU">Australia</option>
  <option value="DE">Germany</option>
  <option value="FR">France</option>
  <option value="Other">Other</option>
             </select>
          </div>




<label className="text-sm font-semibold flex items-center gap-2">
          Company License <span className="text-gray-400 font-normal text-xs">(Optional)</span>
        </label>
      
      <div className="space-y-4">
 
  {!fileName ? (
    /* 1. Upload State (Dashed Box) */
    <div 
      onClick={() => fileInputRef.current?.click()} 
      className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-gray-50/50 cursor-pointer hover:bg-gray-50 hover:border-[#0081C9] transition-all group text-center"
    >
      <Upload size={40} className="mb-4 text-gray-400 group-hover:text-[#0081C9] transition-colors" />
      <div className="text-sm md:text-base">
        <span className="text-[#0081C9] font-semibold hover:underline">Click to upload</span>
        <span className="text-gray-600"> or drag and drop</span>
      </div>
      <div className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
        PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
      </div>
    </div>
  ) : (
    /* 2. Success/Selected State (Emerald Card) */
    <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
          <FileImage size={24} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-emerald-900 truncate max-w-[200px]">
              {fileName}
            </span>
            <CheckCircle2 size={18} className="text-emerald-500" />
          </div>
          <span className="text-xs text-emerald-600 font-medium">Ready to upload</span>
        </div>
      </div>
      {/* Logic to clear the file should go in this onClick */}
      <button 
        type="button" 
        onClick={() => {/* Your logic to clear fileName, e.g., setFileName(null) */}} 
        className="p-1 hover:bg-emerald-100 rounded-full text-emerald-600"
      >
        <X size={20} />
      </button>
    </div>
  )}

  {/* Hidden Input (Logic preserved) */}
  <input 
    type="file" 
    ref={fileInputRef} 
    className="hidden" 
    onChange={handleFile} 
    accept=".pdf,.doc,.docx,.jpg,.png"
  />
</div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={onPrev} className="text-gray-500 font-medium">← Previous</button>
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold">Next →</button>
      </div>
    </form>
  );
};