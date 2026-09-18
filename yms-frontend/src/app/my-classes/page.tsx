"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, GraduationCap, BookOpen, User, Clock, Users, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyClassesPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const teacherId = user?.teacher?.id;
        if (teacherId) {
          const response = await axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50 } });
          setClasses(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat kelas...</p>
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
            <h1 className="text-3xl font-bold mb-2">Kelas yang Ditugaskan</h1>
            <p className="text-white/60 text-lg">Daftar kelas yang Anda ampu</p>
          </div>
        </div>

        {classes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <GraduationCap className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Belum ada kelas ditugaskan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1526]">{c.course?.name}</h3>
                    <p className="text-sm text-[#8A93A3]">{c.class_code} · {c.level?.name}</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 font-medium">{c.status}</Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                    <MapPin className="h-4 w-4 text-[#C9A227]" />
                    <span>{c.room?.name} (Cap: {c.capacity})</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                    <Users className="h-4 w-4 text-[#C9A227]" />
                    <span>{c.enrollments_count || 0} siswa</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
