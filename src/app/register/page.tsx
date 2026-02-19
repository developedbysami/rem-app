'use client';

import { CompanyStep } from '@/components/CompanyStep';
import { CredentialsStep } from '@/components/CredentialsStep';
import PersonalStep from '@/components/PersonalStep';
import { ReviewStep } from '@/components/ReviewStep';
import React, { useState } from 'react';

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneDialCode: '', // Captured from PhoneInputField
    countryCode: '',    // Captured from PhoneInputField
    referralCode: '',
    userRole: '',
    accountType: 'company',
    profileImage: null, // Base64
    certificate: null,  // { name, data (Base64) }
    // Company Info
    companyName: '',
    companySize: '',
    industry: '',
    website: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    companyLicense: null, // Base64
    // Credentials
    email: '',
    password: '',
  });

  const handleNextStep = (stepData: any) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => setCurrentStep((prev) => prev - 1);

  const steps = [
    { id: 1, title: 'Personal', desc: 'Personal profile information' },
    { id: 2, title: 'Company', desc: 'Business details and license' },
    { id: 3, title: 'Credentials', desc: 'Secure login credentials' },
    { id: 4, title: 'Complete', desc: 'Final review and registration' },
  ];

  const progressPercentage = Math.round((currentStep / steps.length) * 100);

  return (
    <div className="max-w-5xl w-full space-y-8 mx-auto p-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="logo" className="h-16 w-auto object-contain" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Create Your Account</h2>
        <p className="text-gray-600 mt-2">Join thousands of professionals using REM APP</p>
      </div>

      {/* Step Indicators */}
      <div className="flex justify-between items-start mb-12 relative max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            {index !== 0 && (
              <div className={`absolute top-5 right-[50%] left-[-50%] h-[2px] transition-colors duration-300 z-0 ${currentStep >= step.id ? 'bg-[#0081C9]' : 'bg-gray-200'}`} />
            )}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-[3px] mb-2 transition-all duration-300 font-bold ${currentStep === step.id ? 'bg-[#0081C9] border-[#BEE3F8] text-white shadow-[0_0_0_3px_rgba(190,227,248,0.5)]' : currentStep > step.id ? 'bg-[#0081C9] border-[#0081C9] text-white' : 'bg-gray-200 border-white text-gray-500'}`}>
              {currentStep > step.id ? "✓" : step.id}
            </div>
            <span className={`relative z-10 text-sm font-bold ${currentStep === step.id ? 'text-[#0081C9]' : 'text-gray-600'}`}>{step.title}</span>
          </div>
        ))}
      </div>
      {/* Progress Bar Section */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-bold text-gray-800">
            {progressPercentage}% Complete{" "}
            <span className="font-normal text-gray-500 ml-1">
              You're doing great! 🔥
            </span>
          </span>
          <span className="text-gray-400 text-xs italic font-medium">
            Step {currentStep} of {steps.length} →
          </span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-700 ease-in-out rounded-full"
            style={{
              width: `${progressPercentage}%`,
              background:
                "linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto">
        {currentStep === 1 && <PersonalStep onNext={handleNextStep} data={formData} />}
        {currentStep === 2 && <CompanyStep onNext={handleNextStep} onPrev={handlePrevStep} data={formData} />}
        {currentStep === 3 && <CredentialsStep onNext={handleNextStep} onPrev={handlePrevStep} data={formData} />}
        {currentStep === 4 && <ReviewStep onPrev={handlePrevStep} data={formData} />}
      </div>
    </div>
  );
};

export default Page;