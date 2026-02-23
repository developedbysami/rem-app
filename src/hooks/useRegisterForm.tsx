import { useState, useMemo } from 'react';
import { allSteps } from '@/constants/registerationConfig';

export const useRegisterForm = () => {
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

  // Dynamically filter steps based on accountType
  const activeSteps = useMemo(() => {
    if (formData.accountType === 'agent') {
      return allSteps.filter((step) => step.id !== 2); 
    }
    return allSteps;
  }, [formData.accountType]);

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

  return {
    currentStep,
    formData,
    activeSteps,
    activeIndex,
    progressPercentage,
    handleAccountTypeChange,
    handleNextStep,
    handlePrevStep,
  };
};