"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, { icon: string; label: string; color: string }> = {
  PRESENT: { icon: "✓", label: "Hadir", color: "text-emerald-600" },
  LATE: { icon: "✓", label: "Hadir", color: "text-amber-600" },
  ABSENT: { icon: "X", label: "Alpha", color: "text-red-600" },
  ON_LEAVE: { icon: "C", label: "Cuti", color: "text-orange-600" },
  HOLIDAY: { icon: "L", label: "Libur", color: "text-blue-600" },
  EXCUSED: { icon: "I", label: "Izin", color: "text-purple-600" },
};

export default function TeacherStudentAttendancePage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = user?.teacher?.id;
        if (teacherId) {
          const res = await axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50 } });
          setClasses(res.data.data);
          if (res.data.data.length > 0) setSelectedClass(res.data.data[0].id);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    if (!selectedClass) return;
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("/attendance", { params: { class_id: selectedClass, date: selectedDate, per_page: 100 } });
        setAttendances(res.data.data);
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      }
    };
    fetchAttendance();
  }, [selectedClass, selectedDate]);

  const activeClass = classes.find(c => c.id === selectedClass);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat absensi murid...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Absensi Murid</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Absensi Murid</h1>
            <p className="text-white/60 text-lg">Lihat absensi murid berdasarkan kelas</p>
          </div>
        </div>

        {/* Class Tabs */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 p-2 shadow-sm flex gap-2 flex-wrap">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClass === c.id ? "bg-[#0B1526] text-white shadow-lg shadow-[#0B1526]/20" : "text-[#5B6472] hover:text-[#0B1526] hover:bg-[#F5F2EB]"}`}>
              {c.class_code}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex items-center gap-4">
          <Calendar className="h-4 w-4 text-[#8A93A3]" />
          <label className="text-sm font-medium text-[#0B1526]">Tanggal:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30" />
        </div>

        {/* Legend */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex gap-5 text-sm">
          <span className="flex items-center gap-1.5"><span className="text-emerald-600 font-bold">✓</span> Hadir</span>
          <span className="flex items-center gap-1.5"><span className="text-red-600 font-bold">X</span> Alpha</span>
          <span className="flex items-center gap-1.5"><span className="text-orange-600 font-bold">C</span> Cuti</span>
          <span className="flex items-center gap-1.5"><span className="text-blue-600 font-bold">L</span> Libur</span>
          <span className="flex items-center gap-1.5"><span className="text-purple-600 font-bold">I</span> Izin</span>
        </div>

        {/* Attendance List */}
        {activeClass && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <div className="p-4 bg-[#F5F2EB] border-b border-[#0B1526]/5">
              <h2 className="font-bold text-[#0B1526]">{activeClass.class_code}</h2>
              <p className="text-sm text-[#8A93A3]">{activeClass.course?.name} {activeClass.level?.name}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F5F2EB]/50">
                  <th className="text-left p-4 font-semibold text-[#0B1526] w-8">#</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Nama</th>
                  <th className="text-center p-4 font-semibold text-[#0B1526]">Status</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Waktu</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526]">Metode</th>
                </tr>
              </thead>
              <tbody>
                {(activeClass.enrollments || []).map((enr: any, i: number) => {
                  const att = attendances.find((a: any) => a.student_id === enr.student_id);
                  const status = att ? STATUS_MAP[att.status] || { icon: "?", label: att.status, color: "text-gray-500" } : null;
                  return (
                    <tr key={enr.student_id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                      <td className="p-4 text-[#5B6472]">{i + 1}</td>
                      <td className="p-4 font-semibold text-[#0B1526]">{enr.student?.full_name}</td>
                      <td className="p-4 text-center">
                        {status ? (
                          <span className={`text-lg font-bold ${status.color}`} title={status.label}>{status.icon}</span>
                        ) : (
                          <span className="text-[#8A93A3]">–</span>
                        )}
                      </td>
                      <td className="p-4 text-[#5B6472]">{att?.check_in || "–"}</td>
                      <td className="p-4 text-[#5B6472]">{att?.method || "–"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
