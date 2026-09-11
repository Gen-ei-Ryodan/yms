"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, Filter, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function AdminAttendanceHistoryPage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  const fetchData = async () => {
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
      console.error("Failed to fetch attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [filterMonth, filterStatus]);

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
          <p className="text-sm text-gray-500 mt-1">View all attendance history</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-40" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 bg-white text-sm">
            <option value="">Semua Status</option>
            <option value="PRESENT">Hadir</option>
            <option value="LATE">Terlambat</option>
            <option value="ABSENT">Alpha</option>
            <option value="EXCUSED">Izin</option>
            <option value="ON_LEAVE">Cuti</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Tanggal</th>
                <th className="text-left p-3 font-medium">Siswa</th>
                <th className="text-left p-3 font-medium">Kelas</th>
                <th className="text-left p-3 font-medium">Check-in</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3 font-medium">{a.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{a.class?.course?.name}</td>
                  <td className="p-3">{a.check_in_time || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedAttendance(a); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Absensi">
        {selectedAttendance && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedAttendance.student?.full_name}</h3>
              <p className="text-gray-500">{selectedAttendance.class?.course?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Tanggal</p><p className="font-medium">{selectedAttendance.attendance_date}</p></div>
              <div><p className="text-xs text-gray-500">Check-in</p><p className="font-medium">{selectedAttendance.check_in_time || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedAttendance.status)}>{selectedAttendance.status}</Badge></div>
              <div><p className="text-xs text-gray-500">Metode</p><p className="font-medium">{selectedAttendance.method}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
