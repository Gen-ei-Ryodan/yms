"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, Filter, Calendar, Clock, BookOpen, User } from "lucide-react";
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Attendance History</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View attendance history</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Input type="month" value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)} className="w-40" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
            <option value="">All Status</option>
            <option value="PRESENT">Present</option>
            <option value="LATE">Late</option>
            <option value="ABSENT">Absent</option>
            <option value="EXCUSED">Excused</option>
            <option value="ON_LEAVE">On Leave</option>
          </select>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Class</th>
                <th className="text-left p-3 font-medium">Check-in</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3 font-medium">{a.student?.full_name}</td>
                  <td className="p-3 text-gray-500">{a.class?.course?.name}</td>
                  <td className="p-3">{a.check_in_time || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedAttendance(a); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Attendance Details">
        {selectedAttendance && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedAttendance.student?.full_name}</h3>
              <p className="text-gray-500">{selectedAttendance.class?.course?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Date</p><p className="font-medium">{selectedAttendance.attendance_date}</p></div>
              <div><p className="text-xs text-gray-500">Check-in</p><p className="font-medium">{selectedAttendance.check_in_time || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedAttendance.status}</p></div>
              <div><p className="text-xs text-gray-500">Method</p><p className="font-medium">{selectedAttendance.method}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}