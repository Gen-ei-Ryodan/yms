"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Users, Phone, Mail, MapPin } from "lucide-react";

export default function ParentProfilePage() {
  const { user } = useAuth();
  const [guardians, setGuardians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuardians = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get(`/students/${studentId}`);
          setGuardians(response.data.data?.guardians || []);
        }
      } catch (error) {
        console.error("Failed to fetch guardians:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuardians();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data orang tua...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Gradient Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Orang Tua / Wali</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Data Orang Tua / Wali</h1>
            <p className="text-white/60 text-lg">Informasi orang tua atau wali Anda</p>
          </div>
        </div>

        {/* Guardian Cards */}
        {guardians.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {guardians.map((g) => (
              <div key={g.id} className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-5">
                  <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                    <Users className="h-7 w-7 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#0B1526]">{g.name}</h3>
                    <p className="text-sm text-[#8A93A3]">{g.relationship}</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {g.phone && (
                    <div className="flex items-center gap-2.5 text-sm text-[#5B6472]">
                      <Phone className="h-4 w-4 text-[#C9A227]" /> {g.phone}
                    </div>
                  )}
                  {g.email && (
                    <div className="flex items-center gap-2.5 text-sm text-[#5B6472]">
                      <Mail className="h-4 w-4 text-[#C9A227]" /> {g.email}
                    </div>
                  )}
                  {g.address && (
                    <div className="flex items-center gap-2.5 text-sm text-[#5B6472]">
                      <MapPin className="h-4 w-4 text-[#C9A227]" /> {g.address}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <Users className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Belum ada data orang tua / wali</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
