"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Calendar, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
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
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Absensi</h1>
          <p className="text-sm text-gray-500 mt-1">Your attendance history</p>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-gray-400" />
          <input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 text-sm" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-left p-3 font-medium">Kelas</th>
                <th className="text-left p-3 font-medium">Check-in</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3 font-medium">{a.class?.course?.name}</td>
                  <td className="p-3">{a.check_in_time || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                </tr>
              ))}
              {attendances.length === 0 && (
                <tr><td colSpan={4} className="p-8 text-center text-gray-500">Belum ada riwayat absensi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
