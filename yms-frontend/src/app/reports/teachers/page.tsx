"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Download, BookOpen, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

export default function TeacherReportPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/reports/teachers")
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat laporan guru...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Laporan Guru</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Laporan Guru</h1>
            <p className="text-white/60 text-lg">Performa dan rekapitulasi data guru</p>
          </div>
        </div>

        {/* Empty State */}
        {data.length === 0 && !loading && (
          <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
            <div className="flex flex-col items-center gap-3 py-12">
              <div className="h-14 w-14 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
                <BarChart3 className="h-7 w-7 text-[#8A93A3]" />
              </div>
              <p className="text-[#5B6472] font-medium">Tidak ada data laporan guru</p>
              <p className="text-[#8A93A3] text-sm">Data laporan guru tidak tersedia atau terjadi kesalahan saat memuat data.</p>
            </div>
          </div>
        )}

        {/* Table */}
        {data.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-[#F5F2EB]">
              <tr>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Guru</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kode</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Spesialisasi</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kelas Aktif</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Total Murid</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Sesi</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Kehadiran</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Total Gaji</th>
                <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.map((t, i) => (
                <tr key={t.teacher_code} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#0B1526]/10 flex items-center justify-center">
                        <BookOpen className="h-4 w-4 text-[#0B1526]" />
                      </div>
                      <span className="font-semibold text-[#0B1526]">{t.name}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-[#5B6472]">{t.teacher_code}</td>
                  <td className="p-4 text-[#5B6472]">{t.specialization}</td>
                  <td className="p-4 text-[#5B6472]">{t.active_classes}</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{t.total_students}</td>
                  <td className="p-4 text-[#5B6472]">{t.total_sessions}</td>
                  <td className="p-4 text-[#5B6472]">{t.attendance_rate}%</td>
                  <td className="p-4 font-semibold text-[#0B1526]">{formatCurrency(t.total_salary_paid)}</td>
                  <td className="p-4">
                    <Badge className={t.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800 font-medium" : "bg-[#F5F2EB] text-[#5B6472] font-medium"}>{t.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
    </MainLayout>
  );
}
