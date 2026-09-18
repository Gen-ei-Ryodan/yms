"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Plus, Search, Edit, Trash2, Eye, Filter, Download,
  GraduationCap, Users, UserCheck, UserX, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusColor, formatDate } from "@/lib/utils";

export default function StudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/students", { params: { search, per_page: 50 } });
      setStudents(response.data.data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, [search]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  const handleSave = async () => {
    try {
      if (formData.id) {
        await axios.put(`/students/${formData.id}`, formData);
      } else {
        await axios.post("/students", formData);
      }
      setShowForm(false);
      setFormData({});
      fetchStudents();
    } catch (error) {
      console.error("Failed to save student:", error);
    }
  };

  // Calculate stats
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "ACTIVE").length;
  const inactiveStudents = students.filter(s => s.status === "INACTIVE").length;

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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat data siswa...</p>
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
                <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Manajemen Siswa</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Student Management</h1>
              <p className="text-white/60 text-lg">Kelola seluruh data siswa Yamaha Music School</p>
            </div>
            <Button
              onClick={() => { setFormData({}); setShowForm(true); }}
              className="bg-[#C9A227] hover:bg-[#E6C65C] text-[#0B1526] font-semibold shadow-lg shadow-[#C9A227]/20"
            >
              <Plus className="h-4 w-4 mr-2" /> Tambah Siswa
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Total Siswa" value={totalStudents} icon={Users} color="blue" />
          <StatCard title="Siswa Aktif" value={activeStudents} icon={UserCheck} color="green" />
          <StatCard title="Tidak Aktif" value={inactiveStudents} icon={UserX} color="red" />
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
              <Input
                placeholder="Cari berdasarkan nama, kode, atau email..."
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
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Siswa</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{students.length} siswa terdaftar</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Siswa</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Membership</th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#C9A227]">
                            {student.full_name?.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0B1526]">{student.full_name}</p>
                          <p className="text-xs text-[#8A93A3]">{student.student_number}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#5B6472] bg-[#F5F2EB]/20">{student.student_code}</td>
                    <td className="p-4">
                      <Badge className={getStatusColor(student.status)}>{student.status}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(student.membership_status)}>{student.membership_status}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                          onClick={() => { setSelectedStudent(student); setShowPanel(true); }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C9A227] hover:bg-[#C9A227]/10"
                          onClick={() => { setFormData(student); setShowForm(true); }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-[#5B6472] hover:text-[#C2542E] hover:bg-[#C2542E]/10"
                          onClick={() => handleDelete(student.id)}
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
                Menampilkan <span className="font-semibold text-[#0B1526]">{students.length}</span> dari <span className="font-semibold text-[#0B1526]">{students.length}</span> siswa
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
      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Siswa" size="lg">
        {selectedStudent && (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex items-center gap-4 p-4 bg-[#F5F2EB]/50 rounded-xl">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-[#C9A227]">
                  {selectedStudent.full_name?.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedStudent.full_name}</h3>
                <p className="text-[#5B6472] font-mono">{selectedStudent.student_code}</p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Jenis Kelamin</p>
                <p className="font-semibold text-[#0B1526] capitalize">{selectedStudent.gender}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Tanggal Lahir</p>
                <p className="font-semibold text-[#0B1526]">{formatDate(selectedStudent.date_of_birth)}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Telepon</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.phone || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Email</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.email || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Sekolah</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.school_name || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Tanggal Bergabung</p>
                <p className="font-semibold text-[#0B1526]">{formatDate(selectedStudent.join_date)}</p>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>

      {/* Form Slide Panel */}
      <SlidePanel open={showForm} onClose={() => setShowForm(false)} title={formData.id ? "Edit Siswa" : "Tambah Siswa"} size="lg">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nama Lengkap</label>
              <Input
                value={formData.full_name || ""}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Nomor Siswa</label>
              <Input
                value={formData.student_number || ""}
                onChange={(e) => setFormData({ ...formData, student_number: e.target.value })}
                className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0B1526] mb-2">Jenis Kelamin</label>
              <select
                value={formData.gender || "male"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
              </select>
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
                <option value="SUSPENDED">Diskors</option>
                <option value="GRADUATED">Lulus</option>
                <option value="TRANSFERRED">Pindah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Email</label>
            <Input
              type="email"
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B1526] mb-2">Telepon</label>
            <Input
              value={formData.phone || ""}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
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
              {formData.id ? "Simpan Perubahan" : "Tambah Siswa"}
            </Button>
          </div>
        </div>
      </SlidePanel>
    </MainLayout>
  );
}
