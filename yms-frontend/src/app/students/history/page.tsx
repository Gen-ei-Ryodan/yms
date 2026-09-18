"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import {
  Loader2, Search, Eye, GraduationCap, Users, UserCheck,
  ChevronLeft, ChevronRight, MapPin, Phone, Mail, School, BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

interface Student {
  id: number;
  full_name: string;
  student_code: string;
  student_number?: string;
  status: string;
  join_date: string;
  membership_status?: string;
  gender?: string;
  place_of_birth?: string;
  date_of_birth?: string;
  phone?: string;
  email?: string;
  address?: string;
  school_name?: string;
  school_grade?: string;
}

export default function StudentHistoryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showPanel, setShowPanel] = useState(false);

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

  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === "ACTIVE").length;

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
              <p className="text-sm font-semibold text-[#0B1526]">Memuat riwayat siswa...</p>
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
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Riwayat Siswa</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Student History</h1>
            <p className="text-white/60 text-lg">Lihat riwayat dan detail data siswa Yamaha Music School</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StatCard title="Total Siswa" value={totalStudents} icon={Users} color="blue" />
          <StatCard title="Aktif" value={activeStudents} icon={UserCheck} color="green" />
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan nama, kode, atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">Daftar Riwayat Siswa</h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">{students.length} siswa terdaftar</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Siswa</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Kode</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Status</th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">Masuk</th>
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
                    <td className="p-4 text-[#5B6472]">
                      <ClientDate date={student.join_date} format="date" />
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(student.membership_status || "N/A")}>{student.membership_status || "N/A"}</Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-[#5B6472] hover:text-[#0B1526] hover:bg-[#0B1526]/5"
                        onClick={() => { setSelectedStudent(student); setShowPanel(true); }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Riwayat Siswa" size="lg">
        {selectedStudent && (
          <div className="space-y-6">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Status</p>
                <Badge className={getStatusColor(selectedStudent.status)}>{selectedStudent.status}</Badge>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Tanggal Masuk</p>
                <p className="font-semibold text-[#0B1526]"><ClientDate date={selectedStudent.join_date} format="date" /></p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Jenis Kelamin</p>
                <p className="font-semibold text-[#0B1526] capitalize">{selectedStudent.gender || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Tempat, Tanggal Lahir</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.place_of_birth || "N/A"}, {selectedStudent.date_of_birth || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Telepon</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.phone || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Email</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.email || "N/A"}</p>
              </div>
              <div className="col-span-2 p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Alamat</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.address || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Sekolah</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.school_name || "N/A"}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Kelas</p>
                <p className="font-semibold text-[#0B1526]">{selectedStudent.school_grade || "N/A"}</p>
              </div>
              <div className="col-span-2 p-4 bg-white rounded-xl border border-[#0B1526]/5">
                <p className="text-xs text-[#8A93A3] uppercase font-semibold mb-1">Membership</p>
                <Badge className={getStatusColor(selectedStudent.membership_status || "N/A")}>{selectedStudent.membership_status || "N/A"}</Badge>
              </div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
