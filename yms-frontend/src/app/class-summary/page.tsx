"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, School, Users, CheckCircle, TrendingUp, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ClassSummaryPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/teacher/class-summary");
        setData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch class summary:", error);
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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat rekap kelas...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Rekap Kelas</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Rekap Kelas</h1>
            <p className="text-white/60 text-lg">Ringkasan seluruh kelas yang Anda ampu</p>
          </div>
        </div>

        {data && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Kelas", value: data.total_classes, icon: School, color: "bg-blue-500" },
                { label: "Total Murid", value: data.total_students, icon: Users, color: "bg-emerald-500" },
                { label: "Total Sesi", value: data.total_sessions, icon: BookOpen, color: "bg-purple-500" },
                { label: "Rata-rata Kehadiran", value: `${data.overall_attendance_rate}%`, icon: TrendingUp, color: "bg-amber-500" },
              ].map((stat) => (
                <div key={stat.label} className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} shadow-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-[#8A93A3] font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-[#0B1526]">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Class Cards */}
            <div className="space-y-4">
              {data.classes?.map((cls: any) => (
                <div key={cls.id} className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#0B1526]">{cls.course_name}</h3>
                      <p className="text-sm text-[#8A93A3]">{cls.class_code} · {cls.level_name}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktif</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                      <MapPin className="h-4 w-4 text-[#C9A227]" />
                      <span>Ruangan: {cls.room_name || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                      <Users className="h-4 w-4 text-[#C9A227]" />
                      <span>Murid: {cls.enrolled_count}/{cls.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                      <CheckCircle className="h-4 w-4 text-[#C9A227]" />
                      <span>Sesi: {cls.total_sessions}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#5B6472]">
                      <TrendingUp className="h-4 w-4 text-[#C9A227]" />
                      <span>Kehadiran: {cls.attendance_rate}%</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-[#8A93A3] mb-1.5">
                      <span>Kapasitas</span>
                      <span>{cls.enrolled_count}/{cls.capacity}</span>
                    </div>
                    <div className="w-full bg-[#F5F2EB] rounded-full h-2">
                      <div className="bg-[#C9A227] h-2 rounded-full" style={{ width: `${Math.min((cls.enrolled_count / cls.capacity) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))}
              {(!data.classes || data.classes.length === 0) && (
                <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-8 text-center shadow-sm">
                  <School className="h-14 w-14 mx-auto text-[#8A93A3] mb-3" />
                  <p className="text-[#5B6472] font-medium">Belum ada kelas aktif</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
