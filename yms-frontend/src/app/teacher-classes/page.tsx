"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, BookOpen, Users, TrendingUp, School, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function TeacherClassesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/reports/teachers")
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data kelas guru...</p>
              <p className="text-xs text-[#8A93A3] mt-1">Mohon tunggu sebentar</p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalClasses = data?.reduce((sum: number, t: any) => sum + (t.total_classes || 0), 0) || 0;
  const totalStudents = data?.reduce((sum: number, t: any) => sum + (t.total_students || 0), 0) || 0;

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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Kelas Guru</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Teacher Classes</h1>
            <p className="text-white/60 text-lg">Overview of teacher assignments and classes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Guru", value: data?.length || 0, icon: Users, color: "bg-blue-500" },
            { label: "Total Kelas", value: totalClasses, icon: School, color: "bg-emerald-500" },
            { label: "Total Murid", value: totalStudents, icon: BookOpen, color: "bg-amber-500" },
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

        {/* Teacher Cards */}
        <div className="space-y-4">
          {data?.map((teacher: any) => (
            <div key={teacher.teacher_code} className="bg-white rounded-2xl border border-[#0B1526]/5 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                    <span className="text-lg font-bold text-[#C9A227]">{teacher.name?.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#0B1526]">{teacher.name}</h3>
                    <p className="text-sm text-[#8A93A3]">{teacher.teacher_code} · {teacher.specialization}</p>
                  </div>
                </div>
                <Badge className={`${getStatusColor(teacher.status)} font-medium`}>{teacher.status}</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#F5F2EB] rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <School className="h-4 w-4 text-[#8A93A3]" />
                  <span className="text-sm text-[#5B6472]">Kelas: <span className="font-semibold text-[#0B1526]">{teacher.active_classes}/{teacher.total_classes}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-[#8A93A3]" />
                  <span className="text-sm text-[#5B6472]">Murid: <span className="font-semibold text-[#0B1526]">{teacher.total_students}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-[#8A93A3]" />
                  <span className="text-sm text-[#5B6472]">Sesi: <span className="font-semibold text-[#0B1526]">{teacher.total_sessions}</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#8A93A3]" />
                  <span className="text-sm text-[#5B6472]">Kehadiran: <span className="font-semibold text-[#0B1526]">{teacher.attendance_rate}%</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
