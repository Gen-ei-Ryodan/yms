"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function StudentAttendanceHistoryPage() {
  const { user } = useAuth();
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const studentId = user?.student?.id;
        if (studentId) {
          const params: any = { student_id: studentId, per_page: 50 };
          if (filterMonth) {
            const [year, month] = filterMonth.split("-");
            params.year = year;
            params.month = month;
          }
          const response = await axios.get(`/attendance/student/${studentId}`, { params });
          setAttendances(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, filterMonth]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat riwayat absensi...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Riwayat Absensi</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Riwayat Absensi</h1>
            <p className="text-white/60 text-lg">Riwayat kehadiran Anda</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex items-center gap-4">
          <Calendar className="h-4 w-4 text-[#8A93A3]" />
          <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Check-in</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a, i) => (
                <tr key={a.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 text-[#5B6472]">{a.attendance_date}</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{a.class?.course?.name}</td>
                  <td className="p-4 text-[#5B6472]">{a.check_in_time || "N/A"}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(a.status)} font-medium`}>{a.status}</Badge></td>
                </tr>
              ))}
              {attendances.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-[#5B6472]">Belum ada riwayat absensi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
