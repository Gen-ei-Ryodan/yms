"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Plus, Search, Trash2, UserPlus, UserMinus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const selectClass = "w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30";
  const inputClass = "h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30 text-sm";

  const fetchEnrollments = async () => {
    try {
      const response = await axios.get("/enrollments", { params: { per_page: 50 } });
      setEnrollments(response.data.data);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
    Promise.all([axios.get("/students"), axios.get("/classes")]).then(([s, c]) => {
      setStudents(s.data.data);
      setClasses(c.data.data);
    });
  }, []);

  const handleSave = async () => {
    try {
      await axios.post("/enrollments", { ...formData, enrolled_at: new Date().toISOString() });
      setShowForm(false);
      setFormData({});
      fetchEnrollments();
    } catch (error) {
      console.error("Failed to save enrollment:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Hapus enrollment ini?")) {
      await axios.delete(`/enrollments/${id}`);
      fetchEnrollments();
    }
  };

  const activeCount = enrollments.filter(e => e.status === "ACTIVE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data enrollment...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Enrollment</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Class Enrollment</h1>
              <p className="text-white/60 text-lg">Kelola pendaftaran kelas siswa</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold rounded-xl transition-all shadow-lg shadow-[#C9A227]/25"
            >
              <UserPlus className="h-4 w-4" /> Daftarkan Siswa
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Enrollment", value: enrollments.length, icon: UserPlus, color: "bg-blue-500" },
            { label: "Aktif", value: activeCount, icon: Eye, color: "bg-emerald-500" },
            { label: "Non-Aktif", value: enrollments.length - activeCount, icon: UserMinus, color: "bg-amber-500" },
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
              placeholder="Cari enrollment..."
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
                <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kursus</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal Mulai</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map((e, i) => (
                <tr key={e.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <UserPlus className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{e.student?.full_name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-[#5B6472]">{e.class?.class_code}</td>
                  <td className="p-4 text-[#5B6472]">{e.class?.course?.name}</td>
                  <td className="p-4 text-[#5B6472]">{e.start_date}</td>
                  <td className="p-4"><Badge className={`${getStatusColor(e.status)} font-medium`}>{e.status}</Badge></td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-[#8A93A3] hover:text-red-600 transition-colors"
                    >
                      <UserMinus className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title="Daftarkan Siswa" size="md">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Siswa</label>
            <select value={formData.student_id || ""} onChange={(e) => setFormData({ ...formData, student_id: e.target.value })} className={selectClass}>
              <option value="">Pilih Siswa</option>
              {students.map((s: any) => <option key={s.id} value={s.id}>{s.full_name} ({s.student_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kelas</label>
            <select value={formData.class_id || ""} onChange={(e) => setFormData({ ...formData, class_id: e.target.value })} className={selectClass}>
              <option value="">Pilih Kelas</option>
              {classes.map((c: any) => <option key={c.id} value={c.id}>{c.course?.name} - {c.level?.name} ({c.class_code})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Tanggal Mulai</label>
            <Input type="date" value={formData.start_date || ""} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} className={inputClass} />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button variant="outline" onClick={() => setShowForm(false)} className="border-[#0B1526]/10 text-[#5B6472] hover:bg-[#F5F2EB]">Batal</Button>
            <Button onClick={handleSave} className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/25">Daftarkan</Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
