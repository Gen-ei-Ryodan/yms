"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, QrCode, Camera, Clock, CalendarCheck, Users, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function AttendancePage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [studentCode, setStudentCode] = useState("");
  const [scheduleId, setScheduleId] = useState("");
  const [schedules, setSchedules] = useState<any[]>([]);

  const fetchAttendances = async () => {
    try {
      const response = await axios.get("/attendance", { params: { per_page: 50 } });
      setAttendances(response.data.data);
    } catch (error) {
      console.error("Failed to fetch attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
    axios.get("/schedules").then(r => setSchedules(r.data.data));
  }, []);

  const handleCheckIn = async () => {
    try {
      await axios.post("/attendance/check-in", {
        student_code: studentCode,
        schedule_id: scheduleId,
        method: "QR",
      });
      setStudentCode("");
      setScheduleId("");
      fetchAttendances();
    } catch (error: any) {
      alert(error.response?.data?.message || "Check-in failed");
    }
  };

  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";
  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";

  const todayCount = attendances.filter(a => a.attendance_date === new Date().toISOString().split("T")[0]).length;
  const presentCount = attendances.filter(a => a.status === "PRESENT").length;
  const lateCount = attendances.filter(a => a.status === "LATE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-ink-900" />
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
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Absensi Siswa</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Student Attendance</h1>
              <p className="text-white/60 text-lg">QR/Barcode check-in system</p>
            </div>
            <button
              onClick={() => setShowQR(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Camera className="h-4 w-4" /> QR Check-in
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Hari Ini", value: todayCount, icon: CalendarCheck, color: "bg-blue-500" },
            { label: "Hadir", value: presentCount, icon: CheckCircle, color: "bg-emerald-500" },
            { label: "Terlambat", value: lateCount, icon: Clock, color: "bg-amber-500" },
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

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari absensi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Metode</th>
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
                        <Users className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{a.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{a.class?.course?.name}</td>
                  <td className="p-4 text-[#5B6472]">{a.check_in_time || "N/A"}</td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(a.status)} font-medium`}>{a.status}</Badge>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{a.method}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => { setSelectedAttendance(a); setShowPanel(true); }}
                      className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Check-in Panel */}
      <SlidePanel open={showQR} onClose={() => setShowQR(false)} title="QR Check-in" size="md">
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center p-8 bg-[#F5F2EB] rounded-2xl border border-[#0B1526]/5">
            <div className="flex items-center justify-center w-24 h-24 rounded-2xl bg-[#0B1526] shadow-xl mb-4">
              <QrCode className="h-12 w-12 text-[#C9A227]" />
            </div>
            <p className="text-sm text-[#8A93A3] text-center">Scan QR code atau masukkan kode siswa</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kode Siswa</label>
            <Input
              placeholder="YMS-00001"
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Jadwal</label>
            <select
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              className={selectClass}
            >
              <option value="">Pilih Jadwal</option>
              {schedules.map((s: any) => (
                <option key={s.id} value={s.id}>{s.class?.course?.name} - {s.day_of_week} {s.start_time}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowQR(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">
              Batal
            </Button>
            <Button
              onClick={handleCheckIn}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25"
            >
              Check-in
            </Button>
          </div>
        </div>
      </SlidePanel>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Absensi">
        {selectedAttendance && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-[#C9A227]" />
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
                  <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{selectedAttendance.method}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
