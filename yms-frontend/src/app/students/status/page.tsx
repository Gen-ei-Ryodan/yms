"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { StatCard } from "@/components/StatCard";
import axios from "axios";
import {
  Search,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Users,
  GraduationCap,
  UserX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getStatusColor, getInitials } from "@/lib/utils";

interface Student {
  id: number;
  student_code: string;
  full_name: string;
  status: string;
  join_date: string;
}

export default function StudentStatusPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 15;

  const fetchStudents = async () => {
    try {
      const response = await axios.get("/students", {
        params: { search, per_page: 50 },
      });
      setStudents(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / perPage));
    } catch (error) {
      console.error("Failed to fetch students:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  const updateStatus = async (id: number, status: string) => {
    await axios.put(`/students/${id}`, { status });
    fetchStudents();
  };

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === "ACTIVE").length;
  const inactiveStudents = students.filter(
    (s) => s.status !== "ACTIVE"
  ).length;

  const paginatedStudents = students.slice((page - 1) * perPage, page * perPage);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]"></div>
              <CheckCircle className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 text-[#0B1526]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">
                Memuat data siswa...
              </p>
              <p className="text-xs text-[#8A93A3] mt-1">
                Mohon tunggu sebentar
              </p>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0B1526] via-[#14233B] to-[#0B1526] rounded-2xl p-8 text-white shadow-2xl shadow-[#0B1526]/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C9A227]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#C9A227]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-[#C9A227] rounded-full" />
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">
                Status Siswa
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Student Status</h1>
            <p className="text-white/60 text-lg">
              Kelola status seluruh siswa Yamaha Music School
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Siswa"
            value={totalStudents}
            icon={Users}
            color="blue"
          />
          <StatCard
            title="Aktif"
            value={activeStudents}
            icon={GraduationCap}
            color="green"
          />
          <StatCard
            title="Tidak Aktif"
            value={inactiveStudents}
            icon={UserX}
            color="red"
          />
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8A93A3]" />
            <Input
              placeholder="Cari berdasarkan nama atau kode siswa..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-11 h-11 bg-[#F5F2EB]/50 border-[#0B1526]/10 focus:border-[#C9A227] focus:ring-[#C9A227]/30"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#0B1526]/5">
            <h2 className="text-lg font-bold text-[#0B1526]">
              Daftar Siswa
            </h2>
            <p className="text-sm text-[#8A93A3] mt-0.5">
              {students.length} siswa terdaftar
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#0B1526]/5">
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Siswa
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Kode
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Status
                  </th>
                  <th className="text-left p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Tanggal Masuk
                  </th>
                  <th className="text-right p-4 font-semibold text-[#0B1526] bg-[#F5F2EB]/30">
                    Ubah Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-[#0B1526]/5 hover:bg-[#F5F2EB]/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#0B1526] to-[#14233B] flex items-center justify-center shadow-sm">
                          <span className="text-sm font-bold text-[#C9A227]">
                            {getInitials(student.full_name)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-[#0B1526]">
                            {student.full_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 bg-[#0B1526]/5 rounded-lg font-mono text-xs text-[#5B6472]">
                        {student.student_code}
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(student.status)}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-[#5B6472]">{student.join_date}</td>
                    <td className="p-4 text-right">
                      <select
                        value={student.status}
                        onChange={(e) =>
                          updateStatus(student.id, e.target.value)
                        }
                        className="px-3 py-2 pr-8 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-xs font-medium text-[#0B1526] focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30 appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20width%3d%2224%22%20height%3d%2224%22%20viewBox%3d%220%200%2024%2024%22%20fill%3d%22none%22%20stroke%3d%22%238A93A3%22%20stroke-width%3d%222%22%20stroke-linecap%3d%22round%22%20stroke-linejoin%3d%22round%22%3e%3cpolyline%20points%3d%226%209%2012%2015%2018%209%22%3e%3c%2fpolyline%3e%3c%2fsvg%3e')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:1rem]"
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                        <option value="GRADUATED">GRADUATED</option>
                        <option value="TRANSFERRED">TRANSFERRED</option>
                      </select>
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
                Menampilkan{" "}
                <span className="font-semibold text-[#0B1526]">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                -{" "}
                <span className="font-semibold text-[#0B1526]">
                  {Math.min(page * perPage, students.length)}
                </span>{" "}
                dari{" "}
                <span className="font-semibold text-[#0B1526]">
                  {students.length}
                </span>{" "}
                siswa
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#0B1526]/10"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant="outline"
                      size="sm"
                      className={`h-9 border-[#0B1526]/10 ${
                        page === pageNum
                          ? "bg-[#0B1526] text-white hover:bg-[#14233B]"
                          : ""
                      }`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 border-[#0B1526]/10"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
