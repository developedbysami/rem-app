'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export const ReviewStep = ({ onPrev, data }) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Helper to convert Base64 strings back to File objects for backend
  const b64ToFile = (base64String: string, filename: string) => {
    if (!base64String) return null;
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  const handleComplete = async () => {
    setLoading(true);
    const fd = new FormData();

    // Mapping fields to match your Backend Model
    fd.append('firstName', data.firstName);
    fd.append('lastName', data.lastName);
    fd.append('phoneNumber', data.phoneNumber);
    fd.append('phoneDialCode', data.phoneDialCode || '+1'); // Ensure this isn't empty
    fd.append('email', data.email);
    fd.append('password', data.password);
    fd.append('role', data.userRole); // admin, agent, manager, or director
    fd.append('is_company', data.accountType === 'company' ? '1' : '0');
    fd.append('referalCode', data.referralCode || '');

    if (data.accountType === 'company') {
      fd.append('companyName', data.companyName);
      fd.append('companySize', data.companySize);
      fd.append('industry', data.industry); // real_estate, etc.
      fd.append('companyWebsite', data.website || '');
      fd.append('companyAddress', data.address || '');
      
      const lic = b64ToFile(data.companyLicense, 'license.png');
      if (lic) fd.append('companyLicense', lic);
    } else {
      const cert = b64ToFile(data.certificate?.data, 'certificate.png');
      if (cert) fd.append('reraCertificate', cert);
    }

    const pPhoto = b64ToFile(data.profileImage, 'profile.png');
    if (pPhoto) fd.append('profilePhoto', pPhoto);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/signup', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        alert("Account created successfully!");
        router.push('/login');
      }
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Signup failed. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  const summaryData = [
    { label: 'Plan:', value: 'Free Plan (You can upgrade after login)', color: 'text-green-500 font-semibold' },
    { label: 'Account Type:', value: data.accountType === 'company' ? 'Real Estate Company' : 'Individual Agent' },
    { label: 'Name:', value: `${data.firstName} ${data.lastName}` },
    { label: 'Email:', value: data.email },
    { label: 'Role:', value: data.userRole },
    { label: 'Phone:', value: data.phoneNumber },
    ...(data.accountType === 'company' ? [{ label: 'Company:', value: data.companyName }] : []),
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Review & Complete</h2>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Account Summary</h3>
        <div className="space-y-3">
          {summaryData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm border-b border-gray-100 pb-2 last:border-0">
              <span className="text-gray-500 font-medium">{item.label}</span>
              <span className={`text-right ${item.color || 'text-gray-800 font-semibold'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button onClick={onPrev} disabled={loading} className="text-gray-500 hover:text-gray-700 font-medium transition-colors">← Previous</button>
        <button onClick={handleComplete} disabled={loading} className="bg-[#0081C9] hover:bg-[#006da8] text-white px-10 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95">
          {loading ? "Registering..." : "Complete Registration"}
        </button>
      </div>
    </div>
  );
};