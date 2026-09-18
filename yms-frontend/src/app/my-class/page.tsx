"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, GraduationCap, Clock, MapPin, User, BookOpen, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyClassPage() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyClass = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/enrollments", {
            params: { student_id: studentId, status: "ACTIVE", per_page: 1 },
          });
          setEnrollment(response.data.data[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch my class:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMyClass();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat kelas saya...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Kelas Saya</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Kelas Saya</h1>
            <p className="text-white/60 text-lg">Informasi kelas aktif Anda</p>
          </div>
        </div>

        {enrollment ? (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-bold text-[#0B1526]">{enrollment.class?.course?.name}</h3>
                <p className="text-[#8A93A3]">{enrollment.class?.class_code} · {enrollment.class?.level?.name}</p>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktif</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                <User className="h-5 w-5 text-[#C9A227]" />
                <span className="text-sm font-medium text-[#0B1526]">Guru: {enrollment.class?.teacher?.name}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                <MapPin className="h-5 w-5 text-[#C9A227]" />
                <span className="text-sm font-medium text-[#0B1526]">Ruangan: {enrollment.class?.room?.name}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                <Calendar className="h-5 w-5 text-[#C9A227]" />
                <span className="text-sm font-medium text-[#0B1526]">Mulai: {enrollment.start_date}</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                <BookOpen className="h-5 w-5 text-[#C9A227]" />
                <span className="text-sm font-medium text-[#0B1526]">Kapasitas: {enrollment.class?.capacity}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <GraduationCap className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Belum ada kelas aktif</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
