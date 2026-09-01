"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Calendar, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function TeacherAttendancePage() {
  const [attendances, setAttendances] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAttendance, setSelectedAttendance] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [teachers, setTeachers] = useState<any[]>([]);

  const fetchAttendances = async () => {
    try {
      const response = await axios.get("/teacher-attendance", { params: { per_page: 50 } });
      setAttendances(response.data.data);
    } catch (error) {
      console.error("Failed to fetch teacher attendances:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendances();
    axios.get("/teachers").then(r => setTeachers(r.data.data));
  }, []);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/teacher-attendance/${formData.id}`, formData);
      } else {
        await axios.post("/teacher-attendance", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchAttendances();
    } catch (error) {
      console.error("Failed to save attendance:", error);
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
            <h1 className="text-2xl font-bold">Teacher Attendance</h1>
            <p className="text-gray-500 dark:text-gray-400">Manage teacher attendance</p>
          </div>
          <Button onClick={() => { setFormData({}); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Record Attendance
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
                <th className="text-left p-3 font-medium">Teacher</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Check-in</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-right p-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a) => (
                <tr key={a.id} className="border-t border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="p-3 font-medium">{a.teacher?.name}</td>
                  <td className="p-3">{a.date}</td>
                  <td className="p-3">{a.check_in || "N/A"}</td>
                  <td className="p-3"><Badge className={getStatusColor(a.status)}>{a.status}</Badge></td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedAttendance(a); setShowPanel(true); }}><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => { setFormData(a); setShowForm(true); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => axios.delete(`/teacher-attendance/${a.id}`).then(() => fetchAttendances())}><Trash2 className="h-4 w-4 text-red-500" /></Button>
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
              <h3 className="text-xl font-bold">{selectedAttendance.teacher?.name}</h3>
              <p className="text-gray-500">{selectedAttendance.date}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Check-in</p><p className="font-medium">{selectedAttendance.check_in || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Check-out</p><p className="font-medium">{selectedAttendance.check_out || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><p className="font-medium">{selectedAttendance.status}</p></div>
              <div><p className="text-xs text-gray-500">Method</p><p className="font-medium">{selectedAttendance.method}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Attendance" : "Record Attendance"} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Teacher</label>
            <select value={formData.teacher_id || ""} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
              <option value="">Select Teacher</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <Input type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select value={formData.status || "PRESENT"} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm">
                <option value="PRESENT">PRESENT</option>
                <option value="LATE">LATE</option>
                <option value="ABSENT">ABSENT</option>
                <option value="LEAVE">LEAVE</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Check-in</label>
              <Input type="time" value={formData.check_in || ""} onChange={(e) => setFormData({ ...formData, check_in: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Check-out</label>
              <Input type="time" value={formData.check_out || ""} onChange={(e) => setFormData({ ...formData, check_out: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}