'use client';

import { CompanyStep } from '@/components/CompanyStep';
import { CredentialsStep } from '@/components/CredentialsStep';
import PersonalStep from '@/components/PersonalStep';
import { ReviewStep } from '@/components/ReviewStep';
import React, { useState, useMemo } from 'react';

const Page = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: '',
    lastName: '',
    phoneNumber: '',
    phoneDialCode: '',
    countryCode: '',
    referalCode: '',
    userRole: '',
    accountType: 'company', // Default 'company'
    profileImage: null,
    certificate: null,
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
    companyLicense: null,
    // Credentials
    email: '',
    password: '',
  });

  const allSteps = [
    { id: 1, title: 'Personal', component: PersonalStep },
    { id: 2, title: 'Company', component: CompanyStep },
    { id: 3, title: 'Credentials', component: CredentialsStep },
    { id: 4, title: 'Complete', component: ReviewStep },
  ];

  // Dynamically filter steps based on accountType
  const activeSteps = useMemo(() => {
    if (formData.accountType === 'agent') {
      return allSteps.filter((step) => step.id !== 2);
    }
    return allSteps;
  }, [formData.accountType]);

  // IMMEDIATELY update account type to trigger re-calculation of progress
  const handleAccountTypeChange = (type: 'company' | 'agent') => {
    setFormData((prev) => ({ ...prev, accountType: type }));
  };

  const handleNextStep = (stepData: any) => {
    const updatedData = { ...formData, ...stepData };
    setFormData(updatedData);

    if (currentStep === 1 && updatedData.accountType === 'agent') {
      setCurrentStep(3); // Jump to Credentials for Agents
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 3 && formData.accountType === 'agent') {
      setCurrentStep(1); // Jump back to Personal for Agents
    } else {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const activeIndex = activeSteps.findIndex((s) => s.id === currentStep);
  const progressPercentage = Math.round(((activeIndex + 1) / activeSteps.length) * 100);

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
      <div className="flex justify-between items-start mb-12 relative max-w-5xl mx-auto px-4">
        {activeSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            {index !== 0 && (
              <div 
                className={`absolute top-5 right-[50%] left-[-50%] h-[2px] transition-colors duration-500 z-0 
                ${currentStep >= step.id ? 'bg-[#0081C9]' : 'bg-gray-200'}`} 
              />
            )}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-[3px] mb-2 transition-all duration-300 font-bold 
              ${currentStep === step.id 
                ? 'bg-[#0081C9] border-[#BEE3F8] text-white shadow-[0_0_0_3px_rgba(190,227,248,0.5)]' 
                : currentStep > step.id 
                  ? 'bg-[#0081C9] border-[#0081C9] text-white' 
                  : 'bg-gray-200 border-white text-gray-500'}`}>
              {currentStep > step.id ? "✓" : index + 1}
            </div>
            <span className={`relative z-10 text-sm font-bold ${currentStep === step.id ? 'text-[#0081C9]' : 'text-gray-600'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="flex justify-between text-sm mb-3">
          <span className="font-bold text-gray-800">
            {progressPercentage}% Complete{" "}
            <span className="font-normal text-gray-500 ml-1">
              {progressPercentage === 100 ? "Ready to go! 🚀" : "Almost there! 🔥"}
            </span>
          </span>
          <span className="text-gray-400 text-xs italic font-medium">
            Step {activeIndex + 1} of {activeSteps.length}
          </span>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-700 ease-in-out rounded-full"
            style={{
              width: `${progressPercentage}%`,
              background: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
            }}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-4xl mx-auto min-h-[400px]">
        {currentStep === 1 && (
          <PersonalStep 
            onNext={handleNextStep} 
            data={formData} 
            onAccountTypeChange={handleAccountTypeChange} 
          />
        )}
        {currentStep === 2 && <CompanyStep onNext={handleNextStep} onPrev={handlePrevStep} data={formData} />}
        {currentStep === 3 && <CredentialsStep onNext={handleNextStep} onPrev={handlePrevStep} data={formData} />}
        {currentStep === 4 && <ReviewStep onPrev={handlePrevStep} data={formData} />}
      </div>
    </div>
  );
};

export default Page;