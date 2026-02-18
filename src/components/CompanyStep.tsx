import { Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// 1. Define the Validation Schema
const companySchema = z.object({
  companyName: z.string().min(2, "Company name is required"),
  companySize: z.string().min(1, "Please select a company size"),
  industry: z.string().min(1, "Please select an industry"),
  // Non-validated fields (remaining as is)
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
});

type CompanyFormData = z.infer<typeof companySchema>;

export const CompanyStep = ({ onNext, onPrev }) => {
  // 2. Initialize Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
  });

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
  ];

  const maxSizeInBytes = 10 * 1024 * 1024; // 10MB

  const handleFiles = (files) => {
    if (!files || files.length === 0) return;
    const selectedFile = files[0];

    if (!validTypes.includes(selectedFile.type)) {
      alert('Unsupported file type. Please upload PDF, DOC, DOCX, JPG, or PNG.');
      return;
    }

    if (selectedFile.size > maxSizeInBytes) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // 3. Final submission handler
  const onSubmit = (data: CompanyFormData) => {
    if (!file) {
      alert("Please upload your company license.");
      return;
    }
    onNext(data); // Pass valid data to next step
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Company Information</h2>
        <p className="text-gray-600">Help us understand your business so we can tailor REM CRM to your real estate needs</p>
      </div>

      <div className="space-y-4">
        {/* Company Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name <span className="text-red-500">*</span>
          </label>
          <input 
            {...register("companyName")}
            type="text" 
            placeholder="e.g., Acme Real Estate LLC" 
            className={`w-full p-3 border rounded-lg bg-gray-50 focus:outline-blue-500 ${errors.companyName ? 'border-red-500' : ''}`} 
          />
          {errors.companyName && <p className="text-red-500 text-xs mt-1">{errors.companyName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Company Size */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Size <span className="text-red-500">*</span></label>
            <select 
              {...register("companySize")}
              className={`w-full p-3 border rounded-lg bg-gray-50 ${errors.companySize ? 'border-red-500' : ''}`}
            >
              <option value="">Select company size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="500+">500+ employees</option>
            </select>
            {errors.companySize && <p className="text-red-500 text-xs mt-1">{errors.companySize.message}</p>}
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry <span className="text-red-500">*</span></label>
            <select 
              {...register("industry")}
              className={`w-full p-3 border rounded-lg bg-gray-50 ${errors.industry ? 'border-red-500' : ''}`}
            >
              <option value="">Select industry</option>
              <option value="Residential">Residential Real Estate</option>
              <option value="Commercial">Commercial Real Estate</option>
              <option value="Property Management">Property Management</option>
            </select>
            {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry.message}</p>}
          </div>
        </div>

        {/* Remaining fields given as is */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Website (Optional)</label>
          <input type="text" placeholder="e.g., https://www.acmerealestate.com" className="w-full p-3 border rounded-lg bg-gray-50" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company Address (Optional)</label>
          <input type="text" placeholder="e.g., 123 Main Street, Suite 100" className="w-full p-3 border rounded-lg bg-gray-50 mb-3" />
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company License <span className="text-red-500">*</span></label>
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 cursor-pointer hover:border-blue-400 transition-colors"
          >
            {file ? (
              <div className="text-gray-700 font-semibold">
                Selected file: <span className="italic">{file.name}</span>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <Upload size={30} color="gray"/>
                </div>
                <div className="text-blue-500 font-semibold mb-1">
                  Click to upload <span className="text-gray-400 font-normal">or drag and drop</span>
                </div>
                <p className="text-[10px] text-gray-400 uppercase">
                  PDF, DOC, DOCX, JPG, PNG (MAX. 10MB)
                </p>
              </>
            )}
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            ref={fileInputRef}
            className="hidden"
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button type="button" onClick={onPrev} className="text-gray-500 hover:text-gray-700 font-medium flex items-center">
          ← Previous
        </button>
        <button type="submit" className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 flex items-center font-semibold">
          Next →
        </button>
      </div>
    </form>
  );
};