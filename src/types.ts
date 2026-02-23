import { z } from 'zod';
import { 
  personalSchema, 
  companySchema, 
  credentialsSchema 
} from '@/schemas/authSchema';


export type AccountType = 'agent' | 'company';

export interface FileData {
  name: string;
  size: number;
  data: string; // Base64 string
}


export interface RegistrationData {
  // Personal Info
  firstName: string;
  lastName: string;
  phoneNumber: string;
  phoneDialCode: string;
  countryCode: string;
  referalCode: string;
  userRole: string;
  accountType: AccountType;
  profileImage: string | null;
  certificate: FileData | null;

  // Company Info
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  companyLicense: string | null;

  // Credentials
  email: string;
  password: string;
}


// Base interface for shared navigation
interface BaseStepProps {
  data: RegistrationData;
  onNext: (stepData: Partial<RegistrationData>) => void;
  onPrev?: () => void; // Optional here to allow Step 1 to inherit safely
}

// Fixed: No more incompatible type error
export interface PersonalStepProps extends BaseStepProps {
  onAccountTypeChange: (type: AccountType) => void;
}

export interface CompanyStepProps extends BaseStepProps {
  onPrev: () => void; // Explicitly required for this step's logic
}

export interface CredentialsStepProps extends BaseStepProps {
  onPrev: () => void; // Explicitly required for this step's logic
}

export interface ReviewStepProps {
  data: RegistrationData;
  onPrev: () => void;
}


export type PersonalFields = z.infer<typeof personalSchema>;
export type CompanyFields = z.infer<typeof companySchema>;
export type CredentialsFields = z.infer<typeof credentialsSchema>;