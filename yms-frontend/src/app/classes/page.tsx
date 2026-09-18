"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Users, GraduationCap, BookOpen,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";

export default function ClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/classes", { params: { search, per_page: 50 } });
      setClasses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    Promise.all([
      axios.get("/courses"),
      axios.get("/teachers"),
      axios.get("/rooms"),
    ]).then(([c, t, r]) => {
      setCourses(c.data.data);
      setTeachers(t.data.data);
      setRooms(r.data.data);
    });
  }, [search]);

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/classes/${formData.id}`, formData);
      } else {
        await axios.post("/classes", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchClasses();
    } catch (error) {
      console.error("Failed to save class:", error);
    }
  };

  const totalClasses = classes.length;
  const activeClasses = classes.filter((c) => c.status === "ACTIVE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <GraduationCap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data kelas...</p>
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
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Kelas</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Class Management</h1>
              <p className="text-white/60 text-lg">Kelola seluruh kelas pembelajaran musik</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Kelas
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Kelas" value={totalClasses} icon={GraduationCap} color="blue" />
          <StatCard title="Kelas Aktif" value={activeClasses} icon={BookOpen} color="green" />
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan kode, nama kelas, atau guru..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Kelas</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{classes.length} kelas terdaftar</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Nama Kelas</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Level</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Guru</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Ruang</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kapasitas</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <GraduationCap className="h-5 w-5 text-[#C9A227]" />
                        </div>
                        <p className="font-semibold text-[#0B1526]">{cls.course?.name || "N/A"}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 bg-[#0B1526]/5 text-[#0B1526] rounded-lg font-mono text-xs font-semibold">
                        {cls.class_code}
                      </span>
                    </td>
                    <td className="p-4 text-[#5B6472]">{cls.level?.name || "N/A"}</td>
                    <td className="p-4 text-[#5B6472]">{cls.teacher?.name || "N/A"}</td>
                    <td className="p-4 text-[#5B6472]">{cls.room?.name || "N/A"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-[#5B6472]">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">{cls.enrolled_count || 0}/{cls.capacity}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(cls.status)}>{cls.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedClass(cls); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(cls); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => axios.delete(`/classes/${cls.id}`).then(() => fetchClasses())}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-[#0B1526]/5 bg-[#F5F2EB]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6472]">
                Menampilkan <span className="font-semibold text-[#0B1526]">{classes.length}</span> dari <span className="font-semibold text-[#0B1526]">{classes.length}</span> kelas
              </p>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10 bg-[#0B1526] text-white hover:bg-[#14233B]">
                  1
                </Button>
                <Button variant="outline" size="sm" className="h-9 border-[#0B1526]/10" disabled>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Kelas" size="lg">
        {selectedClass && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-lg">
                <GraduationCap className="h-8 w-8 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedClass.course?.name}</h3>
                <p className="text-[#5B6472] font-mono">{selectedClass.class_code}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Level</p>
                <p className="font-semibold text-[#0B1526]">{selectedClass.level?.name || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Guru</p>
                <p className="font-semibold text-[#0B1526]">{selectedClass.teacher?.name || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Ruang</p>
                <p className="font-semibold text-[#0B1526]">{selectedClass.room?.name || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Kapasitas</p>
                <p className="font-semibold text-[#0B1526]">{selectedClass.capacity}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Terdaftar</p>
                <p className="font-semibold text-[#0B1526]">{selectedClass.enrolled_count || 0}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Status</p>
                <Badge className={getStatusColor(selectedClass.status)}>{selectedClass.status}</Badge>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Kelas" : "Tambah Kelas"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Program</label>
              <select
                value={formData.course_id || ""}
                onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="">Pilih Program</option>
                {courses.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Level</label>
              <select
                value={formData.level_id || ""}
                onChange={(e) => setFormData({ ...formData, level_id: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="">Pilih Level</option>
                <option value="1">Beginner</option>
                <option value="2">Basic</option>
                <option value="3">Intermediate</option>
                <option value="4">Advanced</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Guru</label>
              <select
                value={formData.teacher_id || ""}
                onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="">Pilih Guru</option>
                {teachers.map((t: any) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Ruang</label>
              <select
                value={formData.room_id || ""}
                onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="">Pilih Ruang</option>
                {rooms.map((r: any) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kapasitas</label>
              <Input
                type="number"
                value={formData.capacity || ""}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Status</label>
              <select
                value={formData.status || "ACTIVE"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="ACTIVE">Aktif</option>
                <option value="INACTIVE">Tidak Aktif</option>
                <option value="FULL">Penuh</option>
                <option value="COMPLETED">Selesai</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#0B1526]/5">
            <Button
              variant="outline"
              onClick={() => setShowForm(false)}
              className="h-11 border-[#0B1526]/10 hover:bg-[#F5F2EB]"
            >
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="h-11 bg-[#0B1526] hover:bg-[#14233B] text-white shadow-lg shadow-[#0B1526]/20"
            >
              {formData.id ? "Simpan Perubahan" : "Tambah Kelas"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
