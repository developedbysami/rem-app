"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Smartphone, ArrowLeft, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { apiRequest } from "@/apis/apis";

function OTPContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const method = searchParams.get("method");

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      phoneValue: "",
    },
  });

  const isEmail = method === "email";

  const onSendOTP = async (data: any) => {
    setServerError(null);
    try {
      const type = isEmail ? "email" : "whatsapp";
      let payload: any = { type };
      let queryParams = new URLSearchParams();

      if (isEmail) {
        payload.email = data.email;
        queryParams.set("email", data.email);
        queryParams.set("type", "email");
      } else {
        const phoneData = data.phoneValue;
        const dialCode = phoneData.match(/^\+\d+/)?.[0];
        const number = phoneData.replace(dialCode, "");
        payload.phoneDialCode = dialCode;
        payload.phoneNumber = number;

        queryParams.set("phoneNumber", number);
        queryParams.set("phoneDialCode", dialCode);
        queryParams.set("type", "whatsapp");
      }

      // Backend endpoint for requesting the code
      const response = await apiRequest("POST", "/otp/request", payload);
      console.log("OTP Sent:", response);
      if (response.success) {
        // Navigate to the verification page with identifiers in URL
        router.push(`/login/otp/verify-otp?${queryParams.toString()}`);
      }
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-screen bg-slate-50/30 px-4">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="REM Logo"
            className="h-16 w-auto object-contain"
          />
        </div>
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 border border-blue-100">
            {isEmail ? (
              <Mail size={24} strokeWidth={2.5} />
            ) : (
              <Smartphone size={24} strokeWidth={2.5} />
            )}
          </div>
          <h1 className="text-3xl font-bold text-slate-900">
            Sign in with {isEmail ? "Email" : "WhatsApp"}
          </h1>
        </div>
        <p className="text-slate-500 font-medium">
          Enter your details to receive a secure code
        </p>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <Link
          href="/login/method"
          className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors text-sm font-semibold mb-8 group"
        >
          <ArrowLeft
            size={16}
            className="mr-2 group-hover:-translate-x-1 transition-transform"
          />{" "}
          Back
        </Link>

        {serverError && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-in fade-in">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSendOTP)} className="space-y-6">
          {isEmail ? (
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-medium"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">
                WhatsApp Number
              </label>
              <Controller
                name="phoneValue"
                control={control}
                rules={{ required: "Phone number is required" }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    international
                    defaultCountry="AE"
                    className="flex w-full px-4 py-1.5 bg-white border border-slate-200 rounded-xl outline-none focus-within:border-blue-500 transition-all text-slate-900 font-medium"
                  />
                )}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#2D60FF] hover:bg-[#1E4DDB] text-white rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-lg shadow-blue-200"
          >
            {isSubmitting ? "Sending..." : "Send verification code"}
            <ShieldCheck size={20} strokeWidth={2.5} />
          </button>
        </form>
      </div>
    </div>
  );
}

export default function OTPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <OTPContent />
    </Suspense>
  );
}
