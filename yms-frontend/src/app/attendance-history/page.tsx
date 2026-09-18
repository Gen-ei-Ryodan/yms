"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, Filter, Calendar, Clock, BookOpen, User, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function AttendanceHistoryPage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const fetchHistory = async () => {
    try {
      const params: any = { per_page: 100 };
      if (filterMonth) {
        const [year, month] = filterMonth.split("-");
        params.year = year;
        params.month = month;
      }
      if (filterStatus) params.status = filterStatus;
      
      const response = await axios.get("/attendance", { params });
      setAttendances(response.data.data);
    } catch (error) {
      console.error("Failed to fetch attendance history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, [filterMonth, filterStatus]);

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
            <p className="text-white/60 text-lg">Lihat seluruh riwayat kehadiran</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex gap-4 flex-wrap items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-[#8A93A3]" />
            <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-40 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
            <option value="">Semua Status</option>
            <option value="PRESENT">Hadir</option>
            <option value="LATE">Terlambat</option>
            <option value="ABSENT">Alpha</option>
            <option value="EXCUSED">Izin</option>
            <option value="ON_LEAVE">Cuti</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Check-in</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a, i) => (
                <tr key={a.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4 text-[#5B6472]">{a.attendance_date}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{a.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{a.class?.course?.name}</td>
                  <td className="p-4 text-[#5B6472]">{a.check_in_time || "N/A"}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(a.status)} font-medium`}>{a.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button onClick={() => { setSelectedAttendance(a); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Absensi">
        {selectedAttendance && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <User className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedAttendance.student?.full_name}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedAttendance.class?.course?.name}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Tanggal</p>
                  <p className="font-semibold text-[#0B1526]">{selectedAttendance.attendance_date}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Check-in</p>
                  <p className="font-semibold text-[#0B1526]">{selectedAttendance.check_in_time || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedAttendance.status)} font-medium`}>{selectedAttendance.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Metode</p>
                  <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472] font-medium">{selectedAttendance.method}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
