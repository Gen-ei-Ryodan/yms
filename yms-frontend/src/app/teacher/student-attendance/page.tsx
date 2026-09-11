"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, CheckCircle, XCircle, MinusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const STATUS_MAP: Record<string, { icon: string; label: string; color: string }> = {
  PRESENT: { icon: "✓", label: "Hadir", color: "text-green-600" },
  LATE: { icon: "✓", label: "Hadir", color: "text-yellow-600" },
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
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Absensi Murid</h1>
          <p className="text-sm text-gray-500 mt-1">Lihat absensi murid berdasarkan kelas</p>
        </div>

        {/* Class Tabs */}
        <div className="flex gap-2 flex-wrap">
          {classes.map(c => (
            <button key={c.id} onClick={() => setSelectedClass(c.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedClass === c.id ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {c.class_code}
            </button>
          ))}
        </div>

        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Tanggal:</label>
          <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
            className="px-3 py-1.5 rounded-md border border-gray-300 text-sm" />
        </div>

        {/* Legend */}
        <div className="flex gap-4 text-sm">
          <span className="flex items-center gap-1"><span className="text-green-600 font-bold">✓</span> Hadir</span>
          <span className="flex items-center gap-1"><span className="text-red-600 font-bold">X</span> Alpha</span>
          <span className="flex items-center gap-1"><span className="text-orange-600 font-bold">C</span> Cuti</span>
          <span className="flex items-center gap-1"><span className="text-blue-600 font-bold">L</span> Libur</span>
          <span className="flex items-center gap-1"><span className="text-purple-600 font-bold">I</span> Izin</span>
        </div>

        {/* Attendance List */}
        {activeClass && (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">{activeClass.class_code}</h2>
              <p className="text-sm text-gray-500">{activeClass.course?.name} {activeClass.level?.name}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="text-left p-3 font-medium w-8">#</th>
                  <th className="text-left p-3 font-medium">Nama</th>
                  <th className="text-center p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Waktu</th>
                  <th className="text-left p-3 font-medium">Metode</th>
                </tr>
              </thead>
              <tbody>
                {(activeClass.enrollments || []).map((enr: any, i: number) => {
                  const att = attendances.find((a: any) => a.student_id === enr.student_id);
                  const status = att ? STATUS_MAP[att.status] || { icon: "?", label: att.status, color: "text-gray-500" } : null;
                  return (
                    <tr key={enr.student_id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-500">{i + 1}</td>
                      <td className="p-3 font-medium">{enr.student?.full_name}</td>
                      <td className="p-3 text-center">
                        {status ? (
                          <span className={`text-lg font-bold ${status.color}`} title={status.label}>{status.icon}</span>
                        ) : (
                          <span className="text-gray-300">–</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-500">{att?.check_in || "–"}</td>
                      <td className="p-3 text-gray-500">{att?.method || "–"}</td>
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
