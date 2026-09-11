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
          <h1 className="text-2xl font-bold text-gray-900">Daftar Murid</h1>
          <p className="text-sm text-gray-500 mt-1">Murid dari kelas yang Anda ajar</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Cari nama murid..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        {classes.map((cls) => {
          const students = (cls.enrollments || []).map((e: any) => e.student).filter(Boolean);
          const filtered = search ? students.filter((s: any) => s.full_name?.toLowerCase().includes(search.toLowerCase())) : students;
          if (filtered.length === 0) return null;
          return (
            <div key={cls.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <h2 className="font-semibold text-gray-900">{cls.class_code}</h2>
                <p className="text-sm text-gray-500">{cls.course?.name} {cls.level?.name}</p>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-3 font-medium w-8">#</th>
                    <th className="text-left p-3 font-medium">Nama</th>
                    <th className="text-left p-3 font-medium">Program</th>
                    <th className="text-left p-3 font-medium">Level</th>
                    <th className="text-right p-3 font-medium">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((s: any, i: number) => (
                    <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="p-3 text-gray-500">{i + 1}</td>
                      <td className="p-3 font-medium">{s.full_name}</td>
                      <td className="p-3">{cls.course?.name}</td>
                      <td className="p-3">{cls.level?.name}</td>
                      <td className="p-3 text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent({ ...s, class_code: cls.class_code, course: cls.course?.name, level: cls.level?.name }); setShowPanel(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
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
          <div className="space-y-4">
            <h3 className="text-xl font-bold">{selectedStudent.full_name}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Program</p><p className="font-medium">{selectedStudent.course}</p></div>
              <div><p className="text-xs text-gray-500">Level</p><p className="font-medium">{selectedStudent.level}</p></div>
              <div><p className="text-xs text-gray-500">Kelas</p><p className="font-medium">{selectedStudent.class_code}</p></div>
              <div><p className="text-xs text-gray-500">Status</p><Badge className="bg-green-100 text-green-700">Aktif</Badge></div>
            </div>
            <div className="flex gap-2 pt-2">
              <a href={`/student-progress?student_id=${selectedStudent.id}`} className="text-sm text-blue-600 hover:underline">Progress →</a>
              <a href={`/student/attendance-history?student_id=${selectedStudent.id}`} className="text-sm text-blue-600 hover:underline">Absensi →</a>
              <a href={`/learning-notes?student_id=${selectedStudent.id}`} className="text-sm text-blue-600 hover:underline">Catatan →</a>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
