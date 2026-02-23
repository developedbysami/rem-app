"use client";

import Link from "next/link";
import { useState, useMemo, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import axios from "axios";
import { apiRequest } from "@/apis/apis";

// 1. Validation Schema
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
        password: "",
        confirmPassword: ""
    }
  });

  // 2. Clear Form on Mount 
  // This ensures that even if the browser caches the last session, the form starts fresh
  useEffect(() => {
    reset({ password: "", confirmPassword: "" });
  }, [token, reset]);

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const validations = useMemo(() => ({
    length: password.length >= 8,
    match: password === confirmPassword && password !== "",
  }), [password, confirmPassword]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError("Reset token is missing or invalid. Please request a new link.");
      return;
    }

    setServerError(null);

    try {
      // 3. Sending all required fields to backend
     const response = await apiRequest('POST', '/password/reset', {
      token: token, // The token usually comes from the URL params
      password: data.password,
      confirmPassword: data.confirmPassword,
    });

      if (response.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => router.push("/login"), 3000);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "Failed to reset password.";
      setServerError(message);
    }
  };

  return (
    <div className="max-w-md w-full space-y-8 mx-auto p-4 flex flex-col justify-center min-h-screen">
      <div className="text-center">
        <img src="/logo.png" alt="logo" className="h-16 w-auto mx-auto mb-6 object-contain" />
        <h2 className="text-3xl font-bold text-gray-900">New Password</h2>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        {isSuccess ? (
          <div className="text-center space-y-4 animate-in zoom-in duration-300">
            <CheckCircle2 size={60} className="text-green-500 mx-auto" />
            <h3 className="text-xl font-bold text-gray-900">Password Reset!</h3>
            <p className="text-gray-600">Your account is now secure. Redirecting to login...</p>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoCorrect="off" autoCapitalize="off">
            {serverError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-in fade-in">
                <AlertCircle size={18} />
                <p>{serverError}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">New Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  autoComplete="new-password" // Prevents browser from filling old passwords
                  placeholder="Minimum 8 characters"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md outline-none transition-all ${
                    errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPass(!showPass)} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password *</label>
              <div className="relative">
                <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register("confirmPassword")}
                  type="password"
                  autoComplete="new-password" // Prevents browser from filling old passwords
                  placeholder="Repeat new password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Validation indicators */}
            <div className="space-y-2 pt-1">
               <div className={`flex items-center gap-2 text-xs transition-colors ${validations.length ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full border transition-all ${validations.length ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'}`} />
                  At least 8 characters
               </div>
               <div className={`flex items-center gap-2 text-xs transition-colors ${validations.match ? 'text-green-600 font-medium' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full border transition-all ${validations.match ? 'bg-green-500 border-green-500' : 'bg-transparent border-gray-300'}`} />
                  Passwords match
               </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 transition-all active:scale-[0.98] shadow-md shadow-blue-100"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Resetting...
                </span>
              ) : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <Link href="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

// 4. Wrapped with Suspense (Required for useSearchParams in Next.js Client Components)
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-500 font-medium">Validating reset link...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}