"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Users, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function TeacherMyStudentsPage() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teacherId = user?.teacher?.id;
        if (teacherId) {
          const res = await axios.get("/classes", { params: { teacher_id: teacherId, per_page: 50, with: "enrollments.student.user" } });
          setClasses(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch classes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const allStudents = classes.flatMap(c =>
    (c.enrollments || []).map((e: any) => ({
      ...e.student,
      class_name: c.class_code,
      course: c.course?.name,
      level: c.level?.name,
      class_id: c.id,
    }))
  ).filter(s => !search || s.full_name?.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat daftar murid...</p>
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
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Daftar Murid</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Daftar Murid</h1>
            <p className="text-white/60 text-lg">Murid dari kelas yang Anda ajar</p>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input placeholder="Cari nama murid..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30" />
          </div>
        </div>

        {/* Classes & Students */}
        {classes.map((cls) => {
          const students = (cls.enrollments || []).map((e: any) => e.student).filter(Boolean);
          const filtered = search ? students.filter((s: any) => s.full_name?.toLowerCase().includes(search.toLowerCase())) : students;
          if (filtered.length === 0) return null;
          return (
            <div key={cls.id} className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <div className="p-4 bg-[#F5F2EB] border-b border-[#0B1526]/5">
                <h2 className="font-bold text-[#0B1526]">{cls.class_code}</h2>
                <p className="text-sm text-[#8A93A3]">{cls.course?.name} {cls.level?.name}</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#F5F2EB]/50">
                    <th className="text-left p-4 font-semibold text-[#0B1526] w-8">#</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Nama</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Program</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Level</th>
                    <th className="text-right p-4 font-semibold text-[#0B1526]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s: any, i: number) => (
                    <tr key={s.id} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                      <td className="p-4 text-[#5B6472]">{i + 1}</td>
                      <td className="p-4 font-semibold text-[#0B1526]">{s.full_name}</td>
                      <td className="p-4 text-[#5B6472]">{cls.course?.name}</td>
                      <td className="p-4 text-[#5B6472]">{cls.level?.name}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => { setSelectedStudent({ ...s, class_code: cls.class_code, course: cls.course?.name, level: cls.level?.name }); setShowPanel(true); }} className="p-2 rounded-lg hover:bg-[#C9A227]/10 text-[#8A93A3] hover:text-[#C9A227] transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Detail Murid">
        {selectedStudent && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#0B1526] flex items-center justify-center shadow-lg">
                <Users className="h-7 w-7 text-[#C9A227]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#0B1526]">{selectedStudent.full_name}</h3>
                <p className="text-sm text-[#8A93A3]">Kelas {selectedStudent.class_code}</p>
              </div>
            </div>
            <div className="bg-[#F5F2EB] rounded-2xl p-5 border border-[#0B1526]/5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Program</p>
                  <p className="font-semibold text-[#0B1526]">{selectedStudent.course}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Level</p>
                  <p className="font-semibold text-[#0B1526]">{selectedStudent.level}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Kelas</p>
                  <p className="font-semibold text-[#0B1526]">{selectedStudent.class_code}</p>
                </div>
                <div>
                  <p className="text-xs text-[#8A93A3] font-medium mb-1">Status</p>
                  <Badge className="bg-emerald-100 text-emerald-800 font-medium">Aktif</Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <a href={`/student-progress?student_id=${selectedStudent.id}`} className="px-4 py-2 rounded-xl bg-[#0B1526]/5 text-sm font-medium text-[#0B1526] hover:bg-[#C9A227]/10 transition-colors">Progress →</a>
              <a href={`/student/attendance-history?student_id=${selectedStudent.id}`} className="px-4 py-2 rounded-xl bg-[#0B1526]/5 text-sm font-medium text-[#0B1526] hover:bg-[#C9A227]/10 transition-colors">Absensi →</a>
              <a href={`/learning-notes?student_id=${selectedStudent.id}`} className="px-4 py-2 rounded-xl bg-[#0B1526]/5 text-sm font-medium text-[#0B1526] hover:bg-[#C9A227]/10 transition-colors">Catatan →</a>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
