"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Filter, Download,
  Music, BookOpen, Clock, DollarSign, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientNumber } from "@/components/ClientDate";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchCourses = async () => {
    try {
      const response = await axios.get("/courses", { params: { search, per_page: 50 } });
      setCourses(response.data.data);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      await axios.delete(`/courses/${id}`);
      fetchCourses();
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/courses/${formData.id}`, formData);
      } else {
        await axios.post("/courses", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchCourses();
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const totalCourses = courses.length;
  const activeCourses = courses.filter(c => c.status === "ACTIVE").length;

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <Music className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data program...</p>
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
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Program</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Course Management</h1>
              <p className="text-white/60 text-lg">Kelola seluruh program pembelajaran musik</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Program
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Program" value={totalCourses} icon={Music} color="blue" />
          <StatCard title="Program Aktif" value={activeCourses} icon={BookOpen} color="green" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
              <Input
                placeholder="Cari berdasarkan nama, kode, atau level..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <Button variant="outline" className="h-11 border-[#0B1526]/10 hover:bg-[#F5F2EB]">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button variant="outline" className="h-11 border-[#0B1526]/10 hover:bg-[#F5F2EB]">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Program</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{courses.length} program terdaftar</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Nama Program</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Level</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Durasi</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Harga</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => (
                  <tr key={course.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <span className="inline-flex items-center px-3 py-1 bg-[#0B1526]/5 text-[#0B1526] rounded-lg font-mono text-xs font-semibold">
                        {course.code}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#C9A227] to-[#8F6F14] flex items-center justify-center shadow-sm">
                          <Music className="h-5 w-5 text-white" />
                        </div>
                        <p className="font-semibold text-[#0B1526]">{course.name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-[#5B6472]">{course.level || "N/A"}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-[#5B6472]">
                        <Clock className="h-4 w-4" />
                        <span>{course.duration} menit</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-[#0B1526]">
                      <ClientNumber value={course.price} prefix="Rp " />
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(course.status)}>{course.status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedCourse(course); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(course); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => handleDelete(course.id)}
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

          {/* Pagination */}
          <div className="p-4 border-t border-[#0B1526]/5 bg-[#F5F2EB]/20">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[#5B6472]">
                Menampilkan <span className="font-semibold text-[#0B1526]">{courses.length}</span> dari <span className="font-semibold text-[#0B1526]">{courses.length}</span> program
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

      {/* Detail Slide Panel */}
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Program" size="lg">
        {selectedCourse && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-[#C9A227] to-[#8F6F14] flex items-center justify-center shadow-lg">
                <Music className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedCourse.name}</h3>
                <p className="text-[#5B6472] font-mono">{selectedCourse.code}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Level</p>
                <p className="font-semibold text-[#0B1526]">{selectedCourse.level || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Durasi</p>
                <p className="font-semibold text-[#0B1526]">{selectedCourse.duration} menit</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Harga</p>
                <p className="font-semibold text-[#0B1526]">
                  <ClientNumber value={selectedCourse.price} prefix="Rp " />
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Status</p>
                <Badge className={getStatusColor(selectedCourse.status)}>{selectedCourse.status}</Badge>
              </div>
            </div>

            {selectedCourse.description && (
              <div className="p-4 bg-[#F5F2EB]/50 rounded-xl">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-2">Deskripsi</p>
                <p className="text-sm text-[#0B1526] leading-relaxed">{selectedCourse.description}</p>
              </div>
            )}
          </div>
        )}
      </SlidePanel>

      {/* Form Slide Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Program" : "Tambah Program"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Kode Program</label>
              <Input
                value={formData.code || ""}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nama Program</label>
              <Input
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Level</label>
              <Input
                value={formData.level || ""}
                onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Durasi (menit)</label>
              <Input
                type="number"
                value={formData.duration || ""}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Harga (Rp)</label>
              <Input
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
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
            </select>
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
              {formData.id ? "Simpan Perubahan" : "Tambah Program"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
