"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Edit, Trash2, Eye, Calendar, Clock, BookOpen, UserCheck } from "lucide-react";
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

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";

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

  const handleDelete = async (id: number) => {
    if (confirm("Hapus data absensi ini?")) {
      await axios.delete(`/teacher-attendance/${id}`);
      fetchAttendances();
    }
  };

  const todayCount = attendances.filter(a => a.date === new Date().toISOString().split("T")[0]).length;
  const presentCount = attendances.filter(a => a.status === "PRESENT").length;
  const lateCount = attendances.filter(a => a.status === "LATE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data absensi guru...</p>
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
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Absensi Guru</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Teacher Attendance</h1>
              <p className="text-white/60 text-lg">Kelola kehadiran pengajar</p>
            </div>
            <button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <Plus className="h-4 w-4" /> Catat Absensi
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Hari Ini", value: todayCount, icon: Calendar, color: "bg-blue-500" },
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
              placeholder="Cari absensi guru..."
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Guru</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Check-in</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {attendances.map((a, i) => (
                <tr key={a.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{a.teacher?.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{a.date}</td>
                  <td className="p-4 text-[#5B6472]">{a.check_in || "N/A"}</td>
                  <td className="p-4">
                    <Badge className={`${getStatusColor(a.status)} font-medium`}>{a.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedAttendance(a); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors"><Eye className="h-4 w-4" /></button>
                      <button onClick={() => { setFormData(a); setShowForm(true); }} className="p-2 rounded-lg hover:bg-blue-50 text-[#8A93A3] hover:text-blue-600 transition-colors"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Absensi">
        {selectedAttendance && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedAttendance.teacher?.name}</h3>
                <p className="text-sm text-[#8A93A3]">{selectedAttendance.date}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Check-in</p>
                  <p className="font-semibold text-[#0B1526]">{selectedAttendance.check_in || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Check-out</p>
                  <p className="font-semibold text-[#0B1526]">{selectedAttendance.check_out || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className={`${getStatusColor(selectedAttendance.status)} font-medium`}>{selectedAttendance.status}</Badge>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Metode</p>
                  <Badge variant="outline" className="border-[#0B1526]/10 text-[#5B6472]">{selectedAttendance.method || "N/A"}</Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Absensi" : "Catat Absensi"} size="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Guru</label>
            <select value={formData.teacher_id || ""} onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })} className={selectClass}>
              <option value="">Pilih Guru</option>
              {teachers.map((t: any) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal</label>
              <Input type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Status</label>
              <select value={formData.status || "PRESENT"} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className={selectClass}>
                <option value="PRESENT">Hadir</option>
                <option value="LATE">Terlambat</option>
                <option value="ABSENT">Alpha</option>
                <option value="LEAVE">Cuti</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Check-in</label>
              <Input type="time" value={formData.check_in || ""} onChange={(e) => setFormData({ ...formData, check_in: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Check-out</label>
              <Input type="time" value={formData.check_out || ""} onChange={(e) => setFormData({ ...formData, check_out: e.target.value })} className="h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Simpan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
