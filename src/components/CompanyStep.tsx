'use client';

import { Upload } from "lucide-react";
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
        <input {...register("companyName")} placeholder="Company Name *" className="w-full p-3 border rounded-lg bg-gray-50" />
        
        <div className="grid grid-cols-2 gap-4">
          <select {...register("companySize")} className="w-full p-3 border rounded-lg bg-gray-50">
            <option value="">Select size *</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-500">201-500 employees</option>
            <option value="500+">500+ employees</option>
          </select>

          <select {...register("industry")} className="w-full p-3 border rounded-lg bg-gray-50">
            <option value="">Select industry *</option>
            <option value="real_estate">Real Estate</option>
            <option value="property_management">Property Management</option>
            <option value="construction">Construction</option>
            <option value="investment">Investment</option>
            <option value="technology">Technology</option>
            <option value="finance">Finance</option>
            <option value="other">Other</option>
          </select>
        </div>

        <input {...register("website")} placeholder="Company Website" className="w-full p-3 border rounded-lg bg-gray-50" />
        <input {...register("address")} placeholder="Address" className="w-full p-3 border rounded-lg bg-gray-50" />



        <div className="grid grid-cols-2 gap-3 mb-3">
             <input type="text" placeholder="e.g., New York" className="p-3 border rounded-lg bg-gray-50" />
             <input type="text" placeholder="e.g., NY" className="p-3 border rounded-lg bg-gray-50" />
          </div>


 <div className="grid grid-cols-2 gap-3">
             <input type="text" placeholder="e.g., 10001" className="p-3 border rounded-lg bg-gray-50" />
             <select className="p-3 border rounded-lg bg-gray-50">
               <option value="US">United States</option>
  <option value="CA">Canada</option>
  <option value="GB">United Kingdom</option>
  <option value="AU">Australia</option>
  <option value="DE">Germany</option>
  <option value="FR">France</option>
  <option value="Other">Other</option>
             </select>
          </div>





        <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-blue-400">
          <div className="flex justify-center"><Upload size={30} color="gray"/></div>
          <div className="text-blue-500 font-semibold">{fileName || "Click to upload Company License *"}</div>
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleFile} />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={onPrev} className="text-gray-500 font-medium">← Previous</button>
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg font-semibold">Next →</button>
      </div>
    </form>
  );
};