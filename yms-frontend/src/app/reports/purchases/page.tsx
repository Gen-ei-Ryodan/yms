"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import axios from "axios";
import { Loader2, Download, ShoppingCart, DollarSign, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { ClientDate } from "@/components/ClientDate";

export default function PurchaseReportPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filterCourse, setFilterCourse] = useState("");
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    axios.get("/courses").then((r) => setCourses(r.data.data));
  }, []);

  useEffect(() => {
    const params: any = {};
    if (filterCourse) params.course_id = filterCourse;
    axios.get("/reports/purchases", { params })
      .then((r) => setData(r.data.data))
      .finally(() => setLoading(false));
  }, [filterCourse]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96 bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0B1526]/10 border-t-[#C9A227]" />
            <div className="text-center">
              <p className="text-sm font-semibold text-[#0B1526]">Memuat laporan pembelian...</p>
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
              <span className="text-[#C9A227] text-sm font-semibold tracking-wide">Laporan Pembelian</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">Laporan Pembelian</h1>
            <p className="text-white/60 text-lg">Rekapitulasi data pembelian produk</p>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm p-4 flex gap-4 flex-wrap items-center">
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}
            className="h-11 px-4 rounded-xl border border-[#0B1526]/10 bg-[#F5F2EB]/50 text-sm focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/30">
            <option value="">Semua Program</option>
            {courses.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button variant="outline" className="h-11 rounded-xl border-[#0B1526]/10 hover:bg-[#C9A227]/10 hover:border-[#C9A227]/30 hover:text-[#C9A227]">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
        </div>

        {/* Empty State */}
        {!data && !loading && (
          <div className="flex flex-col items-center gap-3 py-12">
            <div className="h-14 w-14 rounded-2xl bg-[#F5F2EB] flex items-center justify-center">
              <BarChart3 className="h-7 w-7 text-[#8A93A3]" />
            </div>
            <p className="text-[#5B6472] font-medium">Tidak ada data laporan pembelian</p>
            <p className="text-[#8A93A3] text-sm">Data laporan tidak tersedia atau terjadi kesalahan saat memuat data.</p>
          </div>
        )}

        {data && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500 shadow-lg">
                    <ShoppingCart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Total Pembelian</p>
                    <p className="text-2xl font-bold text-[#0B1526]">{data.total_purchases}</p>
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-2xl bg-white border border-[#0B1526]/5 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500 shadow-lg">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8A93A3] font-medium">Total Nilai</p>
                    <p className="text-2xl font-bold text-[#0B1526]">{formatCurrency(data.total_value)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-[#0B1526]/5 shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F5F2EB]">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Tanggal</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Siswa</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Produk</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Program</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Harga</th>
                    <th className="text-left p-4 font-semibold text-[#0B1526]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.details?.map((d: any, i: number) => (
                    <tr key={i} className={`border-t border-[#0B1526]/5 hover:bg-[#C9A227]/5 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-[#F5F2EB]/30'}`}>
                      <td className="p-4 text-[#5B6472]">{d.date}</td>
                      <td className="p-4 font-semibold text-[#0B1526]">{d.student}</td>
                      <td className="p-4 text-[#5B6472]">{d.product}</td>
                      <td className="p-4 text-[#5B6472]">{d.course}</td>
                      <td className="p-4 font-semibold text-[#0B1526]">{formatCurrency(d.amount)}</td>
                      <td className="p-4">
                        <Badge className={d.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800 font-medium" : "bg-[#F5F2EB] text-[#5B6472] font-medium"}>{d.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
}
