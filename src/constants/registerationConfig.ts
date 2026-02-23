import { CompanyStep } from "@/components/registerSteps/CompanyStep";
import { CredentialsStep } from "@/components/registerSteps/CredentialsStep";
import PersonalStep from "@/components/registerSteps/PersonalStep";
import { ReviewStep } from "@/components/registerSteps/ReviewStep";

export const allSteps = [
    { 
      id: 1, 
      title: 'Personal', 
      description: 'We need some basic personal information to create your professional CRM profile',
      component: PersonalStep 
    },
    { 
      id: 2, 
      title: 'Company', 
      description: 'Help us understand your business so we can tailor REM CRM to your real estate needs', // Added
      component: CompanyStep 
    },
    { 
      id: 3, 
      title: 'Credentials', 
      description: 'Create secure login credentials for your REM CRM account', // Added
      component: CredentialsStep 
    },
    { 
      id: 4, 
      title: 'Complete', 
      description: 'Almost done! Please review your information and complete your REM CRM registration', // Added
      component: ReviewStep 
    },
  ];