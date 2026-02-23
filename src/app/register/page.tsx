'use client';

import React from 'react';
import PersonalStep from '@/components/registerSteps/PersonalStep';
import { CompanyStep } from '@/components/registerSteps/CompanyStep';
import { CredentialsStep } from '@/components/registerSteps/CredentialsStep';
import { ReviewStep } from '@/components/registerSteps/ReviewStep';
import { useRegisterForm } from '@/hooks/useRegisterForm'; // Adjust path as needed

const Page = () => {
  const {
    currentStep,
    formData,
    activeSteps,
    activeIndex,
    progressPercentage,
    handleAccountTypeChange,
    handleNextStep,
    handlePrevStep,
  } = useRegisterForm();

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
          <div key={step.id} className="flex flex-col items-center flex-1 relative text-center">
            {/* Connector Line */}
            {index !== 0 && (
              <div 
                className={`absolute mx-10 top-5 right-[50%] left-[-50%] h-[2px] transition-colors duration-500 z-0 
                ${currentStep >= step.id ? 'bg-[#0081C9]' : 'bg-gray-200'}`} 
              />
            )}

            {/* Circle Icon */}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-[3px] mb-2 transition-all duration-300 font-bold 
              ${currentStep === step.id 
                ? 'bg-[#0081C9] border-[#BEE3F8] text-white shadow-[0_0_0_3px_rgba(190,227,248,0.5)]' 
                : currentStep > step.id 
                  ? 'bg-[#0081C9] border-[#0081C9] text-white' 
                  : 'bg-gray-200 border-white text-gray-500'}`}>
              {currentStep > step.id ? "✓" : index + 1}
            </div>

            <span className={`relative z-10 text-sm font-bold block ${currentStep === step.id ? 'text-[#0081C9]' : 'text-gray-600'}`}>
              {step.title}
            </span>

            <p className="text-xs text-gray-400 mt-1 hidden md:block w-55">
              {step.description || "Step details here"}
            </p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mb-8 max-w-4xl mx-auto relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-pulse"></div>
        <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-700 ease-in-out rounded-full"
            style={{
              width: `${progressPercentage}%`,
              background: "linear-gradient(90deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
            }}
          />
        </div>
        <div className="flex justify-between text-sm my-3">
          <span className="font-semibold text-gray-800">
            {progressPercentage}% Complete{" "}
            <span className="font-normal text-gray-500 ml-1">
              {progressPercentage === 100 ? "Almost there! 🔥" : "Let's get started! 🚀"}
            </span>
          </span>
          <span className="text-gray-400 text-xs font-medium">
            Step {activeIndex + 1} of {activeSteps.length}
          </span>
        </div>
      </div>

      {/* Step Content */}
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