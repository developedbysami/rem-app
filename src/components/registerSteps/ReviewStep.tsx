'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { apiRequest } from '@/apis/apis';
import { ReviewStepProps } from '@/types';

export const ReviewStep = ({ onPrev, data }: ReviewStepProps) => {
  const [loading, setLoading] = useState(false);
  // New states for checkboxes
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  
  const router = useRouter();

  // Helper to determine if the user can proceed
  const isFormValid = agreedToTerms && agreedToMarketing && !loading;

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

  const summaryData = [
    { 
      label: 'Plan:', 
      value: 'Free Plan (you can upgrade after login)', 
      color: 'text-green-600 font-semibold' 
    },
    { 
      label: 'Account Type:', 
      value: data.accountType === 'company' ? 'Real Estate Company' : 'Individual Agent' 
    },
    { 
      label: 'Name:', 
      value: `${data.firstName} ${data.lastName}` 
    },
    { 
      label: 'Email:', 
      value: data.email 
    },
    ...(data.accountType === 'company' ? [
      { label: 'Company:', value: data.companyName },
      { label: 'Industry:', value: data.industry }
    ] : [])
  ];

  const handleComplete = async () => {
    if (!isFormValid) return;

    setLoading(true);
    const fd = new FormData();

    fd.append('firstName', data.firstName);
    fd.append('lastName', data.lastName);
    fd.append('phoneNumber', data.phoneNumber);
    fd.append('phoneDialCode', data.phoneDialCode || '+1');
    fd.append('countryCode', data.countryCode || 'US');
    fd.append('email', data.email);
    fd.append('password', data.password);
    fd.append('role', data.userRole.toLowerCase());
    fd.append('referalCode', data.referalCode || '');
    
    const isCompany = data.accountType === 'company' ? '1' : '0';
    fd.append('is_company', isCompany);

    if (data.accountType === 'company') {
      fd.append('companyName', data.companyName);
      fd.append('companySize', data.companySize);
      fd.append('industry', data.industry);
      fd.append('companyWebsite', data.website || '');
      
      const fullAddress = `${data.address || ''}, ${data.city || ''}, ${data.state || ''} ${data.zip || ''}, ${data.country || ''}`.trim();
      fd.append('companyAddress', fullAddress);
      
      const lic = b64ToFile(data.companyLicense, 'license.png');
      if (lic) fd.append('companyLicense', lic);
    } else {
      const cert = b64ToFile(data.certificate?.data, data.certificate?.name || 'certificate.png');
      if (cert) fd.append('reraCertificate', cert);
    }

    const pPhoto = b64ToFile(data.profileImage, 'profile.png');
    if (pPhoto) fd.append('profilePhoto', pPhoto);

    try {
      const response = await apiRequest('POST', '/auth/signup', fd);

      if (response.success) {
        alert(data.accountType === 'company' ? "Company registered!" : "Agent registered!");
        router.push('/login');
      }
    } catch (error: any) {
      console.error(error.response?.data);
      alert(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="space-y-4 py-4">
        {/* 1. Terms of Service Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#0081C9] accent-[#0081C9] cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-700 leading-tight">
            I agree to the{' '}
            <Link href="/terms" className="text-[#0081C9] hover:underline font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-[#0081C9] hover:underline font-medium">
              Privacy Policy
            </Link>
          </p>
        </label>

        {/* 2. Marketing Communications Checkbox */}
        <label className="flex items-center gap-3 cursor-pointer group">
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={agreedToMarketing}
              onChange={(e) => setAgreedToMarketing(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-[#0081C9] accent-[#0081C9] cursor-pointer"
            />
          </div>
          <p className="text-sm text-gray-700 leading-tight">
            I would like to receive updates and marketing communications about REM CRM
          </p>
        </label>
      </div>

      <div className="flex justify-between mt-10">
        <button 
          onClick={onPrev} 
          disabled={loading} 
          className="text-gray-500 hover:text-gray-700 font-medium transition-colors disabled:opacity-50"
        >
          ← Previous
        </button>
        
        <button 
          onClick={handleComplete} 
          disabled={!isFormValid} 
          className={`
            bg-[#0081C9] hover:bg-[#006da8] text-white px-8 py-2.5 rounded-lg font-bold text-sm shadow-md 
            transition-all active:scale-95 flex items-center gap-2 
            disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed
          `}
        > 
          {loading ? (
            "Registering..."
          ) : (
            <>
              <Check className="w-4 h-4" />
              Create Account
            </>
          )}
        </button>
      </div>
    </div>
  );
};