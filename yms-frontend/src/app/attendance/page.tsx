"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, QrCode, Camera } from "lucide-react";
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Student Attendance</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">QR/Barcode check-in system</p>
          </div>
          <Button onClick={() => setShowQR(true)}>
            <Camera className="h-4 w-4 mr-2" /> QR Check-in
          </Button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search attendance..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
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
                <th className="text-left p-3 font-medium">Method</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3">{a.attendance_date}</td>
                  <td className="p-3 font-medium">{a.student?.full_name}</td>
                  <td className="p-3">{a.class?.course?.name}</td>
                  <td className="p-3">{a.check_in_time || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                  <td className="p-3">{a.method}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedAttendance(a); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showQR} onClose={() => setShowQR(false)} title="QR Check-in" size="md">
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <QrCode className="h-32 w-32 text-gray-400 mb-4" />
            <p className="text-sm text-gray-500 text-center">Scan QR code or enter student code manually</p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student Code</label>
            <Input placeholder="YMS-00001" value={studentCode} onChange={(e) => setStudentCode(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Schedule</label>
            <select value={scheduleId} onChange={(e) => setScheduleId(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="">Select Schedule</option>
              {schedules.map((s: any) => <option key={s.id} value={s.id}>{s.class?.course?.name} - {s.day_of_week} {s.start_time}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowQR(false)}>Cancel</Button>
            <Button onClick={handleCheckIn}>Check-in</Button>
          </div>
        </div>
      </SlidePanel>

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