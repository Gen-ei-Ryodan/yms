"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { SlidePanel } from "@/components/SlidePanel";
import axios from "axios";
import { Loader2, Search, Eye, GraduationCap, Calendar, School, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function StudentHistoryPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Siswa</h1>
          <p className="text-sm text-gray-500 mt-1">View student history and details</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search students..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left p-3 font-medium">Kode</th>
                <th className="text-left p-3 font-medium">Nama</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Masuk</th>
                <th className="text-left p-3 font-medium">Membership</th>
                <th className="text-right p-3 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-gray-200 hover:bg-gray-50">
                  <td className="p-3 font-mono text-xs">{s.student_code}</td>
                  <td className="p-3 font-medium">{s.full_name}</td>
                  <td className="p-3"><Badge className={getStatusColor(s.status)}>{s.status}</Badge></td>
                  <td className="p-3"><ClientDate date={s.join_date} format="date" /></td>
                  <td className="p-3">{s.membership_status || "N/A"}</td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="icon" onClick={() => { setSelectedStudent(s); setShowPanel(true); }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SlidePanel open={showPanel} onClose={() => setShowPanel(false)} title="Riwayat Siswa">
        {selectedStudent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold">{selectedStudent.full_name}</h3>
              <p className="text-gray-500">{selectedStudent.student_code}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-gray-500">Status</p><Badge className={getStatusColor(selectedStudent.status)}>{selectedStudent.status}</Badge></div>
              <div><p className="text-xs text-gray-500">Masuk</p><p className="font-medium"><ClientDate date={selectedStudent.join_date} format="date" /></p></div>
              <div><p className="text-xs text-gray-500">Gender</p><p className="font-medium">{selectedStudent.gender}</p></div>
              <div><p className="text-xs text-gray-500">Lahir</p><p className="font-medium">{selectedStudent.place_of_birth}, {selectedStudent.date_of_birth}</p></div>
              <div><p className="text-xs text-gray-500">HP</p><p className="font-medium">{selectedStudent.phone || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Email</p><p className="font-medium">{selectedStudent.email || "N/A"}</p></div>
              <div className="col-span-2"><p className="text-xs text-gray-500">Alamat</p><p className="font-medium">{selectedStudent.address || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Sekolah</p><p className="font-medium">{selectedStudent.school_name || "N/A"}</p></div>
              <div><p className="text-xs text-gray-500">Kelas</p><p className="font-medium">{selectedStudent.school_grade || "N/A"}</p></div>
            </div>
          </div>
        )}
      </SlidePanel>
    </MainLayout>
  );
}
