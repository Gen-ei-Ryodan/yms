"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, CalendarClock, Clock, BookOpen, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function ScheduleChangesPage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/schedules", { params: { per_page: 50 } })
      .then((r) => setSchedules(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat jadwal...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Pergantian Jadwal</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Schedule Changes</h1>
            <p className="text-white/60 text-lg">Kelola perubahan jadwal kelas</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Jadwal", value: schedules.length, icon: CalendarClock, color: "bg-blue-500" },
            { label: "Aktif", value: schedules.filter(s => s.status === "ACTIVE").length, icon: Clock, color: "bg-emerald-500" },
            { label: "Non-Aktif", value: schedules.filter(s => s.status !== "ACTIVE").length, icon: BookOpen, color: "bg-amber-500" },
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

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Hari</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Jam</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Guru</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Ruangan</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Berlaku</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, i) => (
                <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <div>
                        <p className="font-semibold text-[#0B1526]">{s.class?.class_code}</p>
                        <p className="text-xs text-[#8A93A3]">{s.class?.course?.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4"><Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{s.day_of_week}</Badge></td>
                  <td className="p-4 text-[#5B6472]">{s.start_time} - {s.end_time}</td>
                  <td className="p-4 text-[#5B6472]">{s.teacher?.name}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-[#5B6472]">
                      <MapPin className="h-3.5 w-3.5 text-[#8A93A3]" />
                      {s.room?.name}
                    </div>
                  </td>
                  <td className="p-4"><Badge className={`${getStatusColor(s.status)} font-medium`}>{s.status}</Badge></td>
                  <td className="p-4 text-[#8A93A3] text-xs">{s.effective_from} s/d {s.effective_until || "∞"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
