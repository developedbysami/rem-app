import { z } from 'zod';

export const personalSchema = z.object({
  firstName: z.string().min(2, 'First name required'),
  lastName: z.string().min(2, 'Last name required'),
  // use .catch("") or .default("") if you want to be extra safe
  phoneNumber: z.string({
    required_error: "Phone number is required",
    invalid_type_error: "Phone number must be a string",
  }).min(10, 'Valid phone number required'),
  referalCode: z.string().optional(),
  userRole: z.enum(['admin', 'agent', 'manager', 'director'], {
    errorMap: () => ({ message: 'Please select a valid user role' }),
  }),
});


export const companySchema = z.object({
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

export const credentialsSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain one uppercase letter')
    .regex(/[a-z]/, 'Must contain one lowercase letter')
    .regex(/[0-9]/, 'Must contain one number')
    .regex(/[@$!%*?&]/, 'Must contain one special character (e.g., @, $, !)') , // Added this line
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});


export type PersonalFormData = z.infer<typeof personalSchema>;
export type CompanyFormData = z.infer<typeof companySchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type CredentialsFormData = z.infer<typeof credentialsSchema>;