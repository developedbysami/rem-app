"use client";

import React, { useState, useRef, Suspense } from 'react';
import { ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract identifiers from URL to prevent "User not found" error
  const type = searchParams.get('type');
  const email = searchParams.get('email');
  const phoneNumber = searchParams.get('phoneNumber');
  const phoneDialCode = searchParams.get('phoneDialCode');

  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value !== '' && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onVerify = async () => {
    const code = otp.join('');
    setServerError("");
    
    if (code.length < 6) {
      setServerError("Please enter the full 6-digit code");
      return;
    }

    setIsSubmitting(true);
    try {
      // Send OTP + identifiers from the URL
      const response = await axios.post("http://localhost:5000/api/v1/otp/verify", {
        type: type, 
        otp: code,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined,
        phoneDialCode: phoneDialCode || undefined
      });

      if (response.data.success) {
        // Backend returns token and user object
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.data));
        router.push("/dashboard");
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-slate-50/30 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-100 text-center animate-in zoom-in">
        <button onClick={() => router.back()} className="flex items-center text-slate-400 hover:text-slate-600 mb-8 text-sm font-semibold">
          <ArrowLeft size={16} className="mr-2" /> Back
        </button>

        <h2 className="text-2xl font-bold text-slate-900">Verify OTP</h2>
        <p className="text-sm text-slate-500 mt-2 mb-8 font-medium">
          Sent to: <span className="font-bold text-slate-900">{email || `${phoneDialCode}${phoneNumber}`}</span>
        </p>

        {serverError && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {serverError}
          </div>
        )}

        {/* 6-Digit OTP Inputs */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-8">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              ref={(el) => (inputRefs.current[idx] = el)}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-10 h-14 sm:w-12 sm:h-16 border-2 border-slate-100 rounded-xl text-center text-xl font-bold focus:border-blue-500 outline-none transition-all"
            />
          ))}
        </div>

        <button 
          onClick={onVerify}
          disabled={isSubmitting}
          className="w-full py-4 bg-[#2D60FF] hover:bg-blue-700 text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all disabled:opacity-50"
        >
          {isSubmitting ? "Verifying..." : "Verify & Sign In"}
          <ShieldCheck size={20} />
        </button>

        <button onClick={() => router.back()} className="mt-8 flex items-center justify-center gap-2 text-blue-600 font-bold hover:underline mx-auto">
          <RotateCcw size={16} /> Resend Code
        </button>
      </div>
    </div>
  );
}

export default function VerifyOTPView() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <VerifyOTPContent />
        </Suspense>
    )
}