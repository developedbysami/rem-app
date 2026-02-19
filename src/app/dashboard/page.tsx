"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  BadgeCheck, 
  Loader2, 
  LogOut,
  Camera
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          router.push("/login");
          return;
        }

        // Calling the getMe endpoint
        const response = await axios.get("http://localhost:5000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setUserData(response.data.data); // Stores id, names, email, role, etc.
        }
      } catch (error: any) {
        console.error("Session expired or invalid:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-sky-400" />

          <div className="px-8 pb-8">
            {/* Profile Image & Camera Center Icon */}
            
  

            {/* User Info Heading */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">
                {userData?.firstName} {userData?.lastName}
              </h1>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
                  {userData?.role}
                </span>
                {userData?.isVerified && (
                  <BadgeCheck size={18} className="text-blue-500" />
                )}
              </div>
            </div>

            {/* Data Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Email Address</p>
                  <p className="text-sm font-semibold text-slate-700">{userData?.email}</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400 shadow-sm">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                  <p className={`text-sm font-semibold ${userData?.isVerified ? 'text-green-600' : 'text-amber-500'}`}>
                    {userData?.isVerified ? "Verified Account" : "Pending Verification"}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-10 flex flex-col gap-3">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-[0.98]">
                Edit Profile
              </button>
              <button 
                onClick={handleLogout}
                className="w-full py-4 bg-white text-red-600 border-2 border-red-50 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-red-50 transition-all"
              >
                <LogOut size={20} />
                Log Out
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-slate-400">
          User ID: {userData?.id}
        </p>
      </div>
    </div>
  );
}