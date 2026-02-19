"use client";

import Link from "next/link";
import { useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, Lock, AlertCircle } from "lucide-react";
import axios from "axios";

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
    formState: { errors, isSubmitting, isValid },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
  });

  const password = watch("password", "");
  const confirmPassword = watch("confirmPassword", "");

  const validations = useMemo(() => ({
    length: password.length >= 8,
    match: password === confirmPassword && password !== "",
  }), [password, confirmPassword]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setServerError("Reset token is missing from the URL.");
      return;
    }

    setServerError(null);

    try {
      // ─── Backend expects all three fields: token, password, confirmPassword ───
      const response = await axios.post("http://localhost:5000/api/v1/password/reset", {
        token: token,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      if (response.data.success) {
        setIsSuccess(true);
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
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
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
                  placeholder="Minimum 8 characters"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
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
                  placeholder="Repeat new password"
                  className={`w-full pl-10 pr-4 py-2 border rounded-md outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                  }`}
                />
              </div>
            </div>

            {/* Validation indicators */}
            <div className="space-y-2 pt-1">
               <div className={`flex items-center gap-2 text-xs ${validations.length ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full border ${validations.length ? 'bg-green-500 border-green-500' : 'bg-transparent'}`} />
                  At least 8 characters
               </div>
               <div className={`flex items-center gap-2 text-xs ${validations.match ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`w-3 h-3 rounded-full border ${validations.match ? 'bg-green-500 border-green-500' : 'bg-transparent'}`} />
                  Passwords match
               </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full py-2.5 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 disabled:bg-gray-200 transition-all active:scale-[0.98] shadow-md"
            >
              {isSubmitting ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center pt-6 border-t border-gray-100">
          <Link href="/login" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Wrapped with Suspense because searchParams requires it in Next.js ───
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}