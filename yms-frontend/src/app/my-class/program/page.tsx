"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Music, TrendingUp, Clock, DollarSign } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyProgramPage() {
  const { user } = useAuth();
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const response = await axios.get("/enrollments", { params: { student_id: studentId, status: "ACTIVE", per_page: 1 } });
          setEnrollment(response.data.data[0] || null);
        }
      } catch (error) {
        console.error("Failed to fetch program:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat program...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const classInfo = enrollment?.class;

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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Program & Level</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Program & Level</h1>
            <p className="text-white/60 text-lg">Program dan level yang Anda ikuti</p>
          </div>
        </div>

        {classInfo ? (
          <div className="space-y-4">
            {/* Program Card */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                    <Music className="h-7 w-7 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#0B1526]">{classInfo.course?.name}</h3>
                    <p className="text-[#8A93A3]">{classInfo.class_code}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktif</Badge>
              </div>
            </div>

            {/* Detail Card */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
              <h3 className="font-bold text-[#0B1526] mb-4">Detail Program</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                  <Music className="h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Program</p>
                    <p className="font-semibold text-[#0B1526]">{classInfo.course?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                  <TrendingUp className="h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Level</p>
                    <p className="font-semibold text-[#0B1526]">{classInfo.level?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                  <Clock className="h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Durasi Sesi</p>
                    <p className="font-semibold text-[#0B1526]">{classInfo.course?.duration} menit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F5F2EB]/50">
                  <DollarSign className="h-5 w-5 text-[#C9A227]" />
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Harga</p>
                    <p className="font-semibold text-[#0B1526]">Rp {Number(classInfo.course?.price || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm">
              <h3 className="font-bold text-[#0B1526] mb-3">Deskripsi Program</h3>
              <p className="text-sm text-[#5B6472]">{classInfo.course?.description || "Tidak ada deskripsi"}</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
            <Music className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
            <p className="text-[#5B6472] font-medium">Belum terdaftar di program manapun</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
